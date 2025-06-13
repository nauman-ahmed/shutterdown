const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const BackupModel = require("../models/Backup");
const dayjs = require('dayjs')
require('dotenv').config();

// Load Google API credentials
const credentials = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
};

/**
 * Authorize Google Drive API
 */
const authorizeGoogleDrive = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
        console.log('auth completed');
        return auth.getClient();
    } catch (error) {
        console.log('Authorization error:', error);
        throw error;
    }
};

/**
 * Create a backup folder in Google Drive if it doesn't exist
 * @param {object} drive - Google Drive API instance
 * @returns {Promise<string>} - Folder ID
 */
const createBackupFolder = async (drive) => {
    try {
        const folderMetadata = {
            name: 'MongoDB Backups',
            mimeType: 'application/vnd.google-apps.folder'
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id'
        });

        console.log(`Created backup folder with ID: ${folder.data.id}`);
        return folder.data.id;
    } catch (error) {
        console.error('Error creating backup folder:', error);
        throw error;
    }
};

/**
 * Check if a folder exists and is accessible
 * @param {object} drive - Google Drive API instance
 * @param {string} folderId - Folder ID to check
 * @returns {Promise<boolean>} - Whether folder exists and is accessible
 */
const checkFolderExists = async (drive, folderId) => {
    try {
        await drive.files.get({
            fileId: folderId,
            fields: 'id,name'
        });
        return true;
    } catch (error) {
        if (error.code === 404) {
            console.log(`Folder ${folderId} not found`);
            return false;
        }
        console.error('Error checking folder:', error);
        return false;
    }
};

/**
 * Upload File to Google Drive
 * @param {string} filePath - Local file path
 * @returns {Promise<void>}
 */
const uploadToGoogleDrive = async (filePath) => {
    try {
        const auth = await authorizeGoogleDrive();
        console.log('after authorize');

        const drive = google.drive({ version: "v3", auth });
        
        // The problematic folder ID from your code
        const originalFolderId = '14GqlsC6wgufsizP-qvw4O_dIBlQaWocQ';
        let parentFolderId = null;

        // Check if the original folder exists
        const folderExists = await checkFolderExists(drive, originalFolderId);
        
        if (folderExists) {
            parentFolderId = originalFolderId;
            console.log('Using existing folder');
        } else {
            console.log('Original folder not accessible, creating new backup folder');
            parentFolderId = await createBackupFolder(drive);
        }

        const fileMetadata = {
            name: path.basename(filePath),
            parents: [parentFolderId]
        };
        console.log('media creating');

        const media = {
            mimeType: "application/gzip",
            body: fs.createReadStream(filePath),
        };
        console.log('creating files');

        const res = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: "id",
        });

        console.log(`Backup uploaded to Google Drive with file ID: ${res.data.id}`);
        
        // Save backup info to database
        const newbackup = new BackupModel({ 
            fileId: res.data.id, 
            date: dayjs(new Date()).format('YYYY-MM-DD'), 
            fileName: path.basename(filePath),
            parentFolderId: parentFolderId
        });
        await newbackup.save();
        
        await setFilePermissions(res.data.id);
        
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw error;
    }
};

/**
 * Backup MongoDB Database and Upload to Google Drive
 * @param {string} dbName - The name of the database
 * @param {string} backupPath - Directory to temporarily store the backup
 * @returns {Promise<void>}
 */
const backupDatabaseToGoogleDrive = async (dbName, backupPath) => {
    const date = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(backupPath, `backup-${date}.gz`);

    // Install mongodump before performing the backup
    const installCommand = `curl -fsSL https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.7.0.tgz | tar -xz && mkdir -p /tmp/mongodb-tools && mv mongodb-database-tools-*/bin/mongodump /tmp/mongodb-tools/ && chmod +x /tmp/mongodb-tools/mongodump`;

    const command = `/tmp/mongodb-tools/mongodump --db=${dbName} --archive=${backupFile} --gzip`;

    return new Promise((resolve, reject) => {
        console.log(`Starting mongodump installation...`);

        // Install mongodump
        exec(installCommand, (installError, installStdout, installStderr) => {
            if (installError) {
                console.error(`Mongodump installation failed: ${installStderr}`);
                return reject(installError);
            }
            console.log(`Mongodump installed successfully: ${installStdout}`);

            console.log(`Starting backup: ${backupFile}`);
            exec(command, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Backup failed: ${stderr}`);
                    return reject(error);
                }
                console.log(`Backup created: ${stdout}`);
                try {
                    await uploadToGoogleDrive(backupFile);
                    // Cleanup local backup file after upload
                    if (fs.existsSync(backupFile)) {
                        fs.unlinkSync(backupFile);
                    }
                    console.log('Backup and upload to Google Drive completed!');
                    resolve();
                } catch (uploadError) {
                    console.error("Error uploading backup to Google Drive:", uploadError);
                    // Still cleanup the local file even if upload fails
                    if (fs.existsSync(backupFile)) {
                        fs.unlinkSync(backupFile);
                    }
                    reject(uploadError);
                }
            });
        });
    });
};

/**
 * Set file permissions on Google Drive
 * @param {string} fileId - The ID of the file
 * @returns {Promise<void>}
 */
const setFilePermissions = async (fileId) => {
    try {
        const auth = await authorizeGoogleDrive();
        const drive = google.drive({ version: "v3", auth });

        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        console.log(`Permissions updated for file ID: ${fileId}`);
    } catch (error) {
        console.error(`Error setting permissions for file ${fileId}:`, error);
        // Don't throw error here as the file upload was successful
    }
};

module.exports = { backupDatabaseToGoogleDrive };
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
            scopes: ["https://www.googleapis.com/auth/drive"],
        });
        console.log('auth completed');
        return auth.getClient();
    } catch (error) {
        console.log('Authorization error:', error);
        throw error;
    }
};

// createBackupFolder was removed deliberately. When the configured folder was
// unreachable it silently created a different one in the service account's own
// Drive, so a misconfigured destination looked like a working backup. The
// destination is now asserted up front and a bad one fails loudly.

/**
 * Verify the configured backup destination is a shared drive the service
 * account can actually write to. Throws with a actionable message otherwise.
 *
 * A service account owns any file it creates and has no storage quota of its
 * own, so uploading into a regular My Drive folder - even one shared with it -
 * always fails with storageQuotaExceeded. Only a shared drive works, because
 * there the drive owns the files rather than the creator.
 *
 * @param {object} drive - Google Drive API instance
 * @param {string} folderId - Destination folder ID
 */
const assertBackupFolder = async (drive, folderId) => {
    if (!folderId) {
        throw new Error("GOOGLE_BACKUP_FOLDER_ID is not set - nowhere to upload the backup to.");
    }

    let data;
    try {
        ({ data } = await drive.files.get({
            fileId: folderId,
            fields: "id,name,driveId",
            supportsAllDrives: true
        }));
    } catch (error) {
        if (error.code === 404) {
            throw new Error(
                `Backup folder ${folderId} not found. Share the shared drive with ` +
                `${credentials.client_email} as Content manager, or correct GOOGLE_BACKUP_FOLDER_ID.`
            );
        }
        throw error;
    }

    if (!data.driveId) {
        throw new Error(
            `Backup folder "${data.name}" (${folderId}) is a regular My Drive folder, not a shared drive. ` +
            `A service account cannot own files, so uploads there fail with storageQuotaExceeded. ` +
            `Create a shared drive, add ${credentials.client_email} as Content manager, and set ` +
            `GOOGLE_BACKUP_FOLDER_ID to its id (shared drive ids start with "0A").`
        );
    }

    console.log(`Backup destination verified: shared drive folder "${data.name}"`);
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
        
        const parentFolderId = process.env.GOOGLE_BACKUP_FOLDER_ID;
        await assertBackupFolder(drive, parentFolderId);

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
            supportsAllDrives: true,
        });

        console.log(`Backup uploaded to Google Drive with file ID: ${res.data.id}`);
        
        // Save backup info to database
        const newbackup = new BackupModel({
            fileId: res.data.id,
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            fileName: path.basename(filePath),
        });
        await newbackup.save();

        return res.data.id;
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
    const mongoUri = 'mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown';
    const command = `/tmp/mongodb-tools/mongodump --uri="${mongoUri}" --archive=${backupFile} --gzip`;

    //const command = `/tmp/mongodb-tools/mongodump --db=${dbName} --archive=${backupFile} --gzip`;

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

// setFilePermissions was removed deliberately. It granted every uploaded backup
// `role: reader, type: anyone`, making a full database export of client and
// staff records readable by anyone holding the link. Access is now governed by
// shared drive membership instead.

module.exports = { backupDatabaseToGoogleDrive };
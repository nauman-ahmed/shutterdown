const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const BackupModel = require("../models/Backup");
const dayjs = require('dayjs')

// Load Google API credentials
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

/**
 * Authorize Google Drive API
 */
const authorizeGoogleDrive = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
        console.log('auth completed');
        
        return auth.getClient();
    } catch (error) {
        console.log(error);
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
    const fileMetadata = {
        name: path.basename(filePath),
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
    console.log(res);
    
    console.log(`Backup uploaded to Google Drive with file ID: ${res.data.id}`);
    const newbackup = new BackupModel({ fileId: res.data.id, date: dayjs(new Date()).format('YYYY-MM-DD') })
    await newbackup.save()
    await setFilePermissions(res.data.id);
} catch (error) {
        console.log(error);       
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

    const command = `mongodump --db=${dbName} --archive=${backupFile} --gzip`;

    return new Promise((resolve, reject) => {
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
                fs.unlinkSync(backupFile);
                resolve();
            } catch (uploadError) {
                console.error("Error uploading backup to Google Drive:", uploadError);
                reject(uploadError);
            }
        });
    });
};



/**
 * Set file permissions on Google Drive
 * @param {string} fileId - The ID of the file
 * @returns {Promise<void>}
 */
const setFilePermissions = async (fileId) => {
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
};


module.exports = { backupDatabaseToGoogleDrive };

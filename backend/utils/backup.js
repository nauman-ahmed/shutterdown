const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

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
    const auth = await authorizeGoogleDrive();
    console.log('after authorize');

    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = {
        name: path.basename(filePath),
    };
    const media = {
        mimeType: "application/gzip",
        body: fs.createReadStream(filePath),
    };

    const res = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: "id",
    });
    console.log(`Backup uploaded to Google Drive with file ID: ${res.data.id}`);
    await setFilePermissions(res.data.id);

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
            role: "writer", // or "reader"
            type: "user",
            emailAddress: "iamsafdarawan@gmail.com", // Replace with the desired email
        },
    });
    

    console.log(`Permissions updated for file ID: ${fileId}`);
};


module.exports = { backupDatabaseToGoogleDrive };

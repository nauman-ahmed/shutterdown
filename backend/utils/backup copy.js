const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const BackupModel = require("../models/Backup");
const dayjs = require('dayjs')
require('dotenv').config();

const SCOPE = ['https://www.googleapis.com/auth/drive'];

const private_key = process.env.NEW_PRIVATE_KEY.replace(/\\n/g, '\n')
const client_email = process.env.NEW_CLIENT_EMAIL

const authorizeGoogleDrive = async () => {
    try {
        const jwtClient = new google.auth.JWT(
            client_email,
            null,
            private_key,
            SCOPE
        );
        await jwtClient.authorize();
        return jwtClient;

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
            parents:['14GqlsC6wgufsizP-qvw4O_dIBlQaWocQ']
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
        const newbackup = new BackupModel({ fileId: res.data.id, date: dayjs(new Date()).format('YYYY-MM-DD'), fileName: filePath })
        await newbackup.save()
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

    // Install mongodump before performing the backup
    const installCommand = `curl -fsSL https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.7.0.tgz | tar -xz && mkdir -p /tmp/mongodb-tools && mv mongodb-database-tools-*/bin/mongodump /tmp/mongodb-tools/ && chmod +x /tmp/mongodb-tools/mongodump`;

    const command = `/tmp/mongodb-tools/mongodump --uri="mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown" --archive=${backupFile} --gzip`;

    // const command = `/tmp/mongodb-tools/mongodump --db=${dbName} --archive=${backupFile} --gzip`;

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
            
                // Check if the file actually exists
                if (!fs.existsSync(backupFile)) {
                    console.error(`Backup file not found: ${backupFile}`);
                    return reject(new Error("Backup file creation failed."));
                }
            
                try {
                    await uploadToGoogleDrive(backupFile);
                    fs.unlinkSync(backupFile); // Remove file after upload
                    resolve();
                } catch (uploadError) {
                    console.error("Error uploading backup to Google Drive:", uploadError);
                    reject(uploadError);
                }
            });
        });
    });
};

module.exports = { backupDatabaseToGoogleDrive };

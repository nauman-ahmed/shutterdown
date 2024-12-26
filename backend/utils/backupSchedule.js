const cron = require("node-cron");
const { backupDatabaseToGoogleDrive } = require("./backup");

module.exports.applyBackupSchedule = () => {
    console.log('schedule applied');
    
    cron.schedule("0 0 * * 0", async () => {
        // Runs weekly sunday
        try {
            backupDatabaseToGoogleDrive("shutterDown", "/tmp")
                .then(() => console.log("Backup and upload to Google Drive completed!"))
                .catch((err) => console.error("Error during backup and upload:", err));
        } catch (error) {
            console.error("Error during baclup and saving ", error);
        }
    });
}

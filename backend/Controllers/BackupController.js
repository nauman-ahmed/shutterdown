const userModel = require("../models/userSchema");
const AttendenceSchema = require("../models/AttendenceSchema");
const AttendaceModel = require("../models/AttendenceSchema");
const cron = require("node-cron");
const BackupModel = require("../models/Backup");
const { backupDatabaseToGoogleDrive } = require("../utils/backup");



const makeNewBackup = async (req, res) => {
    try {
        await backupDatabaseToGoogleDrive("shutterDown", "/tmp") 
            .then(() => console.log("Backup and upload to Google Drive completed!"))
            .catch((err) => console.error("Error during backup and upload:", err));
        const recentBackup = await BackupModel.findOne().sort({ date: -1 });
        res.status(200).json(recentBackup);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const checkOutUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentDate = new Date();
        const dateOnly = currentDate.toLocaleDateString();
        const checkedIn = await AttendaceModel.findOne({
            userID: userId,
            currentDate: dateOnly,
        });
        if (checkedIn && checkedIn.checkInTime != "Not Marked") {
            if (checkedIn.checkOutTime == "Not Marked") {
                checkedIn.checkOutTime = new Date();
                await checkedIn.save();
                res.status(200).json({ message: "Checked out successfully!" });
            } else {
                res.status(303).json({ message: "You are already checkout Out!" });
            }
        } else {
            res.status(303).json({ message: "Please check in first!" });
        }
    } catch (error) {
        console.log(error);
    }
};

const getRecentBackup = async (req, res) => {
    try {
        const recentBackup = await BackupModel.findOne().sort({ date: -1 });
        res.status(200).json(recentBackup);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getUserAttendace = async (req, res) => {
    try {
        const userId = req.params.userId;
        const attendaces = await AttendaceModel.find({ userID: userId });

        res.status(200).json(attendaces);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    getUserAttendace,
    getRecentBackup,
    makeNewBackup,
    checkOutUser,
};

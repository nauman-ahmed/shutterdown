const express = require('express');
const router = express.Router();
const AttendenceController = require('../Controllers/AttendenceController');
const BackupController = require("../Controllers/BackupController")

router.post('/newBackup',BackupController.makeNewBackup)
router.post('/MyProfile/Attendence/checkOut/:userId',AttendenceController.checkOutUser)
router.get('/MyProfile/Attendence/userAttendace/:userId',AttendenceController.getUserAttendace)
router.get('/recentBackup',BackupController.getRecentBackup)


module.exports = router;

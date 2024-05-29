const express = require('express');
const router = express.Router();
const AttendenceController = require('../Controllers/AttendenceController');

router.post('/MyProfile/Attendence/checkIn/:userId',AttendenceController.checkInUser)
router.post('/MyProfile/Attendence/checkOut/:userId',AttendenceController.checkOutUser)
router.get('/MyProfile/Attendence/userAttendace/:userId',AttendenceController.getUserAttendace)
router.get('/MyProfile/AttendenceSettings/:id',AttendenceController.getAttendenceData)


module.exports = router;

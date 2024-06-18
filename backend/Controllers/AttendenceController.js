const userModel = require('../models/userSchema')
const AttendenceSchema = require('../models/AttendenceSchema')
const AttendaceModel = require('../models/AttendenceSchema');
const cron = require('node-cron');

cron.schedule('55 23 * * *', async () => { // Runs at 12:00 AM daily
    try {
        const currentDate = new Date()
        const dateOnly = currentDate.toLocaleDateString();
        const uncheckedUsers = await AttendaceModel.find({
            currentDate: dateOnly, // Find employees who are checked in but not out
            checkOutTime: 'Not Marked',
        });

        for (const unchecked of uncheckedUsers) {
            unchecked.checkOutTime = new Date();
            await unchecked.save();
        }
    } catch (error) {
        console.error('Error during automatic checkout:', error);
    }
});


const checkInUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentDate = new Date()
        const dateOnly = currentDate.toLocaleDateString();
        const alreadyCheckedIn = await AttendaceModel.findOne({ userID: userId, currentDate: dateOnly });
        if (alreadyCheckedIn) {
            res.status(303).json({ message: 'user already checked In!' })
        } else {
            let notAtHome;
            if(req.body.data == null){
                notAtHome = {
                    userID: userId,
                    currentDate: dateOnly,
                    checkInTime: new Date()
                }
            }else{
                notAtHome = {
                    userID: userId,
                    currentDate: dateOnly,
                    checkInTime: new Date(),
                    fromHome:true
                }
            }
            const newCheckIn = new AttendaceModel(notAtHome);
            await newCheckIn.save();
            res.status(200).json({ message: 'Checked In successfully!' })
        }
    } catch (error) {
        console.log(error);
    }
}
const checkOutUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentDate = new Date()
        const dateOnly = currentDate.toLocaleDateString();
        const checkedIn = await AttendaceModel.findOne({ userID: userId, currentDate: dateOnly });
        if (checkedIn && checkedIn.checkInTime != 'Not Marked') {
            if (checkedIn.checkOutTime == 'Not Marked') {

                checkedIn.checkOutTime = new Date();
                await checkedIn.save();
                res.status(200).json({ message: 'Checked out successfully!' })
            } else {
                res.status(303).json({ message: 'You are already checkout Out!' })

            }
        } else {
            res.status(303).json({ message: 'Please check in first!' })
        }
    } catch (error) {
        console.log(error);
    }
}


const getAttendenceData = async (req, res) => {
    try {
        const allData=await AttendenceSchema.find()
        res.status(200).json(allData)

    } catch (error) {
        res.status(500).json(error)
    }
}
const getUserAttendace = async (req, res) => {
    try {
        const userId = req.params.userId;
        const attendaces = await AttendaceModel.find({ userID: userId });

        res.status(200).json(attendaces)

    } catch (error) {
        res.status(500).json(error)
    }
}



module.exports = {getUserAttendace, getAttendenceData, checkInUser, checkOutUser } 
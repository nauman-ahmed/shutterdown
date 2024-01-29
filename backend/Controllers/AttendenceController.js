const userModel = require('../models/userSchema')
const AttendenceSchema = require('../models/AttendenceSchema')
const AttendaceModel = require('../models/AttendenceSchema');

const EditorData = async (req, res) => {
    try {
        const AttendenceData = await userModel.find({ rollSelect: "Shooter" })
        const AttendenceEditorData = await userModel.find({ rollSelect: "Editor" })
        res.status(200).json({ AttendenceData: AttendenceData, AttendenceEditorData: AttendenceEditorData })
    } catch (error) {
        res.status(500).json(error)
    }
}
const checkInUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentDate = new Date()
        const dateOnly = currentDate.toLocaleDateString();
        const alreadyCheckedIn =await AttendaceModel.findOne({userID : userId, currentDate : dateOnly});
        console.log(alreadyCheckedIn);
        if(alreadyCheckedIn){
            res.status(303).json({message : 'user already checked In!'})
        }else {
            const newCheckIn = new AttendaceModel({
                userID : userId,
                currentDate : dateOnly,
                checkInTime : new Date()
            });
            await newCheckIn.save();
            res.status(200).json({message : 'Checked In successfully!'})
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
        const checkedIn =await AttendaceModel.findOne({userID : userId, currentDate : dateOnly});
        if(checkedIn && checkedIn.checkInTime != 'Not Marked'){
            if(checkedIn.checkOutTime == 'Not Marked'){

                checkedIn.checkOutTime = new Date();
                await checkedIn.save();
                res.status(200).json({message : 'Checked out successfully!'})
            }else {
            res.status(303).json({message : 'You are already checkout Out!'})

            }
        }else {
            res.status(303).json({message : 'Please check in first!'})
        }
    } catch (error) {
        console.log(error);
    }
}

const PostAttendenceData = async (req, res) => {
    // const array=[req.body.data.daysSelected]
    try {

        const currentDate = new Date()
        const dateOnly = currentDate.toLocaleDateString();

        const CheckInTimeSettings = await AttendenceSchema.find({
            currentDate: dateOnly
        })

        console.log("saved", req.body.data)

        if (CheckInTimeSettings.length === 0) {

            if (req.body.data.timing === "CheckIn") {
                const UserAttendenceData = await AttendenceSchema({
                    userID: req.body.data.userId,
                    checkInTimeSettings: currentDate,
                    currentDate: dateOnly
                })
                const saved = await UserAttendenceData.save()
            }

            if (req.body.data.timing === "CheckOut") {
                const UserAttendenceData = await AttendenceSchema({
                    userID: req.body.data.userId,
                    checkOutTimeSettings: currentDate,
                    currentDate: dateOnly
                })
                const saved = await UserAttendenceData.save()

            }


        } else {
            if (req.body.data.timing === "CheckIn") {

                await AttendenceSchema.findOneAndUpdate({
                    currentDate: dateOnly
                }, {
                    $set: {
                        checkInTimeSettings: currentDate,
                    }
                })
            }

            if (req.body.data.timing === "CheckOut") {
                await AttendenceSchema.findOneAndUpdate({
                    currentDate: dateOnly
                }, {
                    $set: {
                        checkOutTimeSettings: currentDate,
                    }
                })

            }

        }
    } catch (error) {
        console.log("error", error)

    }
}

const getAttendenceData = async (req, res) => {
    try {
        // const allData=await AttendenceSchema.find({userID:req.params.id})
        // res.status(200).json(allData)

    } catch (error) {
        res.status(500).json(error)
    }
}
const getUserAttendace = async (req, res) => {
    try {
        const userId = req.params.userId;
        const attendaces = await AttendaceModel.find({userID : userId});

        res.status(200).json(attendaces)

    } catch (error) {
        res.status(500).json(error)
    }
}

const managerAttendenceData = async (req, res) => {
    try {
        const AttendenceData = await AttendenceSchema.find({
            userID: req.params.id
        })
        // const ShooterData=await userModel.find({rollSelect:"Shooter"})
        // const EditorData=await userModel.find({rollSelect:"Editor"})
        console.log(req.params.id, AttendenceData)
        res.status(200).json({ AttendenceData: AttendenceData })
    } catch (error) {

    }
}

module.exports = { EditorData,getUserAttendace, PostAttendenceData, getAttendenceData,checkInUser, checkOutUser, managerAttendenceData } 
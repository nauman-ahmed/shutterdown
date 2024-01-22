const ShooterEditorModel = require('../models/EditorShooterAttendenceSchema');

const EditorShooterData = async (req, res) => {
  try {
    const ShooterEditorDatas = await ShooterEditorModel.find({
      UserID: req.body.data.userID,
    });
    
      const AttendenceData = await ShooterEditorModel({
        Shooter: req.body.data.shooter,
        Editor: req.body.data.Editor,
        CheckIncurrentTime: req.body.data.currentTime,
        CheckIncurrentDate: req.body.data.currentDate,
        CheckOutCurrentTime: req.body.data.checkoutCurrentDate,
        CheckOutCurrentDate: req.body.data.checkOutCurrentDate,
        UserID: req.body.data.userID,
      });
      await AttendenceData.save();
    
  } catch (error) {}
};
const EditorShooterCheckOutTime = async (req, res) => {
  try {
    const ShooterEditorData = await ShooterEditorModel.findOneAndUpdate(
      { UserID: req.params.id },
      {
        Shooter: req.body.data.shooter,
        Editor: req.body.data.Editor,
        CheckIncurrentTime: req.body.data.currentTime,
        CheckIncurrentDate: req.body.data.currentDate,
        CheckOutCurrentTime: req.body.data.CheckoutCurrentTime,
        CheckOutCurrentDate: req.body.data.CheckoutCurrentDate,
        UserID: req.body.data.userID,
      }
    );
  } catch (error) {}
};

const handleSaveGetRequest = async (req, res) => {
  try {
    const AttendenceData = await ShooterEditorModel.find({
      UserID: req.params.id,
      Shooter: 'true',
    });
    const EditorAttendenceData = await ShooterEditorModel.find(
      { UserID: req.params.id, Editor: 'true' },
     
    );
    res
      .status(200)
      .json({ shooter: AttendenceData, Editor: EditorAttendenceData });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  EditorShooterData,
  EditorShooterCheckOutTime,
  handleSaveGetRequest,
};

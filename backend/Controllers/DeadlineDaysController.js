const deadlineDaysModel = require("../models/DeadlineDays");

const getDeadlineDays = async (req, res) => {
  try {
    const DeadlineDays = await deadlineDaysModel.find();
    res.status(200).json(DeadlineDays[0]);
  } catch (error) {
    console.log(error);
  }
};

const updateDeadlineDays = async (req, res) => {
  const { _id, ...dataWithoutId } = req.body.data;
  try {
    await deadlineDaysModel
      .findByIdAndUpdate(req.body.data._id, dataWithoutId)
      .then(() => {
        res.status(200).json("Deadline days Updated Successfully!");
      });
  } catch (error) {
    console.log(error);
  }
};

const addDeadlineDays = async (req, res) => {
  try {
    const newDays = new deadlineDaysModel(req.body);
    await newDays.save().then(() => {
      res.status(200).json("Deadline days added Successfully!");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDeadlineDays,
  updateDeadlineDays,
  addDeadlineDays,
};

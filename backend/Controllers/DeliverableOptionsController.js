const DeliverableOptionsSchema = require("../models/DeliverableOptionsSchema");
const DeadlineDaysSchema = require("../models/DeadlineDays");
const id = "6667060a0095ff6dc507f28d"; // Set ID DIRECTLY FROM DB

const getAllDeliverableOptions = async (req, res) => {
  try {
    const data = req.body.data;
    const allDocument = await DeliverableOptionsSchema.find();
    res.status(200).json(allDocument);
  } catch (error) {
    console.log(error, "taskData");
  }
};

const getAllDeliverableDays = async (req, res) => {
  try {
    const allDocument = await DeadlineDaysSchema.find();
    res.status(200).json(allDocument);
  } catch (error) {
    console.log(error, "taskData");
  }
};

const updateAllDeliverableOptions = async (req, res) => {
  try {
    const data = req.body.data;
    if (data) {
      const updatedDocument = await DeliverableOptionsSchema.findByIdAndUpdate(
        id,
        { $set: data }, // Assuming you want to set the 'photographers' field to the new data
        { new: true } // This option returns the updated document
      );
      res.status(200).json("Successfully Added");
    }
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addDeliverableFields = async (req, res) => {
  try {
    const field = "promos"; // Change field name to add/update new record
    const data = req.body.data;
    const updatedDocument = await DeliverableOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { [field]: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addDeliverableOptionsForOnce = async (req, res) => {
  try {
    const data = {
      label: "Photographers",
      values: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
      ],
    };

    const newTask = new DeliverableOptionsSchema({
      ...data,
      photographers: data,
    });
    newTask.save();
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

module.exports = {
  addDeliverableFields,
  getAllDeliverableOptions,
  updateAllDeliverableOptions,
  addDeliverableOptionsForOnce,
  getAllDeliverableDays,
};

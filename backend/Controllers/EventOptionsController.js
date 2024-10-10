const EventOptionsSchema = require("../models/EventOptionsSchema");
const id = "66643548038c4bb6e8c0f7b3"; // Set ID DIRECTLY FROM DB

const getAllEventOptions = async (req, res) => {
  try {
    const data = req.body.data;
    const allDocument = await EventOptionsSchema.find();
    res.status(200).json(allDocument);
  } catch (error) {
    console.log(error, "taskData");
  }
};

const updateAllEventOptions = async (req, res) => {
  try {
    const data = req.body.data;
    if (data) {
      const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
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

const addTravelBy = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { travelBy: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addSameDayVideoEditors = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { videoEditors: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addSameDayPhotoEditors = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { photoEditors: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addDrones = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { drones: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addShootDirectors = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { shootDirector: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addCinematographers = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { cinematographers: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addPhotographers = async (req, res) => {
  try {
    const data = req.body.data;
    const updatedDocument = await EventOptionsSchema.findByIdAndUpdate(
      id,
      { $set: { photographers: data } }, // Assuming you want to set the 'photographers' field to the new data
      { new: true } // This option returns the updated document
    );
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

const addEventOptionsForOnce = async (req, res) => {
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

    const newTask = new EventOptionsSchema({ ...data, photographers: data });
    newTask.save();
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, "taskData");
  }
};

module.exports = {
  updateAllEventOptions,
  addTravelBy,
  getAllEventOptions,
  addSameDayVideoEditors,
  addSameDayPhotoEditors,
  addDrones,
  addShootDirectors,
  addCinematographers,
  addPhotographers,
  addEventOptionsForOnce,
};

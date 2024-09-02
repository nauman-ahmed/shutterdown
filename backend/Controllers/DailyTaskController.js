const taskSchema = require('../models/TaskSchema');

const addTask = async (req, res) => {
  try {
    const data = req.body.data;
    const newTask = new taskSchema({ ...data, client: data.client._id, assignTo: data.assignTo._id, assignBy: data.assignBy._id });
    await newTask.save();
    res.status(200).json("Successfully Added");
  } catch (error) {
    console.log(error, 'taskData');
  }
};

const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;
    const tasks = await taskSchema.find().skip(skip).limit(10).populate("client assignBy assignTo")
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error, 'taskData');
  }
};

const getPendingTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
    const tasks = await taskSchema.find({ended : false}).skip(skip).limit(10).populate("client assignBy assignTo")
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error, 'taskData');
  }
};

const getEditorTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;
    const tasks = await taskSchema.find({assignTo : req.params.editorId, ended : false}).skip(skip).limit(10).populate("client assignBy assignTo")

    // const Editor=await userSchema.find({rollSelect:"Editor"})
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error, 'taskData');
  }
};

const updateTaskData = async (req, res) => {
  try {
    const data = req.body.data;

    const updatedTask = await taskSchema.findByIdAndUpdate({ _id: data._id }, {...data, client : data.client._id, assignBy : data.assignBy._id, assignTo : data.assignTo._id})
    res.status(200).json(updatedTask)
  } catch (error) {
    console.log(error);
   }
}
module.exports = {
  addTask,
  getAllTasks,
  getEditorTasks,
  updateTaskData,
  getPendingTasks
};

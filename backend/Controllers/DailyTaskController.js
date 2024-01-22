const addClientSchema = require('../models/ClientModel');
const taskSchema = require('../models/TaskSchema');
const userSchema = require('../models/userSchema');
const handleDailyTaskGetRequest = async (req, res) => {
  try {
    const ClientData = await addClientSchema.find({ userID: req.params.id });
    const user = await userSchema.find({ rollSelect: 'Editor' });

    res.status(200).json({ ClientData: ClientData, userData: user });
  } catch (error) {
    res.status(404).json('fail to get access');
  }
};

const handleDailyTaskPostRequest = async (req, res) => {
  try {
    const taskData = await taskSchema.findOneAndUpdate({
      _id: req.body.data._id
    },
    {
      $set:req.body.data
    }    
    )

    res.status(200).json("Successfully Updated");
  } catch (error) {
    console.log(error, 'taskData');
  }
};

const getTaskData = async (req, res) => {
  try {
    const taskData = await taskSchema.find({}).populate("ClientId assignBy assignTo")
    const user = await userSchema.find({})
    
    // const Editor=await userSchema.find({rollSelect:"Editor"})
    res.status(200).json({ taskData:taskData, user});
  } catch (error) {
    console.log(error, 'taskData');
  }
};

const updateTaskData=async(req,res)=>{
  try {
    const idData=await taskSchema.findById({_id:req.params.id})
    const data=await taskSchema.findByIdAndUpdate({_id:req.params.id},{
      GroomName:req.body.data.client.BrideName,
      GroomName:req.body.data.client.GroomName,
      companyDate:req.body.data.companyDate,
      completionDate:req.body.data.completionDate,
      assignTo:{
        name:idData.assignTo.name,
        id:idData.assignTo.id
      },
      assignBy:req.body.data.assignBySelect,
      taskName:req.body.data.taskName
    })
    res.status(200).json(data)
  } catch (error) {}
}
module.exports = {
  handleDailyTaskGetRequest,
  handleDailyTaskPostRequest,
  getTaskData,
  updateTaskData
};

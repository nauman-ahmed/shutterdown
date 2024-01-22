const express=require("express")
const router=express.Router();
const DailyTaskRouter=require('../Controllers/DailyTaskController')
router.get(`/MyProfile/Tasks/DailyTasks/:id`,DailyTaskRouter.handleDailyTaskGetRequest);

router.post('/MyProfile/Tasks/DailyTasks',DailyTaskRouter.handleDailyTaskPostRequest)
router.get('/MyProfile/Tasks/DailyTasks',DailyTaskRouter.getTaskData)

router.put('/MyProfile/Tasks/DailyTasks/:id',DailyTaskRouter.updateTaskData)
module.exports=router
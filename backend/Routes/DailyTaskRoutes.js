const express = require("express")
const router = express.Router();
const DailyTaskController = require('../Controllers/DailyTaskController');

router.post('/MyProfile/Tasks/addTask', DailyTaskController.addTask)
router.get('/MyProfile/Tasks/getAllTasks',DailyTaskController.getAllTasks)
router.get('/MyProfile/Tasks/getPendingTasks',DailyTaskController.getPendingTasks)
router.get('/MyProfile/Tasks/getEditorTasks/:editorId',DailyTaskController.getEditorTasks)
router.put('/MyProfile/Tasks/updateTask',DailyTaskController.updateTaskData)

module.exports = router
const express = require("express");
const router = express.Router();
const DeadlineDaysController = require("../Controllers/DeadlineDaysController");

router.get("/Admin/getDeadlineDays", DeadlineDaysController.getDeadlineDays);
router.post("/Admin/updateDeadlineDays", DeadlineDaysController.updateDeadlineDays);
// router.post("/Admin/addDays", DeadlineDaysController.addDeadlineDays);

module.exports = router;

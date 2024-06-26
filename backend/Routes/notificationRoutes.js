const express = require("express");
const router = express.Router();
const NotificationController = require("../Controllers/notificationController");

router.get("/get-notifications", NotificationController.getNotifications);

module.exports = router;

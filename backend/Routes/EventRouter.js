const express = require("express");
const router = express.Router();
const EventController = require('../Controllers/EventController')


router.post('/AddEvent', EventController.AddEvent);
router.patch('/assignEventTeam', EventController.AssignTeam);
router.patch('/updateEvent', EventController.updateEvent);
router.post('/getAllEvents', EventController.getEvents);
router.get('/get-All-Events', EventController.getAllEvents);
router.delete('/deleteEvent/:eventId', EventController.DeleteEvent);


module.exports = router
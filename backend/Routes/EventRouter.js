const express = require("express");
const router = express.Router();
const EventController = require('../Controllers/EventController')


router.post('/AddEvent', EventController.AddEvent);
router.patch('/assignEventTeam', EventController.AssignTeam);
router.patch('/updateEvent', EventController.updateEvent);
router.get('/getAllEvents', EventController.getEvents);
router.delete('/deleteEvent/:eventId', EventController.DeleteEvent);


module.exports = router
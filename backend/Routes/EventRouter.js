const express = require("express");
const router = express.Router();
const EventController = require('../Controllers/EventController')

// router.get('/MyProfile/Client/ViewClient',ViewClientController.getViewClientData);
router.post('/AddEvent', EventController.AddEvent);
router.patch('/assignEventTeam', EventController.AssignTeam);
router.get('/getAllEvents', EventController.getEvents);
router.delete('/deleteEvent/:eventId', EventController.DeleteEvent);
// router.get('/Client/getClientById/:clientId', ClientController.getClientById);
// router.post('/MyProfile/Client/ParticularClient/shootDetails',ViewClientController.shootDetails);

module.exports = router
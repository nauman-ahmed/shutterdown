const express = require("express");
const router = express.Router();
const ClientController = require('../Controllers/ClientController')

// router.get('/MyProfile/Client/ViewClient',ViewClientController.getViewClientData);
router.get('/Client/getAllClients', ClientController.getAllClients);
router.get('/Client/getClientById/:clientId', ClientController.getClientById);
// router.post('/MyProfile/Client/ParticularClient/shootDetails',ViewClientController.shootDetails);

module.exports = router
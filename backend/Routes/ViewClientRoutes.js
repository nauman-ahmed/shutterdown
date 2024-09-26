const express = require("express");
const router = express.Router();
const ClientController = require('../Controllers/ClientController')

router.get('/Client/getClients', ClientController.getClients);
router.get('/Client/getAllClients', ClientController.getAllClients);
router.get('/Client/getPreWedClients', ClientController.getPreWedClients);
router.get('/Client/getClientById/:clientId', ClientController.getClientById);

module.exports = router
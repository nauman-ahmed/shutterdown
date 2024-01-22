const express = require('express');
const Router = express.Router();
const EditorShooterController = require('../Controllers/EditorShooterController');
Router.post('/Attendee/WebClock', EditorShooterController.EditorShooterData);
Router.put('/Attendee/WebClock/:id', EditorShooterController.EditorShooterCheckOutTime);
Router.get('/Attendee/WebClock/:id',EditorShooterController.handleSaveGetRequest)
module.exports = Router;

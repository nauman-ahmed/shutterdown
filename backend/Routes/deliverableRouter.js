const express = require("express");
const router = express.Router();
const deliverableController = require('../Controllers/deliverableController');

router.get('/get-Cinematography', deliverableController.getCinematography);
router.get('/get-Albums', deliverableController.getAlbums);
router.get('/get-Photos', deliverableController.getPhotos);
router.get('/get-Pre-Weds', deliverableController.getPreWeds);
router.post('/update-Deliverable', deliverableController.updateDeliverable)


module.exports = router
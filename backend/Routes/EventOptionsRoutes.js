const express = require("express")
const router = express.Router();
const EventOptionsController = require('../Controllers/EventOptionsController');

router.post('/AddNewEventOptions', EventOptionsController.addEventOptionsForOnce)
router.post('/UpdatePhotographers', EventOptionsController.addPhotographers)
router.post('/UpdateCinematographers', EventOptionsController.addCinematographers)
router.post('/UpdateShootDirectors', EventOptionsController.addShootDirectors)
router.post('/UpdateDrones', EventOptionsController.addDrones)
router.post('/UpdateSameDayPhotoEditors', EventOptionsController.addSameDayPhotoEditors)
router.post('/UpdateSameDayVideoEditors', EventOptionsController.addSameDayVideoEditors)
router.post('/UpdateTravelBy', EventOptionsController.addTravelBy)

router.post('/updateAll', EventOptionsController.updateAllEventOptions)

router.get('/getAll', EventOptionsController.getAllEventOptions)


module.exports = router
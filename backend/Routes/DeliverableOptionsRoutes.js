const express = require("express")
const router = express.Router();
const DeliverableOptionsController = require('../Controllers/DeliverableOptionsController');

router.post('/AddNewDeliverableOptions', DeliverableOptionsController.addDeliverableOptionsForOnce)
router.post('/UpdateDeliverableFields', DeliverableOptionsController.addDeliverableFields)
router.post('/updateAll', DeliverableOptionsController.updateAllDeliverableOptions)
router.get('/getAll', DeliverableOptionsController.getAllDeliverableOptions)
router.get('/getAllDeliverableDays', DeliverableOptionsController.getAllDeliverableDays)


module.exports = router
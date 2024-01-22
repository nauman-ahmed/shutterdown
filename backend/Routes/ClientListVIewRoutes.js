const express = require('express');
const router = express.Router();
const CalenderListView = require('../Controllers/CalenderListViewController');
router.get(
  '/MyProfile/Calender/ListView/:id',
  CalenderListView.ClientListViewController
);
router.put(
  '/MyProfile/Calender/ListView/:id/:id',
  CalenderListView.postClientListViewController
);
router.get(
  '/MyProfile/Client/ParticularClient/ShootDetails/:id',
  CalenderListView.clientSpecificEvents
);

router.get('/MyProfile/PreWedShoot/PreWedShootScreen',CalenderListView.preWeddingShoot );
router.post('/MyProfile/PreWedShoot/PreWedShootScreen/save',CalenderListView.preWeddingShootSave);

router.put('/MyProfile/PreWedShoot/PreWedShootScreen/:id',CalenderListView.preWeddingShootupdate)
module.exports = router;

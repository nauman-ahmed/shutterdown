const express = require('express');
const router = express.Router();
const CalenderViewController = require('../Controllers/ClientCalenderViewController');

router.get(
  '/Calender/View/',
  CalenderViewController.ClientCalenderViewFunction
);

router.post(
  '/Calender/View/save',
  CalenderViewController.clientModelFunction
);

router.get(
  '/Calender/View//onlyDates',
  CalenderViewController.eventsToGetDates
);


module.exports = router;

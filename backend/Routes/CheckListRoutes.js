const express = require('express');
const router = express.Router();
const CheckListController = require('../Controllers/CheckListController');

router.get('/CheckLists', CheckListController.CheckListData);
router.post('/MyProfile/CheckLists', CheckListController.CheckListDataPost);

module.exports = router;

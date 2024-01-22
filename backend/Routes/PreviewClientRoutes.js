const express=require('express')
const router=express.Router()
const  PreviewController  = require('../Controllers/PreviewController');
router.post('/MyProfile/AddClient/Preview',PreviewController.PreviewClientFunction);
module.exports=router
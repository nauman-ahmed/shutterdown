const express=require("express")

const router=express.Router()
const CalenderViewController=require('../Controllers/AddCalenderViewController')

router.post('/MyProfile/Calender/ListView',CalenderViewController.AddClientTeamFunction);



module.exports=router
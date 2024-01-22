const express=require("express")
const router = express.Router();
const GetCalenderList = require("../Controllers/GetCalenderListController")


router.get("MyProfile/Calender/ListView", GetCalenderList.CalenderList)


module.exports=router
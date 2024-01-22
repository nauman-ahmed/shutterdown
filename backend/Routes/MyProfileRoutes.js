const express=require("express")
const router=express.Router()
const myProfileRouter=require('../Controllers/MyProfileController')
router.get("/MyProfile/Profile/:id",myProfileRouter.ProfileHeaderFunction)
router.put('/MyProfile/About/:id',myProfileRouter.UpdateManagerFunction);
router.put('/MyProfile/Profile/:id', myProfileRouter.ProfileUpdateFunction);
router.put("/MyProfile/Job/:id",myProfileRouter.jobValueFunction)
router.get("/MyProfile/:id",myProfileRouter.clientData)
module.exports=router

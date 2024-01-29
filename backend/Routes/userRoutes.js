const express=require("express")
const userController=require('../Controllers/userController')

const router=express.Router()

router.post('/Signup', userController.RegisterPostRequest);
router.post('/signInWithGoogle', userController.RegisterPostRequest);
router.get('/getAllUsers',userController.getAllUsers)
router.get('/getEditors',userController.getEditors)
router.post('/', userController.SignInPostRequest);
router.post('/emailVerify', userController.verifyEmail);
router.put("/ResetPassword",userController.newPassword)
router.post('/',userController.getExistEmail)

module.exports = router
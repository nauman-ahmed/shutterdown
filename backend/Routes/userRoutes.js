const express=require("express")
const userController=require('../Controllers/userController')
const router=express.Router()
const multer = require('multer');
const verifyToken = require("../middlewares/tokenVerifier");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/Signup', userController.RegisterPostRequest);
router.post('/signInWithGoogle', userController.RegisterPostRequest);
router.get('/getAllUsers',userController.getAllUsers)
router.get('/getEditors',userController.getEditors);
router.get('/getShooters',userController.getShooters);
router.get('/user/me', verifyToken ,userController.getMe);
router.post('/sign-in', userController.SignInPostRequest);
router.post('/emailVerify', userController.verifyEmail);
router.put("/ResetPassword",userController.newPassword);
router.post('/check-exist-email',userController.getExistEmail);
router.post('/update-userInfo',userController.updateUserData);
router.post('/upload-files/:userId',upload.fields([{name : 'Adhar-Card'}, {name : 'Pan-Card'}, {name : 'Driving-License' }, {name : 'Voter-ID'}, {name : 'Passport'}, {name : 'Photo'}, {name : 'Signature'}]) ,userController.uploadFiles);
// router.post('/upload-files/:userId', userController.uploadFiles);
router.post('/getUserAccountApproved',userController.getUserAccountApproved);
router.post('/getUserAccountbanned',userController.getUserAccountbanned);
router.post('/getUserAccountUnbanned',userController.getUserAccountUnbanned);


router.get('/download/:fileId',userController.downloadFile)
router.get('/preview-file/:fileId', userController.previewFile); // Update this route
router.get('/getAllUserAccountRequestCount', userController.getAllAccountRequestCount)
router.get('/getAllUserAccountDetails', userController.getAllAccountDetails)

module.exports = router



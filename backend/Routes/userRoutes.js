const express=require("express")
const userController=require('../Controllers/userController')
const router=express.Router()
const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage : storage});

router.post('/Signup', userController.RegisterPostRequest);
router.post('/signInWithGoogle', userController.RegisterPostRequest);
router.get('/getAllUsers',userController.getAllUsers)
router.get('/getEditors',userController.getEditors);
router.get('/getShooters',userController.getShooters);
router.post('/', userController.SignInPostRequest);
router.post('/emailVerify', userController.verifyEmail);
router.put("/ResetPassword",userController.newPassword);
router.post('/',userController.getExistEmail);
router.post('/update-userInfo',userController.updateUserData);
router.post('/upload-files/:userId',upload.fields([{name : 'adharCard'}, {name : 'panCard'}, {name : 'drivingLicense' }, {name : 'voterID'}, {name : 'passport'}, {name : 'photo'}, {name : 'signature'}]) ,userController.uploadFiles);
router.get('/uploads/:filePath',userController.downloadFile)
router.get('/preview/uploads/:filePath',userController.previewFile)

module.exports = router
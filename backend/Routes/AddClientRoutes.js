const express=require("express")
const ClientController=require("../Controllers/ClientController");
const router=express.Router(); 

router.post('/AddClient', ClientController.AddClientFunction);
router.post('/AddCinematography', ClientController.AddCinematography);
router.post('/AddPhotosDeliverables', ClientController.AddPhotosDeliverables);
router.post('/AddAlbumsDeliverables', ClientController.AddAlbumsDeliverables);
router.post('/updateClientData', ClientController.updateClient);

// router.get("/Client/ParticularClient/ClientInfo")
module.exports=router
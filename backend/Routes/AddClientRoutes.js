const express=require("express")
const ClientController=require("../Controllers/ClientController");
const { ClientListViewController } = require("../Controllers/CalenderListViewController");
const dummyController=require("../Controllers/DummyController")
const router=express.Router();
const ListViewSaveController = require("../Controllers/ListViewSaveController") 

router.post('/AddClient', ClientController.AddClientFunction);
router.post('/AddCinematography', ClientController.AddCinematography);
router.post('/AddPhotosDeliverables', ClientController.AddPhotosDeliverables);
router.post('/AddAlbumsDeliverables', ClientController.AddAlbumsDeliverables);
router.post('/updateClientData', ClientController.updateClient);
router.get('/Deliverables', ClientController.getAllDeliverables);

router.post('/AddClient/Form-II', dummyController.DummyTableFunction);
router.post('/AddClient/Preview', ClientController.AddMoreClientFunction);

router.put('/AddClient/Form-II/:id',dummyController.EditDummyTableFunction);
router.put('/AddClient/Preview/:id', dummyController.EditDummyDataTableId);

router.put('/AddClient/Preview/:id', dummyController.EditDummyDataTableId);

router.put('/Calender/ListView/', ListViewSaveController.ListViewSaveController);

// router.get("/Client/ParticularClient/ClientInfo")
module.exports=router
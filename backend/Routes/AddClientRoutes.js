const express=require("express")
const ClientController=require("../Controllers/ClientController");
const router=express.Router(); 

router.post('/AddClient', ClientController.AddClientFunction);
router.post('/updateClientData', ClientController.updateClient);
router.post('/add-PreWedData', ClientController.AddPreWedDetails);
router.delete('/deleteClient/:clientId', ClientController.DeleteClient);

module.exports=router
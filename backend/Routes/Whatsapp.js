const express = require("express")
const router = express.Router();
const WhatsappController = require('../Controllers/Whatsapp');

router.post('/postWhatsappText', WhatsappController.addWhatsappText)
router.get('/', WhatsappController.getAllText)


module.exports = router
const express = require('express');
const router = express.Router();
const suscriptionController = require('../controllers/suscriptions.controller');

router.get('/:id', suscriptionController.getSuscriptions);
router.post('/', suscriptionController.postSuscription);
router.put('/:id', suscriptionController.UnSuscribeToChannel);
module.exports = router;
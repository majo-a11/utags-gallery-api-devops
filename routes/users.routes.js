const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js');


router.get('/',userController.getUsers);
router.get('/profile', userController.profile);
router.get('/:id',userController.getUser);
router.post('/',userController.postUser);
router.post('/login',userController.login)
router.put('/:id',userController.putUser)
router.put('/delete/:id',userController.deleteUser)

module.exports = router;

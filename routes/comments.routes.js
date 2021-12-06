const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controller');

router.get('/:id', commentsController.getComments);
router.get('/comment/:id', commentsController.getComment);
router.post('/', commentsController.postComment);
router.put('/:id', commentsController.putComment);
router.put('/delete/:id', commentsController.deleteComment);

module.exports = router;
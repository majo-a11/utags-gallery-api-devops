const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts.controller');

router.get('/',postController.getPosts);
router.get('/:id',postController.getPost);
router.get('/images/:word', postController.getImagesPost);
router.get('/suscription/post/:user_id', postController.getPostsSuscription);
router.post('/',postController.postPost);
router.put('/:id',postController.putPost);
router.put('/like/:id',postController.putPostLike);
router.put('/delete/:id',postController.deletePost);


module.exports = router;
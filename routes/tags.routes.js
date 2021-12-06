const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags.controller');

router.get('/all/:id', tagsController.getTags);
router.get('/:id', tagsController.getTag);
router.get('/details/:id', tagsController.getTagDetails);
router.get('/posts/tags/:user_id/:post_id', tagsController.getTagsPosts);
router.post('/', tagsController.postTag);
router.post('/insert/tag', tagsController.insertTag);
router.put('/:id', tagsController.putTag);
router.put('/delete/:id', tagsController.deleteTag);
router.delete('/delete/tagbypost/:tag_id/:post_id', tagsController.deleteTagByPost);




module.exports = router;
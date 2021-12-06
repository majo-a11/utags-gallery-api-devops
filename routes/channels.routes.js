const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channels.controller');

router.get('/',channelController.getChannels);
router.get('/:id',channelController.getChannel);
router.get('/channel/user/:id',channelController.getChannelByUser);
router.get('/posts/:channel_id', channelController.getPostsByChannel);
router.post('/',channelController.postChannel);
router.put('/:id',channelController.putChannel);
router.put('/delete/:id',channelController.deleteChannel);

module.exports = router;

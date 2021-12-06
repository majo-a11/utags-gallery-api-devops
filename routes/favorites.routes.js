const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');

router.get('/:id', favoritesController.getFavorites);
router.post('/', favoritesController.MarkFavorite);
router.put('/:id', favoritesController.UnMarkFavorite);


module.exports = router;
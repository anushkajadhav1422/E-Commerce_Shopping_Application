const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist')
const authUser = require('../middleware/authUser');
const { getwishlist, addwishlist, deleteWishlist } = require('../controller/wishlistController');


router.get('/fetchwishlist', authUser, getwishlist)
router.post('/addwishlist', authUser, addwishlist)
router.delete('/deletewishlist/:id', authUser, deleteWishlist)

module.exports = router
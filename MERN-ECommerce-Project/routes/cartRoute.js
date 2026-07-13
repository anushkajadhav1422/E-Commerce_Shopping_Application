const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authUser = require("../middleware/authUser");
const { getAllCartProducts, addCarts, deleteCarts } = require("../controller/cartController");

// get all cart products
router.get("/fetchcart", authUser, getAllCartProducts);

// add to cart

router.post("/addcart", authUser, addCarts);

// remove from cart
router.delete("/deletecart/:id", authUser, deleteCarts);
module.exports = router;

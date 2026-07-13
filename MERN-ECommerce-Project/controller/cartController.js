const express = require('express');
const Cart = require("../models/Cart");
const authUser = require("../middleware/authUser");
const router = express.Router();

// get all cart products
const getAllCartProducts = async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user.id })
            .populate("productId", "name price image rating type")
            .populate("user", "name email");
        res.send(cart);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

// add to cart

const addCarts = async (req, res) => {
    try {
        const { _id, quantity } = req.body;
        const findProduct = await Cart.findOne({ $and: [{ productId: _id }, { user: req.user.id }] })
        if (findProduct) {
            return res.status(400).json({ msg: "Product already in a cart" })
        }
        else {
            const user = req.header;
            const cart = new Cart({
                user: req.user.id,
                productId: _id,
                quantity,
            });
            const savedCart = await cart.save();
            console.log("savedCart: ",savedCart);
            res.send(savedCart);
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

// remove from cart
const deleteCarts = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Cart.findByIdAndDelete(id)
        console.log("result: ",result);
        
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}



module.exports = {
getAllCartProducts,addCarts,deleteCarts
}
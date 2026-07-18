const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
let success = false;
const getAllUsersInfo = async (req, res) => {
    try {
        const data = await User.find().select('-password');
        // console.log(data);
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
}
const getSingleUserInfo = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {
            const findUser = await User.findById(userId).select('-password');
            console.log(findUser);
            
            res.send(findUser);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}
const getUserCart = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {
            const findUserCart = await Cart.find({ user: userId })
                .populate("productId", "name price image rating type")
                .populate("user", "name email");
            res.send(findUserCart);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}
const getUserWishlist = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {
            const findUserWishlist = await Wishlist.find({ user: userId }).populate("productId")
            res.send(findUserWishlist);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}
const getUserReview = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {

            const findUserReview = await Review.find({ user: userId })
                .populate("productId", "name price image rating type")
                .populate("user", "firstName lastName");
            res.send(findUserReview);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}

const deleteUserReview = async (req, res) => {
    const { id } = req.params;
    try {
        let deleteReview = await Review.findByIdAndDelete(id)
        res.send({ msg: "Review deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deleteUserCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        let deleteCart = await Cart.findByIdAndDelete(id)
        success = true
        res.send({ success, msg: "Review deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter1" })
    }
}
const deleteUserWishlistItem = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        let deleteCart = await Wishlist.findByIdAndDelete(id)
        success = true
        res.send({ success, msg: "Review deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter" })
    }
}


const updateProductDetails = async (req, res) => {
    const updateProduct = req.body.productDetails;
    updateProduct.price = parseFloat(updateProduct.price);
    updateProduct.rating = parseFloat(updateProduct.rating);
    const { id } = req.params;
    const product = await Product.findById(id)
    if (product) {
        try {
            let update = await Product.findByIdAndUpdate(id, { $set: updateProduct })
            success = true
            const findType = await Product.find({ type: "book" }).distinct('category')

            res.send({ success, msg: "Product updated successfully", findType })

        } catch (error) {
            // return res.status(400).send({ success, error: error })
            return res.status(400).send(error)
        }
    }
    else {
        return res.status(400).send({ success, error: "Product not found" })
    }

}

const userPaymentDetails = async (req, res) => {
    const { id } = req.params;
    const findPayment = await Payment.find({ user: id })    
    if (findPayment) {
        try {
            res.send(findPayment)
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    else {
        return res.status(400).send({ total: 0 })
    }
}

const addProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            price,
            category,
            image,
            rating,
            type,
            author,
            description,
            gender
        } = req.body;

        // ✅ basic validation
        if (!name || !price || !type) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const product = await Product.create({
            name,
            brand,
            price,
            category,
            image,
            rating,
            type,
            author,
            description,
            gender
        });
        console.log(product);
        

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    let findProduct = await Product.findById(id);
    if (findProduct) {
        try {
            await Product.findByIdAndDelete(id)
            success = true
            res.send(success)
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    else {
        return res.status(400).send({ success, msg: "Product Not Found" })
    }
}

// update user details
const updateUser = async (req, res) => {
    const { userDetails } = req.body
    let convertData = JSON.parse(userDetails)
    try {
        const user = await User.findById(req.user.id)
        if (user) {
            let updateDetails = await User.findByIdAndUpdate(req.user.id, { $set: convertData })
            success = true
            res.status(200).send({ success })
        }
        else {
            return res.status(400).send("User Not Found")
        }
    } catch (error) {
        res.send("Something went wrong")
    }
}

const getUser = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password")
        success = true
        res.send(user)

    } catch (error) {
        res.status(400).send("Something went wrong")
    }
}


module.exports = {
    getAllUsersInfo, getSingleUserInfo,
    getUserCart, getUserWishlist,
    getUserReview, deleteUserReview,
    deleteUserCartItem, deleteUserWishlistItem,
    updateProductDetails, userPaymentDetails, addProduct, deleteProduct,
    updateUser,getUser
}
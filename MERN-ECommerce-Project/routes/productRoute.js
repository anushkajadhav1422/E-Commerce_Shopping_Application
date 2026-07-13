const express = require('express');
const Product = require('../models/Product')
const { getAllProducts, getSingleProduct, getProductBySingleCategory, getProductCategoryWise } = require('../controller/productController');
const router = express.Router();


// to fetch all products
router.get('/fetchproduct', getAllProducts )
// To get Single product
router.get('/fetchproduct/:id', getSingleProduct)
// to get products for single category
router.post('/fetchproduct/type', getProductBySingleCategory)
// to get products category wise
router.post('/fetchproduct/category', getProductCategoryWise)
// to search products added search filters on frontend so no need to create separate api for this

// router.get('/search/:key', async (req, res) => {
//     const { key } = req.params
//     try {
//         if (key.length > 0) {
//             const product = await Product.find({
//                 $or: [
//                     { name: { $regex: key, $options: "i" } },
//                     { type: { $regex: key, $options: "i" } },
//                     { brand: { $regex: key, $options: "i" } },
//                     { category: { $regex: key, $options: "i" } },
//                     { author: { $regex: key, $options: "i" } },
//                     { description: { $regex: key, $options: "i" } },
//                     { gender: { $regex: key, $options: "i" } },
//                 ]
//             })
//             if (product.length <= 0) {
//                 res.status(400).send("Product not found")
//             }
//             else {
//                 res.send(product)
//             }
//         }

//     } catch (error) {
//         res.status(400).send("Something went wrong")
//     }
// })

module.exports = router
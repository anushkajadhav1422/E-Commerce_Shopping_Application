const express = require('express');
const { registerAdminApi, loginAdminApi,} = require('../controller/authAdmin');
const { getAllUsersInfo, getSingleUserInfo,addProduct } = require('../controller/AdminControl');
const { chartData } = require('../controller/AllProductInfo');
const { isAuthenticatedUser, authorizedRole } = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');

const router = express.Router();

router.post('/login', loginAdminApi);
router.post('/register', registerAdminApi);
router.get('/getusers', authAdmin, getAllUsersInfo);
router.get('/getuser/:userId', authAdmin, getSingleUserInfo);
router.post('/addproduct', authAdmin, addProduct);
router.get('/chartdata', authAdmin, chartData);


module.exports = router;
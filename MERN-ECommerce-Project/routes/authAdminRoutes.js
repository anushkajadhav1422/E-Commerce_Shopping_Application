const express = require('express');
const { registerAdminApi, loginAdminApi,} = require('../controller/authAdmin');
const { getAllUsersInfo, getSingleUserInfo,addProduct,updateUser, getUser,addUser } = require('../controller/AdminControl');
const { chartData } = require('../controller/AllProductInfo');
const { isAuthenticatedUser, authorizedRole } = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');
const authUser = require('../middleware/authUser')
const { deleteAllUserData } = require('../controller/deleteUser');

const router = express.Router();

router.post('/login', loginAdminApi);
router.post('/register', registerAdminApi);
router.get('/getusers', authAdmin, getAllUsersInfo);
router.get('/getuser/:userId', authAdmin, getSingleUserInfo);
router.post('/addproduct', authAdmin, addProduct);
router.get('/chartdata', authAdmin, chartData);
router.put('/updateUser', authUser, updateUser);
router.get('/getuser', authUser, getUser);
router.post('/adduser', authAdmin, addUser);



module.exports = router;
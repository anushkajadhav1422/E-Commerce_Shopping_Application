const express = require('express');
const { registerUserApi, loginUser, 
        resetPassword, verifyUser, forgotPassword,  
        verifyOtp, verifyEmail, resendOtp} = require('../controller/authController');
const { isAuthenticatedUser, authorizedRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUserApi);
router.post('/resendOtp', resendOtp);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;
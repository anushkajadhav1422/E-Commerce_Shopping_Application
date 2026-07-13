const express = require('express');
const router = express.Router();
const Review = require('../models/Review')
const authUser = require('../middleware/authUser');
const { fetchReviewById, addReview, deleteReview, editReview } = require('../controller/reviewController');

router.post('/fetchreview/:id', fetchReviewById)
router.post('/addreview', authUser, addReview)
router.delete('/deletereview/:id', authUser, deleteReview)
router.put('/editreview', authUser, editReview)


module.exports = router
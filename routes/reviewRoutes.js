const reviewControllers=require('../controllers/reviewControllers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();


router.route('/create-Review/:id')
.post(
authControllers.protect,
reviewControllers.createReview
);

router.route('/read-review/:id')
.get(
    authControllers.protect,
    reviewControllers.readOneReview
);

router.route('/read-all-reviews/:id')
.get(
    authControllers.protect,
    reviewControllers.getOthersReviews
);

router.route('/update-review/:id')
.patch(
    authControllers.protect,
    reviewControllers.updateReview
);

router.route('/delete-one-review/:id')
.delete(
    authControllers.protect,
    reviewControllers.deleteReview
);

router.route('/delete-all-reviews')
.delete(
    authControllers.protect,
    reviewControllers.deleteAllReviews
);

router.route('/own-reviews')
.get(
    authControllers.protect,
    reviewControllers.getOwnReviews
);

module.exports=router;
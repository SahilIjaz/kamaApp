const feedBackCOntrollers=require('../controllers/feedBackControllers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();

router.route('/create-feedBack')
.post(
    authControllers.protect,
    // feedBackCOntrollers.creator,
    feedBackCOntrollers.createFeedBack
);

router.route('/get-feedback')
.get(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    feedBackCOntrollers.getAllFeedBAck
);

router.route('/update-fedBack/:id')
.patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    feedBackCOntrollers.updateFeedBAck
);

router.route('/delete-One-feedBack/:id')
.delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    feedBackCOntrollers.deletFeedBack
);

router.route('/delete-All-feedBacks')
.delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    feedBackCOntrollers.deletAllFeedBAcks
);

module.exports=router;
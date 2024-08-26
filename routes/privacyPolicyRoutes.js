const privacyPolicyControllers=require('../controllers/privacyPolicyCntrollers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();

router.route('/create-policy')
.post(authControllers.protect,
    authControllers.restrictTo('admin'),
    // privacyPolicyControllers.creator,
    privacyPolicyControllers.createPolicy
);

router.route('/get-policy')
.get(
    authControllers.protect,
    privacyPolicyControllers.readPolicy
);

router.route('/update-policy/:id')
.patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    privacyPolicyControllers.updatePolicy
);

router.route('/delete-policy')
.delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    privacyPolicyControllers.deletePolicy
);

module.exports=router;

const userControllers=require('../controllers/userControllers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();



router.route('/signUp')
.post(authControllers.signUp);

router.route('/resendOTP')
.post(authControllers.resendOTP);

router.route('/otpVerification')
.post(authControllers.otpVerifivation);

router.route('/logIn')
.post(authControllers.logIn);

router.route('/forgotPassword')
.post(authControllers.protect,
    authControllers.forgotPassword);

router.route('/resetPassword')
.post(authControllers.resetPassword);
//otp verification is same as for signUp purpose

router.route('/createProfile')
.patch(authControllers.protect,
    userControllers.createProfile);

router.route('/updateProfile')
.patch(authControllers.protect,
    userControllers.updateProfile);

router.route('/getAllUsers')
.get(
authControllers.protect,
    authControllers.restrictTo('admin'),
    userControllers.getAllUsers
);

router.route('/deleteUser')
.post(
    authControllers.protect,
    authControllers.deleteUser);


router.route('/deleteMe')
.post(
    authControllers.protect,
    authControllers.deleteMe);

router.route('/oneUser/:id')
.get(authControllers.protect,
    userControllers.getOneUser);

router.route('/get-Recommnedded-profeessionals')
.get(authControllers.protect,
    authControllers.restrictTo('user'),
    userControllers.getRecommendedProfessionals
);

router.route('/get-nearest-profeessionals')
.post(authControllers.protect,
    authControllers.restrictTo('user'),
    userControllers.getNearestProfessionals
);

router.route('/get-nearest-profeessionals')
.get(authControllers.protect,
    authControllers.restrictTo('user'),
    userControllers.getNearestProfessionals
);

router.route('/get-professionals')
.get(
    authControllers.protect,
    authControllers.restrictTo('user'),
    userControllers.getProfessionals
);

router.route('/DeleteAnyUser/:id')
.delete(authControllers.protect,
    authControllers.restrictTo('admin'),
    authControllers.deleteOneUser
);

module.exports=router;
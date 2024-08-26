const termsAndConditionsContollers=require('../controllers/tersAndConditionsControllers')
const authControllers=require('../controllers/authControllers')
const express=require('express')
const router=express.Router()


router.route('/createTerms')
.post(
authControllers.protect,
authControllers.restrictTo('admin'),
termsAndConditionsContollers.setCreator,
termsAndConditionsContollers.createTermsAndCOnditions);

router.route('/readTerms')
.get(
authControllers.protect,
termsAndConditionsContollers.readTermsAndConditions);

router.route('/updateTerms/:id')
.patch(
authControllers.protect,
authControllers.restrictTo('admin'),
termsAndConditionsContollers.updateTermsAndConditions);

router.route('/deleteTerms')
.delete(
authControllers.protect,
authControllers.restrictTo('admin'),
termsAndConditionsContollers.deleteTermsAndConditions);


module.exports=router;
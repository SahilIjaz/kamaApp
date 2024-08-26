const bookingControllers=require('../controllers/bookingCntrollers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();

router.route('/create-booking')
.post(
authControllers.protect,
authControllers.restrictTo('user'),
bookingControllers.createBooking
);

router.route('/read-booking')
.get(
    authControllers.protect,
    bookingControllers.getBookings
);

router.route('/update-booking/:id')
.patch(
    authControllers.protect,
    bookingControllers.updateBooking
);

router.route('/delete-booking/:id')
.delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    bookingControllers.deleteBooking
);

router.route('/get-one-bookig/:id')
.get(
    authControllers.protect,
    bookingControllers.getOneBooking
);

router.route('/complete-booking/:id')
.get(
    authControllers.protect,
    bookingControllers.completeBooking
);

router.route('/cancel-or-accept-booking/:id')
.patch(
    authControllers.protect,
    bookingControllers.cancelOrAcceptBooking
);

module.exports=router;
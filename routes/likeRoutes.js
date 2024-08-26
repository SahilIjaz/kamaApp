const likeCOntrollers=require('../controllers/likeControllers');
const authCOntrollers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();

router.route('/like-or-di-like/:id')
.post(
    authCOntrollers.protect,
    authCOntrollers.restrictTo('user'),
    likeCOntrollers.likeOrDislike
);

router.route('/favourities')
.get(
    authCOntrollers.protect,
    authCOntrollers.restrictTo('user'),
    likeCOntrollers.Favourities
);


router.route('/update-like/:id')
.patch(
    authCOntrollers.protect,
    authCOntrollers.restrictTo('admin'),
    likeCOntrollers.updateLike
);

router.route('/delete-like/:id')
.delete(
    authCOntrollers.protect,
    authCOntrollers.restrictTo('admin'),
    likeCOntrollers.deleteLike
);

module.exports=router;
const blockControllers=require('../controllers/blockControllers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();

router.route('/block-someOne')
.post(
    authControllers.protect,
    blockControllers.block
);

router.route('/un-block/:id')
.delete(
    authControllers.protect,
    blockControllers.unBlock
);

router.route('/block-list')
.get(
    authControllers.protect,
    blockControllers.blockList
);

router.route('/update-block/:id')
.patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    blockControllers.updateBlock
);

router.route('/delete-block/:id')
.delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    blockControllers.deleteBlock
);


module.exports=router;
const historyControllers=require('../controllers/historyControllers');
const authControllers=require('../controllers/authControllers');
const express=require('express');
const router=express.Router();

router.route('/get-history')
.get(
    authControllers.protect,
    historyControllers.readHistory
);

router.route('/update-history/:id')
.patch(
    authControllers.protect,
    historyControllers.updateHistory
);

router.route('/delete-one-data-from-history/:id')
.delete(
    authControllers.protect,
    historyControllers.deletehistory
);

router.route('/delet-full-history')
.delete(
    authControllers.protect,
    historyControllers.deletFullistory
);

module.exports=router;
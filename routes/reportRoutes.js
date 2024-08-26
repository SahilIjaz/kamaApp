const reportControllers=require('../controllers/reportCOntrollers')
const authControllers=require('../controllers/authControllers')
const express=require('express')
const router=express.Router()

router.route('/report-someOne/:id')
.post(authControllers.protect,
    // reportControllers.creator,
    reportControllers.reportUser
);

router.route('/get-all-reports')
.get(authControllers.protect,
    authControllers.restrictTo('admin'),
    reportControllers.getAllReport
);

router.route('/update-report/:id')
.patch(authControllers.protect,
    authControllers.restrictTo('admin'),
    reportControllers.updateReport
);

router.route('/delete-report/:id')
.delete(authControllers.protect,
    authControllers.restrictTo('admin'),
    reportControllers.deleteReport
);

module.exports=router;
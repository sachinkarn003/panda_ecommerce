const express = require('express');
const subCategoriesController = require('../controller/subCategoriesController');
const authController = require('../controller/authController');

const router = express.Router();
router.route('/listSubcategory/:category').get(subCategoriesController.getSubcategory);

router
    .route('/')
    .get(subCategoriesController.getAllSubcategory)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        subCategoriesController.uploadSubcategoryPhoto,
        subCategoriesController.resizeSubcategoryPhoto,
        subCategoriesController.createSubcategory
    );

router
    .route('/:id')
    .get(subCategoriesController.getOne)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        subCategoriesController.uploadSubcategoryPhoto,
        subCategoriesController.resizeSubcategoryPhoto,
        subCategoriesController.updateSubcategory
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        subCategoriesController.deleteSubcategory
    );
    

module.exports = router;
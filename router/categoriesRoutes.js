const express = require('express');
const categoriesController = require('../controller/categoriesController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .get(categoriesController.getAllCategory)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        categoriesController.uploadCategoryPhoto,
        categoriesController.resizeCategoryPhoto, 
        categoriesController.createCategory
    );

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        categoriesController.uploadCategoryPhoto,
        categoriesController.resizeCategoryPhoto,
        categoriesController.updateCategory
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        categoriesController.deleteCategory
    );
    
module.exports = router;
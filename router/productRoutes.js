const express = require('express');
const productController = require('../controller/productController');
const authController = require('../controller/authController');
const router = express.Router();

router.route('/productList/:subcategory').get(productController.productList);

router
.route('/')
.get(productController.getAllProduct)
.post(authController.protect, authController.restrictTo('admin'),productController.createOne);

router
.route('/:id')
.patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductImage,
    productController.resizeProductImage,
    productController.updateOne
)
.delete(authController.protect, authController.restrictTo('admin'),productController.deleteOne);

module.exports = router;

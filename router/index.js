var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require("axios");
const productController = require('./../controller/productController');




router.get('/', productController.product_index);
router.get('/secured', requiresAuth(),productController.secured_endpoint);



router.get("/contactus",productController.contact_us);
router.get('/application', requiresAuth(),productController.role_based_authentication3);
router.get('/create', requiresAuth(),productController.role_based_authentication);
router.get("/order/:id", requiresAuth(), productController.product_order);
router.get("/profile",productController.personal_profile);
router.get("/orderhistory",productController.orderhistory);
//router.get("/confirm/:id", requiresAuth(), productController.product_confirm);
router.get('/product/:id', productController.product_edit_view);
router.get('/useredit', productController.user_edit);
//the three is just for admin

router.post('/add', productController.product_create_post);
router.post('/product_edit/:id', productController.product_update);
router.post("/delete/:id", productController.product_delete);
router.post("/product/payment", productController.product_payment);
router.post('/ordercreate', requiresAuth(),productController.order_create_post);
router.post('/user_edit', productController.user_update);



module.exports = router;
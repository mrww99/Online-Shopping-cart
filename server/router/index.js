const Router = require('express').Router;

const userService = require('../services/userService');
const productService = require('../services/productService');
const storeService = require('../services/storeService');

const router = new Router();
//user service routers
router.post('/login',userService.login)
router.post('/register', userService.registration)
router.get('/getUser/:userId',userService.getUser)
router.post('/addNewAddress/:userId', userService.addNewAddress)
router.get('/addressList/:userId', userService.getAddressList)
router.post('/deleteAddress/:addrId', userService.deleteAddress)
router.post('/addNewCard/:userId', userService.addNewCard)
router.get('/cardList/:userId', userService.getCardList)
router.post('/deleteCard/:cardId', userService.deleteCard)
//product service routers
router.get('/products/:storeId',productService.fetchProducts)
router.get('/findProduct/:productId', productService.findProduct)
router.post('/addProduct/:storeId', productService.addProduct)
router.post('/deleteProduct/:productId', productService.deleteProduct)
router.get('/comments/:productid', productService.getComments)
router.post('/addComment', productService.addComment)
router.post('/addToCart', productService.addToCart)
//store service routers
router.get('/storeList/:userId', storeService.getStoreList)
router.get('/getStore/:storeId', storeService.getStore)
router.post('/deleteStore/:storeId', storeService.deleteStore)
router.post('/createStore/:userId', storeService.createStore)
//order service
router.get('/getOrder/:userId',storeService.getOrder)
router.get('/payment/:paymentInfo', storeService.addPaymentInfo)
router.get('/deleteOrder/:orderId', storeService.deleteOrder)

module.exports = router
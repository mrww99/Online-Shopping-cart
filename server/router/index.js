const Router = require('express').Router;

const userService = require('../services/userService');
const productService = require('../services/productService');
const storeService = require('../services/storeService');

const router = new Router();
//user service routers
router.post('/login',userService.login)                                 //ok
router.post('/register', userService.registration)                      //ok
router.get('/getUser/:userId',userService.getUser)                      //ok
router.post('/addNewAddress/:userId', userService.addNewAddress)        //ok
router.get('/addressList/:userId', userService.getAddressList)          //ok
router.post('/deleteAddress/:addrId', userService.deleteAddress)        //ok
router.post('/addNewCard/:userId', userService.addNewCard)              //ok
router.get('/cardList/:userId', userService.getCardList)                //ok
router.post('/deleteCard/:cardId', userService.deleteCard)              //ok
//product service routers
router.get('/products/:storeId',productService.fetchProducts)           //ok
router.get('/findProduct/:productId', productService.findProduct)       //ok
router.post('/addProduct/:storeId', productService.addProduct)          
router.post('/deleteProduct/:productId', productService.deleteProduct)  
router.get('/comments/:productid', productService.getComments)          //ok
router.post('/addComment', productService.addComment)                   
router.post('/addToCart', productService.addToCart)
//store service routers
router.get('/storeList/:userId', storeService.getStoreList)             //ok
router.get('/getStore/:storeId', storeService.getStore)
router.post('/deleteStore/:storeId', storeService.deleteStore)
router.post('/createStore/:userId', storeService.createStore)
//order service
router.get('/getOrder/:userId',storeService.getOrder)
router.get('/payment/:paymentInfo', storeService.addPaymentInfo)
router.get('/deleteOrder/:orderId', storeService.deleteOrder)

module.exports = router
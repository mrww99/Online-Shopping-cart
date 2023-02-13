const Router = require('express').Router;

const userService = require('../services/userService');
const productService = require('../services/productService');
const storeService = require('../services/storeService');
const orderService = require('../services/orderService')
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
router.get('/fetchOrderItems/:idSet', productService.getOrderProducts)           //ok
router.get('/products/:storeId',productService.fetchProducts)           //ok
router.get('/findProduct/:productId', productService.findProduct)       //ok
router.post('/addProduct/:storeId', productService.addProduct)          
router.post('/deleteProduct/:productId', productService.deleteProduct)  
router.get('/comments/:productid', productService.getComments)          //ok
router.post('/addComment', productService.addComment)                   //ok
router.post('/addToCart', productService.addToCart)                     //ok
//store service routers
router.get('/storeList/:userId', storeService.getStoreList)             //ok
router.get('/getStore/:storeId', storeService.getStore)                 //ok
router.post('/deleteStore/:storeId', storeService.deleteStore)
router.post('/createStore/:userId', storeService.createStore)
//order service
router.get('/getOrder/:userId',storeService.getOrder)                   //not relevant
router.get('/payment/:paymentInfo', storeService.addPaymentInfo)        //not relevant
router.get('/deleteOrder/:orderId', storeService.deleteOrder)           //not relevant
router.get('/getOrders/:userId', orderService.getOrders)
//TODO
//fetch payed orders to myAccount                                                        (1)
//fetch unpayed order(can have only one)                                                 (2)
//view unpayed order items in checkout                                                   (3)
//if false unpayed order on addToCart create new unpayed order, add item to orderitem    (4)   
//if true unpayed order on addToCart add item to orderitem to that orderid               (5)
//delete item                                                                            (6)
//check out(order payed)                                                                 (7)


module.exports = router
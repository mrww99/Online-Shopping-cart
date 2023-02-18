import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from './Navbar';
import { Routes, Route } from 'react-router-dom'
import axios from 'axios';
import ProductList from './ProductList';
import StoreList from './StoreList';
import MyAccount from './MyAccount';
import MyStore from './MyStore';
import Checkout from './Checkout';
import ProductPage from './ProductPage';
import StorePage from './StorePage';
function Dashboard(props) {
    const userId = props.userId
    const [user, setUser] = useState()
    const [cart, setCart] = useState({})
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getOrders/${userId}`, {
            params: {
                status: 'unpayed'
            }
        })
            .then(res => {
                setCart(res.data);
            })
            .catch(error => console.log(error));
    }, [userId]);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getUser/${userId}`)
            .then(res => {
                setUser(res.data)
            })
            .catch(error => console.log(error))
    }, [userId])
    if (!user) {
        return null
    } else {

    }
    return (
        <>
            <div className='d-flex flex-row'>
                <div className='navbar'>
                    <Navbar user={user} cart = {cart} />
                </div>
                <div className='py-3'>
                    <Routes>
                        <Route path='/' element={<ProductList />} />
                        <Route path='/allProducts' element={<ProductList />} />
                        <Route path='/listOfStores' element={<StoreList />} />
                        <Route path='/myStore' element={<MyStore />} />
                        <Route path='/myAccount' element={<MyAccount />} />
                        <Route path='/checkout' element={<Checkout cart={[cart,setCart]}/>} />
                        <Route path='/productPage/:id' element={<ProductPage />} />
                        <Route path='/storePage/:id' element={<StorePage />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
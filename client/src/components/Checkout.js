import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Checkout(props) {
    const {cart} = props
    const [product, setProduct] = useState([])
    const [prevProductIds, setPrevProductIds] = useState([]);
    const cartarray = cart[0]
    const setCart = cart[1]
    let productIds
    if (cartarray!==0) { productIds = cartarray.map(item => item.product_productid) }
    const handleQuantChagne = (item, action) => {
        const requestQuery = { item, action }
        axios.post(`http://localhost:5000/api/changeQuantInCart`, {
            params: requestQuery
        })
            .then(res => {
                setCart(res.data)
            })
            .catch(error => console.log(error));
    }
    useEffect(() => {
        if (productIds.toString() !== prevProductIds.toString()) {
            setPrevProductIds(productIds);
            axios.get(`http://localhost:5000/api/fetchOrderItems/${productIds}`)
                .then(res => {
                    setProduct(res.data);
                })
                .catch(error => console.log(error));
        }
    }, [productIds]);
    return (
        <>
            <span className='fs-2'>Check Out</span>
            <div className='card checkoutCard my-4'>
                {cartarray.length === 0 ? (<p className='fs-6 my-3 mx-3'>Cart is empty </p>) : (
                    <table className="table my-0">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th className='gggg' scope="col">Product</th>
                                <th scope="col">Type</th>
                                <th scope="col">Color</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((order, index) => (
                                <tr className='fs-6' key={index}>
                                    <td>{index+1}</td>
                                    <td className='gggg'>{order.name}</td>
                                    <td>{order.type}</td>
                                    <td>{order.color}</td>
                                    <td>{order.price}zł</td>
                                    <td>
                                        <div className='btn-group sho'>
                                            <button onClick={() => { handleQuantChagne(cartarray[index].orderitemid, 1) }} className='btn btn-outline-danger plusminusbtn'>-</button>
                                            <div className='quantdiv'>n</div>
                                            <button onClick={() => { handleQuantChagne(cartarray[index].orderitemid, 2) }} className='btn btn-outline-success plusminusbtn'>+</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Checkout;
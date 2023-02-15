import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Checkout(props) {
    const cart = props.cart
    const [product, setProduct] = useState([])
    const [prevProductIds, setPrevProductIds] = useState([]);
    const productIds = cart.map(item => item.product_productid)

    const handleQuantChagne = (item, action) => {
        const requestQuery = { item, action }
        axios.post(`http://localhost:5000/api/changeQuantInCart`, {
            params: requestQuery
        })
            .then(res => {
                // setProduct([...product]);
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
    if (cart.length !== 0) console.log('Cart: ',cart)
    if (product.length !== 0) console.log('Products: ', product)
    return (
        <>
            <span className='fs-2'>Check Out</span>
            <div className='card checkoutCard my-4'>
                {cart.length === 0 ? (<p className='fs-6 my-3 mx-3'>Cart is empty </p>) : (
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
                                    <td>{index}</td>
                                    <td className='gggg'>{order.name}</td>
                                    <td>{order.type}</td>
                                    <td>{order.color}</td>
                                    <td>{order.price}zł</td>
                                    <td className='d-flex justify-content-center safsafq'>
                                        <button onClick={() => { handleQuantChagne(order.productid, 1) }} className='btn btn-outline-danger plusminusbtn mx-1 justify-content-center'>-</button>
                                        <span>{cart[index].quantity}</span>
                                        <button onClick={() => { handleQuantChagne(order.productid, 2) }} className='btn btn-outline-success plusminusbtn mx-1 justify-content-center'>+</button>
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
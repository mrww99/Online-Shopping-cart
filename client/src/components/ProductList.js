import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'

function ProductList(props) {
    const [products, setProducts] = useState([])
    const [productsStatus, setProductsStatus] = useState('')
    const cookie = Cookies.get('userId')

    let getProductsLink = ''
    if ('storeid' in props) {
        const storeId = props.storeid;
        getProductsLink = `http://localhost:5000/api/products/${storeId}`
    } else {
        getProductsLink = `http://localhost:5000/api/products/no`
    }
    const handleAddToCart = (id) => {
        axios.get(`http://localhost:5000/api/getOrders/${cookie}`)
        .then(res=>{
            console.log(res.data[0])
        })
        .catch(error=>console.log(error))
    }
    useEffect(() => {
        axios.get(getProductsLink)
            .then(res => {
                setProducts(res.data);
            })
            .catch(error => (setProductsStatus(error.response.data.error)));
    }, []);
    return (
        <>
            <span className='fs-2'>Products List</span>
            <div className='d-flex flex-row flex-wrap productList my-3'>
                {products.length !== 0 ? (
                    products.map((product, index) => (
                        <div key={index} className="card m-1 d-flex justify-content-between">
                            <Link className='text-decoration-none text-dark' to={`http://localhost:3000/productPage/${product.productid}`}>
                                <div className="card-body cardBody">
                                    <div className='d-flex flex-column'>
                                        <h5 className="card-title fs-4">{product.name}</h5>
                                        <p className='card-text fs-7 text-secondary'>Product type: {product.type}</p>
                                        <p className='card-text fs-7 text-secondary'>Color: {product.color}</p>
                                    </div>
                                    <p className='card-text my-2 fs-4'>{product.price}zł</p>

                                </div>
                            </Link>
                            <button onClick={() => handleAddToCart(product.productid)} className="btn btn-primary addToCartButton">Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p className='fs-6 text-muted'>{productsStatus}...</p>
                )

                }

            </div>
        </>
    );
}

export default ProductList;
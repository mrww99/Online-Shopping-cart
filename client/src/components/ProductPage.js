import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
function ProductPage(props) {
    const { id } = useParams();
    const [product, setProduct] = useState({})
    useEffect(() => {
        axios.get(`http://localhost:5000/api/findProduct/${id}`)
            .then(res => {
                setProduct(res.data);
            })
            .catch(error => console.log(error));
    }, [id]);
    console.log(product)
    return (
        <div className='my-5 mx-4'>
            <div className='itemTitle'>
                <p className='fs-2'>{product.name}</p>
                <p className='fs-1'>{product.price}zł</p>
            </div>
            <p className='text-muted'>Sold by
                <Link className='text-decoration-none' to={`http://localhost:3000/storePage/${product.store_storeid}`}>
                    <span className='text-success'> {product.store_name}</span>
                </Link>
            </p>
            <div className='my-5 itemTitle'>
                <div>
                    <p className='fs-5'>Type: {product.type}</p>
                    <p className='fs-5'>Color: {product.color}</p>
                </div>
                <button className='btn btn-primary addToCartButton'>Add to cart</button>
            </div>
        </div>
    );
}

export default ProductPage;
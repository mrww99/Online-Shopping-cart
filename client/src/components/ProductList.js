import React, { useEffect, useState } from 'react';
import axios from 'axios';
function ProductList(props) {
    const [products, setProducts] = useState([])
    let getProductsLink = ''
    if (props[0]) {
        console.log('yes')
        const storeId = props;
        getProductsLink = `http://localhost:5000/api/products/${storeId}`
    } else {
        getProductsLink = `http://localhost:5000/api/products/no`
    }
    useEffect(() => {
        axios.get(getProductsLink)
            .then(res => {
                setProducts(res.data);
            })
            .catch(error => console.log(error));
    }, []);
    return (
        <>
            <span className='fs-2'>Products List</span>
            <div className='d-flex flex-row flex-wrap productList my-3'>
                {products.map((product, index) => (
                    <div key={index} className="card m-1">
                        <div className="card-body cardBody">
                            <div className='d-flex flex-column'>
                                <h5 className="card-title">{product.name}</h5>
                                <p className='card-text fs-7 text-secondary'>Product type: {product.type}</p>
                                <p className='card-text fs-7 text-secondary'>Color: {product.color}</p>
                            </div>
                            <div className='d-flex justify-content-between buttonBlock mt-3'>
                                <button className="btn btn-primary">Add to Cart</button>
                                <p className='card-text fs-4'>{product.price}zł</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ProductList;
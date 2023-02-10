import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
function ProductPage(props) {
    const { id } = useParams();
    const [product, setProduct] = useState({})
    const [comments, setCommets] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:5000/api/findProduct/${id}`)
            .then(res => {
                setProduct(res.data);
            })
            .catch(error => console.log(error));
    }, [id]);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/comments/${id}`)
            .then(res => {
                setCommets(res.data);
            }).catch(error => console.log(error))
    }, [id])
    console.log(comments)
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
            <div>
                <span className='fs-4'>Comments</span>
                <div className="container my-5 py-5">
                    <div className="row d-flex justify-content-center">
                        <div className="card">
                            <div className="card-footer py-3 border-0 white">
                                <div className="d-flex flex-start w-100">
                                    <div className="form-outline w-100">
                                        <textarea className="form-control" id="textAreaExample" rows="2"></textarea>
                                    </div>
                                </div>
                                <div className="mt-2 pt-1">
                                    <button type="button" className="btn btn-primary btn-sm">Post comment</button>
                                </div>
                            </div>

                            {comments.length > 0 ? comments.map((comment, index) => (
                                <>
                                    <div key={index} className="card-body">
                                        <div className="d-flex flex-start align-items-center">
                                            <div>
                                                <h6 className="fw-bold text-primary mb-1">{comment.user_name}</h6>
                                                <p className="text-muted small mb-0">
                                                    Shared publicly - {comment.commentdate}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-3 mb-4 pb-2 fs-5">
                                            {comment.commenttext}
                                        </p>
                                        {index !== comments.length - 1 && <hr class="hr" />}
                                    </div>
                                </>

                            )) : <p className='mx-4 my-4 fs-5'>No user reviews yet ...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
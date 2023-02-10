import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { Link, useParams } from 'react-router-dom';
function ProductPage(props) {
    const { id } = useParams();
    const [product, setProduct] = useState({})
    const [comments, setCommets] = useState([])
    const [comment, setCommet] = useState([])
    const cookie = Cookies.get('userId')
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
    const handleChange = (e) => {
        setCommet(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestBody = { comment, id, cookie }
            await axios.post('http://localhost:5000/api/addComment', { requestBody });
            setCommet('')
            const newCommentsList = await axios.get(`http://localhost:5000/api/comments/${id}`)
            setCommets(newCommentsList.data)
        } catch (error) {
            console.log(error)
        }
    }
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
            <div className='mt-5 itemTitle'>
                <div>
                    <p className='fs-5'>Type: {product.type}</p>
                    <p className='fs-5'>Color: {product.color}</p>
                </div>
                <button className='btn btn-primary addToCartButton'>Add to cart</button>
            </div>
            <div>
                <div className="container mt-4 py-5">
                    <div className="row d-flex justify-content-center">
                        <div className="card">
                            <form onSubmit={handleSubmit} className="card-footer py-3 border-0 white">
                                <div className="d-flex flex-start w-100">
                                    <div className="form-outline w-100">
                                        <textarea value={comment} onChange={handleChange} className="form-control" id="textAreaExample" rows="2"></textarea>
                                    </div>
                                </div>
                                <div className="mt-2 pt-1">
                                    <button type="submit" className="btn btn-primary btn-sm">Post comment</button>
                                </div>
                            </form>
                            {comments.length > 0 ? comments.map((review, index) => (
                                <div key={index} className="card-body">
                                    <div className="d-flex flex-start align-items-center">
                                        <div>
                                            <h6 className="text-dark fs-5">{review.user_name}</h6>
                                            <p className="text-muted small mb-0">
                                                Posted {review.commentdate}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-2 mb-2 pb-2 fs-5">
                                        {review.commenttext}
                                    </p>
                                </div>
                            )) : <p className='mx-4 mb-5 fs-4'>No user reviews yet ...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';

function StorePage(props) {
    const { id } = useParams();
    const [store,setStore] = useState({})
    const [status, setStatus] = useState('')
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getStore/${id}`)
            .then(res => {
                setStore(res.data);
            })
            .catch(error => (setStatus(error.response.data.error)));
    }, []);
    return (
        <div>
            <span className='fs-2'>
                {store.name} <span className='fs-3'></span>
                <p className='fs-6 text-muted'>Powered by <span className='text-success'>{store.admin_name}</span></p>
            </span>
            <div className='storeDescription my-4'>
                <p className='fs-5'>{store.description}</p>
            </div>
            <ProductList storeid={id}></ProductList>
        </div>
    );
}

export default StorePage;
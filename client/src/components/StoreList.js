import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'

function StoreList(props) {
    const [stores, setStores] = useState([])
    const cookie = Cookies.get('userId')
    let getStoresLink = ''
    if (props[0]) {
        const storeId = props;
        getStoresLink = `http://localhost:5000/api/storeList/${cookie}`
    } else {
        getStoresLink = `http://localhost:5000/api/storeList/no`
    }
    useEffect(() => {
        axios.get(getStoresLink)
            .then(res => {
                setStores(res.data);
            })
            .catch(error => console.log(error));
    }, []);
    console.log(stores)
    return (
        <>
            <span className='fs-2'>Stores List</span>
            <div className='d-flex flex-rows flex-wrap productList my-3'>
                {stores.map((store, index) => (
                    <div key={index} className="card m-1 storeCard">
                        <div className="card-body cardBody">
                            <div className='d-flex flex-column'>
                                <h5 className="card-title">{store.name}</h5>
                                <p className='card-text fs-6 mb-2'>{store.description}</p>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default StoreList;
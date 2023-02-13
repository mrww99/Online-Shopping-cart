import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';

function AccountInfo(props) {
    const { popUpToggler, setPopUpToggler } = props;
    const [addresses, setAddresses] = useState([])
    const [cards, setCards] = useState([])
    const [orders, setOrders] = useState([])
    const cookie = Cookies.get('userId')
    const togglerState = (state) => {
        setPopUpToggler(state)
    }
    const handleAddressDelete = (index) => {
        const addressToDelete = addresses[index].addrid;
        axios.post(`http://localhost:5000/api/deleteAddress/${addressToDelete}`)
            .then(res => {
                if (res.status === 200) {
                    setAddresses(addresses.filter(address => address.addrid !== addressToDelete))
                }
            })
            .catch(error => console.log(error))
    }
    const handleCardDelete = (index) => {
        const cardToDelete = cards[index].cardid;
        axios.post(`http://localhost:5000/api/deleteCard/${cardToDelete}`)
            .then(res => {
                if (res.status === 200) {
                    setCards(addresses.filter(address => address.addrid !== cardToDelete))
                }
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        axios.get(`http://localhost:5000/api/addressList/${cookie}`)
            .then(res => {
                setAddresses(res.data);
            })
            .catch(error => console.log(error));
    }, [cookie]);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/cardList/${cookie}`)
            .then(res => {
                setCards(res.data);
            })
            .catch(error => console.log(error));
    }, [cookie]);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getOrders/${cookie}`, {
            params: {
                status: 'payed'
            }
        })
            .then(res => {
                setOrders(res.data);
            })
            .catch(error => console.log(error));
    }, [cookie]);
    return (
        <>
            <span className='fs-2'>My Account</span>
            <div className='d-flex flex-column myAccountBlock'>
                <div className='mt-4'>
                    <span className='fs-3'>My Orders</span>
                    <div className='infoRow'>
                        {orders.length !== 0 ? (
                            orders.map((order, index) => (
                                <div key={index} className="card infoCard m-1">
                                    <div className="card-body cardBody">
                                        <div className='d-flex flex-column'>
                                            <h5 className="card-title">{order.addrestitle}</h5>
                                            <p className='card-text fs-7 text-secondary'>Street: {order.street}</p>
                                            <p className='card-text fs-7 text-secondary'>Postal Code: {order.postalcode}</p>
                                            <p className='card-text fs-7 text-secondary'>Province: {order.province}</p>
                                            <p className='card-text fs-7 text-secondary'>City: {order.city}</p>
                                            <button className="btn btn-danger mt-3">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='my-3 mx-2 fs-5 text-muted'>No orders found</p>
                        )}
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='d-flex flex-row justify-content-between accountInfoButton'>
                        <span className='fs-3'>My Addresses</span>
                    </div>
                    <div className='infoRow'>
                        <button className='btn btn-light fs-4 my-1 addButton text-secondary' onClick={() => togglerState(1)}>Add New Address</button>
                        {addresses.length !== 0 ? (
                            addresses.map((address, index) => (
                                <div key={index} className="card infoCard m-1">
                                    <div className="card-body cardBody">
                                        <div className='d-flex flex-column'>
                                            <h5 className="card-title">{address.addrestitle}</h5>
                                            <p className='card-text fs-7 text-secondary'>Street: {address.street}</p>
                                            <p className='card-text fs-7 text-secondary'>Postal Code: {address.postalcode}</p>
                                            <p className='card-text fs-7 text-secondary'>Province: {address.province}</p>
                                            <p className='card-text fs-7 text-secondary'>City: {address.city}</p>
                                            <button className="btn btn-outline-danger mt-3" onClick={() => handleAddressDelete(index)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='my-3 mx-2 fs-5 text-muted'>No addresses found</p>
                        )
                        }
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='d-flex flex-row justify-content-between  accountInfoButton'>
                        <span className='fs-3'>My Cards</span>
                    </div>
                    <div className='infoRow'>
                        <button className='btn btn-light fs-4 my-1 addButton text-secondary' onClick={() => togglerState(2)}>Add New Card</button>
                        {cards.length !== 0 ? (
                            cards.map((card, index) => (
                                <div key={index} className="card infoCard m-1">
                                    <div className="card-body cardBody">
                                        <div className='d-flex flex-column'>
                                            <h5 className="card-title">{card.cardtitle}</h5>
                                            <p className='card-text fs-7 text-secondary'>Card number: {card.cardnumber}</p>
                                            <p className='card-text fs-7 text-secondary'>Expire date: {card.expiredate}</p>
                                            <p className='card-text fs-7 text-secondary'>Card Issuer: {card.cardissuer}</p>
                                            <p className='card-text fs-7 text-secondary'>Bank Code: {card.bankid}</p>
                                            <button className="btn btn-outline-danger mt-3" onClick={() => handleCardDelete(index)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='my-3 mx-2 fs-5 text-muted'>No cards found</p>
                        )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default AccountInfo;
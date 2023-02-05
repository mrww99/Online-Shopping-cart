import React, { useEffect } from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';
function AddAddress(props) {
    const [city, setCity] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [postalCode, setPostalCode] = React.useState("");
    const [street, setStreet] = React.useState("");
    const [province, setProvince] = React.useState("");
    const [addressTitle, setAddressTitle] = React.useState("");
    const { setPopUpToggler} = props;
    const [errorLable, setErrorLable] = React.useState()
    const cookie = Cookies.get('userId')
    const handleCancel = () => {
        setPopUpToggler(0);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const validationState = validateForm()
        if (validationState === true) {
            try {
                const newAddress = [city, phoneNumber, postalCode, street, province, addressTitle]
                axios.post(`http://localhost:5000/api/addNewAddress/${cookie}`, newAddress)
                    .then(res => {
                        if (res.status === 200) {
                            setErrorLable('');
                            setCity('');
                            setPhoneNumber('');
                            setPostalCode('');
                            setStreet('');
                            setProvince('');
                            setAddressTitle('');
                            handleCancel()
                        }
                    }).catch(error => setErrorLable(error))
            } catch (error) {
                setErrorLable(error)
            }
        } else {
            setErrorLable(validationState)
        }
    }
    const validateForm = () => {
        const cityRegex = /^[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*$/;
        const phoneNumberRegex = /^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d)+$/;
        const postalCodeRegex = /^[0-9]{5,10}$/;
        const streetRegex = /^[\p{L}0-9 .]+$/u;
        const provinceRegex = /^[a-zA-Z ]{2,30}$/;
        const addressTitleRegex = /^[a-zA-Z0-9 ]{2,30}$/;

        if (!cityRegex.test(city)) {
            return "Invalid city format";
        } else if (!phoneNumberRegex.test(phoneNumber)) {
            return "Invalid phone number format";
        } else if (!postalCodeRegex.test(postalCode)) {
            return "Invalid postal code format";
        } else if (!streetRegex.test(street)) {
            return "Invalid street format";
        } else if (!provinceRegex.test(province)) {
            return "Invalid province format";
        } else if (!addressTitleRegex.test(addressTitle)) {
            return "Invalid address title format";
        }
        return true;
    };

    return (
        <>
            <div className='d-flex flex-row justify-content-between accountInfoButton'>
                <span className="fs-3">Add address</span>
            </div>
            <div className='formBox'>
                {errorLable !== '' && (
                    <p className='text-danger fs-5'>{errorLable}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" className="form-control" id="city" value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" className="form-control" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" className="form-control" id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="street">Street</label>
                        <input type="text" className="form-control" id="street" value={street} onChange={e => setStreet(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="province">Province</label>
                        <input type="text" className="form-control" id="province" value={province} onChange={e => setProvince(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressTitle">Address Title</label>
                        <input type="text" className="form-control" id="addressTitle" value={addressTitle} onChange={e => setAddressTitle(e.target.value)} />
                    </div>
                    <div className='d-flex flex-rows'>
                        <button type="submit" className="btn btn-primary m-1">Submit</button>
                        <button className="btn btn-danger m-1" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddAddress;
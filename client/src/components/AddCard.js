import React from 'react';
import Select from "react-select";
import Cookies from 'js-cookie';
import axios from 'axios';
function AddCard(props) {
    const [cardnumber, setCardnumber] = React.useState("");
    const [bankid, setBankid] = React.useState("");
    const [expiredate, setExpiredate] = React.useState({ month: '01', year: '2022' });
    const [cardissuer, setCardissuer] = React.useState("");
    const cardIssuerOptions = [
        { value: 'Visa', label: 'Visa' },
        { value: 'Mastercard', label: 'Mastercard' },
        { value: 'American Express', label: 'American Express' },
        { value: 'Discover', label: 'Discover' },
        { value: 'Diners Club', label: 'Diners Club' },
        { value: 'JCB', label: 'JCB' },
    ];
    const bankIdOptions = [
        { value: 'PKO Bank Polski', label: 'PKO Bank Polski' },
        { value: 'mBank', label: 'mBank' },
        { value: 'ING Bank Śląski', label: 'ING Bank Śląski' },
        { value: 'Alior Bank', label: 'Alior Bank' },
        { value: 'Bank Millennium', label: 'Bank Millennium' },
    ];
    const handleMonthChange = (event) => {
        setExpiredate({ ...expiredate, month: event.target.value });
    };

    const handleYearChange = (event) => {
        setExpiredate({ ...expiredate, year: event.target.value });

    };
    const months = [
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
        { value: '09', label: '09' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
    ];

    const years = [
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' },
        { value: '2027', label: '2027' },
        { value: '2028', label: '2028' },
        { value: '2029', label: '2029' },
        { value: '2030', label: '2030' },
        { value: '2031', label: '2031' },
        { value: '2032', label: '2032' },
    ];
    const [cardtitle, setCardtitle] = React.useState("");
    const { setPopUpToggler } = props;
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
                const expireDateFormated = expiredate.month+'/'+expiredate.year
                const newCard = [cardnumber, bankid, expireDateFormated, cardissuer, cardtitle]
                console.log(newCard)
                axios.post(`http://localhost:5000/api/addNewCard/${cookie}`, newCard)
                    .then(res => {
                        if (res.status === 200) {
                            setErrorLable('');
                            setCardnumber('');
                            setBankid('');
                            setExpiredate('');
                            setCardissuer('');
                            setCardtitle('');
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
        const cardNumberRegex = /^\d{16}$/;
        const cardTitleRegex = /^[a-zA-Z0-9 ]{2,30}$/;
        if (!cardNumberRegex.test(cardnumber)) {
            return "Invalid card number format";
        } else if (!cardTitleRegex.test(cardtitle)) {
            return "Invalid card title format";
        }
        return true;
    };
    return (
        <div className='addForm'>
            <div className='d-flex flex-row justify-content-between accountInfoButton'>
                <span className="fs-2">Add card</span>
            </div>
            <div className='formBox'>
                {errorLable !== '' && (
                    <p className='text-danger fs-5'>{errorLable}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="street">Name your card</label>
                        <input type="text" className="form-control" id="street" value={cardtitle} onChange={e => setCardtitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardnumber">Card Number</label>
                        <input type="text" className="form-control" id="city" value={cardnumber} onChange={e => setCardnumber(e.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phoneNumber">Expare Date</label>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '20vw' }}>
                            <select
                                className="form-select"
                                value={expiredate.month}
                                onChange={handleMonthChange}
                                style={{ width: '100px', marginRight: '10px' }}
                            >
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-select"
                                value={expiredate.year}
                                onChange={handleYearChange}
                                style={{ width: '100px' }}
                            >
                                {years.map(year => (
                                    <option key={year.value} value={year.value}>
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode">Bank Name</label>
                        <div style={{ width: '20vw', margin: '1vh 0' }}>
                            <Select
                                options={bankIdOptions}
                                value={bankid}
                                onChange={(selectedOption) => setBankid(selectedOption)}
                            />
                        </div>

                    </div>
                    <div className="form-group">
                        <label htmlFor="province">Card Issuer</label>
                        <div style={{ width: '20vw', margin: '1vh 0' }}>
                            <Select
                                options={cardIssuerOptions}
                                value={cardissuer}
                                onChange={(selectedOption) => setCardissuer(selectedOption)}
                            />
                        </div>
                    </div>
                    <div className='d-flex flex-rows'>
                        <button type="submit" className="btn btn-primary m-1">Submit</button>
                        <button className="btn btn-danger m-1" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCard;
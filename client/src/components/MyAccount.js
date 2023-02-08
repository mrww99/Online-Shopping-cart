import React, { useState } from 'react';
import AddAddress from './AddAddress';
import AddCard from './AddCard';
import AccountInfo from './AccountInfo';
function MyAccount() {
    const [popUpToggler, setPopUpToggler] = useState(0)
    return (
        <div className='myAccount'>
            {popUpToggler === 1 ? <AddAddress popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler}/> : null}
            {popUpToggler === 2 ? <AddCard popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler} /> : null}
            {popUpToggler === 0 ? <AccountInfo popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler}/>
                : null}

        </div>
    );
}

export default MyAccount;
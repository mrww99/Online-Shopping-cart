import React, { useState } from 'react';
import AddAddress from './AddAddress';
import AddCard from './AddCard';
import AccountInfo from './AccountInfo';
function MyAccount(props) {
    const [popUpToggler, setPopUpToggler] = useState(0)
    return (
        <>
            {popUpToggler === 1 ? <AddAddress popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler}/> : null}
            {popUpToggler === 2 ? <AddCard popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler} /> : null}
            {popUpToggler === 0 ? <AccountInfo popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler}/>
                : null}

        </>
    );
}

export default MyAccount;
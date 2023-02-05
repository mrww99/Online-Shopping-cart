import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar(props) {
    const location = useLocation();
    const userName = props.user.name
    return (
        <div className='navbarblock'>
            <div className="d-flex flex-column p-3 ">
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <span className="fs-2">Online Market</span>
                </a>
                <ul className="nav nav-pills flex-column mb-auto my-4">
                    <li>
                        <Link className={`nav-link link ${location.pathname === '/allProducts' || location.pathname === '/' ? 'active' : ''}`} to='/allProducts'>
                            All Products
                        </Link>
                    </li>
                    <li className=''>
                        <Link className={`nav-link link ${location.pathname === '/listOfStores' ? 'active' : ''}`} to='/listOfStores'>
                            List of Stores
                        </Link>
                    </li>
                    <li>
                        <Link className={`nav-link link ${location.pathname === '/myStore' ? 'active' : ''}`} to='/myStore'>
                            My Store
                        </Link>
                    </li>
                    <li>
                        <Link className={`nav-link link ${location.pathname === '/myAccount' ? 'active' : ''}`} to='/myAccount'>
                            My Account
                        </Link>
                    </li>
                    <li>
                        <Link className={`nav-link link ${location.pathname === '/checkout' ? 'active' : ''}`} to='/checkout'>
                            Checkout
                        </Link>
                    </li>
                </ul>
                <div className='px-3 py-4 fixed-bottom welcomeLable'><p className='fs-4'>Welcome, {userName}</p></div>
            </div>
        </div>
    );
}

export default Navbar;
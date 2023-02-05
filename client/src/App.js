import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {Routes, Route } from 'react-router-dom'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Cookies from 'js-cookie'
import React from 'react';

function App() {
  const cookie = Cookies.get('userId')
  return (
    <>
          <Routes>
            <Route path='*' element={cookie ? <Dashboard userId = {cookie}/> : <Auth />} />
            <Route path='/auth' element={<Auth />} />
          </Routes>
    </>
  );
}

export default App;

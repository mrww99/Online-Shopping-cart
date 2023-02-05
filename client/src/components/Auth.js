import React, { useState } from "react"
import axios from 'axios'

function Auth() {
  let [authMode, setAuthMode] = useState("signin")
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }
  axios.defaults.withCredentials = true
  function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if (!phoneRegex.test(phoneNumber)) {
      return false
    }
    return true
  }
  function validateName(name) {
    const nameRegex = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/
    if (!nameRegex.test(name)) {
      return false
    }
    return true
  }
  async function handleLogin(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const phoneNumber = data.get('phoneNumber')
    const password = data.get('password')
    if(phoneNumber===''||password===''){
      alert('One or both of login fields are empty')
      return
    }
    if (!validatePhoneNumber(phoneNumber)) {
      alert('Invalid phone number')
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/login', { phoneNumber, password })
      .then((res) => {
        console.log(res.data)
        if (res.data.status === 'success') {
          window.location.href = '/';
          return;
        } else {
          alert('Invalid phone number or password. Please try again')
        }
      })
    } catch (error) {
      alert(error.response.data.message)
    }
    
  }
  async function handleRegistration(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name')
    const phoneNumber = data.get('phoneNumber')
    const password = data.get('password')
    if(phoneNumber===''||password===''||name===''){
      alert('One or all of registration fields are empty, retard')
      return
    }
    if (!validatePhoneNumber(phoneNumber)) {
      alert('Invalid phone number')
      return;
    }
    if (!validateName(name)) {
      alert('Invalid name given')
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/register', { name, phoneNumber, password })
      .then((res) => {
        if (res.data.status === 'success') {
          localStorage.setItem('phoneNumber', phoneNumber);
          window.location.href = '/';
        } else {
          alert('Name or phone number already taken')
        }
      })
    } catch (error) {
      alert(error.response.data.message)
    }
    
  }
  if (authMode === "signin") {
    return (

      <div className="Auth-form-container">
        <form onSubmit={handleLogin} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Phone number</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-control mt-1"
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control mt-1"
                placeholder="Enter password"
              />
            </div>
            <div className="d-grid gap-2 mt-3 mb-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
  return (
    <div className="Auth-form-container">
      <form onSubmit={handleRegistration} className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="name"
              name="name"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
            />
          </div>
          <div className="form-group mt-3">
            <label>Phone number</label>
            <input
              type="text"
              name="phoneNumber"
              className="form-control mt-1"
              placeholder="Email Address"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Password"
            />
          </div>
          <div className="d-grid gap-2 mt-3 mb-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Auth
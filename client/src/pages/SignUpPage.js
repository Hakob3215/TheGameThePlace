import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
    
        const name = e.target.name.value;
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
    
        fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, name, password })
          }).then((response) => {
            // response is a status code
            // 200: user exists
            // 201: email exists
            // 202: both exist
            // 203: neither exist, create user
            // 204: invalid email
            switch (response.status) {
              case 200:
                setLoginError('Username already taken!');
                break;
              case 201:
                setLoginError('Email already taken!');
                break;
              case 202:
                setLoginError('Username and email already taken!');
                break;
              case 203:
                setLoginError('');
                console.log('User created!')
                localStorage.setItem('unverifiedUser', JSON.stringify({
                    username: username,
                    email: email,
                    name: name,
                    password: password
                }));
                
                  // check if there is an unverified user in local storage
                  const unverifiedUser = JSON.parse(localStorage.getItem('unverifiedUser'));
                  console.log('unverified user:' + unverifiedUser);
                  if (!unverifiedUser) {
                      // if not, redirect to sign up page
                      navigate('/signup');
                  } else {
                      // if so, send a verification email
                      console.log(unverifiedUser.username + ' ' + unverifiedUser.password);
                      
                      // send verification code to email
                      fetch('/api/verification-email', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ email: unverifiedUser.email })
                      }).then(response => response.json()).then((data) => {
                          console.log(data.hashedCode);
                          // store the verification code in local storage
                          localStorage.setItem('verificationCode', data.hashedCode);
                      }).catch((error) => {
                          console.error('Error:', error);
                      });
                  }
                navigate('/verify-email');
                break;
              case 204:
                setLoginError('Invalid email!');
                break;
              default:
                alert('Error: Non 200 status code');
            }}).catch((error) => {
            console.error('Error:', error);
          });
              
    }

    return (
        <>
            <h1 className='signUpHeader'>Record/Remember Your Login Info (Username + Password)</h1>
            <form className='signUpForm' onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label><br/>
                <input type="text" id="name" name="name" required/><br/>
                <label htmlFor="email">Email:</label><br/>
                <input type="email" id="email" name="email" required/><br/>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" name="username" required/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" required/><br/>
                <input className='submitButton' type="submit" value="Sign Up"/>

                {loginError && <p className="error">{loginError}</p>}
            </form>
        </>
    );
}

export default SignUpPage;
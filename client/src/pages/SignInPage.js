import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

const SignInPage = () => {

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const username = e.target['username'].value;
        const password = e.target['password'].value;

        // send the username and password to the server to verify
        fetch('https://thegametheplacetheserver.onrender.com/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        }).then( (response) => {
            // response is a status code
            // 200: verified
            // 201: incorrect code
            console.log(username + ' ' + password);
            
            switch (response.status) {
                case 200:
                    console.log('Login successful!');
                    // store the current user in local storage
                    localStorage.setItem('user', username);
                    navigate('/board');
                    break;
                case 201:
                    alert('Incorrect username or password!');
                    break;
                case 500:
                    alert('Error: Server error');
                    break;
                default:
                    alert('Error: Non 200 status code');
            }
        }
        ).catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <>
            <h1 className='signInHeader'>Sign In To Access the Board</h1>
            <form className='signInForm' onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" name="username" required/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" required/><br/>
                <input className='submitButton' type="submit" value="Log In"/>
            </form>
        </>
    );
}

export default SignInPage;
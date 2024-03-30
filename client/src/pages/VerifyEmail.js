import React from 'react';
import { useNavigate } from 'react-router-dom';

import './VerifyEmail.css';

const VerifyEmail = () => {
    const navigate = useNavigate();



    function handleSubmit(e) {
        e.preventDefault();
        const verificationCode = e.target['verification-code'].value;
        const storedCode = localStorage.getItem('verificationCode');

        const unverifiedUser = JSON.parse(localStorage.getItem('unverifiedUser'));
        const email = unverifiedUser.email;
        const username = unverifiedUser.username;
        const password = unverifiedUser.password;
        const name = unverifiedUser.name;

        // send both codes to the server to verify with bcrypt
        fetch('/api/check-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, username, password, name, verificationCode, storedCode })
        }).then( (response) => {
            // response is a status code
            // 200: verified
            // 201: incorrect code
            console.log(verificationCode + ' ' + storedCode);
            
            switch (response.status) {
                case 200:
                    console.log('Email verified!');
                    localStorage.removeItem('unverifiedUser');
                    localStorage.removeItem('verificationCode');
                    navigate('/signin');
                    break;
                case 201:
                    alert('Incorrect verification code!');
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
        <div className="verify-email">
            <h1>Verify Your Email</h1>
            <p>Check your email for a verification code and enter it here!</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="verification-code" placeholder="Verification Code" />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
}

export default VerifyEmail;
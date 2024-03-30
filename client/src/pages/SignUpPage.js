import React from 'react';
import './SignUpPage.css';

const SignUpPage = () => {
    return (
        <>
            <h1 className='signUpHeader'>Sign Up For an Account and to Gain Access to the Board</h1>
            
            <form className='signUpForm'>
                <label htmlFor="name">Name:</label><br/>
                <input type="text" id="name" name="name" required/><br/>
                <label htmlFor="email">Email:</label><br/>
                <input type="email" id="email" name="email" required/><br/>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" name="username" required/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" required/><br/>
                <input className='submitButton' type="submit" value="Sign Up"/>
            </form>
        </>
    );
}

export default SignUpPage;
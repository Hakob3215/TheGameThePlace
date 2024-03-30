import React from 'react';
import './SignInPage.css';

const SignInPage = () => {
    return (
        <>
            <h1 className='signInHeader'>Sign In To Access the Board</h1>
            <form className='signInForm'>
                <label for="username">Username:</label><br/>
                <input type="text" id="username" name="username" required/><br/>
                <label for="password">Password:</label><br/>
                <input type="password" id="password" name="password" required/><br/>
                <input className='submitButton' type="submit" value="Log In"/>
            </form>
        </>
    );
}

export default SignInPage;
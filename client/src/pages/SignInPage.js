import React from 'react';
import './SignInPage.css';

const SignInPage = () => {
    return (
        <>
            <h1 className='signInHeader'>Sign In</h1>
            <form className='signInForm'>
                <label for="username">Username:</label><br/>
                <input type="text" id="username" name="username"/><br/>
                <label for="password">Password:</label><br/>
                <input type="password" id="password" name="password"/><br/>
                <input type="submit" value="Submit"/>
            </form>
        </>
    );
}

export default SignInPage;
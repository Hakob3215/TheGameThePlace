import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
    
    const user = localStorage.getItem('user');
    const handleSignOut = () => {
        localStorage.removeItem('user');
    }

    return (
        <nav className='navbar'>
            <h1><Link to='/'>The Game The Place</Link></h1>
            
            <ul>
                <li><Link to='/'>Home</Link></li>

                { !user ?(
            <>
                <li><Link to='/signin'>Sign In</Link></li>
                <li><Link to='/signup'>Sign Up</Link></li>
            </>
                )
                :
            <>
                <li><Link to='/board'>Board</Link></li>
                <li><a href='/' onClick={handleSignOut}>Sign Out</a></li>
            </>
                }
            </ul>
        </nav>
    )
}

export default Navbar;
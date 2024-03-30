import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className='navbar'>
            <h1><Link to='/'>The Game The Place</Link></h1>
            
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/signin'>Sign In</Link></li>
                <li><Link to='/signup'>Sign Up</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;
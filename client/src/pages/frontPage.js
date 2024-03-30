import React from 'react';
import './FrontPage.css';
import { Link } from 'react-router-dom';


const FrontPage = () => {
    return (<>
            <h1 className='title'>THE GAME THE PLACE</h1>
            <div className='frontPageButtons'>
                <Link className='signbutton' to='/signin'>Sign In</Link>
                <Link className='signbutton' to='/signup'>Sign Up</Link>
            </div>
            <h1 className='descriptionTitle'>What even is this?</h1>
            <p className='description'>[<strong>It is essentially Reddit's r/Place</strong>]<br/> But, its for The Game{'\u2122'} Discord! <br/> <br/> If you don't know what r/Place is... <br/> <br/> &nbsp;&nbsp;&nbsp;&nbsp; It is essentially a canvase comprised of a certain amount of pixels, where each player can pick a color and set one pixel to that color! Afterwards, they are placed on a cooldown and cannot change the color of another pixel until the cooldown is over.</p>
        <p className='credits'>Created by Hakob Atajyan, 2024</p>
        </>);
}

export default FrontPage;
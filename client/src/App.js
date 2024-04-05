import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './pages/FrontPage.js';
import SignInPage from './pages/SignInPage.js';
import SignUpPage from './pages/SignUpPage.js';
import VerifyEmail from './pages/VerifyEmail.js';
import Board from './pages/Board.js';
import Leaderboard from './pages/Leaderboard.js';
import Navbar from './objects/Navbar.js';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><Navbar/><FrontPage/></>} />
                <Route path="/signin" element={<><Navbar/><SignInPage/></>} />
                <Route path="/signup" element={<><Navbar/><SignUpPage/></>} />
                <Route path="/verify-email" element={<><Navbar/><VerifyEmail/></>} />
                <Route path="/board" element={<><Navbar/><Board /></>} />
                <Route path="/leaderboard" element={<><Navbar/><Leaderboard /></>} />
            </Routes>
        </Router>
    );
}

export default App;
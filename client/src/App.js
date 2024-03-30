import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './objects/Navbar';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><Navbar/><FrontPage/></>} />
                <Route path="/signin" element={<><Navbar/><SignInPage/></>} />
                <Route path="/signup" element={<><Navbar/><SignUpPage/></>} />
                <Route path="/verify-email" element={<><Navbar/><VerifyEmail/></>} />
            </Routes>
        </Router>
    );
}

export default App;
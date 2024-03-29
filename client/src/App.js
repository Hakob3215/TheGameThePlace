import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './pages/FrontPage';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FrontPage/>} />
            </Routes>
        </Router>
    );
}

export default App;
import React from 'react';
import { useEffect, useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {

    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetch('https://thegametheplacetheserver.onrender.com/api/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            setLeaderboard(data);
        });
    }, []);

    return (
        <>
        <div className='leaderboard'>
            <h1 className='leaderboardTitle'>Pixels Placed</h1>
            <ol className='leaderboardList'>
                {leaderboard.map((user, index) => {
                    return (
                        <li key={index} className='leaderboardItem'>
                            <strong>{user.username}</strong> {user.pixelCount}
                        </li>
                    )
                })}
            </ol>
        </div>
        </>
    )
};

export default Leaderboard;
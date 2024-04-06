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
                    // first place is gold, second is silver, third is bronze
                    let isTop3 = true;
                    let styleColor = '';
                    let fontSize = '20px';
                    if (index === 0) {
                        styleColor = 'gold';
                        fontSize = '29px';
                    } else if (index === 1) {
                        styleColor = 'silver';
                        fontSize = '26px';
                    } else if (index === 2) {
                        styleColor = '#CD7F32';
                        fontSize = '21px';
                    } else {
                        isTop3 = false;
                    }
                    return (
                        !isTop3 ?
                        <li key={index} className='leaderboardItem'>
                            <strong>{user.username}</strong> <span style={{fontSize: '30px'}}>{user.pixelCount}</span>
                        </li> :
                        <li key={index} className='topLeaderboardItem' style={{backgroundColor: styleColor, boxShadow: `0 0 10px ${styleColor}`}}>
                            <strong style={{fontSize: fontSize}}>{user.username} </strong> <span style={{fontSize: '30px'}}>{user.pixelCount}</span>
                        </li>
                    )
                })}
            </ol>
        </div>
        </>
    )
};

export default Leaderboard;
import React, { useEffect } from 'react';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Board.css';
import io from 'socket.io-client';
import ReactCountdownClock from 'react-countdown-clock';
import LoadingMessage from '../objects/LoadingMessage';

const socket = io.connect('https://thegametheplacetheserver.onrender.com');


function Square({coords, color, onClick, onRightClick}){
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <button 
            className='square' 
            style={{backgroundColor: color, position: 'relative'}} 
            onClick={onClick}
            onContextMenu={onRightClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isHovered && (
                coords.j > 4 ?
                <div style={{ 
                    position: 'absolute',
                    top: '-40px', 
                    left: '-50px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                    padding: '5px',
                    zIndex: '1000',
                }}>
                    {`${coords.j+1}, ${coords.i+1}`}
                </div>
                :
                <div style={{ 
                    position: 'absolute',
                    top: '-40px', 
                    right: '-50px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                    padding: '5px',
                    zIndex: '1000',
                }}>
                    {`${coords.j+1}, ${coords.i+1}`}
                </div>
            )}
        </button>
    );
}

const Board = () => {
    const navigate = useNavigate();
    const BoardLength = 160;
    const BoardHeight = 75;
    const [colors, setColors] = useState(Array(BoardHeight).fill().map(() => Array(BoardLength).fill('#ffffff')));
    const [currentColor, setCurrentColor] = useState(localStorage.getItem('color') || '#000000');
    const [boardLoaded, setBoardLoaded] = useState(false);

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const waitTime = 3 * 60000;

    useEffect(() => {
        const user = localStorage.getItem('user');
        setCurrentColor(localStorage.getItem('color') || '#000000');
        if (!user) {
            // if not signed in, redirect to sign in page
            navigate('/signin');
        }
    }, [setCurrentColor,navigate]);

    useEffect(() => {
    // handle tab switching/application switching
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setBoardLoaded(false);
            } else {
                fetch('https://thegametheplacetheserver.onrender.com/api/get-grid').then((response) => 
                response.json()).then((data) => {
                    setColors(data);
                    setBoardLoaded(true);
                });
            }
        }
        // load the board on initial render
        fetch('https://thegametheplacetheserver.onrender.com/api/get-grid').then((response) => 
        response.json()).then((data) => {
            setColors(data);
            setBoardLoaded(true);
        });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            // handle cleanup
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        }, [setColors]);

    useEffect(() => {
        // check if the timer is currently running
        const endTime = localStorage.getItem('endTime');
        if (endTime && Date.now() < endTime) {
            setIsTimerRunning(true);
        }
    }, [setIsTimerRunning]);

    // websocket event listener for real-time updates
    // utilizes just the coordinates and color for efficiency
    socket.on('update-grid', (data) => {
        // server sends a coordinate and color
        let newColors = [...colors];
        newColors[data.i][data.j] = data.color;
        setColors(newColors);
    });

    const handleSquareClick = useCallback( async (i,j) => {

        if (i === 20 || j === 20) {
            // if the user clicks on the 21 square, its time for funnies
            const audioFunny = new Audio("/funny.mp3");
            audioFunny.play();
        }
        const user = localStorage.getItem('user');
        // if the timer is running, or the color is the same (ie; nothing would happen), do nothing
        if(isTimerRunning || currentColor === colors[i][j]){
            return;
        }
        const response = await fetch('https://thegametheplacetheserver.onrender.com/api/check-timer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentUser: user})
        });
        // response is a sstatus code
        // 200 - all good (no wait time)
        // 201 - wait time is there
        // 500 - server error
        switch (response.status) {
            case 200:
                // nothing to do, just proceed
                break;
            case 201:
                // according to the db, the user has to wait
                // get the end time from the server
                const data = await response.json();
                setIsTimerRunning(true);
                localStorage.setItem('endTime', data.endTime);
                return;
            case 500:
                // server error
                console.log('Server error');
                return;
            default:
                // somehow, weird status code
                console.log('Non 200/201/500 status code');
                return;
        }
        setIsTimerRunning(true);

        localStorage.setItem('endTime', Date.now() + waitTime);

        let newColors = [...colors];
        newColors[i][j] = currentColor;
        setColors(newColors);
        // send the updated grid to the server
        fetch('https://thegametheplacetheserver.onrender.com/api/update-grid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({i, j, color: currentColor})
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error('Error:', error);
        });

    }, [colors,currentColor,isTimerRunning,waitTime]);
    
    const handleColorChange = (color) => {
        localStorage.setItem('color', color);
        setCurrentColor(color);
    }
    const handleRightClick = useCallback((event,i,j) => {
        event.preventDefault();
        setCurrentColor(colors[i][j]);
    }, [colors]);
    const board = useMemo(() => {
        let newBoard = [];
        for (let i = 0; i < BoardHeight; i++) {
            let row = [];
            for (let j = 0; j < BoardLength; j++) {
                row.push(<Square key={`${j},${i}`} coords={{j,i}} color={colors[i][j]} onClick={(() => handleSquareClick(i,j))} onRightClick={(e) => handleRightClick(e,i,j)}/>);
            }
            newBoard.push(<div key={i} className='board-row'>{row}</div>)
        }
        return newBoard;
    }, [colors,handleSquareClick, handleRightClick]);

    return (
        boardLoaded ?
        <>
            <div className='board'>
                {board}
            </div>
            <div className='color-selection'>
            <div className='timer'>
            { isTimerRunning &&<ReactCountdownClock seconds={(localStorage.getItem('endTime') - Date.now()) / 1000} weight={0} color="#000" alpha={.9}size={70} 
            onComplete={() => {
                setIsTimerRunning(false);
                localStorage.removeItem('endTime');
                }}/>}
            </div>
            <div className='color-buttons'>
                <div className='color-button-row'>
                    <button className='color-button' onClick={() => handleColorChange('#6d001a')} style={{backgroundColor: '#6d001a'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#be0039')} style={{backgroundColor: '#be0039'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ff4500')} style={{backgroundColor: '#ff4500'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ffa800')} style={{backgroundColor: '#ffa800'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ffd635')} style={{backgroundColor: '#ffd635'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#fff8b8')} style={{backgroundColor: '#fff8b8'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#00a368')} style={{backgroundColor: '#00a368'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#00cc78')} style={{backgroundColor: '#00cc78'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#7eed56')} style={{backgroundColor: '#7eed56'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#00756f')} style={{backgroundColor: '#00756f'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#009eaa')} style={{backgroundColor: '#009eaa'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#00ccc0')} style={{backgroundColor: '#00ccc0'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#2450a4')} style={{backgroundColor: '#2450a4'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#3690ea')} style={{backgroundColor: '#3690ea'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#51e9f4')} style={{backgroundColor: '#51e9f4'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#493ac1')} style={{backgroundColor: '#493ac1'}}></button>
                </div>
                <div className='color-button-row'>
                    <button className='color-button' onClick={() => handleColorChange('#6a5cff')} style={{backgroundColor: '#6a5cff'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#94b3ff')} style={{backgroundColor: '#94b3ff'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#811e9f')} style={{backgroundColor: '#811e9f'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#b44ac0')} style={{backgroundColor: '#b44ac0'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#e4abff')} style={{backgroundColor: '#e4abff'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#de107f')} style={{backgroundColor: '#de107f'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ff3881')} style={{backgroundColor: '#ff3881'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ff99aa')} style={{backgroundColor: '#ff99aa'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#6d482f')} style={{backgroundColor: '#6d482f'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#9c6926')} style={{backgroundColor: '#9c6926'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ffb470')} style={{backgroundColor: '#ffb470'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#000000')} style={{backgroundColor: '#000000'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#515252')} style={{backgroundColor: '#515252'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#898d90')} style={{backgroundColor: '#898d90'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#d4d7d9')} style={{backgroundColor: '#d4d7d9'}}></button>
                    <button className='color-button' onClick={() => handleColorChange('#ffffff')} style={{backgroundColor: '#ffffff'}}></button>
                </div>
            </div>
            <input type='color' className='color-picker' value={currentColor} onChange={(event) => handleColorChange(event.target.value)}></input>
            </div>
        </>
        :
        <LoadingMessage time={500}/>
    );
}

export default Board;
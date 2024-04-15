import React from 'react';
import { useEffect, useState } from 'react';
import './LoadingMessage.css';

function LoadingMessage({time}) {
    const [loadText, setLoadText] = useState('Loading...');
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadText((prevLoadingText) => {
                switch (prevLoadingText) {
                    case 'Loading.':
                        return 'Loading..';
                    case 'Loading..':
                        return 'Loading...';
                    case 'Loading...':
                        return 'Loading.';
                    default:
                        return 'Loading...';
                }
            });
        }, time);
        return () => clearInterval(interval);
    }, [time]);
    return <h1 className='loading'>{loadText}</h1>;
}

export default LoadingMessage;
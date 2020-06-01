import React from 'react';
import './style.css';

import Button from '../../components/Button';

export default function Index() {
    return (
        <div className='header'>
            <div className="title">
                <h1 style={{padding:'10px 0px'}}>Appointment System</h1>
                <Button borderRadius='2rem'>Get Started</Button>
            </div>
            <div className="arrow-down"><span>^</span></div>
        </div>
    )
}

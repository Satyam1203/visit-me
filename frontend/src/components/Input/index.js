import React from 'react';
import './Input.css';

function Index(props) {
    return (
        <div className="input-div">
            <input type={props.type} name={props.name} inputMode={props.inputMode} onChange={props.onChange} min={props.min} autoComplete="off" required  />
            
            <label htmlFor="name-input" className="label-input">
                    <span className="label-text">{props.label}</span>
                    <span className="up-label-text">{props.upLabel}</span>
            </label>
        </div>
    )
}

export default Index

import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';


function Index(props) {
    return (
        <div className="content-desc" style={{flexDirection: props.direction}}>
            <div>
                <h3>{props.title}</h3>
                <p>{props.description}</p>
                <span><Link to={props.link}>{props.button}</Link></span>
            </div>
            <div className="content-img">
                <img src={props.img} alt='img' />
            </div>
        </div>
    )
}

export default Index;

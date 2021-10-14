import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
    background-color: darkslateblue;
    padding: 0.8rem 2rem;
    border-radius: 5px;
    border: none;
    font-weight: bold;
    font-size:1rem;
    color:#FFF;
    letter-spacing:1px;
    cursor:pointer;
    box-shadow: 1px 2px 3px 1px grey;
    // border-bottom: 3px solid rgba(189, 168, 245, 0.651);
    // border-right: 1px solid rgba(189, 168, 245, 0.651);
    &:active{
        box-shadow: none;
        // border-bottom: 3px solid transparent;
        // border-right: 1px solid transparent;
    }
`;

export default function Index(props) {
    return (
        <Button style={{borderRadius: props.borderRadius, outline: '0px'}}>
            {props.children}
        </Button>
    )
}

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
    outline: 0px;
    cursor:pointer;
    border-bottom: 3px solid rgba(189, 168, 245, 0.651);
    border-right: 1px solid rgba(189, 168, 245, 0.651);
    &:active{
        border-bottom:0;
    }
`;

export default function Index(props) {
    return (
        <Button>
            {props.children}
        </Button>
    )
}

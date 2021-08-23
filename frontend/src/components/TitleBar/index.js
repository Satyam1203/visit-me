import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    padding-left:2rem;
    align-items:center;
    background-color: darkslateblue;

    h2 a{
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }
`;

function Index() {
    return (
        <Title>
            <h2 style={{ color: '#FFF' }}><Link to="/">visit.me</Link></h2>
            <Link to="/" style={{color: 'white'}}>Home</Link>
        </Title>
    )
}

export default Index;

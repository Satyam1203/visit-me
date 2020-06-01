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
`;

function Index() {
    return (
        <Title>
            <h2 style={{ color: '#FFF' }}>Appointment System</h2>
            <Link to="/" style={{color: 'white'}}>Home</Link>
        </Title>
    )
}

export default Index;

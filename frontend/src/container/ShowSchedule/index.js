import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Input from '../../components/Input';
import Button from '../../components/Button';

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-content:center;
    justify-content: center;
    padding:20px;
`;

function Index() {
    const [date, setDate] = useState('');
    const [schedule, setSchedule] = useState([]);

    const show = (e)=>{
        e.preventDefault();
        axios({
            method: 'POST',
            url:'http://localhost:8080/schedule', 
            data: {
                date
            }
        })
        .then((res)=>{
            if(res.data.err) {
                console.log(res.data.err);
                setSchedule([]);
                // error.current.innerHTML=res.data.err;
            }
            else {
                console.log(res.data);
                document.querySelector("#form-schedule").reset();
                setSchedule(res.data.timings);
                // error.current.innerHTML='';
            }
        })
        .catch(e=>{
            console.error(e);
        })
    }


    return (
        <>
            <h1>See available list of slots</h1>
            <MainDiv>
                <form id="form-schedule" onSubmit={show}>
                    <Input type="date" upLabel="Date" name="date" inputMode="none" onChange={(e)=> setDate(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>
            </MainDiv>
            <div>
            {
                schedule.map((s,i)=> (
                        <div key={i}>
                            {s[0]} - {s[1]}
                        </div>
                    )
                )
            }
            </div>
        </>
    )
}

export default Index;

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Input from '../../components/Input';
import Button from '../../components/Button';
import TitleBar from '../../components/TitleBar';

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
            url:`${process.env.REACT_APP_SERVER_URL}/schedule`, 
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
        <div style={{height: '93vh'}}>
            <TitleBar />
            <h3 style={{marginTop: '50px'}}>See available list of slots</h3>
            <MainDiv>
                <form id="form-schedule" onSubmit={show}>
                    <Input type="date" upLabel="Date" name="date" inputMode="none" onChange={(e)=> setDate(e.target.value)} 
                        min={`${(new Date()).getFullYear()}-${Number((new Date()).getMonth())<9 ? `0${Number((new Date()).getMonth())+1}` : Number((new Date()).getMonth())+1}-${Number((new Date()).getDate())<10 ? `0${(new Date()).getDate()}` :(new Date()).getDate()}`}    
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </MainDiv>
            <div>
            {
                schedule.map((s,i)=> (
                        <div key={i} style={{padding: '8px'}}>
                            {s[0]} - {s[1]}
                        </div>
                    )
                )
            }
            </div>
        </div>
    )
}

export default Index;

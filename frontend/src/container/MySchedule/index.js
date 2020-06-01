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
    const [email, setEmail] = useState('');
    const [detail, setDetail] = useState([]);

    const show = (e)=>{
        if(e) e.preventDefault();
        axios({
            method: 'POST',
            url:'http://localhost:8080/show-appt', 
            data: {
                email
            }
        })
        .then((res)=>{
            if(res.data.err) {
                console.log(res.data.err);
                setDetail([]);
                // error.current.innerHTML=res.data.err;
            }
            else {
                console.log(res.data);
                document.querySelector("#form-show").reset();
                setDetail(res.data.detail);
                // error.current.innerHTML='';
            }
        })
        .catch(e=>{
            console.error(e);
        })
    }

    const deleteAppointment = (id)=>{
        axios({
            method: 'POST',
            url: `http://localhost:8080/remove-appt/${id}`
        })
        .then(res=>{
            if(res.data.msg) {
                console.log(res.data.msg);
                show();
            }
            else console.error(res.data.err);
        })
        .catch(e=>{
            console.error(e);
        })
    }

    
    return (
        <>
            <h1>See my appointments</h1>
            <MainDiv>
                <form id="form-show" onSubmit={show}>
                    <Input type="email" label="Email" name="email" inputMode="email" onChange={(e)=> setEmail(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>
            </MainDiv>
            <div>
            {
                detail.map((dt, i)=> (
                        <div key={i}>
                            {dt.aDate}  |  {dt.aTime}  |  {dt.bookingDate}  |  <button onClick={()=> deleteAppointment(dt._id)}>Remove</button>
                        </div>
                    )
                )
            }
            </div>
        </>
    )
}

export default Index;
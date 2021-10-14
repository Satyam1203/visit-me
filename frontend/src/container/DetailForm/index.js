import React, { useState, useRef } from 'react';
import axios from 'axios';
import './style.css';

import Button from '../../components/Button';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';

function Index() {
    const [name, setName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const error = useRef();

    const addAppointment = (e)=>{
        e.preventDefault();
        axios({
            method: 'POST',
            url:`${process.env.REACT_APP_SERVER_URL}/add-appt`, 
            data: {
                name, purpose, date, time, phone, email
            }
        })
        .then((res)=>{
            if(res.data.err) {
                console.log(res.data.err);
                error.current.innerHTML=res.data.err;
            }
            else {
                console.log(res.data);
                document.querySelector("#form-add").reset();
                error.current.innerHTML='';
            }
        })
        .catch(e=>{
            console.error(e);
        })
    }

    return (
        <div className="add-form" style={{height: '93vh'}}>
            <TitleBar />
            <h3>Add a Visiting Schedule</h3>
            {/* {console.log(name, purpose, date, time, phone, email)} */}
            <div className="form-div">
                <form id="form-add" onSubmit={addAppointment}>
                    <Input type="text" label="Name" name="name" onChange={(e)=> setName(e.target.value)} />
                    <Input type="text" label="Visiting Purpose" name="purpose" onChange={(e)=> setPurpose(e.target.value)} />
                    <Input type="date" upLabel="Date" name="date" inputMode="none" onChange={(e)=> setDate(e.target.value)} 
                        min={`${(new Date()).getFullYear()}-${Number((new Date()).getMonth())<9 ? `0${Number((new Date()).getMonth())+1}` : Number((new Date()).getMonth())+1}-${Number((new Date()).getDate())<10 ? `0${(new Date()).getDate()}` :(new Date()).getDate()}`}    
                    />
                    <Input type="time" upLabel="Time" name="time" inputMode="text" onChange={(e)=> setTime(e.target.value)} />
                    <Input type="text" label="Phone" name="Phone" inputMode="numeric" onChange={(e)=> setPhone(e.target.value)} />
                    <Input type="email" label="Email" name="Email" inputMode="email" onChange={(e)=> setEmail(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>
                <span ref={error} style={{color:'red'}}></span>
            </div>
        </div>
    )
}

export default Index
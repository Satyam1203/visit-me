import React, { useState, useRef } from 'react';
import axios from 'axios';
import './DetailForm.css';

import Button from '../../components/Button';
import Input from '../../components/Input';

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
            url:'http://localhost:8080/add-appt', 
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
        <>
            <h1>Add a Visiting Schedule</h1>
            {/* {console.log(name, purpose, date, time, phone, email)} */}
            <div className="form-div">
                <form id="form-add" onSubmit={addAppointment}>
                    <Input type="text" label="Name" name="name" onChange={(e)=> setName(e.target.value)} />
                    <Input type="text" label="Visiting Purpose" name="purpose" onChange={(e)=> setPurpose(e.target.value)} />
                    <Input type="date" upLabel="Date" name="date" inputMode="none" onChange={(e)=> setDate(e.target.value)} />
                    <Input type="time" upLabel="Time" name="time" inputMode="text" onChange={(e)=> setTime(e.target.value)} />
                    <Input type="text" label="Phone" name="Phone" inputMode="numeric" onChange={(e)=> setPhone(e.target.value)} />
                    <Input type="email" label="Email" name="Email" inputMode="email" onChange={(e)=> setEmail(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>
                <span ref={error} style={{color:'red'}}></span>
            </div>
        </>
    )
}

export default Index

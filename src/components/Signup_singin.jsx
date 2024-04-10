import axios from "axios"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil";
import { userAtom } from "../store/atoms/user";
import { useNavigate } from 'react-router-dom';

export default function Signup () {

    console.log('Signup render!')
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();
    const backendURI = "http://localhost:3001/api/v1/user/";
    const [state, setState] = useState('signin');
    const [msg, setMsg] = useState('');
    let formData = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
    };

    function handleChange(event) {
        const {name, value} = event.target;
        formData = {...formData, [name]: value};
    }

    function handleSubmit(ev) {

        ev.preventDefault();
        axios.post(backendURI + state, formData, {withCredentials: true})
        .then(res => {
            console.log(res.data);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            // navigate('/dashboard');
        })
        .catch(error => {
            if(error.response?.data.msg) {
                setMsg(error.response.data.msg);
                setTimeout(()=> {
                    setMsg('');
                }, 4000);
            };
            console.log("ERROR: ", error.message)}
        );
        ev.target.reset();
    }
    useEffect(()=> {
        if(localStorage.getItem("user")) navigate('/dashboard');

    }, [user]);

    return (
        <div className="flex justify-center items-center w-full h-screen bg-slate-400"> 
            <div className="flex flex-col justify-center items-center gap-5 py-10 bg-white/70 w-1/3 rounded-lg">
                <div className="text-center flex flex-col gap-3">
                    <h1 className="text-3xl font-bold">{state == 'signup' ? 'Sign up' : 'Sign in'}</h1>
                    <h3 className="text-md text-gray-600">{state == 'signup' ?
                     'Enter your information to create an account' : 
                     'Enter your credentials to access your account'}</h3>
                </div>
                <form onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center gap-3 w-full">

                    {msg != '' ? <p className="text-white bg-red-500 p-2 rounded-md m-1">{msg}</p> : null}
                    <Input label={"Username"} name={"username"} type={"text"} placeholder={"John_doe"} handleChange={handleChange}/>

                    {state == 'signup' ? 
                    <>
                        <Input label={"First Name"} type={"text"} name={"firstName"} placeholder={"John"} handleChange={handleChange} />
                        <Input label={"Last Name"} type={"text"} name={"lastName"} placeholder={"Doe"} handleChange={handleChange} />
                    </>:
                     null }
                     
                    <Input label={"Password"} type={"password"} name={"password"} placeholder={"&*78fd8j#$kj"} handleChange={handleChange} />

                    <div className="text-center mt-3">
                        <button type="submit"
                        className="w-full mb-3 px-5 py-2 bg-black/80 rounded-md text-white outline-none border border-white/50">{state == 'signup' ? 'Register' : 'Login'}</button>
                        {state == 'signup' ? 
                            <p>Already have a account ? <a className="text-black underline cursor-pointer" onClick={() => setState('signin')}>Login</a></p> :
                            <p>Don't have a account ? <a className="text-black underline cursor-pointer" onClick={() => setState('signup')}>Register</a></p>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

function Input({label, name, type, placeholder, handleChange}) {
    return (
        <div className="flex flex-col w-2/3">
            <label className="font-semibold mb-1">{label}</label>
            <input type={type}
                    name={name}
                    onChange={handleChange}
                    placeholder = {placeholder}
                    className="p-1 rounded-lg outline-none pl-3" required/>
        </div>
    )
}
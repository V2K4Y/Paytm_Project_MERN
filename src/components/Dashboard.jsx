import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {

    console.log('dashboard render !')
    const backendURI = "http://localhost:3001/api/v1/";
    const navigate = useNavigate();
    if(!localStorage.getItem('user')) {navigate("/");}
    const [allUsers, setAllUsers] = useState([]);
    const [balance, setBalance] = useState('');
    let timeout = 0;

    function handleChange(ev) {
        clearTimeout(timeout);
        timeout = setTimeout(()=> {
            const filter = ev.target.value.trim();
            axios.get(backendURI + 'user/?filter='+filter, {withCredentials: true})
        .then(res=> {setAllUsers(res.data.user)})
            .catch(error => {
                if(error.response) {
                    setAllUsers([]);
                } else {
                    console.log("ERROR: ", error.message);
                }
            });
        }, 500)
    }

    function handleMoney(item) {
        const name = `${item.firstName} ${item.lastName}`;
        navigate(`/sendMoney/?to=${item._id}&name=${name}`);
    }

    useEffect(()=> {
        axios.get(backendURI + 'account/balance', {withCredentials: true})
        .then(res => setBalance(res.data.balance))
        .catch(error => {
            console.log("ERROR: ", error);
            localStorage.removeItem('user');
            navigate('/')});

        axios.get(backendURI + "user/?filter=", {withCredentials: true})
        .then(res => setAllUsers(res.data.user))
        .catch(error => {
            if(error.response) setAllUsers([]);
            else console.log("ERROR: ", error);
        });
    }, [])

    
    return (
        <div className="h-screen w-screen">

            <div className="flex flex-col gap-10 p-10 md:h-screen">
                <Header balance={balance} setBalance={setBalance}/>
                <div className="h-fit w-1/3 p-2 rounded-md px-10">
                    <input type="text" onChange={handleChange} placeholder="Search Users" className="w-full outline-double outline-gray-300 px-5 py-1 rounded-md outline-none"/>
                </div>
                <div className="flex flex-col gap-5">
                    <b className="text-xl">Current Users: </b>
                    <div className="text-center flex flex-col gap-3">
                        {allUsers.map((item, index) => (
                            <div key={index} className="px-10 flex justify-between border-b border-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex justify-center items-center">
                                        <p className="text-white capitalize font-bold text-md">{item.firstName[0]}</p>
                                    </span>
                                    <p className="text-lg capitalize">{item.firstName + ' ' + item.lastName}</p>
                                </div>
                                <button className="px-3 py-1 mb-2 bg-blue-500 text-white rounded-md self-end" onClick={ev => handleMoney(item)}>Send money</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="text-center bg-slate-400 p-10 md:h-screen">
                
            </div>            
        </div>
    )
}

function Header({balance, setBalance}) {

    const user = JSON.parse(localStorage.getItem('user')) || {username: 'user', firstName: 'First', lastName: 'Last'};

    return (
        <div className="relative flex flex-col gap-5">
            <div className="flex justify-between">
                <div className="flex gap-3 items-center border-2 border-gray-400 py-2 px-5 rounded-lg">
                    <span className="w-14 h-14 rounded-full flex justify-center items-center bg-blue-500">
                        <p className="text-white capitalize font-bold text-3xl">{user.firstName[0]}</p>
                    </span>
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">{user.username}</p>
                        <p className="text-2xl font-bold capitalize">{user.firstName + ' ' + user.lastName}</p>
                    </div>
                </div>
                <div>
                    <button className="bg-black/70 text-white px-3 py-2 rounded-md"
                    onClick={e => {localStorage.clear('user'); setBalance(0)}}>Logout</button>
                </div>
            </div>
            <p className="text-2xl font-semibold text-green-500"><b className="text-black font-semibold">Balance: </b>₹{balance}</p>
        </div>
    )
}
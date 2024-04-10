import axios from "axios"
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SendMoney() {

    const navigate = useNavigate();
    const backendURL = "http://localhost:3001/api/v1/account/transfer";
    const [param] = useSearchParams();
    const [amount, setAmount] = useState('');
    const [tranfered, setTransfered] = useState(false);
    const to = param.get('to');
    const name = param.get('name');

    function handleTransaction() {
        // const amount = document.getElementById('amount').value;
        const check = /^[0-9]+$/.test(amount);
        if(!amount || !check) {
            document.getElementById('amount').value = '';
            return alert("Invalid amount!");
        }
        axios.post(backendURL, {to, amount}, {withCredentials: true})
        .then(res => {
            console.log(res.data)
            setTransfered(true);
            setTimeout(()=>{
                navigate("/dashboard")
            }, 2500);
        })
        .catch(error => {
            if(error.response) {
                document.getElementById('transaction').innerHTML = error.response.data.msg;
                setTimeout(()=> {
                    navigate('/dashboard');
                }, 2000);
            } else {
                console.log('ERROR: ', error.message);
                document.getElementById('transaction').innerHTML = 'Something went wrong!'
                setTimeout(()=> {
                    navigate('/dashboard');
                }, 2500);
            }} );
    }

    return (
        <div className="flex justify-center items-center bg-slate-400 h-screen w-screen">
            <div id="transaction" className="bg-black/50 text-white py-10 px-20 rounded-md flex flex-col gap-5 justify-center items-center">
                {tranfered ? 
                  <Success amount={amount} name={name.toUpperCase()}/>
                  : 
                  <Transfer amount={amount} setAmount={setAmount} name={name} handleTransaction={handleTransaction} navigate={navigate} />
                }
            </div>
        </div>
    )
}

function Transfer({amount, setAmount, name, navigate, handleTransaction}) {
    return (
        <>
                <h1 className="text-xl font-bold text-center">Transfer Money</h1>
                <div className="flex gap-2">
                    <div>
                        <p className="mb-5 font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-green-400">
                                <span className="text-white font-semibold text-lg">{name[0].toUpperCase()}</span>
                            </div>    
                            {name.toUpperCase()}    
                        </p>
                        <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="text" placeholder="₹ 00.00" className="h-10 px-4 py-1 rounded-md outline-none text-black" />
                    </div>
                    <button className="h-10 self-end px-3 py-2 bg-green-500 hover:bg-green-600 rounded-md" onClick={handleTransaction}>Send</button>
                </div>
                <p className="text-white bg-red-500 hover:bg-red-600 rounded-md cursor-pointer px-3 py-1 w-fit self-start"
                onClick={()=> navigate('/dashboard')}>Cancel</p>
            </>
    )
}

function Success({amount, name}) {
    return (
        <>
            <div className="w-fit text-2xl font-bold text-green-500 rounded-md px-5 py-3 flex gap-3 items-center border-2 border-green-500">
                Success
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
            </div>
            <div className="text-white text-lg">
                <p><b>₹ {amount}</b> is Transferred to <b className="underline">{name}</b></p>
            </div>
        </>
    )
}
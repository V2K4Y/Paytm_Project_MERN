import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from './Signup_singin'
import SendMoney from './SendMoney'
import Dashboard from './Dashboard'

export default function RoutePage(){ 
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element = {<Signup />} />
                <Route path='/dashboard' element = {<Dashboard />} />
                <Route path='/sendMoney' element = {<SendMoney item={{firstName: 'Vivek', lastName: 'Kumar'}}/>} />
            </Routes>
        </BrowserRouter>
    )
}
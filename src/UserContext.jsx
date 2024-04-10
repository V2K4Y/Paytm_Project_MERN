import { createContext, useEffect, useState } from "react"
import Dashboard from "./components/Dashboard";

export const UseContext = createContext({});


export default function UserContext({children}) {
    const [username, setUsername] = useState('');

    if(username) {
        return (
            <Dashboard username = {username}/>
        )
    }
    return (
        <UseContext.Provider value={{setUsername, username}}>
            {children}
        </UseContext.Provider>
    )
}
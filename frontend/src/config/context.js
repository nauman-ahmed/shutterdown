import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import BASE_URL from '../API'
const AuthContext = createContext()

export default function AuthContextProvider({ children }) {

    let Value = JSON.parse(localStorage.getItem("updateValue"))

    const [state, setState] = useState(Value)

    // This is Profile Section get Data function Start....

    const [profileData, setProfileData] = useState()

    const GetDataProfile = async () => {
        try {
            let user = JSON.parse(Cookies.get('currentUser'));
            const res = await axios.get(
                `${BASE_URL}/MyProfile/Profile/${user._id}`,
                {
                    Headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setProfileData(res.data.data)
        } catch (error) {
            console.log(error, "error")
        }
    };
    // This is Profile Section get Data function End....

    return (
        <AuthContext.Provider value={{ setState, state, profileData, GetDataProfile }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext)
}             
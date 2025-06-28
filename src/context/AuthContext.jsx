import React,{Children, createContext,useEffect,useState} from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider =({children}) =>{
    const [user,setUser] =useState(null);
    const [loading,setLoading] =useState(true);

    const fetchUserProfile =async () =>{
        try{
            const token =localStorage.getItem("authToken");
            if(!token) return;
            
            const response =await axios.get("http://127.0.0.1:8000/api/users/profile",{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });

            setUser(response.data.data);

        }catch(error){
            console.error("Failed to fetch user profile:", error);
            // Don't remove token on error
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchUserProfile();
    },[])

    return(
        <AuthContext.Provider value={{user,loading}}>
            {children}
        </AuthContext.Provider>
    )
}
import {createContext, useContext, useEffect, useState} from "react";
// import { useNavigate } from "react-router-dom";

const ChatContext=createContext();

const ChatProvider=({children})=>{
    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState()
    const [chat,setChat]=useState([])
    const [notification,setNotification]=useState([])
    const [selectedTheme,setSelectedTheme]=useState(0);
    // useEffect(()=>{
    //     const userInfo=JSON.parse(localStorage.getItem("user info"));
    //     setUser(userInfo);

    //     if(!userInfo){
    //         navigate("/")
    //     }
    // },[navigate])

    return(
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chat,setChat,
        notification,setNotification,selectedTheme,setSelectedTheme}}>{children}</ChatContext.Provider>
    )
}
export const ChatState=()=>{
    return useContext(ChatContext)
}

export default ChatProvider
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon} from '@chakra-ui/icons'
import { getSender, getSenderFull,addNotification } from './Config/ChatLogics'
import { ProfileModal } from './Miscallenous/ProfileModal'
import { UpdateGroupChatModal } from './Miscallenous/UpdateGroupChatModal'
import "./style.css"
import io from "socket.io-client"
import { themes} from './Miscallenous/ChatThemes';
import { ScrollableChat } from './ScrollableChat'
import Lottie from "react-lottie"
import animationData from "../Animations/typing.json"
const ENDPOINT="http://localhost:5000"
var socket,selectedChatCompare;


export const SingleChat = ({setFetchAgain,fetchAgain}) => {
    const {user,setUser,selectedChat,setSelectedChat,chat,setChat,notification,setNotification,selectedTheme}=ChatState()
    const [messages, setMessages]=useState([])
    const [loading,setLoading]=useState()
    const [newMessage,setNewMessage]=useState()
    const [fetchMessagesAgain,setFetchMessagesAgain]=useState(false)
    const [socketConnected,setSocketConnected]=useState(false)
    const [typing,setTyping]=useState(false)
    const [isTyping,setIsTyping]=useState(false)
    const Toast=useToast()
    const defaultOptions={
        loop:true,
        autoplay:true,
        animationData:animationData,
        renderSettings:{
            preserveAspectRatio:"xMidYMid Slice"
        }
    }
    const fetchMessages=async()=>{
        if(!selectedChat) return
        try{
            setLoading(true)
            const response=await fetch(`http://localhost:5000/api/message/${selectedChat._id}`,{
                    method:"GET",
                    headers:{
                        "Authorization":`Bearer ${user.token}`,
                    },
                })
            const data=await response.json();
            setMessages(data);
            setLoading(false);
            socket.emit("join chat",selectedChat._id)
        }catch(err){
            Toast({
                title:"Could not get the chat",
                status:"Error",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })
        }
    }
    const sendMessage=async(e)=>{
        if(e.key==="Enter" && newMessage){
            socket.emit("stop typping",selectedChat._id)
            try{
                setNewMessage("");
                const response=await fetch("http://localhost:5000/api/message",{
                    method:"POST",
                    headers:{
                        "Authorization":`Bearer ${user.token}`,
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        "content":newMessage,
                        "chatId":selectedChat._id
                    })
                })
                const data=await response.json()
                socket.emit("new message",data)
                setMessages([...messages,data])
            }catch(err){
                Toast({
                    title:"Message could not be sent",
                    status:"Error",
                    duration:5000,
                    isClosable: true,
                    position:"bottom-left"
                })
    
            }
        }
    }
    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=>setSocketConnected(true))
        socket.on("typing",()=>setIsTyping(true));
        socket.on("stop typing",()=>setIsTyping(false));
    },[])
    const typingHandleer=(e)=>{
        setNewMessage(e.target.value)
        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit("typing",selectedChat._id)
        }
        let lastTypingTime=new Date().getTime()
        var timerLength=3000;

        setTimeout(()=>{
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime
            if(timeDiff>=timerLength && typing){
                socket.emit("stop typing",selectedChat._id)
                setTyping(false)
            }
        },timerLength)

    }

     useEffect(()=>{
            fetchMessages()
            selectedChatCompare= selectedChat;
     },[selectedChat,fetchMessagesAgain]);


     useEffect(()=>{
            socket.on("message recieved",(newMessageRecieved)=>{
                if(!selectedChatCompare || selectedChatCompare._id !==newMessageRecieved.chat._id){
                        if(!notification.includes(newMessageRecieved)){
                         setNotification([newMessageRecieved,...notification]);
                         setFetchAgain(!fetchAgain)
                        // addNotification(newMessageRecieved,notification,setNotification)
                        

                        }
                }
                else{
                    console.log("got called", selectedChatCompare, selectedChat)
                    setMessages([...messages,newMessageRecieved])
                    setFetchAgain(!fetchAgain)
                }
            })
        })
    
    return (
   <>
    {selectedChat?
        (<>
            <Text fontSize={{base:"28px",md:"30px"}}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work Sans"
            justifyContent={{base:"space-between"}}
            alignItems="center"
            display="flex"
            >
                <IconButton display={{base:"flex", md:"none"}}
                icon={<ArrowBackIcon />}
                onClick={()=>setSelectedChat("")}>
                </IconButton>
                {!selectedChat.isGroupChat?(<>
                    {getSender(user,selectedChat.users)}
                    <ProfileModal user={getSenderFull(user,selectedChat.users)} />
                </>):
                (<>
                    {
                        selectedChat.chatName.toUpperCase()
                    }
                    <UpdateGroupChatModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}  fetchMessages={fetchMessages}/>
                   
                </>)}
            </Text>
            <Box display="flex" flexDir="column" justifyContent="flex-end"
            p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowX="hidden" background={themes[selectedTheme]}>
              {loading?(
                <Spinner
                 size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                 />):(
                    <div className='messages'>
                       <ScrollableChat messages={messages} fetchMessagesAgain={fetchMessagesAgain} setFetchMessagesAgain={setFetchMessagesAgain}/>
                    </div>
                )
              }
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? <div><Lottie
                options={defaultOptions}
                width={70}
                style={{marginBottom:15}} /></div>:<></>}
                <Input
                variant="filled"
                bg="#E0E0E0 !important"
                placeholder='Enter a message....'
                onChange={typingHandleer}
                value={newMessage}></Input>
              </FormControl>
            </Box>
        </>):(<>
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
                Click on a user to start chatting
            </Text>
        </Box>
    </>)}
   </>
  )
}
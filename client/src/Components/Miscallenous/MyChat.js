import React, { useEffect } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Text, useToast, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {ChatLoading} from "../ChatLoading";
import {getSender} from "../Config/ChatLogics"
import { GroupChatModal } from './GroupChatModal'
export const MyChat = ({fetchAgain}) => {
  const [loggedUser,setLoggedUSer]=useState()
  const Toast=useToast();
  const {user,setUser,selectedChat,setSelectedChat,chat,setChat,notification,setNotification}=ChatState()
  const fethChat=async()=>{
    try{
        const response=await fetch(`http://localhost:5000/api/chat`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${user.token}`,
                },
            })
        const data=await response.json();
      
        setChat(data);
    }catch(err){
        Toast({
            title:"Errorfetching the chat",
            description: err.message,
            status:"error",
            duration:5000,
            isClosable: true,
            position:"bottom-left"
        })
    }
}
const handleChatSelection=(c)=>{
  
  if(notification.length){
    if(!c.isGroupChat){
      var newNotification= notification.filter((noti)=>{
        // if(c.users[0]._id===noti.sender._id || c.users[1]._id===noti.sender._id){
        //   console.log("matched")
        // }
        if(noti.chat._id===c._id){
          console.log("matched")
        }
        else{
         return noti;
        }
      })
    }
    setNotification(newNotification);
  }

  setSelectedChat(c);
}


const getBackgroundColor=(c)=>{
  if(selectedChat && c._id===selectedChat._id) return "#38B2AC";
  var myColor= "#E8E8E8"
  if(notification.length){
    notification.map((noti)=>{
      if(noti.chat._id===c._id){
        console.log("matched")
        myColor= "#d9ceb0"
      }
    })
  }
  return myColor
}
useEffect(()=>{
  setLoggedUSer(JSON.parse(localStorage.getItem("userInfo")))
  fethChat();
  console.log("I am called after notification")
},[fetchAgain]);

  return (
    <Box display={{base: selectedChat ? "none":"flex", md:"flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{base:"100%", md:"31%"}}
    borderRadius="lg"
    borderWidth="1px"
    m="15px"
    >
    <Box
    pb={3}
    px={3}
    fontSize={{base:"28px",md:"30px"}}
    fontFamily="Work Sans"
    display="flex"
    w="100%"
    justifyContent="space-between"
    alignItems="center">
      My Chats
      <GroupChatModal>
      <Button
      display="flex"
      fontSize={{base:"17px",md:"10px",lg:"17px"}}
      rightIcon={<AddIcon />}>
        New Group Chat
      </Button>
      </GroupChatModal>
  
    </Box>
      <Box
      display="flex"
      flexDirection="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden">
        {chat.length>0?
        
          (<Stack overflowY="scroll">
            {chat.map((c)=>{
              return(
              <Box onClick={()=>handleChatSelection(c)}
              cursor="pointer"
              // bg={selectedChat?(selectedChat._id===c._id? "#38B2AC": "#E8E8E8"):"#E8E8E8"}
              bg={getBackgroundColor(c)}
              color={selectedChat?(selectedChat._id === c._id ? "white":"black"):"black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={c._id}>
                <Text>
                  {!c.isGroupChat && loggedUser? getSender(loggedUser,c.users):(c.chatName)}
                </Text>
              </Box>
          )})}
          </Stack>)
        :(<ChatLoading />)}
      </Box>
    </Box>
  )
}

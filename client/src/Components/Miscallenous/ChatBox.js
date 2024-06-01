import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Text, useToast, Stack } from '@chakra-ui/react'
import { SingleChat } from '../SingleChat'

export const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {user,setUser,selectedChat,setSelectedChat,chat,setChat}=ChatState()
  return (
    <Box display={{base: selectedChat ? "flex": "none", md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    m="15px"
    bg="white"
    w={{base:"100%", md:"68%"}}
    borderRadius="lg"
    borderWidth="1px">
      <SingleChat setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/>
    </Box>
  )
}

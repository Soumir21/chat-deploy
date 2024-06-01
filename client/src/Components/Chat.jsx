import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import {MyChat} from "./Miscallenous/MyChat";
import {ChatBox} from "./Miscallenous/ChatBox";
import { SideDrawer } from './Miscallenous/SideDrawer';
import "./Chat.css"
export default function Chat() {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false)
  console.log("the value of fetchAgian is", fetchAgain)
  return(
  user? <div style={{width:"100%"}} className='mainChat'> 
    <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
     <Box
     display="flex"
     justifyContent="space-between"
     w="100%"
     h="91.5vh"
     p="10px">
      <MyChat fetchAgain={fetchAgain} />
      <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
     </Box>
 </div>:<div>Login</div>
    
  )
}

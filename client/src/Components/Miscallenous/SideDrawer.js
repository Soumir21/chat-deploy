import { Avatar, Box, Button,Input,Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider';
import { ProfileModal } from './ProfileModal';
import { ChatThemeModal } from './ChatThemeModal';
import {useNavigate} from "react-router-dom";
import {ChatLoading} from "../ChatLoading"
import { UserListItem } from '../UserAvata/UserListItem';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { getSender } from '../Config/ChatLogics';
export const SideDrawer = ({fetchAgain,setFetchAgain}) => {
    const [search,setSearch]=useState();
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [loadingChat,setLoadingChat]=useState();
    const {user,setSelectedChat,chat,setChat,notification,setNotification}=ChatState();
    console.log(notification);
    const Navigate=useNavigate()
    const Toast=useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleLogout=()=>{
        localStorage.removeItem("userInfo");
        setSelectedChat("");
        Navigate("/")
    }
    const handleSearch=async()=>{
        if(!search){
            Toast({
                title:"Please enter something in the search",
                status:"warning",
                isClosable:true,
                position:"top-left",
            })
        }
            try{
                console.log(search)
                setLoading(true)
                const response=await fetch(`https://chat-deploy-t6or.onrender.com/api/user/getuser?search=${search}`,{
                    method:"GET",
                    headers:{
                        "Authorization":`Bearer ${user.token}`
                    },
                
                })
                const data=await response.json();
                setLoading(false);
                setSearchResult(data)
                
            }catch(err){
                console.log(err);
                setLoading(false);
            }        
    }
    
    const accessChat=async(userId)=>{
        try{
            setLoadingChat(true);
            const response=await fetch(`https://chat-deploy-t6or.onrender.com/api/chat`,{
                    method:"POST",
                    headers:{
                        "Authorization":`Bearer ${user.token}`,
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({userId})
                })
            const data=await response.json();
            if(!chat.find((c)=>c._id===data._id)) setChat([data,...chat])
            setSelectedChat(data);
            setLoadingChat(false);
            onClose()
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

  return (
   <>
    <Box
    display='flex'
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px">
        <Tooltip label="search users to chat" hasArrow placement='bottom-end'>
            <Button variant="ghost" onClick={onOpen}>
                <CiSearch />
                <Text d={{base:"none",md:'flex'}} px="4">Search user</Text>
            </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work Sans">My Chat</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                        <BellIcon fontSize="2xl" m={1} />
                </MenuButton>
                <MenuList>
                    {!notification.length && <MenuItem>No new message</MenuItem>}
                    {notification.length>0 && notification.map((noti)=>{
                        return <MenuItem key={noti.chat._id} onClick={()=>{setSelectedChat(noti.chat);setNotification(notification.filter(n=>n.chat._id!==noti.chat._id))}}>
                            {noti.chat.isGroupChat?`A new message from ${noti.chat.chatName}`:`A messge from ${getSender(user,noti.chat.users)}`}
                        </MenuItem>
                    })}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                        <MenuItem>My profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider />
                    <ChatThemeModal user={user}>
                         <MenuItem>Chat Themes</MenuItem>
                    </ChatThemeModal>
                 
                  
                   
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" marginBottom="10px">
                <Input placeholder='Search by email or name'
                 mr={2} value={search} 
                 onChange={e=>setSearch(e.target.value)}/>
                 <Button onClick={handleSearch} isLoading={loading}>Go</Button>
            </Box>
            {loading?<ChatLoading></ChatLoading>:(
                searchResult?searchResult.map(user=>(
                    <UserListItem key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)} />
                )):null
            )}
            {loading && <Spinner ml="auto" d='felx' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box> 
   </>
  )
}

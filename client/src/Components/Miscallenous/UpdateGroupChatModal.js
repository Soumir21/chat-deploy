import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { UserBadgeItem } from '../UserAvata/UserBadgeItem'
import { UserListItem } from '../UserAvata/UserListItem'

export const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,setUser,selectedChat,setSelectedChat,chat,setChat}=ChatState()
    const [groupChatName,setGroupChatName]=useState();
    const [search,setSearch]=useState();
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false)
    const Toast=useToast()
    
    const handleRename=async()=>{
        if(!groupChatName) return
        try{
            setRenameLoading(true);
            const response=await fetch(`http://localhost:5000/api/chat/renamegroup`,{
                method:"PUT",
                headers:{
                    "Authorization":`Bearer ${user.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({chatId:selectedChat._id,chatName:groupChatName})
            })
            const data=await response.json();
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
           
            Toast({
                title:"New group chat creted",
                status:"success",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })

        }catch(err){
            Toast({
                title:"Error occured",
                status:"error",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })
            setRenameLoading(false);
            setGroupChatName("")
        }
    }
    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return
        }

        try{
            setLoading(true)
            const response=await fetch(`http://localhost:5000/api/user/getuser?search=${search}`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${user.token}`
                },
            
            })
            const data=await response.json();
            setLoading(false);
            setSearchResult(data);
            
        }catch(err){
            console.log(err);
            setLoading(false);
        }        
    }
    const handleRemoveuser=async(user1)=>{
       console.log(user1)
        if(selectedChat.groupAdmin._id!==user._id && user1._id===user._id){
            return Toast({
                title:"Only admin can Remove from a group",
                status:"error",
                duration:3000,
                isClosable: true,
                position:"bottom-left"
            })
        }

        try{
            setLoading(true);
            const response=await fetch(`http://localhost:5000/api/chat/groupremove`,{
                method:"PUT",
                headers:{
                    "Authorization":`Bearer ${user.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({chatId:selectedChat._id,userId:user1._id})
            })
            const data=await response.json();
           
            user1._id===user._id ?setSelectedChat():setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setLoading(false);
            fetchMessages()
            Toast({
                title:"User Removed from the goup",
                status:"success",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })
        }catch(err){
            console.log(err)
        }
    }
    const handleAddUser=async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            Toast({
                title:"User is already in the group",
                status:"Error",
                duration:3000,
                isClosable: true,
                position:"bottom-left"
            })
            return
        }

        if(selectedChat.groupAdmin._id!==user._id){
            return Toast({
                title:"Only admin can add to a group",
                status:"error",
                duration:3000,
                isClosable: true,
                position:"bottom-left"
            })
        }

        try{
            setLoading(true);
            const response=await fetch(`http://localhost:5000/api/chat/groupaddto`,{
                method:"PUT",
                headers:{
                    "Authorization":`Bearer ${user.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({chatId:selectedChat._id,userId:user1._id})
            })
            const data=await response.json();
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            Toast({
                title:"User Added to the goup",
                status:"success",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })
        }catch(err){
            console.log(err)
        }
    }
    
return (
<>
      <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work Sans"
          display="flex"
          justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users?selectedChat.users.map(u=>(<UserBadgeItem key={u._id} 
                user={u} handleFunction={()=>handleRemoveuser(u)} />)):null}
                </Box>
                <FormControl display="flex">
                    <Input placeholder='Chat Name' mb={3}
                     value={groupChatName} onChange={(e) =>setGroupChatName(e.target.value)}>

                    </Input>
                    <Button variant="solid" colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                </FormControl>
                <FormControl display="flex">
                        <Input placeholder='Add users' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
                </FormControl>
                {loading ? <div>loading</div> : (
                    searchResult ? searchResult.map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />) : null
                )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' onClick={()=>handleRemoveuser(user)} >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  )
}

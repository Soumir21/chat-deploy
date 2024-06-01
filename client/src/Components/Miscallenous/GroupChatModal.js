import {Span, Button, Modal, ModalCloseButton, 
    ModalContent,ModalFooter, ModalHeader, ModalOverlay, useDisclosure, ModalBody,
     useToast, FormControl, Input, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { UserListItem } from '../UserAvata/UserListItem';
import { UserBadgeItem } from '../UserAvata/UserBadgeItem';

export const GroupChatModal = ({children}) => {
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState();
    const Toast=useToast()
    const {user,chat,setChat}=ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return
        }

        try{
            console.log(search)
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

    const handleSubmit=async ()=>{
        if(!groupChatName || !selectedUsers){
            return  Toast({
                title:"Please fill all the fields",
                status:"error",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })
        }

        try{
            const response=await fetch(`http://localhost:5000/api/chat/group`,{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${user.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name:groupChatName,users:JSON.stringify(selectedUsers.map((u)=>u._id))})
            })
            const data=await response.json();
            setChat([data,...chat])
            onClose();
            Toast({
                title:"New group chat creted",
                status:"success",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })

        }catch(err){
            console.log(err)
        }
    }
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
           return  Toast({
                title:"user is already added to the group",
                status:"error",
                duration:5000,
                isClosable: true,
                position:"bottom-left"
            })
        }

        setSelectedUsers([...selectedUsers,userToAdd]);
        console.log(selectedUsers);

    }
    const handleDelete=(u)=>{
        const newSelectedUsers=selectedUsers.filter((user)=>user._id!==u._id)
        setSelectedUsers([...newSelectedUsers])
    }
   
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
            >Create a group chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column"
            alignItems="center">
                <FormControl>
                    <Input placeholder='chat name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder='Add users' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
                </FormControl>
                <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers?selectedUsers.map(u=>(<UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />)):null}
                </Box>
                
                {loading ? <div>loading</div> : (
                    searchResult ? searchResult.map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />) : null
                )}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue'  onClick={handleSubmit}>
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
    }


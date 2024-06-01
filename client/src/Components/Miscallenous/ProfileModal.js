import { ViewIcon } from '@chakra-ui/icons'
import { Button, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRef } from "react";
import { ChatState } from '../../Context/ChatProvider';
export const ProfileModal = ({user,children}) => {
const { isOpen, onOpen, onClose } = useDisclosure();
const [loading,setLoading]=useState(false);
const [pic,setPic]=useState();
const toast = useToast()
const inputRef = useRef(null);
const {setUser}=ChatState()
    const handleChange = () => {
      // Trigger the file selection dialog
      inputRef.current.click();
    };

const postDetails=async(pics)=>{
  setLoading(true);

  if(pics===undefined){
      toast({
          title: 'Please select an image!',
          description: "Not an iage",
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position:"bottom"
        })
      return
  }

  if(pics.type=== "image/jpeg" || pics.type==="image/png"){
      const data=new FormData();
      data.append("file",pics)
      data.append("upload_preset","chat-app");
      data.append("cloud_name","dp9lr0iji");
      try{
          const response=await fetch("https://api.cloudinary.com/v1_1/dp9lr0iji/image/upload",{
          method:"POST",
          body:data,}
      )
          const imageData=await response.json();
          setPic(imageData.url.toString())
          
          setLoading(false)
      }catch(err){
          console.log(err);
          setLoading(false)
      }
      
  }
  else{
      toast({
          title: 'Please select an image!',
          description: "Not an iage",
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position:"bottom"
        })
      return
  }
}

const handleSubmit=async()=>{
  
  if(pic){
    try{
      const response=await fetch("https://chat-deploy-t6or.onrender.com/api/user/profilepic",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${user.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({profilePic:pic})
    })
      const data=await response.json()
      
      setLoading(false)
      localStorage.setItem("userInfo",JSON.stringify(data));
      setUser(data);
      setPic();
    }catch(err){
      console.log(err)
    }
  }
  onClose();
}
  return (
    <>
        {children?<span onClick={onOpen}>{children}</span>:(
            <IconButton d={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
        )}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent  d="flex" justifyContent="center" alignItems="center" >
          <ModalHeader fontSize="40px" fontFamily="Work Sans" d="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Image objectFit='cover' borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} />
          </ModalBody>
          <Text fontSize={{base:"28px", md:"30px"}} p="20px"
          fontFamily="Work sans">
             {user.email}
          </Text>
          {children?<>
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e)=>postDetails(e.target.files[0])}/>
          {/* Button to trigger the profile picture change */}
              <Button onClick={handleChange} >Change Profile Picture</Button>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleSubmit}  isLoading={loading}>
                  Done
                </Button>
              </ModalFooter>
          </>:(
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Done
             </Button>
            </ModalFooter>
            
        )}              
        </ModalContent>
      </Modal>
    </>
  )
}

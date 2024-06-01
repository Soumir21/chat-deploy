import React, { useState } from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender } from './Config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
export const ScrollableChat = ({messages,fetchMessagesAgain,setFetchMessagesAgain}) => {
    const {user}=ChatState();
    const [selectedMessage,setSelectedMesssage]=useState();
    const [selectedMessageTime,setSelectedMesssageTime]=useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDoubleClick=(m)=>{
        setSelectedMesssage(m);
        const updatedAtTimestamp = m.updatedAt;
         const updatedAtDate = new Date(updatedAtTimestamp);
        const updatedAtString = updatedAtDate.toLocaleString();
        setSelectedMesssageTime(updatedAtString)
        onOpen();
    }   
   
 
    const handleDelete=async()=>{
        try{
            const res=await fetch(`https://chat-deploy-t6or.onrender.com/api/message/delete`,{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${user.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({id:selectedMessage._id})
            })
            setFetchMessagesAgain(!fetchMessagesAgain);
            onClose();
        }catch(err){
            console.log(err)
        }
    }

    const handleCopyText=()=>{
        const selectedText=document.getElementById("textToCopy")
        selectedText.select();
        navigator.clipboard.writeText(selectedText.value);

        // Alert the copied text
        alert("Copied the text: " + selectedText.value);
        onClose()
    }
  return (
    <>
        <ScrollableFeed>
            <Box >
            {messages && messages.map((m,i)=><>
                <div style={{display:"flex"}} key={m._id}>
                {
                    (isSameSender(messages,m,i,user._id)
                    || isLastMessage(messages,i,user._id)) &&(
                        <Tooltip
                        label={m.sender.name}
                        placement='bottom-start'
                        hasArrow>
                            <Avatar
                            mt="7px"
                            mr={1}
                            size="sm"
                            cursor="pointer"
                            name={m.sender.name}
                            src={m.sender.pic} />
                        </Tooltip>
                    )
                }
                
                <div style={{ display: "flex", justifyContent: `${
                    m.sender._id === user._id ?"flex-end":"flex-start"
                }`, width: '100%',
                paddingLeft:"20px",
                cursor:"pointer"
                }}>
                        <span style={{backgroundColor: `${
                            m.sender._id === user._id ?"#BEE3F8":"#B9F5D0"
                        }`,
                        borderRadius:"20px",
                        maxWidth:"75%",
                        padding:"15px 15px"
                        }}
                        onDoubleClick={()=>handleDoubleClick(m)}
                        >{m.content}
                        </span>
                </div>
              
            </div>
           
            </>
            ) }
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
                <ModalContent>
                        <ModalHeader>Message selected</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <input fontSize='2xl' color="blue" id="textToCopy" value={selectedMessage?selectedMessage.content:null}></input>
                            <Text>Message sent <span style={{fontWeight:"bold"}}>{selectedMessageTime}</span> </Text>
                        </ModalBody>

                        <ModalFooter>
                            <Button mr={3} onClick={handleCopyText}>Copy text</Button>
                            {selectedMessage && user._id===selectedMessage.sender._id? <Button colorScheme='blue' mr={3} onClick={handleDelete}>
                                Delete
                            </Button>: <Button onClick={onClose}>close</Button>}
                           
                            
                        </ModalFooter>
                </ModalContent>
             </Modal>
            </Box>
           
            
        </ScrollableFeed>
    </>
  )
}

import React, { useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { themes } from './ChatThemes';
import { ChatState } from '../../Context/ChatProvider';
const ChatThemeModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {selectedTheme,setSelectedTheme} = ChatState();
    const [localselectetdTheme,setLocalSelectedTheme]=useState(selectedTheme)
    const increase=()=>{
        if(localselectetdTheme!==themes.length-1){
            setLocalSelectedTheme(localselectetdTheme+1)
        }
        else{
            setLocalSelectedTheme(0)
        }
    }

    const decrease=()=>{
        if(localselectetdTheme!==0){
            setLocalSelectedTheme(localselectetdTheme-1)
        }
        else{
            setLocalSelectedTheme(themes.length-1)
        }
    }
    return (
        <div>
                    <span onClick={onOpen}>{children}</span>
                    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent  d="flex" justifyContent="center" alignItems="center" >
                    <ModalHeader fontSize="40px" fontFamily="Work Sans" d="flex" justifyContent="center">Select Theme</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <div style={{width:"300px",height:"300px",background:`${themes[localselectetdTheme]}`,borderRadius:"10px",position:"relative"}}>
                            <ArrowBackIcon style={{position:"absolute",top:"45%"}} w={8} h={8}  onClick={increase}>+</ArrowBackIcon>
                            <ArrowForwardIcon style={{position:"absolute",right:"0px",top:"45%"}} w={8} h={8}  onClick={decrease}>+</ArrowForwardIcon>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{background:`${themes[localselectetdTheme]}`}} onClick={()=>setSelectedTheme(localselectetdTheme)}>Apply theme</Button>
                    </ModalFooter>                    
                        
                    </ModalContent>
                </Modal>
        </div>
    );
};

export  {ChatThemeModal};
import { FormControl, FormLabel, VStack,Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react';
import {useNavigate} from "react-router-dom"
import { ChatState } from '../../Context/ChatProvider';
export const Login = () => {
const toast=useToast();
const navigate=useNavigate()
const [email,setEmail]=useState();
const [password,setPassword]=useState();
const  [show,setShow]=useState(false);
const [loading,setLoading]=useState(false);
const {setUser}=ChatState();
const handleSubmit=async()=>{
    setLoading(true);
    const user={
        email,
        password
    }
    if( !password || !email  ){
        toast({
            title: 'Please enter all the fields',
            description: "incoplete field",
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position:"bottom"
          })
          setLoading(false)
        return
    }
    
    try{
        const response=await fetch("http://localhost:5000/api/user/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            })
        const data=await response.json();
    
        if(data.message){
            setLoading(false)
            return toast({
                title: 'Please enter the correct detals',
                description: "Wrong credentials",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom"
              })
        }
        
        setLoading(false)
        setUser(data);
        localStorage.setItem("userInfo",JSON.stringify(data))
        navigate("/chat")

    }catch(err){
        console.log(err)
        setLoading(false);
    }
}
  return (
    <VStack spacing="5px">
          
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value.trim())}/>
            </FormControl>
            <FormControl id='password' isRequired>\
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input   type={show?"text":"password"} value={password}  placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)}>
                    {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
                </InputGroup>
                
            </FormControl>

           
        <Button 
        colorScheme='blue'
        width="100%"
        style={{marginTop:15}}
        onClick={handleSubmit}
        isLoading={loading}>
           Log in
        </Button>
        <Button 
        colorScheme='red'
        width="100%"
        style={{marginTop:15}}

        onClick={()=>{
            setEmail("guestUser@chat.com");
            setPassword("guestuserpassword")
        }}>
           Get guest user credentials
        </Button>
       

    </VStack>
  )
}

import { FormControl, FormLabel, VStack,Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"
export const SignUp = () => {
const [name,setName]=useState();
const [email,setEmail]=useState();
const [password,setPassword]=useState();
const [confirmPassword,setconfirmPassword]=useState();
const [pic,setPic]=useState();
const [loading,setLoading]=useState(false);
const  [show,setShow]=useState(false);
const toast = useToast()

const navigate=useNavigate();
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
            console.log(imageData.url.toString());
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
    setLoading(true);
    const user={
        name,
        email,
        password,
        pic
        
    }
    if(!name || !password || !email || !confirmPassword ){
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
    
    if(confirmPassword !==password){
        toast({
            title: 'confirm password and password do not match',
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
        const response=await fetch("https://chat-deploy-t6or.onrender.com/api/user/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            })
        const data=await response.json()
        console.log(data);
        setLoading(false)
        localStorage.setItem("userInfo",JSON.stringify(data))
        navigate("/chat")

    }catch(err){
        console.log(err)
        setLoading(false);
    }
}
  return (
    <VStack spacing="5px">
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/>
            </FormControl>
            <FormControl id='password' isRequired>\
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input   type={show?"text":"password"}   placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)}>
                    {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
                </InputGroup>
                
            </FormControl>

            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                <Input   type={show?"text":"password"}   placeholder="Enter your password Again" onChange={(e)=>setconfirmPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)}>
                    {show?"Hide":"Show"}
                </Button>
                </InputRightElement>
                </InputGroup>    
            </FormControl>
           
            <FormControl id='pic' isRequired>
                <FormLabel>Upload your pic</FormLabel>
                <Input 
                type='file'
                p="1.5"
                accept='image/*'
                onChange={(e)=>postDetails(e.target.files[0])}/>
            </FormControl>

        <Button 
        colorScheme='blue'
        width="100%"
        style={{marginTop:15}}
        onClick={handleSubmit}
        isLoading={loading}>
            Sign up
        </Button>
      
       

    </VStack>
  )
}

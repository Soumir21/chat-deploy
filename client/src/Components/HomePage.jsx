import React, { useEffect } from 'react'
import {Container,Box,Text, Tabs, TabList, Tab, TabPanels, TabPanel} from "@chakra-ui/react"
import { Login } from './Authentication/Login';
import { SignUp } from './Authentication/SignUp';
import { useNavigate } from 'react-router-dom';
export const HomePage = () => {
  const navigate=useNavigate();

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("user info"));
    if(userInfo){
        navigate("/chat")
    }
},[navigate])

  return (
    <div className='App'>
       <Container maxW="xl" centerContent>
        <Box d='flex' 
        justifyContent="center" 
        alignItems="center"
        padding={3} 
        background="white" 
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
       >
          <Text fontFamily="work sans" fontSize="2xl" color="black" textAlign="center">My Chat</Text>
        </Box>
        <Box
        padding={4} 
        background="white" 
        width="100%"
        borderWidth="1px"
         color="black">
           <Tabs variant='soft-rounded'>
              <TabList mb="1em">
                <Tab width="50%">Login</Tab>
                <Tab width="50%">Sign up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                 <Login />
                </TabPanel>
                <TabPanel>
                  <SignUp />
                </TabPanel>
              </TabPanels>
            </Tabs>
        </Box>
    </Container>
    </div>
   
  )
}
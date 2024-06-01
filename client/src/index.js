import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatProvider from "./Context/ChatProvider"
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
     <ChatProvider>
      <ChakraProvider >
        <App />
      </ChakraProvider>
  </ChatProvider> 
 
);


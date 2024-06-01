import { Button } from "@chakra-ui/react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { HomePage } from "./Components/HomePage";
import Chat from "./Components/Chat";
import "./App.css"
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
        
    </>
  );
}

export default App;

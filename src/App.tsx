import {  BrowserRouter, Route, Routes } from "react-router-dom";

import Reg from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";


function App() {
  return (
    
     <BrowserRouter>
     
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<Reg/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      
      </BrowserRouter>
   
  );
}

export default App;

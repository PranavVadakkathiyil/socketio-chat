import { Route, Routes } from "react-router-dom"
import Header from "./layout/Header"
import Auth from "./pages/Auth"
import ChatHome from "./pages/ChatHome"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <>
    <Toaster/>
    
    
    <Routes>
      <Route path="/" element={<Auth/>}/>
      <Route path="/home" element={<ChatHome/>}/>
    </Routes>
    </>
  )
}

export default App
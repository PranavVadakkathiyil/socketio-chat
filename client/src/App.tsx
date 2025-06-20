import { Route, Routes } from "react-router-dom"
import Header from "./layout/Header"
import Auth from "./pages/Auth"
import ChatHome from "./pages/ChatHome"
import { Toaster } from "react-hot-toast"
import ViewChat from "./Components/ViewChat"
import AddToGroup from "./Components/AddToGroup"

const App = () => {
  return (
    <>
    <Toaster/>
    
    
    <Routes>
      <Route path="/" element={<Auth/>}/>
      <Route path="/home" element={<ChatHome/>}/>
      <Route path="/chat/:id" element={<ViewChat/>}/>
      <Route path="/add" element={<AddToGroup/>}/>
    </Routes>
    </>
  )
}

export default App
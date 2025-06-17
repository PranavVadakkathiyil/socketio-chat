import { Route, Routes } from "react-router-dom"
import Header from "./layout/Header"
import Auth from "./pages/Auth"
import ChatHome from "./pages/ChatHome"

const App = () => {
  return (
    <>
    
    
    <Routes>
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/home" element={<ChatHome/>}/>
    </Routes>
    </>
  )
}

export default App
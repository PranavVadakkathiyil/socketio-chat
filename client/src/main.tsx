import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ContextProvider } from './context/addGroup.tsx'
import { ChatProvider } from './context/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <ChatProvider>

          <App />
        </ChatProvider>
      </ContextProvider>

    </BrowserRouter>

  </StrictMode>,
)

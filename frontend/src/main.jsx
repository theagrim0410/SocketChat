import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <SocketContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SocketContextProvider>
  </AuthContextProvider>,
)

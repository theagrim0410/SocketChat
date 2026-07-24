import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import  ErrorBoundary  from './utils/Error.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthContextProvider>
      <SocketContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SocketContextProvider>
  </AuthContextProvider>
</ErrorBoundary>
)

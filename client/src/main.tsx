import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.tsx'
import { ConverstationProvider } from './context/ConverstationContext.tsx'
import { MessageProvider } from './context/MessageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <ConverstationProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </ConverstationProvider>
    </UserProvider>
  </BrowserRouter>
)

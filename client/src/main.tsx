import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.tsx'
import { ConverstationProvider } from './context/ConverstationContext.tsx'
import { MessageProvider } from './context/MessageContext.tsx'

import { io } from 'socket.io-client'

const socket = io("http://localhost:5500");

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("message", (msg) => {
  console.log("message from server: ", msg);
});

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

import {Routes, Route, Navigate} from 'react-router-dom';
import { useContext } from 'react';
import UserContext, { UserContextTypes } from './context/UserContext';

import LoginPage from './components/pages/LoginPage';
import MainOutlet from './components/templates/MainOutlet';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/pages/MainPage';

const App = () => {

  const { loggedInUser } = useContext(UserContext) as UserContextTypes;

  return (
    <Routes>
      <Route path='login' element={<LoginPage />}/>
      <Route path='register' element={<RegisterPage />}/>
      <Route path="" element={<MainOutlet />}>
        <Route path='chat' element={loggedInUser ? <MainPage /> : <Navigate to="/login" />}></Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App

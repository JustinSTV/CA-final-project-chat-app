import {Routes, Route, Navigate} from 'react-router-dom';
import { useContext } from 'react';
import UserContext, { UserContextTypes } from './context/UserContext';

import LoginPage from './components/pages/LoginPage';
import MainOutlet from './components/templates/MainOutlet';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/pages/MainPage';
import AllUsersPage from './components/pages/AllUsersPage';
import UserProfile from './components/pages/UserProfile';
import SpecificUserProfile from './components/pages/SpecificUserProfile';

const App = () => {

  const { loggedInUser } = useContext(UserContext) as UserContextTypes;

  return (
    <Routes>
      <Route path='login' element={<LoginPage />}/>
      <Route path='register' element={<RegisterPage />}/>
      <Route path="/" element={loggedInUser ? <MainOutlet /> : <Navigate to='/login' />}>
        <Route path='chat' element={<MainPage />}/>
        <Route path='users' element={<AllUsersPage />}/>
        <Route path='/profile/:username' element={<UserProfile />}/>
        <Route path='/user/:username' element={<SpecificUserProfile />}/>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App

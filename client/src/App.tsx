import {Routes, Route} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import MainOutlet from './components/templates/MainOutlet';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/pages/MainPage';

const App = () => {

  // const isAuthenticated = false;

  return (
    <Routes>
      <Route path='login' element={<LoginPage />}/>
      <Route path='register' element={<RegisterPage />}/>
      <Route path="" element={<MainOutlet />}>
        <Route path='chat' element={<MainPage />}/>
      </Route>
    </Routes>
  )
}

export default App

import {Routes, Route} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainOutlet from './components/templates/MainOutlet';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/pages/MainPage';

const App = () => {

  const isAuthenticated = false;

  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
      <Route path='/' element={<LoginPage />}/>
      <Route path='/register' element={<RegisterPage />}/>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
        <Route element={<MainOutlet />}>
        <Route path='/chat' element={<MainPage />}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App

import { useContext, useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";

import UserContext, {UserContextTypes} from "../../context/UserContext";

const StyledSection = styled.section`
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  >form{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 50px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    
    >div{
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin: 5px 0;

      >input{
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 10px 20px;
        width: 250px;
      }
      >p.errorMsg{
        color: red;
        text-align: left;
        max-width: 250px;
        word-wrap: break-word;
      }
    }
    >input[type="submit"]{
      width: 80%;
      cursor: pointer;
      padding: 15px 30px;
      margin: 10px;
      border-radius: 5px;
      border: none;
      background-color: #1446A3;
      font-size: 14px;
      color: white;
    }
  }

  >p.error-message{
    color: red;
    font-weight: bold;
  }
  >p.success-message{
    color: green;
    font-weight: bold;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { logInUser } = useContext(UserContext) as UserContextTypes;
  const [loginMessage, setLoggingMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Field is Required'),
      password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d!@#$%^&*_+?]{5,20}$/,
        "Password must containt at least: one lowercase, one uppercase, one number, one special symbol. Password length must be between 5 and 20 characters!"
      )
      .required("Password is required!")
    }),
    onSubmit: async(values) => {
      console.log(values);
      try{
        const loginResponse = await logInUser(values);
        if("error" in loginResponse){
          setLoggingMessage(loginResponse.error);
        } else{
          setLoggingMessage(loginResponse.success)
          setTimeout(() => {
            navigate('/chat');
          }, 2000);
        }
      } catch(err){
        console.error(err)
      }
    }
  })

  return (
    <StyledSection>
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input 
            type="text"
            id="username" name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {
            formik.touched.username && formik.errors.username
            && <p className="errorMsg">{formik.errors.username}</p>
          }
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password"
            id="password" name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {
            formik.touched.password && formik.errors.password
            && <p className="errorMsg">{formik.errors.password}</p>
          }
        </div>
        <input type="submit" value='Login'/>
      </form>
      {
        loginMessage ? (
          <p className={loginMessage.includes('Successfuly') ? 'success-message' : 'error-message'}>
            {loginMessage}
          </p>
        ) : null
      }
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </StyledSection>
  );
}
 
export default LoginPage;
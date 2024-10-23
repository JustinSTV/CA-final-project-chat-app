import { useContext, useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";

import UserContext, {UserContextTypes} from "../../context/UserContext";

const StyledSection = styled.section`
  
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

    }),
    onSubmit: async(values) => {
      console.log(values);
      try{
        const loginResponse = await logInUser(values);
        if("error" in loginResponse){
          setLoggingMessage(loginResponse.error);
        } else{
          setLoggingMessage(loginResponse.success)
          navigate('/chat')
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
          <label htmlFor="username">username:</label>
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
          <label htmlFor="password">password:</label>
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
        <input type="submit" value='Prisijungti'/>
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
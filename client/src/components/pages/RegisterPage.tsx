import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

import UserContext, {UserContextTypes} from "../../context/UserContext";

const StyledSection = styled.section`

`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext) as UserContextTypes;
  const [registerMessage, setRegisterMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      profileImage: '',
      password: '',
      passwordRepeat: ''
    },
    validationSchema: Yup.object({

    }),
    onSubmit: async (values) => {
      console.log(values);
      const registerResponse = await registerUser({
        username: values.username,
        profileImage: values.profileImage || undefined,
        password: values.password
      });
      if("error" in registerResponse){
        setRegisterMessage(registerResponse.error)
      } else {
        setRegisterMessage(registerResponse.success);
        navigate('/chat');
      }
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("profileImage", reader.result);  // Set base64 image
      };
      reader.readAsDataURL(file);  // Convert image to base64 string
    }
  };

  return (
    <StyledSection>
      <h2>Registration</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input 
            type="text"
            id="username" name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            />
            {
              formik.touched.username && formik.errors.username
              && <p>{formik.errors.username}</p>
            }
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input 
            type="password"
            id="password" name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            />
            {
              formik.touched.password && formik.errors.password
              && <p>{formik.errors.password}</p>
            }
        </div>
        <div>
          <label htmlFor="passwordRepeat">Repeat password: </label>
          <input 
            type="password"
            id="passwordRepeat" name="passwordRepeat"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.passwordRepeat}
            />
            {
              formik.touched.passwordRepeat && formik.errors.passwordRepeat
              && <p>{formik.errors.passwordRepeat}</p>
            }
        </div>
        <div>
          <label htmlFor="pfp">Profile Picture: </label>
          <input 
            type="file"
            id="pfp" name="pfp"
            accept="image/*"
            onChange={handleImageUpload}
            />
        </div>
        <input type="submit" value='Register' />
      </form>
      {
        registerMessage ? (
          <p className={registerMessage.includes('Sėkmingą') ? 'success-message' : 'error-message'}>
            {registerMessage}
          </p>
        ) : null
      }
      <p>Have an account? <Link to='/login'>Login</Link></p>
    </StyledSection>
  );
};

export default RegisterPage;
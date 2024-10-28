import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

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
      >input#pfp{
        padding: 10px 0;
      }
      >::-webkit-file-upload-button{
        background-color: #1446A3;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext) as UserContextTypes;
  const [registerMessage, setRegisterMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      username: '',
      profileImage: '',
      profileImageUrl: '',
      password: '',
      passwordRepeat: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, 'Username must be atleast 5 characters long!')
        .max(20, "Username can't be 20 characters long!")
        .required('Username is required'),
      profileImageUrl: Yup.string().url('Invalid URL'),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{5,20}$/,
          "Password must containt at least: one lowercase, one uppercase, one number, one special symbol. Password length must be between 5 and 20 characters!"
        )
        .required("Password is required!"),
      passwordRepeat: Yup.string()
      .oneOf([Yup.ref('password')], "Password doesn't match")
      .required("Password Repeat is required")
    }),
    onSubmit: async (values) => {
      const registerResponse = await registerUser({
        username: values.username,
        profileImage: values.profileImage || values.profileImageUrl || undefined,
        password: values.password
      });
      if("error" in registerResponse){
        setRegisterMessage(registerResponse.error);
      } else {
        setRegisterMessage(registerResponse.success);
        setTimeout(() => {
          navigate('/profile/:username');
        }, 2000);
      }
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
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
              && <p className="errorMsg">{formik.errors.username}</p>
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
              && <p className="errorMsg">{formik.errors.password}</p>
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
              && <p className="errorMsg">{formik.errors.passwordRepeat}</p>
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
        <div>
          <label htmlFor="profileImageUrl">Profile Picture URL: </label>
          <input
            type="url"
            id="profileImageUrl"
            name="profileImageUrl"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.profileImageUrl}
          />
          {
            formik.touched.profileImageUrl && formik.errors.profileImageUrl 
            && <p className="errorMsg">{formik.errors.profileImageUrl}</p>
          }
        </div>
        <input type="submit" value='Register' />
      </form>
      {
        registerMessage ? (
          <p className={registerMessage.includes('Successfully') ? 'success-message' : 'error-message'}>
            {registerMessage}
          </p>
        ) : null
      }
      <p>Have an account? <Link to='/login'>Login</Link></p>
    </StyledSection>
  );
};

export default RegisterPage;
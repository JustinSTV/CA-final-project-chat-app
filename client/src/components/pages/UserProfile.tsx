import { useContext, useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from 'yup';

import UserContext, {UserContextTypes} from "../../context/UserContext";

const StyledSection = styled.section`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;

  >h2{
    margin-top: 50px;
  }

  >div.profilePic{
    display: flex;
    align-items: center;
    gap: 10px;

    >img{
      height: 200px;
      width: 200px;
      border-radius: 50%;
      object-fit: cover;
    }
    >button{
      cursor: pointer;
      padding: 15px 40px;
      border-radius: 5px;
      border: none;
      background-color: #1446A3;
      font-size: 14px;
      font-weight: bold;
      color: white;
    }
  }

  >div.usernameAndPassword{
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    >div{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      >form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        >div{
          >input{
            border: none;
            outline: none;
            border-radius: 5px;
            padding: 10px 20px;
          }
          >p.errorMsg{
            color: red;
            text-align: justify;
            max-width: 210px;
            word-wrap: break-word;
          }
        }

        >input[type="submit"]{
          cursor: pointer;
          padding: 15px 30px;
          margin: 10px;
          border-radius: 5px;
          border: none;
          background-color: #1446A3;
          font-size: 14px;
          color: white;
          font-weight: bold;
        }
      }
      >p.error-message{
        color: red;
        font-weight: bold;
      }
      >p.success-message{
        color: lime;
        font-weight: bold;
      }
    }
  }
`

const UserProfile = () => {

  const {loggedInUser, changeUsername, changePassword} = useContext(UserContext) as UserContextTypes;
  const [usernameChangeMsg, setUsernameChangeMsg] = useState<string>('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<string>('');

  const usernameFormik = useFormik({
    initialValues: {
      newUsername: ''
    },
    validationSchema: yup.object({
      newUsername: yup.string()
        .min(5, 'Username must be at least 5 characters long!')
        .max(20, "Username can't be longer than 20 characters!")
        .test('is-different', 'Cannot change to the same username!', (value) => {
          return value !== loggedInUser?.username;
        })
    }),
    onSubmit: async (values) => {
      if(loggedInUser){
        const results = await changeUsername(loggedInUser._id, values.newUsername);
        if('success' in results){
          setUsernameChangeMsg(results.success)
          setTimeout(() => {
            setUsernameChangeMsg('')
          }, 2000)
        }
      }
      usernameFormik.resetForm();
    }
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: yup.object({
      oldPassword: yup.string().required("Old Password is required"),
      newPassword: yup.string().required('New password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{5,20}$/,
        "Password must containt at least: one lowercase, one uppercase, one number, one special symbol. Password length must be between 5 and 20 characters!"
      ),
      confirmNewPassword: yup.string()
        .oneOf([yup.ref('newPassword'), undefined], 'Passwords must match')
        .required('Confirm new password is required')
    }),
    onSubmit: async (values) => {
      if(loggedInUser){
        const results = await changePassword(loggedInUser._id, values.oldPassword, values.newPassword);
        if('success' in results){
          setPasswordChangeMsg(results.success)
          setTimeout(() => {
            setPasswordChangeMsg('')
          }, 3000)
        } else if('error' in results){
          setPasswordChangeMsg(results.error);
          setTimeout(() => {
            setPasswordChangeMsg('')
          }, 3000)
        }
      }
      passwordFormik.resetForm();
    }
  });

  return (
    <StyledSection>
      <h2>Settings</h2>
      <div className="profilePic">
        <img src={loggedInUser?.profileImage} alt={loggedInUser?.username} />
        <button>Change Profile Picture</button>
      </div>
      <div className="usernameAndPassword">
        <div className="username">
          <h3>Change username</h3>
          <form onSubmit={usernameFormik.handleSubmit}>
            <div>
              <input 
                type="text"
                id="newUsername" name="newUsername"
                placeholder="Change Username"
                onChange={usernameFormik.handleChange}
                onBlur={usernameFormik.handleBlur}
                value={usernameFormik.values.newUsername}
              />
              {usernameFormik.touched.newUsername && usernameFormik.errors.newUsername ? (
                <p className="errorMsg">{usernameFormik.errors.newUsername}</p>
              ) : null}
            </div>
            <input type="submit" value="Change username" />
          </form>
          {usernameChangeMsg && <p>{usernameChangeMsg}</p>}
        </div>
        <div className="password">
          <h3>Change Password</h3>
          <form onSubmit={passwordFormik.handleSubmit}>
            <div>
              <input 
                type="password"
                id="oldPassword" name="oldPassword"
                placeholder="Old Password"
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.oldPassword}
              />
              {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword ? (
                <p className="errorMsg">{passwordFormik.errors.oldPassword}</p>
              ) : null}
            </div>
            <div>
              <input 
                type="password"
                id="newPassword" name="newPassword"
                placeholder="New Password"
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.newPassword}
              />
              {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? (
                <p className="errorMsg">{passwordFormik.errors.newPassword}</p>
              ) : null}
            </div>
            <div>
              <input 
                type="password"
                id="confirmNewPassword" name="confirmNewPassword"
                placeholder="Repeat New Password"
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.confirmNewPassword}
              />
              {passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword ? (
                <p className="errorMsg">{passwordFormik.errors.confirmNewPassword}</p>
              ) : null}
            </div>
            <input type="submit" value="Change password" />
          </form>
          {passwordChangeMsg && (
            <p className={passwordChangeMsg.includes('successfully') ? 'success-message' : 'error-message'}>
              {passwordChangeMsg}
            </p>
          )}
        </div>
      </div>
    </StyledSection>
  );
}
 
export default UserProfile;
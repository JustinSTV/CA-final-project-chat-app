import { createContext, useState, useReducer, ReactElement, useEffect } from "react";

type ChildProps = { children: ReactElement };

export type UserType = {
  _id: string,
  username: string,
  profileImage: string | undefined,
  password: string
};

export type UserContextTypes = {
  users: UserType[],
  loggedInUser: UserType | null,
  registerUser: (user: Omit<UserType, "_id">) => Promise<ErrorOrSuccessReturn>,
  logInUser: (userLoginInfo: Pick<UserType, "username" | "password">) => Promise<ErrorOrSuccessReturn>,
  logOut: () => void,
  changeUsername: (userId: string, newUsername: string) => Promise<ErrorOrSuccessReturn>,
  changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<ErrorOrSuccessReturn>
};

export type ErrorOrSuccessReturn = { error: string } | { success: string };

type ReducerActionTypeVariations = 
{ type: 'getData', allData: UserType[] } |
{ type: 'add', data: UserType }

const reducer = (state: UserType[], action: ReducerActionTypeVariations): UserType[] => {
  switch(action.type){
    case 'getData':
      return action.allData;
    case 'add':
      return [...state, action.data]
  }
} 

const UserContext = createContext<UserContextTypes | undefined>(undefined);

const UserProvider = ({children}: ChildProps) => {

  const [users, dispatch] = useReducer(reducer, []);
  const [loggedInUser, setLoggedInUser] = useState<null | UserType>(null);

  const registerUser = async (user: Omit<UserType, "_id">): Promise<ErrorOrSuccessReturn> => {
    try{
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if(res.status === 409){
        const errorMsg = await res.json();
        return errorMsg;
      } else {
        const data = await res.json();
        dispatch({
          type: 'add',
          data: data
        });
        setLoggedInUser(data)
        return { success: 'Successfully regsitered!' };
      }
    }catch(err){
      console.error(err);
      return { error: "Atsiprašome, registracijos metu įvyko serverio klaidą" };
    }
  };

  const logInUser = async (userLoginInfo: Pick<UserType, 'username' | 'password'>): Promise<ErrorOrSuccessReturn> => {
    try{
      const res = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(userLoginInfo)
      });

      if(res.status === 401){
        const error = await res.json();
        return error;
      } else {
        const data = await res.json();
        setLoggedInUser(data)
        return { success: "Successfuly logged In!" }
      }

    }catch(err){
      console.error(err)
      return { error: 'Server Error! Something went wrong while logging in'}
    }
  }

  const logOut = () => {
    setLoggedInUser(null);
  }

  const changeUsername = async (userId: string, newUsername: string): Promise<ErrorOrSuccessReturn> => {
    try{
      const res = await fetch(`/api/users/${userId}/username`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: newUsername })
      });
      if(res.status === 409){
        const errorMsg = await res.json();
        return errorMsg;
      } else {
        const data = await res.json();
        setLoggedInUser(data);
        return { success: 'Username successfully changed!' };
      }
    } catch(err){
      console.error(err);
      return { error: "Server error occurred while changing username" };
    }
  };

  const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<ErrorOrSuccessReturn> => {
    try{
      const res = await fetch(`/api/users/${userId}/password`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if(res.status === 401){
        const errorMsg = await res.json();
        console.log(errorMsg)
        return errorMsg;
      } else {
        return { success: 'Password successfully changed!' };
      }
    } catch(err){
      console.error(err);
      return { error: "Server error occurred while changing password" };
    }
  };

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => dispatch({
        type: 'getData',
        allData: data
      }))
      .catch(err => console.log(err))
  }, [])

  return(
    <UserContext.Provider
      value={{
        users,
        loggedInUser,
        registerUser,
        logInUser,
        logOut,
        changeUsername,
        changePassword
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export {UserProvider};
export default UserContext;
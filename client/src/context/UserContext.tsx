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
  logInUser: (userLoginInfo: Pick<UserType, "username" | "password">) => Promise<ErrorOrSuccessReturn>
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
      console.log("Registering user:", user);
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      console.log(res);

      if(res.status === 409){
        const errorMsg = await res.json();
        console.log("error:", errorMsg);
        return errorMsg;
      } else {
        const data = await res.json();
        console.log("user Created:", data);
        dispatch({
          type: 'add',
          data: data
        });
        setLoggedInUser(data)
        return { success: 'Registraciją Sėkmingą!' };
      }
    }catch(err){
      console.error(err);
      return { error: "Atsiprašome, registracijos metu įvyko serverio klaidą" };
    }
  };

  const logInUser = async (userLoginInfo: Pick<UserType, 'username' | 'password'>): Promise<ErrorOrSuccessReturn> => {
    try{
      console.log('user login info', userLoginInfo)
      const res = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(userLoginInfo)
      });
      console.log("res front", res);

      if(res.status === 401){
        const error = await res.json();
        return error;
      } else {
        const data = await res.json();
        console.log("ok data:",data)
        setLoggedInUser(data)
        return { success: "Successfuly logged In!" }
      }

    }catch(err){
      console.error(err)
      return { error: 'Server Error! Something went wrong while logging in'}
    }
  }

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
        logInUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export {UserProvider};
export default UserContext;
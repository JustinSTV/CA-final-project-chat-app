import { createContext, useReducer, ReactElement } from "react";

type ChildProps = { children: ReactElement };

export type UserType = {
  _id: string,
  username: string,
  profileImage: string,
  password: string
};

export type UserContextTypes = {
  users: UserType[],
  registerUser: (user: Omit<UserType, "_id">) => Promise<ErrorOrSuccessReturn>
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
        return { success: 'Registraciją Sėkmingą!' };
      }
    }catch(err){
      console.error(err);
      return { error: "Atsiprašome, registracijos metu įvyko serverio klaidą" };
    }
  }

  return(
    <UserContext.Provider
      value={{
        users,
        registerUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export {UserProvider};
export default UserContext;
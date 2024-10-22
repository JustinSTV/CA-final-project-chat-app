import { createContext, useReducer, ReactElement } from "react";

type ChildProps = { children: ReactElement };

export type UserType = {
  _id: string,
  username: string,
  profileImage: string,
  password: string
};

export type UserContextTypes = {
  users: UserType[]
};

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

  return(
    <UserContext.Provider
      value={{
        users
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export {UserProvider};
export default UserContext;
import { createContext, useReducer, ReactElement, useEffect } from "react";
import { UserType } from "./UserContext";

type ChildProps = { children: ReactElement };

export type ConverstationType = {
  _id: string,
  participants: string[],
  createdAt: string,
  updatedAt: string,
  lastMessage: {
    content: string,
    senderId: UserType['_id'],
    createdAt: string
  }
}

type ConversationWithUserType = ConverstationType & {
  userData: UserType[]
}

export type ConversationContextTypes = {
  conversations: ConversationWithUserType[],
};

type ReducerActionTypeVariations =
{ type: 'setConversation', data: ConversationWithUserType[] } |
{ type: 'startConversation', newConversation: ConversationWithUserType }

const reducer = (state: ConversationWithUserType[], action: ReducerActionTypeVariations): ConversationWithUserType[]  => {
  switch(action.type){
    case 'setConversation':
      return action.data;
    case 'startConversation':
      return [...state, action.newConversation]
  }
}

const ConverstationContext = createContext<undefined | ConversationContextTypes>(undefined);

const ConverstationProvider = ({children}: ChildProps) => {

  const [conversations, dispatch] = useReducer(reducer, []);
  console.log(conversations)

  useEffect(() => {
    fetch('/api/conversations')
    .then(res => res.json())
    .then(data => {
      console.log("user convos:",data)
      dispatch({
        type: 'setConversation',
        data: data
      })
    })
  },[])

  return(
    <ConverstationContext.Provider
      value={{
        conversations
      }}
    >
      {children}
    </ConverstationContext.Provider>
  )
}

export {ConverstationProvider};
export default ConverstationContext;

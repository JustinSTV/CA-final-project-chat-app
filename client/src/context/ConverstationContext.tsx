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

export type ConversationContextTypes = {
  conversations: ConverstationType[],
  startConversation: (participants: string[]) => Promise<ConverstationType>
};

type ReducerActionTypeVariations =
{ type: 'setConversation', data: ConverstationType[] } |
{ type: 'startConversation', newConversation: ConverstationType }

const reducer = (state: ConverstationType[], action: ReducerActionTypeVariations): ConverstationType[]  => {
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

  const startConversation = async (participants: string[]): Promise<ConverstationType> => {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ participants })
    });
    const newConversation = await response.json();
    dispatch({ type: 'startConversation', newConversation });
    return newConversation;
  };

  return(
    <ConverstationContext.Provider
      value={{
        conversations,
        startConversation
      }}
    >
      {children}
    </ConverstationContext.Provider>
  )
}

export {ConverstationProvider};
export default ConverstationContext;

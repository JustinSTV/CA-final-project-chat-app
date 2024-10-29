import { createContext, useReducer, ReactElement} from "react";
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
  startConversation: (loggedInUserId: string, otherUserId: string) => Promise<ConverstationType>
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

  const startConversation = async (loggedInUserId: string, otherUserId: string): Promise<ConverstationType> => {
    try {
      const res = await fetch(`/api/conversations`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          loggedInUserId,
          otherUserId
        })
      });
  
      const data = await res.json();
      dispatch({
        type: 'startConversation',
        newConversation: data
      });
      return data;
    } catch (err) {
      console.error("Error starting chat:", err);
      throw err;
    }
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

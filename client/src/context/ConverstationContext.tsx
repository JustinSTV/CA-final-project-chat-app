import { createContext, useReducer, ReactElement, useState } from "react";
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

export type ConversationWithUserType = ConverstationType & {
  userData: UserType[],
  otherUserDetails: UserType
}

export type ConversationContextTypes = {
  conversations: ConversationWithUserType[],
  loading: boolean,
  startConversation: (loggedInUserId: string, otherUserId: string) => Promise<ConversationWithUserType>,
  fetchConversations: (userId: string) => Promise<void>,
  getConversation: (conversationId: string) => ConversationWithUserType | undefined
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
  const [loading, setLoading] = useState(false);

  const startConversation = async (loggedInUserId: string, otherUserId: string): Promise<ConversationWithUserType> => {
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

  const fetchConversations = async (userId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/conversations/${userId}`);
      const data = await res.json();
      dispatch({ type: 'setConversation', data });
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally{
      setLoading(false)
    }
  };

  const getConversation = (conversationId: string) => {
    return conversations.find(conv => conv._id === conversationId);
  };

  return(
    <ConverstationContext.Provider
      value={{
        conversations,
        loading,
        startConversation,
        fetchConversations,
        getConversation
      }}
    >
      {children}
    </ConverstationContext.Provider>
  )
}

export {ConverstationProvider};
export default ConverstationContext;

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
  otherUserDetails: UserType,
  unreadMessages: number;
}

export type ConversationContextTypes = {
  conversations: ConversationWithUserType[],
  loading: boolean,
  startConversation: (loggedInUserId: string, otherUserId: string) => Promise<ConversationWithUserType>,
  fetchConversations: (userId: string) => Promise<void>,
  getConversation: (conversationId: string) => ConversationWithUserType | undefined,
  markConversationAsRead: (conversationId: string) => Promise<void>,
  deleteConversation: (conversationId: string) => Promise<void>
};

type ReducerActionTypeVariations =
{ type: 'setConversation', data: ConversationWithUserType[] } |
{ type: 'startConversation', newConversation: ConversationWithUserType } |
{ type: 'markAsRead'; conversationId: string } |
{ type: 'delete', id: string }


const reducer = (state: ConversationWithUserType[], action: ReducerActionTypeVariations): ConversationWithUserType[]  => {
  switch(action.type){
    case 'setConversation':
      return action.data;
    case 'startConversation':
      return [...state, action.newConversation]
    case 'markAsRead':
      return state.map(convo =>
        convo._id === action.conversationId ? { ...convo, unreadMessages: 0 } : convo
      );
    case 'delete':
      return state.filter(conversation => conversation._id !== action.id)
    default:
      return state;
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

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'PATCH'
      });
      dispatch({
        type: 'markAsRead',
        conversationId
      });
    } catch (err) {
      console.error("Error marking conversation as read:", err);
    }
  };

  const getConversation = (conversationId: string) => {
    return conversations.find(conv => conv._id === conversationId);
  };

  const deleteConversation = async (conversationId:string): Promise<void> => {
    try{
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      });
      dispatch({
        type: 'delete',
        id: conversationId
      })
    } catch(err){
      console.log(err)
    }
  }

  return(
    <ConverstationContext.Provider
      value={{
        conversations,
        loading,
        startConversation,
        fetchConversations,
        getConversation,
        markConversationAsRead,
        deleteConversation
      }}
    >
      {children}
    </ConverstationContext.Provider>
  )
}

export {ConverstationProvider};
export default ConverstationContext;

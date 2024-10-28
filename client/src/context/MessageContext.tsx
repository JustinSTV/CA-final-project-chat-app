import { createContext, useReducer, ReactElement } from "react";
import { UserType } from "./UserContext";

type ChildProps = { children: ReactElement };

export type MessageType = {
  _id: string,
  conversationId: string,
  senderId: UserType['_id'],
  content: string,
  createdAt: string,
  likes: UserType['_id'][]
};

export type MessageContextTypes = {
  messages: MessageType[],
  fetchMessages: (conversationId: string) => Promise<void>,
  addMessage: (message: Omit<MessageType, "_id">) => Promise<void>
};

type ReducerActionTypeVariations =
  { type: 'setMessages', data: MessageType[] } |
  { type: 'addMessage', newMessage: MessageType } |
  { type: 'likeMessage', messageId: string, userId: UserType['_id'] };

const reducer = (state: MessageType[], action: ReducerActionTypeVariations): MessageType[] => {
  switch (action.type) {
    case 'setMessages':
      return action.data;
    case 'addMessage':
      return [...state, action.newMessage];
    case 'likeMessage':
      return state.map(message =>
        message._id === action.messageId
          ? { ...message, likes: [...message.likes, action.userId] }
          : message
      );
    default:
      return state;
  }
};

const MessageContext = createContext<undefined | MessageContextTypes>(undefined);

const MessageProvider = ({ children }: ChildProps) => {
  const [messages, dispatch] = useReducer(reducer, []);

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      const data = await res.json();
      dispatch({ type: 'setMessages', data });
    } catch (err) {
      console.error(err);
    }
  };
  
  const addMessage = async (message: Omit<MessageType, '_id'>) => {
    try {
      const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });
      const newMessage = await res.json();
      dispatch({ type: 'addMessage', newMessage });
  
      await fetch(`/api/conversations/${message.conversationId}/lastMessage`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MessageContext.Provider 
      value={{ 
        messages,
        fetchMessages,
        addMessage
      }}>
      {children}
    </MessageContext.Provider>
  );
};

export { MessageProvider };
export default MessageContext;
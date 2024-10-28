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
  dispatch: React.Dispatch<ReducerActionTypeVariations>
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

  

  return (
    <MessageContext.Provider 
      value={{ 
        messages,
      }}>
      {children}
    </MessageContext.Provider>
  );
};

export { MessageProvider };
export default MessageContext;
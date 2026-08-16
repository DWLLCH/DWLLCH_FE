import { useContext } from 'react';
import { ChatbotContext } from '../components/ChatbotProvider';

function useChatbot() {
  return useContext(ChatbotContext);
}

export default useChatbot;

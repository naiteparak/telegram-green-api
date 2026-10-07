import { useState } from 'react';
import type { Chat, IncomingMessage, Message } from '../types';
import { addIncomingMessage, bindChatId } from './conversationState';

export function useConversations() {
  const [conversations, setConversations] = useState<{
    chats: Chat[];
    messages: Message[];
  }>({ chats: [], messages: [] });
  function addChat(chat: Chat) {
    setConversations((previous) => {
      const added = { ...previous, chats: [chat, ...previous.chats] };
      return chat.providerChatId
        ? bindChatId(added, chat.id, chat.providerChatId)
        : added;
    });
  }
  function addSentMessage(message: Message) {
    setConversations((previous) =>
      previous.messages.some(
        (existing) =>
          existing.chatId === message.chatId && existing.id === message.id,
      )
        ? previous
        : { ...previous, messages: [...previous.messages, message] },
    );
  }
  function receiveMessage(incoming: IncomingMessage) {
    setConversations((previous) => addIncomingMessage(previous, incoming));
  }
  function resolveChat(chatId: string, providerChatId: string) {
    setConversations((previous) =>
      bindChatId(previous, chatId, providerChatId),
    );
  }
  function clearConversations() {
    setConversations({ chats: [], messages: [] });
  }
  return {
    ...conversations,
    addChat,
    addSentMessage,
    receiveMessage,
    resolveChat,
    clearConversations,
  };
}

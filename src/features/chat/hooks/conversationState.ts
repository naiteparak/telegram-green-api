import type { Chat, IncomingMessage, Message } from '../types';

type Conversations = { chats: Chat[]; messages: Message[] };

export function addIncomingMessage(
  previous: Conversations,
  incoming: IncomingMessage,
): Conversations {
  const existing =
    previous.chats.find(
      (chat) => chat.providerChatId === incoming.providerChatId,
    ) ??
    previous.chats.find(
      (chat) =>
        incoming.phone &&
        chat.phone.replace(/\D/g, '') === incoming.phone.replace(/\D/g, ''),
    );
  const chat: Chat = existing
    ? {
        ...existing,
        providerChatId: incoming.providerChatId,
        phone: existing.phone || incoming.phone,
      }
    : {
        id: crypto.randomUUID(),
        providerChatId: incoming.providerChatId,
        phone: incoming.phone,
        title: incoming.title,
      };
  const duplicate = previous.messages.some(
    (message) =>
      message.chatId === chat.id && message.id === incoming.message.id,
  );
  return {
    chats: existing
      ? previous.chats.map((entry) => (entry.id === chat.id ? chat : entry))
      : [chat, ...previous.chats],
    messages: duplicate
      ? previous.messages
      : [...previous.messages, { ...incoming.message, chatId: chat.id }],
  };
}

export function bindChatId(
  previous: Conversations,
  chatId: string,
  providerChatId: string,
): Conversations {
  const duplicate = previous.chats.find(
    (chat) => chat.id !== chatId && chat.providerChatId === providerChatId,
  );
  const messages = previous.messages.map((message) =>
    duplicate && message.chatId === duplicate.id
      ? { ...message, chatId }
      : message,
  );
  // A reply may arrive while the first phone lookup is pending. Merge it into the open conversation.
  return {
    chats: previous.chats
      .filter((chat) => chat.id !== duplicate?.id)
      .map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              providerChatId,
              phone: chat.phone || duplicate?.phone || '',
              username: chat.username || duplicate?.username,
            }
          : chat,
      ),
    messages: messages.filter(
      (message, index) =>
        messages.findIndex(
          (entry) => entry.chatId === message.chatId && entry.id === message.id,
        ) === index,
    ),
  };
}

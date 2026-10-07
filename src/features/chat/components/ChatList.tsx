import { Plus, Search } from 'lucide-react';
import ChatListItem from './ChatListItem';
import type { Chat, Message } from '../types';

type ChatListProps = {
  chats: Chat[];
  messages: Message[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
};

export default function ChatList({
  chats,
  messages,
  selectedChatId,
  onSelectChat,
  searchQuery,
}: ChatListProps) {
  const query = searchQuery.trim().toLowerCase();
  const usernameQuery = query.replace(/^@/, '');
  const phoneQuery = /^[+\d\s()-]+$/.test(query)
    ? query.replace(/\D/g, '')
    : '';
  const filteredChats = chats.filter(
    (chat) =>
      !query ||
      chat.title.toLowerCase().includes(query) ||
      Boolean(
        usernameQuery &&
        chat.username?.replace(/^@/, '').toLowerCase().includes(usernameQuery),
      ) ||
      Boolean(phoneQuery && chat.phone.replace(/\D/g, '').includes(phoneQuery)),
  );

  if (query && filteredChats.length === 0) {
    return (
      <div
        role="status"
        className="w-full self-center px-4 text-center text-placeholder"
      >
        <Search className="mx-auto mb-3 size-6 text-icon" aria-hidden="true" />
        <h2 className="mb-2 font-bold text-heading-secondary">
          No matching chats
        </h2>
        <p className="text-sm">Try another name, phone number or username.</p>
      </div>
    );
  }
  if (chats.length === 0) {
    return (
      <div className="w-full self-center px-4 text-center text-placeholder">
        <div
          className="mx-auto mb-3 grid size-13 place-items-center rounded-2xl bg-accent-surface text-accent"
          aria-hidden="true"
        >
          <Plus />
        </div>
        <h2 className="mb-2 font-bold text-heading-secondary">No chats yet</h2>
        <p className="text-sm">Create a chat to start sending text messages.</p>
      </div>
    );
  }

  return (
    <ul className="w-full space-y-1">
      {filteredChats.map((chat) => {
        const lastMessage = messages.reduce<Message | undefined>(
          (latest, message) =>
            message.chatId === chat.id &&
            (!latest || message.timestamp > latest.timestamp)
              ? message
              : latest,
          undefined,
        );

        return (
          <li key={chat.id}>
            <ChatListItem
              chat={chat}
              lastMessage={lastMessage}
              isSelected={chat.id === selectedChatId}
              onSelect={onSelectChat}
            />
          </li>
        );
      })}
    </ul>
  );
}

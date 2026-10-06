import { Plus } from 'lucide-react';
import ChatListItem from './ChatListItem';
import type { Chat, Message } from '../types';

type ChatListProps = {
  chats: Chat[];
  messages: Message[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
};

export default function ChatList({
  chats,
  messages,
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
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
      {chats.map((chat) => {
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

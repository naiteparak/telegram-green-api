import Avatar from '../../../components/ui/Avatar';
import type { Chat, Message } from '../types';

type ChatListItemProps = {
  chat: Chat;
  lastMessage?: Message;
  isSelected: boolean;
  onSelect: (chatId: string) => void;
};

export default function ChatListItem({
  chat,
  lastMessage,
  isSelected,
  onSelect,
}: ChatListItemProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(chat.id)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary ${isSelected ? 'bg-accent-surface' : 'hover:bg-surface-hover'}`}
    >
      <Avatar name={chat.title} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="truncate font-semibold text-heading">
            {chat.title}
          </span>
          {lastMessage && (
            <time
              className="ml-auto shrink-0 text-xs text-subtle"
              dateTime={new Date(lastMessage.timestamp).toISOString()}
            >
              {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          )}
        </span>
        <span className="mt-1 block truncate text-sm text-muted">
          {lastMessage
            ? `${lastMessage.direction === 'outgoing' ? 'You: ' : ''}${lastMessage.text}`
            : 'No messages yet'}
        </span>
      </span>
    </button>
  );
}

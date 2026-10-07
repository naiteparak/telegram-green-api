import { ArrowLeft } from 'lucide-react';
import { Avatar, Button } from '@components';
import type { Chat } from '../types';

type ChatHeaderProps = { chat: Chat; onBack: () => void };

export default function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        aria-label="Back to chat list"
        className="min-[681px]:hidden"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Button>
      <Avatar name={chat.title} />
      <div className="min-w-0">
        <h2 className="truncate font-semibold text-heading">{chat.title}</h2>
        <p className="mt-0.5 text-sm text-muted">
          {chat.username || chat.phone}
        </p>
      </div>
    </header>
  );
}

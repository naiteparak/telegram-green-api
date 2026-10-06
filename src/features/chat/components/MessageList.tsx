import { MessageSquareText } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../types';

type MessageListProps = { messages: Message[] };

export default function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (container && isNearBottom.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      aria-label="Message history"
      onScroll={(event) => {
        const container = event.currentTarget;
        isNearBottom.current =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          80;
      }}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
    >
      {messages.length === 0 ? (
        <div className="grid min-h-full place-items-center text-center">
          <div>
            <MessageSquareText
              className="mx-auto mb-3 size-10 text-illustration"
              aria-hidden="true"
            />
            <h3 className="mb-2 font-semibold text-heading">No messages yet</h3>
            <p className="text-sm text-muted">
              This is the start of your conversation.
            </p>
          </div>
        </div>
      ) : (
        <ol className="space-y-2">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              timestamp={message.timestamp}
              direction={message.direction}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

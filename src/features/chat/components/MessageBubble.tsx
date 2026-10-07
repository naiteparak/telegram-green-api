import type { Message } from '../types';

type MessageBubbleProps = Pick<Message, 'text' | 'timestamp' | 'direction'>;

export default function MessageBubble({
  text,
  timestamp,
  direction,
}: MessageBubbleProps) {
  const isOutgoing = direction === 'outgoing';

  return (
    <li className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <article
        className={`max-w-[85%] min-w-0 rounded-2xl px-3 py-2 min-[681px]:max-w-[70%] ${isOutgoing ? 'rounded-br-sm bg-message-outgoing' : 'rounded-bl-sm border border-border bg-message-incoming'}`}
      >
        <span className="sr-only">{isOutgoing ? 'You' : 'Recipient'}: </span>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
          {text}
        </p>
        <time
          className="mt-1 block text-right text-[0.7rem] text-muted"
          dateTime={new Date(timestamp).toISOString()}
        >
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
          })}
        </time>
      </article>
    </li>
  );
}

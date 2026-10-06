import { Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@components';

type MessageComposerProps = { onSend: (text: string) => void };

export default function MessageComposer({ onSend }: MessageComposerProps) {
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  function sendDraft() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  }

  return (
    <form
      className="shrink-0 border-t border-border bg-surface px-4 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        sendDraft();
      }}
    >
      <div className="flex items-end gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Message</span>
          <textarea
            value={draft}
            rows={2}
            placeholder="Write a message…"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                sendDraft();
              }
            }}
            className="block max-h-40 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-primary"
          />
        </label>
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!canSend}
        >
          <Send className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

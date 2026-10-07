import { LoaderCircle, Send } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Button } from '@components';

type MessageComposerProps = {
  onSend: (text: string) => Promise<boolean>;
  isSending: boolean;
  error?: string;
};

export default function MessageComposer({
  onSend,
  isSending,
  error,
}: MessageComposerProps) {
  const errorId = useId();
  const submittingRef = useRef(false);
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  async function sendDraft() {
    const text = draft.trim();
    if (!text || isSending || submittingRef.current) return;
    submittingRef.current = true;
    try {
      if (await onSend(text)) setDraft('');
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <form
      className="shrink-0 border-t border-border bg-surface px-4 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        void sendDraft();
      }}
    >
      <div className="flex items-start gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Message</span>
          <textarea
            value={draft}
            rows={2}
            maxLength={4096}
            disabled={isSending}
            aria-describedby={error ? errorId : undefined}
            placeholder="Write a message…"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void sendDraft();
              }
            }}
            className="block max-h-40 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-primary"
          />
        </label>
        <Button
          type="submit"
          size="icon"
          aria-label={isSending ? 'Sending message' : 'Send message'}
          disabled={!canSend || isSending}
        >
          {isSending ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-5" aria-hidden="true" />
          )}
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}

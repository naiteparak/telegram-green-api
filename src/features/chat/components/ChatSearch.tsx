import { X } from 'lucide-react';
import { useId, useRef } from 'react';
import { Button } from '@components';

type ChatSearchProps = { value: string; onChange: (value: string) => void };

export default function ChatSearch({ value, onChange }: ChatSearchProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      role="search"
      className="mx-6 mb-3 flex shrink-0 items-center gap-2 rounded-2xl bg-surface-hover px-4 focus-within:outline-2 focus-within:outline-primary"
    >
      <label htmlFor={inputId} className="sr-only">
        Search chats by name, phone or username
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onChange('');
        }}
        placeholder="Search"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        className="min-w-0 flex-1 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-placeholder"
      />
      {value && (
        <Button
          size="icon"
          variant="ghost"
          aria-label="Clear chat search"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="size-7"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

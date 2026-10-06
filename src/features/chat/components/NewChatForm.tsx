import { SquarePen } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Button } from '@components';

type NewChatFormProps = { onCreateChat: (phone: string) => void };

export default function NewChatForm({ onCreateChat }: NewChatFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const formId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  function closeForm() {
    setIsOpen(false);
    setPhone('');
    setError('');
    triggerRef.current?.querySelector('button')?.focus();
  }

  return (
    <div className="mx-[18px] mb-4 shrink-0">
      <div ref={triggerRef}>
        <Button
          className="w-full justify-start"
          aria-expanded={isOpen}
          aria-controls={isOpen ? formId : undefined}
          onClick={() => (isOpen ? closeForm() : setIsOpen(true))}
        >
          <SquarePen className="size-5" strokeWidth={1.8} aria-hidden="true" />
          New chat
        </Button>
      </div>
      {isOpen && (
        <form
          id={formId}
          className="mt-3 space-y-3 rounded-xl border border-border p-3"
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeForm();
          }}
          onSubmit={(event) => {
            event.preventDefault();
            const input = phone.trim();
            const digits = input.replace(/\D/g, '');
            if (
              !/^\+?[1-9][\d\s()-]*$/.test(input) ||
              digits.length < 7 ||
              digits.length > 15
            ) {
              setError('Enter a phone number with country code (7–15 digits).');
              return;
            }
            onCreateChat(`+${digits}`);
            setIsOpen(false);
            setPhone('');
            setError('');
          }}
        >
          <label
            className="block text-sm font-medium text-heading"
            htmlFor={`${formId}-phone`}
          >
            Recipient phone number
          </label>
          <input
            id={`${formId}-phone`}
            autoFocus
            type="tel"
            autoComplete="tel"
            placeholder="+7 900 000 00 01"
            value={phone}
            aria-invalid={Boolean(error)}
            aria-describedby={`${formId}-help${error ? ` ${formId}-error` : ''}`}
            onChange={(event) => {
              setPhone(event.target.value);
              setError('');
            }}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-primary"
          />
          <p id={`${formId}-help`} className="text-xs text-muted">
            Include the country code, for example +7.
          </p>
          {error && (
            <p
              id={`${formId}-error`}
              role="alert"
              className="text-sm text-error"
            >
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit">Open chat</Button>
            <Button variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

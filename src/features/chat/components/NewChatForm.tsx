import { Plus, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@components';
import { normalizeRecipient } from '../helpers';

type NewChatFormProps = {
  onCreateChat: (recipient: string) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  nameWarning: string | null;
};

export default function NewChatForm({
  onCreateChat,
  isCreating,
  createError,
  nameWarning,
}: NewChatFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const visibleError = error || (hasSubmitted ? createError : null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  function closeForm() {
    dialogRef.current?.close();
    setIsOpen(false);
    setRecipient('');
    setError('');
    setHasSubmitted(false);
    triggerRef.current?.querySelector('button')?.focus();
  }

  async function submit() {
    if (isCreating || submittingRef.current) return;
    let normalized: string;
    try {
      normalized = normalizeRecipient(recipient).value;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Enter a valid phone number or username.',
      );
      return;
    }
    submittingRef.current = true;
    setHasSubmitted(true);
    setError('');
    try {
      if (await onCreateChat(normalized)) closeForm();
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <>
      <span ref={triggerRef}>
        <Button
          size="icon"
          shape="circle"
          variant="flat"
          aria-label="New chat"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? formId : undefined}
          disabled={isCreating}
          onClick={() => setIsOpen(true)}
        >
          <Plus className="size-6" strokeWidth={2} aria-hidden="true" />
        </Button>
      </span>
      {isOpen &&
        createPortal(
          <dialog
            ref={dialogRef}
            id={formId}
            aria-labelledby={`${formId}-title`}
            className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-[32px] border-0 bg-surface p-6 text-foreground shadow-app backdrop:bg-shadow/50 sm:p-8"
            onCancel={(event) => {
              event.preventDefault();
              if (!isCreating) closeForm();
            }}
            onClick={(event) => {
              if (event.target !== event.currentTarget || isCreating) return;
              const rect = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
              )
                closeForm();
            }}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2
                id={`${formId}-title`}
                className="text-2xl font-bold tracking-tight"
              >
                Find a contact
              </h2>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Close new chat"
                disabled={isCreating}
                onClick={closeForm}
              >
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              <label htmlFor={`${formId}-recipient`} className="sr-only">
                Phone number or username
              </label>
              <input
                ref={inputRef}
                id={`${formId}-recipient`}
                autoFocus
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="+7 900 000 00 01 or @username"
                value={recipient}
                disabled={isCreating}
                aria-invalid={Boolean(visibleError)}
                aria-describedby={`${formId}-help${visibleError ? ` ${formId}-error` : ''}`}
                onChange={(event) => {
                  setRecipient(event.target.value);
                  setError('');
                  setHasSubmitted(false);
                }}
                className="w-full rounded-2xl bg-surface-hover px-4 py-4 text-base text-foreground placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-primary"
              />
              <p id={`${formId}-help`} className="mt-3 text-sm text-muted">
                Use an international phone number or a Telegram username.
              </p>
              {visibleError && (
                <p
                  id={`${formId}-error`}
                  role="alert"
                  className="mt-3 text-sm text-error"
                >
                  {visibleError}
                </p>
              )}
              <Button
                type="submit"
                variant="flat"
                disabled={isCreating || !recipient.trim()}
                className="mt-6 w-full rounded-2xl py-4 shadow-none"
              >
                {isCreating ? 'Finding contact…' : 'Find in Telegram'}
              </Button>
            </form>
          </dialog>,
          document.body,
        )}
      {nameWarning &&
        !isOpen &&
        createPortal(
          <p
            role="status"
            className="fixed bottom-4 left-1/2 z-10 w-[calc(100%_-_2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted shadow-app"
          >
            {nameWarning}
          </p>,
          document.body,
        )}
    </>
  );
}

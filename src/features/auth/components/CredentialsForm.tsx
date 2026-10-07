import { KeyRound } from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '@components';
import type { Credentials } from '../types';
import { useConnect } from '../hooks';

type CredentialsFormProps = { onConnect: (credentials: Credentials) => void };

export default function CredentialsForm({ onConnect }: CredentialsFormProps) {
  const formId = useId();
  const { connect, isChecking, connectionError } = useConnect(onConnect);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof Credentials, string>>
  >({});
  const inputClassName =
    'mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-primary';

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-8">
      <section
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-app"
        aria-labelledby={`${formId}-title`}
      >
        <KeyRound className="mb-4 size-8 text-primary" aria-hidden="true" />
        <p className="mb-1 text-xs font-bold tracking-widest text-label uppercase">
          GREEN-API
        </p>
        <h1 id={`${formId}-title`} className="text-2xl font-bold text-heading">
          Connect your account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter your instance credentials to open the chat.
        </p>
        <form
          noValidate
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (isChecking) return;
            const credentials = {
              idInstance: idInstance.trim(),
              apiTokenInstance: apiTokenInstance.trim(),
            };
            const nextErrors: typeof errors = {};
            if (!credentials.idInstance)
              nextErrors.idInstance = 'Enter your instance ID.';
            else if (!/^\d+$/.test(credentials.idInstance))
              nextErrors.idInstance =
                'The instance ID must contain only digits.';
            if (!credentials.apiTokenInstance)
              nextErrors.apiTokenInstance = 'Enter your API token.';
            setErrors(nextErrors);
            if (Object.keys(nextErrors).length === 0) void connect(credentials);
          }}
        >
          <div>
            <label
              htmlFor={`${formId}-instance`}
              className="text-sm font-medium text-heading"
            >
              Instance ID
            </label>
            <input
              id={`${formId}-instance`}
              name="idInstance"
              disabled={isChecking}
              required
              autoFocus
              autoComplete="off"
              value={idInstance}
              onChange={(event) => {
                setIdInstance(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  idInstance: undefined,
                }));
              }}
              aria-invalid={Boolean(errors.idInstance)}
              aria-describedby={
                errors.idInstance ? `${formId}-instance-error` : undefined
              }
              className={inputClassName}
            />
            {errors.idInstance && (
              <p
                id={`${formId}-instance-error`}
                role="alert"
                className="mt-1 text-sm text-error"
              >
                {errors.idInstance}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor={`${formId}-token`}
              className="text-sm font-medium text-heading"
            >
              API token
            </label>
            <input
              id={`${formId}-token`}
              name="apiTokenInstance"
              disabled={isChecking}
              type="password"
              required
              autoComplete="off"
              spellCheck={false}
              value={apiTokenInstance}
              onChange={(event) => {
                setApiTokenInstance(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  apiTokenInstance: undefined,
                }));
              }}
              aria-invalid={Boolean(errors.apiTokenInstance)}
              aria-describedby={
                errors.apiTokenInstance ? `${formId}-token-error` : undefined
              }
              className={inputClassName}
            />
            {errors.apiTokenInstance && (
              <p
                id={`${formId}-token-error`}
                role="alert"
                className="mt-1 text-sm text-error"
              >
                {errors.apiTokenInstance}
              </p>
            )}
          </div>
          {connectionError && (
            <p role="alert" className="text-sm text-error">
              {connectionError}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isChecking}>
            {isChecking ? 'Checking credentials…' : 'Connect'}
          </Button>
          <p className="text-xs leading-relaxed text-muted">
            Credentials are kept only for this session and cleared when you
            disconnect or refresh.
          </p>
        </form>
      </section>
    </main>
  );
}

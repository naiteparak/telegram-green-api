export function normalizeRecipient(input: string): {
  kind: 'phone' | 'username';
  value: string;
} {
  const recipient = input.trim();
  const digits = recipient.replace(/\D/g, '');
  if (
    /^\+?[1-9][\d\s()-]*$/.test(recipient) &&
    digits.length >= 7 &&
    digits.length <= 15
  ) {
    return { kind: 'phone', value: `+${digits}` };
  }
  // Accept usernames with or without @, but do not mistake a malformed phone number for a username.
  if (/^@?[a-z][a-z0-9_]{0,31}$/i.test(recipient)) {
    return {
      kind: 'username',
      value: `@${recipient.replace(/^@/, '').toLowerCase()}`,
    };
  }
  throw new Error(
    'Enter a phone number with country code or a Telegram username, such as @username.',
  );
}

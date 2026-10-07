import type { Credentials } from '@features';
import { greenApiUrl } from '@/lib';

export async function getContactInfo(
  credentials: Credentials,
  chatId: string,
  signal: AbortSignal,
): Promise<{ name: string | null; phone: string; username?: string }> {
  let response: Response;
  try {
    response = await fetch(greenApiUrl(credentials, 'getContactInfo'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId }),
      credentials: 'omit',
      signal,
    });
  } catch {
    throw new Error(
      'Could not load the contact name. Using the recipient identifier instead.',
    );
  }
  if (!response.ok)
    throw new Error(
      'Could not load the contact name. Using the recipient identifier instead.',
    );
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== 'object')
    throw new Error(
      'Could not load the contact name. Using the recipient identifier instead.',
    );
  const contact = result as Record<string, unknown>;
  const name = [contact.contactName, contact.name].find(
    (value) => typeof value === 'string' && value.trim(),
  );
  const phone = String(contact.phoneNumber ?? '');
  const username =
    typeof contact.username === 'string' ? contact.username.trim() : '';
  return {
    name: typeof name === 'string' ? name.trim() : null,
    phone: /^[1-9]\d{6,14}$/.test(phone) ? `+${phone}` : '',
    username: /^@?[a-z][a-z0-9_]{0,31}$/i.test(username)
      ? `@${username.replace(/^@/, '').toLowerCase()}`
      : undefined,
  };
}

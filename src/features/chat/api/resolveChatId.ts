import type { Credentials } from '@features';
import { greenApiUrl } from '@/lib';
import { normalizeRecipient } from '@features';

export async function resolveChatId(
  credentials: Credentials,
  identifier: string,
  signal: AbortSignal,
): Promise<string> {
  const recipient = normalizeRecipient(identifier);
  let response: Response;
  try {
    response = await fetch(greenApiUrl(credentials, 'checkAccount'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        recipient.kind === 'phone'
          ? { phoneNumber: Number(recipient.value.slice(1)) }
          : { username: recipient.value },
      ),
      credentials: 'omit',
      signal,
    });
  } catch {
    throw new Error(
      'Could not find the recipient. Check your connection and try again.',
    );
  }
  if (!response.ok)
    throw new Error(
      'Could not find the recipient. Check instance authorization or try again later.',
    );
  const result: unknown = await response.json().catch(() => null);
  if (
    result &&
    typeof result === 'object' &&
    'exist' in result &&
    result.exist === false
  )
    throw new Error(
      recipient.kind === 'phone'
        ? 'This number could not be found on Telegram. It may be hidden by privacy settings; try a username instead.'
        : 'This Telegram username could not be found. Check the spelling and try again.',
    );
  if (
    !result ||
    typeof result !== 'object' ||
    !('exist' in result) ||
    result.exist !== true ||
    !('chatId' in result) ||
    typeof result.chatId !== 'string' ||
    !/^\d+$/.test(result.chatId)
  )
    throw new Error(
      'Could not resolve the recipient’s Telegram chat. Please try again later.',
    );
  return result.chatId;
}

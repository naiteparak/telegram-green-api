import type { Credentials } from '@features';
import { greenApiUrl } from '@/lib';

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  text: string,
  signal: AbortSignal,
): Promise<string> {
  if (!/^(\d+|\d+@c\.us)$/.test(chatId))
    throw new Error('Enter a valid recipient chat identifier.');
  const message = text.trim();
  if (!message || message.length > 4096)
    throw new Error('Enter a message between 1 and 4096 characters.');

  let response: Response;
  try {
    response = await fetch(greenApiUrl(credentials, 'sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
      credentials: 'omit',
      signal,
    });
  } catch {
    throw new Error(
      'Sending could not be confirmed. Check your connection and the recipient’s chat before retrying.',
    );
  }
  const errors: Record<number, string> = {
    400: 'GREEN-API rejected the message. Check the recipient number and message text.',
    401: 'Your credentials are no longer valid. Disconnect and connect again.',
    403: 'GREEN-API denied access. Check the instance authorization in the console.',
    429: 'Too many requests. Wait a moment before sending again.',
    466: 'The instance’s chat limit has been reached. Check your GREEN-API plan.',
  };
  if (!response.ok)
    throw new Error(
      errors[response.status] ??
        'GREEN-API could not accept the message. Please try again later.',
    );
  const result: unknown = await response.json().catch(() => null);
  if (
    !result ||
    typeof result !== 'object' ||
    !('idMessage' in result) ||
    typeof result.idMessage !== 'string' ||
    !result.idMessage.trim()
  ) {
    throw new Error(
      'Sending could not be confirmed. Check the recipient’s chat before retrying.',
    );
  }
  return result.idMessage;
}

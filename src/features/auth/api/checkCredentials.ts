import type { Credentials } from '../types';

import { greenApiUrl } from '@/lib';

export async function checkCredentials(
  credentials: Credentials,
  signal: AbortSignal,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(greenApiUrl(credentials, 'getStateInstance'), {
      signal,
      cache: 'no-store',
      credentials: 'omit',
    });
  } catch {
    throw new Error(
      'Could not reach GREEN-API. Check your internet connection and try again.',
    );
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error(
      'Invalid instance ID or API token. Check the credentials in your GREEN-API console.',
    );
  }
  if (response.status === 429)
    throw new Error('Too many requests. Wait a moment and try again.');
  if (!response.ok)
    throw new Error(
      `GREEN-API could not verify the instance (HTTP ${response.status}). Please try again.`,
    );

  const result: unknown = await response.json().catch(() => null);
  if (
    !result ||
    typeof result !== 'object' ||
    !('stateInstance' in result) ||
    typeof result.stateInstance !== 'string'
  ) {
    throw new Error(
      'GREEN-API returned an unexpected response. Please try again.',
    );
  }
  const errors: Record<string, string> = {
    notAuthorized:
      'Authorize your Telegram instance in the GREEN-API console, then try again.',
    pendingPassword:
      'Complete Telegram two-factor authorization in the GREEN-API console, then try again.',
    starting: 'The instance is starting. Wait a few minutes and try again.',
    blocked:
      'This Telegram instance is blocked. Check its status in the GREEN-API console.',
    suspended:
      'This Telegram account has temporary restrictions. Check its status in the GREEN-API console.',
  };
  if (result.stateInstance !== 'authorized') {
    throw new Error(
      errors[result.stateInstance] ??
        'This instance is not ready. Check its status in the GREEN-API console.',
    );
  }
}

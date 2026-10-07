import type { Credentials } from '@features';
import { greenApiUrl } from '@/lib';
import type { IncomingMessage } from '../types';

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

export function normalizeIncomingMessage(
  body: unknown,
): IncomingMessage | null {
  const notification = record(body);
  if (notification.typeWebhook !== 'incomingMessageReceived') return null;
  const sender = record(notification.senderData);
  const content = record(notification.messageData);
  // This assignment supports personal text conversations, not group chats or files.
  if (sender.chatType && sender.chatType !== 'user') return null;
  if (
    typeof sender.chatId === 'string' &&
    (sender.chatId.startsWith('-') || sender.chatId.endsWith('@g.us'))
  )
    return null;
  if (
    !['textMessage', 'extendedTextMessage'].includes(
      String(content.typeMessage),
    )
  )
    return null;
  const text =
    content.typeMessage === 'textMessage'
      ? record(content.textMessageData).textMessage
      : record(content.extendedTextMessageData).text;
  if (
    typeof sender.chatId !== 'string' ||
    !/^(\d+|\d+@c\.us)$/.test(sender.chatId) ||
    typeof text !== 'string' ||
    !text.trim() ||
    typeof notification.idMessage !== 'string' ||
    !notification.idMessage ||
    typeof notification.timestamp !== 'number' ||
    !Number.isFinite(notification.timestamp) ||
    notification.timestamp <= 0
  ) {
    throw new Error(
      'An incoming text notification could not be read. It has not been acknowledged.',
    );
  }
  const phoneDigits = String(sender.senderPhoneNumber ?? '').replace(/\D/g, '');
  const phone = /^[1-9]\d{6,14}$/.test(phoneDigits)
    ? `+${phoneDigits}`
    : sender.chatId.endsWith('@c.us')
      ? `+${sender.chatId.split('@')[0]}`
      : '';
  const title = [
    sender.senderContactName,
    sender.chatName,
    sender.senderName,
  ].find((name) => typeof name === 'string' && name.trim());
  return {
    providerChatId: sender.chatId,
    phone,
    title:
      typeof title === 'string' ? title : phone || `Telegram ${sender.chatId}`,
    message: {
      id: notification.idMessage,
      text,
      timestamp: notification.timestamp * 1000,
      direction: 'incoming',
    },
  };
}

export class ReceivingError extends Error {
  retryable: boolean;
  constructor(message: string, retryable = true) {
    super(message);
    this.retryable = retryable;
  }
}

async function request(
  credentials: Credentials,
  method: 'receiveNotification' | 'deleteNotification',
  suffix: string,
  signal: AbortSignal,
): Promise<unknown> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  if (signal.aborted) controller.abort();
  const timeout = window.setTimeout(
    cancel,
    method === 'receiveNotification' ? 40000 : 15000,
  );
  try {
    const response = await fetch(
      `${greenApiUrl(credentials, method)}${suffix}`,
      {
        method: method === 'receiveNotification' ? 'GET' : 'DELETE',
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'omit',
      },
    );
    if (!response.ok) {
      if (response.status === 401 || response.status === 403)
        throw new ReceivingError(
          'Receiving is paused. Check instance authorization, then disconnect and reconnect.',
          false,
        );
      if (response.status === 400)
        throw new ReceivingError(
          'Receiving is paused. Clear the webhook URL in GREEN-API settings, then reconnect after one minute.',
          false,
        );
      throw new ReceivingError(
        'Receiving is temporarily unavailable. Retrying automatically.',
      );
    }
    const text = await response.text();
    if (!text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch {
      throw new ReceivingError(
        'GREEN-API returned an unreadable notification. Retrying automatically.',
      );
    }
  } catch (error) {
    if (error instanceof ReceivingError) throw error;
    throw new ReceivingError(
      'Connection interrupted. Retrying incoming messages automatically.',
    );
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener('abort', cancel);
  }
}

export async function receiveNotification(
  credentials: Credentials,
  signal: AbortSignal,
) {
  const result = await request(
    credentials,
    'receiveNotification',
    '?receiveTimeout=30',
    signal,
  );
  if (result === null) return null;
  const notification = record(result);
  if (
    !Number.isSafeInteger(notification.receiptId) ||
    Number(notification.receiptId) <= 0 ||
    !notification.body
  )
    throw new ReceivingError(
      'GREEN-API returned an invalid notification. It has not been acknowledged.',
    );
  return {
    receiptId: notification.receiptId as number,
    incoming: normalizeIncomingMessage(notification.body),
  };
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal: AbortSignal,
) {
  const result = record(
    await request(credentials, 'deleteNotification', `/${receiptId}`, signal),
  );
  // false means already deleted or no longer the queue head; re-read the queue.
  if (typeof result.result !== 'boolean')
    throw new ReceivingError(
      'Notification acknowledgment failed. Retrying automatically.',
    );
}

import { useEffect, useEffectEvent } from 'react';
import type { Credentials } from '@features';
import type { IncomingMessage } from '../types';
import {
  receiveNotification,
  deleteNotification,
  ReceivingError,
} from '../api';

export function useReceiveMessages(
  credentials: Credentials | null,
  onMessage: (incoming: IncomingMessage) => void,
) {
  const processMessage = useEffectEvent(onMessage);

  useEffect(() => {
    if (!credentials) return;
    const controller = new AbortController();
    let retryTimer: number | undefined;
    let finishWait: (() => void) | undefined;
    const seenMessages = new Set<string>();
    const wait = (milliseconds: number) =>
      new Promise<void>((resolve) => {
        finishWait = resolve;
        retryTimer = window.setTimeout(() => {
          finishWait = undefined;
          resolve();
        }, milliseconds);
      });

    async function poll() {
      let failures = 0;
      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(
            credentials!,
            controller.signal,
          );
          if (controller.signal.aborted) return;
          if (notification) {
            const incoming = notification.incoming;
            const key = incoming
              ? `${incoming.providerChatId}:${incoming.message.id}`
              : '';
            if (incoming && !seenMessages.has(key)) {
              processMessage(incoming);
              seenMessages.add(key);
            }
            // Unsupported events are deliberately ignored, then acknowledged so they do not block text messages.
            await deleteNotification(
              credentials!,
              notification.receiptId,
              controller.signal,
            );
          }
          if (controller.signal.aborted) return;
          failures = 0;
          // Bound request rate even if the provider responds immediately with an empty queue.
          await wait(300);
        } catch (error) {
          if (controller.signal.aborted) return;
          const isPaused = error instanceof ReceivingError && !error.retryable;
          if (import.meta.env.DEV && failures === 0) {
            // Never log request URLs, credentials, or raw provider responses.
            console.warn(
              isPaused
                ? 'Incoming message receiving is paused. Check instance settings and reconnect.'
                : 'Incoming message receiving was interrupted. Retrying automatically.',
            );
          }
          if (isPaused) return;
          await wait(Math.min(1000 * 2 ** failures, 30000));
          failures = Math.min(failures + 1, 5);
        }
      }
    }
    void poll();
    return () => {
      controller.abort();
      window.clearTimeout(retryTimer);
      finishWait?.();
    };
  }, [credentials]);
}

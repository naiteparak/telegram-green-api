import { useEffect, useRef, useState } from 'react';
import type { Credentials } from '@features';
import type { Chat, Message } from '../types';
import { sendMessage, resolveChatId } from '../api';

export function useSendMessage(
  credentials: Credentials | null,
  onSent: (message: Message) => void,
  onChatResolved: (chatId: string, providerChatId: string) => void,
) {
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<{
    chatId: string;
    text: string;
  } | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsSending(false);
    setSendError(null);
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [credentials]);

  async function send(chat: Chat, text: string): Promise<boolean> {
    if (!credentials || requestRef.current) return false;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsSending(true);
    setSendError(null);
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);
    try {
      const providerChatId =
        chat.providerChatId ??
        (await resolveChatId(
          credentials,
          chat.phone || chat.username || '',
          controller.signal,
        ));
      if (controller.signal.aborted) return false;
      onChatResolved(chat.id, providerChatId);
      const id = await sendMessage(
        credentials,
        providerChatId,
        text,
        controller.signal,
      );
      if (controller.signal.aborted) return false;
      onSent({
        id,
        chatId: chat.id,
        text: text.trim(),
        direction: 'outgoing',
        timestamp: Date.now(),
      });
      return true;
    } catch (error) {
      if (!controller.signal.aborted || timedOut) {
        setSendError({
          chatId: chat.id,
          text: timedOut
            ? 'Sending timed out and could not be confirmed. Check the recipient’s chat before retrying.'
            : error instanceof Error
              ? error.message
              : 'Could not send the message.',
        });
      }
      return false;
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsSending(false);
      }
    }
  }

  return { send, isSending, sendError };
}

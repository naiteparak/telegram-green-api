import { useEffect, useRef, useState } from 'react';
import type { Credentials } from '@features';
import type { Chat } from '../types';
import { resolveChatId, getContactInfo } from '../api';
import { normalizeRecipient } from '../helpers';

export function useCreateChat(credentials: Credentials | null) {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [nameWarning, setNameWarning] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => {
    setIsCreating(false);
    setCreateError(null);
    setNameWarning(null);
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [credentials]);

  async function create(identifier: string): Promise<Chat | null> {
    if (!credentials || requestRef.current) return null;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsCreating(true);
    setCreateError(null);
    setNameWarning(null);
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);
    try {
      const recipient = normalizeRecipient(identifier);
      const providerChatId = await resolveChatId(
        credentials,
        recipient.value,
        controller.signal,
      );
      if (controller.signal.aborted) return null;
      let contact: Awaited<ReturnType<typeof getContactInfo>> | null = null;
      try {
        contact = await getContactInfo(
          credentials,
          providerChatId,
          controller.signal,
        );
      } catch (error) {
        if (controller.signal.aborted) throw error;
        setNameWarning(
          error instanceof Error
            ? error.message
            : 'Could not load the contact name. Using the recipient identifier instead.',
        );
      }
      if (controller.signal.aborted) return null;
      return {
        id: crypto.randomUUID(),
        phone:
          recipient.kind === 'phone' ? recipient.value : contact?.phone || '',
        username:
          contact?.username ||
          (recipient.kind === 'username' ? recipient.value : undefined),
        title: contact?.name || recipient.value,
        providerChatId,
      };
    } catch (error) {
      if (!controller.signal.aborted || timedOut)
        setCreateError(
          timedOut
            ? 'Contact lookup timed out. Please try again.'
            : error instanceof Error
              ? error.message
              : 'Could not open the chat.',
        );
      return null;
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsCreating(false);
      }
    }
  }
  return { create, isCreating, createError, nameWarning };
}

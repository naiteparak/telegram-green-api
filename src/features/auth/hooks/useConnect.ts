import { useEffect, useRef, useState } from 'react';
import { checkCredentials } from '../api';
import type { Credentials } from '../types';

export function useConnect(onConnect: (credentials: Credentials) => void) {
  const [isChecking, setIsChecking] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function connect(credentials: Credentials) {
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsChecking(true);
    setConnectionError('');
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      await checkCredentials(credentials, controller.signal);
      if (!controller.signal.aborted) onConnect(credentials);
    } catch (error) {
      setConnectionError(
        controller.signal.aborted
          ? 'The credential check timed out. Please try again.'
          : error instanceof Error
            ? error.message
            : 'Could not verify credentials. Please try again.',
      );
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      setIsChecking(false);
    }
  }

  return { connect, isChecking, connectionError };
}

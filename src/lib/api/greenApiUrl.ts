import type { Credentials } from '@features';

export function greenApiUrl(
  credentials: Credentials,
  method:
    | 'getStateInstance'
    | 'sendMessage'
    | 'checkAccount'
    | 'getContactInfo'
    | 'receiveNotification'
    | 'deleteNotification',
) {
  return `https://api.green-api.com/waInstance${encodeURIComponent(credentials.idInstance)}/${method}/${encodeURIComponent(credentials.apiTokenInstance)}`;
}

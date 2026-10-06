import type { Chat, Message } from './types';

export const mockChats: Chat[] = [
  { id: 'anna', phone: '+7 900 000 00 01', title: 'Anna Petrova' },
  { id: 'alex', phone: '+7 900 000 00 02', title: 'Alex Ivanov' },
  { id: 'maria', phone: '+7 900 000 00 03', title: 'Maria Smirnova' },
  { id: 'daniel', phone: '+7 900 000 00 04', title: 'Daniel Volkov' },
];

export const mockMessages: Message[] = [
  {
    id: 'anna-1',
    chatId: 'anna',
    text: 'Hi Anna! How is your day going?',
    direction: 'outgoing',
    timestamp: Date.parse('2026-10-06T08:00:00Z'),
  },
  {
    id: 'anna-2',
    chatId: 'anna',
    text: 'Great, thanks! How about yours?',
    direction: 'incoming',
    timestamp: Date.parse('2026-10-06T08:02:00Z'),
  },
  {
    id: 'alex-1',
    chatId: 'alex',
    text: 'See you tomorrow!',
    direction: 'outgoing',
    timestamp: Date.parse('2026-10-06T07:40:00Z'),
  },
  {
    id: 'maria-1',
    chatId: 'maria',
    text: 'Could you send me the details?',
    direction: 'incoming',
    timestamp: Date.parse('2026-10-06T07:15:00Z'),
  },
];

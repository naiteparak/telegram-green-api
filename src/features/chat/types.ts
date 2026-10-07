export type Chat = {
  id: string;
  phone: string;
  username?: string;
  title: string;
  providerChatId?: string;
};

export type IncomingMessage = {
  providerChatId: string;
  phone: string;
  title: string;
  message: Omit<Message, 'chatId'>;
};

export type Message = {
  id: string;
  chatId: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: number;
};

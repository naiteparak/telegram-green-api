export type Chat = {
  id: string;
  phone: string;
  title: string;
};

export type Message = {
  id: string;
  chatId: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: number;
};

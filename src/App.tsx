import { MessageSquareText } from 'lucide-react';
import { Fragment, useState } from 'react';
import { AppLayout } from '@app';
import {
  ChatHeader,
  ChatList,
  MessageList,
  MessageComposer,
  NewChatForm,
  mockChats,
  mockMessages,
  type Chat,
  type Message,
  CredentialsForm,
  type Credentials,
} from '@features';

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const selectedMessages = messages
    .filter((message) => message.chatId === selectedChatId)
    .sort((first, second) => first.timestamp - second.timestamp);

  function createChat(phone: string) {
    const existingChat = chats.find(
      (chat) => chat.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''),
    );
    if (existingChat) {
      setSelectedChatId(existingChat.id);
      return;
    }
    const chat: Chat = { id: crypto.randomUUID(), title: phone, phone };
    setChats((previous) => [chat, ...previous]);
    setSelectedChatId(chat.id);
  }

  function sendMessage(text: string) {
    if (!selectedChatId || !text.trim()) return;
    const message: Message = {
      id: crypto.randomUUID(),
      chatId: selectedChatId,
      text: text.trim(),
      direction: 'outgoing',
      timestamp: Date.now(),
    };
    setMessages((previous) => [...previous, message]);
  }

  function disconnect() {
    setCredentials(null);
    setSelectedChatId(null);
    setChats(mockChats);
    setMessages(mockMessages);
  }

  if (!credentials) return <CredentialsForm onConnect={setCredentials} />;

  return (
    <AppLayout
      isChatOpen={Boolean(selectedChat)}
      onDisconnect={disconnect}
      newChat={<NewChatForm onCreateChat={createChat} />}
      chatList={
        <ChatList
          chats={chats}
          messages={messages}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      }
    >
      {selectedChat ? (
        <Fragment key={selectedChat.id}>
          <ChatHeader
            chat={selectedChat}
            onBack={() => setSelectedChatId(null)}
          />
          <MessageList messages={selectedMessages} />
          <MessageComposer onSend={sendMessage} />
        </Fragment>
      ) : (
        <div className="grid min-h-0 flex-1 place-items-center">
          <section
            className="max-w-[430px] p-8 text-center"
            aria-labelledby="empty-conversation-title"
          >
            <div
              className="mx-auto mb-[22px] w-[150px] text-illustration"
              aria-hidden="true"
            >
              <MessageSquareText
                className="h-auto w-full fill-illustration-surface"
                strokeWidth={1}
              />
            </div>
            <p className="mb-[5px] text-[0.72rem] font-bold tracking-[0.09em] text-label uppercase">
              Your inbox
            </p>
            <h2
              className="mb-3 text-[clamp(1.45rem,2.6vw,2rem)] font-bold tracking-[-0.04em] text-heading"
              id="empty-conversation-title"
            >
              Select a chat to start messaging
            </h2>
            <p className="leading-[1.65] text-muted">
              Choose a conversation from the list to open it.
            </p>
          </section>
        </div>
      )}
    </AppLayout>
  );
}

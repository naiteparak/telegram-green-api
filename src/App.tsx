import { MessageSquareText } from 'lucide-react';
import { Fragment, useState } from 'react';
import { AppLayout } from '@app';
import {
  ChatHeader,
  ChatList,
  ChatSearch,
  MessageList,
  MessageComposer,
  NewChatForm,
  useSendMessage,
  useReceiveMessages,
  useConversations,
  useCreateChat,
  normalizeRecipient,
  CredentialsForm,
  type Credentials,
} from '@features';

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    chats,
    messages,
    addChat,
    addSentMessage,
    receiveMessage,
    resolveChat,
    clearConversations,
  } = useConversations();
  const { send, isSending, sendError } = useSendMessage(
    credentials,
    addSentMessage,
    resolveChat,
  );
  useReceiveMessages(credentials, receiveMessage);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const { create, isCreating, createError, nameWarning } =
    useCreateChat(credentials);
  const selectedMessages = messages
    .filter((message) => message.chatId === selectedChatId)
    .sort((first, second) => first.timestamp - second.timestamp);

  async function createChat(identifier: string): Promise<boolean> {
    const recipient = normalizeRecipient(identifier);
    const existingChat = chats.find((chat) =>
      recipient.kind === 'phone'
        ? Boolean(chat.phone) &&
          chat.phone.replace(/\D/g, '') === recipient.value.slice(1)
        : chat.username?.toLowerCase() === recipient.value,
    );
    if (existingChat) {
      setSearchQuery('');
      setSelectedChatId(existingChat.id);
      return true;
    }
    const chat = await create(recipient.value);
    if (!chat) return false;
    addChat(chat);
    setSearchQuery('');
    setSelectedChatId(chat.id);
    return true;
  }

  function disconnect() {
    setCredentials(null);
    setSearchQuery('');
    setSelectedChatId(null);
    clearConversations();
  }

  if (!credentials) return <CredentialsForm onConnect={setCredentials} />;

  return (
    <AppLayout
      isChatOpen={Boolean(selectedChat)}
      onDisconnect={disconnect}
      search={<ChatSearch value={searchQuery} onChange={setSearchQuery} />}
      newChat={
        <NewChatForm
          onCreateChat={createChat}
          isCreating={isCreating}
          createError={createError}
          nameWarning={nameWarning}
        />
      }
      chatList={
        <ChatList
          chats={chats}
          messages={messages}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          searchQuery={searchQuery}
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
          <MessageComposer
            onSend={(text) => send(selectedChat, text)}
            isSending={isSending}
            error={
              sendError?.chatId === selectedChat.id ? sendError.text : undefined
            }
          />
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

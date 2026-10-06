import { MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import AppLayout from './app/layout';
import ChatHeader from './features/chat/components/ChatHeader';
import ChatList from './features/chat/components/ChatList';
import { mockChats, mockMessages } from './features/chat/mockData';

export default function App() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const selectedChat = mockChats.find((chat) => chat.id === selectedChatId);

  return (
    <AppLayout
      isChatOpen={Boolean(selectedChat)}
      chatList={
        <ChatList
          chats={mockChats}
          messages={mockMessages}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      }
    >
      {selectedChat && (
        <ChatHeader
          chat={selectedChat}
          onBack={() => setSelectedChatId(null)}
        />
      )}
      <div className="grid flex-1 place-items-center">
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
            {selectedChat
              ? `Your conversation with ${selectedChat.title}`
              : 'Select a chat to start messaging'}
          </h2>
          <p className="leading-[1.65] text-muted">
            {selectedChat
              ? `Text messages with ${selectedChat.phone}`
              : 'Choose a conversation from the list to open it.'}
          </p>
        </section>
      </div>
    </AppLayout>
  );
}

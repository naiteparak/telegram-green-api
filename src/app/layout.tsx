import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@components';

type AppLayoutProps = {
  children: ReactNode;
  chatList: ReactNode;
  newChat: ReactNode;
  search: ReactNode;
  isChatOpen: boolean;
  onDisconnect: () => void;
};

export default function AppLayout({
  children,
  chatList,
  newChat,
  search,
  isChatOpen,
  onDisconnect,
}: AppLayoutProps) {
  return (
    <div className="mx-auto h-dvh w-full max-w-[1440px] overflow-hidden bg-surface shadow-app min-[681px]:grid min-[681px]:grid-cols-[minmax(280px,356px)_minmax(0,1fr)]">
      <aside
        className={`${isChatOpen ? 'hidden' : 'flex'} h-full min-h-0 flex-col bg-surface min-[681px]:flex min-[681px]:border-r min-[681px]:border-border`}
        aria-label="Chats"
      >
        <header className="flex items-center justify-between px-6 pt-7 pb-[19px]">
          <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
          {newChat}
        </header>

        {search}

        <section
          className="flex min-h-0 flex-1 overflow-y-auto px-3 py-3.5"
          aria-label="Your conversations"
        >
          {chatList}
        </section>

        <footer className="flex shrink-0 justify-end px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Disconnect"
            onClick={onDisconnect}
          >
            <LogOut className="size-5" aria-hidden="true" />
          </Button>
        </footer>
      </aside>

      <main
        className={`${isChatOpen ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 flex-col overflow-hidden bg-conversation min-[681px]:flex`}
      >
        {children}
      </main>
    </div>
  );
}

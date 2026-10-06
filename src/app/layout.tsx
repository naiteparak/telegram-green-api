import type { ReactNode } from 'react';
import { Search, SquarePen } from 'lucide-react';
import Button from '../components/ui/Button';

type AppLayoutProps = {
  children: ReactNode;
  chatList: ReactNode;
  isChatOpen: boolean;
};

export default function AppLayout({
  children,
  chatList,
  isChatOpen,
}: AppLayoutProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] bg-surface shadow-app min-[681px]:grid min-[681px]:grid-cols-[minmax(280px,356px)_minmax(0,1fr)]">
      <aside
        className={`${isChatOpen ? 'hidden' : 'flex'} min-h-screen flex-col bg-surface min-[681px]:flex min-[681px]:border-r min-[681px]:border-border`}
        aria-label="Chats"
      >
        <header className="flex items-center justify-between px-6 pt-7 pb-[19px]">
          <div>
            <p className="mb-[5px] text-[0.72rem] font-bold tracking-[0.09em] text-label uppercase">
              GREEN-API
            </p>
            <h1 className="text-[1.45rem] font-bold tracking-[-0.03em]">
              Messages
            </h1>
          </div>
          <Button variant="ghost" size="icon" aria-label="Search chats">
            <Search className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </Button>
        </header>

        <Button className="mx-[18px] mb-4 justify-start">
          <SquarePen className="size-5" strokeWidth={1.8} aria-hidden="true" />
          New chat
        </Button>

        <section
          className="flex flex-1 px-3 py-3.5"
          aria-label="Your conversations"
        >
          {chatList}
        </section>

        <footer className="mx-6 mt-4 mb-[22px] flex items-center gap-2 text-[0.78rem] text-subtle">
          <span
            className="size-[7px] rounded-full bg-success"
            aria-hidden="true"
          />
          Ready to connect
        </footer>
      </aside>

      <main
        className={`${isChatOpen ? 'flex' : 'hidden'} min-h-screen min-w-0 flex-col overflow-hidden bg-conversation min-[681px]:flex`}
      >
        {children}
      </main>
    </div>
  );
}

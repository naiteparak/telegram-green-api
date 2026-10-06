import type { ReactNode } from 'react';
import { Plus, Search, SquarePen } from 'lucide-react';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] bg-surface shadow-app min-[681px]:grid min-[681px]:grid-cols-[minmax(280px,356px)_minmax(0,1fr)]">
      <aside className="flex min-h-screen flex-col bg-surface min-[681px]:border-r min-[681px]:border-border" aria-label="Chats">
        <header className="flex items-center justify-between px-6 pt-7 pb-[19px]">
          <div>
            <p className="mb-[5px] text-[0.72rem] font-bold tracking-[0.09em] text-label uppercase">GREEN-API</p>
            <h1 className="text-[1.45rem] font-bold tracking-[-0.03em]">Messages</h1>
          </div>
          <button className="grid size-10 place-items-center rounded-xl text-icon hover:bg-surface-hover focus-visible:bg-surface-hover" type="button" aria-label="Search chats">
            <Search className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </header>

        <button className="mx-[18px] mb-4 flex items-center gap-2.5 rounded-[13px] bg-primary px-[15px] py-[13px] font-bold text-on-primary shadow-primary transition-[background-color,transform] duration-150 hover:bg-primary-hover focus-visible:bg-primary-hover active:translate-y-px" type="button">
          <SquarePen className="size-5" strokeWidth={1.8} aria-hidden="true" />
          New chat
        </button>

        <section className="flex flex-1 px-6 py-3.5" aria-label="Your conversations">
          <div className="w-full self-center text-center text-placeholder">
            <div className="mx-auto mb-[13px] grid size-[52px] place-items-center rounded-[18px] bg-accent-surface text-accent" aria-hidden="true"><Plus /></div>
            <h2 className="mb-[7px] text-base font-bold text-heading-secondary">No chats yet</h2>
            <p className="text-[0.86rem] leading-normal">Create a chat to start sending text messages.</p>
          </div>
        </section>

        <footer className="mx-6 mt-4 mb-[22px] flex items-center gap-2 text-[0.78rem] text-subtle">
          <span className="size-[7px] rounded-full bg-success" aria-hidden="true" />
          Ready to connect
        </footer>
      </aside>

      <main className="hidden min-h-screen min-w-0 place-items-center overflow-hidden bg-conversation min-[681px]:grid">
        {children}
      </main>
    </div>
  );
}

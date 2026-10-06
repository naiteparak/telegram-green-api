import { MessageSquareText } from 'lucide-react';
import AppLayout from './app/layout';

export default function App() {
  return (
    <AppLayout>
      <section
        className="max-w-[430px] p-8 text-center"
        aria-labelledby="empty-conversation-title"
      >
        <div className="mx-auto mb-[22px] w-[150px] text-illustration" aria-hidden="true">
          <MessageSquareText className="h-auto w-full fill-illustration-surface" strokeWidth={1} />
        </div>
        <p className="mb-[5px] text-[0.72rem] font-bold tracking-[0.09em] text-label uppercase">Your inbox</p>
        <h2 className="mb-3 text-[clamp(1.45rem,2.6vw,2rem)] font-bold tracking-[-0.04em] text-heading" id="empty-conversation-title">Select a chat to start messaging</h2>
        <p className="leading-[1.65] text-muted">
          Create a new conversation with a phone number, then send and receive
          text messages here.
        </p>
      </section>
    </AppLayout>
  );
}

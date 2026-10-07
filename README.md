# Telechat

A Telegram-like web chat built with React and GREEN-API for sending and receiving text messages.

Search your chats by name, phone number, or username. Click **+** to start a chat using a phone number or Telegram username.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Code quality

```bash
npm run lint
```

ESLint checks JavaScript/TypeScript and React Hook usage. Prettier handles formatting separately.

## GREEN-API setup

Authorize your Telegram instance in GREEN-API, then log in to the app with your `idInstance` and `apiTokenInstance`.

To receive replies, enable **Receive notifications about incoming messages and files** in your instance settings and leave the webhook URL empty.

Chats are kept only for the current session and are cleared when you refresh or log out.

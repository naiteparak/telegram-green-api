# AGENTS.md

## Project Goal

Build a clean, minimal React chat application inspired by Telegram.

The application should prioritize:
- simplicity
- maintainability
- reusable components
- clear separation of concerns
- responsive behavior
- predictable state management
- good user experience
- production-quality React patterns without unnecessary overengineering

The UI should feel like a modern messenger: compact, familiar, responsive, and easy to use.

---

## General Engineering Principles

1. Prefer simple solutions over clever abstractions.
2. Do not overengineer features that are not required.
3. Keep components small and focused on one responsibility.
4. Extract reusable UI and logic when it is genuinely reused or when extraction clearly improves readability.
5. Avoid duplicated logic, duplicated markup, and duplicated API handling.
6. Keep business logic out of presentational components.
7. Prefer composition over large configurable "god components".
8. Use descriptive names. Avoid vague names such as `data`, `item`, `handler`, or `utils` when a more specific name is possible.
9. Keep code easy for another developer to understand without additional explanation.
10. Preserve existing project conventions before introducing new patterns or dependencies.

---

## React Guidelines

Use modern React patterns and functional components only.

### Component Design

Components should be decomposed by responsibility.

Prefer:

- `ChatLayout`
- `Sidebar`
- `ChatList`
- `ChatListItem`
- `ChatHeader`
- `MessageList`
- `MessageBubble`
- `MessageComposer`
- `EmptyChatState`

instead of one large `ChatPage` containing the whole interface.

A component should usually be extracted when:
- it represents a distinct UI concept
- it is reused
- it has meaningful internal logic
- the parent becomes difficult to read
- it can be tested or reasoned about independently

Do not split trivial markup into tiny components just for the sake of decomposition.

### Reusability

Build reusable primitives for repeated patterns.

Examples:
- `Avatar`
- `IconButton`
- `TextInput`
- `LoadingSpinner`
- `ErrorState`
- `EmptyState`

Reusable components should:
- have a small, clear API
- avoid knowing about page-specific business logic
- accept data and callbacks through props
- avoid unnecessary configuration options
- support `className` or an equivalent styling escape hatch where appropriate

Do not create abstractions for code that is used only once unless the abstraction makes the architecture substantially clearer.

### Props

- Keep props minimal.
- Pass the specific values a component needs rather than large unrelated objects.
- Prefer explicit prop names.
- Avoid excessive prop drilling. If state is shared deeply across the chat feature, use an appropriate feature-level context or store.
- Do not introduce global state for local component state.

### State

Keep state as close as possible to where it is used.

Use:
- local state for local UI behavior
- derived values instead of duplicated state
- server-state tools for remote API data if already available in the project
- feature-level context/store only when multiple distant components genuinely need the same client state

Avoid:
- storing values that can be calculated from other state
- duplicated copies of API data
- unnecessary `useEffect`
- using `useEffect` to calculate derived state

### Hooks

Extract custom hooks for reusable stateful behavior or non-trivial feature logic.

Examples:
- `useChats`
- `useMessages`
- `useSendMessage`
- `usePolling`
- `useAutoScroll`

Hooks should contain logic, not render UI.

Do not create a hook merely to wrap one trivial line.

---

## Suggested Feature Structure

Prefer feature-oriented organization over grouping the whole project only by technical type.

Example:

```text
src/
  app/
    App.tsx
    routes.tsx

  features/
    auth/
      components/
      hooks/
      api/
      types.ts

    chat/
      components/
        ChatLayout.tsx
        ChatHeader.tsx
        ChatList.tsx
        ChatListItem.tsx
        MessageList.tsx
        MessageBubble.tsx
        MessageComposer.tsx
      hooks/
        useChats.ts
        useMessages.ts
        useSendMessage.ts
      api/
        chatApi.ts
      types.ts

  components/
    ui/
      Avatar.tsx
      IconButton.tsx
      Spinner.tsx
      EmptyState.tsx

  lib/
    api/
    helpers/

  styles/
```

Keep feature-specific code inside the feature.

Move something into shared `components`, `lib`, or `utils` only when it is actually generic.

---

## Chat UI Requirements

The interface should be inspired by Telegram, but should not be an unnecessary pixel-perfect clone.

Focus on:
- clear chat list
- active chat state
- readable message bubbles
- message timestamps
- sender/receiver visual distinction
- sticky chat header where appropriate
- message composer fixed/sticky at the bottom
- scrollable message history
- good empty states
- loading and error states
- responsive mobile behavior

### Recommended Layout

Desktop:
- left sidebar with chats
- active conversation on the right

Mobile:
- chat list first
- opening a chat shows the conversation view
- provide an obvious way to return to the chat list

Avoid fixed dimensions that break on smaller screens.

---

## Message Rendering

Create one reusable `MessageBubble` component.

It should receive only the information it needs, for example:

```ts
type MessageBubbleProps = {
  text: string;
  timestamp?: string;
  direction: 'incoming' | 'outgoing';
};
```

Do not create separate components containing mostly duplicated markup for incoming and outgoing messages unless their UI becomes substantially different.

Message lists must use stable IDs as React keys.

Never use array indexes as keys for messages when a message ID exists.

---

## Message Composer

The message composer should:
- use a controlled input or textarea
- prevent sending empty/whitespace-only messages
- support sending by button
- support Enter to send
- preserve Shift+Enter for a newline if a textarea is used
- disable sending while a request is in progress when duplicate submission is possible
- clear the input only after the send action has been accepted successfully or optimistically queued

Keep message sending logic outside the visual input component when possible.

---

## Scrolling Behavior

The message area should behave like a messenger.

When a conversation opens:
- scroll to the latest message

When a new message arrives:
- auto-scroll if the user is already near the bottom
- avoid unexpectedly forcing the user to the bottom if they intentionally scrolled upward

Keep scroll-management logic encapsulated in the message list or a dedicated hook.

---

## API Layer

Do not call external APIs directly from arbitrary UI components.

Create a dedicated API layer.

Example:

```text
features/chat/api/chatApi.ts
```

Expose functions such as:

```ts
sendMessage(...)
receiveMessage(...)
```

API functions should:
- know endpoint details
- serialize request data
- normalize responses
- throw or return consistent errors

Components should not know raw endpoint URLs or request implementation details.

---

## GREEN-API Integration

The assignment requires GREEN-API.

Credentials:
- `idInstance`
- `apiTokenInstance`

Treat credentials as sensitive runtime values.

Do not:
- hardcode real credentials into source code
- commit credentials
- log tokens
- expose secrets in documentation or screenshots

If the assignment specifically requires users to enter GREEN-API credentials in the frontend, keep them only for the current application session unless persistence is explicitly required.

Implement:
- sending text messages through the GREEN-API `SendMessage` endpoint
- receiving messages through the HTTP API required by the assignment
- text messages only

Keep all GREEN-API-specific code inside the API/service layer.

---

## Receiving Messages

Keep receiving logic separate from rendering.

If polling is required:
- encapsulate polling in a hook/service
- avoid overlapping requests
- clean up timers when the chat changes or the component unmounts
- prevent processing the same incoming notification/message multiple times
- handle temporary network failures gracefully

Do not place `setInterval` directly inside a large page component.

---

## Data Models

Define explicit TypeScript types.

Example:

```ts
type Chat = {
  id: string;
  phone: string;
  title: string;
  lastMessage?: string;
};

type Message = {
  id: string;
  chatId: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: number;
  status?: 'sending' | 'sent' | 'failed';
};
```

Normalize API responses into app-level types instead of leaking provider-specific response shapes throughout the UI.

---

## Error Handling

Every asynchronous feature should account for:
- loading
- empty
- success
- error

Show useful user-facing error messages.

Do not silently swallow errors.

Keep detailed technical errors in development logs only when useful.

Do not expose credentials or raw sensitive API responses to the user.

---

## Performance

Optimize only where it matters.

Prefer readable code first.

Useful practices:
- stable keys
- avoid unnecessary duplicated state
- avoid unnecessary effects
- memoize only when there is a measurable or obvious reason
- do not add `useMemo`, `useCallback`, or `React.memo` everywhere by default

For a normal test assignment, clarity is more important than premature optimization.

---

## Styling

Keep styling consistent.

Prefer:
- reusable spacing
- reusable typography
- consistent borders and radii
- a small set of surface/background styles
- clear active/hover/focus states

Do not scatter arbitrary one-off visual values throughout the code when existing design tokens or utilities can be reused.

The chat should feel Telegram-like:
- clean surfaces
- subtle separators
- compact sidebar rows
- rounded message bubbles
- restrained use of color

Do not copy Telegram branding or assets unnecessarily.

---

## Accessibility

At minimum:
- use semantic buttons instead of clickable `div`s
- provide labels or `aria-label` for icon-only controls
- support keyboard interaction
- preserve visible focus states
- use sufficient contrast
- associate labels with inputs
- use appropriate form submission behavior

---

## Responsive Design

The application must remain usable on:
- desktop
- tablet
- mobile

Do not treat mobile as an afterthought.

Avoid horizontal scrolling.

Chat history and composer should fit correctly when the mobile browser viewport changes.

---

## Forms and Validation

Validate:
- GREEN-API credentials
- recipient phone/chat identifier
- message text

Validation messages should be concise and shown near the relevant field.

Do not send malformed requests if validation can catch the issue locally.

---

## Dependencies

Before installing a package:
1. check whether the project already has a solution
2. check whether the functionality is simple enough to implement directly
3. install a dependency only when it materially improves the implementation

Avoid large libraries for trivial functionality.

Do not replace existing project libraries without a strong reason.

---

## Code Quality

Before considering a task complete:
- remove dead code
- remove unused imports
- remove debug logs
- remove commented-out experiments
- ensure TypeScript has no avoidable errors
- ensure linting passes
- verify loading/error/empty states
- verify desktop and mobile layout
- verify sending and receiving messages
- verify no credentials are committed

---

## Agent Workflow

When implementing a task:

1. Inspect the existing project structure first.
2. Reuse existing components, hooks, utilities, and conventions.
3. Identify the smallest sensible set of files to change.
4. Keep API/business logic separated from UI.
5. Decompose large components when responsibilities are mixed.
6. Do not refactor unrelated code.
7. Do not add dependencies unless necessary.
8. Preserve working behavior while making changes.
9. Run available typecheck, lint, tests, and build commands after meaningful changes.
10. Fix errors caused by the implementation before finishing.
11. Do not create Git commits. After completing a feature, component, or other independently reviewable unit of work, tell the user that the changes are ready for their review and a small, coherent commit.
12. Recommend that commits stay focused and leave the project in a working state. Do not suggest splitting tightly coupled changes merely to create more commits.

When a request is ambiguous, prefer the simplest implementation that satisfies the assignment rather than inventing additional product requirements.

---

## Definition of Done

A feature is done when:
- it works
- the code is understandable
- responsibilities are properly separated
- duplicated logic has been avoided
- the UI handles loading/error/empty states where relevant
- it works on desktop and mobile
- TypeScript/build/lint checks pass when available
- no secrets are committed
- no unnecessary abstractions or dependencies were introduced

The goal is not to demonstrate the maximum number of patterns or libraries.

The goal is to deliver a small, polished, maintainable React chat application.

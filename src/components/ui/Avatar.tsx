import { UserRound } from 'lucide-react';

type AvatarProps = { name: string };

export default function Avatar({ name }: AvatarProps) {
  const initials = name
    .trim()
    .replace(/^@/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-surface text-sm font-semibold text-accent"
      aria-hidden="true"
    >
      {/\p{L}/u.test(name) ? (
        initials
      ) : (
        <UserRound className="size-5" aria-hidden="true" />
      )}
    </span>
  );
}

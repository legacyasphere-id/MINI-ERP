import { APP_VERSION } from '@/lib/constants';

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-6">
      <div className="ml-auto flex items-center gap-4">
        {/* TODO: UserMenu, Notifications */}
        <span className="text-sm text-muted-foreground">v{APP_VERSION}</span>
      </div>
    </header>
  );
}

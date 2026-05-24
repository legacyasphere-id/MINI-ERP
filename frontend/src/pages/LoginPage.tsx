import { APP_NAME } from '@/lib/constants';

export function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-2xl font-bold">{APP_NAME}</h1>
        <p className="text-center text-muted-foreground">Login form coming soon.</p>
      </div>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AlertBar } from './AlertBar';
import { useAlertsStore } from '@/store/alerts.store';

export function AppShell() {
  const acknowledge = useAlertsStore((s) => s.acknowledge);
  const topAlert    = useAlertsStore((s) => s.topCritical());
  const hydrate     = useAlertsStore((s) => s.hydrate);

  // Hydrate alerts from API on mount — keeps sidebar badge accurate
  useEffect(() => { hydrate(); }, [hydrate]);

  // [A] acknowledges the top alert
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === 'a' &&
        !e.ctrlKey &&
        !e.metaKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        if (topAlert) acknowledge(topAlert.id, 'current-user');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [topAlert, acknowledge]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-base">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <AlertBar />
        <main className="flex-1 overflow-y-auto p-4" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

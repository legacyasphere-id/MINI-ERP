import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary }      from '@/components/ErrorBoundary';
import { ToastProvider }      from '@/lib/toast';
import { AppShell }           from '@/components/layout/AppShell';
import { RequireAuth }        from '@/components/layout/RequireAuth';
import { InventoryPage }      from '@/pages/InventoryPage';
import { MovementPage }       from '@/pages/MovementPage';
import { PurchaseOrdersPage } from '@/pages/PurchaseOrdersPage';
import { AlertsPage }         from '@/pages/AlertsPage';
import { SuppliersPage }      from '@/pages/SuppliersPage';
import { ProductDetailPage }  from '@/pages/ProductDetailPage';
import { CategoriesPage }     from '@/pages/CategoriesPage';
import { UsersPage }          from '@/pages/UsersPage';
import { SettingsPage }       from '@/pages/SettingsPage';
import { LoginPage }          from '@/pages/LoginPage';
import { NotFoundPage }       from '@/pages/NotFoundPage';

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const AnalyticsPage = lazy(() =>
  import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);

function PageFallback() {
  return <div className="p-8 text-sm text-ink-muted">Loading…</div>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"     element={<Suspense fallback={<PageFallback />}><DashboardPage /></Suspense>} />
            <Route path="/inventory"     element={<InventoryPage />} />
            <Route path="/inventory/:id" element={<ProductDetailPage />} />
            <Route path="/movement"      element={<MovementPage />} />
            <Route path="/orders"        element={<PurchaseOrdersPage />} />
            <Route path="/alerts"        element={<AlertsPage />} />
            <Route path="/suppliers"     element={<SuppliersPage />} />
            <Route path="/analytics"     element={<Suspense fallback={<PageFallback />}><AnalyticsPage /></Suspense>} />
            <Route path="/settings"      element={<SettingsPage />} />
            <Route path="/categories"    element={<CategoriesPage />} />
            <Route path="/users"         element={<UsersPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}

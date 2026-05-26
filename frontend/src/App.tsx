import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary }      from '@/components/ErrorBoundary';
import { AppShell }           from '@/components/layout/AppShell';
import { RequireAuth }        from '@/components/layout/RequireAuth';
import { DashboardPage }      from '@/pages/DashboardPage';
import { InventoryPage }      from '@/pages/InventoryPage';
import { MovementPage }       from '@/pages/MovementPage';
import { PurchaseOrdersPage } from '@/pages/PurchaseOrdersPage';
import { AlertsPage }         from '@/pages/AlertsPage';
import { SuppliersPage }      from '@/pages/SuppliersPage';
import { ProductDetailPage }  from '@/pages/ProductDetailPage';
import { CategoriesPage }     from '@/pages/CategoriesPage';
import { UsersPage }          from '@/pages/UsersPage';
import { AnalyticsPage }      from '@/pages/AnalyticsPage';
import { SettingsPage }       from '@/pages/SettingsPage';
import { LoginPage }          from '@/pages/LoginPage';
import { NotFoundPage }       from '@/pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/inventory"     element={<InventoryPage />} />
            <Route path="/inventory/:id" element={<ProductDetailPage />} />
            <Route path="/movement"      element={<MovementPage />} />
            <Route path="/orders"        element={<PurchaseOrdersPage />} />
            <Route path="/alerts"        element={<AlertsPage />} />
            <Route path="/suppliers"     element={<SuppliersPage />} />
            <Route path="/analytics"     element={<AnalyticsPage />} />
            <Route path="/settings"      element={<SettingsPage />} />
            <Route path="/categories"    element={<CategoriesPage />} />
            <Route path="/users"         element={<UsersPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

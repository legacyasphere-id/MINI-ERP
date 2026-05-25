import { Input } from '@/components/ui/input';

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Application configuration and preferences.</p>
      </div>

      <div className="rounded border border-stroke bg-surface-card divide-y divide-stroke max-w-xl">
        {/* Warehouse */}
        <div className="px-5 py-4">
          <h2 className="subheading mb-4">Warehouse</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Warehouse Name</span>
              <Input defaultValue="Main Distribution Centre" className="max-w-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Warehouse Code</span>
              <Input defaultValue="WH-MAIN-001" className="max-w-[160px] font-mono" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Timezone</span>
              <select
                defaultValue="UTC"
                className="h-input max-w-sm rounded border border-stroke bg-surface-base px-2.5 text-sm text-ink focus:border-stroke-focus focus:outline-none transition-colors duration-fast"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thresholds */}
        <div className="px-5 py-4">
          <h2 className="subheading mb-4">Stock Thresholds</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Low Stock Alert Threshold (%)</span>
              <Input type="number" defaultValue={30} className="max-w-[120px] tabular-nums" />
              <p className="text-xs text-ink-muted">Alert when stock falls below this % of min quantity.</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Overstock Alert Threshold (%)</span>
              <Input type="number" defaultValue={110} className="max-w-[120px] tabular-nums" />
              <p className="text-xs text-ink-muted">Alert when stock exceeds this % of max quantity.</p>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="px-5 py-4">
          <h2 className="subheading mb-4">Display</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Default Currency</span>
              <select
                defaultValue="USD"
                className="h-input max-w-[160px] rounded border border-stroke bg-surface-base px-2.5 text-sm text-ink focus:border-stroke-focus focus:outline-none transition-colors duration-fast"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="SGD">SGD — Singapore Dollar</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="label-caps text-ink-muted">Movement Log Limit</span>
              <Input type="number" defaultValue={20} className="max-w-[120px] tabular-nums" />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-5 py-3">
          <p className="text-xs text-ink-muted">
            Settings are display-only in this scaffold — changes are not persisted.
          </p>
        </div>
      </div>
    </div>
  );
}

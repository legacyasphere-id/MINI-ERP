import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { settingsApi, type AppSettings } from '@/services/settings.service';

const TIMEZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'];
const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
];

const SELECT_CLS = 'h-input rounded border border-stroke bg-surface-base px-2.5 text-sm text-ink focus:border-stroke-focus focus:outline-none transition-colors duration-fast disabled:opacity-40';

export function SettingsPage() {
  const [form,    setForm]    = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    settingsApi.get()
      .then((r) => setForm(r.data))
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');
    try {
      const res = await settingsApi.update(form);
      setForm(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="heading">Settings</h1>
          <p className="mt-1 text-sm text-ink-muted">Application configuration and preferences.</p>
        </div>
        <div className="text-sm text-ink-muted">Loading…</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col gap-6">
        <div><h1 className="heading">Settings</h1></div>
        <p className="text-sm text-status-error">{error || 'Could not load settings.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Application configuration and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-xl">
        <div className="rounded border border-stroke bg-surface-card divide-y divide-stroke">

          {/* Warehouse */}
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">Warehouse</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Warehouse Name</span>
                <Input
                  value={form.warehouseName}
                  onChange={(e) => set('warehouseName', e.target.value)}
                  disabled={saving}
                  className="max-w-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Warehouse Code</span>
                <Input
                  value={form.warehouseCode}
                  onChange={(e) => set('warehouseCode', e.target.value)}
                  disabled={saving}
                  className="max-w-[160px] font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Timezone</span>
                <select
                  value={form.timezone}
                  onChange={(e) => set('timezone', e.target.value)}
                  disabled={saving}
                  className={`${SELECT_CLS} max-w-sm`}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Thresholds */}
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">Stock Thresholds</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Low Stock Alert Threshold (%)</span>
                <Input
                  type="number"
                  value={form.lowStockPct}
                  onChange={(e) => set('lowStockPct', Number(e.target.value))}
                  disabled={saving}
                  min={1} max={200}
                  className="max-w-[120px] tabular-nums"
                />
                <p className="text-xs text-ink-muted">Alert when stock falls below this % of min quantity.</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Overstock Alert Threshold (%)</span>
                <Input
                  type="number"
                  value={form.overstockPct}
                  onChange={(e) => set('overstockPct', Number(e.target.value))}
                  disabled={saving}
                  min={100} max={500}
                  className="max-w-[120px] tabular-nums"
                />
                <p className="text-xs text-ink-muted">Alert when stock exceeds this % of max quantity.</p>
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">Display</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Default Currency</span>
                <select
                  value={form.currency}
                  onChange={(e) => set('currency', e.target.value)}
                  disabled={saving}
                  className={`${SELECT_CLS} max-w-[200px]`}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="label-caps text-ink-muted">Movement Log Limit</span>
                <Input
                  type="number"
                  value={form.movementLogLimit}
                  onChange={(e) => set('movementLogLimit', Number(e.target.value))}
                  disabled={saving}
                  min={5} max={200}
                  className="max-w-[120px] tabular-nums"
                />
                <p className="text-xs text-ink-muted">Max rows shown in the movement log.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save row */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-status-ok">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
          {error && <span className="text-sm text-status-error">{error}</span>}
        </div>
      </form>
    </div>
  );
}

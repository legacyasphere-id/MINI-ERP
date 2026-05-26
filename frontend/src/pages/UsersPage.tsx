import { useState, useEffect, useCallback } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { relTime } from '@/lib/dates';
import { usersApi } from '@/services/users.service';
import type { User, UserRole } from '@/types/user.types';

const ROLE_CFG: Record<UserRole, { label: string; cls: string; bg: string }> = {
  ADMIN:   { label: 'Admin',   cls: 'text-status-error', bg: 'bg-status-error/10' },
  MANAGER: { label: 'Manager', cls: 'text-accent-gold',  bg: 'bg-accent-gold/10'  },
  STAFF:   { label: 'Staff',   cls: 'text-ink-muted',    bg: 'bg-surface-hover'   },
};

const ALL_ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'STAFF'];

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (user: User) => void;
}) {
  const [form, setForm]     = useState({ name: '', email: '', role: 'STAFF' as UserRole, password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  function reset() {
    setForm({ name: '', email: '', role: 'STAFF', password: '' });
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await usersApi.create(form);
      onCreated(res.data);
      reset();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded border border-stroke bg-surface-card shadow-xl">
          <div className="flex items-center justify-between border-b border-stroke px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Invite User</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-4">
            <div className="flex flex-col gap-1.5">
              <label className="label-caps text-ink-muted">Full Name</label>
              <Input
                placeholder="e.g. Jane Smith"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                disabled={saving}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-caps text-ink-muted">Email</label>
              <Input
                type="email"
                placeholder="e.g. jane@warehouse.local"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                disabled={saving}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-caps text-ink-muted">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                disabled={saving}
                className="h-input w-full rounded border border-stroke bg-surface-base px-3 text-sm text-ink focus:border-stroke-focus focus:outline-none disabled:opacity-40"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_CFG[r].label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-caps text-ink-muted">Initial Password</label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                disabled={saving}
              />
            </div>

            {error && <p className="text-xs text-status-error">{error}</p>}

            <div className="flex justify-end gap-2 border-t border-stroke pt-3">
              <Button type="button" variant="secondary" onClick={handleClose} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Creating…' : 'Create User'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function UsersPage() {
  const [users,        setUsers]        = useState<User[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await usersApi.list();
      setUsers(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleRoleChange(user: User, role: UserRole) {
    if (role === user.role) return;
    setRoleUpdating(user.id);
    try {
      const res = await usersApi.updateRole(user.id, role);
      setUsers((prev) => prev.map((u) => u.id === user.id ? res.data : u));
    } catch {
      // silent — role reverts visually since state unchanged
    } finally {
      setRoleUpdating(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="heading">Users</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {loading
              ? 'Loading…'
              : `${users.length} operator${users.length !== 1 ? 's' : ''} — roles and access levels.`}
          </p>
        </div>
        <Button onClick={() => setModal(true)} className="shrink-0">
          <UserPlus className="h-4 w-4 mr-1.5" />
          Invite User
        </Button>
      </div>

      <div className="rounded border border-stroke overflow-hidden">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-ink-muted">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke bg-surface-sidebar">
                  <th className="px-4 py-2.5 text-left label-caps min-w-[160px]">Name</th>
                  <th className="px-4 py-2.5 text-left label-caps min-w-[220px]">Email</th>
                  <th className="px-4 py-2.5 text-left label-caps w-52">Role</th>
                  <th className="px-4 py-2.5 text-left label-caps w-40">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke">
                {users.map((user, idx) => {
                  const cfg        = ROLE_CFG[user.role];
                  const isUpdating = roleUpdating === user.id;
                  return (
                    <tr key={user.id} className={cn(idx % 2 === 1 ? 'bg-surface-hover/20' : '')}>
                      <td className="px-4 py-2.5 font-medium text-ink">{user.name}</td>
                      <td className="px-4 py-2.5 text-ink-muted">{user.email}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'rounded px-1.5 py-0.5 text-2xs font-semibold min-w-[52px] text-center',
                            cfg.cls, cfg.bg
                          )}>
                            {cfg.label}
                          </span>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                            disabled={isUpdating}
                            className="rounded border border-stroke bg-surface-base px-2 py-0.5 text-xs text-ink-muted focus:border-stroke-focus focus:outline-none disabled:opacity-40 cursor-pointer"
                          >
                            {ALL_ROLES.map((r) => (
                              <option key={r} value={r}>{ROLE_CFG[r].label}</option>
                            ))}
                          </select>
                          {isUpdating && <span className="text-xs text-ink-muted">…</span>}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-ink-muted">
                        {relTime(user.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InviteModal
        open={modal}
        onClose={() => setModal(false)}
        onCreated={(user) => setUsers((prev) => [...prev, user])}
      />
    </div>
  );
}

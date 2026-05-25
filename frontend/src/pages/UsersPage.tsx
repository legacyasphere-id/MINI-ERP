import { cn } from '@/lib/cn';
import type { User, UserRole } from '@/types/user.types';

const ROLE_CFG: Record<UserRole, { label: string; cls: string; bg: string }> = {
  ADMIN:   { label: 'Admin',   cls: 'text-status-error',  bg: 'bg-status-error/10'  },
  MANAGER: { label: 'Manager', cls: 'text-accent-gold',   bg: 'bg-accent-gold/10'   },
  STAFF:   { label: 'Staff',   cls: 'text-ink-muted',     bg: 'bg-surface-hover'    },
};

const MOCK_USERS: User[] = [
  { id: 'usr-001', email: 'admin@warehouse.local',   name: 'Admin User',     role: 'ADMIN',   createdAt: '2025-01-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z' },
  { id: 'usr-002', email: 'jones@warehouse.local',   name: 'op-jones',       role: 'MANAGER', createdAt: '2025-03-15T00:00:00Z', updatedAt: '2026-04-10T00:00:00Z' },
  { id: 'usr-003', email: 'chen@warehouse.local',    name: 'op-chen',        role: 'STAFF',   createdAt: '2025-04-01T00:00:00Z', updatedAt: '2026-05-20T00:00:00Z' },
  { id: 'usr-004', email: 'silva@warehouse.local',   name: 'op-silva',       role: 'STAFF',   createdAt: '2025-06-10T00:00:00Z', updatedAt: '2026-03-15T00:00:00Z' },
  { id: 'usr-005', email: 'nguyen@warehouse.local',  name: 'op-nguyen',      role: 'STAFF',   createdAt: '2025-08-20T00:00:00Z', updatedAt: '2026-05-18T00:00:00Z' },
];

export function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Users</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {MOCK_USERS.length} operators — roles and access levels.
        </p>
      </div>

      <div className="rounded border border-stroke overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stroke bg-surface-sidebar">
                <th className="px-4 py-2.5 text-left label-caps min-w-[160px]">Name</th>
                <th className="px-4 py-2.5 text-left label-caps min-w-[200px]">Email</th>
                <th className="px-4 py-2.5 text-left label-caps w-28">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke">
              {MOCK_USERS.map((user, idx) => {
                const cfg = ROLE_CFG[user.role];
                return (
                  <tr
                    key={user.id}
                    className={cn(
                      idx % 2 === 1 ? 'bg-surface-hover/20' : ''
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium text-ink">{user.name}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{user.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold', cfg.cls, cfg.bg)}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { DataTable, Column, Modal, Button, StatusBadge } from '../../../components/UI';
import { useApiQuery, useApiMutation } from '../../../hooks/useApi';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../contexts/AuthContext';
import { useTenant } from '../../../contexts/TenantContext';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  data: { items: UserItem[]; total: number; page: number; limit: number; totalPages: number };
}

const ROLES = ['admin', 'manager', 'staff'] as const;

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { tenant } = useTenant();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('staff');

  const { data, isLoading, refetch } = useApiQuery<UsersResponse>(
    ['users', String(page), search],
    '/api/v1/users',
    { page, limit: 10, ...(search && { search }) },
  );

  const updateUser = useApiMutation<unknown, { id: string; role?: string; isActive?: boolean }>(
    'patch',
    (vars) => `/api/v1/users/${vars.id}`,
    {
      onSuccess: () => { toast.success('Usuário atualizado'); refetch(); },
      onError: (err) => toast.error(err.message),
    },
  );

  const deactivateUser = useApiMutation<unknown, { id: string }>(
    'delete',
    (vars) => `/api/v1/users/${vars.id}`,
    {
      onSuccess: () => { toast.success('Usuário desativado'); refetch(); },
      onError: (err) => toast.error(err.message),
    },
  );

  const invite = useApiMutation<unknown, { email: string; role: string }>(
    'post',
    `/api/v1/tenants/${tenant?.id}/invite`,
    {
      onSuccess: () => {
        toast.success('Convite enviado');
        setInviteOpen(false);
        setInviteEmail('');
        setInviteRole('staff');
      },
      onError: (err) => toast.error(err.message),
    },
  );

  const columns: Column<UserItem>[] = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role', header: 'Papel', sortable: true,
      render: (u) => u.id === currentUser?.id ? (
        <StatusBadge status={u.role} />
      ) : (
        <select
          value={u.role}
          onChange={(e) => updateUser.mutate({ id: u.id, role: e.target.value })}
          aria-label={`Papel de ${u.name}`}
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      ),
    },
    {
      key: 'isActive', header: 'Status',
      render: (u) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions', header: '',
      render: (u) => u.id === currentUser?.id ? null : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { if (confirm('Desativar este usuário?')) deactivateUser.mutate({ id: u.id }); }}
        >
          Desativar
        </Button>
      ),
    },
  ];

  const items = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <div className="page-users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Usuários</h1>
        <Button onClick={() => setInviteOpen(true)}>Convidar</Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        total={total}
        page={page}
        limit={10}
        isLoading={isLoading}
        onPageChange={setPage}
        onSearch={setSearch}
        searchPlaceholder="Buscar por nome ou email..."
        emptyMessage="Nenhum usuário encontrado"
      />

      <Modal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Convidar membro" size="sm">
        <form onSubmit={(e) => { e.preventDefault(); invite.mutate({ email: inviteEmail, role: inviteRole }); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              Email
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                autoFocus
                style={{ width: '100%', marginTop: 4 }}
              />
            </label>
            <label>
              Papel
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ width: '100%', marginTop: 4 }}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? 'Enviando...' : 'Enviar convite'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

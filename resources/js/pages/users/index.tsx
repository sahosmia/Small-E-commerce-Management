import ConfirmDialog from '@/components/shared/confirm-dialog';
import EmptyState from '@/components/shared/empty-state';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Edit,
    Plus,
    ShieldCheck,
    Store,
    Trash2,
    UserCheck,
    UserIcon,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface UserItem {
    id: number;
    name: string;
    email: string;
    username: string | null;
    role: number;
    role_label: string;
    is_active: boolean;
    created_at: string;
    created_date: string;
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface UsersIndexProps {
    users: PaginatedUsers;
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 1;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
    ];

    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    const confirmDelete = () => {
        if (!deletingUser) return;

        router.delete(route('users.destroy', deletingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`"${deletingUser.name}" deleted successfully.`);
                setDeletingUser(null);
            },
            onError: (errors) => {
                toast.error(errors.user ?? 'Failed to delete user.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className={pageContainer.wide}>
                <PageHeader
                    title="Users"
                    description="Manage system accounts, shop owners, and user credentials."
                    actions={
                        isAdmin ? (
                            <Link href={route('users.create')}>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Shop Owner
                                </Button>
                            </Link>
                        ) : null
                    }
                />

                {users.data.length === 0 ? (
                    <EmptyState
                        title="No users found"
                        description="There are currently no users in the system."
                    >
                        {isAdmin && (
                            <Link href={route('users.create')}>
                                <Button className="mt-4 flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Shop Owner
                                </Button>
                            </Link>
                        )}
                    </EmptyState>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3.5">User</th>
                                        <th className="px-6 py-3.5">Email</th>
                                        <th className="px-6 py-3.5">Role</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5">Created Date</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.data.map((user) => {
                                        const canEdit = isAdmin || auth.user.id === user.id;
                                        const canDelete = isAdmin && auth.user.id !== user.id;

                                        return (
                                            <tr key={user.id} className="transition-colors hover:bg-muted/30">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                                            {user.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-foreground">
                                                                {user.name}
                                                                {auth.user.id === user.id && (
                                                                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                @{user.username || 'n/a'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.role === 1 ? (
                                                        <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30 flex w-fit items-center gap-1 font-medium">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            Admin
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 flex w-fit items-center gap-1 font-medium">
                                                            <Store className="h-3 w-3" />
                                                            Shop Owner
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.is_active ? (
                                                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex w-fit items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 flex w-fit items-center gap-1">
                                                            <XCircle className="h-3 w-3" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>{user.created_date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {canEdit ? (
                                                            <Link href={route('users.edit', user.id)}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit User">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic px-2">No access</span>
                                                        )}

                                                        {canDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                title="Delete User"
                                                                onClick={() => setDeletingUser(user)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-border px-6 py-4">
                                <div className="text-xs text-muted-foreground">
                                    Total {users.total} users
                                </div>
                                <div className="flex items-center gap-1">
                                    {users.links.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={deletingUser !== null}
                onOpenChange={(open) => !open && setDeletingUser(null)}
                title="Delete User"
                description={`Are you sure you want to delete "${deletingUser?.name}"? This action cannot be undone.`}
                confirmLabel="Delete User"
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

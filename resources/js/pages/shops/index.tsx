import ConfirmDialog from '@/components/shared/confirm-dialog';
import EmptyState from '@/components/shared/empty-state';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle2, Edit, ExternalLink, Plus, Store, Trash2, User as UserIcon, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface ShopItem {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    status: 'active' | 'inactive' | 'pending';
    user_id: number;
    owner: {
        id: number;
        name: string;
        email: string;
    } | null;
    created_at: string;
    created_date: string;
}

interface PaginatedShops {
    data: ShopItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface ShopsIndexProps {
    shops: PaginatedShops;
}

export default function ShopsIndex({ shops }: ShopsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/shops' },
    ];

    const [deletingShop, setDeletingShop] = useState<ShopItem | null>(null);

    const confirmDelete = () => {
        if (!deletingShop) return;

        router.delete(route('shops.destroy', deletingShop.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`"${deletingShop.name}" deleted successfully.`);
                setDeletingShop(null);
            },
            onError: () => {
                toast.error('Failed to delete shop.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shops Management" />

            <div className={pageContainer.wide}>
                <PageHeader
                    title="Shops"
                    description="Create, monitor, and manage multi-vendor shops."
                    actions={
                        <Link href={route('shops.create')}>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Shop
                            </Button>
                        </Link>
                    }
                />

                {shops.data.length === 0 ? (
                    <EmptyState
                        title="No shops created yet"
                        description="Get started by creating your first shop. Customer shops will appear here and on the home page."
                    >
                        <Link href={route('shops.create')}>
                            <Button className="mt-4 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Shop
                            </Button>
                        </Link>
                    </EmptyState>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3.5">Logo</th>
                                        <th className="px-6 py-3.5">Name</th>
                                        <th className="px-6 py-3.5">Slug</th>
                                        <th className="px-6 py-3.5">Owner (User)</th>
                                        <th className="px-6 py-3.5">Shop Status</th>
                                        <th className="px-6 py-3.5">Created Date</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {shops.data.map((shop) => (
                                        <tr key={shop.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-6 py-4">
                                                {shop.logo ? (
                                                    <img
                                                        src={shop.logo}
                                                        alt={shop.name}
                                                        className="h-10 w-10 rounded-lg border border-border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
                                                        <Store className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                {shop.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                                                    {shop.slug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium text-foreground">{shop.owner?.name ?? 'Unknown'}</div>
                                                        <div className="text-xs text-muted-foreground">{shop.owner?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {shop.status === 'active' ? (
                                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex w-fit items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Active
                                                    </Badge>
                                                ) : shop.status === 'pending' ? (
                                                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 flex w-fit items-center gap-1">
                                                        Pending
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
                                                    <span>{shop.created_date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('shops.edit', shop.id)}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => setDeletingShop(shop)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {shops.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-border px-6 py-4">
                                <div className="text-xs text-muted-foreground">
                                    Total {shops.total} shops
                                </div>
                                <div className="flex items-center gap-1">
                                    {shops.links.map((link, idx) => (
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
                open={deletingShop !== null}
                onOpenChange={(open) => !open && setDeletingShop(null)}
                title="Delete Shop"
                description={`Are you sure you want to delete "${deletingShop?.name}"? This action cannot be undone.`}
                confirmLabel="Delete Shop"
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

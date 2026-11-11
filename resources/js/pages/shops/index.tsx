import ConfirmDialog from '@/components/shared/confirm-dialog';
import EmptyState from '@/components/shared/empty-state';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Edit,
    ExternalLink,
    Eye,
    MoreHorizontal,
    Plus,
    Search,
    ShieldAlert,
    Store,
    Trash2,
    UserCheck,
    UserX,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface ShopItem {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    banner: string | null;
    status: 'active' | 'inactive' | 'suspended';
    owner_id: number | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    products_count: number;
    owner: {
        id: number;
        name: string;
        email: string;
    } | null;
    created_at: string;
    created_date: string;
}

interface Metrics {
    total: number;
    active: number;
    inactive: number;
    unassigned: number;
    suspended: number;
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
    metrics: Metrics;
    filters: {
        search: string;
        status: string;
        owner_id: string;
    };
}

export default function ShopsIndex({ shops, metrics, filters }: ShopsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/shops' },
    ];

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [deletingShop, setDeletingShop] = useState<ShopItem | null>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('shops.index'),
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
            },
            { preserveState: true }
        );
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            route('shops.index'),
            {
                search,
                status: value === 'all' ? '' : value,
            },
            { preserveState: true }
        );
    };

    const changeStatus = (shop: ShopItem, newStatus: 'active' | 'inactive' | 'suspended') => {
        router.patch(
            route('shops.status', shop.id),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Shop status changed to ${newStatus}.`),
                onError: () => toast.error('Failed to change shop status.'),
            }
        );
    };

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
                    title="Shop Management"
                    description="Admin portal to monitor, create, update, and manage multi-vendor shops."
                    actions={
                        <Link href={route('shops.create')}>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Shop
                            </Button>
                        </Link>
                    }
                />

                {/* Metrics / Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border shadow-xs">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Total Shops</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">{metrics.total}</h3>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Store className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-xs">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Active Shops</p>
                                <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                                    {metrics.active}
                                </h3>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-xs">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Inactive Shops</p>
                                <h3 className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                                    {metrics.inactive}
                                </h3>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-xs">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Unassigned Shops</p>
                                <h3 className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">
                                    {metrics.unassigned}
                                </h3>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                <UserX className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Search */}
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by shop name, slug, email, or owner..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </form>

                    <div className="flex items-center gap-3">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Shops Table */}
                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    {shops.data.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                title="No shops found"
                                description="There are no shops matching your search or filter criteria."
                            >
                                <Link href={route('shops.create')}>
                                    <Button className="mt-4 flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Shop
                                    </Button>
                                </Link>
                            </EmptyState>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3.5">Shop ID</th>
                                        <th className="px-6 py-3.5">Logo</th>
                                        <th className="px-6 py-3.5">Shop Name</th>
                                        <th className="px-6 py-3.5">Owner</th>
                                        <th className="px-6 py-3.5">Email</th>
                                        <th className="px-6 py-3.5">Phone</th>
                                        <th className="px-6 py-3.5">Products</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5">Created At</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {shops.data.map((shop) => (
                                        <tr key={shop.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                #{shop.id}
                                            </td>
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
                                                <div>{shop.name}</div>
                                                <div className="text-xs font-mono text-muted-foreground font-normal">
                                                    /{shop.slug}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {shop.owner ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <UserCheck className="h-4 w-4 text-emerald-500" />
                                                        <div>
                                                            <div className="font-medium text-foreground">{shop.owner.name}</div>
                                                            <div className="text-xs text-muted-foreground">{shop.owner.email}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                                        Unassigned
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {shop.email || shop.owner?.email || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {shop.phone || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium">
                                                {shop.products_count}
                                            </td>
                                            <td className="px-6 py-4">
                                                {shop.status === 'active' ? (
                                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex w-fit items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Active
                                                    </Badge>
                                                ) : shop.status === 'suspended' ? (
                                                    <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 flex w-fit items-center gap-1">
                                                        <ShieldAlert className="h-3 w-3" />
                                                        Suspended
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 flex w-fit items-center gap-1">
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('shops.show', shop.id)} className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4" /> View Shop
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('shops.edit', shop.id)} className="flex items-center gap-2">
                                                                <Edit className="h-4 w-4" /> Edit Shop
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={route('shops.public', shop.slug)} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                                                <ExternalLink className="h-4 w-4" /> Public Page
                                                            </a>
                                                        </DropdownMenuItem>

                                                        {/* Status Toggles */}
                                                        {shop.status !== 'active' && (
                                                            <DropdownMenuItem onClick={() => changeStatus(shop, 'active')}>
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" /> Mark as Active
                                                            </DropdownMenuItem>
                                                        )}
                                                        {shop.status !== 'inactive' && (
                                                            <DropdownMenuItem onClick={() => changeStatus(shop, 'inactive')}>
                                                                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" /> Mark as Inactive
                                                            </DropdownMenuItem>
                                                        )}
                                                        {shop.status !== 'suspended' && (
                                                            <DropdownMenuItem onClick={() => changeStatus(shop, 'suspended')}>
                                                                <ShieldAlert className="h-4 w-4 text-rose-600 mr-2" /> Suspend Shop
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingShop(shop)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Shop
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

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
            </div>

            <ConfirmDialog
                open={deletingShop !== null}
                onOpenChange={(open) => !open && setDeletingShop(null)}
                title="Delete Shop"
                description={`Are you sure you want to delete "${deletingShop?.name}"? Soft deleted shops can be restored or retained in history.`}
                confirmLabel="Delete Shop"
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

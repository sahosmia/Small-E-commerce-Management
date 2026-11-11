import EmptyState from '@/components/shared/empty-state';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Edit,
    ExternalLink,
    Mail,
    MapPin,
    Package,
    Phone,
    ShieldAlert,
    Store,
    XCircle,
} from 'lucide-react';

interface MyShopData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    banner: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    status: string;
    created_date: string;
    products_count: number;
}

interface MyShopShowProps {
    shop: MyShopData | null;
}

export default function MyShopShow({ shop }: MyShopShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Shop', href: '/my-shop' },
    ];

    if (!shop) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="My Shop" />
                <div className={pageContainer.narrow}>
                    <PageHeader
                        title="My Shop"
                        description="View and manage your assigned multi-vendor shop settings."
                    />
                    <div className="mt-8">
                        <EmptyState
                            title="No shop assigned yet"
                            description="An administrator has not assigned a shop to your account yet. Please contact the administrator to set up your shop."
                        />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`My Shop - ${shop.name}`} />

            <div className={pageContainer.wide}>
                <PageHeader
                    title={shop.name}
                    description="Manage your shop profile, logo, banner, and contact information."
                    actions={
                        <div className="flex items-center gap-2">
                            <Link href={route('my-shop.edit')}>
                                <Button className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Shop Info
                                </Button>
                            </Link>
                            <a href={route('shops.public', shop.slug)} target="_blank" rel="noreferrer">
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    View Public Page
                                </Button>
                            </a>
                        </div>
                    }
                />

                {/* Banner & Logo Header */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    {shop.banner ? (
                        <div className="h-56 w-full bg-muted">
                            <img src={shop.banner} alt="Shop Banner" className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className="h-40 w-full bg-gradient-to-r from-primary/10 via-muted to-primary/5" />
                    )}

                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-border">
                        <div className="flex items-center gap-5">
                            {shop.logo ? (
                                <img
                                    src={shop.logo}
                                    alt={shop.name}
                                    className="h-20 w-20 rounded-2xl border-2 border-background object-cover shadow-md"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted/60 text-muted-foreground shadow-sm">
                                    <Store className="h-10 w-10" />
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">{shop.name}</h2>
                                <p className="text-xs font-mono text-muted-foreground mt-0.5">/{shop.slug}</p>
                            </div>
                        </div>

                        <div>
                            {shop.status === 'active' ? (
                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 px-3 py-1 text-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Active
                                </Badge>
                            ) : shop.status === 'suspended' ? (
                                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 flex items-center gap-1.5 px-3 py-1 text-sm">
                                    <ShieldAlert className="h-4 w-4" />
                                    Suspended by Admin
                                </Badge>
                            ) : (
                                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 flex items-center gap-1.5 px-3 py-1 text-sm">
                                    <XCircle className="h-4 w-4" />
                                    Inactive
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border shadow-xs md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">About Your Shop</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-foreground">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {shop.description || 'No description provided. Click "Edit Shop Info" to introduce your store to customers.'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Public Email</div>
                                        <div className="font-medium">{shop.email || '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Public Phone</div>
                                        <div className="font-medium">{shop.phone || '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:col-span-2">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Shop Location / Address</div>
                                        <div className="font-medium">
                                            {[shop.address, shop.city, shop.country].filter(Boolean).join(', ') || '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Shop Performance & Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="flex items-center justify-between py-1.5 border-b border-border">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> Registered Date
                                    </span>
                                    <span className="font-medium text-foreground">{shop.created_date}</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-border">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Package className="h-3.5 w-3.5" /> Total Assigned Products
                                    </span>
                                    <span className="font-medium text-foreground">{shop.products_count}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground space-y-2">
                            <p className="font-medium text-foreground">Need status or URL changes?</p>
                            <p>
                                Operational status and shop URL identifier are maintained by system administrators. Please contact support if you need your shop status reviewed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
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
    User,
    XCircle,
} from 'lucide-react';

interface ShopDetail {
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
    owner_id: number | null;
    created_date: string;
    created_at: string;
    products_count: number;
    owner: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface ShopShowProps {
    shop: ShopDetail;
}

export default function ShopShow({ shop }: ShopShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/shops' },
        { title: shop.name, href: `/shops/${shop.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Shop: ${shop.name}`} />

            <div className={pageContainer.wide}>
                <PageHeader
                    title={shop.name}
                    description={`View details, contact, and ownership for ${shop.name}.`}
                    actions={
                        <div className="flex items-center gap-2">
                            <Link href={route('shops.index')}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Shops
                                </Button>
                            </Link>
                            <Link href={route('shops.edit', shop.id)}>
                                <Button className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Shop
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

                {/* Banner & Header */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    {shop.banner ? (
                        <div className="h-48 w-full bg-muted">
                            <img src={shop.banner} alt="Banner" className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className="h-32 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-muted" />
                    )}

                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-border">
                        <div className="flex items-center gap-4">
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
                                    Suspended
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
                            <CardTitle className="text-base font-semibold">About Shop</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-foreground">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {shop.description || 'No description provided for this shop yet.'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Email</div>
                                        <div className="font-medium">{shop.email || '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Phone</div>
                                        <div className="font-medium">{shop.phone || '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:col-span-2">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Address</div>
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
                                <CardTitle className="text-base font-semibold">Ownership</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {shop.owner ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">{shop.owner.name}</div>
                                            <div className="text-xs text-muted-foreground">{shop.owner.email}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground">
                                        This shop has no assigned owner.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Meta & Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="flex items-center justify-between py-1.5 border-b border-border">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> Created Date
                                    </span>
                                    <span className="font-medium text-foreground">{shop.created_date}</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-border">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Package className="h-3.5 w-3.5" /> Assigned Products
                                    </span>
                                    <span className="font-medium text-foreground">{shop.products_count}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    LayoutDashboard,
    LogIn,
    Mail,
    MapPin,
    Package,
    Phone,
    Store,
} from 'lucide-react';

export interface PublicShopDetail {
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
    products: Array<{
        id: number;
        name: string;
        price: number;
        thumbnail: string | null;
    }>;
}

interface PublicShopProps {
    shop: PublicShopDetail;
}

export default function PublicShop({ shop }: PublicShopProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Head title={`${shop.name} - Storefront`} />

            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-xs font-medium">All Shops</span>
                        </Link>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-base font-bold tracking-tight">{shop.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href="/dashboard">
                                <Button className="flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline" className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Log In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Banner & Profile Section */}
            <div className="relative border-b border-border bg-card">
                {shop.banner ? (
                    <div className="h-64 sm:h-80 w-full overflow-hidden bg-muted">
                        <img src={shop.banner} alt={shop.name} className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="h-48 sm:h-60 w-full bg-gradient-to-r from-primary/15 via-primary/5 to-muted" />
                )}

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative -mt-16 sm:-mt-20 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                            {shop.logo ? (
                                <img
                                    src={shop.logo}
                                    alt={shop.name}
                                    className="h-28 w-28 rounded-2xl border-4 border-background bg-card object-cover shadow-lg"
                                />
                            ) : (
                                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-background bg-muted text-muted-foreground shadow-lg">
                                    <Store className="h-12 w-12" />
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                        {shop.name}
                                    </h1>
                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Verified Shop
                                    </Badge>
                                </div>
                                <p className="text-xs font-mono text-muted-foreground mt-1">shop/{shop.slug}</p>
                            </div>
                        </div>

                        {/* Contact Badges */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {shop.email && (
                                <a
                                    href={`mailto:${shop.email}`}
                                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 hover:bg-muted transition-colors"
                                >
                                    <Mail className="h-3.5 w-3.5 text-primary" />
                                    <span>{shop.email}</span>
                                </a>
                            )}
                            {shop.phone && (
                                <a
                                    href={`tel:${shop.phone}`}
                                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 hover:bg-muted transition-colors"
                                >
                                    <Phone className="h-3.5 w-3.5 text-primary" />
                                    <span>{shop.phone}</span>
                                </a>
                            )}
                            {(shop.city || shop.country) && (
                                <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    <span>{[shop.city, shop.country].filter(Boolean).join(', ')}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* About Card */}
                    <div className="space-y-6">
                        <Card className="border-border shadow-xs">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-base font-semibold text-foreground">About the Shop</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {shop.description || 'Welcome to our store! Browse our featured products below.'}
                                </p>

                                {shop.address && (
                                    <div className="border-t border-border pt-4 text-xs">
                                        <span className="font-semibold text-foreground">Location Address:</span>
                                        <p className="mt-1 text-muted-foreground">{shop.address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight">Available Products</h2>
                                <p className="text-xs text-muted-foreground">Browse catalog products offered by {shop.name}</p>
                            </div>
                        </div>

                        {shop.products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                                <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <h4 className="text-sm font-semibold">No products listed yet</h4>
                                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                                    This store is currently preparing its catalog inventory. Please check back soon.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {shop.products.map((product) => (
                                    <Card key={product.id} className="border-border overflow-hidden">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="h-16 w-16 rounded-xl object-cover border border-border"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-semibold text-sm">{product.name}</h4>
                                                <p className="text-xs text-primary font-bold mt-1">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="border-t border-border bg-muted/20 py-8 text-center text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {shop.name}. Powered by Small E-commerce Management.</p>
            </footer>
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2, LayoutDashboard, LogIn, Search, ShoppingBag, Store, User as UserIcon, XCircle } from 'lucide-react';
import { useState } from 'react';

export interface PublicShop {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    status: string;
    owner: {
        id: number;
        name: string;
        email: string;
    } | null;
    created_date: string;
    created_at: string;
}

interface HomeProps {
    shops: PublicShop[];
}

export default function Home({ shops }: HomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');

    const filteredShops = shops.filter((shop) =>
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.slug.toLowerCase().includes(search.toLowerCase()) ||
        shop.owner?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Head title="Explore Shops" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight">ShopMarket</span>
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                Multi-Shop
                            </span>
                        </div>
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
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="default" className="flex items-center gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Log In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-12 md:py-20">
                <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                        Discover & Explore Our <span className="text-primary">Featured Shops</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                        Browse through our verified multi-vendor partner shops, explore available brands and products, and connect with trusted store owners.
                    </p>

                    {/* Search Bar */}
                    <div className="mx-auto mt-8 max-w-md">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by shop name, slug, or owner..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Shops Listing Section */}
            <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Available Shops</h2>
                        <p className="text-xs text-muted-foreground">
                            Showing {filteredShops.length} {filteredShops.length === 1 ? 'shop' : 'shops'}
                        </p>
                    </div>
                </div>

                {filteredShops.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <Store className="h-12 w-12 text-muted-foreground/60 mb-3" />
                        <h3 className="text-base font-semibold">No shops found</h3>
                        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                            {search
                                ? `No shops matched your search for "${search}". Try searching with a different term.`
                                : 'There are currently no active shops available. Please check back soon!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredShops.map((shop) => (
                            <Card
                                key={shop.id}
                                className="group flex flex-col justify-between overflow-hidden border-border bg-card transition-all hover:shadow-md hover:border-primary/40"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {shop.logo ? (
                                                <img
                                                    src={shop.logo}
                                                    alt={shop.name}
                                                    className="h-14 w-14 rounded-xl border border-border object-cover shadow-xs"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Store className="h-7 w-7" />
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">
                                                    {shop.name}
                                                </CardTitle>
                                                <CardDescription className="font-mono text-xs text-muted-foreground mt-0.5">
                                                    /{shop.slug}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        {shop.status === 'active' ? (
                                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1 text-[11px]">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 flex items-center gap-1 text-[11px]">
                                                <XCircle className="h-3 w-3" />
                                                {shop.status}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-2.5 text-xs text-muted-foreground pt-1 pb-4">
                                    <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                                        <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
                                            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>Owner</span>
                                        </div>
                                        <span className="font-medium text-foreground">
                                            {shop.owner?.name ?? 'Merchant'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/60 pt-2">
                                        <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>Created Date</span>
                                        </div>
                                        <span>{shop.created_date}</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="border-t border-border/60 bg-muted/20 px-6 py-3">
                                    <div className="flex w-full items-center justify-between text-xs font-medium text-primary group-hover:underline">
                                        <span>View Shop Details</span>
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/30 py-8 text-center text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Small E-commerce Management. All rights reserved.</p>
            </footer>
        </div>
    );
}

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Store, ArrowLeft, ArrowRight } from 'lucide-react';

interface ProductItem {
    id: number;
    product_id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    description: string | null;
    thumbnail: string | null;
}

interface ShopInfo {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
}

interface Props {
    shop: ShopInfo;
    products: {
        data: ProductItem[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function CustomerProductsIndex({ shop, products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('customer.shops.products.index', shop.slug),
            { search },
            { preserveState: true }
        );
    };

    return (
        <div className="min-h-screen bg-muted/20">
            <Head title={`${shop.name} - Storefront`} />

            {/* Header */}
            <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>

                        {shop.logo ? (
                            <img
                                src={shop.logo}
                                alt={shop.name}
                                className="size-10 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                <Store className="size-5" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-bold leading-tight">{shop.name}</h1>
                            <p className="text-xs text-muted-foreground">Official Store</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xs w-full">
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 text-sm"
                        />
                        <Button type="submit" size="sm" variant="secondary">
                            <Search className="size-4" />
                        </Button>
                    </form>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">All Products</h2>
                        <p className="text-xs text-muted-foreground">
                            {products.total} product(s) available in this store
                        </p>
                    </div>
                </div>

                {products.data.length === 0 ? (
                    <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                        No products are currently available in this store.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((item) => (
                            <Link
                                key={item.id}
                                href={route('customer.shops.products.show', [shop.slug, item.slug])}
                                className="group flex flex-col justify-between overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition"
                            >
                                <div>
                                    <div className="aspect-square w-full overflow-hidden bg-muted">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 space-y-1.5">
                                        <div className="text-[11px] font-mono text-muted-foreground">{item.sku}</div>
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {item.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 pt-0 flex items-center justify-between border-t border-muted/50 mt-3 pt-3">
                                    <span className="text-lg font-bold text-foreground">
                                        ৳{item.price.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition">
                                        View Details <ArrowRight className="size-3" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

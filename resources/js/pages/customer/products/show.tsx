import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Store, ArrowLeft } from 'lucide-react';

interface ShopInfo {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
}

interface ProductDetails {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    description: string | null;
    thumbnail: string | null;
}

interface Props {
    shop: ShopInfo;
    product: ProductDetails;
}

export default function CustomerProductShow({ shop, product }: Props) {
    return (
        <div className="min-h-screen bg-muted/20">
            <Head title={`${product.name} - ${shop.name}`} />

            {/* Header */}
            <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('customer.shops.products.index', shop.slug)}>
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
                            <p className="text-xs text-muted-foreground">Storefront</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                    <div>
                        {product.thumbnail ? (
                            <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="aspect-square w-full rounded-xl object-cover border shadow-sm"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground text-sm">
                                No Image Available
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div>
                                <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
                                    {product.name}
                                </h2>
                            </div>

                            <div className="pt-2">
                                <span className="text-xs text-muted-foreground block">Price</span>
                                <span className="text-3xl font-bold text-foreground">
                                    ৳{product.price.toLocaleString()}
                                </span>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-semibold mb-2 text-foreground">Description</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
                            <span>Sold by {shop.name}</span>
                            <Button asChild variant="outline" size="sm">
                                <Link href={route('customer.shops.products.index', shop.slug)}>
                                    Back to Store
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

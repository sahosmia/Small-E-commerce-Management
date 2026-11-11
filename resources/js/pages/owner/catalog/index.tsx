import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Check, Eye } from 'lucide-react';

interface ProductItem {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    base_price: number;
    thumbnail: string | null;
    is_assigned: boolean;
}

interface Props {
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

export default function OwnerCatalogIndex({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('owner.catalog.index'), { search }, { preserveState: true });
    };

    const handleAddToShop = (product: ProductItem) => {
        setAddingId(product.id);
        router.post(
            route('owner.catalog.add', product.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setAddingId(null),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Shared Catalog', href: route('owner.catalog.index') }]}>
            <Head title="Shared Catalog - Products" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Shared Product Catalog</h1>
                        <p className="text-muted-foreground text-sm">
                            Browse globally verified products and add them to your shop with one click.
                        </p>
                    </div>

                    <Button asChild variant="outline">
                        <Link href={route('owner.products.create')}>
                            <Plus className="mr-2 size-4" />
                            Create Custom Product
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
                        <Input
                            placeholder="Search catalog by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button type="submit" variant="secondary" size="icon">
                            <Search className="size-4" />
                        </Button>
                    </form>
                </div>

                {products.data.length === 0 ? (
                    <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                        No active catalog products found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <div key={product.id} className="flex flex-col justify-between overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition">
                                <div>
                                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                                        {product.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                No Global Image
                                            </div>
                                        )}
                                        {product.is_assigned && (
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="default" className="bg-emerald-600 gap-1 text-xs">
                                                    <Check className="size-3" />
                                                    Already Added
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 space-y-1.5">
                                        <div className="font-mono text-[11px] text-muted-foreground">{product.sku}</div>
                                        <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {product.description || 'No description provided.'}
                                        </p>
                                        <div className="pt-2 text-lg font-bold text-foreground">
                                            ৳{product.base_price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t p-3 bg-muted/20 flex items-center justify-between gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={route('owner.catalog.show', product.id)}>
                                            <Eye className="mr-1 size-3.5" />
                                            Details
                                        </Link>
                                    </Button>

                                    {product.is_assigned ? (
                                        <Button size="sm" variant="secondary" disabled className="gap-1.5">
                                            <Check className="size-3.5" />
                                            Already Added
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddToShop(product)}
                                            disabled={addingId === product.id}
                                        >
                                            <Plus className="mr-1 size-3.5" />
                                            {addingId === product.id ? 'Adding...' : 'Add to Shop'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

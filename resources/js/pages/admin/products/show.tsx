import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Store, UserCheck } from 'lucide-react';

interface AssignedShop {
    id: number;
    shop_id: number;
    shop_name: string;
    shop_slug: string;
    shop_status: string;
    price: number;
    custom_description: string | null;
    custom_thumbnail: string | null;
    listing_status: boolean;
    assigned_at: string;
}

interface Props {
    product: {
        id: number;
        name: string;
        slug: string;
        sku: string;
        description: string | null;
        base_price: number;
        thumbnail: string | null;
        is_active: boolean;
        assigned_shops_count: number;
        creator: {
            id: number;
            name: string;
            email: string;
        } | null;
        assigned_shops: AssignedShop[];
        created_at: string;
    };
}

export default function AdminProductShow({ product }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('admin.products.index') },
            { title: product.name, href: route('admin.products.show', product.id) },
        ]}>
            <Head title={`${product.name} - Global Details`} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.products.index')}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                                {product.is_active ? (
                                    <Badge variant="default" className="bg-emerald-600">Active</Badge>
                                ) : (
                                    <Badge variant="secondary">Inactive</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-xs font-mono">{product.sku}</p>
                        </div>
                    </div>

                    <Button asChild>
                        <Link href={route('admin.products.edit', product.id)}>
                            <Pencil className="mr-2 size-4" />
                            Edit Product
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-1">
                        {product.thumbnail ? (
                            <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="mb-4 aspect-square w-full rounded-lg object-cover border"
                            />
                        ) : (
                            <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                No Global Image
                            </div>
                        )}

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-xs text-muted-foreground">Base Price:</span>
                                <div className="text-xl font-bold">৳{product.base_price.toLocaleString()}</div>
                            </div>

                            <div>
                                <span className="text-xs text-muted-foreground">Creator:</span>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <UserCheck className="size-4 text-primary" />
                                    {product.creator ? product.creator.name : 'System / Unknown'}
                                </div>
                                {product.creator && (
                                    <div className="text-xs text-muted-foreground">{product.creator.email}</div>
                                )}
                            </div>

                            <div>
                                <span className="text-xs text-muted-foreground">Assigned Count:</span>
                                <div className="font-medium">{product.assigned_shops_count} Shop(s)</div>
                            </div>

                            <div>
                                <span className="text-xs text-muted-foreground">Created Date:</span>
                                <div className="text-xs text-muted-foreground">{product.created_at}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-2 text-lg font-semibold">Global Description</h2>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {product.description || 'No global description provided.'}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Store className="size-5" />
                                    Assigned Shops ({product.assigned_shops.length})
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">Shop</th>
                                            <th className="px-3 py-2">Shop Price</th>
                                            <th className="px-3 py-2">Custom Image</th>
                                            <th className="px-3 py-2">Custom Description</th>
                                            <th className="px-3 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-xs">
                                        {product.assigned_shops.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                                                    Not assigned to any shop yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            product.assigned_shops.map((sp) => (
                                                <tr key={sp.id} className="hover:bg-muted/30">
                                                    <td className="px-3 py-2">
                                                        <div className="font-medium">{sp.shop_name}</div>
                                                        <div className="text-muted-foreground">{sp.shop_slug}</div>
                                                    </td>
                                                    <td className="px-3 py-2 font-medium">৳{sp.price.toLocaleString()}</td>
                                                    <td className="px-3 py-2">
                                                        {sp.custom_thumbnail ? (
                                                            <Badge variant="outline" className="text-primary">Custom</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">Inherited</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {sp.custom_description ? (
                                                            <Badge variant="outline" className="text-primary">Custom</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">Inherited</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {sp.listing_status ? (
                                                            <Badge variant="default" className="bg-emerald-600">Active</Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Inactive</Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash } from 'lucide-react';

interface Props {
    product: {
        id: number;
        name: string;
        slug: string;
        sku: string;
        base_price: number;
        description: string | null;
        thumbnail: string | null;
        is_active: boolean;
        assigned_shops_count: number;
    };
}

export default function AdminProductEdit({ product }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        base_price: product.base_price.toString(),
        description: product.description || '',
        thumbnail: null as File | null,
        remove_thumbnail: false,
        is_active: product.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('admin.products.index') },
            { title: 'Edit', href: route('admin.products.edit', product.id) },
        ]}>
            <Head title={`Edit ${product.name} - Admin`} />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('admin.products.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Global Product</h1>
                        <p className="text-muted-foreground text-sm">
                            Update global catalog details. Inheriting shops will receive thumbnail and description updates.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    required
                                />
                                {errors.sku && <p className="mt-1 text-xs text-destructive">{errors.sku}</p>}
                            </div>

                            <div>
                                <Label htmlFor="base_price">Base Price (৳) *</Label>
                                <Input
                                    id="base_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    required
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Note: Updating base price will not change existing shop prices.
                                </p>
                                {errors.base_price && <p className="mt-1 text-xs text-destructive">{errors.base_price}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="slug">Custom Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                            />
                            {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description">Global Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <div>
                            <Label>Global Thumbnail Image</Label>
                            {product.thumbnail && !data.remove_thumbnail && (
                                <div className="mb-3 flex items-center gap-3">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className="size-16 rounded-lg object-cover border"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => setData('remove_thumbnail', true)}
                                    >
                                        <Trash className="mr-1 size-3" />
                                        Remove Current Image
                                    </Button>
                                </div>
                            )}
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('thumbnail', e.target.files?.[0] || null)}
                            />
                            {errors.thumbnail && <p className="mt-1 text-xs text-destructive">{errors.thumbnail}</p>}
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <div className="font-medium text-sm">Active in Shared Catalog</div>
                                <div className="text-muted-foreground text-xs">
                                    If deactivated, customers across all shops will not see this product.
                                </div>
                            </div>
                            <Switch
                                checked={data.is_active}
                                onCheckedChange={(val) => setData('is_active', val)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.products.index')}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" />
                            {processing ? 'Saving...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

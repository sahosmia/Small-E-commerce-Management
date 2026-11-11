import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminProductCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        sku: '',
        base_price: '',
        description: '',
        thumbnail: null as File | null,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: route('admin.products.index') },
            { title: 'Create', href: route('admin.products.create') },
        ]}>
            <Head title="Create Global Product - Admin" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('admin.products.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Global Product</h1>
                        <p className="text-muted-foreground text-sm">
                            Add a new standard product to the shared system catalog.
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
                                placeholder="e.g. Wireless Headphone"
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
                                    placeholder="e.g. SKU-WH-100"
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
                                    placeholder="0.00"
                                    required
                                />
                                {errors.base_price && <p className="mt-1 text-xs text-destructive">{errors.base_price}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="slug">Custom Slug (Optional)</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="Auto-generated if left blank"
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
                                placeholder="Detailed description of the global product..."
                            />
                            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="thumbnail">Global Thumbnail Image</Label>
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
                                    When disabled, this product won't be visible in the catalog.
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
                            {processing ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

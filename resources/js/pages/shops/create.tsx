import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { pageContainer } from '@/lib/page-container';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Store, Upload } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useState } from 'react';

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface ShopCreateProps {
    users: UserOption[];
}

export default function ShopCreate({ users }: ShopCreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/shops' },
        { title: 'Create Shop', href: '/shops/create' },
    ];

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const form = useForm<{
        name: string;
        slug: string;
        owner_id: string | number;
        status: string;
        description: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        logo: File | null;
        banner: File | null;
    }>({
        name: '',
        slug: '',
        owner_id: users.length > 0 ? users[0].id : '',
        status: 'active',
        description: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        logo: null,
        banner: null,
    });

    const handleNameChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        form.setData((prev) => ({
            ...prev,
            name,
            slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[\s_-]+/g, '-') ? slug : prev.slug,
        }));
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('banner', file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('shops.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Shop" />

            <div className={pageContainer.narrow}>
                <PageHeader
                    title="Create Shop"
                    description="Fill in the information below to register and assign a new shop."
                    actions={
                        <Link href={route('shops.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Shops
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-6 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Shop Basic Details</CardTitle>
                        <CardDescription>
                            Configure name, URL slug, assigned owner, and status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Banner & Logo Upload */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Shop Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/50">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <Store className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="logo"
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
                                            >
                                                <Upload className="h-3.5 w-3.5" />
                                                Upload Logo
                                                <input
                                                    id="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleLogoChange}
                                                />
                                            </label>
                                            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP up to 2MB.</p>
                                        </div>
                                    </div>
                                    {form.errors.logo && <p className="text-xs text-destructive">{form.errors.logo}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="banner">Shop Banner</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/50">
                                            {bannerPreview ? (
                                                <img src={bannerPreview} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="banner"
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
                                            >
                                                <Upload className="h-3.5 w-3.5" />
                                                Upload Banner
                                                <input
                                                    id="banner"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleBannerChange}
                                                />
                                            </label>
                                            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP up to 4MB.</p>
                                        </div>
                                    </div>
                                    {form.errors.banner && <p className="text-xs text-destructive">{form.errors.banner}</p>}
                                </div>
                            </div>

                            {/* Shop Name & Slug */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    id="name"
                                    label="Shop Name"
                                    placeholder="e.g. Acme Superstore"
                                    value={form.data.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    error={form.errors.name}
                                    required
                                />

                                <FormInput
                                    id="slug"
                                    label="Shop Slug (URL identifier)"
                                    placeholder="e.g. acme-superstore"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    error={form.errors.slug}
                                    required
                                />
                            </div>

                            {/* Owner & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormSelect
                                    id="owner_id"
                                    label="Shop Owner (User)"
                                    value={form.data.owner_id}
                                    onChange={(val) => form.setData('owner_id', val ? Number(val) : '')}
                                    options={[
                                        { value: '', label: 'Unassigned (No Owner)' },
                                        ...users.map((u) => ({
                                            value: String(u.id),
                                            label: `${u.name} (${u.email})`,
                                        })),
                                    ]}
                                    placeholder="Select an approved owner"
                                    error={form.errors.owner_id}
                                />

                                <FormSelect
                                    id="status"
                                    label="Shop Status"
                                    value={form.data.status}
                                    onChange={(val) => form.setData('status', val as string)}
                                    options={[
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                        { value: 'suspended', label: 'Suspended' },
                                    ]}
                                    error={form.errors.status}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide brief details about this shop..."
                                    rows={3}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                />
                                {form.errors.description && (
                                    <p className="text-xs text-destructive">{form.errors.description}</p>
                                )}
                            </div>

                            {/* Contact Details */}
                            <div className="border-t border-border pt-4">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Contact & Location</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        id="email"
                                        label="Contact Email"
                                        placeholder="contact@shop.com"
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        error={form.errors.email}
                                    />

                                    <FormInput
                                        id="phone"
                                        label="Contact Phone"
                                        placeholder="+880 1700 000000"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        error={form.errors.phone}
                                    />

                                    <FormInput
                                        id="city"
                                        label="City"
                                        placeholder="Dhaka"
                                        value={form.data.city}
                                        onChange={(e) => form.setData('city', e.target.value)}
                                        error={form.errors.city}
                                    />

                                    <FormInput
                                        id="country"
                                        label="Country"
                                        placeholder="Bangladesh"
                                        value={form.data.country}
                                        onChange={(e) => form.setData('country', e.target.value)}
                                        error={form.errors.country}
                                    />
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Full address details..."
                                        rows={2}
                                        value={form.data.address}
                                        onChange={(e) => form.setData('address', e.target.value)}
                                    />
                                    {form.errors.address && (
                                        <p className="text-xs text-destructive">{form.errors.address}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <Link href={route('shops.index')}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Creating...' : 'Create Shop'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

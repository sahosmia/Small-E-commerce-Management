import { FormInput } from '@/components/form/form-input';
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

interface MyShopData {
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
}

interface MyShopEditProps {
    shop: MyShopData;
}

export default function MyShopEdit({ shop }: MyShopEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Shop', href: '/my-shop' },
        { title: 'Edit Shop', href: '/my-shop/edit' },
    ];

    const [logoPreview, setLogoPreview] = useState<string | null>(shop.logo);
    const [bannerPreview, setBannerPreview] = useState<string | null>(shop.banner);

    const form = useForm<{
        _method: string;
        name: string;
        description: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        logo: File | null;
        banner: File | null;
    }>({
        _method: 'PUT',
        name: shop.name || '',
        description: shop.description || '',
        email: shop.email || '',
        phone: shop.phone || '',
        address: shop.address || '',
        city: shop.city || '',
        country: shop.country || '',
        logo: null,
        banner: null,
    });

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
        form.post(route('my-shop.update'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit My Shop - ${shop.name}`} />

            <div className={pageContainer.narrow}>
                <PageHeader
                    title="Edit My Shop"
                    description="Update your shop profile, logo, banner, and customer contact information."
                    actions={
                        <Link href={route('my-shop.show')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to My Shop
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-6 border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Shop Information</CardTitle>
                        <CardDescription>
                            Customize your branding and public details. Changes will reflect on your public shop page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Logo & Banner Upload */}
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
                                                Change Logo
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
                                                Change Banner
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

                            {/* Shop Name */}
                            <FormInput
                                id="name"
                                label="Shop Name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                                required
                            />

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Shop Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell customers about your business, vision, or products..."
                                    rows={4}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                />
                                {form.errors.description && (
                                    <p className="text-xs text-destructive">{form.errors.description}</p>
                                )}
                            </div>

                            {/* Contact Details */}
                            <div className="border-t border-border pt-4">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Customer Contact & Address</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        id="email"
                                        label="Public Contact Email"
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        error={form.errors.email}
                                    />

                                    <FormInput
                                        id="phone"
                                        label="Public Contact Phone"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        error={form.errors.phone}
                                    />

                                    <FormInput
                                        id="city"
                                        label="City"
                                        value={form.data.city}
                                        onChange={(e) => form.setData('city', e.target.value)}
                                        error={form.errors.city}
                                    />

                                    <FormInput
                                        id="country"
                                        label="Country"
                                        value={form.data.country}
                                        onChange={(e) => form.setData('country', e.target.value)}
                                        error={form.errors.country}
                                    />
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Street, building, area..."
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
                                <Link href={route('my-shop.show')}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

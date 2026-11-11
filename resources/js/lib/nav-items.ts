import { type NavItem, type User } from '@/types';
import {
    LayoutGrid,
    Package,
    Store,
    Users,
} from 'lucide-react';

export function buildMainNavItems(
    _emiModuleEnabled: boolean,
    user?: User | null
): NavItem[] {
    const roleVal = user?.role;
    const isAdmin = roleVal === 1 || (typeof roleVal === 'object' && roleVal !== null && 'value' in roleVal && (roleVal as { value: number }).value === 1);

    if (isAdmin) {
        return [
            {
                key: 'dashboard',
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutGrid,
            },
            {
                key: 'shops',
                title: 'Shops',
                url: '/shops',
                icon: Store,
                items: [
                    { key: 'all_shops', title: 'All Shops', url: '/shops' },
                    { key: 'create_shop', title: 'Create Shop', url: '/shops/create' },
                ],
            },
            {
                key: 'users',
                title: 'Users',
                url: '/users',
                icon: Users,
                items: [
                    { key: 'all_users', title: 'All Users', url: '/users' },
                    { key: 'create_user', title: 'Create User', url: '/users/create' },
                ],
            },
            {
                key: 'global_products',
                title: 'Global Products',
                url: '/admin/products',
                icon: Package,
                items: [
                    { key: 'all_global_products', title: 'All Products', url: '/admin/products' },
                    { key: 'create_global_product', title: 'Create Product', url: '/admin/products/create' },
                ],
            },
        ];
    }

    // Shop Owner Navigation
    return [
        {
            key: 'dashboard',
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            key: 'my_shop',
            title: 'My Shop',
            url: '/my-shop',
            icon: Store,
            items: [
                { key: 'view_my_shop', title: 'View Store', url: '/my-shop' },
                { key: 'edit_my_shop', title: 'Shop Settings', url: '/my-shop/edit' },
            ],
        },
        {
            key: 'catalog',
            title: 'Shared Catalog',
            url: '/owner/catalog',
            icon: Package,
            items: [
                { key: 'catalog_browse', title: 'Browse Catalog', url: '/owner/catalog' },
            ],
        },
        {
            key: 'my_products',
            title: 'My Products',
            url: '/owner/products',
            icon: Store,
            items: [
                { key: 'all_my_products', title: 'My Products', url: '/owner/products' },
                { key: 'create_my_product', title: 'Add New Product', url: '/owner/products/create' },
            ],
        },
    ];
}

export function filterNavByPermission(items: NavItem[]): NavItem[] {
    return items;
}

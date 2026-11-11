import { type useTranslation } from '@/hooks/use-translation';
import { type NavItem, type User } from '@/types';
import {
    LayoutGrid,
    Package,
    Store,
    Users,
} from 'lucide-react';

export function buildMainNavItems(
    emiModuleEnabled: boolean,
    t: ReturnType<typeof useTranslation>['t'],
    user?: User | null
): NavItem[] {
    const isAdmin = user ? user.role === 1 : false;

    return [
        {
            key: 'dashboard',
            title: t('nav', 'dashboard'),
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
            title: t('nav', 'users'),
            url: '/users',
            icon: Users,
            items: [
                { key: 'all_users', title: 'All Users', url: '/users' },
                ...(isAdmin ? [{ key: 'create_user', title: 'Create User', url: '/users/create' }] : []),
            ],
        },
        {
            key: 'product',
            title: t('nav', 'product'),
            url: '/products',
            icon: Package,
            items: [
                { key: 'products', title: t('nav', 'products'), url: '/products' },
                { key: 'add_product', title: t('nav', 'add_product'), url: '/products/create' },
            ],
        },
    ];
}

export function filterNavByPermission(items: NavItem[], _permissions?: string[]): NavItem[] {
    return items;
}

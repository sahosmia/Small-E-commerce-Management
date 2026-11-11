import { type useTranslation } from '@/hooks/use-translation';
import { type NavItem, type User } from '@/types';
import {
    LayoutGrid,
    Package,
    Store,
} from 'lucide-react';

export function buildMainNavItems(
    emiModuleEnabled: boolean,
    t: ReturnType<typeof useTranslation>['t'],
    user?: User | null
): NavItem[] {
    const isAdmin = user ? Number(user.role) === 1 : true;
    const isOwner = user ? Number(user.role) === 2 : false;

    const items: NavItem[] = [
        {
            key: 'dashboard',
            title: t('nav', 'dashboard'),
            url: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    if (isAdmin) {
        items.push({
            key: 'shops',
            title: 'Shops',
            url: '/shops',
            icon: Store,
            items: [
                { key: 'all_shops', title: 'All Shops', url: '/shops' },
                { key: 'create_shop', title: 'Create Shop', url: '/shops/create' },
            ],
        });
    } else if (isOwner) {
        items.push({
            key: 'my_shop',
            title: 'My Shop',
            url: '/my-shop',
            icon: Store,
            items: [
                { key: 'view_my_shop', title: 'View Shop', url: '/my-shop' },
                { key: 'edit_my_shop', title: 'Edit Shop Info', url: '/my-shop/edit' },
            ],
        });
    }

    items.push({
        key: 'product',
        title: t('nav', 'product'),
        url: '/products',
        icon: Package,
        items: [
            { key: 'products', title: t('nav', 'products'), url: '/products' },
            { key: 'add_product', title: t('nav', 'add_product'), url: '/products/create' },
            { key: 'category', title: t('nav', 'category'), url: '/categories' },
            { key: 'unit', title: t('nav', 'unit'), url: '/units' },
            { key: 'brand', title: t('nav', 'brand'), url: '/brands' },
        ],
    });

    return items;
}

export function filterNavByPermission(items: NavItem[], _permissions?: string[]): NavItem[] {
    return items;
}

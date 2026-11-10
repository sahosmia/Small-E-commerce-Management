import { type useTranslation } from '@/hooks/use-translation';
import { type NavItem } from '@/types';
import {
    Banknote,
    BarChart3,
    BookText,
    HandCoins,
    KeyRound,
    Landmark,
    LayoutGrid,
    Package,
    Receipt,
    Settings,
    ShoppingCart,
    Store,
    Users,
    Wallet,
} from 'lucide-react';

export function buildMainNavItems(emiModuleEnabled: boolean, t: ReturnType<typeof useTranslation>['t']): NavItem[] {
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
        },
    ];
}

export function filterNavByPermission(items: NavItem[], _permissions?: string[]): NavItem[] {
    return items;
}

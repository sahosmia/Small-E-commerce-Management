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
            key: 'product',
            title: t('nav', 'product'),
            url: '/products',
            icon: Package,
            permission: 'product.view',
            items: [
                { key: 'products', title: t('nav', 'products'), url: '/products' },
                { key: 'add_product', title: t('nav', 'add_product'), url: '/products/create', permission: 'product.create' },
                { key: 'category', title: t('nav', 'category'), url: '/categories' },
                { key: 'unit', title: t('nav', 'unit'), url: '/units' },
                { key: 'brand', title: t('nav', 'brand'), url: '/brands' },
            ],
        },
     
  
        {
            key: 'user_management',
            title: t('nav', 'user_management'),
            url: '/roles',
            icon: KeyRound,
            permission: 'role.manage',
            items: [
                { key: 'users', title: t('nav', 'users'), url: '/roles?tab=users' },
                { key: 'roles', title: t('nav', 'roles'), url: '/roles?tab=roles' },
            ],
        },
       
    ];
}

export function filterNavByPermission(items: NavItem[], permissions: string[]): NavItem[] {
    const allowed = (item: NavItem) => !item.permission || permissions.includes(item.permission);

    return items.flatMap((item) => {
        if (!allowed(item)) {
            return [];
        }

        if (!item.items || item.items.length === 0) {
            return [item];
        }

        const visibleChildren = filterNavByPermission(item.items, permissions);

        return visibleChildren.length > 0 ? [{ ...item, items: visibleChildren }] : [];
    });
}

import {
    type LucideIcon,
    Package,
} from 'lucide-react';
import { type User } from '@/types';

export interface QuickActionDefinition {
    key: string;
    label: string;
    icon: LucideIcon;
    /** The `module.action` permission needed — an action the user can't perform is never offered. */
    permission?: string;
    /** Resolved lazily: Ziggy's `route()` is only available once the app has booted. */
    href: (user?: User | null) => string;
}

/** What an admin saves in Business Settings: which actions are on, in the order they cycle through. */
export interface QuickActionSetting {
    key: string;
    enabled: boolean;
}

function isUserAdmin(user?: User | null): boolean {
    const roleVal = user?.role;
    return roleVal === 1 || (typeof roleVal === 'object' && roleVal !== null && 'value' in roleVal && (roleVal as { value: number }).value === 1);
}

/**
 * Every action the Ctrl+Space switcher can offer, in its default order. Keep the keys in sync with
 * `Settings::QUICK_ACTION_KEYS` on the backend. Pages without a standalone create route open their Add
 * modal on arrival through `?quick_create=1` (the same trick the header's Quick Create menu uses).
 */
export const QUICK_ACTIONS: QuickActionDefinition[] = [
    {
        key: 'add_product',
        label: 'Add Product',
        icon: Package,
        href: (user?: User | null) => isUserAdmin(user) ? route('admin.products.create') : route('owner.products.create'),
    },
];

/** On until an admin says otherwise — the extra actions stay off by default so the switcher starts short. */
const DEFAULT_ENABLED = new Set(['add_sale', 'add_purchase', 'add_contact', 'add_product', 'add_expense']);

export const QUICK_ACTIONS_BY_KEY = new Map(QUICK_ACTIONS.map((action) => [action.key, action]));

/**
 * Reconciles a possibly-null/partial saved list against the actions the app really has: keeps the saved
 * order and on/off state, drops unknown keys, and appends anything new at the end with its default state.
 */
export function buildEffectiveQuickActions(saved: QuickActionSetting[] | null | undefined): QuickActionSetting[] {
    const kept = (saved ?? []).filter((item) => QUICK_ACTIONS_BY_KEY.has(item.key));
    const missing = QUICK_ACTIONS.filter((action) => !kept.some((item) => item.key === action.key)).map((action) => ({
        key: action.key,
        enabled: DEFAULT_ENABLED.has(action.key),
    }));

    return [...kept, ...missing];
}

/** The actions the switcher should actually show this user. */
export function resolveQuickActions(saved: QuickActionSetting[] | null | undefined): QuickActionDefinition[] {
    return buildEffectiveQuickActions(saved)
        .filter((item) => item.enabled)
        .map((item) => QUICK_ACTIONS_BY_KEY.get(item.key))
        .filter((action): action is QuickActionDefinition => action !== undefined);
}

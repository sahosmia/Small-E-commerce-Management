import { type LookupKind } from '@/components/products/form/types';
import LookupManagerModal from '@/components/products/lookup-manager-modal';
import { type Brand, type Category, type Unit } from '@/types/models';

interface LookupModalsProps {
    /** Which manager is open, if any. */
    active: LookupKind | null;
    onClose: () => void;
    /** A new category / brand / unit was created — by name, since the list refreshes afterwards. */
    onCreated: (kind: LookupKind, name: string) => void;
    categories: Category[];
    brands: Brand[];
    units: Unit[];
}

/** The create / rename / delete modals behind the "+" buttons for Category, Brand and Unit. */
export function LookupModals({ active, onClose, onCreated, categories, brands, units }: LookupModalsProps) {
        const closeUnless = (kind: LookupKind) => (open: boolean) => {
        if (!open && active === kind) onClose();
    };

    return (
        <>
            <LookupManagerModal
                open={active === 'category'}
                onOpenChange={closeUnless('category')}
                title={"Manage Categories"}
                items={categories}
                storeRouteName="categories.store"
                updateRouteName="categories.update"
                destroyRouteName="categories.destroy"
                parentOptions={categories}
                onCreated={(name) => onCreated('category', name)}
            />

            <LookupManagerModal
                open={active === 'brand'}
                onOpenChange={closeUnless('brand')}
                title={"Manage Brands"}
                items={brands}
                storeRouteName="brands.store"
                updateRouteName="brands.update"
                destroyRouteName="brands.destroy"
                onCreated={(name) => onCreated('brand', name)}
            />

            <LookupManagerModal
                open={active === 'unit'}
                onOpenChange={closeUnless('unit')}
                title={"Manage Units"}
                items={units}
                storeRouteName="units.store"
                updateRouteName="units.update"
                destroyRouteName="units.destroy"
                onCreated={(name) => onCreated('unit', name)}
            />
        </>
    );
}

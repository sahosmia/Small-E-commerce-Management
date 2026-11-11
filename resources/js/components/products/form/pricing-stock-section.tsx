import { FormSection } from '@/components/form/form-section';
import { type ProductFormApi } from '@/components/products/form/types';
import MoneyInput from '@/components/shared/money-input';
import { type ProductDetail } from '@/types/models';
import { CircleDollarSign } from 'lucide-react';

interface PricingStockSectionProps {
    form: ProductFormApi;
    mode: 'create' | 'edit';
    product?: ProductDetail;
    canSetOpeningStock?: boolean;
}

/** Selling price section. */
export function PricingStockSection({ form }: PricingStockSectionProps) {
    return (
        <FormSection
            icon={CircleDollarSign}
            title={"Pricing"}
            description="Product selling price"
            accent="emerald"
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MoneyInput
                    id="selling_price"
                    label={"Selling Price"}
                    value={form.data.selling_price}
                    onChange={(e) => form.setData('selling_price', Number(e.target.value))}
                    error={form.errors.selling_price}
                />
            </div>
        </FormSection>
    );
}

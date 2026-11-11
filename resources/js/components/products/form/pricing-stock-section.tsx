import { FormInput } from '@/components/form/form-input';
import { FormSection } from '@/components/form/form-section';
import { ReadOnlyField } from '@/components/form/read-only-field';
import { ToggleRow } from '@/components/form/toggle-row';
import { type ProductFormApi } from '@/components/products/form/types';
import MoneyInput from '@/components/shared/money-input';
import { type ProductDetail } from '@/types/models';
import { CircleDollarSign, Info, Layers, Package, Settings2 } from 'lucide-react';

interface PricingStockSectionProps {
    form: ProductFormApi;
    mode: 'create' | 'edit';
    product?: ProductDetail;
    /** False once the product has stock movements — opening stock can no longer be re-entered. */
    canSetOpeningStock: boolean;
}

/** Selling price, reorder level, the manage-stock switch and (when it's on) the opening stock. */
export function PricingStockSection({ form, mode, product, canSetOpeningStock }: PricingStockSectionProps) {
    
    return (
        <FormSection
            icon={CircleDollarSign}
            title={"Pricing & Stock"}
            description="Selling price, stock level এবং opening stock"
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

                <FormInput
                    id="minimum_stock_level"
                    label={"Minimum Stock Level"}
                    type="number"
                    step="1"
                    value={form.data.minimum_stock_level}
                    onChange={(e) => form.setData('minimum_stock_level', Number(e.target.value))}
                    error={form.errors.minimum_stock_level}
                    placeholder="0"
                    icon={Layers}
                />

                {/* Create mode simply has no third field — the row stays a normal grid. */}
                {mode === 'edit' && product && (
                    <ReadOnlyField
                        id="current_stock"
                        label={"Current Stock"}
                        value={product.current_stock}
                        helperText={"Can't be changed here — use Stock Adjustment"}
                    />
                )}
            </div>

            <div className="mt-4">
                <ToggleRow
                    id="manage_stock"
                    label={"Manage Stock"}
                    description={"When off, this is a service item (Installation Charge) — stock won't be tracked"}
                    checked={form.data.manage_stock}
                    onCheckedChange={(checked) => form.setData('manage_stock', checked)}
                    icon={Settings2}
                />
            </div>

            {form.data.manage_stock && (
                <div className="bg-muted/20 mt-4 rounded-lg border border-dashed p-4">
                    {canSetOpeningStock ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormInput
                                id="opening_stock"
                                label={"Opening Stock"}
                                type="number"
                                step="1"
                                value={form.data.opening_stock}
                                onChange={(e) => form.setData('opening_stock', Number(e.target.value))}
                                error={form.errors.opening_stock}
                                placeholder="0"
                                icon={Package}
                            />

                            <MoneyInput
                                id="opening_stock_cost"
                                label={"Opening Stock Unit Cost"}
                                value={form.data.opening_stock_cost}
                                onChange={(e) => form.setData('opening_stock_cost', Number(e.target.value))}
                                error={form.errors.opening_stock_cost}
                            />
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Info className="size-4 shrink-0" />
                            {"This product already has stock movement — opening stock can no longer be changed, use Stock Adjustment."}
                        </div>
                    )}
                </div>
            )}
        </FormSection>
    );
}

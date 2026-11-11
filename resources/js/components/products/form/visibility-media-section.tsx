import { FormSection } from '@/components/form/form-section';
import { ToggleRow } from '@/components/form/toggle-row';
import { ImageUploader } from '@/components/products/form/image-uploader';
import { type ProductFormApi } from '@/components/products/form/types';
import { Eye } from 'lucide-react';

interface VisibilityMediaSectionProps {
    form: ProductFormApi;
    /** URL of the image already saved on the product (edit mode). */
    savedImageUrl: string | null;
}

/** Whether the product is for sale / active, and its image. */
export function VisibilityMediaSection({ form, savedImageUrl }: VisibilityMediaSectionProps) {
    
    return (
        <FormSection icon={Eye} title={"Visibility & Media"} description="Product visibility, status এবং image" accent="amber">
            <div className="grid gap-3">
                <ToggleRow
                    id="is_for_sale"
                    label={"For Sale (POS)"}
                    description={"Whether this shows in POS"}
                    checked={form.data.is_for_sale}
                    onCheckedChange={(checked) => form.setData('is_for_sale', checked)}
                />
                <ToggleRow
                    id="is_active"
                    label={"Active"}
                    description={"When off, hidden everywhere"}
                    checked={form.data.is_active}
                    onCheckedChange={(checked) => form.setData('is_active', checked)}
                />
            </div>

            <div className="mt-4">
                <ImageUploader
                    file={form.data.image}
                    savedUrl={savedImageUrl}
                    onChange={(file) => form.setData('image', file)}
                    error={form.errors.image}
                />
            </div>
        </FormSection>
    );
}

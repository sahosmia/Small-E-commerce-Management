import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { type StockStatus } from '@/types/models';

interface ProductStatusBadgeProps {
    product: {
        manage_stock: boolean;
        stock_status: StockStatus;
        is_active: boolean;
    };
    /** The list shows stock status through the quantity's color (see StockQuantity), so it skips the In/Low/Out badge. */
    hideStockStatus?: boolean;
}

/** Stock-status + Inactive badges — shown identically in the table's Status column and the mobile card. */
export default function ProductStatusBadge({ product, hideStockStatus = false }: ProductStatusBadgeProps) {
    
    const stockStatusLabel: Record<StockStatus, string> = {
        in_stock: "In Stock",
        low_stock: "Low Stock",
        out_of_stock: "Out of Stock",
    };

    return (
        <span className="inline-flex items-center gap-1">
            {product.manage_stock ? (
                !hideStockStatus && <StatusBadge status={product.stock_status} label={stockStatusLabel[product.stock_status]} />
            ) : (
                <Badge variant="outline">{"Service Item"}</Badge>
            )}
            {!product.is_active && <StatusBadge status="inactive" label={"Inactive"} />}
        </span>
    );
}

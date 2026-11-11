<?php

namespace App\Actions\Product;

use App\Models\Product;
use Exception;

class DeleteGlobalProductAction
{
    /**
     * Delete global product if unassigned. Blocks if assignment count >= 1.
     *
     * @throws Exception
     */
    public function execute(Product $product): bool
    {
        $assignmentCount = $product->shopProducts()->count();

        if ($assignmentCount > 0) {
            throw new Exception("Product Cannot Be Deleted. This product is currently assigned to {$assignmentCount} shop(s). You can deactivate the product instead.");
        }

        return (bool) $product->delete();
    }

    /**
     * Check if product can be deleted.
     */
    public function canDelete(Product $product): bool
    {
        return $product->shopProducts()->count() === 0;
    }

    /**
     * Return assigned shops count.
     */
    public function assignedCount(Product $product): int
    {
        return $product->shopProducts()->count();
    }
}

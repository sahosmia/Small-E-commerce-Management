<?php

namespace App\Actions\Shop;

use App\Models\Shop;
use Illuminate\Validation\ValidationException;

class DeleteShopAction
{
    /**
     * Soft delete a shop or deactivate if restrictions exist.
     *
     * @throws ValidationException
     */
    public function execute(Shop $shop, bool $force = false): bool
    {
        return (bool) $shop->delete();
    }
}

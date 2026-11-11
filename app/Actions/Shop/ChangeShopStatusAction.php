<?php

namespace App\Actions\Shop;

use App\Models\Shop;
use Illuminate\Validation\ValidationException;

class ChangeShopStatusAction
{
    /**
     * @var list<string>
     */
    public const ALLOWED_STATUSES = ['active', 'inactive', 'suspended'];

    /**
     * Change a shop's status.
     *
     * @throws ValidationException
     */
    public function execute(Shop $shop, string $status): Shop
    {
        if (! in_array($status, self::ALLOWED_STATUSES, true)) {
            throw ValidationException::withMessages([
                'status' => 'Invalid shop status provided.',
            ]);
        }

        $shop->update(['status' => $status]);

        return $shop->fresh();
    }
}

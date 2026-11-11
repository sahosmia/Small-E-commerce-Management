<?php

namespace App\Actions\Shop;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AssignShopOwnerAction
{
    /**
     * Assign an owner to a shop.
     *
     * @throws ValidationException
     */
    public function execute(Shop $shop, ?int $ownerId): Shop
    {
        if ($ownerId !== null) {
            $existing = Shop::where('owner_id', $ownerId)
                ->where('id', '!=', $shop->id)
                ->first();

            if ($existing) {
                throw ValidationException::withMessages([
                    'owner_id' => 'The selected owner already has a shop assigned.',
                ]);
            }

            $user = User::find($ownerId);
            if (! $user || ! $user->is_active) {
                throw ValidationException::withMessages([
                    'owner_id' => 'The selected owner must be active.',
                ]);
            }
        }

        $shop->update(['owner_id' => $ownerId]);

        return $shop->fresh();
    }
}

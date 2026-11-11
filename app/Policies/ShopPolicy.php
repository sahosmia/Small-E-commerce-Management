<?php

namespace App\Policies;

use App\Models\Shop;
use App\Models\User;

class ShopPolicy
{
    /**
     * Determine whether the user can view any shops (Admin only).
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the shop.
     */
    public function view(User $user, Shop $shop): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return (int) $shop->owner_id === (int) $user->id;
    }

    /**
     * Determine whether the user can create shops (Admin only).
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the shop.
     */
    public function update(User $user, Shop $shop): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return (int) $shop->owner_id === (int) $user->id;
    }

    /**
     * Determine whether the user can delete the shop (Admin only).
     */
    public function delete(User $user, Shop $shop): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can change status of the shop (Admin only).
     */
    public function changeStatus(User $user, Shop $shop): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can assign/reassign an owner (Admin only).
     */
    public function assignOwner(User $user, Shop $shop): bool
    {
        return $user->isAdmin();
    }
}

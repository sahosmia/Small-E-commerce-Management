<?php

namespace App\Enums;

enum UserRole: int
{
    case Admin = 1;
    case ShopOwner = 2;

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::ShopOwner => 'Shop Owner',
        };
    }
}

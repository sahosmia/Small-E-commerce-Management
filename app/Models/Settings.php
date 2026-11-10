<?php

namespace App\Models;

use App\Enums\ThemeColor;
use Database\Factories\SettingsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    /** @use HasFactory<SettingsFactory> */
    use HasFactory;

    protected $table = 'settings';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'theme_color' => ThemeColor::class,
            'thermal_printer_enabled' => 'boolean',
            'emi_module_enabled' => 'boolean',
            'serial_number_module_enabled' => 'boolean',
            'pagination_per_page_options' => 'array',
            'menu_order' => 'array',
            'quick_actions' => 'array',
            'invoice_settings' => 'array',
            'license_last_verified_at' => 'datetime',
        ];
    }

    public static function current(): static
    {
        return static::query()->first() ?? static::create([
            'shop_name' => 'My Shop',
            'theme_color' => ThemeColor::Blue,
        ]);
    }

    public static function currentOrNull(): ?static
    {
        return static::query()->first();
    }

    public function brandingUrls(): array
    {
        return [];
    }
}

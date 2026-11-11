<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'created_by' => User::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'sku' => 'SKU-'.strtoupper(fake()->unique()->bothify('??####')),
            'description' => fake()->paragraph(),
            'base_price' => fake()->randomFloat(2, 50, 5000),
            'thumbnail' => null,
            'is_active' => true,
        ];
    }
}

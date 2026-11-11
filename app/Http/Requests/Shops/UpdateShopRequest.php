<?php

namespace App\Http\Requests\Shops;

use App\Models\Shop;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Shop|null $shop */
        $shop = $this->route('shop');
        $shopId = $shop instanceof Shop ? $shop->id : $shop;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('shops', 'slug')->ignore($shopId)],
            'owner_id' => [
                'nullable',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
                Rule::unique('shops', 'owner_id')->ignore($shopId),
            ],
            'user_id' => [
                'nullable',
                Rule::exists('users', 'id'),
            ],
            'status' => ['required', 'string', Rule::in(['active', 'inactive', 'suspended'])],
            'description' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'banner' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (! $this->has('owner_id') && $this->has('user_id')) {
            $this->merge([
                'owner_id' => $this->input('user_id'),
            ]);
        }
    }
}

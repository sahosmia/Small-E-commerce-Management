<?php

namespace App\Http\Requests\Contacts\Contact;

use App\Models\Contact;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class WaiveDueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * A discount forgives what the contact owes us — it can't be larger than
     * that (it would turn into an invented payable).
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Contact $contact */
            $contact = $this->route('contact');
            $owed = max(0.0, (float) $contact->balance);

            if ((float) $this->input('amount', 0) > $owed + 0.0001) {
                $validator->errors()->add('amount', $owed > 0
                    ? 'A discount cannot exceed what this contact owes (৳'.number_format($owed, 2).').'
                    : 'This contact owes nothing, so there is no due to discount.');
            }
        });
    }
}

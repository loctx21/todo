<?php

namespace App\Http\Requests;

use App\Http\Requests\TraitRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItem extends FormRequest
{
    use TraitRule;
    
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['filled', 'max:255'],
            'description' => ['string', 'nullable'],
            'due_at' => ['filled', 'date'],
            'status' => ['filled', Rule::in(true, false)]
        ];
    }
}

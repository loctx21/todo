<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

trait TraitRule {
    /**
     * Get Common Item rules
     * 
     * @return array $rule
     */
    public function getGeneralItemRule()
    {
        return [
            'name' => ['required', 'max:255'],
            'description' => ['string', 'nullable'],
            'due_at' => ['filled', 'date']
        ];
    }

}
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /**
     * The attributes that are mass assignable
     * 
     * @var array
     */
    protected $fillable = ['name', 'description', 'due_at'];

    protected $casts = [
        'history' => 'array'
    ];
}

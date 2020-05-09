<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Item;
use Carbon\Carbon;
use Faker\Generator as Faker;

$factory->define(Item::class, function (Faker $faker) {
    return [
        'name' => $faker->text(50),
        'description' => $faker->paragraph(3)
    ];
});

$factory->state(Item::class, 'done_at', [
    'done_at' => Carbon::now()->toDateTimeString()
]);
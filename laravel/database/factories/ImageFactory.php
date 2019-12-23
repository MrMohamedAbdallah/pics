<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Model;
use Faker\Generator as Faker;

$factory->define(App\Image::class, function (Faker $faker) {
    $filePath = storage_path('app/public/images');
    // die($filePath);
    $iamgeSizes = [
        ["width" => 1920, "height" => 1080],
        ["width" => 1280, "height" => 720],
        ["width" => 1080, "height" => 1080],
    ];

    $size = $iamgeSizes[(rand() % count($iamgeSizes))];

    $image = "images/" . $faker->image("storage/app/public/images", $size["width"], $size["height"], null, false);
    
    return [
        "title" => $faker->words((rand() % 3) + 1, true),
        "description"   => $faker->paragraph((rand() % 5) + 1),
        "tags"  => implode(",", $faker->words((rand() % 5) + 1, false)),
        "image" => $image,
        "image_small" => $image
    ];
});

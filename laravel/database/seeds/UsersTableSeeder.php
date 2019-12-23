<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\User::class, 30)->create()->each(function($user){
            // Random value between 1-20
            $numberOfImages = (rand() % 20 )+ 1;

            // Create images for each user
            factory(App\Image::class, $numberOfImages)->make()->each(function($image) use ($user){

                $image->user_id = $user->id;
                
                // Save the image
                $image->save();
            });
        });
    }
}

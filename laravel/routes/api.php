<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('/images', 'ImageController', ['only' => ['index', 'show', 'store', 'update', 'destroy']]);

Route::get("/user/{id}", "ImageController@user")->name("user");
Route::get("/search", "ImageController@search")->name("search");



Route::group([
    'prefix' => 'auth'
], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('register', 'AuthController@register');
    Route::post('logout', 'AuthController@logout');
    Route::post('password', 'AuthController@changePassword');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
});
Route::post('update', 'AuthController@update');

// Download the file
Route::get('download/{image}', 'ImageController@download');

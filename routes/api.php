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

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/item', 'TodoController@get');
    Route::post('/item', 'TodoController@create');
    Route::put('/item/{item}', 'TodoController@update');
    Route::get('/item/{item}', 'TodoController@getItem');
    Route::delete('/item/{item}', 'TodoController@delete');
});


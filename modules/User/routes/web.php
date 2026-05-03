<?php

use Illuminate\Support\Facades\Route;
use Modules\User\src\Http\Controllers\UserController;

Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('data', [UserController::class, 'data'])->name('data');
        Route::get('create', [UserController::class, 'create'])->name('create');
        Route::post('create', [UserController::class, 'store'])->name('store');
        Route::get('edit/{user}', [UserController::class, 'edit'])->name('edit');
        Route::put('edit/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('delete/{user}', [UserController::class, 'delete'])->name('delete');
    });
});

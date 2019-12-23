<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected   $table = "images",  // Default
                $primaryKey = "id",     // Default
                $fillable   = [

                ];

    /**
     * Realtionship with the user
     */
    public function user(){
        return $this->belongsTo("App\User", "user_id", "id");
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected   $table = "images",  // Default
                $primaryKey = "id",     // Default
                $fillable   = [
                    'title', 'description', 'tags', 'image', 'image_small'
                ];

    
    /**
     * The attributes that will be hidden in JSON response
     */
    protected $hidden = [
        'user_id', 'updated_at'
    ];


    /**
     * Converting tags attribute from string to array when getting it's value
     */
    protected function getTagsAttribute($value){
        return explode(",", $value);
    }

    /**
     * Converting tags attribute from array to string when setting it's value
     */
    protected function setTagsAttribute($value){
        $this->attributes['tags'] = implode(",", $value);
    }


    /**
     * Realtionship with the user
     */
    public function user(){
        return $this->belongsTo("App\User", "user_id", "id");
    }
}

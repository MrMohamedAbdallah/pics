<?php

namespace App\Http\Controllers;

use App\Image;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ImageController extends Controller
{
    /**
     * @var string Upload images path
     */
    public const STORAGE_PATH = "public/images";

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'user', 'search']]);
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get images
        $images = Image::with("user")->paginate(10);

        $images = $this->convertImages($images);

        return response()->json($images, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request
        $result = Validator::make($request->all(), [
            'title' => 'required|min:3|max:50',
            'description'   => 'required|min:10|max:200',
            'tags'  => 'required|array|min:1|max:5',
            'tags.*'  => 'min:3|max:10',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2024',
        ]);

        if (!$result->fails()) {

            // Store the image
            $filePath = $request->image->store(self::STORAGE_PATH);

            // Create new image
            $image = new Image($request->only(['title', 'description', 'tags']));

            $image->image = $filePath;
            $image->image_small = $filePath;
            $image->user_id = auth()->user()->id;

            // Save iamge into the database
            $image->save();

            $image = $this->convertImage($image);

            return response()->json($image, 201);
        } else {
            return response()->json([
                'errors' => $result->errors()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        /**
         * Find the image
         * Or send 404 error
         */
        try {
            $image = Image::with('user')->findOrFail($id);

            $image = $this->convertImage($image);

            return response()->json($image, 200);
        } catch (Exception $e) {
            return response()->json([
                'errors'    => ['Image not found']
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Image $image)
    {
        // Validate the request
        $result = Validator::make($request->all(), [
            'title' => 'required|min:3|max:50',
            'description'   => 'required|min:10|max:200',
            'tags'  => 'required|array|min:1|max:5',
            'tags.*'  => 'min:3|max:10',
            'file' => 'nullable|image|mimes:jpeg,png,jpg|max:2024',
        ]);

        if (!$result->fails()) {

            // Get image file path as a default new file path value
            $filePath = $image->image;

            // Check if the user uploaded new image
            if ($request->file) {

                // Delete the old image
                Storage::delete($filePath);
                // Upload the new image
                $filePath = $request->file->store(self::STORAGE_PATH);
            }


            $image->update([
                'title' => $request->title,
                'description' => $request->description,
                'tags'  => $request->tags,
                'image' => $filePath,
                'image_small'   => $filePath
            ]);

            // Save changes into database
            $image->save();

            $image = $this->convertImage($image);

            return response()->json($image, 200);
        } else {
            return response()->json([
                'errors' => $result->errors()
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function destroy(Image $image)
    {
        $image->delete();

        return response()->json([
            'deleted'   => true
        ], 200);
    }


    /**
     * Converting images path and return the object
     * 
     * @param \App\Image $images
     * @return \App\Image $images
     */
    public function convertImages($images)
    {
        $images->map(function ($i) {

            $i = $this->convertImage($i);

            return $i;
        });

        return $images;
    }

    public function convertImage($image)
    {

        // Get the path of the image
        $image->image = Storage::url($image->image);
        $image->image_small = Storage::url($image->image_small);

        // Get the full path for the user image if it exists
        if ($image->user && $image->user->profile_pic) {
            $image->user->profile_pic = Storage::url($image->user->profile_pic);
            $image->user->profile_pic_small = Storage::url($image->user->profile_pic_small);
        }

        return $image;
    }



    /**
     * User profile uploaded images
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function user($id)
    {

        // Check if user exists
        try {
            
            $user = User::findOrFail($id);

            // Get iamges
            $images = $user->images()->paginate();

            $images = $this->convertImages($images);

            if($user->profile_pic){
                $user->profile_pic = Storage::url($user->profile_pic);
                $user->profile_pic_small = $user->profile_pic;
            }

            return response()->json([
                'user'  => $user,
                'images'    => $images
            ],200);

        } catch (Exception $e) {
            return response()->json([
                'errors'    => [
                    'Not Found'
                ]
            ], 404);
        }
    }

    /**
     * Search records using algolia
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    function search(Request $request){

        $results = Validator::make($request->all(), [
            'query' => 'required|max:50'
        ]);

        if(!$results->fails()){

            $images = Image::search($request->get('query'))->paginate();
            
            // Get user data
            $images->load('user');

            $images = $this->convertImages($images);

            return response()->json($images, 200);
        } else {    // It Fails :(
            return response()->json([
                'errors'    => $results->errors()
            ], 400);
        }

    }
}

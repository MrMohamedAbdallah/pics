<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use ImageOptimizer;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Register new user and getting JWT
     * 
     * @var Request $request
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request){

        $results = Validator::make($request->all(), [
            'name'  => 'required|min:3|max:15',
            'email' => 'required|email|unique:users,email',
            'password'  => 'required|min:6|max:50|confirmed',
        ]);

        if(!$results->fails()){ // Success
            
            // Create new user
            $user = new User([
                'name'  => $request->name,
                'email' => $request->email,
                'password'  => Hash::make($request->password),
            ]);
            
            $user->save();

            // Create new token and send it
            $token = auth()->attempt([
                'email' => $request->email,
                'password' => $request->password,
            ]);

            return $this->respondWithToken($token);
        
        } else { // Fails
            return response()->json( [
                'errors'    => $results->errors()
            ], 401);
        }

    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth()->user();
        if($user->profile_pic){
            $user->profile_pic = Storage::url($user->profile_pic);
            $user->profile_pic_small = $user->profile_pic;
        }
        return response()->json($user);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }


    /**
     * Change user password
     * 
     * @param  \Illuminate\Http\Request $request
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request){

        // Vlidate the request
        $results = Validator::make($request->all(), [
            'old_password' => 'required|min:6',
            'password'  => 'required|min:6|confirmed'
        ]);

        if( ! $results->fails()){

            // Check the password
            $user = auth()->user();

            if(Hash::check($request->old_password, $user->password)){ // Change password
                
                // Save new password
                $user->password = Hash::make($request->password);
                $user->save();

                return response()->json([
                    'success'   => true
                ], 200);
            } else { // Wrong password
                return response()->json([
                    'errors'    => [
                        'old_password'  => 'Old password is wrong'
                    ]
                ], 400);
            }
        } else {
            return response()->json([
                'errors'    => $results->errors()
            ], 401);
        }

    }


    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    
    /**
     * Update user info
     */
    public function update(Request $request){
        $user = auth()->user();
        // Validate the rquest
        $result = Validator::make($request->all(), [
            'name'  => 'nullable|min:3|max:15',
            'email'  => 'nullable|email|unique:users,email,' . $user->id,
            'website'  => 'nullable|string|url',
            'bio'  => 'nullable|string|min:10|max:200',
            'profile_pic'   => 'nullable|image|max:2048'
        ]);


        // It fails :(
        if($result->fails()){
            return response()->json([
                'errors'    => $result->errors()
            ], 400);
        }

        $filePath = $user->profile_pic;
        $filePathSmall = $user->profile_pic_small;
        if($request->profile_pic){
            $filePath = $request->profile_pic->store('public/images');
            $filePathSmall = $this->optimizeImage($filePath);
        }

        $user->name = $request->name ? $request->name : $user->name;
        $user->email = $request->email ? $request->email : $user->email;
        $user->website = $request->website ? $request->website : $user->website;
        $user->bio = $request->bio ? $request->bio : $user->bio;
        $user->profile_pic = $filePath;
        $user->profile_pic_small = $filePathSmall;
        
        $user->save();
        
        $user->profile_pic = Storage::url($user->profile_pic);
        $user->profile_pic_small = $user->profile_pic;

        return response()->json([
            'user' => $user
        ], 200);
    }


    /**
     * Optimzize image
     */
    public function optimizeImage($imagePath){
        $optimizedPath = explode(".", $imagePath);
        $optimizedPath = $optimizedPath[0] . "_small" . "." . $optimizedPath[1];

        ImageOptimizer::optimize('../storage/app/' . $imagePath, '../storage/app/' .  $optimizedPath);
        return $optimizedPath;
    }
}

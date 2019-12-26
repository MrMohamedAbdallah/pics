<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
        return response()->json(auth()->user());
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
}

<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockedUnBlocked;
use App\Mail\UserCreated;
use App\Mail\UserRoleChanged;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'is_admin' => ['boolean']
        ]);

        $password = Str::random(8);

        $data['password'] = bcrypt($password);

        $data['email_verified_at'] = now();

        $user = User::create($data);

        Mail::to($user)->send(new UserCreated($user, $user->password));

        return redirect()->back();
    }


    public function changeRole(User $user)
    {

        $user->update(['is_admin' => !(boolval($user->is_admin))]);

        $message = "User Role Was Changed into " . ($user->is_admin ? "Admin" : "Regular User");

        Mail::to($user)->send(new UserRoleChanged($user));

        return response()->json(['message' => $message]);
    }

    public function blocUnBlockkUser(User $user)
    {
        $message = '';

        if ($user->blocked_at) {
            $user->blocked_at = null;
            $message = " user '.$user->name.' has been activated";
        } else {
            $user->blocked_at = now();
            $message = " user '.$user->name.' has been blocked";
        }

        $user->save();


        Mail::to($user)->send(new UserBlockedUnBlocked($user));


        return response()->json(['message' => $message]);
    }
}

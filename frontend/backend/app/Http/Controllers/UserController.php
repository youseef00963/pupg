<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // عرض كل المستخدمين
    public function index()
    {
        return User::with('orders')->get();
    }

    // إضافة مستخدم جديد
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    // عرض مستخدم محدد
    public function show(User $user)
    {
        return $user->load('orders');
    }

    // تحديث مستخدم
    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        return response()->json($user);
    }

    // حذف مستخدم
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}

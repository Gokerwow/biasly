"use client";

import { login, signup } from './actions'
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                {/* K-pop themed header */}
<div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center">
    <h1 className="text-3xl font-bold text-white tracking-wide">
        YOUR BIAS IS WAITING
    </h1>
    <p className="text-pink-100 mt-2">Log in to access your lists and never miss a comeback.</p>
</div>

                <div className="p-8">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                formAction={login}
                                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-105"
                            >
                                Log in
                            </button>
                            <button
                                formAction={signup}
                                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google sign-in */}
                    <div className="mt-6">
                        <button
                            onClick={() => signup()} // Replace with your Google auth function
                            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            <FcGoogle className="h-5 w-5 mr-2" />
                            Sign in with Google
                        </button>
                    </div>

                    {/* K-pop themed footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            By logging in, you agree to our <a href="#" className="text-pink-600 hover:text-pink-500">Terms</a> and <a href="#" className="text-pink-600 hover:text-pink-500">Privacy Policy</a>
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            ✨ Stan your favorite groups! ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
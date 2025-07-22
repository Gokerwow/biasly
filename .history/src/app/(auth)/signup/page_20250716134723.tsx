// app/signup/page.tsx
'use client'

import { useFormState } from 'react-dom';
import { signup, SignupFormState } from '../actions'
import GoogleButton from '@/components/googleButton';

const initialState: SignupFormState = {
    message: "",
};

export default function SignUpPage() {
    const [state, formAction] = useFormState(signup, initialState);
    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                {/* K-pop themed header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white">SIGN UP</h1>
                    <p className="text-pink-100 mt-2">Join the fandom today!</p>
                </div>

                <div className="p-8">
                    <form action={formAction} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                placeholder="Your name"
                            />
                            {state.errors?.name &&
                                <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
                            }
                        </div>

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
                            {state.errors?.email &&
                                <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>
                            }
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
                            {state.errors?.password &&
                                <p className="text-sm text-red-500 mt-1">{state.errors.password[0]}</p>
                            }
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                placeholder="••••••••"
                            />
                            {state.errors?.confirmPassword &&
                                <p className="text-sm text-red-500 mt-1">{state.errors.confirmPassword[0]}</p>
                            }
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                        >
                            Create Account
                        </button>
                        {state.message && !state.errors &&
                            <p className="text-sm text-red-500 text-center">{state.message}</p>
                        }
                    </form>

                    {/* Divider */}
                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Google sign-in */}
                    <div className="mt-6">
                        <GoogleButton />
                    </div>

                    {/* K-pop themed footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Already have an account? <a href="/login" className="text-pink-600 hover:text-pink-500">Log in</a>
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            ✨ Become part of the fandom! ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
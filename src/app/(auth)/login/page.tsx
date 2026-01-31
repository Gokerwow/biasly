'use client'

import { login } from './action'
import GoogleButton from '@/components/UI/googleButton';
import { Input } from '@/components/UI/input';
import { RectangleEllipsis, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LoginPage() {

    const [state, formAction] = useActionState(login, null)

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-6xl h-3/4 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col lg:flex-row">
                
                {/* Left side - Image/Photo */}
                <div className="lg:w-1/2 relative bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 p-12 flex flex-col justify-center items-center text-center min-h-[300px] lg:min-h-[600px]">
                    <div className="absolute inset-0 bg-black/10"></div>
            
                    
                    <div className='absolute inset-0 w-full h-full '>
                        <Image
                            src="/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg"
                            alt="K-pop photocards"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* <div className="absolute inset-0 bg-gradient-to-br from-pink-600/80 via-pink-500/80 to-rose-500/80"></div> */}

                </div>

                {/* Right side - Form */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                            <p className="text-gray-400">Log in to access your cards lists and track your cards!</p>
                        </div>

                        <form className="space-y-6" action={formAction}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <Input
                                    placeholder="your@email.com"
                                    name="email"
                                    type="email"
                                    required
                                    icon={User}
                                    className='px-4 py-3'
                                />
                                {state?.errors?.email && (
                                    <p className="text-red-400 text-sm mt-1">{state.errors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <Input
                                    placeholder="••••••••"
                                    name="password"
                                    type="password"
                                    required
                                    icon={RectangleEllipsis}
                                    className='px-4 py-3'
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                >
                                    Log in
                                </button>
                                <Link
                                    href="/signup"
                                    className="w-1/2 flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        {/* Google sign-in */}
                        <div className="mt-6">
                            <GoogleButton />
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">
                                By logging in, you agree to our <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">Terms</a> and <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
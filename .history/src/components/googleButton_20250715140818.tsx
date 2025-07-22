'use client'

import { signup } from '@/app/(auth)/actions'
import { FcGoogle } from 'react-icons/fc';

export default function GoogleButton() {
    return (
        <button
            onClick={() => signup} // Replace with your Google auth function
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
            <FcGoogle className="h-5 w-5 mr-2" />
            Sign in with Google
        </button>
    )
}
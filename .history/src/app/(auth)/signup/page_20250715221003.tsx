// app/signup/page.tsx
'use client' // <-- Langkah 1: Jadikan ini Client Component

import { useState } from 'react'
import { signup } from '../actions'
import GoogleButton from '@/components/googleButton';

export default function SignUpPage() {
  // Langkah 2: Buat state untuk mengontrol langkah form
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header tetap sama */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {/* Judul bisa berubah sesuai langkah */}
            {step === 1 ? 'CREATE YOUR ACCOUNT' : 'CHOOSE YOUR USERNAME'}
          </h1>
          <p className="text-pink-100 mt-2">
            {step === 1 ? 'Join the fandom today!' : 'This will be your unique ID.'}
          </p>
        </div>

        <div className="p-8">
          {/* Langkah 3: Bungkus semuanya dalam satu form */}
          <form action={signup}>
            {/* Kontainer luar untuk menyembunyikan overflow */}
            <div className="overflow-hidden">
              {/* Kontainer slider yang akan bergerak */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: step === 1 ? 'translateX(0%)' : 'translateX(-100%)' }}
              >
                {/* === LANGKAH 1: EMAIL & PASSWORD === */}
                <div className="w-full flex-shrink-0 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input id="name" name="name" type="text" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" placeholder="Your name"/>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" placeholder="your@email.com"/>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" name="password" type="password" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" placeholder="••••••••"/>
                  </div>
                  {/* Tombol ini sekarang hanya untuk pindah langkah, bukan submit */}
                  <button
                    type="button" // <-- Penting: ubah tipe menjadi "button"
                    onClick={() => setStep(2)} // <-- Pindahkan ke langkah 2
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Next Step
                  </button>
                </div>

                {/* === LANGKAH 2: USERNAME & PROFIL LAIN === */}
                <div className="w-full flex-shrink-0 space-y-4 pl-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input id="username" name="username" type="text" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" placeholder="your_unique_username"/>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea id="bio" name="bio" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" placeholder="Tell us about your favorite groups!"></textarea>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button" // <-- Tombol untuk kembali
                      onClick={() => setStep(1)} // <-- Kembali ke langkah 1
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    {/* Tombol ini yang akan men-submit seluruh form */}
                    <button
                      type="submit" // <-- Tipe "submit" untuk mengirim form
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform"
                    >
                      Finish Signup
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Google & Footer tetap sama */}
            <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div>
            </div>
            <div className="mt-6">
                <GoogleButton />
            </div>
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    Already have an account? <a href="/login" className="text-pink-600 hover:text-pink-500">Log in</a>
                </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
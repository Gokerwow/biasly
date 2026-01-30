import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, TrendingUp, Zap, Layers, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500 selection:text-white overflow-x-hidden">

      {/* --- 1. NAVBAR (Simple Version) --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className='h-15 w-15 relative'>
              <Image
              alt='logo'
              src='/assets/images/biaslyLogo.png'
              fill
              className='object-cover'
              />
            </div>
            <span className="text-xl font-black italic tracking-tighter">BIASLY</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-pink-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-purple-600/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-pink-400 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="h-3 w-3" />
              <span>The #1 Collection Tracker</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 max-w-4xl text-5xl font-black italic tracking-tighter sm:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              FLEX YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                ULTIMATE BIAS.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-10 max-w-xl text-lg text-gray-400 sm:text-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Manage your binders, track market prices, and showcase your K-Pop photocard collection like a pro.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link
                href="/dashboard"
                className="group flex h-12 items-center gap-2 rounded-full bg-pink-600 px-8 text-sm font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all hover:bg-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105"
              >
                Start Collecting
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/market"
                className="flex h-12 items-center gap-2 rounded-full border border-gray-700 bg-gray-900/50 px-8 text-sm font-bold text-gray-300 backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:border-white"
              >
                View Market
              </Link>
            </div>
          </div>

          {/* Hero Visual (The Floating Cards) */}
          <div className="relative mt-20 flex justify-center perspective-[2000px]">
            {/* The visual magic is in these transformations */}
            <div className="relative h-[400px] w-[300px] rotate-[-6deg] rounded-[2rem] border border-white/10 bg-gray-900 p-2 shadow-2xl transition-transform hover:rotate-0 hover:scale-110 hover:z-20 duration-500 sm:h-[500px] sm:w-[350px]">
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                <Image src="/assets/images/yeji-2.jpg" alt="Card" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="font-black text-2xl italic uppercase">Yeji</p>
                  <p className="text-pink-400 text-sm font-bold">Checkmate Era</p>
                </div>
              </div>
            </div>

            {/* Second Card (Overlapping) */}
            <div className="absolute left-1/2 top-10 h-[400px] w-[300px] -translate-x-1/2 rotate-[6deg] rounded-[2rem] border border-white/10 bg-gray-900 p-2 shadow-2xl transition-transform hover:rotate-0 hover:scale-110 hover:z-20 duration-500 sm:h-[500px] sm:w-[350px]">
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border-2 border-pink-500/50">
                <Image src="/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" alt="Card" fill className="object-cover" />

                {/* Holo Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-6 left-6">
                  <p className="font-black text-2xl italic uppercase">Yuna</p>
                  <p className="text-purple-400 text-sm font-bold">Sneakers Broadcast</p>
                </div>
              </div>

              {/* Floating Tag */}
              <div className="absolute -right-4 top-10 rotate-[12deg] rounded-xl bg-white px-4 py-2 font-black text-black shadow-lg">
                $450.00
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 3. BENTO GRID FEATURES --- */}
      <section className="bg-[#0B0E11] py-24">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter md:text-5xl">
              Built for <span className="text-pink-500">Stans</span>
            </h2>
            <p className="text-gray-400">Everything you need to complete your OT5 collection.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px]">

            {/* Box 1: Large Left (Portfolio) */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#161B22] border border-white/5 p-8 md:col-span-2 md:row-span-2 hover:border-pink-500/30 transition-colors">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-4 inline-flex rounded-lg bg-pink-500/10 p-3 text-pink-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Real-Time Valuation</h3>
                  <p className="text-gray-400 max-w-sm">Track the market value of your binder. See which cards are spiking in price and when to trade.</p>
                </div>
                {/* Visual Placeholder */}
                <div className="mt-8 h-64 w-full rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/5 p-4">
                  <div className="h-full w-full rounded-xl bg-[url('https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=3840&q=75')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Box 2: Top Right (Organization) */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#161B22] border border-white/5 p-8 hover:border-purple-500/30 transition-colors">
              <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3 text-purple-500">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Digital Binder</h3>
              <p className="mt-2 text-sm text-gray-400">Drag, drop, and organize your collection by Era, Version, or Color.</p>
            </div>

            {/* Box 3: Bottom Right (Community) */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#161B22] border border-white/5 p-8 hover:border-blue-500/30 transition-colors">
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3 text-blue-500">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Global Trading</h3>
              <p className="mt-2 text-sm text-gray-400">Find that missing card from collectors in Korea, Japan, and USA safely.</p>
            </div>

          </div>
        </div>
      </section>

      {/* --- 4. FOOTER CTA --- */}
      <section className="relative overflow-hidden py-24">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-pink-900/20"></div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-5xl font-black italic tracking-tighter text-white md:text-7xl">
            READY TO <br /> COMPLETE THE SET?
          </h2>
          <Link
            href="/signup"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-10 text-base font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-gray-200"
          >
            Join Biasly Free
            <Zap className="h-4 w-4 fill-black" />
          </Link>
          <p className="mt-6 text-sm text-gray-500">No credit card required. Start managing your collection today.</p>
        </div>
      </section>

    </div>
  )
}
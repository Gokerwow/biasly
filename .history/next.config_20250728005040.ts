import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kzcucrksqzdypkmlviex.supabase.co', // <-- Salin dari pesan error Anda
        port: '',
        pathname: '/storage/v1/object/public/**', // <-- Izinkan semua path di public storage
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Izinkan semua path dari host ini
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        pathname: '/kpop/images/**',
      },
    ],
  },
};

export default nextConfig;

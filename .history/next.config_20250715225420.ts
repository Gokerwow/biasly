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
    ],
  },
};

export default nextConfig;

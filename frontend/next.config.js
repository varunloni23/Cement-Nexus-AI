/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'export' output for Vercel deployment (enable SSR)
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cementai-backend.onrender.com',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://cementai-backend.onrender.com',
  }
}

module.exports = nextConfig
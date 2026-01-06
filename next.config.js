/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.bing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    // Pin root to this project to avoid parent lockfile inference
    root: path.resolve(__dirname),
  },
}

module.exports = nextConfig


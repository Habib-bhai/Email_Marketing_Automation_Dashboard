/** @type {import('next').NextConfig} */

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://**.unsplash.com https://**.cloudinary.com;
  font-src 'self' data:;
  connect-src 'self' https://vercel.live https://*.neon.tech wss://*.pusher.com;
  frame-src 'self' https://vercel.live;
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\n/g, '')

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig = {
  reactStrictMode: true,
  
  // Disable ESLint during build (we run it separately in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Don't bundle database packages (they have native dependencies)
  serverExternalPackages: [
    '@neondatabase/serverless',
    'drizzle-orm',
  ],
  
  // Enable gzip compression (enabled by default in production)
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  
  // Image optimization configuration
  images: {
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Domains for remote images (add as needed)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    
    // Minimize layout shift with blur placeholder
    minimumCacheTTL: 60,
    
    // Dangerously allow SVG (be cautious with user-uploaded content)
    dangerouslyAllowSVG: false,
  },
  
  // NOTE: `experimental.turbo` is not a supported key in this Next.js version.
  // Leaving it enabled breaks config validation and can cause confusing build behavior.
}

module.exports = withBundleAnalyzer(nextConfig)

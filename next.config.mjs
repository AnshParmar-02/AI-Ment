/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'randomuser.me',
            }
        ],
    },
    experimental: { 
        serverActions: {},
    },
    serverRuntimeConfig: {
    runtime: 'nodejs',
  },
};

export default nextConfig;

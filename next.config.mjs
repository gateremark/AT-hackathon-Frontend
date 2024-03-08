/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://vfd2wfkp-5000.uks1.devtunnels.ms/:path*",
            },
        ];
    },
};

export default nextConfig;

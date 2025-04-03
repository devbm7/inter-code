/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Increase serverless function timeout if needed
    serverRuntimeConfig: {
        // Will only be available on the server side
        timeoutSeconds: 15,
    },
}

export default nextConfig;
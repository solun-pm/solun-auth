/** @type {import("next").NextConfig} */
const nextConfig = {
    experimental: { appDir: true, serverComponentsExternalPackages: ["mongoose"], mdxRs: true, },
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/signup",
                permanent: true,
            },
        ];
    }
};

module.exports = nextConfig;
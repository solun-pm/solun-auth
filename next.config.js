/** @type {import("next").NextConfig} */
const nextConfig = {
    experimental: { serverComponentsExternalPackages: ["mongoose"], mdxRs: true, },
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/login",
                permanent: true,
            },
        ];
    }
};

module.exports = nextConfig;
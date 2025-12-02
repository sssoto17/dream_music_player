const nextConfig = {
  /* config options here */
  output: "standalone",
  cacheComponents: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.*",
        port: "",
        search: "",
      },
      {
        protocol: "http",
        hostname: "dmp_backend",
        port: "5000",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

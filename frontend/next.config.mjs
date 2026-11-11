/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mui-color-input'],
  basePath: process.env.BASEPATH,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/archiwise/**' // Opcional: define um padrão de caminho
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimizer = config.optimization.minimizer.map(plugin => {
        if (plugin.constructor.name === 'TerserPlugin') {
          return new plugin.constructor({
            ...plugin.options,
            exclude: /pdf\.worker\.min\./ // Ignorar a minificação deste arquivo
          })
        }

        return plugin
      })
    }

    return config
  }
}

export default nextConfig

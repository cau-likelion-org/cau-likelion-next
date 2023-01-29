/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.resolve = {
      alias: {
        '@common': path.resolve(__dirname, 'src/components/common'),
        '@home': path.resolve(__dirname, 'src/components/home'),
        '@gallery': path.resolve(__dirname, 'src/components/gallery'),
        '@project': path.resolve(__dirname, 'src/components/project'),
        '@session': path.resolve(__dirname, 'src/components/session'),
        '@attendance': path.resolve(__dirname, 'src/components/attendance'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@@types': path.resolve(__dirname, 'src/types'),
        '@image': path.resolve(__dirname, 'public/image'),
      },
      ...config.resolve,
    };

    config.module.rules.push({
      test: /\.mp4$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;

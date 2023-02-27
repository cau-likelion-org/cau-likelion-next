/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['cau-likelion.s3.ap-northeast-2.amazonaws.com'],
  },
  webpack(config) {
    config.resolve = {
      alias: {
        '@common': path.resolve(__dirname, 'src/components/common'),
        '@home': path.resolve(__dirname, 'src/components/home'),
        '@gallery': path.resolve(__dirname, 'src/components/gallery'),
        '@project': path.resolve(__dirname, 'src/components/project'),
        '@session': path.resolve(__dirname, 'src/components/session'),
        '@signup': path.resolve(__dirname, 'src/components/signup'),
        '@login': path.resolve(__dirname, 'src/components/login'),
        '@attendance': path.resolve(__dirname, 'src/components/attendance'),
        '@mypage': path.resolve(__dirname, 'src/components/mypage'),
        '@archiving': path.resolve(__dirname, 'src/components/archiving'),
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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_KEY}/api/:path*/`,
      },
      {
        source: '/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_KEY}/:path*/`,
      },
    ];
  },
};

module.exports = nextConfig;

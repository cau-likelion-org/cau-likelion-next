/** @type {import('next').NextConfig} */
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  // styled-components 변환. 예전엔 .babelrc의 babel-plugin-styled-components로 처리했는데,
  // 커스텀 babel 설정이 있으면 Next가 SWC를 통째로 끄기 때문에 SWC 내장 옵션으로 옮김
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 7776000,
    remotePatterns: [
      { protocol: 'https', hostname: 'cau-like-lion.s3.ap-northeast-2.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'chunghahaha.s3.ap-northeast-2.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'chunghaha-s3.s3.ap-northeast-2.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'd1sgygn8l0lfd5.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'dcpshnp4boilw.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'd1e39uzon1ymuo.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'likelion13bucket.s3.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'chunghaha-14th.s3.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'chunghaha-14th.s3.ap-northeast-2.amazonaws.com', pathname: '/**' },
    ],
  },
  async rewrites() {
    // 개발 모드 전용 API 프록시
    // 백엔드에 localhost용 CORS 설정이 없어서, 브라우저가 같은 출처(localhost:3000)로 요청
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }

    const target = process.env.API_PROXY_TARGET;
    if (!target) {
      return [];
    }

    return [{ source: '/api/:path*', destination: `${target}/api/:path*` }];
  },

  async headers() {
    // 개발 모드에서는 /_next/static 청크가 프로덕션처럼 콘텐츠 해시로 고정되지 않아,
    // immutable 캐시를 적용하면 브라우저가 재컴파일된 새 코드 대신 예전 청크를 계속 써버린다.
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  webpack(config, { webpack }) {
    // 성능 추적을 쓰지 않으므로 Sentry의 트레이싱 코드를 빌드에서 제거한다
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_TRACING__: false,
        __SENTRY_DEBUG__: false,
      }),
    );

    config.resolve = {
      alias: {
        '@common': path.resolve(__dirname, 'src/components/common'),
        '@home': path.resolve(__dirname, 'src/components/home'),
        '@about': path.resolve(__dirname, 'src/components/about'),
        '@gallery': path.resolve(__dirname, 'src/components/gallery'),
        '@blog': path.resolve(__dirname, 'src/components/blog'),
        '@project': path.resolve(__dirname, 'src/components/project'),
        '@signup': path.resolve(__dirname, 'src/components/signup'),
        '@login': path.resolve(__dirname, 'src/components/login'),
        '@mypage': path.resolve(__dirname, 'src/components/mypage'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@@types': path.resolve(__dirname, 'src/types'),
        '@image': path.resolve(__dirname, 'public/image'),
        '@assets': path.resolve(__dirname, 'src/assets'),
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
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // 토큰이 없으면 소스맵 업로드를 건너뛴다 (로컬·PR CI 빌드)
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  // Sentry 내부 디버그 로깅 코드를 빌드에서 제거해 번들을 줄인다
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
  // 소스맵은 업로드 후 삭제한다. 배포 산출물에 남으면 원본 코드가 공개된다.
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});

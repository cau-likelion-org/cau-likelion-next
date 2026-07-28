import type { StorybookConfig } from '@storybook/nextjs';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-mcp', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.plugins = [...(config.resolve.plugins ?? []), new TsconfigPathsPlugin()];

    const imageRule = config.module?.rules?.find(
      (rule) => rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg'),
    );
    if (imageRule && typeof imageRule === 'object') {
      imageRule.exclude = /\.svg$/i;
    }
    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // next/babel은 Next.js에 번들된 babel 전용이라 Storybook에서 로드가 깨져서 직접 지정
  babel: async (config) => ({
    ...config,
    presets: [
      ['@babel/preset-env', { targets: { esmodules: true } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
  }),
};

export default config;

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import storybookPlugin from 'eslint-plugin-storybook';

export default [
  {
    ignores: ['node_modules/**', '.next/**'],
  },
  ...nextCoreWebVitals,
  ...storybookPlugin.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)', '**/*.story.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];

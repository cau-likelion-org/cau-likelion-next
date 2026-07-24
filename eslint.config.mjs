import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

// eslint-plugin-storybook@0.6.15의 규칙들은 공용 헬퍼(getMetaObjectExpression)가
// ESLint 8 전용 context.getScope()를 써서 ESLint 9 flat config에서 전부 크래시남.
// Storybook v8 업그레이드(호환 플러그인 버전 포함) 전까지 비활성화.
export default [
  {
    ignores: ['node_modules/**', '.next/**'],
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)', '**/*.story.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];

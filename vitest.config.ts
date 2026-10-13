import path from 'node:path';
import ts from 'typescript';
import { defineConfig } from 'vitest/config';

const { paths } = ts.readConfigFile('tsconfig.json', ts.sys.readFile).config.compilerOptions as {
  paths: Record<string, string[]>;
};

const tsconfigAlias = Object.entries(paths).map(([key, [target]]) =>
  key.endsWith('/*')
    ? { find: new RegExp(`^${key.slice(0, -2)}/`), replacement: `${path.resolve(target.slice(0, -2))}/` }
    : { find: new RegExp(`^${key}$`), replacement: path.resolve(target) },
);

export default defineConfig({
  resolve: {
    alias: [...tsconfigAlias, { find: /^src\//, replacement: `${path.resolve('src')}/` }],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/{apis,hooks,lib,store,utils}/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', 'src/utils/constant/{breakpoint,color,typography}.ts'],
    },
  },
});

import { defineConfig } from 'vitest/config';
import { decoratorMetadataPlugin } from './vitest.shared.js';

export default defineConfig({
  plugins: [decoratorMetadataPlugin()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts', 'libs/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', '**/*.module.ts', '**/*.model.ts', 'libs/**'],
    },
  },
});

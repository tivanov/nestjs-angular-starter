import { defineConfig } from 'vitest/config';
import { decoratorMetadataPlugin } from './vitest.shared.js';

export default defineConfig({
  plugins: [decoratorMetadataPlugin()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    env: {
      NODE_ENV: 'test',
    },
  },
});

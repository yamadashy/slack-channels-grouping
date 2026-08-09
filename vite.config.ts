import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    watch: false,
  },
  define: {
    IS_PRODUCTION_BUILD: true,
  },
});

import { defineConfig } from 'repomix';

export default defineConfig({
  output: {
    filePath: 'repomix-output.txt',
    headerText: 'This project is a cross-browser extension written in TypeScript that groups Slack channels by prefix, with a structure including app/ for source code, tests/ for unit tests, and various configuration files for build and development processes.',
  },
  ignore: {
    useDefaultPatterns: true,
    customPatterns: [],
  },
});

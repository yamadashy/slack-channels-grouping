/** @type {import('repopack').RepopackConfig} */
const config = {
  output: {
    filePath: 'custom-output.txt',
    headerText: 'Wow!',
  },
  ignore: {
    useDefaultPatterns: true,
    customPatterns: ['additional-folder', '*.log'],
  },
};

export default config;

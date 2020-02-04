module.exports = {
  stories: ['../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  }
}

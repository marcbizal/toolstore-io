module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.[tj]sx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require('@babel/preset-typescript').default,
            require('@babel/preset-react').default,
          ],
        },
      },
      require.resolve('react-docgen-typescript-loader'),
    ],
  })

  config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx')

  return config
}

module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  // 开发环境显示报错位置 生产环境设置为false减少打包体积
  productionSourceMap: true,
  devServer: {
    host: 'localhost',
    port: '8082',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    https: false,
    hotOnly: false,
    proxy: {
      '/workflow': {
        target: 'http://192.168.210.76:9999/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/workflow/': '/workflow/'
        }
      },
      '/uaa/': {
        target: 'http://39.104.62.255',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/uaa/': '/uaa/',
        }
      }
    }
  }
}

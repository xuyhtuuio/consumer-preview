// eslint-disable-next-line
const path = require('path');
// eslint-disable-next-line
const resolve = (dir) => path.join(__dirname, dir);
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  lintOnSave: !isProduction,
  runtimeCompiler: true,
  outputDir: 'dist',
  // 开发环境显示报错位置 生产环境设置为false减少打包体积
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias
      // src定义成@
      .set('@', path.resolve('src'))
      // components定义成_c
      .set('_c', path.resolve('src/components'));
    config.resolve.extensions
      .add('.js')
      .add('.json')
      .add('.jsx');
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');

    // 支持vue template 可选链和空值合并
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line
        options.compiler = require('vue-template-babel-compiler');
        return options;
      });
  },
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
        },
      },
      '/cpr': {
        target: 'http://192.168.210.57:31602',
        // target: 'http://192.168.162.144:8324', // 吕强后台
        // target: 'http://10.8.0.57:8324', // 王意杨后台
        // target: 'http://10.8.1.148:8324', // 张延昭后台
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/cpr/': '/cpr/',
        }
      }
    }
  }
}

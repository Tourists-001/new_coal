const { defineConfig } = require('@vue/cli-service')
// 绝对路径
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

// const Components = require('unplugin-vue-components/webpack')
// const { VarletUIResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  transpileDependencies: true,
  // // 自动导入 varlet组件
  // configureWebpack: {
  //   plugins: [
  //     Components({
  //       resolvers: [
  //         VarletUIResolver({
  //           version: 'vue2'
  //         })
  //       ],
  //       directives: true
  //     })
  //   ]
  // },
  // 配置svg-sprite-loader
  chainWebpack(config) {
    // console.log(config)
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 8080,
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
})


module.exports = {
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules\/(?!(@gw)$\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: {
              browsers: [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version'
              ]
            }
          }], '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining']
        }
      }
    }, {
      test: /\.s[ac]ss$/i,
      use: [{
        loader: 'style-loader' // 将 JS 字符串生成为 style 节点
      }, {
        loader: 'css-loader' //  将 CSS 转化成 CommonJS 模块
      }, {
        loader: 'sass-loader' // 将 Sass 编译成 CSS
      }]
    }, {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader' // creates style nodes from JS strings
        },
        {
          loader: 'css-loader' // translates CSS into CommonJS
        },
        {
          loader: 'less-loader' // compiles Less to CSS
        }
      ]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|jpg|gif)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 3145728
        }
      }]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 3145728
          // 暂时不使用mini-datauri  在110的一些组件测试过程中发现 使用这个功能 svg不能显示
          // generator: (content) => svgToMiniDataURI(content.toString())
        }
      }]
    }]
  },
  plugins: []
}

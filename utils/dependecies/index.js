module.exports = {
  externals: [
    {
      module: 'react',
      root: 'React',
      dist: 'react/umd/react.production.min.js'
    },
    {
      module: 'react-dom',
      root: 'ReactDOM',
      dist: 'react-dom/umd/react-dom.production.min.js'
    },
    {
      module: 'vue',
      root: 'Vue',
      dist: 'vue/dist/vue.min.js'
    },
    {
      module: 'echarts',
      root: 'echarts',
      dist: 'echarts/dist/echarts.min.js'
    },
    {
      module: 'echarts-gl',
      root: 'echarts-gl',
      dependencies: ['echarts'],
      dist: 'echarts-gl/dist/echarts-gl.min.js'
    },
    {
      module: 'highcharts',
      root: 'Highcharts',
      dist: 'highcharts/highcharts.js'
    },
    {
      module: 'highcharts/highcharts-more',
      dependencies: ['highcharts'],
      dist: 'highcharts/highcharts-more.js'
    },
    {
      module: 'highcharts/highcharts-3d',
      dependencies: ['highcharts'],
      dist: 'highcharts/highcharts-3d.js'
    },
    {
      module: 'highcharts/modules/funnel3d',
      dependencies: ['highcharts'],
      dist: 'highcharts/modules/funnel3d.js'
    },
    {
      module: 'highcharts/modules/cylinder',
      dependencies: ['highcharts'],
      dist: 'highcharts/modules/cylinder.js'
    },
    {
      module: 'highcharts/modules/treemap',
      dependencies: ['highcharts'],
      dist: 'highcharts/modules/treemap.js'
    },
    {
      module: 'bizcharts',
      root: 'BizCharts',
      dist: 'bizcharts/umd/BizCharts.min.js'
    },
    {
      module: 'react-highcharts',
      dependencies: ['highcharts'],
      root: 'ReactHighcharts',
      dist: 'react-highcharts/ReactHighcharts.js'
    },
    {
      module: 'snapsvg',
      root: 'Snap',
      dist: 'snapsvg/dist/snap.svg-min.js'
    },
    {
      module: '@antv/data-set',
      root: 'DataSet',
      dist: '@antv/data-set/dist/data-set.js'
    },
    {
      module: '@ant-design/icons',
      root: 'icons',
      dependencies: ['antd'],
      dist: '@ant-design/icons/dist/index.umd.min.js'
    },
    {
      module: 'moment',
      root: 'moment',
      dist: 'moment/min/moment.min.js'
    },
    {
      module: 'antd/dist/antd.css',
      root: 'antd_css'
    },
    {
      module: 'antd/dist/antd-with-locales',
      root: 'antd'
    },
    {
      module: 'antd',
      root: 'antd',
      dependencies: ['react', 'moment'],
      dist: 'antd/dist/antd-with-locales.min.js',
      style: 'antd/dist/antd.css'
    },
    {
      module: 'lodash',
      root: '_',
      dist: 'lodash/lodash.min.js'
    }
  ]
}

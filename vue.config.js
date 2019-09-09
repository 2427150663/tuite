module.exports = {
    publicPath: './',
    productionSourceMap: false,
    assetsDir:'static',
    configureWebpack:{
        externals: {
            'vue': 'Vue',       
            'element-ui': 'ElementUI',   
            'echarts': 'Echarts'
           },
    },    
    devServer: {
        // 配置跨域
        proxy: {
            '/api':{
                target:'http://jwp.yuqing.pro:89',
                // secure: false,
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            },
        }
    },
    
}
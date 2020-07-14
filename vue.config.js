module.exports = {
    filenameHashing: true,
    publicPath: '',    
    chainWebpack: config => {
    },
    devServer: {
        /*proxy: {
            '/admin': {
                target: 'https://dev.goodt.org',
                //pathRewrite: { '^/extensions': '' }
            }
        },*/
        watchOptions: {
            poll: true
        } 
    },
};
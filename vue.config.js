module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Transcript Analyzer'
                return args
            })
    },
    devServer: {
        proxy: 'http://localhost:3000',
    },
}
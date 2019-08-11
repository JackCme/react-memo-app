var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: [
        '@babel/polyfill',
        './src/client/index.js',
    ],

    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            //react 클래스에서 state 를 this로 사욛하려면 바벨의 해당 플러그인 필요함.
                            //https://github.com/babel/babel/issues/8655#issuecomment-419808044
                            plugins: ['@babel/plugin-proposal-class-properties'],
                        }
                    },
                ],
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ],

    optimization: {
        minimize: true
    }
}
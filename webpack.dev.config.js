var webpack = require('webpack')
var path = require('path')

module.exports = {
    /**
    |--------------------------------------------------
    | - webpack-dev-server를 콘솔이 아닌 자바스크립트로 실행 할 땐,
    | HotReloadingModule 를 사용하기 위해선 webpack-dev-server의 client와
    | webpack의 hot 모듈을 따로 entry 에 넣어주어야 합니다
    |--------------------------------------------------
    */
    entry: [
        '@babel/polyfill',
        'react-hot-loader/patch', 
        'webpack-dev-server/client?http://localhost:4000',
        'webpack/hot/dev-server',
        './src/client/index.js',
    ],

    mode: 'development',

    output: {
        path: '/', // public 이 아니고 /, 이렇게 하면 파일을 메모리에 저장하고 사용합니다
        filename: 'bundle.js'
    },

    devServer: {
        hot: true,
        inline: true,
        filename: 'bundle.js',
        publicPath: '/',
        historyApiFallback: true,
        contentBase: './public',
        /* 모든 요청을 프록시로 돌려서 express의 응답을 받아오며,
        bundle 파일의 경우엔 우선권을 가져서 devserver 의 스크립트를 사용하게 됩니다 */
        proxy: {
            '**': 'http://localhost:3000'
        },
        stats: {
            // Config for minimal console.log mess.
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],

    //바벨 코어가 7.x 버전부터는 웹팩에서 불러오는 형식이 달라졌음.
    //https://poiemaweb.com/es6-babel-webpack-2
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname),
                exclude: /node_modules/,
                use: [
                    //react-hot-loader의 웹팩 로더는 바벨보다 위에 있어야함.
                    //https://gaearon.github.io/react-hot-loader/getstarted/#step-2-of-3-using-hmr-to-replace-the-root-component
                    { loader: 'react-hot-loader/webpack' },
                    { loader: 'babel-loader',
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
}
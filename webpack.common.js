const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('babel-polyfill');
require('whatwg-fetch');

module.exports = {
    entry: {
        index: ['babel-polyfill', 'whatwg-fetch', './index.js']
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    // filename: 'vendor.js',
                    chunks: 'all',
                    minSize: 10000
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.NamedModulesPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            JSZip: 'jszip'
        }),
        new CopyWebpackPlugin([{ from: 'static' }]),
        new HtmlWebpackPlugin({
            'title': 'Carson City Airport',
          //  'filename': '../Index.html',
            //'favicon': 'favicon.ico',
            'meta': { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no', 'Access-Control-Allow-Origin': '*' }
        }),
        new webpack.DefinePlugin({
            //'WebAPI': JSON.stringify('https://development.delasoft.com:7443/GCN_API/api'),
            'WebAPI': JSON.stringify('../CARSON_API/api'),
            //'WebAPI': JSON.stringify('../REVJET_API/api'),
            //'WebAPI': JSON.stringify('http://192.168.1.51/CARSON_API/api'),
            'NotifyAPI': JSON.stringify('../GCN_Notify/subscribe'),
            'PaymentUI': JSON.stringify('../GCN_UI/payment'),
            'WebUI': JSON.stringify('./dist'),
            'MaterialIcons': JSON.stringify('https://fonts.googleapis.com/icon?family=Material+Icons')
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-env"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-syntax-dynamic-import"
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    'file-loader'
                ]
            }, {
                test: /\.(jpe?g|png|gif|ico)$/i,
                use: {
                    loader: 'file-loader?name=[name].[ext]?'
                }
            },
        ]
    },
    output: {
        filename: '[name].[chunkhash].js',
        //path: path.resolve(__dirname, '/')
      //  path: path.resolve(__dirname, 'dist'),
       // publicPath: './dist/'
    },
};
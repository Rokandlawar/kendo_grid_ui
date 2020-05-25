const merge = require('webpack-merge');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//const MinifyPlugin = require("babel-minify-webpack-plugin");
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'WebAPI': JSON.stringify('../webapi/api'),
        }),
        //new MinifyPlugin(),
        //new UglifyJSPlugin(),
        //new ClosureCompilerPlugin(),
        new webpack.DefinePlugin({
            //  'WebAPI': JSON.stringify('https://development.delasoft.com/GCN_API/api'),
            'WebAPI': JSON.stringify('./CARSON_API/api'),
            'process.env.NODE_ENV': JSON.stringify('production'),
            //'WebAPI': JSON.stringify('./REVJET_API/api'),
            'NotifyAPI': JSON.stringify('https://development.delasoft.com/GCN_Notify/subscribe'),
            'PaymentUI': JSON.stringify('https://development.delasoft.com/WebUI/payment'),
            'MaterialIcons': JSON.stringify('https://fonts.googleapis.com/icon?family=Material+Icons')
        })
    ]
});
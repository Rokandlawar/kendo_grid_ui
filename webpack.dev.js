const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new CleanObsoleteChunks(),
        new CleanWebpackPlugin(['dist']),
        //new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'WebAPI': JSON.stringify('./CARSON_API/api')
        })
    ]
});
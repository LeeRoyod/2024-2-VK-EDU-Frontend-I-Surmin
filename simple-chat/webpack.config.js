'use strict';

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');

module.exports = {
    context: SRC_PATH,
    entry: {
        index: './index.js',
        chats: './chats.js',
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].bundle.js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: SRC_PATH,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: '[name].css',
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['index'],
        }),
        new HTMLWebpackPlugin({
            filename: 'chats.html',
            template: './chats.html',
            chunks: ['chats'],
        }),
    ],
    devServer: {
        static: BUILD_PATH,
        port: 8080,
        hot: true,
    },
};

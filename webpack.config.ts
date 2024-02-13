/* eslint-env node */

import { ConsoleRemotePlugin } from "@openshift-console/dynamic-plugin-sdk-webpack";
import * as path from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const CopyPlugin = require('copy-webpack-plugin');

const config: Configuration = {
  mode: "development",
  // No regular entry points. The remote container entry is handled by ConsoleRemotePlugin.
  entry: {},
  context: path.resolve(__dirname, "src"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    chunkFilename: "[name]-chunk.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules\/(?!(@patternfly|@console\/plugin-shared)\/).*/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './node_modules/monaco-editor'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  devServer: {
    static: './dist',
    port: 9001,
    // Allow bridge running in a container to connect to the plugin dev server.
    allowedHosts: 'all',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization",
      "Cache-Control": "no-store",
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new ConsoleRemotePlugin(),
    new CopyPlugin({
      patterns: [{ from: '../locales', to: '../dist/locales' }],
    }),
  ],
  devtool: "source-map",
  optimization: {
    chunkIds: "named",
    minimize: false,
  },
};

if (process.env.NODE_ENV === "production") {
  config.mode = "production";
  if (config.output) {
    config.output.filename = "[name]-bundle-[hash].min.js";
    config.output.chunkFilename = "[name]-chunk-[chunkhash].min.js";
  }
  if (config.optimization) {
    config.optimization.chunkIds = "deterministic";
    config.optimization.minimize = true;
  }
}

export default config;
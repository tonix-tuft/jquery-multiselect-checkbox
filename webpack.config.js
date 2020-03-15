const webpack = require("webpack");
const libraryName = "jquery-multiselect-checkbox";
let outputFile;
const library = "jQueryMultiselectCheckbox";
const srcEntryPoint = "index.js";
const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const env = process.env.WEBPACK_ENV;

if (env === "build") {
  outputFile = libraryName + ".min.js";
} else {
  outputFile = libraryName + ".js";
}

var config = {
  entry: __dirname + "/src/" + srcEntryPoint,
  externals: {
    jquery: "jQuery"
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: outputFile,
    library: library,
    libraryTarget: "umd",
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    umdNamedDefine: true,
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: [
          /(node_modules|bower_components)/,
          /\bcore-js\b/,
          /\bwebpack\/buildin\b/
        ],
        loader: "babel-loader",
        options: {
          babelrc: false,
          sourceType: "unambiguous",
          presets: [
            [
              "@babel/preset-env",
              {
                // Webpack supports ES Modules out of the box and therefore doesn’t require
                // import/export to be transpiled resulting in smaller builds, and better tree
                // shaking. See https://webpack.js.org/guides/tree-shaking/#conclusion
                modules: false,
                // Adds specific imports for polyfills when they are used in each file.
                // Take advantage of the fact that a bundler will load the polyfill only once.
                useBuiltIns: "usage",
                corejs: {
                  version: "3",
                  proposals: true
                }
              }
            ]
          ]
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  }
};

if (env === "build") {
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  };
  config.mode = "production";
  config.devtool = false;
} else {
  config.mode = "development";
}

module.exports = config;

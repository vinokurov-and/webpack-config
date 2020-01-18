const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const srcDir = "src";
const filenameOutput = "[name].[hash]";

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (isProd)
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin()
    ];

  return config;
};

module.exports = {
  context: path.resolve(__dirname, srcDir),
  mode: "development",
  entry: {
    main: "./index.js"
  },
  output: {
    filename: `${filenameOutput}.js`,
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.resolve(__dirname, srcDir),
      assets: path.resolve(__dirname, srcDir, "assets"),
      styles: path.resolve(__dirname, srcDir, "styles")
    }
  },
  optimization: optimization(),
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new FaviconsWebpackPlugin(
      path.resolve(__dirname, srcDir, "assets", "favicon.png")
    ),
    new MiniCssExtractPlugin({
      filename: `${filenameOutput}.css`
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|webp|bmp)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"]
      }
    ]
  }
};

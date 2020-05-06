const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageJson = require('./package.json');

const setupWebpackConfig = (env) => {

  const PATHS = {
    root: path.resolve(__dirname),
    src: path.join(__dirname, 'src'),
    public: path.join(__dirname, 'public')
  };

  process.env.BABEL_ENV = env.NODE_ENV;

  const envFile = require(path.join(__dirname, 'env', `${env.NODE_ENV}.json`));

  const globalVars = {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    '__APP_VERSION__': JSON.stringify(packageJson.version),
    '__APP_BASE_URL__': JSON.stringify(envFile.baseUrl),
  };


  let common = {
    mode: env.NODE_ENV,
    devtool: 'eval-source-map',
    entry: {
      'app': `${PATHS.src}/js/app.js`
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    output: {
      path: PATHS.root,
      publicPath: '',
      filename: 'public/[name].js',
    },
    module: {
      rules: [
        {
          test: require.resolve('react'),
          use: {
            loader: 'expose-loader',
            options: 'React'
          }
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                url: (url) => url.startsWith('img/')
              }
            },
            {
              loader: 'resolve-url-loader',
              options: {

              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: 'postcss.config.js'
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // url: (url) => url.startsWith('img/')
              }
            }
          ]
          // exclude: /node_modules/,
          // include: PATHS.src,
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: PATHS.src,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'fonts',
            name: '[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new CopyPlugin([
        {
          from: `${PATHS.src}/img`,
          to: `${PATHS.public}/img`
        }
      ]),
      new MiniCssExtractPlugin({
        filename: 'public/[name].css'
      }),
      new HtmlWebpackPlugin({
        template: `${PATHS.src}/index.ejs`,
        templateParameters: {}
      }),
      new webpack.DefinePlugin({
        ...globalVars
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      alias: {
        src: PATHS.src
      }
    }
  };

  if (env.NODE_ENV !== 'development') {
    common.plugins = [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['public/**/*', '!.gitkeep']
      }),
      ...common.plugins
    ];
  }

  if (env.NODE_ENV === 'development') {
    common = merge(common, {
      devServer: {
        contentBase: PATHS.public,

        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',

        // Parse host and port from env so this is easy to customize.
        host: env.HOST,
        port: env.PORT,
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
      ],
    });
  } else {
    // config can be added here for minifying / etc

  }

  return merge(common, {});

};

module.exports = () => setupWebpackConfig(process.env);

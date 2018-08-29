const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const PATHS = {
  'serve': path.resolve(__dirname, 'app'),
  'build': path.resolve(__dirname, 'dist'),
};

const common = {
  mode: 'development',
  entry: `${PATHS.serve}/index.js`,
  output: {
    path: PATHS.build,
    filename: 'script.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?name=image/[name].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    })
  ]
};

const css = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  }
};

const babel = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

const uglify = {
  optimization: {
    minimize: true
  }
};

const eslint = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js/,
        exclude: [
          'node_modules'
        ],
        loader: 'eslint-loader',
        options: {
          failOnError: true
        }
      }
    ]
  }
};

const autoprefixer = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          'sass-loader'
        ]        
      }
    ]
}
}

const githubPages = {
  output: {
    publicPath: '/pubNubChat/'
  }
};

module.exports = function(env) {
  if (env === "development") {
    return merge([common, css]);
  };
  if (env === "production") {
    return merge([common, autoprefixer, eslint, babel, uglify])
  };
  if (env === 'production:git') {
    return merge([common, autoprefixer, eslint, babel, uglify, githubPages]);
  };
};

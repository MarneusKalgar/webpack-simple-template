const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

// generate HtmlWebpackPlugin for each pug template file
function generateHtmlPlugs(tplDir) {
	const tplFiles = fs.readdirSync(path.resolve(__dirname, tplDir));
	return tplFiles.map(item => {
		const parts = item.split('.');
		const name = parts[0];
		const ext = parts[1];
		return new HtmlWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${tplDir}/${name}.${ext}`)
		});
	});
}

const htmlPlugs = generateHtmlPlugs('./src/pug/output');

module.exports = {
  devtool: 'source-map',
	entry: {
    vendor: ['jquery'],
		app: [
			'./src/sass/app.scss',
			'./src/js/app.js'
		]
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'build')
	},
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		publicPath: 'http://localhost:9000/build/',
		host: '0.0.0.0',
		port: 9000,
		watchContentBase: true,
		overlay: {
			warnings: true,
			errors: true
		},
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
        use : {
          loader: 'eslint-loader',
          options: {
            failOnError: false
          }
        }
			},
			{
				test: /\.js$/,
        exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(sass|scss)$/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader',
							options: {
								precision: 8
							}
						}
					],
					fallback: 'style-loader'
				})
			},
			{
				test: /\.pug$/,
				loaders: [
					{
						loader: 'raw-loader'	
					},
					{
						loader:  'pug-html-loader',
						options: {
							pretty: true
						}
					}
				]
			}
		]
	},
	optimization: {
    splitChunks: {
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'сss/app.css'
		}),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
    })
  ]
	.concat(htmlPlugs)
};
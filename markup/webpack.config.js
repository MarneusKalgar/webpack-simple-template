const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: './src/js/app/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	devServer: {
	  publicPath: '/build/',
	  historyApiFallback: true
	},
	module: {
		rules: [
		    {
		    	test: /\.scss$/,
            	use: ['style-loader', 'css-loader', 'sass-loader']
		    },
		    {
		    	test: /\.css$/,
		    	use: ExtractTextPlugin.extract({
		    		fallback: 'style-loader',
		    		use: 'css-loader'
		    	})
		    }
		]
	},
	plugins: [
	    new ExtractTextPlugin('app.css'),
	]
};
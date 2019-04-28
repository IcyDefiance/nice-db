import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { resolve } from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";

const config: Configuration = {
	entry: "./src/index.tsx",
	devtool: "inline-source-map",
	target: "node",
	node: {
		__dirname: false,
		__filename: false,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				use: [
					// fallback to style-loader in development
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.node$/,
				use: "node-loader",
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new TsconfigPathsPlugin()],
	},
	output: {
		filename: "bundle.js",
		path: resolve(__dirname, "dist"),
	},
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
};

export default config;

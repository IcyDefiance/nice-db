import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { resolve } from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";

const config: Configuration = {
	entry: "./src/index.tsx",
	target: "node",
	node: { __dirname: false, __filename: false },
	module: {
		rules: [
			{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
			{ test: /\.scss$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] },
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
			{ test: /\.node$/, use: "node-loader" },
			{ test: /\.(woff|woff2)$/, use: { loader: "file-loader", options: { name: "fonts/[name].[ext]" } } },
		],
	},
	plugins: [new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" })],
	resolve: { extensions: [".tsx", ".ts", ".js"], plugins: [new TsconfigPathsPlugin()] },
	output: { filename: "bundle.js", path: resolve(__dirname, "dist") },
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
};

export default config;

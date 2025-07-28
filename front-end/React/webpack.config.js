const path = require("path")
const { Template } = require("webpack")

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public"),
        clean: true
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },

    plugins: [new HtmlWebpackPlugin ({
            template: path.resolve(__dirname, "utils/index.html")
        })
    ]
}
import path from "path";

const webpackConfig = {
    mode: "none",
    entry: {
        main: path.resolve( "./src/js/main.js"),
    },
    output: {
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ],
            },
        ], 
    },
    devtool: "eval-source-map",
};

export { webpackConfig };
// module.exports = function override(config, env) {
//     if (!config.plugins) {
//         config.plugins = [];
//     }

//     config.module.rules = config.module.rules.map(rule => {
//         if (rule.oneOf instanceof Array) {
//             return {
//                 ...rule,
//                 // create-react-app let every file which doesn't match to any filename test falls back to file-loader,
//                 // so we need to add purs-loader before that fallback.
//                 // see: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.dev.js#L220-L236
//                 oneOf: [
//                     {
//                         test: /\.purs$/,
//                         loader: "purs-loader",
//                         exclude: /node_modules/
//                     },
//                     {
//                         test: /\.js$/,
//                         exclude: /node_modules/,
//                         use: "babel-loader"
//                     },
//                     {
//                         test: /\.(png|svg|jpg|gif)$/,
//                         use: ["file-loader"]
//                     },
//                     {
//                         test: /\.(woff|woff2|eot|ttf|otf)$/,
//                         use: ["file-loader"]
//                     }
//                 ]
//             };
//         }

//         return rule;
//     });

//     return config;
// };

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.module.rules.push({
        test: /\.(png|jpg|mp4)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ]
    })
    return config;
  }
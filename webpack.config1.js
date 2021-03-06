const webpack = require('webpack');
const path = require("path");
// definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
// let definePlugin = new webpack.DefinePlugin({
//   __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
//   __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
// });

//js压缩插件
let UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false,
        dead_code: true,
        // drop_debugger: false,//默认是ture
        // drop_console: true //默认是false
        global_defs: {
            DEBUG: true
        }
    },
    comments: false,
    outSourceMap: "[name].js.map",
    sourceRoot: "sourcemap/"
})

//将公用模块提取，避免合成一个文件过大，移动端加载太慢
let commonsPlugin = new webpack.optimize.CommonsChunkPlugin({name:['jquery'],minChunks: Infinity});

//sourcemap插件，加上方便开发，但是编译起来真是慢啊！！！！！！！也可以在uglifyjs中定义，好像会快一点，难道是心理作用？
let SourceMapDevToolPlugin = new webpack.SourceMapDevToolPlugin({
                                filename: 'sourcemap/[name].js.map',
                            });


let indexHtml = path.join(__dirname, "dev", "index.html");
// console.log();
module.exports = {
    //插件项
    // plugins: [commonsPlugin,UglifyJsPlugin,SourceMapDevToolPlugin],
    plugins: [commonsPlugin,UglifyJsPlugin],
    //页面入口文件配置
    entry: {
        index : './dev/src/js/entry.js',
        // home : './dev/index.html',
        jquery: ['jquery']
    },
    entry:[
        indexHtml,
    ],
    //入口文件输出配置
    output: {
        path: './build',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            { test: /\.jpg$/, loader: "file-loader" },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            // { test: /\.html$/, name: "mandrillTemplates", loader: 'raw!html-minify'}
            {
                test: indexHtml,
                loaders: [
                    "file?name=[name].[ext]",
                    "extract",
                    "html?" + JSON.stringify({
                        attrs: ["img:src", "link:href"]
                    })
                ]
            }
        ]
    },
    // 'html-minify-loader': {
    //     empty: true,        // KEEP empty attributes
    //     cdata: true,        // KEEP CDATA from scripts
    //     comments: true,     // KEEP comments
    //     dom: {                            // options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
    //         lowerCaseAttributeNames: false,      // do not call .toLowerCase for each attribute name (Angular2 use camelCase attributes)
    //     }
    // },
    //其它解决方案配置
    resolve: {
        //配置查找模块的路径和扩展名和别名（方便书写）
        // root: 'E:/github/flux-example/src', //绝对路径
        //这样就可以写 require('file') 代替 require('file.js')
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            AppStore : 'js/stores/AppStores.js',
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
    }
};
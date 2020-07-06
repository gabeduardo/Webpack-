const path = require("path");

// plugin para separar los css en archivos diferentes
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// plugin necesario para minificar el CSS, ya que con el mode : production solo se minficaria el html
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// TerserJSplugin ya viene instalado en webpack por defecto, pero al tocar lo opción de optimization
// debe especificarse explícitamente que este plugin será usado para minificar el JS
const TerserJSPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: "production",
  devtool: "cheap-module-eval-source-map",

  watch: true,
  entry: "./src/index.js",
  output: {
    //esto crea el archivo en la carpeta dist por la webpack zero conf
    // filename: "main.js",

    //because the default output folder is dist, I tell webpack to go gone folder up
    //esta forma es valida
    //filename: "../build/application.js",
    //pero para separar el folder del name puedo hacer uso de path
    // como el path debe ser absolute hago uso del modulo de node llamado path
    // para no hardcodear la ruta
    filename: "application.js",
    path: path.resolve(__dirname, "build"),
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        //   style para aplicarlo al htmll y el css- loader para cargar el css
        // style inyecta el css en le html
        // primero se aplica de derecha a izquierda
        test: /\.css$/i,
        use: [
          // "style-loader",
          // coloco el plugin para injectarlos en archivos separados
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")({
                  overrideBrowserslist: ["last 3 versions", "ie >9"],
                }),
              ],
            },
          },
          "sass-loader",
        ],
      },
      {
        //loader for handling scss. sass-loader is called first which in turn calls node-sass
        test: /\.scss$/i,
        use: [
          // style loader injecta los estilos en el html
          //"style-loader",
          // coloco el plugin para injectarlos en archivos separados
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")({
                  overrideBrowserslist: ["last 3 versions", "ie >9"],
                }),
              ],
            },
          },
          "sass-loader",
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "application.css",
    }),
  ],
};

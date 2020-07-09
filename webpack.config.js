const path = require("path");

// plugin para separar los css en archivos diferentes
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//plugin para limpiar archivos cache
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

//plugin para cargar mi template html y así poder generar el html con los hash automáticamente
const HtmlWebpackPlugin = require("html-webpack-plugin");

// plugin necesario para minificar el CSS, ya que con el mode : production solo se minficaria el html
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// TerserJSplugin ya viene instalado en webpack por defecto, pero al tocar lo opción de optimization
// debe especificarse explícitamente que este plugin será usado para minificar el JS
const TerserJSPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: "production",
  devtool: "cheap-module-eval-source-map",

  watch: true,

  //especificando dos archivos como entry para el config de webpack
  entry: {
    application: "./src/index.js",
    admin: "./src/admin.js",
  },

  output: {
    //esto crea el archivo en la carpeta dist por la webpack zero conf
    // filename: "main.js",

    //because the default output folder is dist, I tell webpack to go gone folder up
    //esta forma es valida
    //filename: "../build/application.js",
    //pero para separar el folder del name puedo hacer uso de path
    // como el path debe ser absolute hago uso del modulo de node llamado path
    // para no hardcodear la ruta
    // filename: "application.js",

    // para utilizar los nombre especificados como entry, de manera tal que sean
    // tomados como output debo utilizar el placeholder [name]
    filename: "[name]-[contenthash].js",
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
      // configuracion para manejar imagenes
      {
        // agregado manejo de fuentes file extensions like woff2, eot, ttf etc,
        // that it's possible to load with the file-loader,
        // but you can basically add any other type of file, loaders are here for that purpose
        test: /(png|jpg|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[name].[hash:7].[ext]",
            },
          },
          //loader para comprimir las imágenes
          { loader: "image-webpack-loader" },
        ],
      },
    ],
  },

  plugins: [
    // plugin para cargar el template html que creé
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      // placeholder para que se generen tambien varios css
      filename: "[name]-[contenthash].css",
    }),
  ],
};

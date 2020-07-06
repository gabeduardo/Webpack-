const path = require("path");
module.exports = {
  mode: "development",
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
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

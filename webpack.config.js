const path = require("node:path");

module.exports = {
  entry: {
    firebase: "./src/firebase/firebase.js",
    "real-time-database": "./src/firebase/real-time-database.js",
    authentication: "./src/firebase/authentication.js",
    storage: "./src/firebase/storage.js",
  },
  mode: "development",
  watch: true,
  devtool: "eval-source-map",
  output: {
    path: path.resolve(__dirname, "./src/dist"),
    filename: "[name].bundle.js",
  },
};

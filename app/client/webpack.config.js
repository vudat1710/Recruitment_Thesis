const path = require('path') // lấy đường dẫn tuyệt đối của thư mục

const config = {
  entry: './src/App.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: './src/assets/fonts',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: './src/assets/img',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: './src/assets/img',
      },
    ],
  },
  
}
module.exports = config;
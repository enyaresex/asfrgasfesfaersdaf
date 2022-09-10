const path = require('path');

module.exports = {
  plugins: {
    'postcss-nested': {},
    'postcss-safe-area': {},
    'postcss-custom-media': {
      importFrom: path.join(__dirname, 'style.css'),
    },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
};

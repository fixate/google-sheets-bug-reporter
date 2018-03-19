module.exports = {
  common: {
    data: {
      siteName: 'Your Site',
    },
  },

  dev: {
    data: {
      basePath: '',
      googleSheetsUrl: `https://script.google.com/macros/s/${process.env.GOOGLE_SHEETS_ID_DEV}/dev`,
    },
  },

  dist: {
    data: {
      basePath: '',
      googleSheetsUrl: `https://script.google.com/macros/s/${
        process.env.GOOGLE_SHEETS_ID_PROD
      }/exec`,
    },
  },
};

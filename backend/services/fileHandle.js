const fs = require('fs');

const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

module.exports = { createDirectory };

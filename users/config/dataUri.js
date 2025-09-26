const DatauriParser = require("datauri/parser");
const path = require("path");

const parser = new DatauriParser();

const getDataUri = (file) => {
  return parser.format(
    path.extname(file.originalname).toString(),
    file.buffer
  );
};

module.exports = getDataUri;

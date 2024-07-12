const slug = require("slug");

const generateSlug = (text) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const urlSlug = slug(`${text}-${randomNumber}`, { lower: true });

  return urlSlug;
};

module.exports = generateSlug;

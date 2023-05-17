const bcrypt = require("bcrypt");

const encrypt = async (textPlain) => {
  return await bcrypt.hash(textPlain, 10);
};
const compare = async (textPlain, textEncrypted) => {
  return await bcrypt.compare(textPlain, textEncrypted);
};

module.exports = {
  encrypt,
  compare,
};

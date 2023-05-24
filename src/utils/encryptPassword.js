import bcrypt from 'bcrypt';

export const encrypt = async (textPlain) => {
  return await bcrypt.hash(textPlain, 10);
};

export const compare = async (textPlain, textEncrypted) => {
  return await bcrypt.compare(textPlain, textEncrypted);
};

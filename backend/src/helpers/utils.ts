/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcrypt');

export const comparePassword = async (
    plainPassword: string,
  hashPassword: string,
) => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.log(error);
  }
};

const encryptpwd = require("encrypt-with-password");

const encrypt = (text, pwd) => {
  const encrypted = encryptpwd.encrypt(text, pwd);
  return Buffer.from(encrypted, "utf-8").toString("base64");
};

const decrypt = (base64, pwd) => {
  const encrypted = Buffer.from(base64, "base64").toString("utf-8");
  return encryptpwd.decrypt(encrypted, pwd);
};

module.exports = { encrypt, decrypt };

const { contextBridge, ipcRenderer, clipboard } = require("electron");
const { Op } = require("sequelize");

const fs = require("fs");

const { encrypt, decrypt } = require("./crypto/Crypto");

const bcrypt = require("bcrypt");

const Key = require("./model/Key");
const Person = require("./model/Person");
const Session = require("./model/Session");

Person.hasMany(Key, { onDelete: "CASCADE" });
Key.belongsTo(Person);

const onCreateKey = async (key, success, error) => {
  try {
    const session = await Session.findOne({ where: { isActive: true } });

    const personDb = await Person.findByPk(session.dataValues.userId);

    const pwdEncrypted = encrypt(key.password, personDb.password);

    key.password = pwdEncrypted;

    const newKey = await Key.create({ ...key });

    await personDb.addKey(newKey);

    success(`new key created! #id ${newKey.id}`);
  } catch (err) {
    error("error while creating new key");
    console.log(err);
  }
};

const onUpdateKey = async (key, success, error) => {
  try {
    const session = await Session.findOne({ where: { isActive: true } });

    const personDb = await Person.findByPk(session.dataValues.userId);

    const pwdEncrypted = encrypt(key.password, personDb.password);

    key.password = pwdEncrypted;

    await Key.update({ ...key }, { where: { id: key.id } });
    success(`key was updated! #id ${key.id}`);
  } catch (err) {
    error("error while updating key");
    console.log(err);
  }
};

const onGetAllKeys = async (page, filter, error) => {
  try {
    const ITEMS_PER_PAGE = 6;

    const total = await Key.count();

    const numPages = Math.ceil(total / ITEMS_PER_PAGE);

    const session = await Session.findOne({ where: { isActive: true } });

    const keys = await Key.findAll({
      where: {
        title: {
          [Op.substring]: filter,
        },
        personId: {
          [Op.eq]: session.dataValues.userId,
        },
      },
      // include: "person", includes person if at leas one person exist
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    });

    const data = keys.map((e) => e.dataValues);

    const result = {
      keys: data,
      numPages,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < total,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
    };

    return result;
  } catch (err) {
    error("error while loading keys");
  }
};

const onDeleteKey = async (id, success, error) => {
  try {
    await Key.destroy({
      where: {
        id: id,
      },
    });
    success("Key was delete!");
  } catch (err) {
    error("error while deleting key");
  }
};

const onGetKeyById = async (id, error) => {
  try {
    const session = await Session.findOne({ where: { isActive: true } });
    const person = await Person.findByPk(session.dataValues.userId);

    const dbKey = await Key.findByPk(id);

    const key = dbKey.dataValues;

    const pwdDecrypted = decrypt(key.password, person.password);

    key.password = pwdDecrypted;

    return key;
  } catch (err) {
    error("error while retrieving key");
  }
};

const onSavePerson = async (obj, success, error) => {
  try {
    let imageBuffer = null;

    if (obj.path !== null && obj.path.length > 0) {
      imageBuffer = fs.readFileSync(obj.path);
    }

    const hashedPwd = bcrypt.hashSync(obj.password, 12);

    const person = {
      username: obj.username,
      password: hashedPwd,
      email: obj.email,
      picture: imageBuffer,
    };

    await Person.create({ ...person });
    success("person was saved successfully!");
  } catch (err) {
    console.log(error);
    error("Error while saving the person");
  }
};

const onLogin = async (obj, success, error) => {
  try {
    const personDb = await Person.findOne({
      where: {
        username: obj.username,
      },
    });

    const match = await bcrypt.compare(obj.password, personDb.password);

    if (personDb.dataValues != null && match) {
      await Session.create({ userId: personDb.dataValues.id });
      ipcRenderer.send("success:login", personDb.dataValues);
      success({ success: true });
    } else {
      success({
        success: false,
        message: `Could not find user ${obj.username}`,
      });
    }
  } catch (err) {
    error("Error while trying to login");
  }
};

const onLogout = async () => {
  await Session.destroy({
    where: {
      isActive: true,
    },
  });
  ipcRenderer.send("user:logout");
};

const onLoadImage = (setImage) => {
  ipcRenderer.on("user:image", (e, data) => {
    setImage(data);
  });
};

const onLoggedUser = async () => {
  const session = await Session.findOne({ where: { isActive: true } });
  return await Person.findByPk(session.dataValues.userId);
};

const onUpdatePerson = async (obj, success, error) => {
  let result = null;

  try {
    const session = await Session.findOne({ where: { isActive: true } });
    const person = await Person.findByPk(session.dataValues.userId);

    let imageBuffer;

    if (obj.path !== null && obj.path.length > 0) {
      imageBuffer = fs.readFileSync(obj.path);
    } else {
      imageBuffer = person.picture;
    }

    person.username = obj.username;
    person.email = obj.email;
    person.picture = imageBuffer;
    person.save();
    success("person was updated!");
    result = {
      username: person.username,
      img64: person.picture.toString("base64"),
    };
  } catch (err) {
    error("Error while updating person");
  }

  return result;
};

const onConfirmPassword = async (pwd) => {
  const session = await Session.findOne({ where: { isActive: true } });
  const person = await Person.findByPk(session.dataValues.userId);
  const { password } = person.dataValues;
  const match = await bcrypt.compare(pwd, password);
  return match;
};

const onCopyToClipboard = async (id, success, error) => {
  try {
    const session = await Session.findOne({ where: { isActive: true } });
    const person = await Person.findByPk(session.dataValues.userId);
    const obj = await Key.findByPk(id);
    const key = obj.dataValues;
    const pwdDecrypted = decrypt(key.password, person.password);
    clipboard.writeText(pwdDecrypted);
    success("Key copied!");
  } catch (err) {
    error("Could not copy to clipboard");
  }
};

const onDoEncrypt = (text, pwd) => {
  const encrypted = encrypt(text, pwd);
  return encrypted;
};

const onDoDecrypt = (text, pwd) => {
  const plaintext = decrypt(text, pwd);
  return plaintext;
};

ipcRenderer.on("clear:session", async () => {
  try {
    await Session.destroy({ where: { isActive: true } });
  } catch (error) {
    console.log(error);
  }
});

contextBridge.exposeInMainWorld("ctx", {
  createKey: onCreateKey,
  getAllKeys: onGetAllKeys,
  deleteKey: onDeleteKey,
  getKeyById: onGetKeyById,
  updateKey: onUpdateKey,
  savePerson: onSavePerson,
  login: onLogin,
  logout: onLogout,
  loadImage: onLoadImage,
  loggedUser: onLoggedUser,
  updatePerson: onUpdatePerson,
  confirmPassword: onConfirmPassword,
  copyToClipboard: onCopyToClipboard,
  doEncrypt: onDoEncrypt,
  doDecrypt: onDoDecrypt,
});

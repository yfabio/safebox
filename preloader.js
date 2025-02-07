const { contextBridge, ipcRenderer } = require("electron");
const { Op } = require("sequelize");

const fs = require("fs");

const Key = require("./model/Key");
const Person = require("./model/Person");

const onCreateKey = async (key, success, error) => {
  try {
    const newKey = await Key.create({ ...key });
    success(`new key created! #id ${newKey.id}`);
  } catch (err) {
    error("error while creating new key");
    console.log(err);
  }
};

const onUpdateKey = async (key, success, error) => {
  try {
    await Key.update({ ...key }, { where: { id: key.id } });
    success(`key was updated! #id ${key.id}`);
  } catch (err) {
    error("error while updating key");
    console.log(err);
  }
};

const onGetAllKeys = async (page, filter, error) => {
  const ITEMS_PER_PAGE = 6;

  try {
    const total = await Key.count();

    const numPages = Math.ceil(total / ITEMS_PER_PAGE);

    const keys = await Key.findAll({
      where: {
        title: {
          [Op.substring]: filter,
        },
      },
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
    const dbKey = await Key.findByPk(id);
    return dbKey.dataValues;
  } catch (error) {
    error("error while retrieving key");
  }
};

const onSavePerson = async (obj, success, error) => {
  try {
    let imageBuffer = null;

    if (obj.path !== null && obj.path.length > 0) {
      imageBuffer = fs.readFileSync(obj.path);
    }

    const person = {
      username: obj.username,
      password: obj.password,
      email: obj.email,
      picture: imageBuffer,
    };

    const personSaved = await Person.create({ ...person });
    success("person was saved successfully!");
  } catch (error) {
    console.log(error);
    error("Error while saving the person");
  }
};

const onLogin = async (obj, success, error) => {
  try {
    const personDb = await Person.findOne({
      where: {
        [Op.and]: [{ username: obj.username }, { password: obj.password }],
      },
    });
    if (personDb) {
      localStorage.setItem("user", personDb.id);
      ipcRenderer.send("success:login", personDb.dataValues);
      success({ success: true });
    } else {
      success({
        success: false,
        message: `Could not find user ${obj.username}`,
      });
    }
  } catch (error) {
    error("Error while trying to login");
  }
};

const onLogout = () => {
  ipcRenderer.send("user:logout");
};

const onLoadImage = (setImage) => {
  ipcRenderer.on("user:image", (e, data) => {
    setImage(data);
  });
};

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
});

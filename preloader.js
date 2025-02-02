const { contextBridge, ipcRenderer } = require("electron");
const Key = require("./model/Key");

const onCreateKey = async (key, success, error) => {
  try {
    const newKey = await Key.create({ ...key });
    success(`new key created! #id ${newKey.id}`);
  } catch (err) {
    error("error while creating new key");
    console.log(err);
  }
};

const onGetAllKeys = async (error) => {
  try {
    const keys = await Key.findAll();
    return keys.map((e) => e.dataValues);
  } catch (error) {
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

contextBridge.exposeInMainWorld("ctx", {
  createKey: onCreateKey,
  getAllKeys: onGetAllKeys,
  deleteKey: onDeleteKey,
});

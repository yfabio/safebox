const { contextBridge, ipcRenderer } = require("electron");
const { Op } = require("sequelize");
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

contextBridge.exposeInMainWorld("ctx", {
  createKey: onCreateKey,
  getAllKeys: onGetAllKeys,
  deleteKey: onDeleteKey,
});

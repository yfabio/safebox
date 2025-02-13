const { app, ipcMain, BrowserWindow, Menu } = require("electron");
const log = require("electron-log");

const path = require("path");

const sequelize = require("./sqlite/db");
const Key = require("./model/Key");
const Person = require("./model/Person");
const Session = require("./model/Session");

Person.hasMany(Key, { onDelete: "CASCADE" });
Key.belongsTo(Person);

process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let loginWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Safebox",
    width: 1080,
    height: 600,
    minWidth: 600,
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: true,
    backgroundColor: "white",
    webPreferences: {
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, "preloader.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile("./app/index.html");

  mainWindow.on("close", () => {
    if (mainWindow) {
      mainWindow.webContents.send("clear:session");
      mainWindow = null;
      app.quit();
    }
  });
}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    title: "Safebox",
    width: 1080,
    minWidth: 600,
    height: 600,
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: isDev ? true : false,
    backgroundColor: "white",
    webPreferences: {
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, "preloader.js"),
    },
  });

  if (isDev) {
    loginWindow.webContents.openDevTools();
  }

  loginWindow.loadFile("./app/login.html");

  loginWindow.on("close", () => {
    if (loginWindow) {
      loginWindow.webContents.send("clear:session");
      loginWindow = null;
      app.quit();
    }
  });
}

app.on("ready", async () => {
  createMainWindow();
  createLoginWindow();

  if (mainWindow) {
    const mainMenu = Menu.buildFromTemplate(menu);
    mainWindow.setMenu(mainMenu);
    mainWindow.hide();
  }

  if (loginWindow) {
    loginWindow.setMenu(null);
  }

  try {
    await sequelize.sync();
  } catch (error) {
    console.log("error while synchronizing database", error);
  }
});

ipcMain.on("success:login", async (e, person) => {
  if (person && mainWindow !== null && loginWindow !== null) {
    loginWindow.hide();
    mainWindow.show();

    const personDb = await Person.findByPk(person.id);

    let img64;

    if (personDb.picture !== null) {
      img64 = personDb.picture.toString("base64");
    } else {
      img64 = null;
    }

    mainWindow.webContents.send("user:image", {
      username: personDb.username,
      img64,
    });
  }
});

ipcMain.on("user:logout", () => {
  if (mainWindow) {
    mainWindow.hide();
    loginWindow.show();
  }
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

app.on("quit", async () => {
  if (sequelize) {
    await sequelize.close();
  }
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (mainWindow !== null) {
      createMainWindow();
    } else {
      createLoginWindow();
    }
  }
});

app.allowRendererProcessReuse = true;

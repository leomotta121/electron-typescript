import * as path from "path";
import * as fs from "fs";

import { app, BrowserWindow, ipcMain } from "electron";
import * as isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

let window: BrowserWindow | null = null;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    window.loadURL("http://localhost:3000/index.html");
  } else {
    // 'build/index.html'
    window.loadURL(`file://${__dirname}/../index.html`);
  }

  window.maximize();

  window.on("closed", () => (window = null));

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron"
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  if (isDev) {
    window.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

ipcMain.on("write-file", (event, args) => {
  const { message } = args;

  const file = path.join(
    process.env.PORTABLE_EXECUTABLE_DIR + "hello-world.txt"
  );

  console.log(process.env.PORTABLE_EXECUTABLE_DIR);

  fs.writeFile(file, message, () => {
    event.sender.send(
      "write-file-response",
      process.env.PORTABLE_EXECUTABLE_DIR
    );
  });
});

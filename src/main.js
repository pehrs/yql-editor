const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { dialog } = require('electron')
import * as fs from 'node:fs';
import path from 'node:path';

// const { session } = require('electron')
// session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
//   callback({
//     responseHeaders: {
//       ...details.responseHeaders,
//       'Content-Security-Policy': ['script-src \'self\'']
//     }
//   })
// })

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const isMac = process.platform === 'darwin'

let menuTemplate = [
  {
    label: "File",
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ]
        : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      {
        label: "custom reload",
        type: "separator"
      },
      {
        label: "Open Developer tools",
        accelerator: "F12",
        click: () => {
          mainWindow.webContents.openDevTools();
        }
      }
    ]
  },
  {
    label: "Query",
    submenu: [
      {
        label: "Execute Query",
        // FIXME: How to verify that Cmd+Return works for MonacoEditor on a Mac without a Mac?
        // accelerator: isMac ? 'Cmd+Return' : 'Alt+Return',
        accelerator: "F5",
        // BUG: Cannot override ctrl+Return for MonacoEditor
        // accelerator: 'CommandOrControl+Return',
        click: () => {
          console.log("EXECUTE!");
          mainWindow.webContents.send('exectute-query');
          dialog.showMessageBox(options = {
            title: "Vespa Editor v1.0",
            message: "Execute HERE!",
          });
        }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About',
        accelerator: "CommandOrControl+Shift+H",
        click: async () => {
          dialog.showMessageBox(options = {
            title: "Vespa Editor v1.0",
            message: "© Copyright 2024 by Matti Pehrs",
            type: "info",
          });
        }
      },
      {
        label: 'Learn More...',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/pehrs', {})
        }
      }
    ]
  }
];

var mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.loadURL(`file://${__dirname}/dist/index.html`);

  // Custom menu
  // let menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);
  mainWindow.removeMenu();

  // Open the DevTools.
  // Use menu choice instead :-)
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('close', () => app.quit())

ipcMain.on('reload', () => {
  mainWindow.webContents.reloadIgnoringCache()
})

ipcMain.on('open-web-tools', () => {
  if (mainWindow.webContents.isDevToolsOpened()) {
    mainWindow.webContents.closeDevTools();
  } else {
    mainWindow.webContents.openDevTools();
  }
})



function readFile(filePath, callback) {
  fs.readFile(
    path.resolve(__dirname, filePath),
    'utf-8',
    (err, data) => {
      if (err) throw err;
      return callback(data.toString());
    }
  );
}

ipcMain.on("open-file", (event, arg) => {
  const result = dialog.showOpenDialogSync(mainWindow)

  if(result) {
    const fn = result[0];
    console.log("Reading ", fn);
    readFile(fn, (txt) => {
      console.log("FILE:", txt);
      event.sender.send("open-file", txt);
    });
  }

  
})

ipcMain.on("about", () => {
  dialog.showMessageBox(options = {
    title: "Vespa Editor v1.0",
    message: "Execute HERE!",
  });
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

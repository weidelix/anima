import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../dist/preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


app.whenReady().then(() => {
  const { net } = require('electron');
  
  // Search for game and get top result
  ipcMain.handle('search', async(event, args) => {    
    let promise = new Promise((resolve, reject) => {
      const request = net.request(`https://api.rawg.io/api/games?key=7cfd341fc762465493aef28bb5039375&search=${args.name}&dates=${args.date}`);
      let chunks : Buffer[] = [];
      
      request.on('response', (response) => {      
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        });
      });
      
      request.end();
    });

    return promise;
  });

  // Get details for game
  ipcMain.handle('get-details', async(event, args) => {    
    let promise = new Promise(async (resolve, reject) => {
      const request = net.request(`https://api.rawg.io/api/games/${args}?key=7cfd341fc762465493aef28bb5039375&`);

      let chunks : Buffer[] = [];
      
      request.on('response', (response) => {      
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        });
      });
      
      request.end();
    });

    return promise;
  });

  ipcMain.on('open-website', (event, args) => {
    shell.openExternal(args);
  });
});
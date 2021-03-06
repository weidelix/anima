import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import fs from 'fs';

import '../../res/anima_icon.png';

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const key = 'c41a6a0a96324ff58a8a57fe7c1951c3';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 1366,
    minHeight: 736,
    darkTheme: true,
    icon: path.join(__dirname, 'res/anima_icon.png'),
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (app.isPackaged) {
    mainWindow.removeMenu();
    mainWindow.webContents.closeDevTools();
  } else {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
   details.responseHeaders['Content-Security-Policy'] = [ "img-src 'self' https://media.rawg.io blob: data:" ];
    callback({
        responseHeaders: details.responseHeaders
      }
    );
  });
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
  ipcMain.handle('search', async (event, args) => {    
    let promise = new Promise((resolve, reject) => {
      const request = net.request(`https://api.rawg.io/api/games?key=${key}&search=${args.name}&dates=${args.date}`);
      let chunks : Buffer[] = [];
      
      request.on('response', (response) => {      
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          let data: any[];
          
          try {
            data = JSON.parse(Buffer.concat(chunks).toString()).results;

            data = data.map((el) => {
              return {
                id: el.id,
                name: el.name,
                background_image: el.background_image,
                rating: el.rating,
              };
            });

            resolve(data);
          } 
          catch (error) {
            resolve([]);  
          }
        });
      });
      
      request.end();
    });

    return promise;
  });

  // Get details for game
  ipcMain.handle('get-details', async (event, args) => {    
    let promise = new Promise(async (resolve, reject) => {
      const request = net.request(`https://api.rawg.io/api/games/${args}?key=${key}`);

      let chunks : Buffer[] = [];
      
      request.on('response', (response) => {      
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          let data = JSON.parse(Buffer.concat(chunks).toString());

          try {
            resolve({
                id: data.id,
                name: data.name,
                background_image: data.background_image,
                background_image_additional: data.background_image_additional,
                rating: data.rating,
                parent_platforms: data.parent_platforms,
                description: data.description,
                developers: data.developers,
                website: data.website
            });
          }
          catch (error) {
            resolve({});  
          }
        });
      });
      
      request.end();
    });

    return promise;
  });

  ipcMain.on('open-website', (event, args) => {
    const { shell } = require('electron');
    shell.openExternal(args);
  });

  ipcMain.handle('read-user-profile', async (event, args) => {
    let promise = new Promise<any>(async (resolve, reject) => {
      fs.readFile(__dirname + '/user/profile.json', 'utf8', (err, data) => {
        if (data) resolve(JSON.parse(data));
        else if (err) throw err;
      });
    });

    return promise;
  });

  ipcMain.on('write-user-profile', async (event, args) => {
    fs.mkdir(__dirname + '/user', { recursive: true }, err => {
      if (err) throw err;
    });

    fs.writeFile(__dirname + '/user/profile.json', args, err => {
      if (err) throw err;
    });
  });

  ipcMain.on('init', (event, args) => {
    try {
      fs.accessSync(__dirname + '/user/profile.json', fs.constants.F_OK);
    }
    catch (e) {
      fs.mkdir(__dirname + '/user', { recursive: true }, err => {
        if (err) throw err;
      });
  
      fs.writeFile(__dirname + '/user/profile.json', "{\n\t\"library\": [], \n\t\"queue\": []\n}", 
        err => {
          if (err) throw err;
      });
    }
  });

  const win = BrowserWindow.getAllWindows()[0];

  ipcMain.on('quit', (event, args) => {
    app.quit();
  });

  ipcMain.on('minimize', (event, args) => {
    win.minimize();
  });

  ipcMain.on('maximize', (event, args) => {
    if (!win.isMaximized())
      win.maximize();
    else
      win.unmaximize();
  });
});

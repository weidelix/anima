import { app, BrowserWindow, ipcMain, session } from 'electron';

let prod = false;

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 640,
    minHeight: 480,
    darkTheme: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (prod) {
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
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["img-src 'self' https://media.rawg.io blob: data:"]
      }
    })
  })
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
      const request = net.request(`https://api.rawg.io/api/games?key=7cfd341fc762465493aef28bb5039375&search=${args.name}&dates=${args.date}`);
      let chunks : Buffer[] = [];
      
      request.on('response', (response) => {      
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          let data: any[] = JSON.parse(Buffer.concat(chunks).toString()).results;
          
          data = data.map((el) => {
            return {
              id: el.id,
              name: el.name,
              background_image: el.background_image
            };
          });
          
          resolve(data);
        });
      });
      
      request.end();
    });

    return promise;
  });

  // Get details for game
  ipcMain.handle('get-details', async (event, args) => {    
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
    const { shell } = require('electron');
    shell.openExternal(args);
  });
});
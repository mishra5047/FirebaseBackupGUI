const electron = require("electron");
const startApi = require("./startAPI");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

function createWindow(){
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration:true,
            devTools: false,
            icon: './assets/icon_db.ico',
            //enable node in this app
          }
      })

      mainWindow.loadFile("./homePage.html").then( function(){
          mainWindow.webContents.openDevTools();
          mainWindow.removeMenu(); //open dev tools
          mainWindow.maximize();
        //   mainWindow.removeMenu();
      });
}


app.whenReady().then( function(){
    createWindow();
});

(function () {
  try {
    startApi.startAPI();
  } catch (err) {
    console.log(err);
  }
})();
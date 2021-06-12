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

      mainWindow.loadFile("./index.html").then( function(){
          mainWindow.removeMenu(); //open dev tools
          mainWindow.maximize();
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
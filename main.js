const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: false,
    backgroundColor: '#050805',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  Menu.setApplicationMenu(null);
  win.loadFile('src/index.html');
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

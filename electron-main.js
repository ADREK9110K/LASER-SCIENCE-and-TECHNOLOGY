/**
 * LASER SCIENCE & TECHNOLOGY — VIRTUAL INTERACTIVE LABORATORY
 * Native Windows Desktop Application (Electron Main Process)
 * Developed by Youness Latef – University of Technology, Iraq
 */
'use strict';

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1380,
    height: 860,
    minWidth: 960,
    minHeight: 620,
    title: 'علوم وتكنولوجيا الليزر | المختبر الافتراضي التفاعلي – الجامعة التكنولوجية',
    icon: path.join(__dirname, 'assets', 'images.png'),
    backgroundColor: '#060a12',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.maximize();

  // Open external links (such as developer portfolio) in default system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

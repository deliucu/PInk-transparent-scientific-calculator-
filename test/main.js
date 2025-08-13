const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
let win; // Declare globally
let tray = null;

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        transparent: true,
        backgroundColor: 'rgba(255, 59, 232, 0)',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false
        },
        show: false,
        resizable: false,
        alwaysOnTop: false,
        hasShadow: true,

    });

    win.loadFile('test.html');

    win.once('ready-to-show', () => {
        win.show();
    });

    // win.webContents.openDevTools(); // Uncomment for debugging

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }
    });
    win.webContents.openDevTools(); // Add this line
}

app.whenReady().then(() => {
    createWindow();

    tray = new Tray(path.join(__dirname, 'icon.png')); // Make sure icon.png exists
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => { win.show(); } },
        {
            label: 'Quit', click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('Calculator');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        win.show();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

ipcMain.on('close-app', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.close();
    }
});

ipcMain.on('quit-app', () => {
    app.isQuiting = true;
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception: ', error);
});
process.on('unhandledRejection', (error) => {
    console.log('Unhandled Rejection: ', error);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Previne crash-uri
process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception: ', error);
});

process.on('unhandledRejection', (error) => {
    console.log('Unhandled Rejection: ', error);
});

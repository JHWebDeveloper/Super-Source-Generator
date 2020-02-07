import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import url from 'url'
import path from 'path'
import { loadPrefs, savePrefs } from './modules/preferences'
import { saveSources } from './modules/saveSources'
import fileExistsPromise from './modules/fileExistsPromise'

const dev = process.env.NODE_ENV === 'development'
const mac = process.platform === 'darwin'
let win = false
let preferences = false

const openWindow = prefs => new BrowserWindow({
  ...prefs,
  show: false,
  backgroundColor: '#fff',
  webPreferences: {
    nodeIntegration: dev,
    enableEval: false,
    preload: dev
      ? path.join(__dirname, 'preload', 'babelRegister.js')
      : path.join(__dirname, 'preload.js')
  }
})

const getURL = view => url.format(dev ? {
  protocol: 'http:',
  host: 'localhost:3000',
  pathname: `${view}.html`,
  slashes: true
} : {
  protocol: 'file:',
  pathname: path.join(__dirname, 'renderer', `${view}.html`),
  slashes: true
})

const createWindow = () => {
  win = openWindow({
    width: dev ? 952 : 476,
    height: 600,
    minWidth: 360,
    minHeight: 460
  })

  win.loadURL(url.format(getURL('index')))

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  Menu.setApplicationMenu(mainMenu)

  win.on('ready-to-show', () => {
    win.show()
    if (dev) win.webContents.openDevTools()
  })

  win.on('close', () => {
    win = false
  })
}

const lock = app.requestSingleInstanceLock()

if (!lock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.on('ready', () => {
    createWindow()
  })
}

app.on('window-all-closed', () => {
  if (!mac) app.quit()
})

app.on('activate', () => {
  if (!win) createWindow()
})

const prefsMenuItem = [
  { type: 'separator' },
  {
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    click() {
      const width = 592
      const height = mac ? 339 : 356

      preferences = openWindow({
        parent: win,
        width,
        height,
        minWidth: width,
        maxWidth: dev ? false : width,
        minHeight: height,
        minimizable: false,
        maximizable: false
      })

      preferences.loadURL(getURL('preferences'))

      preferences.once('ready-to-show', () => {
        preferences.show()
      })

      preferences.on('close', () => {
        preferences = false
      })

      preferences.setMenu(null)
    }
  }
]

const mainMenuTemplate = [
  ...mac ? [{
    label: app.getName(),
    submenu: [
      {
        label: 'About Super Source Generator',
        role: 'about'
      },
      ...prefsMenuItem,
      { type: 'separator' },
      {
        label: 'Hide',
        role: 'hide'
      },
      { role: 'hideothers' },
      { type: 'separator' },
      { 
        label: 'Quit',
        role: 'quit'
      }
    ]
  }] : [],
  {
    label: 'File',
    submenu: [
      mac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo'},
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectall' },
      ...(!mac ? prefsMenuItem : [])
    ]
  }
]

if (dev) {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

ipcMain.on('saveSources', async (evt, data) => {
  try {
    evt.reply('sourcesSaved', await saveSources(data))
  } catch (err) {
    evt.reply('saveSourcesErr')
  }
})

ipcMain.on('requestPrefs', async evt => {
  try {
    evt.reply('prefsRecieved', await loadPrefs())
  } catch (err) {
    evt.reply('prefsErr')
  }
})

ipcMain.on('savePrefs', async (evt, newPrefs) => {
  try {
    await savePrefs(newPrefs)
    evt.reply('prefsSaved')
    win.webContents.send('syncPrefs', newPrefs)
  } catch (err) {
    evt.reply('savePrefsError')
  }
})

ipcMain.handle('checkIfDirectoryExists', async (evt, dir) => {
  try {
    return fileExistsPromise(dir)
  } catch (err) {
    return false
  }
})
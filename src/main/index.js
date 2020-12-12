import { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } from 'electron'
import url from 'url'
import path from 'path'
import { loadPrefs, savePrefs } from './modules/preferences'
import { saveSources } from './modules/saveSources'
import fileExistsPromise from './modules/fileExistsPromise'
import update from './modules/update'
import insertPCStyles from './modules/insertPCStyles'

const dev = process.env.NODE_ENV === 'development'
const mac = process.platform === 'darwin'
let win = false
let preferences = false
let help = false

const openWindow = (opts = {}) => new BrowserWindow({
	show: false,
	backgroundColor: '#fff',
	webPreferences: {
		nodeIntegration: dev,
		contextIsolation: !dev,
		enableEval: false,
		enableRemoteModule: true,
		preload: dev
			? path.join(__dirname, 'preload', 'babelRegister.js')
			: path.join(__dirname, 'preload.js')
	},
	...opts
})

const getURL = (view = 'index') => url.format(dev ? {
	protocol: 'http:',
	hostname: 'localhost',
	port: process.env.PORT,
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
		height: 650,
		minWidth: 360,
		minHeight: 460
	})

	win.loadURL(url.format(getURL('index')))

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

	Menu.setApplicationMenu(mainMenu)

	insertPCStyles(win)

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
			preferences = openWindow({
				parent: win,
				width: 620,
				height: 356,
				minWidth: 590,
				minHeight: 356,
				minimizable: false,
				maximizable: false
			})

			preferences.loadURL(getURL('preferences'))

			if (!mac) insertPCStyles(preferences)

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
	},
	{
		label: 'Help',
		submenu: [
			{
				label: 'SSG Help',
				click() {
					help = openWindow({
						parent: win,
						width: 476,
						height: 650,
						minWidth: 360,
						minHeight: 460,
						minimizable: false,
						maximizable: false
					})

					help.loadURL(getURL('help'))

					if (!mac) insertPCStyles(help)

					help.once('ready-to-show', () => {
						help.show()
					})

					help.on('close', () => {
						help = false
					})

					help.setMenu(null)
				}
			}
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

ipcMain.on('checkForUpdates', async evt => {
	try {
		await update(evt)
		evt.reply('updateComplete')
	} catch (err) {
		evt.reply('updateErr', err)
	}
})

ipcMain.handle('getVersion', () => app.getVersion())

ipcMain.handle('showOpenDialog', (evt, opts) => dialog.showOpenDialog(opts))

ipcMain.handle('showMessageBox', (evt, opts) => dialog.showMessageBox(opts))

const setContextMenu = () => {
	const textEditor = new Menu()
	let pos = [0, 0]
	let inspectMenu = []

	const inspect = !dev ? [] : [
		new MenuItem({
			id: 0,
			label: 'Inspect Element',
			click() {
				BrowserWindow.getFocusedWindow().inspectElement(...pos)
			}
		}),
		new MenuItem({ type: 'separator' })
	]

	const textEditorItems = [
		...inspect,
		new MenuItem({ role: 'cut' }),
		new MenuItem({ role: 'copy' }),
		new MenuItem({ role: 'paste' }),
		new MenuItem({ type: 'separator' }),
		new MenuItem({ role: 'selectAll' })
	]

	if (dev) {
		inspectMenu = new Menu()
		inspectMenu.append(...inspect)
	}

	for (const item of textEditorItems) {
		textEditor.append(item)
	}

	return (evt, { isTextElement, x, y }) => {
		pos = [x, y]

		if (isTextElement) {
			textEditor.popup(BrowserWindow.getFocusedWindow())
		} else if (dev) {
			inspectMenu.popup(BrowserWindow.getFocusedWindow())
		}
	}
}

ipcMain.handle('getContextMenu', setContextMenu())

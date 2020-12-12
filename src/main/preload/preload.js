import { ipcRenderer, remote, contextBridge } from 'electron'
import sendMessage from './sendMessage'

const interop = {}

interop.saveSources = data => sendMessage({
	sendMsg: 'saveSources',
	recieveMsg: 'sourcesSaved',
	errMsg: 'saveSourcesErr',
	data
})

interop.requestPrefs = () => sendMessage({
	sendMsg: 'requestPrefs',
	recieveMsg: 'prefsRecieved',
	errMsg: 'prefsErr'
})

interop.savePrefs = prefs => sendMessage({
	sendMsg: 'savePrefs',
	recieveMsg: 'prefsSaved',
	errMsg: 'savePrefsErr',
	data: prefs
})

interop.addPrefsSyncListener = listener => {
	ipcRenderer.on('syncPrefs', (evt, newPrefs) => {
		listener(newPrefs)
	})
}

interop.removePrefsSyncListener = () => {
	ipcRenderer.removeAllListeners('syncPrefs')
}

interop.checkForUpdates = (onFound, onProgress) => {
	ipcRenderer.once('updateFound', (evt, version) => onFound({
		status: 'updating',
		version
	}))

	ipcRenderer.on('updateProgress', (evt, percent) => onProgress(percent))

	return sendMessage({
		sendMsg: 'checkForUpdates',
		recieveMessage: 'updateComplete',
		errMsg: 'updateErr'
	})
}

interop.removeUpdateListeners = () => {
	ipcRenderer.removeAllListeners('checkForUpdates')
	ipcRenderer.removeAllListeners('updateFound')
	ipcRenderer.removeAllListeners('updateProgress')
	ipcRenderer.removeAllListeners('updateComplete')
	ipcRenderer.removeAllListeners('updateErr')
}

interop.closePreferences = () => {
	ipcRenderer.send('closePrefs')
}

interop.checkIfDirectoryExists = async dir => ipcRenderer.invoke('checkIfDirectoryExists', dir)

interop.getVersion = () => ipcRenderer.invoke('getVersion')

interop.dialog = Object.freeze({
	sourceOnTopAlert: async () => (await interop.showMessageBox({
		type: 'warning',
		buttons: ['OK', 'Cancel'],
		message: 'A source on top is not for aesthetics!',
		detail: 'This option shoud only be selected if the source would obscure important details or appear illegible at the bottom of the video. If you are using this option for any other reason please choose cancel.'
	})).response,
	directoryNotFoundAlert: async dir => (await interop.showMessageBox({
		type: 'warning',
		buttons: ['Continue', 'Abort'],
		message: 'Directory not found!',
		detail: `Unable to locate the directory "${dir}". This folder may have been deleted, removed or taken offline. Continue without saving to this directory?`
	})).response,
	deleteDirectoryAlert: async label => (await interop.showMessageBox({
		type: 'warning',
		buttons: ['OK', 'Cancel'],
		message: `Delete ${label ? `"${label}"` : 'directory'}?`
	})).response,
	chooseDirectory: async () => {
		const { filePaths, canceled } = await interop.showOpenDialog({
			buttonLabel: 'Choose',
			properties: ['openDirectory', 'createDirectory']
		})

		return {
			filePaths,
			canceled
		}
	}
})

interop.setContextMenu = () => {
	const textElement = 'input[type="text"], input[type="number"]'
	
	window.addEventListener('contextmenu', e => {
		ipcRenderer.invoke('getContextMenu', {
			isTextElement: e.target.matches(textElement) && !e.target.disabled,
			x: e.x,
			y: e.y
		})
	})
}

// ---- ATTACH ALL TO RENDERER--------

const nameSpace = 'SSG'

const freeze = Object.freeze({
	interop: Object.freeze(interop)
})

if (process.env.NODE_ENV === 'development') {
	window[nameSpace] = freeze
} else {
	contextBridge.exposeInMainWorld(nameSpace, freeze)
}

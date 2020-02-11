import { ipcRenderer, remote } from 'electron'
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
  ipcRenderer.removeAllListeners([
    'checkForUpdates',
    'updateFound',
    'updateProgress',
    'updateComplete',
    'updateErr'
  ])
}

interop.closeCurrentWindow = () => {
  remote.getCurrentWindow().close()
}

interop.checkIfDirectoryExists = async dir =>
  ipcRenderer.invoke('checkIfDirectoryExists', dir)

interop.getVersion = () => remote.app.getVersion()

interop.dialog = Object.freeze({
  sourceOnTopAlert: async () => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['OK', 'Cancel'],
    message: 'A source on top is not for aesthetics!',
    detail: 'This option shoud only be selected if the source would obscure important details or appear illegible at the bottom of the video. If you are using this option for any other reason please choose cancel.'
  })).response,
  directoryNotFoundAlert: async dir => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['Continue', 'Abort'],
    message: 'Directory not found!',
    detail: `Unable to locate the directory "${dir}". This folder may have been deleted, removed or taken offline. Continue without saving to this directory?`
  })).response,
  deleteDirectoryAlert: async label => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['OK', 'Cancel'],
    message: `Delete ${label ? `"${label}"` : 'directory'}?`
  })).response,
  chooseDirectory: async () => {
    const { filePaths, canceled } = await remote.dialog.showOpenDialog({
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory']
    })

    return {
      filePaths,
      canceled
    }
  }
})


const textElements = 'input[type="text"], textarea'

interop.setContextMenu = () => {
  const menu = new remote.Menu()

  if (process.env.NODE_ENV === 'development') {
    let pos = {}
    
    menu.append(new remote.MenuItem({
      label: 'Inspect Element',
      click() {
        remote.getCurrentWindow().inspectElement(pos.x, pos.y)
      }
    }))
  
    window.addEventListener('contextmenu', e => {
      e.preventDefault()
      pos = { x: e.x, y: e.y }
      menu.popup(remote.getCurrentWindow())
    })
  } else {
    const menuItems = [
      new remote.MenuItem({ role: 'cut' }),
      new remote.MenuItem({ role: 'copy' }),
      new remote.MenuItem({ role: 'paste' }),
      new remote.MenuItem({ type: 'separator' }),
      new remote.MenuItem({ role: 'selectAll' })
    ]
  
    menuItems.forEach(item => menu.append(item))
  
    window.addEventListener('contextmenu', e => {
      e.preventDefault()
  
      if (e.target.matches(textElements) && !e.target.disabled) {
        menu.popup(remote.getCurrentWindow())
      }
    })
  }
}

window.SSG = Object.freeze({
  interop: Object.freeze(interop)
})

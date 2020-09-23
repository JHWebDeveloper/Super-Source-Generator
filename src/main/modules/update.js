import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

log.catchErrors({
	showDialog: false
})

const update = evt => new Promise((resolve, reject) => {
	autoUpdater.on('update-available', ({ version }) => {
		evt.reply('updateFound', version)
	})

	autoUpdater.on('update-not-available', resolve)

	autoUpdater.on('download-progress', ({ percent }) => {
		evt.reply('updateProgress', percent)
	})

	autoUpdater.on('update-downloaded', async ({ version }) => {
		const quit = await dialog.showMessageBox({
			type: 'question',
			message: `Super Source Generator v${version} has finished downloading. For the update to take effect Super Source Generator must restart. Close Super Source Generator?`,
			buttons: ['Close and Install', 'Not Now']
		})
	
		if (quit.response === 0) autoUpdater.quitAndInstall()
	
		resolve()
	})
	
	autoUpdater.on('error', reject)

	autoUpdater.checkForUpdatesAndNotify()
})

export default update

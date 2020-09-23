import { app } from 'electron'
import { promises as fsp } from 'fs'
import path from 'path'
import { v1 as uuid } from 'uuid'
import fileExistsPromise from './fileExistsPromise'

export const prefsDir = process.env.NODE_ENV === 'development'
	? path.join('.', 'data')
	: path.join(app.getPath('appData'), 'super-source-generator', 'prefs')

const prefsJSON = path.join(prefsDir, 'preferences.json')

const initPrefs = {
	renderOutput: '1280x720',
	sourceOnTopWarning: true,
	directories: [
		{
			checked: true,
			directory: app.getPath('desktop'),
			id: uuid(),
			label: 'Save to Desktop'
		}
	]
}

export const loadPrefs = async () => {
	const prefsDirExists = await fileExistsPromise(prefsDir)

	if (!prefsDirExists) await fsp.mkdir(prefsDir)

	if (await fileExistsPromise(prefsJSON)) {
		return JSON.parse(await fsp.readFile(prefsJSON))
	} else {
		await fsp.writeFile(prefsJSON, JSON.stringify(initPrefs))
		
		return initPrefs
	}
}

export const savePrefs = async newPrefs => fsp.writeFile(prefsJSON, JSON.stringify(newPrefs))

import React, { useCallback, useEffect, useState } from 'react'

import UpdateProgress from './UpdateProgress'
import UpdateError from './UpdateError'

const { interop } = window.SSG

const Updater = () => {
	const [updateStatus, setUpdateStatus] = useState({ status: false })
	const [percent, setPercent] = useState(0)

	const checkForUpdates = useCallback(async () => {
		try {
			await interop.checkForUpdates(setUpdateStatus, setPercent)
			setUpdateStatus({ status: false })
		} catch (err) {
			if (err.code !== 'ERR_UPDATER_LATEST_VERSION_NOT_FOUND') {
				setUpdateStatus({ status: 'error' })
			}
		} finally {
			interop.removeUpdateListeners()
		}
	}, [])

	useEffect(() => {
		checkForUpdates()
	}, [])

	switch (updateStatus.status) {
		case 'updating':
			return (
				<UpdateProgress
					version={updateStatus.version}
					percent={percent} />
			)
		case 'error':
			return <UpdateError checkForUpdates={checkForUpdates} />
		default:
			return false
	}
}

export default Updater

import React from 'react'
import { render } from 'react-dom'
import Preferences from './components/preferences/Preferences'
import initTabbedBrowsing from './initTabbedBrowsing'

initTabbedBrowsing()

render(<Preferences />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

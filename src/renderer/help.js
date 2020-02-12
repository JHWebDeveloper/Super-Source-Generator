import React from 'react'
import { render } from 'react-dom'
import Help from './components/help/Help'
import initTabbedBrowsing from './initTabbedBrowsing'

initTabbedBrowsing()

render(<Help />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

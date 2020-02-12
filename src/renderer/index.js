import React from 'react'
import { render } from 'react-dom'
import App from './components/main/App'
import initTabbedBrowsing from './initTabbedBrowsing'

initTabbedBrowsing()

render(<App />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

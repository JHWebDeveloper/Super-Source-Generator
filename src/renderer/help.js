import React from 'react'
import { render } from 'react-dom'
import Help from './components/help/Help'

render(<Help />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

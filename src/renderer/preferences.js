import React from 'react'
import { render } from 'react-dom'
import Preferences from './components/Preferences'

render(<Preferences />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

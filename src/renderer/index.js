import React from 'react'
import { render } from 'react-dom'
import App from './components/main/App'

render(<App />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

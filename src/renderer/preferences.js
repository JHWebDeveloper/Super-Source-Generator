import React from 'react'
import { render } from 'react-dom'
import Preferences from './components/preferences/Preferences'

document.body.onkeydown = function (e) {
  if (e.keyCode !== 9) return
  
  this.className = 'accessible'
  this.onkeydown = false
}

render(<Preferences />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

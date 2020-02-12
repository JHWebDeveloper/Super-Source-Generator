import React from 'react'
import { render } from 'react-dom'
import Help from './components/help/Help'

document.body.onkeydown = function (e) {
  if (e.keyCode !== 9) return
  
  this.className = 'accessible'
  this.onkeydown = false
}

render(<Help />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

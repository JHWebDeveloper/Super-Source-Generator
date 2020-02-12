import React from 'react'
import { render } from 'react-dom'
import App from './components/main/App'

document.body.onkeydown = function (e) {
  if (e.keyCode !== 9) return
  
  this.className = 'accessible'
  this.onkeydown = false
}

render(<App />, document.querySelector('#root'))

window.SSG.interop.setContextMenu()

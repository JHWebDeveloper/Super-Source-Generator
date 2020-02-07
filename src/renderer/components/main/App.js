import React from 'react'
import '../../css/index.css'

import { PrefsProvider } from '../../store/prefsStore'
import Header from './Header'
import Update from '../update/Update'
import Main from './Main'

const App = () => (
  <>
    <Header />
    <Update />
    <PrefsProvider>
      <Main />
    </PrefsProvider>
  </>
)

export default App

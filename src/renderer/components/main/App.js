import React from 'react'
import '../../css/index.css'

import { PrefsProvider } from '../../store/prefsStore'
import Header from './Header'
import Main from './Main'

const App = () => (
  <>
    <Header />
    <PrefsProvider>
      <Main />
    </PrefsProvider>
  </>
)

export default App

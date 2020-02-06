import React, { useContext }  from 'react'
import '../../css/index.css'

import { PrefsProvider, PrefsContext } from '../../store/prefsStore'
import { SSGProvider } from '../../store'
import Header from './Header'
import Form from './Form'


const Main = () => {
  const { preferences } = useContext(PrefsContext)

  return (
    <>
      <main>
        <SSGProvider preferences={preferences}>
          <Form />
        </SSGProvider>
      </main>
    </>
  )
}

const App = () => (
  <>
    <Header />
    <PrefsProvider>
      <Main />
    </PrefsProvider>
  </>
)

export default App

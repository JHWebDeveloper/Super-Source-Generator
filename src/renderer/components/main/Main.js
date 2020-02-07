import React, { useContext } from 'react'

import { PrefsContext } from '../../store/prefsStore'
import { SSGProvider } from '../../store'
import Form from './Form'

const Main = () => {
  const { preferences } = useContext(PrefsContext)

  return (
    <main>
      <SSGProvider preferences={preferences}>
        <Form />
      </SSGProvider>
    </main>
  )
}

export default Main

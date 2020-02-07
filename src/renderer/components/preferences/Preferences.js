import React, { useContext } from 'react'
import '../../css/preferences.css'

import { PrefsProvider, PrefsContext } from '../../store/prefsStore'
import Options from './Options'
import Directories from './Directories'
import SavePrefs from './SavePrefs'

const PrefsForm = () => {
  const { preferences, dispatch } = useContext(PrefsContext)
  const { renderOutput, theme, directories } = preferences

  return (
    <form id="preferences" onSubmit={e => e.preventDefault()}>
      <Options
        renderOutput={renderOutput}
        theme={theme}
        dispatch={dispatch} />
      <Directories
        directories={directories}
        dispatch={dispatch} />
      <SavePrefs />
    </form>
  )
}

const Preferences = () => (
  <PrefsProvider>
    <PrefsForm />
  </PrefsProvider>
)

export default Preferences

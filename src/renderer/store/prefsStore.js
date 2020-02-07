import React, { createContext, useEffect, useReducer } from 'react'

import prefsReducer from '../reducer/prefsReducer'
import { loadPrefs, syncPreferences } from '../actions/preferences'
//import PrefsPropType from '../components/preferences/PrefsPropType'

const { interop } = window.SSG

const initState = {
  renderOutput: '1280x720',
  theme: 'dark',
  directories: []
}

export const PrefsContext = createContext()

export const PrefsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(prefsReducer, initState)

  useEffect(() => {
    (async () => {
      dispatch(await loadPrefs())
    })()

    interop.addPrefsSyncListener(newPrefs => {
      dispatch(syncPreferences(newPrefs))
    })

    return () => {
      interop.removePrefsSyncListener()
    }
  }, [])

  useEffect(() => {
    document.documentElement.className = state.theme
  }, [state.theme])

  return (
    <PrefsContext.Provider value={{
      preferences: state,
      dispatch: input => (
        input instanceof Function ? input(dispatch, state) : dispatch(input)
      )
    }}>
      { children }
    </PrefsContext.Provider>
  )
}

//PrefsProvider.propTypes = PrefsPropType

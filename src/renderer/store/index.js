import React, { createContext, useEffect, useReducer } from 'react'
import { arrayOf, bool, element, oneOfType, shape, string } from 'prop-types'

import reducer from '../reducer'
import { createNewSourceState, mergePreferences } from '../actions/main'

const initState = {
  pasteMode: false,
  sources: [createNewSourceState()],
  pasteSources: '',
  sourcePrefix: true,
  saving: false,
  error: false,
  message: false,
  renderOutput: '1280x720',
  theme: 'dark',
  directories: []
}

export const SSGContext = createContext()

export const SSGProvider = ({ preferences, children }) => {
  const [state, dispatch] = useReducer(reducer, initState)

  useEffect(() => {
    dispatch(mergePreferences(preferences))
  }, [preferences])

  return (
    <SSGContext.Provider value={{
      ...state,
      dispatch: input => (
        input instanceof Function ? input(dispatch, state) : dispatch(input)
      )
    }}>
      { children }
    </SSGContext.Provider>
  )
}

SSGProvider.propTypes = {
  preferences: shape({
    directories: arrayOf(shape({
      checked: bool.isRequired,
      directory: string.isRequired,
      id: string.isRequired,
      label: string.isRequired
    })),
    outputResolution: string
  }),
  children: oneOfType([element, arrayOf(element)]).isRequired
}

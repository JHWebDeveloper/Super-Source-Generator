import React, { createContext, useEffect, useReducer } from 'react'
import { arrayOf, element, oneOfType } from 'prop-types'
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

export const SSGProvider = ({ children, preferences }) => {
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
  children: oneOfType([element, arrayOf(element)]).isRequired
}
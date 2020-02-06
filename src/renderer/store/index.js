import React, { createContext, useEffect, useReducer } from 'react'
import { arrayOf, element, oneOfType } from 'prop-types'
import uuidv1 from 'uuid/v1'
import reducer from '../reducer'
import { createNewSourceState, mergePreferences } from '../actions/main'

const initState = {
  pasteMode: false,
  sources: [createNewSourceState()],
  pasteSources: '',
  sourcePrefix: true,
  sourceOnTop: false,
  sourceOnTopAlert: true,
  renderOutput: '1280x720',
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

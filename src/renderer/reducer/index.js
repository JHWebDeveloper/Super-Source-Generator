import * as ACTION from '../actions/types'

export default (state, action) => {
  const { type, payload } = action

  switch (type) {
    case ACTION.UPDATE_STATE:
      return {
        ...state,
        ...payload
      }
    case ACTION.ADD_SOURCE:
      return {
        ...state,
        sources: [payload].concat(state.sources)
      }
    case ACTION.REMOVE_SOURCE:
      return {
        ...state,
        sources: state.sources.filter(src => src.id !== payload)
      }
    case ACTION.UPDATE_SOURCE_TEXT:
      return {
        ...state,
        sources: state.sources.map(src => (
          payload.id !== src.id ? src: {
            ...src,
            text: payload.text
          }
        ))
      }
    case ACTION.TOGGLE_OPTION:
      return {
        ...state,
        [payload]: !state[payload]
      }
    case ACTION.CHECK_DIRECTORY:
      return {
        ...state,
        directories: state.directories.map(dir => {
          if (dir.id === payload) dir.checked = !dir.checked
          return dir
        })
      }
    default:
      return state
  }
}

import uuidv1 from 'uuid/v1'
import * as ACTION from '../types'
import buildSource from './buildSource'

const { interop } = window.SSG

export const mergePreferences = prefs => ({
  type: ACTION.UPDATE_STATE,
  payload: prefs
})

export const createNewSourceState = (text = '') => ({
  id: uuidv1(),
  text
})

export const addSource = () => ({
  type: ACTION.ADD_SOURCE,
  payload: createNewSourceState()
})

export const removeSource = id => ({
  type: ACTION.REMOVE_SOURCE,
  payload: id
})

export const updateSourceText = (id, e) => ({
  type: ACTION.UPDATE_SOURCE_TEXT,
  payload: {
    id,
    text: e.target.value
  }
})

export const updatePasteSources = e => ({
  type: ACTION.UPDATE_STATE,
  payload: {
    sources: convertSourcesToEntryMode(e.target.value),
    pasteSources: e.target.value
  }
})

const notBlank = val => !/^$|^[\s,]+$/.test(val)

const convertSourcesToPasteMode = sources => (
  sources
    .map(src => src.text)
    .filter(src => notBlank(src))
    .join(', ')
)

const convertSourcesToEntryMode = pasteSources => {
  const srcs = pasteSources
    .split(/\s*,\s*/g)
    .filter(src => notBlank(src))
    .map(src => createNewSourceState(src))

  return srcs.length > 0 ? srcs : [createNewSourceState()]
}

export const toggleMode = (sources, pasteSources, pasteMode) => {
  if (pasteMode) {
    sources = convertSourcesToEntryMode(pasteSources)
  } else {
    pasteSources = convertSourcesToPasteMode(sources)
  }

  return {
    type: ACTION.UPDATE_STATE,
    payload: {
      sources,
      pasteSources,
      pasteMode: !pasteMode
    }
  }
}

export const toggleOption = e => ({
  type: ACTION.TOGGLE_OPTION,
  payload: e.target.name
})

export const checkDirectory = id => ({
  type: ACTION.CHECK_DIRECTORY,
  payload: id
})

export const generateSources = async (ctx, e) => {
  e.preventDefault()

  const { directories } = ctx
  let sourceData = []
  
  if (ctx.pasteMode) {
    sourceData = convertSourcesToEntryMode(ctx.pasteSources)
  } else {
    sourceData = ctx.sources
      .map(src => ({ ...src }))
      .filter(src => notBlank(src.text))
  }

  sourceData = await Promise.all(sourceData.map(async src => {
    src.text = src.text.replace(/^\s*((courtesy:)|(source:))?\s*|(\s*$)/ig, '')

    if (ctx.sourcePrefix) src.text = `Source: ${src.text}`

    src.data = buildSource(src.text, ctx.renderOutput, ctx.sourceOnTop)
    src.text = src.text.replace(/(?<=^Source):/, '')

    return src
  }))

  try {
    await interop.saveSources({ sourceData, directories })
  } catch (err) {
    
  }
}
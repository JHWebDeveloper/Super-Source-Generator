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

const setSaving = () => ({
  type: ACTION.UPDATE_STATE,
  payload: {
    saving: true,
    error: false,
    message: false
  }
})

const success = () => ({
  type: ACTION.UPDATE_STATE,
  payload: {
    sources: [createNewSourceState()],
    pasteSources: '',
    saving: false,
    error: false,
    message: 'Your sources are ready.'
  }
})

const error = () => ({
  type: ACTION.UPDATE_STATE,
  payload: {
    saving: false,
    error: true,
    message: 'Sources failed to save. Please try again.'
  }
})

export const generateSources = ctx => async dispatch => {
  const { directories } = ctx
  let sourceData = []
  let tempDir = false

  if (directories.every(dir => !dir.checked)) {
    const { filePaths, canceled } = await interop.dialog.chooseDirectory()

    if (canceled) return

    tempDir = {
      checked: true,
      directory: filePaths[0]
    }

    directories.push(tempDir)
  } else {
    for (const dir of directories) {
      if (!dir.checked) continue

      const exists = await interop.checkIfDirectoryExists(dir.directory)

      if (exists) continue

      const res = await interop.dialog.directoryNotFoundAlert(dir.directory)

      dispatch(checkDirectory(dir.id))

      if (res === 1) return false
    }
  }

  dispatch(setSaving())

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

    src.data = buildSource(src.text, ctx.renderOutput)
    src.text = src.text.replace(/(?<=^Source):/, '')

    return src
  }))

  try {
    await interop.saveSources({
      sourceData,
      directories: directories.filter(dir => dir.checked)
    })
    dispatch(success())
  } catch (err) {
    dispatch(error())
  } finally {
    if (tempDir) directories.pop(tempDir)
  }
}

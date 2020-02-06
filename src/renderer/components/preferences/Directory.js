import React from 'react'
import { shape, string, number, bool, func } from 'prop-types'

import {
  checkDefault,
  addNewDirectory,
  deleteDirectoryWarn,
  updateLabel,
  chooseDirectory,
  moveDirectory
} from '../../actions/preferences'

const Directory = ({ dir, index, dispatch }) => {
  const { checked, label, directory, id } = dir

  return (
    <>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => dispatch(checkDefault(id))} />
      <span>
        <button
          name="add"
          title="Add directory"
          onClick={e => dispatch(addNewDirectory(index, e))}>
          add</button>
        <button
          name="delete"
          title="Delete directory"
          onClick={() => dispatch(deleteDirectoryWarn(id, label))}>
          remove</button>
      </span>
      <input
        type="text"
        name="label"
        value={label}
        onChange={e => dispatch(updateLabel(id, e))} />
      <span>
        <button
          title="Choose directory"
          onClick={() => dispatch(chooseDirectory(id))}>
          folder</button>
        <input
          type="text"
          name="directory"
          value={directory}
          readOnly />
      </span>
      <spam>
        <button
          name="up"
          title="Move directory up"
          onClick={() => dispatch(moveDirectory(dir, index - 1))}>
          keyboard_arrow_up</button>
        <button
          name="down"
          title="Move directory down"
          onClick={() => dispatch(moveDirectory(dir, index + 1))}>
          keyboard_arrow_down</button>
      </spam>
    </>
  )
}

Directory.propTypes = {
  dir: shape({
    checked: bool.isRequired,
    label: string.isRequired,
    directory: string.isRequired,
    id: string.isRequired
  }).isRequired,
  index: number.isRequired,
  dispatch: func.isRequired
}

export default Directory

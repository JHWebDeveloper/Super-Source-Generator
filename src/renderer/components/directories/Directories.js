import React, { useContext } from 'react'

import { PrefsContext } from '../../store/prefsStore'
import Directory from './Directory'

const Directories = () => {
  const { preferences, dispatch } = useContext(PrefsContext)
  const { directories } = preferences

  return (
    <fieldset name="directories">
      {directories.map(dir => (
        <Directory
          key={dir.id}
          dispatch={dispatch}
          {...dir} />
      ))}
    </fieldset>
  )
}

export default Directories

import React, { useContext } from 'react'

import { SSGContext } from '../../store'
import Directory from './Directory'

const Directories = () => {
  const { directories, dispatch } = useContext(SSGContext)

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

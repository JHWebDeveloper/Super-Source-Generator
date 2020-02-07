import React, { useContext } from 'react'

import { SSGContext } from '../../store'
import { toggleOption } from '../../actions/main'

const Options = () => {
  const { sourcePrefix, dispatch } = useContext(SSGContext)

  return (
    <fieldset name="options">
      <label>
        <input
          type="checkbox"
          name="sourcePrefix"
          onChange={e => dispatch(toggleOption(e))}
          checked={sourcePrefix} />
        Add "Source: " to beginning
      </label>
    </fieldset>
  )
}

export default Options

import React, { useCallback, useContext } from 'react'

import { SSGContext } from '../../store'
import { toggleOption } from '../../actions/main'

const { interop } = window.SSG

const Options = () => {
  const { sourcePrefix, sourceOnTop, sourceOnTopAlert, dispatch } = useContext(SSGContext)

  const toggleSourceOnTop = useCallback(async e => {
    e.persist()

    let response = 0

    if (sourceOnTopAlert && !sourceOnTop) {
      response = await interop.dialog.sourceOnTopAlert()
    }
  
    if (response === 0) dispatch(toggleOption(e))
  }, [sourceOnTop, sourceOnTopAlert])

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
      <label>
        <input
          type="checkbox"
          name="sourceOnTop"
          onChange={toggleSourceOnTop}
          checked={sourceOnTop} />
        Place source at top
      </label>
    </fieldset>
  )
}

export default Options

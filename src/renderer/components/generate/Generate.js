import React, { useCallback, useContext } from 'react'

import { SSGContext } from '../../store'

const Generate = () => {
  const { sources, pasteSources, pasteMode } = useContext(SSGContext)

  return (
    <button
      type="submit"
      name="generate"
      title="Generate Sources"
      disabled={!sources.some(src => src.text) || (pasteMode && !pasteSources)}>
      Generate
    </button>
  )
}

export default Generate

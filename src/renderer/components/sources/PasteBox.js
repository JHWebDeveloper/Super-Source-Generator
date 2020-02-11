import React, { useEffect, useRef } from 'react'
import { func, string } from 'prop-types'

import { updatePasteSources } from '../../actions/main'

const PasteBox = ({ pasteSources, dispatch }) => {
  const textRef = useRef()

  useEffect(() => {
    const { current } = textRef

    current.focus()
    current.selectionStart = current.value.length
  }, [])

  return (
    <textarea
      ref={textRef}
      onChange={e => dispatch(updatePasteSources(e))}
      value={pasteSources}
      placeholder="Here you can type or paste a list of sources each separated by a comma (e.g. Source 1, Source 2, ...)"></textarea>
  )
}

PasteBox.propTypes = {
  pasteSources: string,
  dispatch: func.isRequired
}

export default PasteBox

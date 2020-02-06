import React from 'react'

import { updatePasteSources } from '../../actions/main'

const PasteBox = ({ pasteSources, dispatch }) => (
  <textarea
    onChange={e => dispatch(updatePasteSources(e))}
    value={pasteSources}
    placeholder="Here you can type or paste a list of sources each separated by a comma (e.g. Source 1, Source 2, ...)"></textarea>
)

export default PasteBox

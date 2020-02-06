import React, { useContext } from 'react'

import { SSGContext } from '../../store'
import { toggleMode } from '../../actions/main'
import PasteBox from './PasteBox'
import SourceInput from './SourceInput'
import ToggleSwitch from './ToggleSwitch'

const SourceEntries = () => {
  const { pasteMode, sources, pasteSources, dispatch } = useContext(SSGContext)

  return (
    <>
      <fieldset name="sources">
        {pasteMode ? (
          <PasteBox pasteSources={pasteSources} dispatch={dispatch}/>
        ) : (
          sources.map(source => (
            <SourceInput
              key={source.id}
              dispatch={dispatch}
              {...source} />
          ))
        )}
      </fieldset>
      <button
        type="button"
        title={`Enter ${pasteMode ? 'entry' : 'paste'} mode`}
        onClick={() => dispatch(toggleMode(sources, pasteSources, pasteMode))}>
        Entry
        <ToggleSwitch toggleOn={pasteMode}/>
        Paste
      </button>
    </>
  )
}

export default SourceEntries

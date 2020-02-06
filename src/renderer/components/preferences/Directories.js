import React, { useContext } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

import { PrefsContext } from '../../store/prefsStore'
import { addNewDirectory } from '../../actions/preferences'
import Directory from './Directory'

const Directories = () => {
  const { preferences, dispatch } = useContext(PrefsContext)
  const { directories } = preferences

  if (directories.length === 0) dispatch(addNewDirectory(0, false))

  return (
    <fieldset name="directories">
      <legend>Save Shortcuts</legend>
      <span>Def.</span>
      <span>Label</span>
      <span>Folder</span>
      <CSSTransitionGroup
        component="tbody"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={250}
        transitionName={{
          enter: 'dir-enter',
          enterActive: 'dir-enter-active',
          leave: 'dir-leave',
          leaveActive: 'dir-leave-active'
        }}>
        {directories.map((dir, i) => (
          <Directory
            key={dir.id}
            index={i}
            dispatch={dispatch}
            dir={dir} />
        ))}
      </CSSTransitionGroup>
    </fieldset>
  )
}

export default Directories

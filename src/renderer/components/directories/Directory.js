import React from 'react'

import { checkDirectory } from '../../actions/main'

const Directory = ({ id, checked, label, dispatch }) => (
  <label>  
    <input
      type="checkbox" 
      checked={checked}
      onChange={() => dispatch(checkDirectory(id))} />
    { label }
  </label>
)

export default Directory

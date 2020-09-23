import React from 'react'
import { string, func, arrayOf, shape, bool } from 'prop-types'
import { v1 as uuid } from 'uuid'

import { changeRadioValue } from '../../actions/preferences'

const RadioSet = ({ name, state, dispatch, buttons }) => (
  buttons.map(({ label, value, omit }) => (omit ? false :
    <label key={uuid()}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={state === value}
        onChange={e => dispatch(changeRadioValue(e))} />
      {label}
    </label>
  ))
)

RadioSet.propTypes = {
  name: string.isRequired,
  state: string.isRequired,
  dispatch: func.isRequired,
  buttons: arrayOf(shape({
    label: string.isRequired,
    value: string,
    omit: bool
  })).isRequired
}

export default RadioSet

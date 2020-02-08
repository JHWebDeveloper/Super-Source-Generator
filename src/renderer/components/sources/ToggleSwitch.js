import React from 'react'
import { bool } from 'prop-types'

const ToggleSwitch = ({ toggleOn }) => {
  return (
    <svg fill="#fc0c18" viewBox="0 0 24 24">
      <path d={toggleOn
        ? 'M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3'
        : 'M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'} />
    </svg>
  )
}

ToggleSwitch.propTypes = {
  toggleOn: bool
}

export default ToggleSwitch

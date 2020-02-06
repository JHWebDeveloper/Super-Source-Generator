import React, { useContext } from 'react'

import { SSGContext } from '../../store'
import { generateSources } from '../../actions/main'

import Sources from '../sources/Sources'
import Options from '../options/Options'
import Directories from '../directories/Directories'
import Generate from '../generate/Generate'

const Form = () => {
  const ctx = useContext(SSGContext)

  return (
    <form onSubmit={e => generateSources(ctx, e)}>
      <Sources />
      <Options />
      <Directories />
      <Generate />
    </form>
  )
}

export default Form

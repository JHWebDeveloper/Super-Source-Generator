import React from 'react'
import { bool, string, func } from 'prop-types'

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

Directory.propTypes = {
	id: string.isRequired,
	checked: bool.isRequired,
	label: string.isRequired,
	dispatch: func.isRequired
}

export default Directory

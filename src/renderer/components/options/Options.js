import React, { useContext } from 'react'

import { SSGContext } from '../../store'
import { toggleOption } from '../../actions/main'

const Options = () => {
	const { sourcePrefix, sourceOnTop, dispatch } = useContext(SSGContext)

	return (
		<fieldset name="options">
			<label>
				<input
					type="checkbox"
					name="sourcePrefix"
					onChange={e => dispatch(toggleOption(e))}
					checked={sourcePrefix} />
				Add &quot;Source: &quot; to beginning
			</label>
			<label>
				<input
					type="checkbox"
					name="sourceOnTop"
					onChange={e => dispatch(toggleOption(e))}
					checked={sourceOnTop} />
				Place source at top
			</label>
		</fieldset>
	)
}

export default Options

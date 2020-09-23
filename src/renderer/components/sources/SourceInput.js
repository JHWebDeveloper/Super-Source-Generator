import React, { useEffect, useRef  } from 'react'
import { func, string } from 'prop-types'

import { addSource, removeSource, updateSourceText } from '../../actions/main'

const SourceInput = ({ id, text, dispatch }) => {
	const inputRef = useRef()

	useEffect(() => {
		const { current } = inputRef

		if (current.parentElement.matches('span:first-of-type')) {
			current.focus()
		}
	}, [])

	return (
		<span>
			<input
				type="text"
				ref={inputRef}
				onChange={e => dispatch(updateSourceText(id, e))}
				onKeyDown={e => e.keyCode === 13 && dispatch(addSource())}
				value={text}
				maxLength="51"
				placeholder="Type source name here" />
			<button
				type="button"
				name="add-source"
				title="Add Source"
				onClick={() => dispatch(addSource())}>add</button>
			<button
				type="button"
				name="remove-source"
				title="Remove Source"
				onClick={() => dispatch(removeSource(id))}>remove</button>
		</span>
	)
}

SourceInput.propTypes = {
	id: string.isRequired,
	text: string.isRequired,
	dispatch: func.isRequired
}

export default SourceInput

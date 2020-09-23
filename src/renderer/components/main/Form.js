import React, { useCallback, useContext } from 'react'

import { SSGContext } from '../../store'
import { generateSources } from '../../actions/main'

import Sources from '../sources/Sources'
import Options from '../options/Options'
import Directories from '../directories/Directories'
import Spinner from '../misc/Spinner'

const Form = () => {
	const ctx = useContext(SSGContext)
	const { sources, pasteMode, pasteSources, saving, message } = ctx

	const submitPreventDefault = e => {
		e.preventDefault()
		ctx.dispatch(generateSources(ctx))
	}

	const onEnterPreventDefault = useCallback(e => {
		if (e.keyCode === 13) e.preventDefault()
	})

	return (
		<form
			onSubmit={submitPreventDefault}
			onKeyDown={onEnterPreventDefault}>
			<Sources />
			<Options />
			<Directories />
			<button
				type="submit"
				name="generate"
				title="Generate Sources"
				disabled={saving || !sources.some(src => src.text) || pasteMode && !pasteSources}>
				{saving ? <Spinner /> : 'Generate'}
			</button>
			{message && <p className={ctx.error ? 'error' : ''}>{message}</p>}
		</form>
	)
}

export default Form

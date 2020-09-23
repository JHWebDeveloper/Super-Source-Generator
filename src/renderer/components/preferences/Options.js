import React from 'react'

import RadioSet from '../misc/RadioSet'
import { func, string } from 'prop-types'

const _720  = '1280x720'
const _1080 = '1920x1080'

const Options = ({ renderOutput, theme, dispatch }) => (
	<>
		<fieldset name="render-output-options">
			<legend>Render Output</legend>
			<RadioSet 
				name="renderOutput"
				state={renderOutput}
				dispatch={dispatch}
				buttons={[
					{
						label: _720,
						value: _720
					},
					{
						label: _1080,
						value: _1080
					}
				]}/>
		</fieldset>
		<fieldset name="theme-options">
			<legend>Theme</legend>
			<RadioSet
				name="theme"
				state={theme}
				dispatch={dispatch}
				buttons={[
					{
						label: 'Dark',
						value: 'dark'
					},
					{
						label: 'Classic',
						value: 'classic'
					}
				]} />
		</fieldset>
	</>
)

Options.propTypes = {
	renderOutput: string.isRequired,
	theme: string.isRequired,
	dispatch: func.isRequired
}

export default Options

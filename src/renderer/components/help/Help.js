import React, { useEffect, useState } from 'react'
import '../../css/help.css'

import { PrefsProvider } from '../../store/prefsStore'

const Help = () => {
	const [ version, setVersion ] = useState(false)

	useEffect(() => {
		(async () => {
			setVersion(await window.SSG.interop.getVersion())
		})()
	}, [])

	return (
		<PrefsProvider>
			<main>
				<section>
					<h2>About</h2>
					{version && <p>Super Source Generator Version {version}</p>}
					<p>Super Source Generator is a web app developed by Jonathan Hamilton to help Ch9 employees produce single or multiple source overlays on the fly. No photoshop experience necessary.</p>
				</section>
				<section>
					<h2>Adding a Source Name</h2>
					<p>To add a source name simply type the source in the text box reading <q>Source Name Goes Here</q>.</p>
					<p>If you wish to create more than one source overlay, click the <q>+</q> button next to the textbox. The current text box will move to the next line and new blank text box will appear in its place.</p>
					<p>While the top text box is in focus, pressing the ENTER key will also create a new source line.</p>
					<p>Should you want to remove a source line simply click the <q>-</q> button next to it.</p>
					<p>If a source line is left blank it will be ignored. A blank source overlay will not be created.</p>
				</section>
				<section>
					<h2>Options</h2>
					<h3>Add <q>Source: </q> to beginning</h3>
					<p>Selecting this option will automatically add the required prefix <q>Source: </q> to the beginning of each generated source overlay.</p>
					<p>If you are to type <q>Source:</q> yourself, this will be removed from the source name.</p>
					<p>If you are to type <q>Courtesy:</q> which is not permitted, this will be removed from the source name and replaced with <q>Source: </q> should the Add Source option be selected.</p>
					<p>The Add Source option is selected by default.</p>
					<h3>Save to Final Mugs</h3>
					<p>Selecting this option will save your generated source to the Final Mugs folder on the K Drive when generated.</p>
					<p>This option is selected by default.</p>
					<h3>Save to Premade Folder</h3>
					<p>Selecting this option will save your generated source to the Premade Folder under News Resources on the K Drive when generated. The Premade folder is where Editors keep source overlays we may need in the future.</p>
					<p>Not all source overlays should be saved to this folder. Sources that should be saved are ones we will likely need in the future (e.g. Source: Orlando Police Department), however if the source is something very specific, like a viewer&apos;s twitter handle, there is no need to save to this folder.</p>
					<p>To avoid archiving unimportant sources, this option is not selected by default.</p>
				</section>
				<section>
					<h2>Generate Button</h2>
					<p>Clicking this button will generate the final source overlay(s) to the selected save locations.</p>
					<p>For this button to work at least one source must be filled out and the Save to Final Mugs and/or Save to Premade Folder options must be selected.</p>
				</section>
				<section>
					<h2>Paste Mode</h2>
					<p>You will notice a small button under the box containing the source name lines labeled <q>Paste Mode</q>. Clicking this button will enter Paste Mode and replace the source lines with a large text box.</p>
					<p>In Paste Mode, rather than create a separate line for each source, you may type a list of sources each separated by commas. You may also type this list in an external application and copy and paste it into the text box. This should be used for very large batch creations where creating a new line for each source would be time consuming.</p>
					<p>Please note that if your source contains a comma, this will be split into two different sources. You will have to Create this source overlay in Entry Mode.</p>
					<p>To exit Paste Mode click the button labeled <q>Entry Mode</q>.</p>
				</section>
			</main>
		</PrefsProvider>
	)
}

export default Help

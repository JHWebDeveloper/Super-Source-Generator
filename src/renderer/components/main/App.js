import React, { useEffect, useState } from 'react'
import '../../css/index.css'

import { PrefsProvider } from '../../store/prefsStore'
import Header from './Header'
import Update from '../update/Update'
import Main from './Main'

const fonts = [
	['Inter', 'url(./assets/font/Inter-SemiBold.woff2)']
]

const App = () => {
	const [ fontsLoaded, setFontsLoaded ] = useState(false)

	useEffect(() => {
    (async () => {
      await Promise.all(fonts.map(async fontAttr => {
        const font = new FontFace(...fontAttr)

        await font.load()

        document.fonts.add(font)
      }))

      setFontsLoaded(true)
    })()
  }, [])

	return fontsLoaded ? (
		<>
			<Header />
			<Update />
			<PrefsProvider>
				<Main />
			</PrefsProvider>
		</>
	) : <></>
}

export default App

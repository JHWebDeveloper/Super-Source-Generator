const initTabbedBrowsing = () => {
	document.body.onkeydown = function (e) {
		if (e.key !== 'Tab') return true
		
		this.className = 'accessible'
		this.onkeydown = false
	}
}

export default initTabbedBrowsing

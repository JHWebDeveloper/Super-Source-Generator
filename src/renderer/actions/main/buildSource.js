const layout = {
	'720': onTop => ({
		fontSize: 13.777778,
		txtX: onTop ? 38 : 1242, 
		txtY: onTop ? 171.333333 : 563.333333,
		maxW: 322,
		pad: 18,
		boxY: onTop ? 148 : 539.333333,
		boxH: 33.333333
	}),
	'1080': onTop => ({
		fontSize: 20.666667,
		txtX: onTop ? 57 : 1863,
		txtY: onTop ? 257 : 845,
		maxW: 483,
		pad: 28,
		boxY: onTop ? 222 : 809,
		boxH: 50
	})
}

export default (src, output, sourceOnTop) => {
	const cnv = document.createElement('canvas')
	const ctx = cnv.getContext('2d')
	const [ width, height ] = output.split('x')
	const { fontSize, txtX, txtY, maxW, pad, boxY, boxH } = layout[height](sourceOnTop)

	cnv.width = width
	cnv.height = height

	ctx.globalCompositeOperation = 'destination-over'
	ctx.fillStyle = '#ffffff'

	ctx.font = `${fontSize}px Inter`
	ctx.save()
	ctx.globalCompositeOperation = 'source-over'
	ctx.textAlign = sourceOnTop ? 'left' : 'right'
	ctx.textBaseline = 'bottom'
	ctx.lineWidth = 2
	ctx.strokeStyle = '#000000'
	ctx.shadowColor = '#000000'
	ctx.shadowOffsetX = Math.cos(5.35816) + 1 // Converted from .psd that has the shadow angle at 127° and distance at 1px
	ctx.shadowOffsetY = Math.sin(5.35816) + 1
	ctx.strokeText(src, txtX, txtY, maxW)
	ctx.fillText(src, txtX, txtY, maxW)
	ctx.restore()

	const txtW = Math.min(ctx.measureText(src).width, maxW)
	const boxW = (sourceOnTop ? txtX : width - txtX) + txtW + pad

	ctx.fillStyle = 'rgba(0,0,0,0.4)'
	ctx.fillRect(sourceOnTop ? 0 : width - boxW, boxY, boxW, boxH)

	return cnv.toDataURL().replace(/^data:image\/\w+;base64,/, '')
}

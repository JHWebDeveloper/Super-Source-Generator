const _720 = {
  fontSize: 25,
  txtX: 640, 
  txtY: 684,
  minW: 330,
  pad: 40,
  boxY: 659,
  boxH: 33
}

const _1080 = {
  fontSize: 37.5,
  txtX: 960,
  txtY: 1026,
  minW: 495,
  pad: 60,
  boxY: 988.5,
  boxH: 9.5
}

export default (src, output) => {
  const cnv = document.createElement('canvas')
  const ctx = cnv.getContext('2d')
  const [width, height] = output.split('x')

  const { fontSize, txtX, txtY, minW, pad, boxY, boxH } = height === '720' ? _720 : _1080

  cnv.width = width
  cnv.height = height

  ctx.globalCompositeOperation = 'destination-over'

  ctx.fillStyle = '#ffffff'
  ctx.font      = `${fontSize}px Gotham`
  ctx.textAlign = 'center'
  ctx.fillText(src, txtX, txtY)

  const txtW = Math.max(minW, ctx.measureText(src).width + pad)

  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fillRect(txtX - txtW / 2, boxY, txtW, boxH)

  return cnv.toDataURL().replace(/^data:image\/\w+;base64,/, '')
}
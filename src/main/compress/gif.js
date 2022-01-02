const path = require('path')
const gifFrames = require('gif-frames');
const execa = require('execa')
const gifsicle = require('gifsicle')


const compressGif = async ({
  url,
  options
}) => {
  const { destination, colorQuality, frameQuality } = options;
  const fileName = path.basename(url)
  const frames = await gifFrames({
    url,
    frames: 'all'
  })
  const framesCount = frames.length
  const removeFramesCount = framesCount * frameQuality
  let gap = Math.round((framesCount - removeFramesCount) / removeFramesCount )
  console.log('gap', gap)
  let delayList = [];
  let totaldelay = 0
  const framesInfos = frames.map(f => f.frameInfo)
  const paletteSize = framesInfos[0].palette_size

  let i
  for (i = 0; i < framesInfos.length; i++) {
    delayList[i] = framesInfos[i].delay
    totaldelay += delayList[i]
  }
  let totalFrame = parseInt(framesCount / gap)
  if (totaldelay / totalFrame > 20) {
    let scale = (totalFrame * 1.0 * 20) / totaldelay
    for (let i = 0; i < delayList.length; i++) {
      delayList[i] = parseInt(delayList[i] * scale)
    }
  }

  let params = []
  const palette = Math.round(paletteSize * colorQuality) || '2'
  colorQuality !== 1 && params.push(`--colors=${palette}`)
  params.push("--unoptimize")
  params.push(url)

  let tempdelay = delayList[0]
  for (let i = 1; i < framesCount; i++) {
    if (i % gap == 0) {
      params.push("-d" + tempdelay)
      params.push("#" + (i - gap))
      tempdelay = 0
    }
    tempdelay += delayList[i]
  }
  params.push("--optimize=3")
  params.push("-o")
  params.push(`${destination}/${fileName}`)
  await execa(gifsicle, params)
}

const main = async (paths, options) => {
  const gifPaths = paths.filter(p => path.extname(p) === '.gif')
  if (!gifPaths.length) return;
  await Promise.all(gifPaths.map(async p => await compressGif({ url: p, options })))
}

export default main
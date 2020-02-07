import { promises as fsp } from 'fs'
import path from 'path'

const filterBadChars = (str, p1, p2, p3) => {
  if (p1) return 'and'
  if (p2) return '2A'
  if (p3) return encodeURIComponent(p3).replace(/%/g, '')
}

const cleanFileName = fileName => fileName.replace(/(&)|(\*)|([%"/:;<>?\\`|ŒœŠšŸ​]|[^!-ż\s])/g, filterBadChars)

export const saveSources = async ({ sourceData, directories }) => (
  Promise.all(sourceData.map(async src => (
    Promise.all(directories.map(async dir => (
      fsp.writeFile(
        `${path.join(dir.directory, cleanFileName(src.text))}.png`,
        Buffer.from(src.data, 'base64'),
      )
    )))
  )))
)

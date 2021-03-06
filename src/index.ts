import * as prompts from 'prompts'
import * as fs from 'fs'

// Const
const DEFAULT_PATHS = {keywords: 'txt/keywords.txt', page_format: 'txt/page_format.txt', page_type: 'txt/page_type.txt', savePath: 'txt/d0rks.txt'}
const RN = process.platform.toString() === 'win32' ? '\r\n' : '\n'


console.log('\x1b[32mWelcome to DORKS GEN TS\x1b[0m by \x1b[33mSourciluss667\x1b[0m')
console.log('\x1b[34m Ver 1.1 !\x1b[0m Use (keywords, page_format, page_type).txt files')

// Names of Pages (Keywords)  PageFormat PageType

const errorCallback = function (err: any, desc: string) {
  console.log('\x1b[31m' + desc + '\x1b[0m')
  console.error(err)
  process.exit(-1)
}

const getPaths = async function (): Promise<prompts.Answers<"keywords" | "page_type" | "page_format">> {
  const paths = await prompts([
    {
      type: 'text',
      name: 'keywords',
      message: 'Path of keywords (default: txt/keywords.txt)? '
    },
    {
      type: 'text',
      name: 'page_type',
      message: 'Path of Page Type (default: txt/page_type.txt)? '
    },
    {
      type: 'text',
      name: 'page_format',
      message: 'Path of Page Format (default: txt/page_format.txt)? '
    }
  ])

  if (paths.keywords === '') paths.keywords = DEFAULT_PATHS.keywords
  if (paths.page_format === '') paths.page_format = DEFAULT_PATHS.page_format
  if (paths.page_type === '') paths.page_type = DEFAULT_PATHS.page_type

  return paths
}


const main = async function () {

  const mode: prompts.Answers<"value"> = await (async () => {
    return await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose a mode : ',
      choices: [
        { title: 'base', value: '0' },
        { title: 'inurl', value: '1' },
        { title: 'keywords detached', value: '2' },
        { title: 'keywords and inurl', value: '3'}
      ],
      initial: 0
    })
  })()

  const paths: prompts.Answers<"keywords" | "page_type" | "page_format"> = await getPaths()

  // Utiliser FS
  // Load files
  let keywordsRead: Buffer, pageTypeRead: Buffer, pageFormatRead: Buffer

  try {
    keywordsRead = fs.readFileSync(paths.keywords)
    pageTypeRead = fs.readFileSync(paths.page_type)
    pageFormatRead = fs.readFileSync(paths.page_format)
  } catch (err) {
    errorCallback(err, 'Can\'t open txt file(s).')
  }
  
  // Make array
  let keywords: string[]
  let pageTypes: string[]
  let pageFormats: string[]

  if (mode.value == 0 || mode.value == 1) {
    keywords = keywordsRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
    pageTypes = pageTypeRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
    pageFormats = pageFormatRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
  } else if (mode.value == 3) {
    keywords = keywordsRead.toString().replace(/ /g, '"+"').split(RN) // Ajouter " debut et fin
    for (let i = 0; i < keywords.length; i++) { keywords[i] = `"${keywords[i]}"` }
    pageTypes = pageTypeRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
    pageFormats = pageFormatRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
  } else {
    keywords = keywordsRead.toString().split(RN)
    pageTypes = pageTypeRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
    pageFormats = pageFormatRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
  }

  const filterFunc = (el: string) => {
    return el.replace(/ /g, '') === '' ? null : el
  }

  keywords = keywords.filter(filterFunc)
  pageTypes = pageTypes.filter(filterFunc)
  pageFormats = pageFormats.filter(filterFunc)

  // Make string with all dorks
  let strDorks: string = 'Dorks generated by DORKS-GEN-TS (use this with [ inurl: ])' + RN

  // [keyword][page_type][page_format] => [minecraft][.php?][userid=]
  keywords.forEach(keyword => {
    pageTypes.forEach(pagetype => {
      pageFormats.forEach(pageformat => {
        if (mode.value == 0) {
          strDorks += `${RN}${keyword}${pagetype}${pageformat}`
        } else if (mode.value == 1) {
          strDorks += `${RN}inurl:${keyword}${pagetype}${pageformat}`
        } else if (mode.value == 2) {
          strDorks += `${RN}${keyword} ${pagetype}${pageformat}`
        } else if (mode.value == 3) {
          strDorks += `${RN}${keyword} inurl:"${pagetype}${pageformat}"`
        }
      });
    });
  });

  let rows: number
  if (process.platform.toString() === 'win32') {
    rows = strDorks.match(/\r\n/g).length - 1
  } else {
    rows = strDorks.match(/\n/g).length - 1
  }

  console.log(`\nThis shit make \x1b[32m${rows}\x1b[0m dorks !\n`)

  // Where to save ?
  const savePath: prompts.Answers<"s"> = await prompts([
    {
      type: 'text',
      name: 's',
      message: 'Where to save .txt ? '
    }
  ])

  if (savePath.s === '') savePath.s = DEFAULT_PATHS.savePath

  fs.writeFile(savePath.s, strDorks, err => {
    if (err) errorCallback(err, 'Write file fail !')

    console.log(`\n\x1b[32mWrite file succesful at ${savePath.s} !\x1b[0m`)
  })
}


main()

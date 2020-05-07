import * as prompts from 'prompts'
import * as fs from 'fs'

// Const
const DEFAULT_PATHS = {keywords: 'txt/keywords.txt', page_format: 'txt/page_format.txt', page_type: 'txt/page_type.txt'}
const RN = process.platform.toString() === 'win32' ? '\r\n' : '\n'


console.log('\x1b[32mWelcome to DORKS GEN TS\x1b[0m by \x1b[33mSourciluss667\x1b[0m')
console.log('\x1b[34mFirst version !\x1b[0m Use (keywords, page_format, page_type).txt files')
console.log('Use this with \x1b[32m[ inurl: ]\x1b[0m\n')

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
  const keywords: string[] = keywordsRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
  const pageTypes: string[] = pageTypeRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)
  const pageFormats: string[] = pageFormatRead.toString().replace(/ /g, '').replace(/:/g, '').split(RN)

  // Make string with all dorks
  let strDorks: string = 'Dorks generated by DORKS-GEN-TS (use this with [ inurl: ])' + RN

  // [keyword][page_type][page_format] => [minecraft][.php?][userid=]
  keywords.forEach(keyword => {
    pageTypes.forEach(pagetype => {
      pageFormats.forEach(pageformat => {
        strDorks += `${RN}${keyword}${pagetype}${pageformat}`
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

  fs.writeFile(savePath.s, strDorks, err => {
    if (err) errorCallback(err, 'Write file fail !')

    console.log(`\n\x1b[32mWrite file succesful at ${savePath.s} !\x1b[0m`)
  })
}


main()

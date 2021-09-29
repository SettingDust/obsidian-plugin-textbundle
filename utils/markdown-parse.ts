const regex = {
  image: /!\[(.*?)]\((.*?)\s?(".+")?\)/g,
  imageUrl: /(!\[.*?]\().*?(\s?(?:".+")?\))/,
}

export interface Images {
  index?: number,
  url?: string,
  title?: string,
  alt?: string
}

export function extractImages(markdown: string) {
  return [...markdown.matchAll(regex.image)].map(value => {
    const result: Images = {}
    result.index = value.index
    result.alt = value[1]
    result.url = value[2]
    if (value[3]) result.title = value[3]
    return result
  })
}

export function replaceFirstAfter(input: string, searchValue: string | RegExp, replaceValue: string, index: number) {
  return `${input.slice(0, index)}${input.slice(index).replace(searchValue, replaceValue)}`
}

function replaceImage(markdown: string, replaceValue: string, index: number) {
  return replaceFirstAfter(markdown, regex.imageUrl, `$1${replaceValue}$2`, index)
}

export function replaceAllImages(markdown: string, replaceValues: { [key: string]: number }) {
  let temp = markdown
  for (const [value, index] of Object.entries(replaceValues))
    temp = replaceImage(temp, value, index)
  return temp
}

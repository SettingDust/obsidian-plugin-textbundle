const regex = {
  image: /!\[(.*?)]\((.*?)\s?(".+")?\)/g,
  imageUrl: /(!\[.*?]\().*?(\s?(?:".*?")?\))/,
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

export function replaceAllImages(markdown: string, replaceValues: { [key: string]: number }) {
  let temp = markdown
  let delta = 0
  for (const [value, index] of Object.entries(replaceValues)) {
    const currentIndex = index - delta
    const result = regex.imageUrl.exec(temp.slice(currentIndex))
    delta += result[0].length - result[1].length - result[2].length - value.length
    temp = temp.slice(0, currentIndex) + temp.slice(currentIndex).replace(regex.imageUrl, `$1${value}$2`)
  }
  return temp
}

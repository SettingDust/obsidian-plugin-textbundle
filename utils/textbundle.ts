import {extractImages, replaceAllImages} from "./markdown-parse";
import Downloader from "nodejs-file-downloader";
import {writeFileSync} from "fs";
import {FileSystemAdapter, MarkdownView} from "obsidian";

interface Options {
  version: number,
  type: string,
  transient: boolean,
  creatorURL: string,
  creatorIdentifier: string,
  sourceURL: string
}

const defaultOptions: Partial<Options> = {
  version: 2,
  type: "net.daringfireball.markdown",
  transient: false,
  creatorIdentifier: "com.github.settingdust.obsidian-plugin"
}

export function downloadFiles(directory: string, ...urls: string[]) {
  return urls.map(url => new Promise<string>(resolve => {
      let name = ""
      const downloader = new Downloader({
        url,
        directory,
        cloneFiles: false,
        onBeforeSave(finalName: string): string | void {
          name = finalName
        }
      })
      downloader.download().then(() => resolve(name))
    })
  )
}

export async function cleanImages(markdown: string, files: string[]) {
  const images = extractImages(markdown).filter(it => {
    try {
      new URL(it.url);
      return true;
    } catch (err) {
      return false;
    }
  })
  return replaceAllImages(
    markdown,
    images.reduce((prev: { [key: string]: number }, curr, index) => ({...prev, [files[index]]: curr.index}), {})
  )
}

export async function textbundle(view: MarkdownView, options: Partial<Options> = {}) {
  const content = view.getViewData()
  const mergedOptions = {...defaultOptions, ...options}
  const images = extractImages(content)
  const currentFile = view.file;
  const adapter = currentFile.vault.adapter as FileSystemAdapter
  const currentDir = adapter.getFullPath(`${currentFile.parent.name}/${currentFile.basename}.textbundle`)
  const files = await Promise.all(downloadFiles(`${currentDir}/assets`, ...images.map(it => it.url)));
  const cleanedContent = await cleanImages(content, files.map(it => `assets/${it}`))
  writeFileSync(`${currentDir}/text.md`, cleanedContent)
  writeFileSync(`${currentDir}/info.json`, JSON.stringify(mergedOptions, null, 2))
}

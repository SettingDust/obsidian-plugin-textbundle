import {cleanImages, downloadFiles, textbundle} from "../utils/textbundle";
import {extractImages, replaceAllImages} from "../utils/markdown-parse";
import {removeSync} from "fs-extra";
import 'chai/register-should';
import {existsSync, readFileSync} from "fs";
import assert from "assert";


const markdown = `Once installed, Markdown will appear as an option in Movable Type’s Text Formatting pop-up menu. This is selectable on a per-post basis:

![Screenshot of Movable Type 'Text Formatting' Menu](https://daringfireball.net/graphics/markdown/mt_textformat_menu.png)

Markdown translates your posts to HTML when you publish; the posts themselves are stored in your MT database in Markdown format.`

const markdownWithMoreImage = `[![61168030ddaef1f9bc2d44b3.png](https://czse7cxw.xyz/item/61168030ddaef1f9bc2d44b3.png)](https://czse7cxw.xyz/item/6116812bddaef1f9bc2d5bbe.jpg)![6116812bddaef1f9bc2d5bbe.jpg](https://czse7cxw.xyz/item/6116812bddaef1f9bc2d5bbe.jpg)![6116811addaef1f9bc2d59f0.jpg](https://czse7cxw.xyz/item/6116811addaef1f9bc2d59f0.jpg)`

const imageName = 'mt_textformat_menu.png';

describe('textbundle', function () {
  after(function () {
    removeSync("./assets")
    removeSync("./output")
  });

  it('downloadFiles', function () {
    this.timeout(15000)
    return Promise
      .all(downloadFiles('./assets', ...extractImages(markdown).map(it => it.url)))
      .then(value => {
        value.should.deep.eq([imageName])
        existsSync(`./assets/mt_textformat_menu.png`).should.be.true
      })
  });
  it('cleanImages', function () {
    return cleanImages(markdownWithMoreImage, ["61168030ddaef1f9bc2d44b3.png", "6116812bddaef1f9bc2d5bbe.png", "6116811addaef1f9bc2d59f0.png"])
      .then(value => {
        value.should.deep.eq(
          markdownWithMoreImage
            .replace('https://czse7cxw.xyz/item/61168030ddaef1f9bc2d44b3.png', '61168030ddaef1f9bc2d44b3.png')
            .replace('https://czse7cxw.xyz/item/6116812bddaef1f9bc2d5bbe.png', '6116812bddaef1f9bc2d5bbe.png')
            .replace('https://czse7cxw.xyz/item/6116811addaef1f9bc2d59f0.png', '6116811addaef1f9bc2d59f0.png')
        )
      })
  });
});

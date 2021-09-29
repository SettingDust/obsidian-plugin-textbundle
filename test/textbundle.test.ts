import {cleanImages, downloadFiles, textbundle} from "../utils/textbundle";
import {extractImages} from "../utils/markdown-parse";
import {removeSync} from "fs-extra";
import 'chai/register-should';
import {existsSync, readFileSync} from "fs";


const markdown = `Once installed, Markdown will appear as an option in Movable Type’s Text Formatting pop-up menu. This is selectable on a per-post basis:

![Screenshot of Movable Type 'Text Formatting' Menu](https://daringfireball.net/graphics/markdown/mt_textformat_menu.png)

Markdown translates your posts to HTML when you publish; the posts themselves are stored in your MT database in Markdown format.`

const imageName = 'mt_textformat_menu.png';

describe('textbundle', function () {
  after(function () {
    removeSync("./assets")
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
    return cleanImages(markdown, ["mt_textformat_menu.png"])
      .then(value => {
        value.should.deep.eq(markdown.replace('https://daringfireball.net/graphics/markdown/mt_textformat_menu.png', 'mt_textformat_menu.png'))
      })
  });
});

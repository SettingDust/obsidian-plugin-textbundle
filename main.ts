import {Plugin} from 'obsidian';
import {textbundle} from "./utils/textbundle";

interface MyPluginSettings {

}

const DEFAULT_SETTINGS: MyPluginSettings = {}

// noinspection JSUnusedGlobalSymbols
export default class TextBundlePlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    this.addCommand({
      id: 'convert-textbundle',
      name: 'Convert to Textbundle',
      editorCallback: (editor, view) => {
        textbundle(view, {
          creatorURL: `obsidian://open?vault=${this.app.vault.getName()}`,
          sourceURL: `obsidian://open?vault=${this.app.vault.getName()}&file=${view.file.path}`
        })
      }
    });
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      const elemTarget = (evt.target as Element);
      let folderPath = '';
      let folderName = '';
      let folderElem = elemTarget;
      if (elemTarget.hasClass('nav-folder-title-content')) {
        folderName = folderElem.getText();
        folderElem = elemTarget.parentElement;
        folderPath = folderElem.getAttribute('data-path');
      } else if (elemTarget.hasClass('nav-folder-title')) {
        folderPath = elemTarget.getAttribute('data-path');
        folderName = elemTarget.lastElementChild.getText();
      }
      if (!folderName.endsWith(".textbundle")) return
      if (!this.app.vault.adapter.exists(folderPath)) return
      if (folderPath.length) {
        if (!folderPath.endsWith(folderName))
          folderPath = folderPath.slice(0, folderPath.lastIndexOf('/')) + folderName;

        this.app.workspace.openLinkText(`${folderPath}/text.md`, '')
      }
    });
  }
}

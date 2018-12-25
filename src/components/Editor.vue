<template>
  <div id="editor" :style="styles"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import ace from "brace";

require("brace/mode/javascript");
require("brace/ext/language_tools");

@Component
export default class Editor extends Vue {
  @Prop({ required: true, type: String }) width!: string;
  @Prop({ required: true, type: String }) height!: string;

  private editor!: ace.Editor;

  async mounted() {
    const langTools = ace.acequire("ace/ext/language_tools");
    this.editor = ace.edit("editor");
    this.loadDefaultSettings();

    const autoCompleter = {
      getCompletions(
        editor: ace.Editor,
        session: any,
        pos: any,
        prefix: any,
        callback: any
      ) {
        if (prefix.length === 0) {
          callback(null, []);
          return;
        }

        const playerMethods = [
          "player.moveX()",
          "player.moveY()",
          "player.getPosition()"
        ];

        callback(
          null,
          playerMethods.map(name => ({
            name,
            value: name,
            score: 300,
            meta: "player"
          }))
        );
      }
    };
    langTools.addCompleter(autoCompleter);
  }

  get styles() {
    return {
      width: this.width,
      height: this.height
    };
  }

  /**
   * @name loadDefaultSettings
   */
  private async loadDefaultSettings() {
    this.editor.setOptions({
      tabSize: 2,
      useSoftTabs: true,
      fontSize: "14px",
      fontFamily: "Space Mono",
      mode: "ace/mode/javascript",
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    this.editor.setShowPrintMargin(false);

    this.setTheme("dracula");
    this.addKeyboardShortcuts();

    this.editor.navigateLineEnd();
  }

  /**
   * @name setTheme
   */
  public async setTheme(theme: string): Promise<void> {
    await import(`brace/theme/${theme}`);
    this.editor.setTheme(`ace/theme/${theme}`);
  }

  /**
   * @name setValue
   */
  public setValue(val: string, cursorPos?: number): void {
    this.editor.setValue(val, cursorPos);
  }

  /**
   * @name addKeyboardShortcuts
   */
  private addKeyboardShortcuts(): void {
    this.editor.commands.addCommand({
      name: "executeSandbox",
      bindKey: { win: "Ctrl-Enter", mac: "Ctrl-Enter" },
      exec: () => this.$emit("exec")
    });
    this.editor.execCommand("executeSandbox");
  }

  /**
   * @name getCode
   */
  public getCode(): string {
    return this.editor.getValue();
  }

  /**
   * @name focus
   */
  public focus(): void {
    this.editor.focus();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#editor {
  /* position: absolute; */
  /* width: 100%;
  height: 400px; */
}
</style>

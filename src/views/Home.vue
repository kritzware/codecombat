<template>
  <!-- v-loading.fullscreen.lock="loading" -->
  <el-container>
    <!-- <el-header>hello world</el-header> -->
    <!-- MAIN -->
    <el-main>
      <el-row :gutter="20" style="height:100%;">
        <el-col :span="10" style="height:100%">
          <Editor ref="editor" width="100%" height="100%" @exec="runCode"/>
        </el-col>
        <el-col :span="14" style="background-color: #e5e9f2; height:100%;">
          <World ref="world" @hover:x="hoverX" @hover:y="hoverY"/>
        </el-col>
      </el-row>
    </el-main>

    <!-- FOOTER -->
    <el-footer>
      <el-row :gutter="20">
        <!-- Actions -->
        <el-col :span="12">
          <el-item style="margin-right: 50px;">Level: 1</el-item>
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-caret-right"
              :loading="running"
              @click="runCode"
            >Run Code</el-button>
            <el-button type="warning" icon="el-icon-refresh" @click="reset">Reset Level</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6">Hover Position: ({{ xHover }}, {{ yHover }})</el-col>
        <el-col :span="6">
          <el-popover
            placement="top-start"
            title="Attempts"
            width="200"
            trigger="hover"
            content="The number of attempts at this level i.e. the number of times you've executed your code."
          >
            <el-button slot="reference">Attempts: {{ attempts }}</el-button>
          </el-popover>
        </el-col>

        <!-- Status -->
        <!-- <el-col :span="6" :offset="6">
          <el-row :gutter="12">
            <el-col :span="6">Health:</el-col>
            <el-col :span="6">
              <div class="status">
                <el-progress :percentage="50"></el-progress>
              </div>
            </el-col>
          </el-row>
        </el-col>-->
        <!-- End of Status -->
      </el-row>
    </el-footer>
  </el-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Editor from "@/components/Editor.vue";
import World from "@/components/World.vue";
import Worker from "worker-loader?inline!@/workers/sandbox";
import Level from "@/levels/types";

@Component({
  components: {
    Editor,
    World
  }
})
export default class About extends Vue {
  private sandbox: Worker;
  private level: Level;
  private levelNo: number = 1;
  private running: boolean = false;
  // private loading: boolean = true;

  private commands: Array<any> = [];
  private attempts: number = 0;

  private xHover: number = 0;
  private yHover: number = 0;

  $refs!: {
    editor: Editor;
    world: World;
  };

  constructor() {
    super();
    this.sandbox = new Worker();
  }

  async mounted() {
    this.level = (await import(`@/levels/level-${this.levelNo}`)).default;

    this.$refs.editor.setValue(this.level.code, 1);
    this.$refs.editor.focus();

    this.$refs.world.load(this.level);

    this.sandbox.addEventListener("message", this.sandboxEventHandler);
  }

  private async sandboxEventHandler(event: any) {
    const { type, data } = event.data;
    if (!type) {
      return;
    }

    switch (type) {
      case "sandbox:finished":
        this.executeCommands();
        break;
      case "sandbox:error":
        console.log("Error in sandbox execution:");
        console.error(data.error);
        this.running = false;
        break;
      default:
        this.commands.push({ type, data });
    }
  }

  async runCode(): Promise<void> {
    if (this.running) {
      return;
    }
    const code = this.$refs.editor.getCode();
    if (!code) {
      return;
    }
    this.commands = [];
    this.running = true;
    this.attempts++;

    this.sandbox.postMessage({});
  }

  async executeCommands() {
    for (const event of this.commands) {
      const { type, data } = event;
      switch (type) {
        case "player:move:x":
          await this.$refs.world.movePlayer({ x: data.x, y: 0 });
          break;
        case "player:move:y":
          await this.$refs.world.movePlayer({ x: 0, y: data.y });
          break;
        default:
          console.log("sandbox event not found", event);
      }
    }

    console.log("Finished pass.");
    this.running = false;
  }

  reset() {
    this.$refs.editor.setValue(this.level.code, 1);
    this.$refs.editor.focus();
    this.$refs.world.reset();
  }

  private hoverX(val: number) {
    this.xHover = val;
  }

  private hoverY(val: number) {
    this.yHover = val;
  }
}
</script>
<style scoped>
.el-container {
  height: 100vh;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* height: calc(100vh - 100px); */
  height: 100%;
}
.el-footer {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 100px;
}
/* .el-col {
  height: 500px;
} */
.el-row {
}
.status {
  /* margin-top: 25%; */
  width: 200px;
}
</style>

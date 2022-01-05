<template>
 <div class="operate-compress">
  <div class="operate-params">
   压缩配置项：
   <div class="compress-config-pannel">
    <el-tabs v-model="activeCompressType">
     <el-tab-pane name="png" label="png / jpg">
      <div class="compress-quality">
       <span class="label"> 压缩质量：{{ quality }}% </span>
       <el-slider
        :format-tooltip="formatTooltip"
        :min="0"
        :max="maxQuality"
        :step="1"
        v-model="quality"
        :show-tooltip="true"
       ></el-slider>
      </div>
      <div class="compress-quality">
       <span class="label">
        压缩速度：{{ speed }} (数值越大，压缩速度越快，压缩质量越差，仅对 png
        类型图片有效)
       </span>
       <el-slider
        :format-tooltip="(v) => v"
        :min="1"
        :max="maxSpeed"
        :step="1"
        v-model="speed"
        :show-tooltip="true"
       ></el-slider>
      </div>
     </el-tab-pane>
     <el-tab-pane name="gif" label="gif">
      <div class="compress-quality">
       <span class="label">
        减色压缩率：{{ colorQuality }}% （过大会导致gif图像失真）</span
       >
       <el-slider
        :format-tooltip="formatTooltip"
        :min="0"
        :max="maxQuality"
        :step="1"
        v-model="colorQuality"
        :show-tooltip="true"
       ></el-slider>
      </div>
      <div class="compress-quality">
       <span class="label"
        >减帧压缩率：{{ frameQuality }}% （过大会导致gif图像动效生硬）</span
       >
       <el-slider
        :format-tooltip="formatTooltip"
        :min="0"
        :max="maxQuality"
        :step="1"
        v-model="frameQuality"
        :show-tooltip="true"
       ></el-slider>
      </div>
     </el-tab-pane>
    </el-tabs>
   </div>
   <div class="compress-dir">
    压缩路径：<el-button type="text" @click="openDestinationDir">{{
     destination
    }}</el-button>
    <div class="choose-path" @click="choosePath">自定义路径</div>
   </div>
  </div>
  <div class="operate-actions">
   <el-button
    class="operate-btn"
    type="primary"
    :loading="isCompressing"
    @click="compress"
    :disabled="isCompressing"
   >
    {{ isCompressing ? "压缩中" : "开启压缩" }}
   </el-button>
  </div>
 </div>
</template>

<script>
const { dialog, app } = require("electron").remote;
const os = require("os");
const path = require("path");
export default {
 props: {
  isCompressing: {
   type: Boolean,
   default: false,
  },
  imgs: {
    type: Array,
    default: []
  }
 },
 data() {
  return {
   activeCompressType: "png",
   quality: 70,
   colorQuality: 0,
   frameQuality: 20,
   maxQuality: 100,
   speed: 4,
   maxSpeed: 11,
   destination: "",
  };
 },
 watch: {
   imgs: {
    deep: true,
    immediate: true,
    handler(arrData) {
      const isOnlyGif = arrData.every(img => img.type === 'gif')
      this.activeCompressType = isOnlyGif ? 'gif' : 'png'
      this.$forceUpdate();
      this.resetBarWid();
    }
   }
 },
 methods: {
  resetBarWid() {
    const barEl = document.querySelector('.el-tabs__active-bar');
    barEl && (barEl.style.width = (this.activeCompressType === 'png' ? '62px' : '17px'))
  },
  formatTooltip(val) {
   return `${val}%`;
  },
  openDestinationDir() {
   dialog.showOpenDialog({
    defaultPath: this.destination,
   });
  },
  compress() {
   this.$emit("compress", {
    quality: 1 - this.quality / 100,
    destination: this.destination,
    speed: this.speed,
    colorQuality: 1 - this.colorQuality / 100,
    frameQuality: 1 - this.frameQuality / 100,
   });
    app.mainWindow.closeFilePreview()
  },
  choosePath() {
   dialog
    .showOpenDialog({
     properties: ["openDirectory"],
    })
    .then((res) => {
     if (res.filePaths && res.filePaths.length) {
      this.destination = res.filePaths[0];
     }
    });
  },
 },
 mounted() {
  const homeDir = os.homedir();
  this.destination = path.normalize(`${homeDir}/Desktop/压缩图片文件夹`);
  this.resetBarWid();
 },
};
</script>

<style lang="scss">
.operate-compress {
 padding: 15px 20px;
 margin-bottom: 20px;
 .operate-params {
  font-size: 14px;
  width: 100%;
  padding: 15px 0;
  .compress-config-pannel {
   min-height: 200px;
  }
  .compress-quality {
   margin-bottom: 5px;
   width: 80%;
   .label {
    margin-right: 20px;
   }
  }
  .compress-dir {
   .el-button {
    padding: 0;
   }
   .choose-path {
    padding: 5px 10px;
    color: white;
    background: #436ef3;
    width: fit-content;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
    &:hover {
     background: #2f5ce6;
    }
   }
  }
 }
 .operate-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
  border-top: 1px dashed gray;
 }
 .operate-btn {
  padding: 10px 20px;
  color: white;
  background: #436ef3;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  word-break: keep-all;
  border-color: none !important;
  &:hover {
   background: #2f5ce6;
  }
 }
}
</style>
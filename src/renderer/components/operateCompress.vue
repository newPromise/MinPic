<template>
  <div class="operate-compress">
    <div class="operate-params">
      <div class="compress-quality">
        <span class="label">
          压缩质量：{{quality}}%
        </span>
        <el-slider :format-tooltip="formatTooltip" :min="0" :max="maxQuality" :step="1" v-model="quality" :show-tooltip="true"></el-slider>
      </div>
      <div class="compress-quality">
        <span class="label">
          压缩速度：{{speed}} (数值越大，压缩速度越快，压缩质量越差，仅对 png 类型图片有效)
        </span>
        <el-slider :format-tooltip="v => v" :min="1" :max="maxSpeed" :step="1" v-model="speed" :show-tooltip="true"></el-slider>
      </div>
      <div class="compress-dir">
        压缩路径：{{destination}}
        <div class="choose-path" @click="choosePath">
          自定义路径
        </div>
      </div>
    </div>
    <div class="operate-actions">
       <el-button class="operate-btn" type="primary" :loading="isCompressing" @click="compress" :disabled="isCompressing">
          {{ isCompressing ? '压缩中' : '开启压缩' }}
        </el-button>
    </div>
  </div>
</template>

<script>
const { dialog } = require('electron').remote
const os = require('os')
export default {
  props: {
    isCompressing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      quality: 70,
      maxQuality: 100,
      speed: 4,
      maxSpeed: 11,
      destination: ''
    }
  },
  methods: {
    formatTooltip(val) {
      return `${val}%`
    },
    compress() {
      this.$emit('compress', { quality: this.quality / 100, destination: this.destination, speed: this.speed })
    },
    choosePath() {
      dialog.showOpenDialog({
        properties: ['openDirectory']
      }).then((res) => {
        if (res.filePaths && res.filePaths.length) {
          this.destination = res.filePaths[0]
        }
      })
    }
  },
  mounted() {
    const homeDir = os.homedir()
    this.destination = `${homeDir}/Desktop/压缩图片文件夹`
  },
}
</script>

<style lang="scss">
.operate-compress {
  padding: 15px 20px;
  margin-bottom: 20px;
  .operate-params {
    font-size: 14px;
    width: 100%;
    padding: 15px 0;
    .compress-quality {
      margin-bottom: 5px;
      width: 80%;
      .label {
        margin-right: 20px;
      }
    }
    .compress-dir {
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
    border-top: 1px dashed gray;;
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
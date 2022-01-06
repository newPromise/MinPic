<template>
  <div class="pic-item" :class="{'double-row': index % 2}">
    <div class="pic-name col-5">
      <img :src="img.src" alt="">
      <span class="name">{{img.name}}</span>
    </div>
    <div class="pic-size col-4">
      <el-tooltip effect="dark" :content="getImgKbSize(img)" placement="top">
        <span>{{img.size}} MB / {{ img.afterCompressSize ? `${img.afterCompressSize} MB` : '--' }}</span>
      </el-tooltip>
    </div>
    <!-- <div class="pic-create-time col-3">{{img.aTime}}</div> -->
    <div class="pic-operate col-2">
      <el-tooltip effect="dark" content="删除" placement="top">
        <i class="el-icon-delete" @click="deleteImage"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="预览" placement="top">
        <i v-show="img.compressed" class="el-icon-view" @click="viewCompressedImg"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="复制" placement="top">
        <i v-show="img.compressed" class="el-icon-copy-document" @click="copyCompressedImg"></i>
      </el-tooltip>
      <!-- <i class="el-icon-view" @click="deleteImage"></i> -->
    </div>
  </div>
</template>

<script>
const { app } = require('electron').remote;
import { ipcRenderer } from 'electron'
export default {
  props: {
    img: {
      default: null,
      type: Object
    },
    index: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 复制压缩的图片
    copyCompressedImg() {
      ipcRenderer.send('copy', [this.img.compressPath])
      ipcRenderer.once('copy-success', () => {
        this.$message.success('图片已复制')
      })
    },
    getImgKbSize(img) {
      function getKb(mb) {
        if (!mb) return '--'
        return `${mb * 1024} KB`
      }
      return getKb(img.size) + ' / ' + getKb(img.afterCompressSize);
    },
    viewCompressedImg() {
      app.mainWindow.previewFile(this.img.compressPath);
    },
    deleteImage() {
      this.$emit('delete', this.index)
    }
  },
}
</script>

<style lang="scss">
.double-row {
  background: #F5F4F5;
}
.pic-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 14px;
  color: #7B7A7B;
  > div {
    padding: 0 5px;
  }
  .pic-name {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img {
      width: 30px;
      max-height: 30px;
    }
    .name {
      display: inline-block;
      margin-left: 10px;
      font-size: 15px;
      color: black;
      word-break: break-all;
    }
  }
  .pic-operate {
    i {
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
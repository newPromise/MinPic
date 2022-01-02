<template>
  <div class="pic-item" :class="{'double-row': index % 2}">
    <div class="pic-name col-5">
      <img :src="img.src" alt="">
      <span class="name">{{img.name}}</span>
    </div>
    <div class="pic-size col-4">{{img.size}} MB / 
      {{ img.afterCompressSize ? `${img.afterCompressSize} MB` : '--' }}
    </div>
    <!-- <div class="pic-create-time col-3">{{img.aTime}}</div> -->
    <div class="pic-operate col-2">
      <i class="el-icon-delete" @click="deleteImage"></i>
      <i v-show="img.compressed" class="el-icon-view" @click="viewCompressedImg"></i>
      <!-- <i class="el-icon-view" @click="deleteImage"></i> -->
    </div>
  </div>
</template>

<script>
const { app } = require('electron').remote
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
<template>
  <div class="compress-page">
    <upload-page v-show="isUploadPage" @upload="imageUploaded"></upload-page>
    <div class="compress-pictures" v-show="!isUploadPage">
      <OpeCom @compress="compressPics" :isCompressing="isCompressing"></OpeCom>
      <div class="anew-append">
        <el-button type="text" @click="anewSelect">重新选择图片压缩</el-button>
      </div>
      <div class="compress-pic-list">
        <div class="list-header">
          <div class="header-name col-5">名称</div>
          <div class="header-pic-size col-4">大小(压缩前/压缩后)</div>
          <!-- <div class="header-pic-atime col-3">添加日期</div> -->
          <div class="header-pic-operate col-2">操作</div>
        </div>
        <div class="list-container">
          <PicItem v-for="(img, index) in imgDatas" :key="index" :img="img" :index="index" @delete="deleteImage"></PicItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import operateCompressVue from './operateCompress.vue'
import PicItem from './picItem.vue'
import UploadPage from './uploadPage.vue'
const fs = require('fs')
const path = require('path')
export default {
  name: 'compressPage',
  components: {
    UploadPage,
    PicItem,
    OpeCom: operateCompressVue
  },
  data() {
    return {
      isUploadPage: true,
      imgPaths: [],
      imgDatas: [],
      isCompressing: false
    }
  },
  methods: {
    anewSelect() {
      Object.assign(this.$data, this.$options.data());
    },
    imageUploaded(paths) {
      this.imgPaths = paths;
      this.isUploadPage = false
      this.imgDatas = this.imgPaths.map(imgPath => {
        let readData = fs.readFileSync(imgPath)
        let imgStat = fs.statSync(imgPath)
        const { size } = imgStat
        let imgSize = (size / 1024 / 1024).toFixed(1)
        const type = imgPath.split('.').pop()
        let baseDataType = type === 'png' ? 'png' : 'jpeg';
        let name = path.parse(imgPath).base
        return {
          path: imgPath,
          src: `data:image/${baseDataType};base64,${readData.toString('base64')}`,
          size: imgSize,
          afterCompressSize: '--',
          name,
          aTime: '2020/4/13'
        }
      })
    },
    compressPics(config) {
      const { destination } = config
      if (!this.imgDatas.length) {
        this.$message.warning('你还没有选择图片🤔')
        return
      }
      if (!destination.trim().length) {
        this.$message.error('请选择文件压缩目标文件夹路径');
      }
      const vm = this
      this.isCompressing = true
      ipcRenderer.once('compress-success', function (event, { compressList }) {
        compressList.forEach(compressImg => {
          const findImg = vm.imgDatas.find(imgData => imgData.name === compressImg.name)
          findImg.afterCompressSize = compressImg.compressedSize
        })
        vm.isCompressing = false
        vm.$message.success('压缩完成😎');
      })
      ipcRenderer.send('send-compress', Object.assign(config, { paths: this.imgPaths }))
    },
    deleteImage(index) {
      this.imgPaths.splice(index, 1)
      this.imgDatas.splice(index, 1)
    },
    mounted() {
    }
  }
}
</script>

<style lang="scss">
  .compress-page {
    width: 100%;
    height: 100%;
    .compress-pictures {
      width: 100%;
      height: 100%;
    }
    .anew-append {
      margin: 10px 15px;
      font-size: 14px;
    }
    .compress-pic-list {
      .list-header {
        display: flex;
        align-items: center;
        padding: 2px 15px;
        font-size: 12px;
        border-bottom: 1px solid #DDDDDD;
        > div:not(:last-child) {
          border-right: 1px solid #E6E6E6;
        }
        > div {
          padding: 0 5px;
        }
      } 
    }
  }
</style>
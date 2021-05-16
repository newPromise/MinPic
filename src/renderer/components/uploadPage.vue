<template>
  <div class="upload-page">
    <div class="upload-area">
      <div class="upload-background"></div>
      <div class="upload-btns">
        <div class="upload-btn" @click="uploadPic">选择上传图片</div>
        <div class="upload-btn" @click="selectPicDir">选择文件夹</div>
      </div>
    </div>
  </div>
</template>

<script>
const { dialog } = require('electron').remote
export default {
  name: 'uploadPage',
  data() {
    return {
    }
  },
  methods: {
    // 选择图片所在的文件夹
    selectPicDir() {
      dialog.showOpenDialog({
        properties: ['openDirectory']
      }).then(result => {
        const { filePaths } = result
        if (filePaths && filePaths.length) {
          this.$emit('uploadDir', filePaths)
        }
      })
    },
    uploadPic() {
      dialog.showOpenDialog({
        filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
        properties: ['openFile', 'multiSelections']
      }).then(result => {
        const { filePaths } = result
        if (filePaths && filePaths.length) {
          this.$emit('upload', filePaths)        
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .upload-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .upload-background {
      width: 400px;
      height: 300px;
      background: url('../assets/uploadBg.png') no-repeat;
      background-size: cover;
    }
    .upload-btns {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
    .upload-btn {
      padding: 10px 25px;
      width: fit-content;
      margin: 0 auto;
      margin-top: 10px;
      color: #436ef3;
      border-radius: 7px;
      font-size: 15px;
      font-style: normal;
      background: #ecf0fe;
      cursor: pointer;
      &:hover {
        background: #D9E2FD;
      }
    }
  }
</style>
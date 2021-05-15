<template>
  <div class="upload-page">
    <div class="upload-area">
      <div class="upload-background"></div>
      <div class="upload-btn" @click="uploadPic">上传图片</div>
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
    .upload-btn {
      padding: 15px 25px;
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
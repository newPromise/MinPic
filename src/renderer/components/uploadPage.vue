<template>
  <div class="upload-page">
    <div class="upload-area">
      <div id="drop-area" @mouseenter="whenMoveIntoDropArea">
        <div class="upload-background"></div>
      </div>
      <div class="upload-btns">
        <div class="upload-btn" @click="uploadPic">选择上传图片</div>
        <div class="upload-btn" @click="selectPicDir">选择文件夹</div>
      </div>
    </div>
  </div>
</template>

<script>
const { dialog } = require('electron').remote
const path = require('path')
const fs = require('fs')
export default {
  name: 'uploadPage',
  data() {
    return {
      compressTypes: ['PNG', 'JPG', 'JPEG', 'GIF'],
      openDirPath: ''
    }
  },
  methods: {
    whenMoveIntoDropArea() {
      this.$message.info('支持拖拽文件哦  ✨🎉✨🎉 2️⃣0️⃣2️⃣2️⃣ 🎉✨🎉✨')
    },
    getImageFileFromPaths(dirPaths) {
      let imageList = []
      const image = require('imageinfo')
      dirPaths.forEach(dPath => {
        const files = fs.readdirSync(dPath).filter(filePath => {
          return !fs.statSync(`${dPath}/${filePath}`).isDirectory()
        })
        const readFileList = files.map(filePath => {
          let isImgFile =
           this.compressTypes.includes(image(fs.readFileSync(`${dPath}/${filePath}`)).format)
           if (isImgFile) {
             return `${dPath}/${filePath}`
           } else return false
        })
        imageList.push(...readFileList.filter(v => v))
      })
      return imageList;
    },
    initDrop() {
      const dragWrapper = document.getElementById("drop-area");
      const image = require('imageinfo')
      //添加拖拽事件监听器
      dragWrapper.addEventListener("drop", (e) => {
          let isEmptyFile = false
          //阻止默认行为
          e.preventDefault();
          //获取文件列表
          const files = e.dataTransfer.files;
          // 获取文件路径
          if(files && files.length > 0) {
            let dirPaths = []
            let filePathsArr = []
            let arrFiles = [...files]
            console.log('files', files)
            arrFiles.forEach(({ path: fileP }) => {
              const isDir = fs.statSync(fileP).isDirectory()
              isDir && dirPaths.push(fileP)
              if (!isDir &&  this.compressTypes.includes(image(fs.readFileSync(fileP)).format)) {
                filePathsArr.push(fileP)
              }
            })
            const dirImgFiles = this.getImageFileFromPaths(dirPaths)
            this.$emit('upload', [...dirImgFiles, ...filePathsArr])
          } else {
            isEmptyFile = true
          }
      })
      //阻止拖拽结束事件默认行为
      dragWrapper.addEventListener("dragover", (e) => {
          e.preventDefault();
      })
    },
    // 选择图片所在的文件夹
    selectPicDir() {
      dialog.showOpenDialog({
        defaultPath: this.openDirPath,
        properties: ['openDirectory']
      }).then(result => {
        const { filePaths } = result
        if (filePaths && filePaths.length) {
          this.openDirPath = path.dirname(filePaths[0])
          this.$emit('uploadDir', filePaths)
        }
      })
    },
    uploadPic() {
      dialog.showOpenDialog({
        defaultPath: this.openDirPath,
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'gif'] }],
        properties: ['openFile', 'multiSelections']
      }).then(result => {
        const { filePaths } = result
        if (filePaths && filePaths.length) {
          this.openDirPath = path.dirname(filePaths[0])
          this.$emit('upload', filePaths)        
        }
      })
    }
  },
  mounted() {
    this.initDrop()
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
    #drop-area {
      padding: 30px;
      border: 2px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      &:hover {
        border-color: #409eff;
      }
    }
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
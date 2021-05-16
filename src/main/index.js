import { app, BrowserWindow, ipcMain } from 'electron'
import '../renderer/store'
const path = require('path')
const fs = require('fs')

ipcMain.on('send-compress', function(event, config) {
  const gulp = require('gulp');
  const imagemin = require('gulp-imagemin');
  // const imageminJpegRecompress = require('imagemin-jpeg-recompress');
  // const imageminPngquant = require('imagemin-pngquant');
  // const imageminout = require('imagemin-pngout')
  // let pngq = imageminPngquant({
  //   quality: [0.5, 0.7], //0-100越大质量越高
  //   speed: 1, //1-10越大速度越快，质量越差
  // });
  // const pngout = imageminout()
  // const jpgmin = imageminJpegRecompress({
  //   accurate: false, //高精度模式
  //   quality: "medium", //图像质量:low, medium, high, veryhigh;
  //   method: "smallfry", //网格优化:mpe, ssim, ms-ssim , smallfry;
  //   min: 30, //最低质量
  //   loops: 6, //循环尝试次数, 默认为6;
  //   progressive: false, //基线优化
  //   subsample: "default" //子采样:default, disable;
  // })
  const { paths, destination, quality } = config
  gulp.src(paths).pipe(imagemin({
    optimizationLevel: quality * 7,
    quality: quality * 100,
    progressive: false, //基线优化
    loops: 6, //循环尝试次数, 默认为6;
    accurate: false //高精度模式
  })).pipe(gulp.dest(destination)).on('end', function () {
    const compressList = paths.map(imgPath => {
      let imgName = path.parse(imgPath).base
      let { size } = fs.statSync(`${destination}/${imgName}`)
      let imgSize = (size / 1024 / 1024).toFixed(2)
      return {
        path: imgPath,
        name: imgName,
        compressedSize: imgSize
      }
    })
    event.reply('compress-success', { compressList })
  })
});

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */



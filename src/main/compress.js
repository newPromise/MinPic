import { ipcMain } from 'electron'
const path = require('path')
const fs = require('fs')


ipcMain.on('start-compress', function(event, config) {
  const gulp = require('gulp');
  const imagemin = require('gulp-imagemin');
  const imageminPngquant = require('imagemin-pngquant');
  const { paths, destination, quality } = config
  let pngq = imageminPngquant({
    quality: [quality, quality], //0-100越大质量越高
    speed: config.speed, //1-10越大速度越快，质量越差
  });
  gulp.src(paths).pipe(imagemin([
    imagemin.mozjpeg({quality: quality * 100, progressive: true}),
    pngq
  ])).pipe(gulp.dest(destination)).on('end', function () {
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
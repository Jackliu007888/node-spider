var cheerio = require('cheerio')
var fs = require('fs')
var https = require('https')
var path = require('path')


function getHtml(url, encoding) {
  return new Promise((resolve, reject) => {
    var req = https.get(url, function (res) {
      var result = ''
      encoding && res.setEncoding(encoding)
      res.on('data', function (d) {
        result += d
      })
      res.on('end', function () {
        resolve(result)
      })
      res.on('error', function (e) {
        console.error(e)
        reject(e)
      })
    })
    req.end()
  })
}

function parseOriginHtml(data) {
  return new Promise((resolve, reject) => {
    var $ = cheerio.load(data)
    var targetUrls = []

    $('.video-box a.hint--bottom').map((index, item) => {
        targetUrls.push(item.attribs.href)
      }) +
      targetUrls === 0 ? reject(null) : resolve(targetUrls)
  })
}

function parseTargetHtml(data) {
  return new Promise((resolve, reject) => {
    var $ = cheerio.load(data)
    var targetData = {}
    targetData = Object.assign({}, targetData, {
      title: ($('.my-title').text().trim()).replace(/\s+/g, ''),
      src: data.match(/\S*.mp4/g) && data.match(/\S*.mp4/g)[0].slice(1)
    })
    JSON.stringify(targetData) === '{}' ? reject(null) : resolve(targetData)
  })
}

function savefileToPath(fileName, fileData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, `../dist/${fileName}.mp4`), fileData, 'binary', function (err) {
      if (err) {
        console.log('save error', err)
        reject(err)
      }
      console.log(`${fileName} save success!`)
      resolve('success ')
    })
  })
}

module.exports = {
  getHtml,
  parseOriginHtml,
  parseTargetHtml,
  savefileToPath
}
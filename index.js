var { getHtml, parseOriginHtml, parseTargetHtml, savefileToPath } = require('./src/spider.js')
var originUrl = 'https://www.rails365.net/playlists/you-ren-de-react-shi-pin-jiao-cheng-ji-chu-pian'
var baseUrl = 'https://www.rails365.net'

getHtml(originUrl).then((data) => {
  parseOriginHtml(data).then((targetUrls) => {
    targetUrls.map((item) => {
      var url = baseUrl + item
      getHtml(url).then((data) => {
        parseTargetHtml(data).then((data) => {
          console.log(`${data.title} start download`)
          getHtml(data.src).then((fileData) => {
            savefileToPath(data.title, fileData)
          })
        })
      })
    })
  })
}).catch((err) => {
  console.log(err)
})
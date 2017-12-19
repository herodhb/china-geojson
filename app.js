import request from 'request-promise'
import { fs } from 'mz'

const requestUrl = 'https://me.bdp.cn/static/js/mapData/geoJson';

const completeUrlObject = {}

fs.readFile('china.js').then(mapArray => {
    const _mapArray = JSON.parse(mapArray)
    _mapArray.forEach(map => {
        const { directory, codeArr } = map
        completeUrlObject[directory] = []
        codeArr.forEach(code => {
            completeUrlObject[directory].push(`${requestUrl}/${directory}/${parseInt(code, 10)}.js`)
        })
    })
    const completeUrlArr = Object.entries(completeUrlObject)
    for (let i = 0; i < completeUrlArr.length; i++) {
        const [ directory, urls ] = completeUrlArr[i]
        console.log(`${directory}总数量为${urls.length}个`)

        Promise.all(urls.map(url => new Promise((resolve, reject) => {
            (async () => {
                let result = await request(url)
                result = result.substr(55)
                let fileName = url.split('/').pop()
                fileName = `${fileName.split('.')[0]}.json`
                if (!await fs.exists(`${directory}/${fileName}`)) {
                    await fs.writeFile(`${directory}/${fileName}`, result)
                    resolve(url)
                }
                resolve(url)
            })().catch(e => {
                console.log(`获取${url}失败: ${e}`)
                resolve('')
            })
        }))).then(successUrls => {
            console.log(`${directory}成功抓取并生成文件总数量为${successUrls.filter(url => url.length).length}个`)
        })
    }
})
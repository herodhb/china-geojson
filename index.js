/**
 * index
 *
 * @author haibo
 */
import cheerio from 'cheerio'
import request from 'request-promise'
import { fs } from 'mz'

const provinceArr = []
const cityArr = [];

(async () => {
    const result = await request('http://www.mca.gov.cn/article/sj/tjbz/a/2017/1123/11233.html')
    const $ = cheerio.load(result)
    const trList = $('table tbody').children()
    trList.each((i, tr) => {
        const code = $(tr).find('td:nth-child(2)').text()
        if (code.endsWith('0000')) {
            provinceArr.push(code)
        }
        if (!code.endsWith('0000') && code.endsWith('00')) {
            cityArr.push(code)
        }
    })
    fs.writeFile('china.js', JSON.stringify([ {
        directory: 'province_city',
        codeArr: provinceArr,
    }, {
        directory: 'city_district',
        codeArr: cityArr,
    } ]))
})().catch((err) => {
    console.log(`爬取失败: ${err}`)
})
const FastScanner = require('fastscan')
const chalk = require('chalk')
const _ = require('lodash')
const superagent = require('superagent')
const cheerio = require('cheerio')
module.exports = async (ctx) => {
    const baseUrl = ctx.request.query.site
    console.log(baseUrl)
    console.log(chalk.green('服务正常启动'))
    let tempArr = [baseUrl]
    let resultArr = []
    await iterator({tempArr, iterArr:tempArr, resultArr})
    console.log(chalk.yellow(`所有页面加载完毕`))
    ctx.state.data = resultArr
}
async function getSites({tempArr, site, resultArr}) {
    return new Promise((resolve, reject) => {
        superagent.get(encodeURI(site)).end(function (err, sres) {
            if (err || !sres || !sres.text) {
                console.log(chalk.red(err))
                resolve([])
                return
            }
            console.log(chalk.yellow(`${site}加载完毕`))
            let html = sres.text
            let words = ["今日头条","微信", "支付宝"]
            let scanner = new FastScanner(words)
            let hits = scanner.hits(html)
            if(!_.isEmpty(hits)) {
                resultArr.push({site, hits})
            }
            let $ = cheerio.load(html)
            let links = []
            $('a').each(function (index, element) {
                let $element = $(element)
                links.push($element.attr('href'))
            })
            links = _.uniq(links.filter(el =>  el && el.includes(tempArr[0]) && !tempArr.includes(el)))
            resolve(links)
        })
    })
}
async function iterator({tempArr,iterArr, resultArr}) {
    for (let i = 0; i < iterArr.length; i++) {
        let arr = await getSites({tempArr, site: iterArr[i], resultArr})
        tempArr = tempArr.concat(arr)
        await iterator({tempArr, iterArr:arr, resultArr})
    }
}

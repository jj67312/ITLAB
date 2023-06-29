const crypto = require('crypto');

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

const axios = require('axios')
const cheerio = require('cheerio')

const predecessor = "https://www.91mobiles.com"

async function crawlData(url){
    const crawlUrls = []
    const resp = await axios(url)
    const html = await resp.data
    const $ = cheerio.load(html)
    $('.hover_blue_link', html).each(function(){
        const link = $(this).attr('href')
        crawlUrls.push(link)
    })
    return(crawlUrls)
}

async function scrapeData(url, imageTag, titleTag, priceTag, linkTag){
    const resp = await axios(url)
    const html = await resp.data
    const $ = cheerio.load(html)
    let data ={}
    $(imageTag, html).each(function (){
        const link = $(this).attr('src')
        console.log(link);
        data.imageUrl = link
    })
    $(titleTag, html).each(function(){
        const title = $(this).text()
        data.title = title
    })
    $(priceTag, html).each(function(){
        const price = $(this).text().replace('                                                                                    ','').replace('\n','')
        data.price = price
    })
    $(linkTag, html).each(function (){
        const productLink = $(this).attr('data-href-url')
        data.productLink = predecessor+productLink
    })
    if(data.productLink === undefined){
        data.productLink = 'Not Launched'
    }
    if(data.price === undefined){
        data.price = 'Not Launched'
    }    
    //finalData.push(data) 
    return data
}

module.exports.crawlData = crawlData
module.exports.scrapeData = scrapeData

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
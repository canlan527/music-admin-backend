const rp = require('request-promise')
const fs = require('fs')
const path = require('path')
const APPID = 'wx8d5ee7c5d18f43d4'
const APPSECRET = 'ca95c6cb47a42824ca778d2409875ec0'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async ()=>{
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    if(res.access_token){
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }) )
    } else {
        await updateAccessToken()
    }
    
}

const getAccessToken = async () => {
    //读取文件
    try{
        const readRes = fs.readFileSync(fileName, 'utf8')
        const resObj = JSON.parse(readRes)
        // 判断2小时时间差
        const createTime = new Date(resObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if( (nowTime - createTime) / 1000 / 60 / 60 >= 2){
            await updateAccessToken()
            await getAccessToken()
        }

        return resObj.access_token 
    }catch(e){
        await updateAccessToken()
        await getAccessToken()
    }

}
//每隔2小时刷新一次
setInterval(async ()=>{
   await updateAccessToken()
}, (7200 - 300 ) * 1000) //减去5分中
// updateAccessToken()
// console.log(getAccessToken())
module.exports = getAccessToken
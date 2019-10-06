const rp = require('request-promise')
const getAccessToken = require('../utils/getAccessToken.js')
const fs = require('fs')
const cloudStorage = {
    async download(ctx, fileList){
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                file_list: fileList
            },
            json: true

        }
        return await rp(options).then(res=>{
            return res
        })
    },

    async upload(ctx){
        const ACCESS_TOKEN = await getAccessToken()
        // 1.请求地址
        const file = ctx.request.files.file
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
        //发送请求
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body:{
                path,
                env: ctx.state.env
            },
            json: true
        }

        const info = await rp(options).then(res=>{
            return res
        })
        console.log(info)
        //2.上传图片
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData: {
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.path)
            },
            json: true
        }
        await rp(params)
        return info.file_id
    },

    async delete(ctx, fileid_list){
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                fileid_list: fileid_list
            },
            json: true
        }

        return await rp(options).then(res=>{
            return res
        })
    }
}

module.exports = cloudStorage
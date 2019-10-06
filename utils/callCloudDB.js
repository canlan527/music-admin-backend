const rp = require('request-promise')
const getAccessToken = require('../utils/getAccessToken.js')

const callCloudDB = async(ctx, fnName, query={}) => {
    const access_token = await getAccessToken()
    const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${access_token}`,
        body: {
            query,
            env: ctx.state.env
        },
        json: true
    }

    return await rp(options)
        .then(res=>{
            return res
        })
}

module.exports = callCloudDB
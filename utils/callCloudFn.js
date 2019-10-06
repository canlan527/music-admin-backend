const rp = require('request-promise')
const getAccessToken = require('../utils/getAccessToken.js')
const callCloudFn = async (ctx, fnName, params)=>{
     //查询歌单列表
     const access_token = await getAccessToken()

     const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.env}&name=${fnName}`,
        body: {
           ...params
        },
        json: true // Automatically stringifies the body to JSON
    };
    
    return await rp(options)
        .then((res) => {
            return res
        })
        .catch(function (err) {
        });
}


module.exports = callCloudFn
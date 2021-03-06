const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')
//通过HTTP API调用云函数查询云数据库
router.get('/list', async(ctx, next) => {
    //查询歌单列表
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url:'playlist',
        start:parseInt(query.start),
        count:parseInt(query.count)
    })
    let data = []
    if(res.resp_data){
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000
    }
})

//通过HTTP API 查询云数据库
router.get('/getById', async(ctx, next) => {
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body={
        code: 20000,
        data: JSON.parse(res.data)
    }
})

router.post('/updatePlaylist', async(ctx, next)=> {
    const params = ctx.request.body
    const query = `
        db.collection('playlist').doc('${params._id}').update({
            data:{
                name: '${params.name}',
                copywriter: '${params.copywriter}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code:20000,
        data: res
    }
})

router.get('/del', async(ctx, next) => {
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete',query)
    ctx.body={
        code: 20000,
        data: res
    }
})
module.exports = router
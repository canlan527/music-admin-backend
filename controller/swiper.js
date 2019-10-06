const Rouer = require('koa-router');
const router = new Rouer()
const callCloudDB = require('../utils/callCloudDB')
const callCloudStorage = require('../utils/callCloudStorage')
router.get('/list', async (ctx, next) => {
    //默认获取10条
    const query = `db.collection('swiper').get()`
    const res =  await callCloudDB(ctx, 'databasequery', query)
    // console.log(res)
    //文件下载链接
    let fileList = []
    const data = res.data
    for(let i=0,len = data.length; i < len; i ++){
        fileList.push({
            fileid: JSON.parse(data[i]).fileid,
            max_age: 7200
        })
    }
    const dlRes = await callCloudStorage.download(ctx, fileList)
    // console.log(dlRes)
    let returnData = []
    for(let i=0,len=dlRes.file_list.length;i < len; i ++){
        returnData.push({
            download_url: dlRes.file_list[i].download_url,
            fileid: dlRes.file_list[i].fileid,
            _id: JSON.parse(data[i])._id
        })
    }

    ctx.body = {
        code: 20000,
        data: returnData
    }
})
//上传文件相当与提交表单，用post方法
router.post('/upload', async (ctx, next)=>{
   const fileid = await callCloudStorage.upload(ctx)
   console.log(fileid)
   //写数据库
   const query = `db.collection('swiper').add({
       data:{
           fileid:'${fileid}'
       }
   })`
   const res = await callCloudDB(ctx, 'databaseadd',query)
   ctx.body = {
       code: 20000,
       id_list: res.id_list
   }
})

router.get('/del', async(ctx,next)=>{
    const params = ctx.request.query
    //删除数据库里的数据
    const query = `db.collection('swiper').doc('${params._id}').remove()`
    const delDBRes = await callCloudDB(ctx, 'databasedelete', query)

    //删除云存储里的数据
    const delStorageRes = await callCloudStorage.delete(ctx, [params.fileid])
    ctx.body = {
        code: 20000,
        data: {
            delDBRes,
            delStorageRes
        }
    }

})

module.exports = router
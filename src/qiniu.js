import _ from 'lodash'
import qiniu from 'qiniu'

let _options = {
  isInit: false,
  bucket: 'yfsoft',
  prefix: 'fpm|',
  domain: '*****',
  ACCESS_KEY:'*****',
  SECRET_KEY:'*****',
}

const init = (options) => {
  _options = _.assign(_options, _.assign(options, {isInit: true}))
  qiniu.conf.ACCESS_KEY = _options.ACCESS_KEY
  qiniu.conf.SECRET_KEY = _options.SECRET_KEY
}

//构建上传策略函数
const getToken = ( key ) => {
  let putPolicy = new qiniu.rs.PutPolicy(_options.bucket + ":" + key)
  let token = putPolicy.token()
  return token
}

const listPrefix = async () => {
  return new Promise( (rs, rj) => {
     qiniu.rsf.listPrefix(_options.bucket, _options.prefix, null, 100, null, (err, ret) => {
      if(err){
        rj(err)
      }else{
        rs({data: ret.items} )
      }
     })
     
  })   
}

//构造上传函数
const uploadFile = async (key, data) => {
  let uptoken = getToken(key)
  let extra = new qiniu.io.PutExtra()
  extra.mimeType = data.type
  return new Promise( (rs, rj) =>{
    qiniu.io.putFile(uptoken, key, data.filename, extra, (err, ret) => {
      if(err){
        rj(err)
      }else{
        if(ret.code){
          rj(ret)
        }else{
          ret.url = 'http://' + _options.domain + '/'+ ret.key
          rs(ret)
        }
      }
    })    
  })
  
}

const sync = async (data)=>{
  if(!_options.isInit)
    throw new Error('options not inited')
  //调用uploadFile上传
  let rst = await uploadFile(_options.prefix + data.id + '_' + data.name, data)
  return rst
}

const list = async (data) => {
  if(!_options.isInit)
    throw new Error('options not inited')

  return await listPrefix()
  
}

export { init, sync, list } 

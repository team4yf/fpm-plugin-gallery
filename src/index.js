import _ from 'lodash'
import { Gallery } from './gallery'
import { init } from './qiniu.js'

export default {
  bind: (fpm) => {
    fpm.registerAction('BEFORE_MODULES_ADDED', (args) => {
      const c = fpm.getConfig('qiniu')
      let qiniuConfig = _.assign({
        bucket: 'yfsoft',
        prefix: 'fpm|',
        domain: 'olk3bzfd5.bkt.clouddn.com',
        ACCESS_KEY: '65nep44MNB8Ft1v_L1f7jaSnP8P07buuMMN4kI81',
        SECRET_KEY: 'kZxy-i93_B98yg4lNn7XmSujeZh_JWRxQOJX3E_m',
      }, c || {})
      init(qiniuConfig)

      let biz = args[0]
      if(biz.v === '0.0.1'){
        biz.m = _.assign(biz.m, {
          gallery: Gallery(fpm, qiniuConfig)
        })
      }
    })
  }
}

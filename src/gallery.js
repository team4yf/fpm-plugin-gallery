import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { init, sync, list } from './qiniu.js'
import crypto from 'crypto'
import map from 'async/map'

/**
 * image
 * name:
 * data:
 * size:
 * type:
 */
const saveImage = (image, cb) => {
  const dataBuffer = new Buffer(image.data, 'base64')
  delete image.data
  crypto.pseudoRandomBytes(16, (err, raw) => {
    const randomHex = raw.toString('hex')
    const filename = "images" + path.sep + randomHex
    image.id = randomHex
    image.filename = filename
    fs.writeFile(filename, dataBuffer, (err) => {
      sync(image)
        .then((data) => {
          fs.unlink(filename) // remove the file
          cb(null, _.assign(data, {name: image.name} ))
        }).catch((err) => {
          cb(err)
        })
    })
  })
  
}

const checkImagesDir = () => {
  fs.exists('images', (flag) => {
    if(!flag){
      fs.mkdir('images')
    }
  })
}
const Gallery =  (fpm) => {
  checkImagesDir()
  return {
    list: async () =>{
      return await list()
    },
    upload: (images) => {
      
      if(_.isArray(images)){

      }else{
        images = [images]
      }
      return new Promise( (rs, rj ) => {
        map(images, 
        (image, cb) => {
          saveImage(image, cb)
        },
        (err, list)=>{
          if(err){
            rj(err)
          }else{
            rs({ data: list} )
          }
        })
      })
    }
  }
}

export { Gallery }
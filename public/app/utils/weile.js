var Q = require('q')
var _ = require('underscore')
var request = require('superagent')
var crypto = require('crypto')
var NProgress = require('nprogress')
var Tip = require('../actions/tip')
var Storage = require('./storage')

NProgress.configure({
  minimum: 0.618,
  speed: 300
})

function md5(data) {
  return crypto.createHash('md5').update(data).digest('hex')
}

function get(url, data) {
  var deferred = Q.defer()
  NProgress.start()
  request
    .get('/weileService/' + url)
    .query(data)
    .end(function(error, responese) {
      NProgress.done()
      if (error) {
        deferred.reject(new Error(error))
      } else {
        var data = responese.body
        switch (+data.resultCode) {
          case 0:
            deferred.resolve(data)
            break
          case 9003:
            data.msg = '系统错误'             
          default:
            Tip.alert(data.msg)
            deferred.reject(data)
        }
      }
    })
  return deferred.promise
}


function get2(url,data,head) {
  console.log("get2方法~~~")
  var deferred = Q.defer()
  NProgress.start()
  request
    .get('/weileService/' + url)
    .query(data)
    .set('scode',head)
    .end(function(error, responese) {
      NProgress.done()
      if (error) {
        console.log("get2出错啦！")
        console.log(error)
        deferred.reject(new Error(error))
      } else {
        console.log("get2正确！")
        var data = responese.body
        switch (+data.resultCode) {
          case 0:
            deferred.resolve(data)
            break
          case 9003:
            data.msg = '系统错误'             
          default:
            Tip.alert(data.msg)
            deferred.reject(data)
        }
      }
    })
  return deferred.promise
}


function post(url, data) {
  var deferred = Q.defer()
  NProgress.start()
  request
    .post('/weileService/' + url)
    .send(data)
    .set({
      cityId: Storage.cityId()
    })
    .end(function(error, responese) {
      NProgress.done()
      if (error) {
        deferred.reject(new Error(error))
      } else {
        var data = responese.body
        switch (+data.resultCode) {
          case 0:
            deferred.resolve(data)
            break
          case 8000:
          case 9000:
            Storage.isLogined(false)
            Tip.alert('登录超时，请重新登录') 
            window.location.href = '#/auth'
            break
          case 9003:
            data.msg = '系统错误'
          default:
            Tip.alert(data.msg)
            deferred.reject(data)
        }
      }
    })
  return deferred.promise
}

module.exports = {
  md5: md5,
  get: get,
  get2:get2,
  post: post,
  NProgress: NProgress
}
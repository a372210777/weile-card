var Storage = require('../tools/storage')
var UserAction = require('../actions/user')

var CONSTANT = {
  isLogined: 'ISLOGINED',
  cityId: 'CITYID',
  lng: 'LONGITUDE',
  lat: 'LATITUDE'
}

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      var c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}

function isLogined(state) {
  if (typeof state === 'boolean') {
    state && UserAction.signIn() 
    window.sessionStorage.setItem(CONSTANT.isLogined, state ? 1 : 0)
  }
  return !!+window.sessionStorage.getItem(CONSTANT.isLogined) || !!+getCookie(CONSTANT.isLogined) || false
}

function cityId(id) {
  id && Storage.set(CONSTANT.cityId, id)
  id = Storage.get(CONSTANT.cityId) || getCookie(CONSTANT.cityId)
  if (id) {
    return id
  } else {
    window.location.href = '#/city'
    return '53'
  }
}

function geoLocation(lng, lat) {
  lng && lat && Storage.set(CONSTANT.lng, lng) && Storage.set(CONSTANT.lat, lat)
  return {
    lng: Storage.get(CONSTANT.lng) || '',
    lat: Storage.get(CONSTANT.lat) || ''
  }
}

module.exports = {
  isLogined: isLogined,
  cityId: cityId,
  geoLocation: geoLocation
}
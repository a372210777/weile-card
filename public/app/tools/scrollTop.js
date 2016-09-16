var requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(callback, element, delay) {
      window.setTimeout(callback, delay || (1000 / 60))
    }
})()

var getSource = function() {
  var supportPageOffset = window.pageXOffset !== undefined
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat")
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
    document.documentElement.scrollTop : document.body.scrollTop
}

// t 当前时间 b 初始值 c 变化量 d 持续时间
var Tween = {
  easeInOutCubic: function(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b
    return c / 2 * ((t -= 2) * t * t + 2) + b
  },
  easeInOutQuart: function(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b
  },
  easeInOutExpo: function(t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }
}

var startAnimateTopScroll = function(tposition) {
  var source = getSource()
  var target = tposition
  var start = 0
  var duration = 48

  var run = function() {
    start++
    if (target > source) {
      var t = Tween.easeInOutExpo(start, source, target - source, duration)
      window.scrollTo(0, t)
    } else {
      var t = Tween.easeInOutExpo(start, 0, source - target, duration)
      window.scrollTo(0, source - t)
    }
    if (start < duration) requestAnimationFrame(run)
  }
  run()
}

module.exports = {
  to: startAnimateTopScroll
}
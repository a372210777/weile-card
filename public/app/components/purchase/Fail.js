var React = require('react/addons')
var Router = require('react-router')

module.exports = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function(){
    return {
      timer: 3
    }
  },
  componentDidMount: function(){
    var id = setInterval(function(){
      var t = this.state.timer
      if (t) {
        this.setState({timer: --t})
      } else {
        clearInterval(id) 
        this.transitionTo('/')
      }
    }.bind(this), 1000)
  },
  render: function(){
    return (
      <div className="f-view-container" id="view-purchase-fail">
        支付失败，{this.state.timer}秒后返回首页
      </div>
    ) 
  }
}) 
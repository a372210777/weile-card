var React = require('react/addons')
var Router = require('react-router')
var Weile = require('../../utils/weile')

var View = React.createClass({
  render: function() {
    var data = this.props.data || {}
    return (
      <div className="f-view-container" id="view-leshang-album">
        {data.detailIcon.map(function(item, index){
          return (
            <img src={item.bigImage} key={index}/>
          )
        })}
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function(){
    this.getLeshangDetail()
    return {
      data: ''
    }
  },
  getLeshangDetail: function(){
    Weile
      .get('requestSellerDetail', {
        data: JSON.stringify({
          merchantId: this.props.params.leshangId
        })
      })
      .then(function(data){
        this.setState({data: data.data})
      }.bind(this))
      .fail(function(){})
  },
  handleGoback: function(e){
    e.preventDefault()
    this.goBack() || this.replaceWith('/')
  },
  render: function(){
    var _V = false
    if (this.state.data) {
      _V = <View data={this.state.data}/>
    }
    return (
      <div>
        <div id="second-header">
          <header>
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i>
            </div>
            <span className="title f16">乐商门店详情</span>
          </header>
        </div>
        {_V}
      </div>
    )
  }
})
var React = require('react/addons')
var Router = require('react-router')
var _ = require('underscore')

var Auth = require('../mixins/Auth_view')
var Weile= require('../../utils/weile')
var Card = require('./Card')

var View = React.createClass({
  render: function() {
    var data = this.props.data || {}
    var rule = data.rule.replace(/\n/g, '<br>')
    return (
      <div className="f-view-container" id="view-my-member-card">
        <Card.Card data={data} isOpen={true} />
        <section className="info-section use-tip">
          使用方法：向商家出示上方的二维码
        </section>
        <section className="info-section">
          <div className="title">使用说明</div>
          <div className="content" dangerouslySetInnerHTML={{__html: rule}}/> 
        </section>
        <section className="info-section">
          <div className="title">适用门店</div>
          <ul className="list-unstyled content store-wrap">
          {data.stores.map(function(item, index){
            return (
              <li key={index}>
                <Router.Link to={'/leshangs/' + item.storeId}>
                  <div className="name">{item.name}</div>
                </Router.Link>
                <div className="address">{item.address}</div>
                <a className="phone" href={'tel:' + item.phone}><i className="fontello-icon">&#xe80c;</i></a>
              </li> 
            )
          })}
          </ul>
        </section>      
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Router.Navigation, Auth],
  getInitialState: function() {
    this.getMemberCard()
    return {
      data: null
    }
  },
  getMemberCard: function() {
    Weile
      .post('getMemberCard', {
        data: this.props.params.cardId
      })
      .then(function(data){
        var d = {}
        _.extend(d, data.data.cards)
        _.extend(d, data.data.memberCards)
        d.stores = data.data.stores
        d.cardName = d.name
        d.type = '5'
        this.setState({data: d})
      }.bind(this))
      .fail(function(){})
  },
  handleGoback: function(e){
    e.preventDefault()
    this.goBack() || this.replaceWith('/cardbag')
  },  
  render: function() {
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
            <span className="title f16">我的会员卡</span>
          </header>
        </div>
        {_V} 
      </div>
    )
  }
})
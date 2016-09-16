var React = require('react/addons')
var Router = require('react-router')
var Reflux = require('reflux')

var Weile = require('../../utils/weile')
var Auth = require('../mixins/Auth_func')

var CardbagAction= require('../../actions/cardbag')
var CardbagStore = require('../../stores/cardbag')

var View = React.createClass({
  mixins: [Auth],
  handleClick: function(e) {
    var card = this.props.data || {}
    var myCardId = this.props.myCardId
    if (myCardId) {
      this.transitionTo('/cardbag/5/' + myCardId)
    } else if (card.price == '0') {
      if (!this.isLogined()) return 
      Weile
        .post('receiveMerchantCard', {
          data: {
            cardId: card.cardId,
            buyMerchantId: card.merchantId
          }
        })
        .then(function(data) {
          CardbagAction.update()
        }.bind(this))
        .fail(function(data) {
        }.bind(this))           
    } else {
      this.transitionTo('/purchase/membercard/' + card.cardId)
    }
  },
  render: function() {
    var card = this.props.data || {}
    var desc = card.description.replace('\n', '<br>')
    var rule = card.rule.replace(/\n/g, '<br>')
    var cardState = this.props.myCardId ? '1' : (card.price == '0') ? '2' : '3'  // 已经持有、免费领取、需要购买
    return (
      <div className="f-view-container" id="view-member-card">
        <div className="member-card">
          <div className="content">
            <div className="left-side">
              <span className="f16">¥</span>{card.amount/1000}
            </div>
            <div className="right-side">
              <div className="name">{card.name}</div>
            </div>
          </div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logoUrl + ')'}}></div>
          <footer className="footer">
            售价{card.price/1000}元
          </footer>
        </div>
        <section className="info-section">
          <div className="title">领用说明</div>
          <div className="content" dangerouslySetInnerHTML={{__html: desc}}/>
        </section>
        <section className="info-section">
          <div className="title">使用说明</div>
          <div className="content" dangerouslySetInnerHTML={{__html: rule}}/> 
        </section>
        <section className="info-section">
          <div className="title">适用门店</div>
          <ul className="list-unstyled content store-wrap">
          {card.stores.map(function(item, index){
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
        <div className="handle-button-wrap">
          <button onClick={this.handleClick}>{['', '立即使用', '免费领取', '立即购买'][cardState]}</button>
        </div>   
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Router.Navigation, Reflux.connectFilter(CardbagStore, 'myCardId', function(data){
    var cardx = data.cardx || {}
    return cardx['5_' + this.props.params.cardId]
  })],
  getInitialState: function() {
    this.getMemberCard()
    return {
      data: null 
    }
  },
  getMemberCard: function() {
    Weile
      .get('getCard', {
        data: this.props.params.cardId
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
      _V = <View data={this.state.data} myCardId={this.state.myCardId} />
    }
    return (
      <div>
        <div id="second-header">
          <header className="member-card"> 
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i>
            </div>
            <span className="title f16">会员卡</span>
          </header>
        </div>
        {_V}
      </div>
    );
  }
})
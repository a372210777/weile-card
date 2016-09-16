var React = require('react/addons')
var Router = require('react-router')

var Weile = require('../../utils/weile')

var View = React.createClass({
  render: function(){
    var card = this.props.data || {}
    var desc = card.description.replace('\n', '<br>')
    var rule = card.rule.replace(/\n/g, '<br>')    
    return (
      <div className="f-view-container" id="view-card-cash-coupon">
        <div className="cash-coupon">
          <div className="content">
            <div className="left-side">
              <span className="f16">¥</span>{card.cardValue/1000}
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
          <Router.Link to={'/purchase/cashcoupon/' + card.cashCouponId + '?merchantId=' + card.merchantId}> 
            <button>立即购买</button>
          </Router.Link>
        </div>   
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    this.getCashCoupon()
    return {
      data: null
    }
  },
  getCashCoupon: function(){
    Weile
      .get('getCashCoupon', {
        data: JSON.stringify({
          cashCouponId: this.props.params.cardId
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
          <header className="cash-coupon"> 
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i>
            </div>
            <span className="title f16">代金券</span>
          </header>
        </div>
        {_V}
      </div>
    );
  }
});
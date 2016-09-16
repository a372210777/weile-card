var React = require('react/addons')
var Router = require('react-router')
var _ = require('underscore')
var Weile = require('../../utils/weile')

var View = React.createClass({
  handleDownload: function(e){
    var ifr = document.createElement('iframe')
    ifr.src = 'weile://'
    ifr.src = 'intent://yidinhuo.com/app?type=home#Intent;scheme=weile;end'
    ifr.style.display = 'none'
    document.body.appendChild(ifr)
    window.setTimeout(function(){
      document.body.removeChild(ifr)
    }, 2000)
    window.location.href = 'http://m.v89.com/'
  },
  render: function(){
    var data = this.props.data || {}
    var services = []
    _.each(data.serviceList, function(item){
      services.push(item.serviceName)
    })
    return (
      <div className="f-view-container" id="view-leshang-leshang">
        <section className="banner">
          <img src={data.icon}/>
          <Router.Link to={'/leshangs/' + this.props.merchantId + '/album'}>
          <ul className="list-unstyled">
            <li style={{backgroundImage: 'url('+ data.detailIcon[0].smallImage +')'}}></li>
            <li style={{backgroundImage: 'url('+ data.detailIcon[1].smallImage +')'}}></li>
          </ul>
          </Router.Link>
        </section>
        <section className="clearfix base-info-section">
          <div className="contact-wrap">
            <div className="name">{data.name}</div>
            <div className="address">{data.address}</div>
            <a className="phone" href={'tel:' + data.phone}><i className="fontello-icon">&#xe80c;</i></a>
          </div>
          <div className="pull-left star-wrap">
            <div style={{width: +data.star * 20 + '%'}}></div> 
          </div>
          <div className="pull-right hot-wrap">
            <i className="fontello-icon">&#xe80f;</i>{data.hotDegree}
          </div>
        </section>
        <section className="info-section">
          <ul className="list-unstyled card-list-wrap">
          {data.coupons.map(function(item, index){
            return (
              <Router.Link to={'/cards/1/' + item.couponId + '?type=' + (item.preferentialType || '')}>
              <li className="coupon">
                <i className="pull-right fontello-icon">&#xe808;</i>
                <div className="name">{item.name}</div>
              </li>
              </Router.Link>
            )
          })}
          {data.cashCoupons.map(function(item, index){
            return (
              <Router.Link to={'/cards/2/' + item.cashCouponId}>
              <li className="cash-coupon">
                <i className="pull-right fontello-icon">&#xe808;</i>
                <div className="name">{item.name}</div>
              </li>
              </Router.Link>
            )
          })}
          {data.cards.map(function(item, index){
            return (
              <Router.Link to={'/cards/5/' + item.cardId}>
              <li className="member-card"> 
                <i className="pull-right fontello-icon">&#xe808;</i>
                <div className="name">{item.name}</div>
              </li>
              </Router.Link>
            )
          })}          
          </ul>
        </section>
        <section className="info-section">
          <div className="title">商家介绍</div>
          <ul className="list-unstyled content">
            <li>营业时间：{data.businessTime}</li>
            <li>服务设施：{services.toString()}</li>
            <li>{data.desc}</li>
          </ul> 
        </section>
        <section className="info-section">
          <div className="app-download-wrap" onClick={this.handleDownload}>
            <i className="pull-right fontello-icon">&#xe808;</i>
            下载微乐APP
          </div>
        </section>
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
      _V = <View data={this.state.data} merchantId={this.props.params.leshangId}/>
    }
    return (
      <div>
        <div id="second-header">
          <header>
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i>
            </div>
            <span className="title f16">乐商详情</span>
            <Router.Link to="/cardbag"><div className="pull-right right-btn"><i className="fontello-icon">&#xe812;</i></div></Router.Link>
          </header>
        </div>
        {_V}
      </div>
    )
  }
})
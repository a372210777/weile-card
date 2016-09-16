var React = require('react/addons')
var QRCode = require('../../tools/qrcode')
var Weile = require('../../utils/weile')

var CouponMixins = {
  getInitialState: function(){
    return {
      isOpen: false,
      timestamp: Math.random().toString().substr(2)
    }
  },
  componentDidMount: function(){
    if (this.props.isOpen) {
      this.renderQrcode()
      this.setState({isOpen: true})
    }
  },
  toggleCard: function(e){
    e.preventDefault()
    this.setState({isOpen: !this.state.isOpen})
    this.renderQrcode()
  },
  renderQrcode: function(){
    var el = document.getElementById(this.state.timestamp);
    if (!el.hasChildNodes()) {
      if (this.props.data.state ==1) {
        var b = new Buffer(this.props.data.no + '_' + this.props.data.type);
        new QRCode(el, {
          text: b.toString('base64'),
          width: 102,
          height: 102
        });
      } else {
        var p = document.createElement('p')
        p.innerText = '下载微乐app体验更多功能'
        el.appendChild(p)
      }
    }    
  }
}
var Coupon = React.createClass({
  mixins: [CouponMixins],
  render: function(){
    var _state = false
    var _leftside = false
    var card = this.props.data || {}
    var cardStyle = 'card coupon coupon-' + card.preferentialType
    if (this.state.isOpen) cardStyle += ' card-opened'
    if (card.state == 1) {
      _state = (
        <div className="qrcode" onClick={this.toggleCard}></div>
      )
    } else {
      cardStyle += ' card-disabled'
      _state = (
        <div className="stale" onClick={this.toggleCard}>{['','','确认中','已使用','过期','作废'][card.state]}</div>
      )
    }
    if (card.preferentialType == '0' || card.preferentialType == '1') {
      _leftside = (
        <div className="left-side">
          <span className="f16">¥</span>{card.cardValue/1000}
        </div>
      )
    } else if (card.preferentialType == '3' || card.preferentialType == '4') {
      _leftside = (
        <div className="left-side">
          {card.discount || '8.8'}<span className="f16">折</span>
        </div>
      )
    }
    return (
      <div className="f-my-card-wrap">
        <div className="qrcode-wrap" id={this.state.timestamp} onClick={this.toggleCard}></div>
        <div className={cardStyle}>
          {_state}
          <div className="content">
            <div className="type">{card.preferentialName || '优惠券'}</div>
            {_leftside}
            <div className="right-side">
              <div className="name">{card.cardName}</div>
            </div>
          </div>
          <div className="no">NO.{card.no}</div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logoUrl + ')'}}></div>
        </div>
      </div>
    );
  }
})

var CashCoupon = React.createClass({
  mixins: [CouponMixins],
  render: function(){
    var _state = false
    var card = this.props.data || {}
    var cardStyle = 'card cash-coupon'
    if (card.state == 1) {
      _state = (
        <div className="qrcode" onClick={this.toggleCard}></div>
      )
    } else {
      cardStyle += ' card-disabled'
      _state = (
        <div className="stale"  onClick={this.toggleCard}>{['','','确认中','已使用','过期','作废'][card.state]}</div>
      )
    }
    if (this.state.isOpen) {
      cardStyle += ' card-opened'
    }
    return (
      <div className="f-my-card-wrap">
        <div className="qrcode-wrap" id={this.state.timestamp} onClick={this.toggleCard}></div>
        <div className={cardStyle}>
          {_state}
          <div className="content">
            <div className="type">代金券</div>
            <div className="left-side"><span className="f16">¥</span>{card.cardValue/1000}</div>
            <div className="right-side">
              <div className="name">{card.cardName}</div>
            </div>
          </div>
          <div className="no">NO.{card.no}</div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logoUrl + ')'}}></div>
        </div>
      </div>
    );
  }
})

var Card = React.createClass({
  getInitialState: function(){
    return {
      isOpen: false,
      timestamp: Math.random().toString().substr(2)
    }
  },
  componentDidMount: function(){
    if (this.props.isOpen) {
      this.renderQrcode()
      this.setState({isOpen: true})
    }
  },
  toggleCard: function(e){
    e.preventDefault()
    this.setState({isOpen: !this.state.isOpen})
    this.renderQrcode()
  },
  renderQrcode: function(){
    var el = document.getElementById(this.state.timestamp);
    if (!el.hasChildNodes()) {
      var card = this.props.data || {}
      Weile
        .post('GetMerchantCardCodeKey', {
          data: {
            no: card.no,
            cardType: '5'
          }
        })
        .then(function(data) {
          var b = new Buffer(data.data.key + '_' + card.no + '_5')
          new QRCode(el, {
            text: b.toString('base64'),
            width: 102,
            height: 102
          });
        })
        .fail(function(o){})
    }    
  },  
  render: function(){
    var card = this.props.data || {}
    var cardStyle = 'card member-card'
    if (this.state.isOpen) {
      cardStyle += ' card-opened'
    }
    return (
      <div className="f-my-card-wrap">
        <div className="qrcode-wrap" id={this.state.timestamp} onClick={this.toggleCard}></div>
        <div className={cardStyle}>
          <div className="qrcode" onClick={this.toggleCard}></div>
          <div className="content">
            <div className="type">会员卡</div>
            <div className="left-side"><span className="f16">¥</span>{card.amount/1000}</div>
            <div className="right-side">
              <div className="name">{card.cardName}</div>
            </div>
          </div>
          <div className="no">NO.{card.no}</div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logoUrl + ')'}}></div>
        </div>
      </div>
    );
  }  
})

module.exports = {
  Coupon: Coupon,
  CashCoupon: CashCoupon,
  Card: Card
}
var React = require('react/addons')
var Reflux = require('reflux')
var Router = require('react-router')
var _ = require('underscore')

var Weile = require('../../utils/weile')
var Auth = require('../mixins/Auth_func')

var CardsAction = require('../../actions/cards')
var CardbagAction= require('../../actions/cardbag')
var CardsStore = require('../../stores/cards')
var CardbagStore = require('../../stores/cardbag')
var Backtop = require('../global/Backtop')
var Filter =require('../global/Filter')

var Coupon = React.createClass({
  mixins: [Auth],
  handleReceive: function(e){
    e.stopPropagation()
    if (this.isLogined()) {
      if (this.props.myCardId) {
        this.transitionTo('/cardbag/1/' + this.props.myCardId)
      } else {
        Weile
          .post('receiveMerchantCoupon', {
            data: {
              couponId: this.props.card.id,
              receiveMerchantId: this.props.mid
            }
          })
          .then(function(data) {
            CardbagAction.update()
          }.bind(this))
          .fail(function(data) {
          }.bind(this))     
      } 
    }
  },
  handleLink: function(e) {
    if (this.props.myCardId) {
      this.transitionTo('/cardbag/1/' + this.props.myCardId)
    } else {
      this.transitionTo('/cards/1/' + this.props.card.id)
    }
  },
  render: function(){
    var _leftside = false
    var card = this.props.card || {}
    var classes = 'card coupon coupon-' + card.preferentialType
    if (this.props.myCardId) classes += ' is-have'
    if (card.preferentialType == '0' || card.preferentialType == '1') {
      _leftside = (
        <div className="left-side">
          <span className="f16">¥</span>{card.price/1000}
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
      <li className={classes} onClick={this.handleLink}>
        <div className="content">
          <div className="type">{card.preferentialName || '优惠券'}</div>
          {_leftside}
          <div className="right-side">
            <div className="name">{card.name}</div>
          </div>
        </div>
        <div className="logo" style={{backgroundImage: 'url(' + card.logo + ')'}}></div>
        <footer onClick={this.handleReceive}>
          已售{card.buyNum}张
          <span className="pull-right">{this.props.myCardId ? '立即使用' : '一键领取'}</span>
        </footer>
      </li> 
    );
  }
})

var CashCoupon = React.createClass({
  mixins: [Router.Navigation],
  handleClick: function(e){
    e.preventDefault()
    if (this.props.myCardId) {
      this.transitionTo('/cardbag/2/' + this.props.myCardId)
    } else {
      this.transitionTo('/purchase/cashcoupon/' + this.props.card.id + '?merchantId=' + this.props.mid)      
    }
  }, 
  render: function(){
    var card = this.props.card || {}
    var classes = 'card cash-coupon'
    if (this.props.myCardId) classes += ' is-have' 
    return (
      <Router.Link to={'/cards/2/' + card.id}>
        <li className={classes}>
          <div className="content">
            <div className="type">代金券</div>
            <div className="left-side">
              <span className="f16">¥</span>{card.price/1000}
            </div>
            <div className="right-side">
              <div className="name">{card.name}</div> 
            </div>
          </div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logo + ')'}}></div>
          <footer onClick={this.handleClick}>
            售价{card.buyPrice/1000}元
            <span className="pull-right">{this.props.myCardId ? '立即使用' : '立即购买'}</span>
          </footer>
        </li> 
      </Router.Link>
    );
  }
})
 
var MemberCard = React.createClass({
  mixins: [Auth],
  handleClick: function(e) {
    e.preventDefault()
    var card = this.props.card || {}
    var myCardId = this.props.myCardId
    if (myCardId) {
      this.transitionTo('/cardbag/5/' + myCardId)
    } else if (card.price == '0') {
      if (!this.isLogined()) return 
      Weile
        .post('receiveMerchantCard', {
          data: {
            cardId: card.id,
            buyMerchantId: this.props.mid
          }
        })
        .then(function(data) {
          CardbagAction.update() 
        }.bind(this))
        .fail(function(data) {
        }.bind(this))           
    } else {
      this.transitionTo('/purchase/membercard/' + card.id)
    }    
  },
  render: function(){
    var card = this.props.card || {}
    var classes = 'card member-card'
    if (this.props.myCardId) classes += ' is-have'
    var cardState = this.props.myCardId ? '1' : (card.price == '0') ? '2' : '3'  // 已经持有、免费领取、需要购买
    return (
      <Router.Link to={'/cards/5/' + card.id}>
        <li className={classes}>
          <div className="content">
            <div className="type">会员卡</div>
            <div className="left-side">
              <span className="f16">¥</span>{card.price/1000}
            </div>
            <div className="right-side">
              <div className="name">{card.name}</div> 
            </div>
          </div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logo + ')'}}></div>
          <footer onClick={this.handleClick}>
            售价{card.buyPrice/1000}元
            <span className="pull-right">{['', '立即使用', '免费领取', '立即购买'][cardState]}</span>
          </footer>
        </li> 
      </Router.Link>
    )
  }
})

var LeshangItem = React.createClass({
  render: function(){
    var _sort = false
    var sort = this.props.sortType || 1
    var leshang = this.props.leshang
    var cardx = this.props.cardx || {}
    if (sort == 1 && +leshang.distance) {
      var d = +leshang.distance
      if (d > 999) {
        d = (d/1000).toFixed(1) + 'km' 
      } else {
        d = d + 'm'
      }
      _sort = (
        <div className="distance-wrap">{d}</div>   
      )
    } else if (sort == 7) {
      var d = leshang.hotDegree
      if (d > 9999) {
        d = (d/10000).toFixed(1) + 'w'
      }
      _sort = (
        <div className="hot-wrap">
          <i className="fontello-icon">&#xe80f;</i> {d}
        </div>
      )
    } else {
      _sort = (
        <div className="star-wrap" style={{width: +leshang.star * 20 + '%'}}>
          <i className="fontello-icon">&#xe803;</i>
          <i className="fontello-icon">&#xe803;</i>
          <i className="fontello-icon">&#xe803;</i>
          <i className="fontello-icon">&#xe803;</i>
          <i className="fontello-icon">&#xe803;</i>
        </div>
      )
    }
    return (
      <li className="leshangs-wrap">
        <Router.Link to={'/leshangs/' + this.props.leshang.id}>
          <div className="leshang">
            {leshang.name}
            <div className="pull-right sort-info-wrap">
              {_sort}
            </div>
          </div>
        </Router.Link> 
        <ul className="list-unstyled cards-wrap">
          {this.props.leshang.cardList.map(function(item, index){
            var type = item.type
            var key = type + '_' + item.id
            if (type == 1) {
              return <Coupon card={item} mid={this.props.leshang.id} myCardId={cardx[key] || ''} key={key}/>
            } else if(type == 2) {
              return <CashCoupon card={item} mid={this.props.leshang.id} myCardId={cardx[key] || ''} key={key}/>
            } else if(type == 5) {
              return <MemberCard card={item} mid={this.props.leshang.id} myCardId={cardx[key] || ''} key={key}/>
            }
          }.bind(this))}
        </ul>
      </li> 
    );
  }
})

var LeshangList = React.createClass({
  render: function(){
    return (
      <ul className="list-unstyled">
        {this.props.leshangs.map(function(item,index){
          if (item.cardList.length) {
            return <LeshangItem leshang={item} cardx={this.props.cardx} sortType={this.props.sortType} key={index}/>
          }
        }.bind(this))}
      </ul>
    ); 
  }
})

var BottomStatus = React.createClass({
  handleClick: function(e){
    if (this.props.status && this.props.status != 4) {
      CardsAction.nextPage()
    }
  },
  render: function(){
    return (
      <div className="bottom-status-wrap" onClick={this.handleClick}>
        {['努力加载中...', '点击获取', '点击获取更多', '重新加载', '没有更多了'][this.props.status]}
      </div>
    );
  }
})

module.exports = React.createClass({
  mixins: [Reflux.connect(CardsStore, 'cards'), Reflux.connectFilter(CardbagStore, 'cardx', function(data){
    return data.cardx
  })],
  render: function(){
    var cards = this.state.cards
    var cardx = this.state.cardx
    return (
      <div className="f-view-container" id="view-card-cards">
        <div id="header-title-wrap">微乐卡券</div>
        <Router.Link to="/cardbag"><div id="header-right-btn-wrap"><i className="fontello-icon">&#xe812;</i></div></Router.Link>
        <Filter selected={_.pick(cards.query, 'cateId', 'sortId', 'regionId')} 
          regionData={cards.regions}
          action={CardsAction}/>
        <LeshangList leshangs={cards.list} cardx={cardx} sortType={cards.query.sortType}/>
        <BottomStatus status={cards.ajaxState}/>
        <Backtop/>
      </div>
    );
  }
});
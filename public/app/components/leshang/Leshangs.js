var React = require('react/addons')
var Reflux = require('reflux')
var Router = require('react-router')
var _ = require('underscore')

var Weile = require('../../utils/weile')
var LeshangsAction = require('../../actions/leshangs')
var LeshangsStore = require('../../stores/leshangs')
var Backtop = require('../global/Backtop')
var Filter =require('../global/Filter')

var LeshangItem = React.createClass({
  render: function(){
    var leshang = this.props.leshang
    var hot = +leshang.hotDegree
    var dis = +leshang.distance
    if (hot > 9999) {
      hot = (hot/10000).toFixed(1) + 'w'
    }
    if (dis > 999) {
      dis = (dis/1000).toFixed(1) + 'km' 
    } else {
      dis = dis + 'm'
    }
    return (
      <li className="clearfix leshangs-wrap">
        <Router.Link to={'/leshangs/' + leshang.merchantId}>
          <div className="leshang">
            <img className="pull-left" src={leshang.smallPicture}/>
            <div className="name">{leshang.name}</div>
            <div className="hot-wrap">
              <i className="fontello-icon">&#xe80f;</i> {hot}
            </div>
            <div className="pull-left star-wrap">
              <div className="star" style={{width: +leshang.star * 20 + '%'}}>
                <i className="fontello-icon">&#xe803;</i>
                <i className="fontello-icon">&#xe803;</i>
                <i className="fontello-icon">&#xe803;</i>
                <i className="fontello-icon">&#xe803;</i>
                <i className="fontello-icon">&#xe803;</i>
              </div>
            </div>
            <div className="pull-right">{+leshang.distance ? dis : ''}</div>
          </div>
        </Router.Link>
        <ul className="list-unstyled cards">
        {leshang.cardOrCouponsList.map(function(item, index){
          if (index < 2) {
            return (
              <Router.Link to={'/cards/' + item.type + '/' + item.id} key={item.id}>
                <li className={'card-' + item.type + '-' + (item.preferentialType || '')}>{item.name}</li>
              </Router.Link>  
            )
          } else if (index == 2) {
            return (
              <Router.Link to={'/leshangs/' + leshang.merchantId}>
                <li className="more" key={item.id}>查看更多优惠</li>
              </Router.Link>
            )
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
          return <LeshangItem leshang={item} key={index}/>
        }.bind(this))}
      </ul>
    ) 
  }
})

var BottomStatus = React.createClass({
  handleClick: function(e){
    if (this.props.status && this.props.status != 4) {
      LeshangsAction.nextPage()
    }
  },
  render: function(){
    return (
      <div className="bottom-status-wrap" onClick={this.handleClick}>
        {['努力加载中...', '点击获取', '点击获取更多', '重新加载', '没有更多了'][this.props.status]}
      </div> 
    )
  }
})

module.exports = React.createClass({
  mixins: [Reflux.connect(LeshangsStore, 'leshangs')],
  render: function(){
    var leshangs = this.state.leshangs
    return (
      <div className="f-view-container" id="view-leshang-leshangs">
        <div id="header-title-wrap">乐商</div>
        <Filter selected={_.pick(leshangs.query, 'cateId', 'sortId', 'regionId')} 
          regionData={leshangs.regions}
          action={LeshangsAction}/>
        <LeshangList leshangs={leshangs.list}/>
        <BottomStatus status={leshangs.ajaxState}/>
        <Backtop/>
      </div>
    )
  }
}) 
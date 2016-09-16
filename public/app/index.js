var React = require('react/addons')
var Router = require('react-router')
var FastClick = require('fastclick')

var GHeader = require('./components/global/Header')
var GTip = require('./components/global/Tip')

var Cards = require('./components/card/Cards')
var Coupon = require('./components/card/Coupon')
var CashCoupon = require('./components/card/CashCoupon')
var MemberCard = require('./components/card/MemberCard')

var PurchaseCashCoupon = require('./components/purchase/CashCoupon')
var PurchaseMemberCard = require('./components/purchase/MemberCard')
var PurchaseFail = require('./components/purchase/Fail')

var Leshangs = require('./components/leshang/Leshangs')
var Leshang = require('./components/leshang/Leshang')
var LeshangAlbum = require('./components/leshang/Album')

var MyCard = require('./components/cardbag/Cardbag')
var MyCoupon = require('./components/cardbag/Coupon')
var MyCashCoupon = require('./components/cardbag/CashCoupon')
var MyMemberCard = require('./components/cardbag/MemberCard') 

var Auth = require('./components/user/Auth')
var City = require('./components/user/City')
var Password = require('./components/user/Password')

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup
// initialize
FastClick(document.body)
document.getElementById('weile-launch-wrap').classList.add('leave')
// 
var App = React.createClass({
  render: function(){
    return (
      <div>
        <Router.RouteHandler/>
        <GTip/>
      </div>
    )
  }
})

var FirstPage = React.createClass({
  render: function(){
    return (
      <div>
        <GHeader/>
        <Router.RouteHandler/>
      </div>
    )
  }  
})

var SecondPage = React.createClass({
  render: function(){
    return (
      <div>
        <Router.RouteHandler/>
      </div>
    )
  }
})

var routes = (
  <Router.Route handler={App}>
    <Router.Route handler={FirstPage}>
      <Router.DefaultRoute handler={Cards}/>
      <Router.Route path="/leshangs" handler={Leshangs}/>
      <Router.Route path="/cards" handler={Cards}/>
      <Router.Route path="/cardbag" handler={MyCard}/>
      <Router.Route path="/auth" name="auth" handler={Auth}/>
      <Router.Route path="/city" handler={City}/>
      <Router.Route path="/password" handler={Password}/>
      <Router.Route path="/purchase/fail" handler={PurchaseFail}/>
    </Router.Route> 
    <Router.Route handler={SecondPage}>
      <Router.Route path="/leshangs/:leshangId" handler={Leshang}/>
      <Router.Route path="/leshangs/:leshangId/album" handler={LeshangAlbum}/>
      <Router.Route path="/cards/1/:cardId" handler={Coupon}/>
      <Router.Route path="/cards/2/:cardId" handler={CashCoupon}/>
      <Router.Route path="/cards/5/:cardId" handler={MemberCard}/>
      <Router.Route path="/cardbag/1/:cardId" handler={MyCoupon}/>
      <Router.Route path="/cardbag/2/:cardId" handler={MyCashCoupon}/>
      <Router.Route path="/cardbag/5/:cardId" handler={MyMemberCard}/> 
      <Router.Route path="/purchase/cashcoupon/:cardId" handler={PurchaseCashCoupon}/>
      <Router.Route path="/purchase/membercard/:cardId" handler={PurchaseMemberCard}/>
    </Router.Route>
  </Router.Route>
)

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body)
})
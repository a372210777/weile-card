'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Reflux = require('reflux');

var Overlay = require('../global/Overlay')
var Tip = require('../../actions/tip')
var Weile = require('../../utils/weile')
var CityStore = require('../../stores/city')

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

module.exports = React.createClass({
  mixins: [Router.Navigation, Reflux.connect(CityStore, 'city')],
  getInitialState: function(){ 
    return {
      isOpen: false
    };
  },
  toggleAside: function(e){
    window.document.getElementById('global-header').classList.toggle('active')
    this.setState({isOpen: !this.state.isOpen})
  },
  handleToggleAside: function(e){
    e.preventDefault()
    this.toggleAside()
  },
  handleTransition: function(e){
    e.stopPropagation()
    this.toggleAside()
    var to = e.currentTarget.dataset.to || '/'
    setTimeout(function(){
      this.transitionTo(to)
    }.bind(this),200)
  },
  handleDownload: function(e){
    e.stopPropagation()
    this.toggleAside()
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
    var overlay = false
    var aside = false
    if (this.state.isOpen) {
      overlay = (<Overlay style={{zIndex: 99}}/>)
    }
    return (
      <div id="global-header"> 
        <header>
          <div className="pull-left icon-btn menu-btn" onClick={this.handleToggleAside}></div>
        </header>
        <aside onClick={this.handleToggleAside}>
          <ul className="list-unstyled">
            <li data-to="/cards" onClick={this.handleTransition}>卡券<i className="pull-right fontello-icon">&#xe808;</i></li>
            <li data-to="/leshangs" onClick={this.handleTransition}>乐商<i className="pull-right fontello-icon">&#xe808;</i></li>
            <li data-to="/cardbag" onClick={this.handleTransition}>卡包<i className="pull-right fontello-icon">&#xe808;</i></li>
            <li data-to="/city" onClick={this.handleTransition}>城市：{this.state.city.name || ''}<i className="pull-right fontello-icon">&#xe808;</i></li>
            <li onClick={this.handleDownload}>下载微乐APP<i className="pull-right fontello-icon">&#xe808;</i></li>
          </ul>
        </aside>
        <ReactCSSTransitionGroup transitionName="fade">
          {overlay}
        </ReactCSSTransitionGroup>        
      </div>
    );
  }
});
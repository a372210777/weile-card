var React = require('react/addons')
var Router = require('react-router')
var _ = require('underscore')

var Backtop = require('../global/Backtop')
var Scrolltop = require('../../tools/scrollTop')
var cityData = require('../../data/city.json')
var CityAction = require('../../actions/city')

module.exports = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function(){
    var citys = _.groupBy(cityData, function(item) {
      return item.spell[0].toUpperCase()
    })
    var keys = _.keys(citys).sort()
    return { 
      keys: keys,
      citys: citys 
    } 
  },
  componentWillMount: function(){
  },
  handleClick: function(e){
    var id = e.currentTarget.dataset.id
    Scrolltop.to(window.document.getElementById('__' + id).offsetTop - 48)
  },
  changeCity: function(e){
    CityAction.changeCity(e.currentTarget.dataset.id)
    this.transitionTo('/')
  },
  render: function(){
    return (
      <div className="f-view-container" id="view-user-city">
        <div id="header-title-wrap">城市选择</div>
        <div className="block-title">按字母查找</div>
        <ul className="list-unstyled clearfix keys-wrap">
        {this.state.keys.map(function(item, index){
          return <li key={index} data-id={item} onClick={this.handleClick}>{item}</li>
        }.bind(this))}
        </ul>
        {this.state.keys.map(function(item, index){
          return (
            <div key={index}>  
              <div className="block-title" id={'__' + item}>{item}</div>
              <ul className="list-unstyled">
                {this.state.citys[item].map(function(item, index){
                  return <li key={index} data-id={item.id} onClick={this.changeCity}>{item.name}</li>
                }.bind(this))}
              </ul>
            </div>
          )
        }.bind(this))}
        <div className="block-title footer"></div>
        <Backtop/>
      </div>
    )
  } 
}) 
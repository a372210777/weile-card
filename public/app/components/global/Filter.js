var React = require('react/addons')
var Reflux = require('reflux')
var Iscroll = require('iscroll')
var _ = require('underscore')

var Weile = require('../../utils/weile')
var Storage = require('../../utils/storage')
var Overlay = require('../global/Overlay')
var Tip = require('../../actions/tip')
var Action = require('../../actions/cards')
var Store = require('../../stores/cards')
var CateData = require('../../data/cate.json')
var SortData = require('../../data/sort.json')
 
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

var CateFilter = React.createClass({
  getInitialState: function(){
    var superclass = _.filter(this.props.data, function(item){
      return item.parentid == '1'
    })
    var selected = _.find(this.props.data, function(item){
      return item.id == (this.props.id || '')
    }.bind(this))
    return _.extend({
      superclass: superclass,
      selected: selected
    }, this.formatData(this.props.id))
  },
  formatData: function(id) {
    if (!id) {  // 未选择
      return {
        supId: '',
        subclass: []
      }
    }
    var target = _.find(this.props.data, function(item){
      return item.id == id
    })
    var parentid = target.parentid == '1' ? target.id : target.parentid
    var subclass = _.filter(this.props.data, function(item){
      return item.parentid == parentid
    })
    subclass.unshift({"id": parentid,  "name": "全部", "parentid": parentid})
    return {
      supId: parentid,
      subclass: subclass 
    }
  },
  componentDidMount: function() {
    new Iscroll('#iscroll-wrap', {
      preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/ } 
    })
  },
  componentDidUpdate: function() {
    new Iscroll('#iscroll-wrap1',{
      preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/ } 
    })
  },
  handleParentClick: function(e){
    var id = e.currentTarget.dataset.id
    if (id) {
      this.setState(this.formatData(id))
      e.stopPropagation()
    } else {
      this.props.action.updateFilter({cateId: ''})
    }
  },
  handleChildClick: function(e) {
    var id = e.currentTarget.dataset.id
    var target = _.find(this.props.data, function(item){
      return item.id == id
    })
    this.props.action.updateFilter({cateId: target.id})
  },
  render: function(){
    return (
      <div className="clearfix content-wrap">
        <div className="iscroll-wrap half-content" id="iscroll-wrap">
          <ul className="list-unstyled">
            {this.state.superclass.map(function(item, index){
              var className = ''
              if (item.id == this.state.selected.id || item.id == this.state.selected.parentid) className += ' selected'
              if (item.id == this.state.supId) className += ' hover'
              return <li className={className} key={index} data-id={item.id} onClick={this.handleParentClick}>{item.name}</li>
            }.bind(this))}
          </ul>
        </div>
        <div className="iscroll-wrap half-content" id="iscroll-wrap1">
          <ul className="list-unstyled">
            {this.state.subclass.map(function(item, index){
              var className = ''
              if (item.id == this.state.selected.id) className += ' selected'
              return <li className={className} key={index} data-id={item.id} onClick={this.handleChildClick}>{item.name}</li>
            }.bind(this))}
          </ul>
        </div>
      </div>
    );
  }
})

var SortFilter = React.createClass({
  getInitialState: function(){
    return {
      data: this.props.data,
      selected: this.props.id || ''
    }
  },
  componentDidMount: function() {
    new Iscroll('#iscroll-wrap', {
      preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/ } 
    })
  },  
  handleClick: function(e) {
    var id = e.currentTarget.dataset.id || ''
    var name = this.props.name || '默认排序'
    var target = _.find(this.state.data, function(item){
      return item.id == id
    })
    if (id == 1) {
      Weile.NProgress.start()
      Tip.alert('定位中...')
      navigator.geolocation.getCurrentPosition(function(position) {
        Weile.NProgress.done()
        if (position.coords) {
          var lng = position.coords.longitude + ''
          var lat = position.coords.latitude + ''
          this.props.action.updateFilter({
            sortId: target.id,
            lng: lng,
            lat: lat
          })
          Storage.geoLocation(lng, lat) 
        } else {
          Tip.alert('定位失败')
        }
      }.bind(this), function(error) {
        Weile.NProgress.done()
        Tip.alert('定位失败')
      }, {
        enableHightAccuracy: false,
        timeout: 6000
      }) 
    } else {
      this.props.action.updateFilter({sortId: target.id})
    } 
  }, 
  render: function(){
    return (
      <div className="content-wrap">
        <div className="iscroll-wrap" id="iscroll-wrap">
          <ul className="list-unstyled">
            {this.state.data.map(function(item, index){
              var className = '' 
              if (item.id == this.state.selected) className += ' selected'
              return <li className={className} key={index} data-id={item.id} onClick={this.handleClick}>{item.name}</li>
            }.bind(this))}
          </ul>
        </div>
      </div>
    )
  }
})

var RegionFilter = React.createClass({
  getInitialState: function(){
    return {
      data: this.props.data,
      selected: this.props.id || ''
    }
  },
  componentDidMount: function() {
    new Iscroll('#iscroll-wrap', {
      preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/ } 
    })
  },  
  handleClick: function(e) {
    var id = e.currentTarget.dataset.id || ''
    var target = _.find(this.state.data, function(item){
      return item.id == id
    })
    this.props.action.updateFilter({regionId: target.id})
  },   
  render: function(){
    return (
      <div className="content-wrap">
        <div className="iscroll-wrap" id="iscroll-wrap">
          <ul className="list-unstyled">
            {this.state.data.map(function(item, index){
              var className = '' 
              if (item.id == this.state.selected) className += ' selected'
              return <li className={className} key={index} data-id={item.id} onClick={this.handleClick}>{item.name}</li>
            }.bind(this))}
          </ul>
        </div>
      </div>
    )
  }
})
 
module.exports = React.createClass({
  getInitialState: function(){
    return {
      key: 0  // 1 category 2 region 3 sort
    }
  },
  handleClick: function(e){
    var id = +e.currentTarget.dataset.id
    this.setState({key: this.state.key == id ? '' : id})
  },
  handleClose: function(e){
    e.preventDefault() 
    this.setState({key: 0})
  },
  render: function(){
    var cateId = this.props.selected.cateId
    var sortId = this.props.selected.sortId
    var regionId = this.props.selected.regionId

    var cate = _.find(CateData, function(item){
      return item.id == cateId
    }.bind(this))
    var sort = _.find(SortData, function(item){
      return item.id == sortId
    }.bind(this))
    var region = _.find(this.props.regionData, function(item){
      return item.id == regionId
    }.bind(this)) || {id: '', name: '全城'}

    var key = this.state.key
    var Content = false
    var Mask = false
    if (key) Mask = <Overlay style={{top: '89px', zIndex: 1}}/>
    switch (key) {
      case 1:
        Content = <CateFilter id={cateId} data={CateData} action={this.props.action}/>
        break
      case 2:
        Content = <SortFilter id={sortId} data={SortData} action={this.props.action}/>
        break
      case 3:
        Content = <RegionFilter id={regionId} data={this.props.regionData} action={this.props.action}/>
        break
    }
    return (
      <div id="global-filter">
        <ul className="list-unstyled clearfix header-wrap">
          <li data-id="1" className={key == '1' ? 'active' : ''} onClick={this.handleClick}>{cate.name}</li>
          <li data-id="2" className={key == '2' ? 'active' : ''} onClick={this.handleClick}>{sort.name}</li>
          <li data-id="3" className={key == '3' ? 'active' : ''} onClick={this.handleClick}>{region.name}</li>
        </ul>
        <div onClick={this.handleClose}>
          <ReactCSSTransitionGroup transitionName="fade">
            {Mask}
          </ReactCSSTransitionGroup>
        </div>
        <div onClick={this.handleClose}>
          {Content}
        </div>
      </div>
    )
  }
})
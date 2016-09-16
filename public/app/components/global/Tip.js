'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');

var Store = require('../../stores/tip')

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

module.exports = React.createClass({
  mixins: [Reflux.connect(Store)],
  render: function(){
    var _tip = false
    if (this.state.text) {
      _tip = <span className="tip" key={'tip'}>{this.state.text}</span>
    }
    return (
      <div id="global-tip">
        <ReactCSSTransitionGroup transitionName="fade" transitionEnter={false}>
          {_tip}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}); 
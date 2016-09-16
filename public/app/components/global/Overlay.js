var React = require('react/addons')

module.exports = React.createClass({
  componentWillMount: function(){
    window.document.body.addEventListener('touchmove', this.disableScroll)
  },
  componentWillUnmount: function(){
    window.document.body.removeEventListener('touchmove', this.disableScroll)
  },
  disableScroll: function(e){
    e.preventDefault()
  },
  render: function(){
    return (
      <div className="f-over-lay" style={this.props.style}></div>
    )
  }
}) 
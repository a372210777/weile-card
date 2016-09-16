var React = require('react/addons')

var Scrolltop = require('../../tools/scrollTop')

module.exports = React.createClass({
  getInitialState: function(){
    return {
      show: false
    }
  },
  componentDidMount: function(){
    window.onscroll = function(){
      this.setState({show: window.document.body.scrollTop > 200})
    }.bind(this)
  },
  goBackTop: function(e){
    Scrolltop.to(0)
  },  
  render: function(){
    return (
      <div className={this.state.show ? 'f-go-back-top' : 'f-go-back-top _h'} onClick={this.goBackTop}><i className="fontello-icon">&#xe801;</i></div>
    )
  }
})
var React = require('react/addons')
var Router = require('react-router')
var Validator = require('validator')
var TipAction = require('../../actions/tip')
var Weile = require('../../utils/weile')

var ResetPassword = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function(){
    return {
      timer: 0,
      codeify: false,
      passwordify: false,
      ajaxState: 1,    // 1初始态 0请求中 2成功 3失败
      eyeable: false
    }
  },
  resetPassword: function(uuid, identifyCode, password) {
    this.setState({ajaxState: 0})
    Weile
      .post('resetPassword', {
        encryptType: 2,
        data: {
          uuid: uuid,
          identifyCode: identifyCode,
          password: password
        }
      })
      .then(function(data){
        this.setState({ajaxState: 2})
        TipAction.alert('密码重置成功') 
        this.replaceWith('/auth?phone=' + this.props.uuid)
      }.bind(this))
      .fail(function(data){
        this.setState({ajaxState: 3})
      }.bind(this))
  },
  resetTimer: function(time){
    time = time || 180
    var id = setInterval(function() {
      if (time) {
        this.setState({
          timer: --time
        })
      } else {
        clearInterval(id)
      }
    }.bind(this), 1000)
  },
  handleSendCode: function(e){
    e.preventDefault();
    if(!this.state.timer) {
      this.resetTimer()
      this.refs.identifyCode.getDOMNode().focus()
      Weile
        .get('sendRestPasswordCode', {
          encryptType: 2,
          data: JSON.stringify({
            uuid: this.props.uuid
          })
        })
        .then(function(data){
        }.bind(this))
        .fail(function(data){
        }.bind(this))       
    }
  },
  handleChangeCode: function(e){
    var v = e.target.value.trim()
    this.setState({codeify: Validator.isLength(v, 4, 4)})
  },
  handleChangePassword: function(e){
    var v = e.target.value.trim()
    this.setState({passwordify: Validator.isLength(v, 6, 18)})
  },
  handleToggleEyeable: function(e){
    this.setState({eyeable: !this.state.eyeable})
  },
  handleSubmit: function(e){
    e.preventDefault()
    var code = this.refs.identifyCode.getDOMNode().value.trim()
    var pw = this.refs.password.getDOMNode().value.trim()
    var tip = Validator.isNull(code) ? '验证码不能为空' : 
    !Validator.isInt(code) ? '验证码错误' : 
    !Validator.isLength(code, 4, 4) ? '验证码错误' :
    Validator.isNull(pw) ? '密码不能为空' :
    !Validator.isLength(pw, 6) ? '密码太短，至少6位' : ''
    if (tip) {
      TipAction.alert(tip)
    } else if (this.state.ajaxState) {
      this.resetPassword(this.props.uuid, code, pw)
    }
  },
  render: function(){
    var t = this.state.timer
    var _eye = <i className="pull-right fontello-icon" onClick={this.handleToggleEyeable}>&#xe811;</i>
    if (this.state.eyeable) {
      _eye = <i className="pull-right fontello-icon" onClick={this.handleToggleEyeable}>&#xe810;</i>
    }
    var classes = (this.state.codeify && this.state.passwordify) ? '' : 'disabled'
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mt16 auth-code-wrap">
          <input ref="identifyCode" type="number" placeholder="验证码" autoFocus onChange={this.handleChangeCode}/>
          <button className={t ? 'disabled' : ''} type="button" onClick={this.handleSendCode}>{t || '获取验证码'}</button>
        </div>
        <div className="mt16 password-wrap">
          <input ref="password" type={this.state.eyeable ? 'text' : 'password'} placeholder="新密码 (至少6位)" onChange={this.handleChangePassword}/>
          {_eye}
        </div>
        <div className="mt32">
          <button className={classes} type="submit">重置密码</button>
        </div> 
      </form>
    )
  }
})

module.exports = React.createClass({
  getInitialState: function() {
    return {
      uuid: this.props.query.phone || ''
    }
  },
  handleChange: function(e){
    this.setState({uuid: e.target.value})
  },
  render: function(){
    var _C = false
    if (Validator.isMobilePhone(this.state.uuid, 'zh-CN')) {
      _C = <ResetPassword uuid={this.state.uuid}/>
    }
    return (
      <div className="f-view-container" id="view-user-auth">
        <div id="header-title-wrap">密码重置</div>
        <div className="uuid-wrap">
          <input ref="uuid" type="number" value={this.state.uuid} placeholder="请输入手机号" autoFocus onChange={this.handleChange}/>
        </div>
        {_C}
      </div>
    )
  }
})
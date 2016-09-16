var React = require('react/addons')
var Router = require('react-router')
var Validator = require('validator')

var TipAction = require('../../actions/tip')
var Weile = require('../../utils/weile')
var Storage = require('../../utils/storage')

var Login = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function(){
    return {
      timer: 0,
      passwordify: false,
      ajaxState: 1,    // 1初始态 0请求中 2成功 3失败
      eyeable: false
    }
  },
  login: function(uuid, password) {
    this.setState({ajaxState: 0})
    Weile
      .post('login', {
        data: {
          uuid: uuid,
          password: Weile.md5(password)
        }
      })
      .then(function(data){
        this.setState({ajaxState: 2})
        Storage.isLogined(true)
        if (Auth.goBackPath) {
          this.replaceWith(Auth.goBackPath)
        } else {
          this.goBack()
          this.replaceWith('/')
        }
      }.bind(this))
      .fail(function(data){
        this.setState({ajaxState: 3})
      }.bind(this))    
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
    var pw = this.refs.password.getDOMNode().value.trim()
    var tip = Validator.isNull(pw) ? '密码不能为空' :
    !Validator.isLength(pw, 6) ? '密码太短，至少6位' : ''
    if (tip) {
      TipAction.alert(tip)
    } else if (this.state.ajaxState) {
      this.login(this.props.uuid, pw)
    }
  },
  handleToPassword: function(e){
    e.preventDefault()
    this.replaceWith('/password?phone=' + this.props.uuid)
  },
  render: function(){
    var _eye = <i className="pull-right fontello-icon" onClick={this.handleToggleEyeable}>&#xe811;</i>
    if (this.state.eyeable) {
      _eye = <i className="pull-right fontello-icon" onClick={this.handleToggleEyeable}>&#xe810;</i>
    }
    var classes = (this.state.passwordify) ? '' : 'disabled'
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mt16 password-wrap">
          <input ref="password" type={this.state.eyeable ? 'text' : 'password'} placeholder="密码" autoFocus onChange={this.handleChangePassword}/>
          {_eye}
        </div>
        <div className="mt32">
          <button className={classes} type="submit">登录</button>
        </div>
        <div className="pull-right forget-password-wrap" onClick={this.handleToPassword}>
          忘记密码？
        </div>
      </form>
    )
  }
})

var Register = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function(){
    return {
      timer: 0,
      codeify: false,
      ajaxState: 1   // 1初始态 0请求中 2成功 3失败
    }
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
  register: function(uuid, identifyingCode){
    this.setState({ajaxState: 0})
    Weile
      .post('register', {
        data: {
          uuid: uuid,
          identifyingCode: identifyingCode
        }
      })
      .then(function(data){
        this.setState({ajaxState: 2})
        Storage.isLogined(true)
        if (confirm('下载微乐App，体验更多功能')) {
          var ifr = document.createElement('iframe')
          ifr.src = 'weile://'
          ifr.src = 'intent://yidinhuo.com/app?type=home#Intent;scheme=weile;end'
          ifr.style.display = 'none'
          document.body.appendChild(ifr)
          window.setTimeout(function(){
            document.body.removeChild(ifr)
          }, 2000)
          window.location.href = 'http://m.v89.com/'          
        } else {
          if (Auth.goBackPath) {
            this.replaceWith(Auth.goBackPath)
          } else {
            this.goBack()
            this.replaceWith('/')
          }
        }
      }.bind(this))
      .fail(function(data){
        this.setState({ajaxState: 3})
      }.bind(this))
  },
  handleClick: function(e){
    e.preventDefault()
    if(!this.state.timer) {
      this.resetTimer()
      this.refs.identifyingCode.getDOMNode().focus()
      // Weile
      //   .get('sendIdentyingCode', {
      //     encryptType: 2,
      //     data: JSON.stringify({
      //       uuid: this.props.uuid
      //     })
      //   })
      //   .then(function(data){
      //   }.bind(this))
      //   .fail(function(data){
      //   }.bind(this))      
       Weile
        .get('requestSendSMSCodes', {
          encryptType: 2,
          data: JSON.stringify({
          })
        })
        .then(function(data){
            var vcode="";
            var scode="";
            if(data.resultCode=="0"){
                vcode=data.data.vcode;
                scode=data.data.scode;
            }
            Weile
            .get('sendIdentyingCode', {
              encryptType: 2,
              data: JSON.stringify({
                uuid: this.props.uuid,
                vcode:vcode,
                scode:scode
              })
            })
            .then(function(data){
            }.bind(this))
            .fail(function(data){
            }.bind(this))    

        }.bind(this))
        .fail(function(data){
        }.bind(this))        
    }
  },
  handleChangeCode: function(e){
    var v = e.target.value.trim()
    this.setState({codeify: Validator.isLength(v, 4, 4)})
  },
  handleSubmit: function(e){
    e.preventDefault()
    var code = this.refs.identifyingCode.getDOMNode().value.trim()
    var tip = Validator.isNull(code) ? '验证码不能为空' : 
    !Validator.isInt(code) ? '验证码错误' : 
    !Validator.isLength(code, 4, 4) ? '验证码错误' : ''
    if (tip) {
      TipAction.alert(tip)
    } else if (this.state.ajaxState) {
      this.register(this.props.uuid, code)
    }
  },
  render: function(){
    var t = this.state.timer
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mt16 auth-code-wrap">
          <input ref="identifyingCode" type="number" placeholder="验证码" autoFocus onChange={this.handleChangeCode}/>
          <button className={t ? 'disabled' : ''} onClick={this.handleClick}>{t || '获取验证码'}</button>
        </div>
        <div className="mt32">
          <button className={this.state.codeify ? '' : 'disabled'}>注册</button>
        </div> 
      </form>
    )
  }
})

var Auth = React.createClass({
  statics: {
    goBackPath: ''
  },
  getInitialState: function() {
    Storage.isLogined() && this.replaceWith('/cardbag')
    var phone = this.props.query.phone || ''
    phone && this.inquirePhone(phone)
    return {
      uuid: phone,
      status: 0     // 0'未知'，1'登录'，2'注册'
    }
  },
  componentDidMount: function() {
    this.refs.uuid.getDOMNode().focus()
  },
  inquirePhone: function(uuid) {
    Weile
      .get('inquireRegisterMember', {
        encryptType: 0,
        data: JSON.stringify({
          uuid: uuid
        })
      })
      .then(function(data){
        if (+data.resultCode === 0) {
          this.setState({status: +data.data.data === 1 ? 1 : 2})
        }
      }.bind(this))
      .fail(function(data){
        this.setState({status: 1})
      }.bind(this))    
  },
  handleChange: function(e) {    
    var uuid = e.target.value
    this.setState({uuid: uuid})
    if (Validator.isMobilePhone(uuid, 'zh-CN')) {
      this.inquirePhone(uuid)
    } else {
      Validator.isLength(uuid, 12) && TipAction.alert('手机号太长')
      Validator.isLength(uuid, 11, 11) && TipAction.alert('手机号格式不对')
      this.setState({status: 0})
    }
  },
  render: function(){
    var cItem = false
    if (this.state.status == 1) {
      cItem = <Login uuid={this.state.uuid}/>
    } else if (this.state.status == 2){
      cItem = <Register uuid={this.state.uuid}/>
    }
    return (
      <div className="f-view-container" id="view-user-auth">
        <div id="header-title-wrap">身份验证</div>
        <div className="uuid-wrap">
          <input ref="uuid" value={this.state.uuid} type="number" placeholder="请输入手机号" autoFocus onChange={this.handleChange}/>
        </div>
        {cItem}
      </div>
    )
  }
})

module.exports = Auth
'use strict'
function Barrager(dom, para) {
  this.canvas = dom
  this.para = para
  this.ctx = this.canvas.getContext('2d')
  this.msgs = new Array(5) // 缓冲池，长度越大，屏幕上显示的就越多
  this.width = 600 // canvas分辨率1280*720
  this.height = dom.offsetHeight*this.width/dom.offsetWidth
  this.intv = 20 // 重绘的时间，ms
  this.nexts = 3000 // 下一条出现的时间，ms
  this.canvas.width = this.width // 上边的两步可以省略，直接在这里赋值
  this.canvas.height = this.height
  this.font = '30px 黑体' // 字体和字体大小
  this.ctx.font = this.font
  // 颜色数组，在绘制过程中随机从这里取出颜色
  this.colorArr = ['Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue']
  this.interval = ''
  this.draw = function() { // 绘制方法
    if(this.interval != '') return
    var _this = this
    this.interval = setInterval(function() { // 每隔20毫秒重新绘制一次，间隔最好小于40，要不然效果就跟播放图片差不多
      // 1，清除屏幕
      _this.ctx.clearRect(0, 0, _this.width, _this.height)
      _this.ctx.save()
      // 2，循环缓冲区域，把没有设置Left，Top，Speed，Color先赋值，赋值的就改变left值（产生移动效果），left值小于200就会从缓冲区移除
      for(var i = 0; i < _this.msgs.length; i++) {
        if(!(_this.msgs[i] == null || _this.msgs[i] == '' || typeof(_this.msgs[i]) == 'undefined')) {
          if(_this.msgs[i].L == null || typeof(_this.msgs[i].L) == 'undefined') {
            _this.msgs[i].L = _this.width //显示的位置
            _this.msgs[i].T = parseInt(Math.random() * (_this.height - 30) + 30) // 容器范围内出现
            _this.msgs[i].S = parseInt(Math.random() * (3 - 1) + 1) // 速度
            _this.msgs[i].C = _this.colorArr[Math.floor(Math.random() * _this.colorArr.length)] // 颜色
          } else {
            if(_this.msgs[i].L < -_this.width) {
              _this.msgs[i] = null
            } else {
              _this.msgs[i].L = parseInt(_this.msgs[i].L - _this.msgs[i].S)
              _this.ctx.fillStyle = _this.msgs[i].C
              _this.ctx.fillText(_this.msgs[i].msg, _this.msgs[i].L, _this.msgs[i].T)
              _this.ctx.restore()
            }
          }
        }
      }
      _this.num = (_this.num ? (_this.num + _this.intv) : _this.intv)
      if(_this.num > _this.nexts) {
        _this.num = 0
        _this.putMsg([{
          'msg': _this.gettxt(_this.para)
        }])
      }
    }, _this.intv)
  }
  //添加数据，数据格式[{'msg':'nihao'}]
  this.putMsg = function(datas) { //循环缓冲区，把位置是空的装填上数据
    for(var j = 0; j < datas.length; j++) {
      for(var i = 0; i < this.msgs.length; i++) {
        if(this.msgs[i] == null || this.msgs[i] == '' || typeof(this.msgs[i]) == 'undefined') {
          this.msgs[i] = datas[j]
          break
        }
      }
    }
    this.draw()
  }
  this.clear = function() { //清除定时器，清除屏幕，清空缓冲区
    clearInterval(this.interval)
    this.interval = ''
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.save()
    for(var i = 0; i < this.msgs.length; i++) {
      this.msgs[i] = null
    }
  }
  this.gettxt = function ( data ) {
    return data[parseInt(Math.random() * data.length)].msg
  }
  this.init = function () {
    var _this = this
    _this.putMsg([{
      'msg': _this.gettxt(_this.para)
    }])
  }
}
export default Barrager
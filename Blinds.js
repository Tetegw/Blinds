/**
 * 作者： tetegw
 * 描述： 定位版百叶窗（手风琴）原生JS插件
 * =============================================================================
 * 调用： var newsfq = new Blinds({			创建Blinds
        	wrapId: 'box',
    	 });
 * 参数：
 * 		 wrapId: 'box'   					盒子Id（必填）
 * 		 imgurl: [							图片地址（必填；相对于本js的路径；个数随意）
	             'images/1.jpg',
	             'images/2.jpg',
	             'images/3.jpg',
	             'images/4.jpg',
	             'images/5.jpg'
	         ],
	     minWid: 100,						收缩的最小宽度（选填，默认值100）
	============================================================================
	html/css要求： 盒子css样式 width,height; 如下：
				  #wrapper{
				        width: 500px;
				        height: 200px;
			       }
 */
 (function(window,document) {
	 function Blinds(options) {
	     this.defaultdata = {
	         'wrapId': 'wrapper',
	         'imgurl': [
	             'images/1.jpg',
	             'images/2.jpg',
	             'images/3.jpg',
	             'images/4.jpg',
	             'images/5.jpg'
	         ],
	         'minWid': 100
	     };
	     this.init(options);
	 }

	 Blinds.prototype = {
	     constructor: Blinds,
	     init: function(options) {											//**初始化**
	         var _default = this.defaultdata;
	         this.extend(_default, options); 								//参数合并处理

	         this.wrapper = document.getElementById(_default.wrapId);		//获取盒子，设置属性
	         this.wrapper.style.position = 'relative';
	         this.wrapper.style.overflow = 'hidden';
	         var ul = document.createElement('ul');							//创建ul
	         this.wrapper.appendChild(ul);
	         this.wrapUl = this.wrapper.getElementsByTagName('ul')[0];
	         for (var i = 0; i < _default.imgurl.length; i++) {				//创建li，设置背景属性
	             var li = document.createElement('li');
	             li.style.width =this.getStyle(this.wrapper,'width');
	             li.style.height =this.getStyle(this.wrapper,'height');
	             li.style.backgroundImage = 'url(' + _default.imgurl[i] + ')';
	             li.style.position = 'absolute';
	             this.wrapUl.appendChild(li);
	         }
	         this.liList = this.wrapper.getElementsByTagName('li');
	         this.defaultWid = this.liList[0].offsetWidth / this.liList.length;	//获取设置没一个li默认展示宽度
	         for (var i = 0; i < this.liList.length; i++) {
	             this.liList[i].style.left = i * this.defaultWid + 'px';
	         }
	         this.bind();
	     },
	     bind: function() {														//**绑定事件**
	         var _this = this;
	         for (var i = 0; i < this.liList.length; i++) {						//绑定鼠标移入事件
	         	 this.liList[i].index = i;
	             this.liList[i].onmouseover = function() {
	                  _this.render(this.index);
	             };

	             this.liList[i].onmouseout = function() {					//绑定鼠标移出事件
	                 _this.render(-1);
	             }
	         }
	     },
	     render: function(index) {												//**渲染**
	         var num = this.liList.length;
	         var minWid = this.defaultdata.minWid;
	         var toWid = this.liList[0].offsetWidth;							//li总宽度

	         if (index === -1) {												//-1表示鼠标移出，回到默认状态
	             for (var i = 0; i < this.liList.length; i++) {
	                 this.animate(this.liList[i], {
	                     "left": i * this.defaultWid
	                 });
	             }
	             return false;
	         }

	         for (var i = 0; i < this.liList.length; i++) {						//按鼠标经过的index，计算设置每一距离
	             if (i <= index) {
	                 this.animate(this.liList[i], {
	                     "left": i * minWid
	                 });
	             } else {
	                 this.animate(this.liList[i], {
	                     "left": i * minWid + (toWid - minWid * num)
	                 });
	             }
	         }
	     },
	     animate: function(element, obj, fn) {									//**运动函数**
	         var _this = this;
	         //一点击的时候，先判断有没有定时器，如果有，清除定时器
	         if (element.timer) {
	             clearInterval(element.timer);
	         }
	         element.timer = setInterval(function() {
	             var flag = true; //假设都到达了终点
	             for (var k in obj) {
	                 var attr = k;
	                 var target = obj[k];
	                 var leader = parseInt(_this.getStyle(element, attr)) || 0;
	                 var step = (target - leader) / 10;
	                 step = step > 0 ? Math.ceil(step) : Math.floor(step);
	                 leader = leader + step;
	                 element.style[attr] = leader + "px";
	                 if (leader != target) {
	                     flag = false;
	                 }
	             }
	             if (flag) {
	                 clearInterval(element.timer);
	                 fn && fn();
	             }
	         }, 15);
	     },
	     getStyle: function(element, attr) {									//**获取css样式（可能带单位）**
	         if (window.getComputedStyle) {
	             return window.getComputedStyle(element, null)[attr];
	         } else {
	             return element.currentStyle[attr];
	         }
	     },
	     extend: function(oldObj, newObj) {										//**合并对象**
	         for (var k in newObj) {
	             oldObj[k] = newObj[k];
	         }
	     }
	 };

	 window.Blinds = Blinds;													//**沙箱暴露**
})(window,document);

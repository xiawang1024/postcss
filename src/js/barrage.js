'use strict';
var _createClass = (function() {
	function s(t, e) {
		for (var i = 0; i < e.length; i++) {
			var s = e[i];
			(s.enumerable = s.enumerable || !1),
				(s.configurable = !0),
				'value' in s && (s.writable = !0),
				Object.defineProperty(t, s.key, s);
		}
	}
	return function(t, e, i) {
		return e && s(t.prototype, e), i && s(t, i), t;
	};
})();
function _classCallCheck(t, e) {
	if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
}
var Barrage = (function() {
	function r(t) {
		var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 100,
			i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 7;
		_classCallCheck(this, r),
			(this.ctx = t.getContext('2d')),
			(this.width = t.width),
			(this.height = t.height),
			(this.msgs = new Array(e)),
			(this.msgStackLength = e),
			(this.fontSize = i),
			(this.intervalId = ''),
			(this.isRunning = !1),
			(this.isClose = !1);
		var s =
			(window.devicePixelRatio || 1) /
			(this.ctx.webkitBackingStorePixelRatio ||
				this.ctx.mozBackingStorePixelRatio ||
				this.ctx.msBackingStorePixelRatio ||
				this.ctx.oBackingStorePixelRatio ||
				this.ctx.backingStorePixelRatio ||
				1);
		this.ratio = 1.8;
		var n = t.width,
			a = t.height;
		(t.width = n * s),
			(t.height = a * s),
			(t.style.width = n + 'px'),
			(t.style.height = a + 'px'),
			this.ctx.scale(s, s);
		var o = navigator.userAgent;
		(-1 < o.indexOf('Android') || -1 < o.indexOf('Linux')) && (i = (12 / s) | 0),
			(this.ctx.font = i + 'px "PingFang SC", "Microsoft JhengHei", "Microsoft YaHei", "sans-serif"'),
			(this.ctx.shadowBlur = 1);
	}
	return (
		_createClass(r, [
			{
				key: '_getLimitRandom',
				value: function(t, e) {
					return Math.floor(Math.random() * (e - t) + t);
				}
			},
			{
				key: '_getRandomColor',
				value: function() {
					var t = [ '00', '33', '66', '99', 'cc', 'ff' ],
						e = t.length;
					return (
						'#' +
						t[this._getLimitRandom(0, e)] +
						t[this._getLimitRandom(0, e)] +
						t[this._getLimitRandom(0, e)]
					);
				}
			},
			{
				key: '_draw',
				value: function() {
					var s = this;
					this.isRunning ||
						(this.intervalId = setInterval(function() {
							s.ctx.clearRect(0, 0, s.width, s.height), s.ctx.save();
							for (var t = 0, e = 0; e < s.msgStackLength; e++)
								if (s.msgs[e])
									if (((s.isRunning = !0), s.msgs[e].left || 'number' == typeof s.msgs[e].left))
										if (s.msgs[e].left < 0 - s.msgs[e].width) s.msgs[e] = null;
										else {
											(s.msgs[e].left = s.msgs[e].left - s.msgs[e].speed),
												(s.ctx.shadowColor = s.msgs[e].color),
												(s.ctx.fillStyle = s.msgs[e].color),
												(s.ctx.font = s.ctx.font.replace(/(\d+)(px|em|rem|pt)/g, function(
													t,
													e,
													i
												) {
													return e * s.ratio + i;
												})),
												s.ctx.fillText(s.msgs[e].text, s.msgs[e].left, s.msgs[e].top),
												(s.ctx.font = s.ctx.font.replace(/(\d+)(px|em|rem|pt)/g, function(
													t,
													e,
													i
												) {
													return e / s.ratio + i;
												}));
											var i = s.ctx.measureText(s.msgs[e].text);
											(s.msgs[e].width = i.width * s.ratio), s.ctx.restore;
										}
									else
										(s.msgs[e].left = s.width),
											(s.msgs[e].top = s.msgs[e].top || s._getLimitRandom(40, s.height - 40)),
											(s.msgs[e].speed =
												s.msgs[e].speed || s._getLimitRandom(0, 2) + parseInt(s.fontSize / 10)),
											(s.msgs[e].color = s.msgs[e].color || s._getRandomColor());
								else (t += 1) === s.msgStackLength && (clearInterval(s.intervalId), (s.isRunning = !1));
						}, 10));
				}
			},
			{
				key: 'pushMessage',
				value: function(t) {
					if ((console.log(this.isClose), !this.isClose)) {
						for (var e = 0; e < this.msgStackLength; e++)
							if (!this.msgs[e]) {
								this.msgs[e] = t;
								break;
							}
						this._draw();
					}
				}
			},
			{
				key: 'clear',
				value: function() {
					this.isRunning && (clearInterval(this.intervalId), (this.isRunning = !1)),
						this.ctx.clearRect(0, 0, this.width, this.height),
						(this.msgs = this.msgs.map(function(t) {
							return null;
						}));
				}
			},
			{
				key: 'close',
				value: function() {
					this.isClose || ((this.isClose = !0), this.clear(), clearInterval(this.intervalId));
				}
			},
			{
				key: 'open',
				value: function() {
					(this.isClose = !1), this._draw();
				}
			}
		]),
		r
	);
})();

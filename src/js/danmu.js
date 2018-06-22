'use strict';
!(function(n) {
	var h = function(t, i, e) {
		(this.stage = new o(t, i, e)),
			(this.pool = new s(this.stage)),
			(this._data = this.pool._data),
			(this.rid = null),
			(this._isRunning = !1),
			this.__init(),
			this.__start();
	};
	(h.version = 'v0.0.1'),
		(h.Dom = n.document),
		(h.prototype = {
			__render: function() {
				if ((this.stage.clear(), (this._isRunning = !1), this.pool.check())) {
					this._isRunning = !0;
					for (var t = 0; t < this._data.length; t++) this._data[t].draw();
					this.rid = i(this.__render.bind(this));
				}
			},
			__init: function() {
				return this.stage.parent.appendChild(this.stage.layer), this;
			},
			__pause: function() {
				t(this.rid);
			},
			__start: function() {
				this.__render();
			},
			emit: function(t) {
				this.pool.push({ text: t.text || '\u9ed8\u8ba4\u6570\u636e', color: t.color || '#f00' }),
					this._isRunning || this.__render();
			}
		});
	var s = function(t) {
		(this.stage = t), (this.index = 0), (this._data = []), (this.context = this.stage.context);
	};
	s.prototype = {
		push: function(t) {
			var i = this.stage;
			this.index++, this.index >= i.lines - 1 && (this.index = 0);
			var e,
				s = new a(
					i.context,
					i.stageWidth,
					i.lineHeight * this.index,
					t.text,
					i.lineHeight + 'px ' + e || 'sans-serif',
					t.color
				);
			this._data.push(s);
		},
		removeItem: function(t) {
			this._data.splice(t, 1);
		},
		check: function() {
			if (!this._data.length) return !1;
			for (var t = 0; t < this._data.length; t++)
				this.getItem(t).x + this.getItem(t).textWidth < -this.stage.stageWidth && this.removeItem(t);
			return !0;
		},
		clear: function() {
			this._data = [];
		},
		getItem: function(t) {
			return this._data[t];
		}
	};
	var a = function(t, i, e, s, n, h, a) {
		(this.ctx = t),
			(this.text = s || '\u6d4b\u8bd5'),
			(this.font = n),
			(this.color = h),
			(this.textWidth = this.ctx.measureText(this.text).width),
			(this.speed = Math.pow(this.textWidth, 1 / 4)),
			(this.y = e),
			(this.x = i);
	};
	a.prototype = {
		draw: function() {
			(this.x = this.x - this.speed),
				(this.ctx.font = this.font),
				(this.ctx.textAlign = 'start'),
				(this.ctx.textBaseline = 'top'),
				(this.ctx.fillStyle = this.color),
				this.ctx.fillText(this.text, this.x, this.y);
		}
	};
	var o = function(t, i, e, s) {
		(this.parent = t && 1 === t.nodeType ? t : h.Dom.getElementById(t)),
			(this.parent.style.position = this.parent.style.position || 'relative'),
			(this.layer = h.Dom.createElement('canvas')),
			(this.id = this.layer.id = i),
			(this.dpr = n.devicePixelRatio || 1),
			(this.context = this.layer.getContext('2d')),
			(this.layer.width = this.stageWidth = this.parent.offsetWidth * this.dpr),
			(this.layer.height = this.stageHeight = this.parent.offsetHeight * this.dpr),
			(this.lineHeight = Math.max(this.stageHeight / e, 12)),
			(this.lines = e),
			(this.layer.style.width = this.parent.offsetWidth + 'px'),
			(this.layer.style.height = this.parent.offsetHeight + 'px'),
			(this.layer.style.display = 'block'),
			(this.layer.style.backgroundColor = s || 'transparent'),
			(this.layer.style.position = 'absolute'),
			(this.layer.style.left = 0),
			(this.layer.style.top = 0),
			(this.layer.style.zIndex = 1e2);
	};
	o.prototype = {
		clear: function() {
			this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
		}
	};
	var i =
			n.requestAnimationFrame ||
			n.mozRequestAnimationFrame ||
			n.webkitRequestAnimationFrame ||
			n.msRequestAnimationFrame ||
			n.oRequestAnimationFrame ||
			function(t) {
				return setTimeout(t, 16);
			},
		t =
			n.cancelAnimationFrame ||
			n.mozCancelAnimationFrame ||
			n.webkitCancelAnimationFrame ||
			n.webkitCancelRequestAnimationFrame ||
			n.msCancelAnimationFrame ||
			n.oCancelAnimationFrame ||
			function(t) {
				clearTimeout(t);
			};
	n.DanMa = h;
})(window);

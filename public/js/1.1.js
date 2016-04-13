webpackJsonp([1],Array(51).concat([
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ticker = __webpack_require__(52);
	
	var _ticker2 = _interopRequireDefault(_ticker);
	
	var _navigation = __webpack_require__(54);
	
	var _navigation2 = _interopRequireDefault(_navigation);
	
	var _home = __webpack_require__(56);
	
	var _home2 = _interopRequireDefault(_home);
	
	var _gallery = __webpack_require__(58);
	
	var _gallery2 = _interopRequireDefault(_gallery);
	
	var _canvas = __webpack_require__(60);
	
	var _canvas2 = _interopRequireDefault(_canvas);
	
	var _systems = __webpack_require__(3);
	
	var _systems2 = _interopRequireDefault(_systems);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var initialState = window.initialState;
	var state = window.state;
	
	var App = function () {
		function App() {
			var _this = this;
	
			_classCallCheck(this, App);
	
			this.$home = new _home2.default();
			this.canvas = new _canvas2.default();
			this.gallery = new _gallery2.default();
	
			this.navigation = new _navigation2.default();
	
			state.onenterhome = function () {
				_this.playTicker = false;
			};
			state.onlevehome = function () {
				_this.playTicker = true;
			};
	
			document.oncontextmenu = function () {
				return false;
			};
	
			state.init();
	
			(0, _ticker2.default)($('#canvas')[0], 50).on('draw', this.draw.bind(this));
	
			window.tick = _ticker2.default;
		}
	
		_createClass(App, [{
			key: 'draw',
			value: function draw() {
				this.canvas.render();
			}
		}]);
	
		return App;
	}();

	exports.default = App;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var EventEmitter = __webpack_require__(53).EventEmitter
	
	var _raf =
	  global.requestAnimationFrame ||
	  global.webkitRequestAnimationFrame ||
	  global.mozRequestAnimationFrame ||
	  global.msRequestAnimationFrame ||
	  global.oRequestAnimationFrame
	
	module.exports = ticker
	
	var currtime =
	  global.performance &&
	  global.performance.now ? function() {
	    return performance.now()
	  } : Date.now || function () {
	    return +new Date
	  }
	
	function ticker(element, rate, limit) {
	  var fps = 1000 / (rate || 60)
	    , emitter = new EventEmitter
	    , last = currtime()
	    , time = 0
	
	  var raf = _raf || function(fn, el) {
	    setTimeout(fn, fps)
	  }
	
	  limit = arguments.length > 2 ? +limit + 1 : 2
	
	  function loop() {
	    raf(loop, element || null)
	
	    var now = currtime()
	    var dt = now - last
	    var n = limit
	
	    emitter.emit('data', dt)
	    time += dt
	    while (time > fps && n) {
	      time -= fps
	      n -= 1
	      emitter.emit('tick', fps)
	    }
	
	    time = (time + fps * 1000) % fps
	    if (n !== limit) emitter.emit('draw', time / fps)
	    last = now
	  }
	
	  loop()
	
	  return emitter
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 53 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _eventemitter = __webpack_require__(55);
	
	var _eventemitter2 = _interopRequireDefault(_eventemitter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var state = window.state;
	
	var Navigation = function (_EventEmitter) {
		_inherits(Navigation, _EventEmitter);
	
		function Navigation() {
			_classCallCheck(this, Navigation);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Navigation).call(this));
	
			$('.menu__change').on('click', function () {
				state.showHome();
			});
	
			$('.menu__clear').on('click', function () {
				state.clear();
			});
	
			$('.menu__help').on('click', function () {
				state.showHelp();
			});
	
			$('.menu__share').on('click', function () {
				state.postMap();
			});
	
			$('.menu__gallery').on('click', function () {
				state.showGallery();
			});
	
			$('.layer').on('click', function () {
				state.resume();
			});
	
			return _this;
		}
	
		return Navigation;
	}(_eventemitter2.default);

	exports.default = Navigation;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} [once=false] Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Hold the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var events = this._events
	    , names = []
	    , name;
	
	  if (!events) return names;
	
	  for (name in events) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }
	
	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }
	
	  return names;
	};
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];
	
	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];
	
	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return false;
	
	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return this;
	
	  var listeners = this._events[evt]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;
	
	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _systems = __webpack_require__(3);
	
	var _systems2 = _interopRequireDefault(_systems);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var state = window.state;
	
	var Home = function Home() {
		_classCallCheck(this, Home);
	
		new Vue({
			el: '.home',
			data: {
				systems: _systems2.default,
				type: null
			},
			methods: {
				changeType: function changeType(e, type) {
					state.changeType(type);
				}
			}
		});
	};
	
	exports.default = Home;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process, Vue, jQuery) {/*!
	 * Vue.js v1.0.20
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	'use strict';
	
	function set(obj, key, val) {
	  if (hasOwn(obj, key)) {
	    obj[key] = val;
	    return;
	  }
	  if (obj._isVue) {
	    set(obj._data, key, val);
	    return;
	  }
	  var ob = obj.__ob__;
	  if (!ob) {
	    obj[key] = val;
	    return;
	  }
	  ob.convert(key, val);
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._proxy(key);
	      vm._digest();
	    }
	  }
	  return val;
	}
	
	/**
	 * Delete a property and trigger change if necessary.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 */
	
	function del(obj, key) {
	  if (!hasOwn(obj, key)) {
	    return;
	  }
	  delete obj[key];
	  var ob = obj.__ob__;
	  if (!ob) {
	    return;
	  }
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._unproxy(key);
	      vm._digest();
	    }
	  }
	}
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	 * Check whether the object has the property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @return {Boolean}
	 */
	
	function hasOwn(obj, key) {
	  return hasOwnProperty.call(obj, key);
	}
	
	/**
	 * Check if an expression is a literal value.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */
	
	var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
	
	function isLiteral(exp) {
	  return literalValueRE.test(exp);
	}
	
	/**
	 * Check if a string starts with $ or _
	 *
	 * @param {String} str
	 * @return {Boolean}
	 */
	
	function isReserved(str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F;
	}
	
	/**
	 * Guard text output, make sure undefined outputs
	 * empty string
	 *
	 * @param {*} value
	 * @return {String}
	 */
	
	function _toString(value) {
	  return value == null ? '' : value.toString();
	}
	
	/**
	 * Check and convert possible numeric strings to numbers
	 * before setting back to data
	 *
	 * @param {*} value
	 * @return {*|Number}
	 */
	
	function toNumber(value) {
	  if (typeof value !== 'string') {
	    return value;
	  } else {
	    var parsed = Number(value);
	    return isNaN(parsed) ? value : parsed;
	  }
	}
	
	/**
	 * Convert string boolean literals into real booleans.
	 *
	 * @param {*} value
	 * @return {*|Boolean}
	 */
	
	function toBoolean(value) {
	  return value === 'true' ? true : value === 'false' ? false : value;
	}
	
	/**
	 * Strip quotes from a string
	 *
	 * @param {String} str
	 * @return {String | false}
	 */
	
	function stripQuotes(str) {
	  var a = str.charCodeAt(0);
	  var b = str.charCodeAt(str.length - 1);
	  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
	}
	
	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var camelizeRE = /-(\w)/g;
	
	function camelize(str) {
	  return str.replace(camelizeRE, toUpper);
	}
	
	function toUpper(_, c) {
	  return c ? c.toUpperCase() : '';
	}
	
	/**
	 * Hyphenate a camelCase string.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var hyphenateRE = /([a-z\d])([A-Z])/g;
	
	function hyphenate(str) {
	  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}
	
	/**
	 * Converts hyphen/underscore/slash delimitered names into
	 * camelized classNames.
	 *
	 * e.g. my-component => MyComponent
	 *      some_else    => SomeElse
	 *      some/comp    => SomeComp
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var classifyRE = /(?:^|[-_\/])(\w)/g;
	
	function classify(str) {
	  return str.replace(classifyRE, toUpper);
	}
	
	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */
	
	function bind(fn, ctx) {
	  return function (a) {
	    var l = arguments.length;
	    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
	  };
	}
	
	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */
	
	function toArray(list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret;
	}
	
	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */
	
	function extend(to, from) {
	  var keys = Object.keys(from);
	  var i = keys.length;
	  while (i--) {
	    to[keys[i]] = from[keys[i]];
	  }
	  return to;
	}
	
	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	function isObject(obj) {
	  return obj !== null && typeof obj === 'object';
	}
	
	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	var toString = Object.prototype.toString;
	var OBJECT_STRING = '[object Object]';
	
	function isPlainObject(obj) {
	  return toString.call(obj) === OBJECT_STRING;
	}
	
	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * Define a property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */
	
	function def(obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  });
	}
	
	/**
	 * Debounce a function so it only gets called after the
	 * input stops arriving after the given wait period.
	 *
	 * @param {Function} func
	 * @param {Number} wait
	 * @return {Function} - the debounced function
	 */
	
	function _debounce(func, wait) {
	  var timeout, args, context, timestamp, result;
	  var later = function later() {
	    var last = Date.now() - timestamp;
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    }
	  };
	  return function () {
	    context = this;
	    args = arguments;
	    timestamp = Date.now();
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	    return result;
	  };
	}
	
	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */
	
	function indexOf(arr, obj) {
	  var i = arr.length;
	  while (i--) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	}
	
	/**
	 * Make a cancellable version of an async callback.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 */
	
	function cancellable(fn) {
	  var cb = function cb() {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments);
	    }
	  };
	  cb.cancel = function () {
	    cb.cancelled = true;
	  };
	  return cb;
	}
	
	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 *
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 */
	
	function looseEqual(a, b) {
	  /* eslint-disable eqeqeq */
	  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
	  /* eslint-enable eqeqeq */
	}
	
	var hasProto = ('__proto__' in {});
	
	// Browser environment sniffing
	var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
	
	// detect devtools
	var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
	
	// UA sniffing for working around browser-specific quirks
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isAndroid = UA && UA.indexOf('android') > 0;
	
	var transitionProp = undefined;
	var transitionEndEvent = undefined;
	var animationProp = undefined;
	var animationEndEvent = undefined;
	
	// Transition property/event sniffing
	if (inBrowser && !isIE9) {
	  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
	  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
	  transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
	  transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
	  animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
	  animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
	}
	
	/**
	 * Defer a task to execute it asynchronously. Ideally this
	 * should be executed as a microtask, so we leverage
	 * MutationObserver if it's available, and fallback to
	 * setTimeout(0).
	 *
	 * @param {Function} cb
	 * @param {Object} ctx
	 */
	
	var nextTick = (function () {
	  var callbacks = [];
	  var pending = false;
	  var timerFunc;
	  function nextTickHandler() {
	    pending = false;
	    var copies = callbacks.slice(0);
	    callbacks = [];
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]();
	    }
	  }
	
	  /* istanbul ignore if */
	  if (typeof MutationObserver !== 'undefined') {
	    var counter = 1;
	    var observer = new MutationObserver(nextTickHandler);
	    var textNode = document.createTextNode(counter);
	    observer.observe(textNode, {
	      characterData: true
	    });
	    timerFunc = function () {
	      counter = (counter + 1) % 2;
	      textNode.data = counter;
	    };
	  } else {
	    // webpack attempts to inject a shim for setImmediate
	    // if it is used as a global, so we have to work around that to
	    // avoid bundling unnecessary code.
	    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
	    timerFunc = context.setImmediate || setTimeout;
	  }
	  return function (cb, ctx) {
	    var func = ctx ? function () {
	      cb.call(ctx);
	    } : cb;
	    callbacks.push(func);
	    if (pending) return;
	    pending = true;
	    timerFunc(nextTickHandler, 0);
	  };
	})();
	
	function Cache(limit) {
	  this.size = 0;
	  this.limit = limit;
	  this.head = this.tail = undefined;
	  this._keymap = Object.create(null);
	}
	
	var p = Cache.prototype;
	
	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */
	
	p.put = function (key, value) {
	  var removed;
	  if (this.size === this.limit) {
	    removed = this.shift();
	  }
	
	  var entry = this.get(key, true);
	  if (!entry) {
	    entry = {
	      key: key
	    };
	    this._keymap[key] = entry;
	    if (this.tail) {
	      this.tail.newer = entry;
	      entry.older = this.tail;
	    } else {
	      this.head = entry;
	    }
	    this.tail = entry;
	    this.size++;
	  }
	  entry.value = value;
	
	  return removed;
	};
	
	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */
	
	p.shift = function () {
	  var entry = this.head;
	  if (entry) {
	    this.head = this.head.newer;
	    this.head.older = undefined;
	    entry.newer = entry.older = undefined;
	    this._keymap[entry.key] = undefined;
	    this.size--;
	  }
	  return entry;
	};
	
	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */
	
	p.get = function (key, returnEntry) {
	  var entry = this._keymap[key];
	  if (entry === undefined) return;
	  if (entry === this.tail) {
	    return returnEntry ? entry : entry.value;
	  }
	  // HEAD--------------TAIL
	  //   <.older   .newer>
	  //  <--- add direction --
	  //   A  B  C  <D>  E
	  if (entry.newer) {
	    if (entry === this.head) {
	      this.head = entry.newer;
	    }
	    entry.newer.older = entry.older; // C <-- E.
	  }
	  if (entry.older) {
	    entry.older.newer = entry.newer; // C. --> E
	  }
	  entry.newer = undefined; // D --x
	  entry.older = this.tail; // D. --> E
	  if (this.tail) {
	    this.tail.newer = entry; // E. <-- D
	  }
	  this.tail = entry;
	  return returnEntry ? entry : entry.value;
	};
	
	var cache$1 = new Cache(1000);
	var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
	var reservedArgRE = /^in$|^-?\d+/;
	
	/**
	 * Parser state
	 */
	
	var str;
	var dir;
	var c;
	var prev;
	var i;
	var l;
	var lastFilterIndex;
	var inSingle;
	var inDouble;
	var curly;
	var square;
	var paren;
	/**
	 * Push a filter to the current directive object
	 */
	
	function pushFilter() {
	  var exp = str.slice(lastFilterIndex, i).trim();
	  var filter;
	  if (exp) {
	    filter = {};
	    var tokens = exp.match(filterTokenRE);
	    filter.name = tokens[0];
	    if (tokens.length > 1) {
	      filter.args = tokens.slice(1).map(processFilterArg);
	    }
	  }
	  if (filter) {
	    (dir.filters = dir.filters || []).push(filter);
	  }
	  lastFilterIndex = i + 1;
	}
	
	/**
	 * Check if an argument is dynamic and strip quotes.
	 *
	 * @param {String} arg
	 * @return {Object}
	 */
	
	function processFilterArg(arg) {
	  if (reservedArgRE.test(arg)) {
	    return {
	      value: toNumber(arg),
	      dynamic: false
	    };
	  } else {
	    var stripped = stripQuotes(arg);
	    var dynamic = stripped === arg;
	    return {
	      value: dynamic ? arg : stripped,
	      dynamic: dynamic
	    };
	  }
	}
	
	/**
	 * Parse a directive value and extract the expression
	 * and its filters into a descriptor.
	 *
	 * Example:
	 *
	 * "a + 1 | uppercase" will yield:
	 * {
	 *   expression: 'a + 1',
	 *   filters: [
	 *     { name: 'uppercase', args: null }
	 *   ]
	 * }
	 *
	 * @param {String} s
	 * @return {Object}
	 */
	
	function parseDirective(s) {
	  var hit = cache$1.get(s);
	  if (hit) {
	    return hit;
	  }
	
	  // reset parser state
	  str = s;
	  inSingle = inDouble = false;
	  curly = square = paren = 0;
	  lastFilterIndex = 0;
	  dir = {};
	
	  for (i = 0, l = str.length; i < l; i++) {
	    prev = c;
	    c = str.charCodeAt(i);
	    if (inSingle) {
	      // check single quote
	      if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
	    } else if (inDouble) {
	      // check double quote
	      if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
	    } else if (c === 0x7C && // pipe
	    str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
	      if (dir.expression == null) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1;
	        dir.expression = str.slice(0, i).trim();
	      } else {
	        // already has filter
	        pushFilter();
	      }
	    } else {
	      switch (c) {
	        case 0x22:
	          inDouble = true;break; // "
	        case 0x27:
	          inSingle = true;break; // '
	        case 0x28:
	          paren++;break; // (
	        case 0x29:
	          paren--;break; // )
	        case 0x5B:
	          square++;break; // [
	        case 0x5D:
	          square--;break; // ]
	        case 0x7B:
	          curly++;break; // {
	        case 0x7D:
	          curly--;break; // }
	      }
	    }
	  }
	
	  if (dir.expression == null) {
	    dir.expression = str.slice(0, i).trim();
	  } else if (lastFilterIndex !== 0) {
	    pushFilter();
	  }
	
	  cache$1.put(s, dir);
	  return dir;
	}
	
	var directive = Object.freeze({
	  parseDirective: parseDirective
	});
	
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
	var cache = undefined;
	var tagRE = undefined;
	var htmlRE = undefined;
	/**
	 * Escape a string so it can be used in a RegExp
	 * constructor.
	 *
	 * @param {String} str
	 */
	
	function escapeRegex(str) {
	  return str.replace(regexEscapeRE, '\\$&');
	}
	
	function compileRegex() {
	  var open = escapeRegex(config.delimiters[0]);
	  var close = escapeRegex(config.delimiters[1]);
	  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
	  var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
	  tagRE = new RegExp(unsafeOpen + '(.+?)' + unsafeClose + '|' + open + '(.+?)' + close, 'g');
	  htmlRE = new RegExp('^' + unsafeOpen + '.*' + unsafeClose + '$');
	  // reset cache
	  cache = new Cache(1000);
	}
	
	/**
	 * Parse a template text string into an array of tokens.
	 *
	 * @param {String} text
	 * @return {Array<Object> | null}
	 *               - {String} type
	 *               - {String} value
	 *               - {Boolean} [html]
	 *               - {Boolean} [oneTime]
	 */
	
	function parseText(text) {
	  if (!cache) {
	    compileRegex();
	  }
	  var hit = cache.get(text);
	  if (hit) {
	    return hit;
	  }
	  text = text.replace(/\n/g, '');
	  if (!tagRE.test(text)) {
	    return null;
	  }
	  var tokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index, html, value, first, oneTime;
	  /* eslint-disable no-cond-assign */
	  while (match = tagRE.exec(text)) {
	    /* eslint-enable no-cond-assign */
	    index = match.index;
	    // push text token
	    if (index > lastIndex) {
	      tokens.push({
	        value: text.slice(lastIndex, index)
	      });
	    }
	    // tag token
	    html = htmlRE.test(match[0]);
	    value = html ? match[1] : match[2];
	    first = value.charCodeAt(0);
	    oneTime = first === 42; // *
	    value = oneTime ? value.slice(1) : value;
	    tokens.push({
	      tag: true,
	      value: value.trim(),
	      html: html,
	      oneTime: oneTime
	    });
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    tokens.push({
	      value: text.slice(lastIndex)
	    });
	  }
	  cache.put(text, tokens);
	  return tokens;
	}
	
	/**
	 * Format a list of tokens into an expression.
	 * e.g. tokens parsed from 'a {{b}} c' can be serialized
	 * into one single expression as '"a " + b + " c"'.
	 *
	 * @param {Array} tokens
	 * @param {Vue} [vm]
	 * @return {String}
	 */
	
	function tokensToExp(tokens, vm) {
	  if (tokens.length > 1) {
	    return tokens.map(function (token) {
	      return formatToken(token, vm);
	    }).join('+');
	  } else {
	    return formatToken(tokens[0], vm, true);
	  }
	}
	
	/**
	 * Format a single token.
	 *
	 * @param {Object} token
	 * @param {Vue} [vm]
	 * @param {Boolean} [single]
	 * @return {String}
	 */
	
	function formatToken(token, vm, single) {
	  return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
	}
	
	/**
	 * For an attribute with multiple interpolation tags,
	 * e.g. attr="some-{{thing | filter}}", in order to combine
	 * the whole thing into a single watchable expression, we
	 * have to inline those filters. This function does exactly
	 * that. This is a bit hacky but it avoids heavy changes
	 * to directive parser and watcher mechanism.
	 *
	 * @param {String} exp
	 * @param {Boolean} single
	 * @return {String}
	 */
	
	var filterRE = /[^|]\|[^|]/;
	function inlineFilters(exp, single) {
	  if (!filterRE.test(exp)) {
	    return single ? exp : '(' + exp + ')';
	  } else {
	    var dir = parseDirective(exp);
	    if (!dir.filters) {
	      return '(' + exp + ')';
	    } else {
	      return 'this._applyFilters(' + dir.expression + // value
	      ',null,' + // oldValue (null for read)
	      JSON.stringify(dir.filters) + // filter descriptors
	      ',false)'; // write?
	    }
	  }
	}
	
	var text = Object.freeze({
	  compileRegex: compileRegex,
	  parseText: parseText,
	  tokensToExp: tokensToExp
	});
	
	var delimiters = ['{{', '}}'];
	var unsafeDelimiters = ['{{{', '}}}'];
	
	var config = Object.defineProperties({
	
	  /**
	   * Whether to print debug messages.
	   * Also enables stack trace for warnings.
	   *
	   * @type {Boolean}
	   */
	
	  debug: false,
	
	  /**
	   * Whether to suppress warnings.
	   *
	   * @type {Boolean}
	   */
	
	  silent: false,
	
	  /**
	   * Whether to use async rendering.
	   */
	
	  async: true,
	
	  /**
	   * Whether to warn against errors caught when evaluating
	   * expressions.
	   */
	
	  warnExpressionErrors: true,
	
	  /**
	   * Whether to allow devtools inspection.
	   * Disabled by default in production builds.
	   */
	
	  devtools: process.env.NODE_ENV !== 'production',
	
	  /**
	   * Internal flag to indicate the delimiters have been
	   * changed.
	   *
	   * @type {Boolean}
	   */
	
	  _delimitersChanged: true,
	
	  /**
	   * List of asset types that a component can own.
	   *
	   * @type {Array}
	   */
	
	  _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],
	
	  /**
	   * prop binding modes
	   */
	
	  _propBindingModes: {
	    ONE_WAY: 0,
	    TWO_WAY: 1,
	    ONE_TIME: 2
	  },
	
	  /**
	   * Max circular updates allowed in a batcher flush cycle.
	   */
	
	  _maxUpdateCount: 100
	
	}, {
	  delimiters: { /**
	                 * Interpolation delimiters. Changing these would trigger
	                 * the text parser to re-compile the regular expressions.
	                 *
	                 * @type {Array<String>}
	                 */
	
	    get: function get() {
	      return delimiters;
	    },
	    set: function set(val) {
	      delimiters = val;
	      compileRegex();
	    },
	    configurable: true,
	    enumerable: true
	  },
	  unsafeDelimiters: {
	    get: function get() {
	      return unsafeDelimiters;
	    },
	    set: function set(val) {
	      unsafeDelimiters = val;
	      compileRegex();
	    },
	    configurable: true,
	    enumerable: true
	  }
	});
	
	var warn = undefined;
	
	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var hasConsole = typeof console !== 'undefined';
	    warn = function (msg, e) {
	      if (hasConsole && (!config.silent || config.debug)) {
	        console.warn('[Vue warn]: ' + msg);
	        /* istanbul ignore if */
	        if (config.debug) {
	          if (e) {
	            throw e;
	          } else {
	            console.warn(new Error('Warning Stack Trace').stack);
	          }
	        }
	      }
	    };
	  })();
	}
	
	/**
	 * Append with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function appendWithTransition(el, target, vm, cb) {
	  applyTransition(el, 1, function () {
	    target.appendChild(el);
	  }, vm, cb);
	}
	
	/**
	 * InsertBefore with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function beforeWithTransition(el, target, vm, cb) {
	  applyTransition(el, 1, function () {
	    before(el, target);
	  }, vm, cb);
	}
	
	/**
	 * Remove with transition.
	 *
	 * @param {Element} el
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function removeWithTransition(el, vm, cb) {
	  applyTransition(el, -1, function () {
	    remove(el);
	  }, vm, cb);
	}
	
	/**
	 * Apply transitions with an operation callback.
	 *
	 * @param {Element} el
	 * @param {Number} direction
	 *                  1: enter
	 *                 -1: leave
	 * @param {Function} op - the actual DOM operation
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function applyTransition(el, direction, op, vm, cb) {
	  var transition = el.__v_trans;
	  if (!transition ||
	  // skip if there are no js hooks and CSS transition is
	  // not supported
	  !transition.hooks && !transitionEndEvent ||
	  // skip transitions for initial compile
	  !vm._isCompiled ||
	  // if the vm is being manipulated by a parent directive
	  // during the parent's compilation phase, skip the
	  // animation.
	  vm.$parent && !vm.$parent._isCompiled) {
	    op();
	    if (cb) cb();
	    return;
	  }
	  var action = direction > 0 ? 'enter' : 'leave';
	  transition[action](op, cb);
	}
	
	var transition = Object.freeze({
	  appendWithTransition: appendWithTransition,
	  beforeWithTransition: beforeWithTransition,
	  removeWithTransition: removeWithTransition,
	  applyTransition: applyTransition
	});
	
	/**
	 * Query an element selector if it's not an element already.
	 *
	 * @param {String|Element} el
	 * @return {Element}
	 */
	
	function query(el) {
	  if (typeof el === 'string') {
	    var selector = el;
	    el = document.querySelector(el);
	    if (!el) {
	      process.env.NODE_ENV !== 'production' && warn('Cannot find element: ' + selector);
	    }
	  }
	  return el;
	}
	
	/**
	 * Check if a node is in the document.
	 * Note: document.documentElement.contains should work here
	 * but always returns false for comment nodes in phantomjs,
	 * making unit tests difficult. This is fixed by doing the
	 * contains() check on the node's parentNode instead of
	 * the node itself.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function inDoc(node) {
	  var doc = document.documentElement;
	  var parent = node && node.parentNode;
	  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
	}
	
	/**
	 * Get and remove an attribute from a node.
	 *
	 * @param {Node} node
	 * @param {String} _attr
	 */
	
	function getAttr(node, _attr) {
	  var val = node.getAttribute(_attr);
	  if (val !== null) {
	    node.removeAttribute(_attr);
	  }
	  return val;
	}
	
	/**
	 * Get an attribute with colon or v-bind: prefix.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {String|null}
	 */
	
	function getBindAttr(node, name) {
	  var val = getAttr(node, ':' + name);
	  if (val === null) {
	    val = getAttr(node, 'v-bind:' + name);
	  }
	  return val;
	}
	
	/**
	 * Check the presence of a bind attribute.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {Boolean}
	 */
	
	function hasBindAttr(node, name) {
	  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
	}
	
	/**
	 * Insert el before target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function before(el, target) {
	  target.parentNode.insertBefore(el, target);
	}
	
	/**
	 * Insert el after target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function after(el, target) {
	  if (target.nextSibling) {
	    before(el, target.nextSibling);
	  } else {
	    target.parentNode.appendChild(el);
	  }
	}
	
	/**
	 * Remove el from DOM
	 *
	 * @param {Element} el
	 */
	
	function remove(el) {
	  el.parentNode.removeChild(el);
	}
	
	/**
	 * Prepend el to target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function prepend(el, target) {
	  if (target.firstChild) {
	    before(el, target.firstChild);
	  } else {
	    target.appendChild(el);
	  }
	}
	
	/**
	 * Replace target with el
	 *
	 * @param {Element} target
	 * @param {Element} el
	 */
	
	function replace(target, el) {
	  var parent = target.parentNode;
	  if (parent) {
	    parent.replaceChild(el, target);
	  }
	}
	
	/**
	 * Add event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 * @param {Boolean} [useCapture]
	 */
	
	function on(el, event, cb, useCapture) {
	  el.addEventListener(event, cb, useCapture);
	}
	
	/**
	 * Remove event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */
	
	function off(el, event, cb) {
	  el.removeEventListener(event, cb);
	}
	
	/**
	 * For IE9 compat: when both class and :class are present
	 * getAttribute('class') returns wrong value...
	 *
	 * @param {Element} el
	 * @return {String}
	 */
	
	function getClass(el) {
	  var classname = el.className;
	  if (typeof classname === 'object') {
	    classname = classname.baseVal || '';
	  }
	  return classname;
	}
	
	/**
	 * In IE9, setAttribute('class') will result in empty class
	 * if the element also has the :class attribute; However in
	 * PhantomJS, setting `className` does not work on SVG elements...
	 * So we have to do a conditional check here.
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function setClass(el, cls) {
	  /* istanbul ignore if */
	  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
	    el.className = cls;
	  } else {
	    el.setAttribute('class', cls);
	  }
	}
	
	/**
	 * Add class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function addClass(el, cls) {
	  if (el.classList) {
	    el.classList.add(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      setClass(el, (cur + cls).trim());
	    }
	  }
	}
	
	/**
	 * Remove class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function removeClass(el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    setClass(el, cur.trim());
	  }
	  if (!el.className) {
	    el.removeAttribute('class');
	  }
	}
	
	/**
	 * Extract raw content inside an element into a temporary
	 * container div
	 *
	 * @param {Element} el
	 * @param {Boolean} asFragment
	 * @return {Element|DocumentFragment}
	 */
	
	function extractContent(el, asFragment) {
	  var child;
	  var rawContent;
	  /* istanbul ignore if */
	  if (isTemplate(el) && isFragment(el.content)) {
	    el = el.content;
	  }
	  if (el.hasChildNodes()) {
	    trimNode(el);
	    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
	    /* eslint-disable no-cond-assign */
	    while (child = el.firstChild) {
	      /* eslint-enable no-cond-assign */
	      rawContent.appendChild(child);
	    }
	  }
	  return rawContent;
	}
	
	/**
	 * Trim possible empty head/tail text and comment
	 * nodes inside a parent.
	 *
	 * @param {Node} node
	 */
	
	function trimNode(node) {
	  var child;
	  /* eslint-disable no-sequences */
	  while ((child = node.firstChild, isTrimmable(child))) {
	    node.removeChild(child);
	  }
	  while ((child = node.lastChild, isTrimmable(child))) {
	    node.removeChild(child);
	  }
	  /* eslint-enable no-sequences */
	}
	
	function isTrimmable(node) {
	  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
	}
	
	/**
	 * Check if an element is a template tag.
	 * Note if the template appears inside an SVG its tagName
	 * will be in lowercase.
	 *
	 * @param {Element} el
	 */
	
	function isTemplate(el) {
	  return el.tagName && el.tagName.toLowerCase() === 'template';
	}
	
	/**
	 * Create an "anchor" for performing dom insertion/removals.
	 * This is used in a number of scenarios:
	 * - fragment instance
	 * - v-html
	 * - v-if
	 * - v-for
	 * - component
	 *
	 * @param {String} content
	 * @param {Boolean} persist - IE trashes empty textNodes on
	 *                            cloneNode(true), so in certain
	 *                            cases the anchor needs to be
	 *                            non-empty to be persisted in
	 *                            templates.
	 * @return {Comment|Text}
	 */
	
	function createAnchor(content, persist) {
	  var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
	  anchor.__v_anchor = true;
	  return anchor;
	}
	
	/**
	 * Find a component ref attribute that starts with $.
	 *
	 * @param {Element} node
	 * @return {String|undefined}
	 */
	
	var refRE = /^v-ref:/;
	
	function findRef(node) {
	  if (node.hasAttributes()) {
	    var attrs = node.attributes;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      var name = attrs[i].name;
	      if (refRE.test(name)) {
	        return camelize(name.replace(refRE, ''));
	      }
	    }
	  }
	}
	
	/**
	 * Map a function to a range of nodes .
	 *
	 * @param {Node} node
	 * @param {Node} end
	 * @param {Function} op
	 */
	
	function mapNodeRange(node, end, op) {
	  var next;
	  while (node !== end) {
	    next = node.nextSibling;
	    op(node);
	    node = next;
	  }
	  op(end);
	}
	
	/**
	 * Remove a range of nodes with transition, store
	 * the nodes in a fragment with correct ordering,
	 * and call callback when done.
	 *
	 * @param {Node} start
	 * @param {Node} end
	 * @param {Vue} vm
	 * @param {DocumentFragment} frag
	 * @param {Function} cb
	 */
	
	function removeNodeRange(start, end, vm, frag, cb) {
	  var done = false;
	  var removed = 0;
	  var nodes = [];
	  mapNodeRange(start, end, function (node) {
	    if (node === end) done = true;
	    nodes.push(node);
	    removeWithTransition(node, vm, onRemoved);
	  });
	  function onRemoved() {
	    removed++;
	    if (done && removed >= nodes.length) {
	      for (var i = 0; i < nodes.length; i++) {
	        frag.appendChild(nodes[i]);
	      }
	      cb && cb();
	    }
	  }
	}
	
	/**
	 * Check if a node is a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function isFragment(node) {
	  return node && node.nodeType === 11;
	}
	
	/**
	 * Get outerHTML of elements, taking care
	 * of SVG elements in IE as well.
	 *
	 * @param {Element} el
	 * @return {String}
	 */
	
	function getOuterHTML(el) {
	  if (el.outerHTML) {
	    return el.outerHTML;
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML;
	  }
	}
	
	var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
	var reservedTagRE = /^(slot|partial|component)$/i;
	
	var isUnknownElement = undefined;
	if (process.env.NODE_ENV !== 'production') {
	  isUnknownElement = function (el, tag) {
	    if (tag.indexOf('-') > -1) {
	      // http://stackoverflow.com/a/28210364/1070244
	      return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
	    } else {
	      return (/HTMLUnknownElement/.test(el.toString()) &&
	        // Chrome returns unknown for several HTML5 elements.
	        // https://code.google.com/p/chromium/issues/detail?id=540526
	        !/^(data|time|rtc|rb)$/.test(tag)
	      );
	    }
	  };
	}
	
	/**
	 * Check if an element is a component, if yes return its
	 * component id.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Object|undefined}
	 */
	
	function checkComponentAttr(el, options) {
	  var tag = el.tagName.toLowerCase();
	  var hasAttrs = el.hasAttributes();
	  if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
	    if (resolveAsset(options, 'components', tag)) {
	      return { id: tag };
	    } else {
	      var is = hasAttrs && getIsBinding(el);
	      if (is) {
	        return is;
	      } else if (process.env.NODE_ENV !== 'production') {
	        var expectedTag = options._componentNameMap && options._componentNameMap[tag];
	        if (expectedTag) {
	          warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
	        } else if (isUnknownElement(el, tag)) {
	          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
	        }
	      }
	    }
	  } else if (hasAttrs) {
	    return getIsBinding(el);
	  }
	}
	
	/**
	 * Get "is" binding from an element.
	 *
	 * @param {Element} el
	 * @return {Object|undefined}
	 */
	
	function getIsBinding(el) {
	  // dynamic syntax
	  var exp = getAttr(el, 'is');
	  if (exp != null) {
	    return { id: exp };
	  } else {
	    exp = getBindAttr(el, 'is');
	    if (exp != null) {
	      return { id: exp, dynamic: true };
	    }
	  }
	}
	
	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */
	
	var strats = config.optionMergeStrategies = Object.create(null);
	
	/**
	 * Helper that recursively merges two data objects together.
	 */
	
	function mergeData(to, from) {
	  var key, toVal, fromVal;
	  for (key in from) {
	    toVal = to[key];
	    fromVal = from[key];
	    if (!hasOwn(to, key)) {
	      set(to, key, fromVal);
	    } else if (isObject(toVal) && isObject(fromVal)) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to;
	}
	
	/**
	 * Data
	 */
	
	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal;
	    }
	    if (typeof childVal !== 'function') {
	      process.env.NODE_ENV !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.');
	      return parentVal;
	    }
	    if (!parentVal) {
	      return childVal;
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn() {
	      return mergeData(childVal.call(this), parentVal.call(this));
	    };
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn() {
	      // instance merge
	      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
	      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData);
	      } else {
	        return defaultData;
	      }
	    };
	  }
	};
	
	/**
	 * El
	 */
	
	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    process.env.NODE_ENV !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.');
	    return;
	  }
	  var ret = childVal || parentVal;
	  // invoke the element factory if this is instance merge
	  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
	};
	
	/**
	 * Hooks and param attributes are merged as arrays.
	 */
	
	strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
	  return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
	};
	
	/**
	 * 0.11 deprecation warning
	 */
	
	strats.paramAttributes = function () {
	  /* istanbul ignore next */
	  process.env.NODE_ENV !== 'production' && warn('"paramAttributes" option has been deprecated in 0.12. ' + 'Use "props" instead.');
	};
	
	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */
	
	function mergeAssets(parentVal, childVal) {
	  var res = Object.create(parentVal);
	  return childVal ? extend(res, guardArrayAssets(childVal)) : res;
	}
	
	config._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});
	
	/**
	 * Events & Watchers.
	 *
	 * Events & watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */
	
	strats.watch = strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = {};
	  extend(ret, parentVal);
	  for (var key in childVal) {
	    var parent = ret[key];
	    var child = childVal[key];
	    if (parent && !isArray(parent)) {
	      parent = [parent];
	    }
	    ret[key] = parent ? parent.concat(child) : [child];
	  }
	  return ret;
	};
	
	/**
	 * Other object hashes.
	 */
	
	strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = Object.create(null);
	  extend(ret, parentVal);
	  extend(ret, childVal);
	  return ret;
	};
	
	/**
	 * Default strategy.
	 */
	
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	  return childVal === undefined ? parentVal : childVal;
	};
	
	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 *
	 * @param {Object} options
	 */
	
	function guardComponents(options) {
	  if (options.components) {
	    var components = options.components = guardArrayAssets(options.components);
	    var ids = Object.keys(components);
	    var def;
	    if (process.env.NODE_ENV !== 'production') {
	      var map = options._componentNameMap = {};
	    }
	    for (var i = 0, l = ids.length; i < l; i++) {
	      var key = ids[i];
	      if (commonTagRE.test(key) || reservedTagRE.test(key)) {
	        process.env.NODE_ENV !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
	        continue;
	      }
	      // record a all lowercase <-> kebab-case mapping for
	      // possible custom element case error warning
	      if (process.env.NODE_ENV !== 'production') {
	        map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
	      }
	      def = components[key];
	      if (isPlainObject(def)) {
	        components[key] = Vue.extend(def);
	      }
	    }
	  }
	}
	
	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 *
	 * @param {Object} options
	 */
	
	function guardProps(options) {
	  var props = options.props;
	  var i, val;
	  if (isArray(props)) {
	    options.props = {};
	    i = props.length;
	    while (i--) {
	      val = props[i];
	      if (typeof val === 'string') {
	        options.props[val] = null;
	      } else if (val.name) {
	        options.props[val.name] = val;
	      }
	    }
	  } else if (isPlainObject(props)) {
	    var keys = Object.keys(props);
	    i = keys.length;
	    while (i--) {
	      val = props[keys[i]];
	      if (typeof val === 'function') {
	        props[keys[i]] = { type: val };
	      }
	    }
	  }
	}
	
	/**
	 * Guard an Array-format assets option and converted it
	 * into the key-value Object format.
	 *
	 * @param {Object|Array} assets
	 * @return {Object}
	 */
	
	function guardArrayAssets(assets) {
	  if (isArray(assets)) {
	    var res = {};
	    var i = assets.length;
	    var asset;
	    while (i--) {
	      asset = assets[i];
	      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
	      if (!id) {
	        process.env.NODE_ENV !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
	      } else {
	        res[id] = asset;
	      }
	    }
	    return res;
	  }
	  return assets;
	}
	
	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 *
	 * @param {Object} parent
	 * @param {Object} child
	 * @param {Vue} [vm] - if vm is present, indicates this is
	 *                     an instantiation merge.
	 */
	
	function mergeOptions(parent, child, vm) {
	  guardComponents(child);
	  guardProps(child);
	  var options = {};
	  var key;
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      parent = mergeOptions(parent, child.mixins[i], vm);
	    }
	  }
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!hasOwn(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField(key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options;
	}
	
	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 *
	 * @param {Object} options
	 * @param {String} type
	 * @param {String} id
	 * @return {Object|Function}
	 */
	
	function resolveAsset(options, type, id) {
	  /* istanbul ignore if */
	  if (typeof id !== 'string') {
	    return;
	  }
	  var assets = options[type];
	  var camelizedId;
	  return assets[id] ||
	  // camelCase ID
	  assets[camelizedId = camelize(id)] ||
	  // Pascal Case ID
	  assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
	}
	
	/**
	 * Assert asset exists
	 */
	
	function assertAsset(val, type, id) {
	  if (!val) {
	    process.env.NODE_ENV !== 'production' && warn('Failed to resolve ' + type + ': ' + id);
	  }
	}
	
	var uid$1 = 0;
	
	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */
	function Dep() {
	  this.id = uid$1++;
	  this.subs = [];
	}
	
	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null;
	
	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */
	
	Dep.prototype.addSub = function (sub) {
	  this.subs.push(sub);
	};
	
	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */
	
	Dep.prototype.removeSub = function (sub) {
	  this.subs.$remove(sub);
	};
	
	/**
	 * Add self as a dependency to the target watcher.
	 */
	
	Dep.prototype.depend = function () {
	  Dep.target.addDep(this);
	};
	
	/**
	 * Notify all subscribers of a new value.
	 */
	
	Dep.prototype.notify = function () {
	  // stablize the subscriber list first
	  var subs = toArray(this.subs);
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update();
	  }
	};
	
	var arrayProto = Array.prototype;
	var arrayMethods = Object.create(arrayProto)
	
	/**
	 * Intercept mutating methods and emit events
	 */
	
	;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method];
	  def(arrayMethods, method, function mutator() {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length;
	    var args = new Array(i);
	    while (i--) {
	      args[i] = arguments[i];
	    }
	    var result = original.apply(this, args);
	    var ob = this.__ob__;
	    var inserted;
	    switch (method) {
	      case 'push':
	        inserted = args;
	        break;
	      case 'unshift':
	        inserted = args;
	        break;
	      case 'splice':
	        inserted = args.slice(2);
	        break;
	    }
	    if (inserted) ob.observeArray(inserted);
	    // notify change
	    ob.dep.notify();
	    return result;
	  });
	});
	
	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */
	
	def(arrayProto, '$set', function $set(index, val) {
	  if (index >= this.length) {
	    this.length = Number(index) + 1;
	  }
	  return this.splice(index, 1, val)[0];
	});
	
	/**
	 * Convenience method to remove the element at given index.
	 *
	 * @param {Number} index
	 * @param {*} val
	 */
	
	def(arrayProto, '$remove', function $remove(item) {
	  /* istanbul ignore if */
	  if (!this.length) return;
	  var index = indexOf(this, item);
	  if (index > -1) {
	    return this.splice(index, 1);
	  }
	});
	
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
	
	/**
	 * By default, when a reactive property is set, the new value is
	 * also converted to become reactive. However in certain cases, e.g.
	 * v-for scope alias and props, we don't want to force conversion
	 * because the value may be a nested value under a frozen data structure.
	 *
	 * So whenever we want to set a reactive property without forcing
	 * conversion on the new value, we wrap that call inside this function.
	 */
	
	var shouldConvert = true;
	
	function withoutConversion(fn) {
	  shouldConvert = false;
	  fn();
	  shouldConvert = true;
	}
	
	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @constructor
	 */
	
	function Observer(value) {
	  this.value = value;
	  this.dep = new Dep();
	  def(value, '__ob__', this);
	  if (isArray(value)) {
	    var augment = hasProto ? protoAugment : copyAugment;
	    augment(value, arrayMethods, arrayKeys);
	    this.observeArray(value);
	  } else {
	    this.walk(value);
	  }
	}
	
	// Instance methods
	
	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object.
	 *
	 * @param {Object} obj
	 */
	
	Observer.prototype.walk = function (obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    this.convert(keys[i], obj[keys[i]]);
	  }
	};
	
	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */
	
	Observer.prototype.observeArray = function (items) {
	  for (var i = 0, l = items.length; i < l; i++) {
	    observe(items[i]);
	  }
	};
	
	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */
	
	Observer.prototype.convert = function (key, val) {
	  defineReactive(this.value, key, val);
	};
	
	/**
	 * Add an owner vm, so that when $set/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */
	
	Observer.prototype.addVm = function (vm) {
	  (this.vms || (this.vms = [])).push(vm);
	};
	
	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */
	
	Observer.prototype.removeVm = function (vm) {
	  this.vms.$remove(vm);
	};
	
	// helpers
	
	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 *
	 * @param {Object|Array} target
	 * @param {Object} src
	 */
	
	function protoAugment(target, src) {
	  /* eslint-disable no-proto */
	  target.__proto__ = src;
	  /* eslint-enable no-proto */
	}
	
	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */
	
	function copyAugment(target, src, keys) {
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    def(target, key, src[key]);
	  }
	}
	
	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @param {Vue} [vm]
	 * @return {Observer|undefined}
	 * @static
	 */
	
	function observe(value, vm) {
	  if (!value || typeof value !== 'object') {
	    return;
	  }
	  var ob;
	  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	    ob = value.__ob__;
	  } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
	    ob = new Observer(value);
	  }
	  if (ob && vm) {
	    ob.addVm(vm);
	  }
	  return ob;
	}
	
	/**
	 * Define a reactive property on an Object.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 */
	
	function defineReactive(obj, key, val) {
	  var dep = new Dep();
	
	  var property = Object.getOwnPropertyDescriptor(obj, key);
	  if (property && property.configurable === false) {
	    return;
	  }
	
	  // cater for pre-defined getter/setters
	  var getter = property && property.get;
	  var setter = property && property.set;
	
	  var childOb = observe(val);
	  Object.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    get: function reactiveGetter() {
	      var value = getter ? getter.call(obj) : val;
	      if (Dep.target) {
	        dep.depend();
	        if (childOb) {
	          childOb.dep.depend();
	        }
	        if (isArray(value)) {
	          for (var e, i = 0, l = value.length; i < l; i++) {
	            e = value[i];
	            e && e.__ob__ && e.__ob__.dep.depend();
	          }
	        }
	      }
	      return value;
	    },
	    set: function reactiveSetter(newVal) {
	      var value = getter ? getter.call(obj) : val;
	      if (newVal === value) {
	        return;
	      }
	      if (setter) {
	        setter.call(obj, newVal);
	      } else {
	        val = newVal;
	      }
	      childOb = observe(newVal);
	      dep.notify();
	    }
	  });
	}
	
	
	
	var util = Object.freeze({
		defineReactive: defineReactive,
		set: set,
		del: del,
		hasOwn: hasOwn,
		isLiteral: isLiteral,
		isReserved: isReserved,
		_toString: _toString,
		toNumber: toNumber,
		toBoolean: toBoolean,
		stripQuotes: stripQuotes,
		camelize: camelize,
		hyphenate: hyphenate,
		classify: classify,
		bind: bind,
		toArray: toArray,
		extend: extend,
		isObject: isObject,
		isPlainObject: isPlainObject,
		def: def,
		debounce: _debounce,
		indexOf: indexOf,
		cancellable: cancellable,
		looseEqual: looseEqual,
		isArray: isArray,
		hasProto: hasProto,
		inBrowser: inBrowser,
		devtools: devtools,
		isIE9: isIE9,
		isAndroid: isAndroid,
		get transitionProp () { return transitionProp; },
		get transitionEndEvent () { return transitionEndEvent; },
		get animationProp () { return animationProp; },
		get animationEndEvent () { return animationEndEvent; },
		nextTick: nextTick,
		query: query,
		inDoc: inDoc,
		getAttr: getAttr,
		getBindAttr: getBindAttr,
		hasBindAttr: hasBindAttr,
		before: before,
		after: after,
		remove: remove,
		prepend: prepend,
		replace: replace,
		on: on,
		off: off,
		setClass: setClass,
		addClass: addClass,
		removeClass: removeClass,
		extractContent: extractContent,
		trimNode: trimNode,
		isTemplate: isTemplate,
		createAnchor: createAnchor,
		findRef: findRef,
		mapNodeRange: mapNodeRange,
		removeNodeRange: removeNodeRange,
		isFragment: isFragment,
		getOuterHTML: getOuterHTML,
		mergeOptions: mergeOptions,
		resolveAsset: resolveAsset,
		assertAsset: assertAsset,
		checkComponentAttr: checkComponentAttr,
		commonTagRE: commonTagRE,
		reservedTagRE: reservedTagRE,
		get warn () { return warn; }
	});
	
	var uid = 0;
	
	function initMixin (Vue) {
	  /**
	   * The main init sequence. This is called for every
	   * instance, including ones that are created from extended
	   * constructors.
	   *
	   * @param {Object} options - this options object should be
	   *                           the result of merging class
	   *                           options and the options passed
	   *                           in to the constructor.
	   */
	
	  Vue.prototype._init = function (options) {
	    options = options || {};
	
	    this.$el = null;
	    this.$parent = options.parent;
	    this.$root = this.$parent ? this.$parent.$root : this;
	    this.$children = [];
	    this.$refs = {}; // child vm references
	    this.$els = {}; // element references
	    this._watchers = []; // all watchers as an array
	    this._directives = []; // all directives
	
	    // a uid
	    this._uid = uid++;
	
	    // a flag to avoid this being observed
	    this._isVue = true;
	
	    // events bookkeeping
	    this._events = {}; // registered callbacks
	    this._eventsCount = {}; // for $broadcast optimization
	
	    // fragment instance properties
	    this._isFragment = false;
	    this._fragment = // @type {DocumentFragment}
	    this._fragmentStart = // @type {Text|Comment}
	    this._fragmentEnd = null; // @type {Text|Comment}
	
	    // lifecycle state
	    this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
	    this._unlinkFn = null;
	
	    // context:
	    // if this is a transcluded component, context
	    // will be the common parent vm of this instance
	    // and its host.
	    this._context = options._context || this.$parent;
	
	    // scope:
	    // if this is inside an inline v-for, the scope
	    // will be the intermediate scope created for this
	    // repeat fragment. this is used for linking props
	    // and container directives.
	    this._scope = options._scope;
	
	    // fragment:
	    // if this instance is compiled inside a Fragment, it
	    // needs to reigster itself as a child of that fragment
	    // for attach/detach to work properly.
	    this._frag = options._frag;
	    if (this._frag) {
	      this._frag.children.push(this);
	    }
	
	    // push self into parent / transclusion host
	    if (this.$parent) {
	      this.$parent.$children.push(this);
	    }
	
	    // merge options.
	    options = this.$options = mergeOptions(this.constructor.options, options, this);
	
	    // set ref
	    this._updateRef();
	
	    // initialize data as empty object.
	    // it will be filled up in _initScope().
	    this._data = {};
	
	    // save raw constructor data before merge
	    // so that we know which properties are provided at
	    // instantiation.
	    this._runtimeData = options.data;
	
	    // call init hook
	    this._callHook('init');
	
	    // initialize data observation and scope inheritance.
	    this._initState();
	
	    // setup event system and option events.
	    this._initEvents();
	
	    // call created hook
	    this._callHook('created');
	
	    // if `el` option is passed, start compilation.
	    if (options.el) {
	      this.$mount(options.el);
	    }
	  };
	}
	
	var pathCache = new Cache(1000);
	
	// actions
	var APPEND = 0;
	var PUSH = 1;
	var INC_SUB_PATH_DEPTH = 2;
	var PUSH_SUB_PATH = 3;
	
	// states
	var BEFORE_PATH = 0;
	var IN_PATH = 1;
	var BEFORE_IDENT = 2;
	var IN_IDENT = 3;
	var IN_SUB_PATH = 4;
	var IN_SINGLE_QUOTE = 5;
	var IN_DOUBLE_QUOTE = 6;
	var AFTER_PATH = 7;
	var ERROR = 8;
	
	var pathStateMachine = [];
	
	pathStateMachine[BEFORE_PATH] = {
	  'ws': [BEFORE_PATH],
	  'ident': [IN_IDENT, APPEND],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};
	
	pathStateMachine[IN_PATH] = {
	  'ws': [IN_PATH],
	  '.': [BEFORE_IDENT],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};
	
	pathStateMachine[BEFORE_IDENT] = {
	  'ws': [BEFORE_IDENT],
	  'ident': [IN_IDENT, APPEND]
	};
	
	pathStateMachine[IN_IDENT] = {
	  'ident': [IN_IDENT, APPEND],
	  '0': [IN_IDENT, APPEND],
	  'number': [IN_IDENT, APPEND],
	  'ws': [IN_PATH, PUSH],
	  '.': [BEFORE_IDENT, PUSH],
	  '[': [IN_SUB_PATH, PUSH],
	  'eof': [AFTER_PATH, PUSH]
	};
	
	pathStateMachine[IN_SUB_PATH] = {
	  "'": [IN_SINGLE_QUOTE, APPEND],
	  '"': [IN_DOUBLE_QUOTE, APPEND],
	  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
	  ']': [IN_PATH, PUSH_SUB_PATH],
	  'eof': ERROR,
	  'else': [IN_SUB_PATH, APPEND]
	};
	
	pathStateMachine[IN_SINGLE_QUOTE] = {
	  "'": [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_SINGLE_QUOTE, APPEND]
	};
	
	pathStateMachine[IN_DOUBLE_QUOTE] = {
	  '"': [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_DOUBLE_QUOTE, APPEND]
	};
	
	/**
	 * Determine the type of a character in a keypath.
	 *
	 * @param {Char} ch
	 * @return {String} type
	 */
	
	function getPathCharType(ch) {
	  if (ch === undefined) {
	    return 'eof';
	  }
	
	  var code = ch.charCodeAt(0);
	
	  switch (code) {
	    case 0x5B: // [
	    case 0x5D: // ]
	    case 0x2E: // .
	    case 0x22: // "
	    case 0x27: // '
	    case 0x30:
	      // 0
	      return ch;
	
	    case 0x5F: // _
	    case 0x24:
	      // $
	      return 'ident';
	
	    case 0x20: // Space
	    case 0x09: // Tab
	    case 0x0A: // Newline
	    case 0x0D: // Return
	    case 0xA0: // No-break space
	    case 0xFEFF: // Byte Order Mark
	    case 0x2028: // Line Separator
	    case 0x2029:
	      // Paragraph Separator
	      return 'ws';
	  }
	
	  // a-z, A-Z
	  if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
	    return 'ident';
	  }
	
	  // 1-9
	  if (code >= 0x31 && code <= 0x39) {
	    return 'number';
	  }
	
	  return 'else';
	}
	
	/**
	 * Format a subPath, return its plain form if it is
	 * a literal string or number. Otherwise prepend the
	 * dynamic indicator (*).
	 *
	 * @param {String} path
	 * @return {String}
	 */
	
	function formatSubPath(path) {
	  var trimmed = path.trim();
	  // invalid leading 0
	  if (path.charAt(0) === '0' && isNaN(path)) {
	    return false;
	  }
	  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
	}
	
	/**
	 * Parse a string path into an array of segments
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */
	
	function parse(path) {
	  var keys = [];
	  var index = -1;
	  var mode = BEFORE_PATH;
	  var subPathDepth = 0;
	  var c, newChar, key, type, transition, action, typeMap;
	
	  var actions = [];
	
	  actions[PUSH] = function () {
	    if (key !== undefined) {
	      keys.push(key);
	      key = undefined;
	    }
	  };
	
	  actions[APPEND] = function () {
	    if (key === undefined) {
	      key = newChar;
	    } else {
	      key += newChar;
	    }
	  };
	
	  actions[INC_SUB_PATH_DEPTH] = function () {
	    actions[APPEND]();
	    subPathDepth++;
	  };
	
	  actions[PUSH_SUB_PATH] = function () {
	    if (subPathDepth > 0) {
	      subPathDepth--;
	      mode = IN_SUB_PATH;
	      actions[APPEND]();
	    } else {
	      subPathDepth = 0;
	      key = formatSubPath(key);
	      if (key === false) {
	        return false;
	      } else {
	        actions[PUSH]();
	      }
	    }
	  };
	
	  function maybeUnescapeQuote() {
	    var nextChar = path[index + 1];
	    if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
	      index++;
	      newChar = '\\' + nextChar;
	      actions[APPEND]();
	      return true;
	    }
	  }
	
	  while (mode != null) {
	    index++;
	    c = path[index];
	
	    if (c === '\\' && maybeUnescapeQuote()) {
	      continue;
	    }
	
	    type = getPathCharType(c);
	    typeMap = pathStateMachine[mode];
	    transition = typeMap[type] || typeMap['else'] || ERROR;
	
	    if (transition === ERROR) {
	      return; // parse error
	    }
	
	    mode = transition[0];
	    action = actions[transition[1]];
	    if (action) {
	      newChar = transition[2];
	      newChar = newChar === undefined ? c : newChar;
	      if (action() === false) {
	        return;
	      }
	    }
	
	    if (mode === AFTER_PATH) {
	      keys.raw = path;
	      return keys;
	    }
	  }
	}
	
	/**
	 * External parse that check for a cache hit first
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */
	
	function parsePath(path) {
	  var hit = pathCache.get(path);
	  if (!hit) {
	    hit = parse(path);
	    if (hit) {
	      pathCache.put(path, hit);
	    }
	  }
	  return hit;
	}
	
	/**
	 * Get from an object from a path string
	 *
	 * @param {Object} obj
	 * @param {String} path
	 */
	
	function getPath(obj, path) {
	  return parseExpression(path).get(obj);
	}
	
	/**
	 * Warn against setting non-existent root path on a vm.
	 */
	
	var warnNonExistent;
	if (process.env.NODE_ENV !== 'production') {
	  warnNonExistent = function (path) {
	    warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.');
	  };
	}
	
	/**
	 * Set on an object from a path
	 *
	 * @param {Object} obj
	 * @param {String | Array} path
	 * @param {*} val
	 */
	
	function setPath(obj, path, val) {
	  var original = obj;
	  if (typeof path === 'string') {
	    path = parse(path);
	  }
	  if (!path || !isObject(obj)) {
	    return false;
	  }
	  var last, key;
	  for (var i = 0, l = path.length; i < l; i++) {
	    last = obj;
	    key = path[i];
	    if (key.charAt(0) === '*') {
	      key = parseExpression(key.slice(1)).get.call(original, original);
	    }
	    if (i < l - 1) {
	      obj = obj[key];
	      if (!isObject(obj)) {
	        obj = {};
	        if (process.env.NODE_ENV !== 'production' && last._isVue) {
	          warnNonExistent(path);
	        }
	        set(last, key, obj);
	      }
	    } else {
	      if (isArray(obj)) {
	        obj.$set(key, val);
	      } else if (key in obj) {
	        obj[key] = val;
	      } else {
	        if (process.env.NODE_ENV !== 'production' && obj._isVue) {
	          warnNonExistent(path);
	        }
	        set(obj, key, val);
	      }
	    }
	  }
	  return true;
	}
	
	var path = Object.freeze({
	  parsePath: parsePath,
	  getPath: getPath,
	  setPath: setPath
	});
	
	var expressionCache = new Cache(1000);
	
	var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
	var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	// keywords that don't make sense inside expressions
	var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
	var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	var wsRE = /\s/g;
	var newlineRE = /\n/g;
	var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
	var restoreRE = /"(\d+)"/g;
	var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
	var booleanLiteralRE = /^(?:true|false)$/;
	
	/**
	 * Save / Rewrite / Restore
	 *
	 * When rewriting paths found in an expression, it is
	 * possible for the same letter sequences to be found in
	 * strings and Object literal property keys. Therefore we
	 * remove and store these parts in a temporary array, and
	 * restore them after the path rewrite.
	 */
	
	var saved = [];
	
	/**
	 * Save replacer
	 *
	 * The save regex can match two possible cases:
	 * 1. An opening object literal
	 * 2. A string
	 * If matched as a plain string, we need to escape its
	 * newlines, since the string needs to be preserved when
	 * generating the function body.
	 *
	 * @param {String} str
	 * @param {String} isString - str if matched as a string
	 * @return {String} - placeholder with index
	 */
	
	function save(str, isString) {
	  var i = saved.length;
	  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
	  return '"' + i + '"';
	}
	
	/**
	 * Path rewrite replacer
	 *
	 * @param {String} raw
	 * @return {String}
	 */
	
	function rewrite(raw) {
	  var c = raw.charAt(0);
	  var path = raw.slice(1);
	  if (allowedKeywordsRE.test(path)) {
	    return raw;
	  } else {
	    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
	    return c + 'scope.' + path;
	  }
	}
	
	/**
	 * Restore replacer
	 *
	 * @param {String} str
	 * @param {String} i - matched save index
	 * @return {String}
	 */
	
	function restore(str, i) {
	  return saved[i];
	}
	
	/**
	 * Rewrite an expression, prefixing all path accessors with
	 * `scope.` and generate getter/setter functions.
	 *
	 * @param {String} exp
	 * @return {Function}
	 */
	
	function compileGetter(exp) {
	  if (improperKeywordsRE.test(exp)) {
	    process.env.NODE_ENV !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
	  }
	  // reset state
	  saved.length = 0;
	  // save strings and object literal keys
	  var body = exp.replace(saveRE, save).replace(wsRE, '');
	  // rewrite all paths
	  // pad 1 space here becaue the regex matches 1 extra char
	  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
	  return makeGetterFn(body);
	}
	
	/**
	 * Build a getter function. Requires eval.
	 *
	 * We isolate the try/catch so it doesn't affect the
	 * optimization of the parse function when it is not called.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */
	
	function makeGetterFn(body) {
	  try {
	    /* eslint-disable no-new-func */
	    return new Function('scope', 'return ' + body + ';');
	    /* eslint-enable no-new-func */
	  } catch (e) {
	    process.env.NODE_ENV !== 'production' && warn('Invalid expression. ' + 'Generated function body: ' + body);
	  }
	}
	
	/**
	 * Compile a setter function for the expression.
	 *
	 * @param {String} exp
	 * @return {Function|undefined}
	 */
	
	function compileSetter(exp) {
	  var path = parsePath(exp);
	  if (path) {
	    return function (scope, val) {
	      setPath(scope, path, val);
	    };
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid setter expression: ' + exp);
	  }
	}
	
	/**
	 * Parse an expression into re-written getter/setters.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */
	
	function parseExpression(exp, needSet) {
	  exp = exp.trim();
	  // try cache
	  var hit = expressionCache.get(exp);
	  if (hit) {
	    if (needSet && !hit.set) {
	      hit.set = compileSetter(hit.exp);
	    }
	    return hit;
	  }
	  var res = { exp: exp };
	  res.get = isSimplePath(exp) && exp.indexOf('[') < 0
	  // optimized super simple getter
	  ? makeGetterFn('scope.' + exp)
	  // dynamic getter
	  : compileGetter(exp);
	  if (needSet) {
	    res.set = compileSetter(exp);
	  }
	  expressionCache.put(exp, res);
	  return res;
	}
	
	/**
	 * Check if an expression is a simple path.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */
	
	function isSimplePath(exp) {
	  return pathTestRE.test(exp) &&
	  // don't treat true/false as paths
	  !booleanLiteralRE.test(exp) &&
	  // Math constants e.g. Math.PI, Math.E etc.
	  exp.slice(0, 5) !== 'Math.';
	}
	
	var expression = Object.freeze({
	  parseExpression: parseExpression,
	  isSimplePath: isSimplePath
	});
	
	// we have two separate queues: one for directive updates
	// and one for user watcher registered via $watch().
	// we want to guarantee directive updates to be called
	// before user watchers so that when user watchers are
	// triggered, the DOM would have already been in updated
	// state.
	
	var queueIndex;
	var queue = [];
	var userQueue = [];
	var has = {};
	var circular = {};
	var waiting = false;
	var internalQueueDepleted = false;
	
	/**
	 * Reset the batcher's state.
	 */
	
	function resetBatcherState() {
	  queue = [];
	  userQueue = [];
	  has = {};
	  circular = {};
	  waiting = internalQueueDepleted = false;
	}
	
	/**
	 * Flush both queues and run the watchers.
	 */
	
	function flushBatcherQueue() {
	  runBatcherQueue(queue);
	  internalQueueDepleted = true;
	  runBatcherQueue(userQueue);
	  // dev tool hook
	  /* istanbul ignore if */
	  if (devtools && config.devtools) {
	    devtools.emit('flush');
	  }
	  resetBatcherState();
	}
	
	/**
	 * Run the watchers in a single queue.
	 *
	 * @param {Array} queue
	 */
	
	function runBatcherQueue(queue) {
	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
	    var watcher = queue[queueIndex];
	    var id = watcher.id;
	    has[id] = null;
	    watcher.run();
	    // in dev build, check and stop circular updates.
	    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
	      circular[id] = (circular[id] || 0) + 1;
	      if (circular[id] > config._maxUpdateCount) {
	        queue.splice(has[id], 1);
	        warn('You may have an infinite update loop for watcher ' + 'with expression: ' + watcher.expression);
	      }
	    }
	  }
	}
	
	/**
	 * Push a watcher into the watcher queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 *
	 * @param {Watcher} watcher
	 *   properties:
	 *   - {Number} id
	 *   - {Function} run
	 */
	
	function pushWatcher(watcher) {
	  var id = watcher.id;
	  if (has[id] == null) {
	    if (internalQueueDepleted && !watcher.user) {
	      // an internal watcher triggered by a user watcher...
	      // let's run it immediately after current user watcher is done.
	      userQueue.splice(queueIndex + 1, 0, watcher);
	    } else {
	      // push watcher into appropriate queue
	      var q = watcher.user ? userQueue : queue;
	      has[id] = q.length;
	      q.push(watcher);
	      // queue the flush
	      if (!waiting) {
	        waiting = true;
	        nextTick(flushBatcherQueue);
	      }
	    }
	  }
	}
	
	var uid$2 = 0;
	
	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm
	 * @param {String|Function} expOrFn
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep
	 *                 - {Boolean} user
	 *                 - {Boolean} sync
	 *                 - {Boolean} lazy
	 *                 - {Function} [preProcess]
	 *                 - {Function} [postProcess]
	 * @constructor
	 */
	function Watcher(vm, expOrFn, cb, options) {
	  // mix in options
	  if (options) {
	    extend(this, options);
	  }
	  var isFn = typeof expOrFn === 'function';
	  this.vm = vm;
	  vm._watchers.push(this);
	  this.expression = expOrFn;
	  this.cb = cb;
	  this.id = ++uid$2; // uid for batching
	  this.active = true;
	  this.dirty = this.lazy; // for lazy watchers
	  this.deps = [];
	  this.newDeps = [];
	  this.depIds = Object.create(null);
	  this.newDepIds = null;
	  this.prevError = null; // for async error stacks
	  // parse expression for getter/setter
	  if (isFn) {
	    this.getter = expOrFn;
	    this.setter = undefined;
	  } else {
	    var res = parseExpression(expOrFn, this.twoWay);
	    this.getter = res.get;
	    this.setter = res.set;
	  }
	  this.value = this.lazy ? undefined : this.get();
	  // state for avoiding false triggers for deep and Array
	  // watchers during vm._digest()
	  this.queued = this.shallow = false;
	}
	
	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */
	
	Watcher.prototype.get = function () {
	  this.beforeGet();
	  var scope = this.scope || this.vm;
	  var value;
	  try {
	    value = this.getter.call(scope, scope);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
	      warn('Error when evaluating expression "' + this.expression + '". ' + (config.debug ? '' : 'Turn on debug mode to see stack trace.'), e);
	    }
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value);
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value);
	  }
	  if (this.filters) {
	    value = scope._applyFilters(value, null, this.filters, false);
	  }
	  if (this.postProcess) {
	    value = this.postProcess(value);
	  }
	  this.afterGet();
	  return value;
	};
	
	/**
	 * Set the corresponding value with the setter.
	 *
	 * @param {*} value
	 */
	
	Watcher.prototype.set = function (value) {
	  var scope = this.scope || this.vm;
	  if (this.filters) {
	    value = scope._applyFilters(value, this.value, this.filters, true);
	  }
	  try {
	    this.setter.call(scope, scope, value);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
	      warn('Error when evaluating setter "' + this.expression + '"', e);
	    }
	  }
	  // two-way sync for v-for alias
	  var forContext = scope.$forContext;
	  if (forContext && forContext.alias === this.expression) {
	    if (forContext.filters) {
	      process.env.NODE_ENV !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.');
	      return;
	    }
	    forContext._withLock(function () {
	      if (scope.$key) {
	        // original is an object
	        forContext.rawValue[scope.$key] = value;
	      } else {
	        forContext.rawValue.$set(scope.$index, value);
	      }
	    });
	  }
	};
	
	/**
	 * Prepare for dependency collection.
	 */
	
	Watcher.prototype.beforeGet = function () {
	  Dep.target = this;
	  this.newDepIds = Object.create(null);
	  this.newDeps.length = 0;
	};
	
	/**
	 * Add a dependency to this directive.
	 *
	 * @param {Dep} dep
	 */
	
	Watcher.prototype.addDep = function (dep) {
	  var id = dep.id;
	  if (!this.newDepIds[id]) {
	    this.newDepIds[id] = true;
	    this.newDeps.push(dep);
	    if (!this.depIds[id]) {
	      dep.addSub(this);
	    }
	  }
	};
	
	/**
	 * Clean up for dependency collection.
	 */
	
	Watcher.prototype.afterGet = function () {
	  Dep.target = null;
	  var i = this.deps.length;
	  while (i--) {
	    var dep = this.deps[i];
	    if (!this.newDepIds[dep.id]) {
	      dep.removeSub(this);
	    }
	  }
	  this.depIds = this.newDepIds;
	  var tmp = this.deps;
	  this.deps = this.newDeps;
	  this.newDeps = tmp;
	};
	
	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 *
	 * @param {Boolean} shallow
	 */
	
	Watcher.prototype.update = function (shallow) {
	  if (this.lazy) {
	    this.dirty = true;
	  } else if (this.sync || !config.async) {
	    this.run();
	  } else {
	    // if queued, only overwrite shallow with non-shallow,
	    // but not the other way around.
	    this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
	    this.queued = true;
	    // record before-push error stack in debug mode
	    /* istanbul ignore if */
	    if (process.env.NODE_ENV !== 'production' && config.debug) {
	      this.prevError = new Error('[vue] async stack trace');
	    }
	    pushWatcher(this);
	  }
	};
	
	/**
	 * Batcher job interface.
	 * Will be called by the batcher.
	 */
	
	Watcher.prototype.run = function () {
	  if (this.active) {
	    var value = this.get();
	    if (value !== this.value ||
	    // Deep watchers and watchers on Object/Arrays should fire even
	    // when the value is the same, because the value may
	    // have mutated; but only do so if this is a
	    // non-shallow update (caused by a vm digest).
	    (isObject(value) || this.deep) && !this.shallow) {
	      // set new value
	      var oldValue = this.value;
	      this.value = value;
	      // in debug + async mode, when a watcher callbacks
	      // throws, we also throw the saved before-push error
	      // so the full cross-tick stack trace is available.
	      var prevError = this.prevError;
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && config.debug && prevError) {
	        this.prevError = null;
	        try {
	          this.cb.call(this.vm, value, oldValue);
	        } catch (e) {
	          nextTick(function () {
	            throw prevError;
	          }, 0);
	          throw e;
	        }
	      } else {
	        this.cb.call(this.vm, value, oldValue);
	      }
	    }
	    this.queued = this.shallow = false;
	  }
	};
	
	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */
	
	Watcher.prototype.evaluate = function () {
	  // avoid overwriting another watcher that is being
	  // collected.
	  var current = Dep.target;
	  this.value = this.get();
	  this.dirty = false;
	  Dep.target = current;
	};
	
	/**
	 * Depend on all deps collected by this watcher.
	 */
	
	Watcher.prototype.depend = function () {
	  var i = this.deps.length;
	  while (i--) {
	    this.deps[i].depend();
	  }
	};
	
	/**
	 * Remove self from all dependencies' subcriber list.
	 */
	
	Watcher.prototype.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // this is a somewhat expensive operation so we skip it
	    // if the vm is being destroyed or is performing a v-for
	    // re-render (the watcher list is then filtered by v-for).
	    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
	      this.vm._watchers.$remove(this);
	    }
	    var i = this.deps.length;
	    while (i--) {
	      this.deps[i].removeSub(this);
	    }
	    this.active = false;
	    this.vm = this.cb = this.value = null;
	  }
	};
	
	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * @param {*} val
	 */
	
	function traverse(val) {
	  var i, keys;
	  if (isArray(val)) {
	    i = val.length;
	    while (i--) traverse(val[i]);
	  } else if (isObject(val)) {
	    keys = Object.keys(val);
	    i = keys.length;
	    while (i--) traverse(val[keys[i]]);
	  }
	}
	
	var text$1 = {
	
	  bind: function bind() {
	    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
	  },
	
	  update: function update(value) {
	    this.el[this.attr] = _toString(value);
	  }
	};
	
	var templateCache = new Cache(1000);
	var idSelectorCache = new Cache(1000);
	
	var map = {
	  efault: [0, '', ''],
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
	};
	
	map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	
	map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	
	map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];
	
	map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];
	
	/**
	 * Check if a node is a supported template node with a
	 * DocumentFragment content.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function isRealTemplate(node) {
	  return isTemplate(node) && isFragment(node.content);
	}
	
	var tagRE$1 = /<([\w:-]+)/;
	var entityRE = /&#?\w+?;/;
	
	/**
	 * Convert a string template to a DocumentFragment.
	 * Determines correct wrapping by tag types. Wrapping
	 * strategy found in jQuery & component/domify.
	 *
	 * @param {String} templateString
	 * @param {Boolean} raw
	 * @return {DocumentFragment}
	 */
	
	function stringToFragment(templateString, raw) {
	  // try a cache hit first
	  var cacheKey = raw ? templateString : templateString.trim();
	  var hit = templateCache.get(cacheKey);
	  if (hit) {
	    return hit;
	  }
	
	  var frag = document.createDocumentFragment();
	  var tagMatch = templateString.match(tagRE$1);
	  var entityMatch = entityRE.test(templateString);
	
	  if (!tagMatch && !entityMatch) {
	    // text only, return a single text node.
	    frag.appendChild(document.createTextNode(templateString));
	  } else {
	    var tag = tagMatch && tagMatch[1];
	    var wrap = map[tag] || map.efault;
	    var depth = wrap[0];
	    var prefix = wrap[1];
	    var suffix = wrap[2];
	    var node = document.createElement('div');
	
	    node.innerHTML = prefix + templateString + suffix;
	    while (depth--) {
	      node = node.lastChild;
	    }
	
	    var child;
	    /* eslint-disable no-cond-assign */
	    while (child = node.firstChild) {
	      /* eslint-enable no-cond-assign */
	      frag.appendChild(child);
	    }
	  }
	  if (!raw) {
	    trimNode(frag);
	  }
	  templateCache.put(cacheKey, frag);
	  return frag;
	}
	
	/**
	 * Convert a template node to a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {DocumentFragment}
	 */
	
	function nodeToFragment(node) {
	  // if its a template tag and the browser supports it,
	  // its content is already a document fragment.
	  if (isRealTemplate(node)) {
	    trimNode(node.content);
	    return node.content;
	  }
	  // script template
	  if (node.tagName === 'SCRIPT') {
	    return stringToFragment(node.textContent);
	  }
	  // normal node, clone it to avoid mutating the original
	  var clonedNode = cloneNode(node);
	  var frag = document.createDocumentFragment();
	  var child;
	  /* eslint-disable no-cond-assign */
	  while (child = clonedNode.firstChild) {
	    /* eslint-enable no-cond-assign */
	    frag.appendChild(child);
	  }
	  trimNode(frag);
	  return frag;
	}
	
	// Test for the presence of the Safari template cloning bug
	// https://bugs.webkit.org/showug.cgi?id=137755
	var hasBrokenTemplate = (function () {
	  /* istanbul ignore else */
	  if (inBrowser) {
	    var a = document.createElement('div');
	    a.innerHTML = '<template>1</template>';
	    return !a.cloneNode(true).firstChild.innerHTML;
	  } else {
	    return false;
	  }
	})();
	
	// Test for IE10/11 textarea placeholder clone bug
	var hasTextareaCloneBug = (function () {
	  /* istanbul ignore else */
	  if (inBrowser) {
	    var t = document.createElement('textarea');
	    t.placeholder = 't';
	    return t.cloneNode(true).value === 't';
	  } else {
	    return false;
	  }
	})();
	
	/**
	 * 1. Deal with Safari cloning nested <template> bug by
	 *    manually cloning all template instances.
	 * 2. Deal with IE10/11 textarea placeholder bug by setting
	 *    the correct value after cloning.
	 *
	 * @param {Element|DocumentFragment} node
	 * @return {Element|DocumentFragment}
	 */
	
	function cloneNode(node) {
	  /* istanbul ignore if */
	  if (!node.querySelectorAll) {
	    return node.cloneNode();
	  }
	  var res = node.cloneNode(true);
	  var i, original, cloned;
	  /* istanbul ignore if */
	  if (hasBrokenTemplate) {
	    var tempClone = res;
	    if (isRealTemplate(node)) {
	      node = node.content;
	      tempClone = res.content;
	    }
	    original = node.querySelectorAll('template');
	    if (original.length) {
	      cloned = tempClone.querySelectorAll('template');
	      i = cloned.length;
	      while (i--) {
	        cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
	      }
	    }
	  }
	  /* istanbul ignore if */
	  if (hasTextareaCloneBug) {
	    if (node.tagName === 'TEXTAREA') {
	      res.value = node.value;
	    } else {
	      original = node.querySelectorAll('textarea');
	      if (original.length) {
	        cloned = res.querySelectorAll('textarea');
	        i = cloned.length;
	        while (i--) {
	          cloned[i].value = original[i].value;
	        }
	      }
	    }
	  }
	  return res;
	}
	
	/**
	 * Process the template option and normalizes it into a
	 * a DocumentFragment that can be used as a partial or a
	 * instance template.
	 *
	 * @param {*} template
	 *        Possible values include:
	 *        - DocumentFragment object
	 *        - Node object of type Template
	 *        - id selector: '#some-template-id'
	 *        - template string: '<div><span>{{msg}}</span></div>'
	 * @param {Boolean} shouldClone
	 * @param {Boolean} raw
	 *        inline HTML interpolation. Do not check for id
	 *        selector and keep whitespace in the string.
	 * @return {DocumentFragment|undefined}
	 */
	
	function parseTemplate(template, shouldClone, raw) {
	  var node, frag;
	
	  // if the template is already a document fragment,
	  // do nothing
	  if (isFragment(template)) {
	    trimNode(template);
	    return shouldClone ? cloneNode(template) : template;
	  }
	
	  if (typeof template === 'string') {
	    // id selector
	    if (!raw && template.charAt(0) === '#') {
	      // id selector can be cached too
	      frag = idSelectorCache.get(template);
	      if (!frag) {
	        node = document.getElementById(template.slice(1));
	        if (node) {
	          frag = nodeToFragment(node);
	          // save selector to cache
	          idSelectorCache.put(template, frag);
	        }
	      }
	    } else {
	      // normal string template
	      frag = stringToFragment(template, raw);
	    }
	  } else if (template.nodeType) {
	    // a direct node
	    frag = nodeToFragment(template);
	  }
	
	  return frag && shouldClone ? cloneNode(frag) : frag;
	}
	
	var template = Object.freeze({
	  cloneNode: cloneNode,
	  parseTemplate: parseTemplate
	});
	
	var html = {
	
	  bind: function bind() {
	    // a comment node means this is a binding for
	    // {{{ inline unescaped html }}}
	    if (this.el.nodeType === 8) {
	      // hold nodes
	      this.nodes = [];
	      // replace the placeholder with proper anchor
	      this.anchor = createAnchor('v-html');
	      replace(this.el, this.anchor);
	    }
	  },
	
	  update: function update(value) {
	    value = _toString(value);
	    if (this.nodes) {
	      this.swap(value);
	    } else {
	      this.el.innerHTML = value;
	    }
	  },
	
	  swap: function swap(value) {
	    // remove old nodes
	    var i = this.nodes.length;
	    while (i--) {
	      remove(this.nodes[i]);
	    }
	    // convert new value to a fragment
	    // do not attempt to retrieve from id selector
	    var frag = parseTemplate(value, true, true);
	    // save a reference to these nodes so we can remove later
	    this.nodes = toArray(frag.childNodes);
	    before(frag, this.anchor);
	  }
	};
	
	/**
	 * Abstraction for a partially-compiled fragment.
	 * Can optionally compile content with a child scope.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 * @param {DocumentFragment} frag
	 * @param {Vue} [host]
	 * @param {Object} [scope]
	 * @param {Fragment} [parentFrag]
	 */
	function Fragment(linker, vm, frag, host, scope, parentFrag) {
	  this.children = [];
	  this.childFrags = [];
	  this.vm = vm;
	  this.scope = scope;
	  this.inserted = false;
	  this.parentFrag = parentFrag;
	  if (parentFrag) {
	    parentFrag.childFrags.push(this);
	  }
	  this.unlink = linker(vm, frag, host, scope, this);
	  var single = this.single = frag.childNodes.length === 1 &&
	  // do not go single mode if the only node is an anchor
	  !frag.childNodes[0].__v_anchor;
	  if (single) {
	    this.node = frag.childNodes[0];
	    this.before = singleBefore;
	    this.remove = singleRemove;
	  } else {
	    this.node = createAnchor('fragment-start');
	    this.end = createAnchor('fragment-end');
	    this.frag = frag;
	    prepend(this.node, frag);
	    frag.appendChild(this.end);
	    this.before = multiBefore;
	    this.remove = multiRemove;
	  }
	  this.node.__v_frag = this;
	}
	
	/**
	 * Call attach/detach for all components contained within
	 * this fragment. Also do so recursively for all child
	 * fragments.
	 *
	 * @param {Function} hook
	 */
	
	Fragment.prototype.callHook = function (hook) {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    this.childFrags[i].callHook(hook);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    hook(this.children[i]);
	  }
	};
	
	/**
	 * Insert fragment before target, single node version
	 *
	 * @param {Node} target
	 * @param {Boolean} withTransition
	 */
	
	function singleBefore(target, withTransition) {
	  this.inserted = true;
	  var method = withTransition !== false ? beforeWithTransition : before;
	  method(this.node, target, this.vm);
	  if (inDoc(this.node)) {
	    this.callHook(attach);
	  }
	}
	
	/**
	 * Remove fragment, single node version
	 */
	
	function singleRemove() {
	  this.inserted = false;
	  var shouldCallRemove = inDoc(this.node);
	  var self = this;
	  this.beforeRemove();
	  removeWithTransition(this.node, this.vm, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}
	
	/**
	 * Insert fragment before target, multi-nodes version
	 *
	 * @param {Node} target
	 * @param {Boolean} withTransition
	 */
	
	function multiBefore(target, withTransition) {
	  this.inserted = true;
	  var vm = this.vm;
	  var method = withTransition !== false ? beforeWithTransition : before;
	  mapNodeRange(this.node, this.end, function (node) {
	    method(node, target, vm);
	  });
	  if (inDoc(this.node)) {
	    this.callHook(attach);
	  }
	}
	
	/**
	 * Remove fragment, multi-nodes version
	 */
	
	function multiRemove() {
	  this.inserted = false;
	  var self = this;
	  var shouldCallRemove = inDoc(this.node);
	  this.beforeRemove();
	  removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}
	
	/**
	 * Prepare the fragment for removal.
	 */
	
	Fragment.prototype.beforeRemove = function () {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    // call the same method recursively on child
	    // fragments, depth-first
	    this.childFrags[i].beforeRemove(false);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    // Call destroy for all contained instances,
	    // with remove:false and defer:true.
	    // Defer is necessary because we need to
	    // keep the children to call detach hooks
	    // on them.
	    this.children[i].$destroy(false, true);
	  }
	  var dirs = this.unlink.dirs;
	  for (i = 0, l = dirs.length; i < l; i++) {
	    // disable the watchers on all the directives
	    // so that the rendered content stays the same
	    // during removal.
	    dirs[i]._watcher && dirs[i]._watcher.teardown();
	  }
	};
	
	/**
	 * Destroy the fragment.
	 */
	
	Fragment.prototype.destroy = function () {
	  if (this.parentFrag) {
	    this.parentFrag.childFrags.$remove(this);
	  }
	  this.node.__v_frag = null;
	  this.unlink();
	};
	
	/**
	 * Call attach hook for a Vue instance.
	 *
	 * @param {Vue} child
	 */
	
	function attach(child) {
	  if (!child._isAttached && inDoc(child.$el)) {
	    child._callHook('attached');
	  }
	}
	
	/**
	 * Call detach hook for a Vue instance.
	 *
	 * @param {Vue} child
	 */
	
	function detach(child) {
	  if (child._isAttached && !inDoc(child.$el)) {
	    child._callHook('detached');
	  }
	}
	
	var linkerCache = new Cache(5000);
	
	/**
	 * A factory that can be used to create instances of a
	 * fragment. Caches the compiled linker if possible.
	 *
	 * @param {Vue} vm
	 * @param {Element|String} el
	 */
	function FragmentFactory(vm, el) {
	  this.vm = vm;
	  var template;
	  var isString = typeof el === 'string';
	  if (isString || isTemplate(el)) {
	    template = parseTemplate(el, true);
	  } else {
	    template = document.createDocumentFragment();
	    template.appendChild(el);
	  }
	  this.template = template;
	  // linker can be cached, but only for components
	  var linker;
	  var cid = vm.constructor.cid;
	  if (cid > 0) {
	    var cacheId = cid + (isString ? el : getOuterHTML(el));
	    linker = linkerCache.get(cacheId);
	    if (!linker) {
	      linker = compile(template, vm.$options, true);
	      linkerCache.put(cacheId, linker);
	    }
	  } else {
	    linker = compile(template, vm.$options, true);
	  }
	  this.linker = linker;
	}
	
	/**
	 * Create a fragment instance with given host and scope.
	 *
	 * @param {Vue} host
	 * @param {Object} scope
	 * @param {Fragment} parentFrag
	 */
	
	FragmentFactory.prototype.create = function (host, scope, parentFrag) {
	  var frag = cloneNode(this.template);
	  return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
	};
	
	var ON = 700;
	var MODEL = 800;
	var BIND = 850;
	var TRANSITION = 1100;
	var EL = 1500;
	var COMPONENT = 1500;
	var PARTIAL = 1750;
	var FOR = 2000;
	var IF = 2000;
	var SLOT = 2100;
	
	var uid$3 = 0;
	
	var vFor = {
	
	  priority: FOR,
	  terminal: true,
	
	  params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],
	
	  bind: function bind() {
	    // support "item in/of items" syntax
	    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
	    if (inMatch) {
	      var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
	      if (itMatch) {
	        this.iterator = itMatch[1].trim();
	        this.alias = itMatch[2].trim();
	      } else {
	        this.alias = inMatch[1].trim();
	      }
	      this.expression = inMatch[2];
	    }
	
	    if (!this.alias) {
	      process.env.NODE_ENV !== 'production' && warn('Alias is required in v-for.');
	      return;
	    }
	
	    // uid as a cache identifier
	    this.id = '__v-for__' + ++uid$3;
	
	    // check if this is an option list,
	    // so that we know if we need to update the <select>'s
	    // v-model when the option list has changed.
	    // because v-model has a lower priority than v-for,
	    // the v-model is not bound here yet, so we have to
	    // retrive it in the actual updateModel() function.
	    var tag = this.el.tagName;
	    this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';
	
	    // setup anchor nodes
	    this.start = createAnchor('v-for-start');
	    this.end = createAnchor('v-for-end');
	    replace(this.el, this.end);
	    before(this.start, this.end);
	
	    // cache
	    this.cache = Object.create(null);
	
	    // fragment factory
	    this.factory = new FragmentFactory(this.vm, this.el);
	  },
	
	  update: function update(data) {
	    this.diff(data);
	    this.updateRef();
	    this.updateModel();
	  },
	
	  /**
	   * Diff, based on new data and old data, determine the
	   * minimum amount of DOM manipulations needed to make the
	   * DOM reflect the new data Array.
	   *
	   * The algorithm diffs the new data Array by storing a
	   * hidden reference to an owner vm instance on previously
	   * seen data. This allows us to achieve O(n) which is
	   * better than a levenshtein distance based algorithm,
	   * which is O(m * n).
	   *
	   * @param {Array} data
	   */
	
	  diff: function diff(data) {
	    // check if the Array was converted from an Object
	    var item = data[0];
	    var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');
	
	    var trackByKey = this.params.trackBy;
	    var oldFrags = this.frags;
	    var frags = this.frags = new Array(data.length);
	    var alias = this.alias;
	    var iterator = this.iterator;
	    var start = this.start;
	    var end = this.end;
	    var inDocument = inDoc(start);
	    var init = !oldFrags;
	    var i, l, frag, key, value, primitive;
	
	    // First pass, go through the new Array and fill up
	    // the new frags array. If a piece of data has a cached
	    // instance for it, we reuse it. Otherwise build a new
	    // instance.
	    for (i = 0, l = data.length; i < l; i++) {
	      item = data[i];
	      key = convertedFromObject ? item.$key : null;
	      value = convertedFromObject ? item.$value : item;
	      primitive = !isObject(value);
	      frag = !init && this.getCachedFrag(value, i, key);
	      if (frag) {
	        // reusable fragment
	        frag.reused = true;
	        // update $index
	        frag.scope.$index = i;
	        // update $key
	        if (key) {
	          frag.scope.$key = key;
	        }
	        // update iterator
	        if (iterator) {
	          frag.scope[iterator] = key !== null ? key : i;
	        }
	        // update data for track-by, object repeat &
	        // primitive values.
	        if (trackByKey || convertedFromObject || primitive) {
	          withoutConversion(function () {
	            frag.scope[alias] = value;
	          });
	        }
	      } else {
	        // new isntance
	        frag = this.create(value, alias, i, key);
	        frag.fresh = !init;
	      }
	      frags[i] = frag;
	      if (init) {
	        frag.before(end);
	      }
	    }
	
	    // we're done for the initial render.
	    if (init) {
	      return;
	    }
	
	    // Second pass, go through the old fragments and
	    // destroy those who are not reused (and remove them
	    // from cache)
	    var removalIndex = 0;
	    var totalRemoved = oldFrags.length - frags.length;
	    // when removing a large number of fragments, watcher removal
	    // turns out to be a perf bottleneck, so we batch the watcher
	    // removals into a single filter call!
	    this.vm._vForRemoving = true;
	    for (i = 0, l = oldFrags.length; i < l; i++) {
	      frag = oldFrags[i];
	      if (!frag.reused) {
	        this.deleteCachedFrag(frag);
	        this.remove(frag, removalIndex++, totalRemoved, inDocument);
	      }
	    }
	    this.vm._vForRemoving = false;
	    if (removalIndex) {
	      this.vm._watchers = this.vm._watchers.filter(function (w) {
	        return w.active;
	      });
	    }
	
	    // Final pass, move/insert new fragments into the
	    // right place.
	    var targetPrev, prevEl, currentPrev;
	    var insertionIndex = 0;
	    for (i = 0, l = frags.length; i < l; i++) {
	      frag = frags[i];
	      // this is the frag that we should be after
	      targetPrev = frags[i - 1];
	      prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
	      if (frag.reused && !frag.staggerCb) {
	        currentPrev = findPrevFrag(frag, start, this.id);
	        if (currentPrev !== targetPrev && (!currentPrev ||
	        // optimization for moving a single item.
	        // thanks to suggestions by @livoras in #1807
	        findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
	          this.move(frag, prevEl);
	        }
	      } else {
	        // new instance, or still in stagger.
	        // insert with updated stagger index.
	        this.insert(frag, insertionIndex++, prevEl, inDocument);
	      }
	      frag.reused = frag.fresh = false;
	    }
	  },
	
	  /**
	   * Create a new fragment instance.
	   *
	   * @param {*} value
	   * @param {String} alias
	   * @param {Number} index
	   * @param {String} [key]
	   * @return {Fragment}
	   */
	
	  create: function create(value, alias, index, key) {
	    var host = this._host;
	    // create iteration scope
	    var parentScope = this._scope || this.vm;
	    var scope = Object.create(parentScope);
	    // ref holder for the scope
	    scope.$refs = Object.create(parentScope.$refs);
	    scope.$els = Object.create(parentScope.$els);
	    // make sure point $parent to parent scope
	    scope.$parent = parentScope;
	    // for two-way binding on alias
	    scope.$forContext = this;
	    // define scope properties
	    // important: define the scope alias without forced conversion
	    // so that frozen data structures remain non-reactive.
	    withoutConversion(function () {
	      defineReactive(scope, alias, value);
	    });
	    defineReactive(scope, '$index', index);
	    if (key) {
	      defineReactive(scope, '$key', key);
	    } else if (scope.$key) {
	      // avoid accidental fallback
	      def(scope, '$key', null);
	    }
	    if (this.iterator) {
	      defineReactive(scope, this.iterator, key !== null ? key : index);
	    }
	    var frag = this.factory.create(host, scope, this._frag);
	    frag.forId = this.id;
	    this.cacheFrag(value, frag, index, key);
	    return frag;
	  },
	
	  /**
	   * Update the v-ref on owner vm.
	   */
	
	  updateRef: function updateRef() {
	    var ref = this.descriptor.ref;
	    if (!ref) return;
	    var hash = (this._scope || this.vm).$refs;
	    var refs;
	    if (!this.fromObject) {
	      refs = this.frags.map(findVmFromFrag);
	    } else {
	      refs = {};
	      this.frags.forEach(function (frag) {
	        refs[frag.scope.$key] = findVmFromFrag(frag);
	      });
	    }
	    hash[ref] = refs;
	  },
	
	  /**
	   * For option lists, update the containing v-model on
	   * parent <select>.
	   */
	
	  updateModel: function updateModel() {
	    if (this.isOption) {
	      var parent = this.start.parentNode;
	      var model = parent && parent.__v_model;
	      if (model) {
	        model.forceUpdate();
	      }
	    }
	  },
	
	  /**
	   * Insert a fragment. Handles staggering.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Node} prevEl
	   * @param {Boolean} inDocument
	   */
	
	  insert: function insert(frag, index, prevEl, inDocument) {
	    if (frag.staggerCb) {
	      frag.staggerCb.cancel();
	      frag.staggerCb = null;
	    }
	    var staggerAmount = this.getStagger(frag, index, null, 'enter');
	    if (inDocument && staggerAmount) {
	      // create an anchor and insert it synchronously,
	      // so that we can resolve the correct order without
	      // worrying about some elements not inserted yet
	      var anchor = frag.staggerAnchor;
	      if (!anchor) {
	        anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
	        anchor.__v_frag = frag;
	      }
	      after(anchor, prevEl);
	      var op = frag.staggerCb = cancellable(function () {
	        frag.staggerCb = null;
	        frag.before(anchor);
	        remove(anchor);
	      });
	      setTimeout(op, staggerAmount);
	    } else {
	      frag.before(prevEl.nextSibling);
	    }
	  },
	
	  /**
	   * Remove a fragment. Handles staggering.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Number} total
	   * @param {Boolean} inDocument
	   */
	
	  remove: function remove(frag, index, total, inDocument) {
	    if (frag.staggerCb) {
	      frag.staggerCb.cancel();
	      frag.staggerCb = null;
	      // it's not possible for the same frag to be removed
	      // twice, so if we have a pending stagger callback,
	      // it means this frag is queued for enter but removed
	      // before its transition started. Since it is already
	      // destroyed, we can just leave it in detached state.
	      return;
	    }
	    var staggerAmount = this.getStagger(frag, index, total, 'leave');
	    if (inDocument && staggerAmount) {
	      var op = frag.staggerCb = cancellable(function () {
	        frag.staggerCb = null;
	        frag.remove();
	      });
	      setTimeout(op, staggerAmount);
	    } else {
	      frag.remove();
	    }
	  },
	
	  /**
	   * Move a fragment to a new position.
	   * Force no transition.
	   *
	   * @param {Fragment} frag
	   * @param {Node} prevEl
	   */
	
	  move: function move(frag, prevEl) {
	    // fix a common issue with Sortable:
	    // if prevEl doesn't have nextSibling, this means it's
	    // been dragged after the end anchor. Just re-position
	    // the end anchor to the end of the container.
	    /* istanbul ignore if */
	    if (!prevEl.nextSibling) {
	      this.end.parentNode.appendChild(this.end);
	    }
	    frag.before(prevEl.nextSibling, false);
	  },
	
	  /**
	   * Cache a fragment using track-by or the object key.
	   *
	   * @param {*} value
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {String} [key]
	   */
	
	  cacheFrag: function cacheFrag(value, frag, index, key) {
	    var trackByKey = this.params.trackBy;
	    var cache = this.cache;
	    var primitive = !isObject(value);
	    var id;
	    if (key || trackByKey || primitive) {
	      id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
	      if (!cache[id]) {
	        cache[id] = frag;
	      } else if (trackByKey !== '$index') {
	        process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	      }
	    } else {
	      id = this.id;
	      if (hasOwn(value, id)) {
	        if (value[id] === null) {
	          value[id] = frag;
	        } else {
	          process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	        }
	      } else {
	        def(value, id, frag);
	      }
	    }
	    frag.raw = value;
	  },
	
	  /**
	   * Get a cached fragment from the value/index/key
	   *
	   * @param {*} value
	   * @param {Number} index
	   * @param {String} key
	   * @return {Fragment}
	   */
	
	  getCachedFrag: function getCachedFrag(value, index, key) {
	    var trackByKey = this.params.trackBy;
	    var primitive = !isObject(value);
	    var frag;
	    if (key || trackByKey || primitive) {
	      var id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
	      frag = this.cache[id];
	    } else {
	      frag = value[this.id];
	    }
	    if (frag && (frag.reused || frag.fresh)) {
	      process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	    }
	    return frag;
	  },
	
	  /**
	   * Delete a fragment from cache.
	   *
	   * @param {Fragment} frag
	   */
	
	  deleteCachedFrag: function deleteCachedFrag(frag) {
	    var value = frag.raw;
	    var trackByKey = this.params.trackBy;
	    var scope = frag.scope;
	    var index = scope.$index;
	    // fix #948: avoid accidentally fall through to
	    // a parent repeater which happens to have $key.
	    var key = hasOwn(scope, '$key') && scope.$key;
	    var primitive = !isObject(value);
	    if (trackByKey || key || primitive) {
	      var id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
	      this.cache[id] = null;
	    } else {
	      value[this.id] = null;
	      frag.raw = null;
	    }
	  },
	
	  /**
	   * Get the stagger amount for an insertion/removal.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Number} total
	   * @param {String} type
	   */
	
	  getStagger: function getStagger(frag, index, total, type) {
	    type = type + 'Stagger';
	    var trans = frag.node.__v_trans;
	    var hooks = trans && trans.hooks;
	    var hook = hooks && (hooks[type] || hooks.stagger);
	    return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
	  },
	
	  /**
	   * Pre-process the value before piping it through the
	   * filters. This is passed to and called by the watcher.
	   */
	
	  _preProcess: function _preProcess(value) {
	    // regardless of type, store the un-filtered raw value.
	    this.rawValue = value;
	    return value;
	  },
	
	  /**
	   * Post-process the value after it has been piped through
	   * the filters. This is passed to and called by the watcher.
	   *
	   * It is necessary for this to be called during the
	   * wathcer's dependency collection phase because we want
	   * the v-for to update when the source Object is mutated.
	   */
	
	  _postProcess: function _postProcess(value) {
	    if (isArray(value)) {
	      return value;
	    } else if (isPlainObject(value)) {
	      // convert plain object to array.
	      var keys = Object.keys(value);
	      var i = keys.length;
	      var res = new Array(i);
	      var key;
	      while (i--) {
	        key = keys[i];
	        res[i] = {
	          $key: key,
	          $value: value[key]
	        };
	      }
	      return res;
	    } else {
	      if (typeof value === 'number' && !isNaN(value)) {
	        value = range(value);
	      }
	      return value || [];
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.descriptor.ref) {
	      (this._scope || this.vm).$refs[this.descriptor.ref] = null;
	    }
	    if (this.frags) {
	      var i = this.frags.length;
	      var frag;
	      while (i--) {
	        frag = this.frags[i];
	        this.deleteCachedFrag(frag);
	        frag.destroy();
	      }
	    }
	  }
	};
	
	/**
	 * Helper to find the previous element that is a fragment
	 * anchor. This is necessary because a destroyed frag's
	 * element could still be lingering in the DOM before its
	 * leaving transition finishes, but its inserted flag
	 * should have been set to false so we can skip them.
	 *
	 * If this is a block repeat, we want to make sure we only
	 * return frag that is bound to this v-for. (see #929)
	 *
	 * @param {Fragment} frag
	 * @param {Comment|Text} anchor
	 * @param {String} id
	 * @return {Fragment}
	 */
	
	function findPrevFrag(frag, anchor, id) {
	  var el = frag.node.previousSibling;
	  /* istanbul ignore if */
	  if (!el) return;
	  frag = el.__v_frag;
	  while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
	    el = el.previousSibling;
	    /* istanbul ignore if */
	    if (!el) return;
	    frag = el.__v_frag;
	  }
	  return frag;
	}
	
	/**
	 * Find a vm from a fragment.
	 *
	 * @param {Fragment} frag
	 * @return {Vue|undefined}
	 */
	
	function findVmFromFrag(frag) {
	  var node = frag.node;
	  // handle multi-node frag
	  if (frag.end) {
	    while (!node.__vue__ && node !== frag.end && node.nextSibling) {
	      node = node.nextSibling;
	    }
	  }
	  return node.__vue__;
	}
	
	/**
	 * Create a range array from given number.
	 *
	 * @param {Number} n
	 * @return {Array}
	 */
	
	function range(n) {
	  var i = -1;
	  var ret = new Array(Math.floor(n));
	  while (++i < n) {
	    ret[i] = i;
	  }
	  return ret;
	}
	
	if (process.env.NODE_ENV !== 'production') {
	  vFor.warnDuplicate = function (value) {
	    warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.');
	  };
	}
	
	var vIf = {
	
	  priority: IF,
	  terminal: true,
	
	  bind: function bind() {
	    var el = this.el;
	    if (!el.__vue__) {
	      // check else block
	      var next = el.nextElementSibling;
	      if (next && getAttr(next, 'v-else') !== null) {
	        remove(next);
	        this.elseEl = next;
	      }
	      // check main block
	      this.anchor = createAnchor('v-if');
	      replace(el, this.anchor);
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.');
	      this.invalid = true;
	    }
	  },
	
	  update: function update(value) {
	    if (this.invalid) return;
	    if (value) {
	      if (!this.frag) {
	        this.insert();
	      }
	    } else {
	      this.remove();
	    }
	  },
	
	  insert: function insert() {
	    if (this.elseFrag) {
	      this.elseFrag.remove();
	      this.elseFrag = null;
	    }
	    // lazy init factory
	    if (!this.factory) {
	      this.factory = new FragmentFactory(this.vm, this.el);
	    }
	    this.frag = this.factory.create(this._host, this._scope, this._frag);
	    this.frag.before(this.anchor);
	  },
	
	  remove: function remove() {
	    if (this.frag) {
	      this.frag.remove();
	      this.frag = null;
	    }
	    if (this.elseEl && !this.elseFrag) {
	      if (!this.elseFactory) {
	        this.elseFactory = new FragmentFactory(this.elseEl._context || this.vm, this.elseEl);
	      }
	      this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
	      this.elseFrag.before(this.anchor);
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	    if (this.elseFrag) {
	      this.elseFrag.destroy();
	    }
	  }
	};
	
	var show = {
	
	  bind: function bind() {
	    // check else block
	    var next = this.el.nextElementSibling;
	    if (next && getAttr(next, 'v-else') !== null) {
	      this.elseEl = next;
	    }
	  },
	
	  update: function update(value) {
	    this.apply(this.el, value);
	    if (this.elseEl) {
	      this.apply(this.elseEl, !value);
	    }
	  },
	
	  apply: function apply(el, value) {
	    if (inDoc(el)) {
	      applyTransition(el, value ? 1 : -1, toggle, this.vm);
	    } else {
	      toggle();
	    }
	    function toggle() {
	      el.style.display = value ? '' : 'none';
	    }
	  }
	};
	
	var text$2 = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	    var isRange = el.type === 'range';
	    var lazy = this.params.lazy;
	    var number = this.params.number;
	    var debounce = this.params.debounce;
	
	    // handle composition events.
	    //   http://blog.evanyou.me/2014/01/03/composition-event/
	    // skip this for Android because it handles composition
	    // events quite differently. Android doesn't trigger
	    // composition events for language input methods e.g.
	    // Chinese, but instead triggers them for spelling
	    // suggestions... (see Discussion/#162)
	    var composing = false;
	    if (!isAndroid && !isRange) {
	      this.on('compositionstart', function () {
	        composing = true;
	      });
	      this.on('compositionend', function () {
	        composing = false;
	        // in IE11 the "compositionend" event fires AFTER
	        // the "input" event, so the input handler is blocked
	        // at the end... have to call it here.
	        //
	        // #1327: in lazy mode this is unecessary.
	        if (!lazy) {
	          self.listener();
	        }
	      });
	    }
	
	    // prevent messing with the input when user is typing,
	    // and force update on blur.
	    this.focused = false;
	    if (!isRange && !lazy) {
	      this.on('focus', function () {
	        self.focused = true;
	      });
	      this.on('blur', function () {
	        self.focused = false;
	        // do not sync value after fragment removal (#2017)
	        if (!self._frag || self._frag.inserted) {
	          self.rawListener();
	        }
	      });
	    }
	
	    // Now attach the main listener
	    this.listener = this.rawListener = function () {
	      if (composing || !self._bound) {
	        return;
	      }
	      var val = number || isRange ? toNumber(el.value) : el.value;
	      self.set(val);
	      // force update on next tick to avoid lock & same value
	      // also only update when user is not typing
	      nextTick(function () {
	        if (self._bound && !self.focused) {
	          self.update(self._watcher.value);
	        }
	      });
	    };
	
	    // apply debounce
	    if (debounce) {
	      this.listener = _debounce(this.listener, debounce);
	    }
	
	    // Support jQuery events, since jQuery.trigger() doesn't
	    // trigger native events in some cases and some plugins
	    // rely on $.trigger()
	    //
	    // We want to make sure if a listener is attached using
	    // jQuery, it is also removed with jQuery, that's why
	    // we do the check for each directive instance and
	    // store that check result on itself. This also allows
	    // easier test coverage control by unsetting the global
	    // jQuery variable in tests.
	    this.hasjQuery = typeof jQuery === 'function';
	    if (this.hasjQuery) {
	      var method = jQuery.fn.on ? 'on' : 'bind';
	      jQuery(el)[method]('change', this.rawListener);
	      if (!lazy) {
	        jQuery(el)[method]('input', this.listener);
	      }
	    } else {
	      this.on('change', this.rawListener);
	      if (!lazy) {
	        this.on('input', this.listener);
	      }
	    }
	
	    // IE9 doesn't fire input event on backspace/del/cut
	    if (!lazy && isIE9) {
	      this.on('cut', function () {
	        nextTick(self.listener);
	      });
	      this.on('keyup', function (e) {
	        if (e.keyCode === 46 || e.keyCode === 8) {
	          self.listener();
	        }
	      });
	    }
	
	    // set initial value if present
	    if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    this.el.value = _toString(value);
	  },
	
	  unbind: function unbind() {
	    var el = this.el;
	    if (this.hasjQuery) {
	      var method = jQuery.fn.off ? 'off' : 'unbind';
	      jQuery(el)[method]('change', this.listener);
	      jQuery(el)[method]('input', this.listener);
	    }
	  }
	};
	
	var radio = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    this.getValue = function () {
	      // value overwrite via v-bind:value
	      if (el.hasOwnProperty('_value')) {
	        return el._value;
	      }
	      var val = el.value;
	      if (self.params.number) {
	        val = toNumber(val);
	      }
	      return val;
	    };
	
	    this.listener = function () {
	      self.set(self.getValue());
	    };
	    this.on('change', this.listener);
	
	    if (el.hasAttribute('checked')) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    this.el.checked = looseEqual(value, this.getValue());
	  }
	};
	
	var select = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    // method to force update DOM using latest value.
	    this.forceUpdate = function () {
	      if (self._watcher) {
	        self.update(self._watcher.get());
	      }
	    };
	
	    // check if this is a multiple select
	    var multiple = this.multiple = el.hasAttribute('multiple');
	
	    // attach listener
	    this.listener = function () {
	      var value = getValue(el, multiple);
	      value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
	      self.set(value);
	    };
	    this.on('change', this.listener);
	
	    // if has initial value, set afterBind
	    var initValue = getValue(el, multiple, true);
	    if (multiple && initValue.length || !multiple && initValue !== null) {
	      this.afterBind = this.listener;
	    }
	
	    // All major browsers except Firefox resets
	    // selectedIndex with value -1 to 0 when the element
	    // is appended to a new parent, therefore we have to
	    // force a DOM update whenever that happens...
	    this.vm.$on('hook:attached', this.forceUpdate);
	  },
	
	  update: function update(value) {
	    var el = this.el;
	    el.selectedIndex = -1;
	    var multi = this.multiple && isArray(value);
	    var options = el.options;
	    var i = options.length;
	    var op, val;
	    while (i--) {
	      op = options[i];
	      val = op.hasOwnProperty('_value') ? op._value : op.value;
	      /* eslint-disable eqeqeq */
	      op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
	      /* eslint-enable eqeqeq */
	    }
	  },
	
	  unbind: function unbind() {
	    /* istanbul ignore next */
	    this.vm.$off('hook:attached', this.forceUpdate);
	  }
	};
	
	/**
	 * Get select value
	 *
	 * @param {SelectElement} el
	 * @param {Boolean} multi
	 * @param {Boolean} init
	 * @return {Array|*}
	 */
	
	function getValue(el, multi, init) {
	  var res = multi ? [] : null;
	  var op, val, selected;
	  for (var i = 0, l = el.options.length; i < l; i++) {
	    op = el.options[i];
	    selected = init ? op.hasAttribute('selected') : op.selected;
	    if (selected) {
	      val = op.hasOwnProperty('_value') ? op._value : op.value;
	      if (multi) {
	        res.push(val);
	      } else {
	        return val;
	      }
	    }
	  }
	  return res;
	}
	
	/**
	 * Native Array.indexOf uses strict equal, but in this
	 * case we need to match string/numbers with custom equal.
	 *
	 * @param {Array} arr
	 * @param {*} val
	 */
	
	function indexOf$1(arr, val) {
	  var i = arr.length;
	  while (i--) {
	    if (looseEqual(arr[i], val)) {
	      return i;
	    }
	  }
	  return -1;
	}
	
	var checkbox = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    this.getValue = function () {
	      return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
	    };
	
	    function getBooleanValue() {
	      var val = el.checked;
	      if (val && el.hasOwnProperty('_trueValue')) {
	        return el._trueValue;
	      }
	      if (!val && el.hasOwnProperty('_falseValue')) {
	        return el._falseValue;
	      }
	      return val;
	    }
	
	    this.listener = function () {
	      var model = self._watcher.value;
	      if (isArray(model)) {
	        var val = self.getValue();
	        if (el.checked) {
	          if (indexOf(model, val) < 0) {
	            model.push(val);
	          }
	        } else {
	          model.$remove(val);
	        }
	      } else {
	        self.set(getBooleanValue());
	      }
	    };
	
	    this.on('change', this.listener);
	    if (el.hasAttribute('checked')) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    var el = this.el;
	    if (isArray(value)) {
	      el.checked = indexOf(value, this.getValue()) > -1;
	    } else {
	      if (el.hasOwnProperty('_trueValue')) {
	        el.checked = looseEqual(value, el._trueValue);
	      } else {
	        el.checked = !!value;
	      }
	    }
	  }
	};
	
	var handlers = {
	  text: text$2,
	  radio: radio,
	  select: select,
	  checkbox: checkbox
	};
	
	var model = {
	
	  priority: MODEL,
	  twoWay: true,
	  handlers: handlers,
	  params: ['lazy', 'number', 'debounce'],
	
	  /**
	   * Possible elements:
	   *   <select>
	   *   <textarea>
	   *   <input type="*">
	   *     - text
	   *     - checkbox
	   *     - radio
	   *     - number
	   */
	
	  bind: function bind() {
	    // friendly warning...
	    this.checkFilters();
	    if (this.hasRead && !this.hasWrite) {
	      process.env.NODE_ENV !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model. You might want to use a two-way filter ' + 'to ensure correct behavior.');
	    }
	    var el = this.el;
	    var tag = el.tagName;
	    var handler;
	    if (tag === 'INPUT') {
	      handler = handlers[el.type] || handlers.text;
	    } else if (tag === 'SELECT') {
	      handler = handlers.select;
	    } else if (tag === 'TEXTAREA') {
	      handler = handlers.text;
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('v-model does not support element type: ' + tag);
	      return;
	    }
	    el.__v_model = this;
	    handler.bind.call(this);
	    this.update = handler.update;
	    this._unbind = handler.unbind;
	  },
	
	  /**
	   * Check read/write filter stats.
	   */
	
	  checkFilters: function checkFilters() {
	    var filters = this.filters;
	    if (!filters) return;
	    var i = filters.length;
	    while (i--) {
	      var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
	      if (typeof filter === 'function' || filter.read) {
	        this.hasRead = true;
	      }
	      if (filter.write) {
	        this.hasWrite = true;
	      }
	    }
	  },
	
	  unbind: function unbind() {
	    this.el.__v_model = null;
	    this._unbind && this._unbind();
	  }
	};
	
	// keyCode aliases
	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  'delete': [8, 46],
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40
	};
	
	function keyFilter(handler, keys) {
	  var codes = keys.map(function (key) {
	    var charCode = key.charCodeAt(0);
	    if (charCode > 47 && charCode < 58) {
	      return parseInt(key, 10);
	    }
	    if (key.length === 1) {
	      charCode = key.toUpperCase().charCodeAt(0);
	      if (charCode > 64 && charCode < 91) {
	        return charCode;
	      }
	    }
	    return keyCodes[key];
	  });
	  codes = [].concat.apply([], codes);
	  return function keyHandler(e) {
	    if (codes.indexOf(e.keyCode) > -1) {
	      return handler.call(this, e);
	    }
	  };
	}
	
	function stopFilter(handler) {
	  return function stopHandler(e) {
	    e.stopPropagation();
	    return handler.call(this, e);
	  };
	}
	
	function preventFilter(handler) {
	  return function preventHandler(e) {
	    e.preventDefault();
	    return handler.call(this, e);
	  };
	}
	
	function selfFilter(handler) {
	  return function selfHandler(e) {
	    if (e.target === e.currentTarget) {
	      return handler.call(this, e);
	    }
	  };
	}
	
	var on$1 = {
	
	  priority: ON,
	  acceptStatement: true,
	  keyCodes: keyCodes,
	
	  bind: function bind() {
	    // deal with iframes
	    if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
	      var self = this;
	      this.iframeBind = function () {
	        on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
	      };
	      this.on('load', this.iframeBind);
	    }
	  },
	
	  update: function update(handler) {
	    // stub a noop for v-on with no value,
	    // e.g. @mousedown.prevent
	    if (!this.descriptor.raw) {
	      handler = function () {};
	    }
	
	    if (typeof handler !== 'function') {
	      process.env.NODE_ENV !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler);
	      return;
	    }
	
	    // apply modifiers
	    if (this.modifiers.stop) {
	      handler = stopFilter(handler);
	    }
	    if (this.modifiers.prevent) {
	      handler = preventFilter(handler);
	    }
	    if (this.modifiers.self) {
	      handler = selfFilter(handler);
	    }
	    // key filter
	    var keys = Object.keys(this.modifiers).filter(function (key) {
	      return key !== 'stop' && key !== 'prevent' && key !== 'self';
	    });
	    if (keys.length) {
	      handler = keyFilter(handler, keys);
	    }
	
	    this.reset();
	    this.handler = handler;
	
	    if (this.iframeBind) {
	      this.iframeBind();
	    } else {
	      on(this.el, this.arg, this.handler, this.modifiers.capture);
	    }
	  },
	
	  reset: function reset() {
	    var el = this.iframeBind ? this.el.contentWindow : this.el;
	    if (this.handler) {
	      off(el, this.arg, this.handler);
	    }
	  },
	
	  unbind: function unbind() {
	    this.reset();
	  }
	};
	
	var prefixes = ['-webkit-', '-moz-', '-ms-'];
	var camelPrefixes = ['Webkit', 'Moz', 'ms'];
	var importantRE = /!important;?$/;
	var propCache = Object.create(null);
	
	var testEl = null;
	
	var style = {
	
	  deep: true,
	
	  update: function update(value) {
	    if (typeof value === 'string') {
	      this.el.style.cssText = value;
	    } else if (isArray(value)) {
	      this.handleObject(value.reduce(extend, {}));
	    } else {
	      this.handleObject(value || {});
	    }
	  },
	
	  handleObject: function handleObject(value) {
	    // cache object styles so that only changed props
	    // are actually updated.
	    var cache = this.cache || (this.cache = {});
	    var name, val;
	    for (name in cache) {
	      if (!(name in value)) {
	        this.handleSingle(name, null);
	        delete cache[name];
	      }
	    }
	    for (name in value) {
	      val = value[name];
	      if (val !== cache[name]) {
	        cache[name] = val;
	        this.handleSingle(name, val);
	      }
	    }
	  },
	
	  handleSingle: function handleSingle(prop, value) {
	    prop = normalize(prop);
	    if (!prop) return; // unsupported prop
	    // cast possible numbers/booleans into strings
	    if (value != null) value += '';
	    if (value) {
	      var isImportant = importantRE.test(value) ? 'important' : '';
	      if (isImportant) {
	        value = value.replace(importantRE, '').trim();
	      }
	      this.el.style.setProperty(prop, value, isImportant);
	    } else {
	      this.el.style.removeProperty(prop);
	    }
	  }
	
	};
	
	/**
	 * Normalize a CSS property name.
	 * - cache result
	 * - auto prefix
	 * - camelCase -> dash-case
	 *
	 * @param {String} prop
	 * @return {String}
	 */
	
	function normalize(prop) {
	  if (propCache[prop]) {
	    return propCache[prop];
	  }
	  var res = prefix(prop);
	  propCache[prop] = propCache[res] = res;
	  return res;
	}
	
	/**
	 * Auto detect the appropriate prefix for a CSS property.
	 * https://gist.github.com/paulirish/523692
	 *
	 * @param {String} prop
	 * @return {String}
	 */
	
	function prefix(prop) {
	  prop = hyphenate(prop);
	  var camel = camelize(prop);
	  var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
	  if (!testEl) {
	    testEl = document.createElement('div');
	  }
	  var i = prefixes.length;
	  var prefixed;
	  while (i--) {
	    prefixed = camelPrefixes[i] + upper;
	    if (prefixed in testEl.style) {
	      return prefixes[i] + prop;
	    }
	  }
	  if (camel in testEl.style) {
	    return prop;
	  }
	}
	
	// xlink
	var xlinkNS = 'http://www.w3.org/1999/xlink';
	var xlinkRE = /^xlink:/;
	
	// check for attributes that prohibit interpolations
	var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
	// these attributes should also set their corresponding properties
	// because they only affect the initial state of the element
	var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
	// these attributes expect enumrated values of "true" or "false"
	// but are not boolean attributes
	var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;
	
	// these attributes should set a hidden property for
	// binding v-model to object values
	var modelProps = {
	  value: '_value',
	  'true-value': '_trueValue',
	  'false-value': '_falseValue'
	};
	
	var bind$1 = {
	
	  priority: BIND,
	
	  bind: function bind() {
	    var attr = this.arg;
	    var tag = this.el.tagName;
	    // should be deep watch on object mode
	    if (!attr) {
	      this.deep = true;
	    }
	    // handle interpolation bindings
	    var descriptor = this.descriptor;
	    var tokens = descriptor.interp;
	    if (tokens) {
	      // handle interpolations with one-time tokens
	      if (descriptor.hasOneTime) {
	        this.expression = tokensToExp(tokens, this._scope || this.vm);
	      }
	
	      // only allow binding on native attributes
	      if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
	        process.env.NODE_ENV !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.');
	        this.el.removeAttribute(attr);
	        this.invalid = true;
	      }
	
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production') {
	        var raw = attr + '="' + descriptor.raw + '": ';
	        // warn src
	        if (attr === 'src') {
	          warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.');
	        }
	
	        // warn style
	        if (attr === 'style') {
	          warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.');
	        }
	      }
	    }
	  },
	
	  update: function update(value) {
	    if (this.invalid) {
	      return;
	    }
	    var attr = this.arg;
	    if (this.arg) {
	      this.handleSingle(attr, value);
	    } else {
	      this.handleObject(value || {});
	    }
	  },
	
	  // share object handler with v-bind:class
	  handleObject: style.handleObject,
	
	  handleSingle: function handleSingle(attr, value) {
	    var el = this.el;
	    var interp = this.descriptor.interp;
	    if (this.modifiers.camel) {
	      attr = camelize(attr);
	    }
	    if (!interp && attrWithPropsRE.test(attr) && attr in el) {
	      el[attr] = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
	      ? '' : value : value;
	    }
	    // set model props
	    var modelProp = modelProps[attr];
	    if (!interp && modelProp) {
	      el[modelProp] = value;
	      // update v-model if present
	      var model = el.__v_model;
	      if (model) {
	        model.listener();
	      }
	    }
	    // do not set value attribute for textarea
	    if (attr === 'value' && el.tagName === 'TEXTAREA') {
	      el.removeAttribute(attr);
	      return;
	    }
	    // update attribute
	    if (enumeratedAttrRE.test(attr)) {
	      el.setAttribute(attr, value ? 'true' : 'false');
	    } else if (value != null && value !== false) {
	      if (attr === 'class') {
	        // handle edge case #1960:
	        // class interpolation should not overwrite Vue transition class
	        if (el.__v_trans) {
	          value += ' ' + el.__v_trans.id + '-transition';
	        }
	        setClass(el, value);
	      } else if (xlinkRE.test(attr)) {
	        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
	      } else {
	        el.setAttribute(attr, value === true ? '' : value);
	      }
	    } else {
	      el.removeAttribute(attr);
	    }
	  }
	};
	
	var el = {
	
	  priority: EL,
	
	  bind: function bind() {
	    /* istanbul ignore if */
	    if (!this.arg) {
	      return;
	    }
	    var id = this.id = camelize(this.arg);
	    var refs = (this._scope || this.vm).$els;
	    if (hasOwn(refs, id)) {
	      refs[id] = this.el;
	    } else {
	      defineReactive(refs, id, this.el);
	    }
	  },
	
	  unbind: function unbind() {
	    var refs = (this._scope || this.vm).$els;
	    if (refs[this.id] === this.el) {
	      refs[this.id] = null;
	    }
	  }
	};
	
	var ref = {
	  bind: function bind() {
	    process.env.NODE_ENV !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.');
	  }
	};
	
	var cloak = {
	  bind: function bind() {
	    var el = this.el;
	    this.vm.$once('pre-hook:compiled', function () {
	      el.removeAttribute('v-cloak');
	    });
	  }
	};
	
	// must export plain object
	var directives = {
	  text: text$1,
	  html: html,
	  'for': vFor,
	  'if': vIf,
	  show: show,
	  model: model,
	  on: on$1,
	  bind: bind$1,
	  el: el,
	  ref: ref,
	  cloak: cloak
	};
	
	var vClass = {
	
	  deep: true,
	
	  update: function update(value) {
	    if (value && typeof value === 'string') {
	      this.handleObject(stringToObject(value));
	    } else if (isPlainObject(value)) {
	      this.handleObject(value);
	    } else if (isArray(value)) {
	      this.handleArray(value);
	    } else {
	      this.cleanup();
	    }
	  },
	
	  handleObject: function handleObject(value) {
	    this.cleanup(value);
	    this.prevKeys = Object.keys(value);
	    setObjectClasses(this.el, value);
	  },
	
	  handleArray: function handleArray(value) {
	    this.cleanup(value);
	    for (var i = 0, l = value.length; i < l; i++) {
	      var val = value[i];
	      if (val && isPlainObject(val)) {
	        setObjectClasses(this.el, val);
	      } else if (val && typeof val === 'string') {
	        addClass(this.el, val);
	      }
	    }
	    this.prevKeys = value.slice();
	  },
	
	  cleanup: function cleanup(value) {
	    if (this.prevKeys) {
	      var i = this.prevKeys.length;
	      while (i--) {
	        var key = this.prevKeys[i];
	        if (!key) continue;
	        if (isPlainObject(key)) {
	          var keys = Object.keys(key);
	          for (var k = 0; k < keys.length; k++) {
	            removeClass(this.el, keys[k]);
	          }
	        } else {
	          removeClass(this.el, key);
	        }
	      }
	    }
	  }
	};
	
	function setObjectClasses(el, obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    if (obj[key]) {
	      addClass(el, key);
	    }
	  }
	}
	
	function stringToObject(value) {
	  var res = {};
	  var keys = value.trim().split(/\s+/);
	  var i = keys.length;
	  while (i--) {
	    res[keys[i]] = true;
	  }
	  return res;
	}
	
	var component = {
	
	  priority: COMPONENT,
	
	  params: ['keep-alive', 'transition-mode', 'inline-template'],
	
	  /**
	   * Setup. Two possible usages:
	   *
	   * - static:
	   *   <comp> or <div v-component="comp">
	   *
	   * - dynamic:
	   *   <component :is="view">
	   */
	
	  bind: function bind() {
	    if (!this.el.__vue__) {
	      // keep-alive cache
	      this.keepAlive = this.params.keepAlive;
	      if (this.keepAlive) {
	        this.cache = {};
	      }
	      // check inline-template
	      if (this.params.inlineTemplate) {
	        // extract inline template as a DocumentFragment
	        this.inlineTemplate = extractContent(this.el, true);
	      }
	      // component resolution related state
	      this.pendingComponentCb = this.Component = null;
	      // transition related state
	      this.pendingRemovals = 0;
	      this.pendingRemovalCb = null;
	      // create a ref anchor
	      this.anchor = createAnchor('v-component');
	      replace(this.el, this.anchor);
	      // remove is attribute.
	      // this is removed during compilation, but because compilation is
	      // cached, when the component is used elsewhere this attribute
	      // will remain at link time.
	      this.el.removeAttribute('is');
	      // remove ref, same as above
	      if (this.descriptor.ref) {
	        this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
	      }
	      // if static, build right now.
	      if (this.literal) {
	        this.setComponent(this.expression);
	      }
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
	    }
	  },
	
	  /**
	   * Public update, called by the watcher in the dynamic
	   * literal scenario, e.g. <component :is="view">
	   */
	
	  update: function update(value) {
	    if (!this.literal) {
	      this.setComponent(value);
	    }
	  },
	
	  /**
	   * Switch dynamic components. May resolve the component
	   * asynchronously, and perform transition based on
	   * specified transition mode. Accepts a few additional
	   * arguments specifically for vue-router.
	   *
	   * The callback is called when the full transition is
	   * finished.
	   *
	   * @param {String} value
	   * @param {Function} [cb]
	   */
	
	  setComponent: function setComponent(value, cb) {
	    this.invalidatePending();
	    if (!value) {
	      // just remove current
	      this.unbuild(true);
	      this.remove(this.childVM, cb);
	      this.childVM = null;
	    } else {
	      var self = this;
	      this.resolveComponent(value, function () {
	        self.mountComponent(cb);
	      });
	    }
	  },
	
	  /**
	   * Resolve the component constructor to use when creating
	   * the child vm.
	   *
	   * @param {String|Function} value
	   * @param {Function} cb
	   */
	
	  resolveComponent: function resolveComponent(value, cb) {
	    var self = this;
	    this.pendingComponentCb = cancellable(function (Component) {
	      self.ComponentName = Component.options.name || (typeof value === 'string' ? value : null);
	      self.Component = Component;
	      cb();
	    });
	    this.vm._resolveComponent(value, this.pendingComponentCb);
	  },
	
	  /**
	   * Create a new instance using the current constructor and
	   * replace the existing instance. This method doesn't care
	   * whether the new component and the old one are actually
	   * the same.
	   *
	   * @param {Function} [cb]
	   */
	
	  mountComponent: function mountComponent(cb) {
	    // actual mount
	    this.unbuild(true);
	    var self = this;
	    var activateHooks = this.Component.options.activate;
	    var cached = this.getCached();
	    var newComponent = this.build();
	    if (activateHooks && !cached) {
	      this.waitingFor = newComponent;
	      callActivateHooks(activateHooks, newComponent, function () {
	        if (self.waitingFor !== newComponent) {
	          return;
	        }
	        self.waitingFor = null;
	        self.transition(newComponent, cb);
	      });
	    } else {
	      // update ref for kept-alive component
	      if (cached) {
	        newComponent._updateRef();
	      }
	      this.transition(newComponent, cb);
	    }
	  },
	
	  /**
	   * When the component changes or unbinds before an async
	   * constructor is resolved, we need to invalidate its
	   * pending callback.
	   */
	
	  invalidatePending: function invalidatePending() {
	    if (this.pendingComponentCb) {
	      this.pendingComponentCb.cancel();
	      this.pendingComponentCb = null;
	    }
	  },
	
	  /**
	   * Instantiate/insert a new child vm.
	   * If keep alive and has cached instance, insert that
	   * instance; otherwise build a new one and cache it.
	   *
	   * @param {Object} [extraOptions]
	   * @return {Vue} - the created instance
	   */
	
	  build: function build(extraOptions) {
	    var cached = this.getCached();
	    if (cached) {
	      return cached;
	    }
	    if (this.Component) {
	      // default options
	      var options = {
	        name: this.ComponentName,
	        el: cloneNode(this.el),
	        template: this.inlineTemplate,
	        // make sure to add the child with correct parent
	        // if this is a transcluded component, its parent
	        // should be the transclusion host.
	        parent: this._host || this.vm,
	        // if no inline-template, then the compiled
	        // linker can be cached for better performance.
	        _linkerCachable: !this.inlineTemplate,
	        _ref: this.descriptor.ref,
	        _asComponent: true,
	        _isRouterView: this._isRouterView,
	        // if this is a transcluded component, context
	        // will be the common parent vm of this instance
	        // and its host.
	        _context: this.vm,
	        // if this is inside an inline v-for, the scope
	        // will be the intermediate scope created for this
	        // repeat fragment. this is used for linking props
	        // and container directives.
	        _scope: this._scope,
	        // pass in the owner fragment of this component.
	        // this is necessary so that the fragment can keep
	        // track of its contained components in order to
	        // call attach/detach hooks for them.
	        _frag: this._frag
	      };
	      // extra options
	      // in 1.0.0 this is used by vue-router only
	      /* istanbul ignore if */
	      if (extraOptions) {
	        extend(options, extraOptions);
	      }
	      var child = new this.Component(options);
	      if (this.keepAlive) {
	        this.cache[this.Component.cid] = child;
	      }
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
	        warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template);
	      }
	      return child;
	    }
	  },
	
	  /**
	   * Try to get a cached instance of the current component.
	   *
	   * @return {Vue|undefined}
	   */
	
	  getCached: function getCached() {
	    return this.keepAlive && this.cache[this.Component.cid];
	  },
	
	  /**
	   * Teardown the current child, but defers cleanup so
	   * that we can separate the destroy and removal steps.
	   *
	   * @param {Boolean} defer
	   */
	
	  unbuild: function unbuild(defer) {
	    if (this.waitingFor) {
	      if (!this.keepAlive) {
	        this.waitingFor.$destroy();
	      }
	      this.waitingFor = null;
	    }
	    var child = this.childVM;
	    if (!child || this.keepAlive) {
	      if (child) {
	        // remove ref
	        child._inactive = true;
	        child._updateRef(true);
	      }
	      return;
	    }
	    // the sole purpose of `deferCleanup` is so that we can
	    // "deactivate" the vm right now and perform DOM removal
	    // later.
	    child.$destroy(false, defer);
	  },
	
	  /**
	   * Remove current destroyed child and manually do
	   * the cleanup after removal.
	   *
	   * @param {Function} cb
	   */
	
	  remove: function remove(child, cb) {
	    var keepAlive = this.keepAlive;
	    if (child) {
	      // we may have a component switch when a previous
	      // component is still being transitioned out.
	      // we want to trigger only one lastest insertion cb
	      // when the existing transition finishes. (#1119)
	      this.pendingRemovals++;
	      this.pendingRemovalCb = cb;
	      var self = this;
	      child.$remove(function () {
	        self.pendingRemovals--;
	        if (!keepAlive) child._cleanup();
	        if (!self.pendingRemovals && self.pendingRemovalCb) {
	          self.pendingRemovalCb();
	          self.pendingRemovalCb = null;
	        }
	      });
	    } else if (cb) {
	      cb();
	    }
	  },
	
	  /**
	   * Actually swap the components, depending on the
	   * transition mode. Defaults to simultaneous.
	   *
	   * @param {Vue} target
	   * @param {Function} [cb]
	   */
	
	  transition: function transition(target, cb) {
	    var self = this;
	    var current = this.childVM;
	    // for devtool inspection
	    if (current) current._inactive = true;
	    target._inactive = false;
	    this.childVM = target;
	    switch (self.params.transitionMode) {
	      case 'in-out':
	        target.$before(self.anchor, function () {
	          self.remove(current, cb);
	        });
	        break;
	      case 'out-in':
	        self.remove(current, function () {
	          target.$before(self.anchor, cb);
	        });
	        break;
	      default:
	        self.remove(current);
	        target.$before(self.anchor, cb);
	    }
	  },
	
	  /**
	   * Unbind.
	   */
	
	  unbind: function unbind() {
	    this.invalidatePending();
	    // Do not defer cleanup when unbinding
	    this.unbuild();
	    // destroy all keep-alive cached instances
	    if (this.cache) {
	      for (var key in this.cache) {
	        this.cache[key].$destroy();
	      }
	      this.cache = null;
	    }
	  }
	};
	
	/**
	 * Call activate hooks in order (asynchronous)
	 *
	 * @param {Array} hooks
	 * @param {Vue} vm
	 * @param {Function} cb
	 */
	
	function callActivateHooks(hooks, vm, cb) {
	  var total = hooks.length;
	  var called = 0;
	  hooks[0].call(vm, next);
	  function next() {
	    if (++called >= total) {
	      cb();
	    } else {
	      hooks[called].call(vm, next);
	    }
	  }
	}
	
	var propBindingModes = config._propBindingModes;
	var empty = {};
	
	// regexes
	var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
	var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;
	
	/**
	 * Compile props on a root element and return
	 * a props link function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Array} propOptions
	 * @return {Function} propsLinkFn
	 */
	
	function compileProps(el, propOptions) {
	  var props = [];
	  var names = Object.keys(propOptions);
	  var i = names.length;
	  var options, name, attr, value, path, parsed, prop;
	  while (i--) {
	    name = names[i];
	    options = propOptions[name] || empty;
	
	    if (process.env.NODE_ENV !== 'production' && name === '$data') {
	      warn('Do not use $data as prop.');
	      continue;
	    }
	
	    // props could contain dashes, which will be
	    // interpreted as minus calculations by the parser
	    // so we need to camelize the path here
	    path = camelize(name);
	    if (!identRE$1.test(path)) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.');
	      continue;
	    }
	
	    prop = {
	      name: name,
	      path: path,
	      options: options,
	      mode: propBindingModes.ONE_WAY,
	      raw: null
	    };
	
	    attr = hyphenate(name);
	    // first check dynamic version
	    if ((value = getBindAttr(el, attr)) === null) {
	      if ((value = getBindAttr(el, attr + '.sync')) !== null) {
	        prop.mode = propBindingModes.TWO_WAY;
	      } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
	        prop.mode = propBindingModes.ONE_TIME;
	      }
	    }
	    if (value !== null) {
	      // has dynamic binding!
	      prop.raw = value;
	      parsed = parseDirective(value);
	      value = parsed.expression;
	      prop.filters = parsed.filters;
	      // check binding type
	      if (isLiteral(value) && !parsed.filters) {
	        // for expressions containing literal numbers and
	        // booleans, there's no need to setup a prop binding,
	        // so we can optimize them as a one-time set.
	        prop.optimizedLiteral = true;
	      } else {
	        prop.dynamic = true;
	        // check non-settable path for two-way bindings
	        if (process.env.NODE_ENV !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
	          prop.mode = propBindingModes.ONE_WAY;
	          warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value);
	        }
	      }
	      prop.parentPath = value;
	
	      // warn required two-way
	      if (process.env.NODE_ENV !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
	        warn('Prop "' + name + '" expects a two-way binding type.');
	      }
	    } else if ((value = getAttr(el, attr)) !== null) {
	      // has literal binding!
	      prop.raw = value;
	    } else if (process.env.NODE_ENV !== 'production') {
	      // check possible camelCase prop usage
	      var lowerCaseName = path.toLowerCase();
	      value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
	      if (value) {
	        warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.');
	      } else if (options.required) {
	        // warn missing required
	        warn('Missing required prop: ' + name);
	      }
	    }
	    // push prop
	    props.push(prop);
	  }
	  return makePropsLinkFn(props);
	}
	
	/**
	 * Build a function that applies props to a vm.
	 *
	 * @param {Array} props
	 * @return {Function} propsLinkFn
	 */
	
	function makePropsLinkFn(props) {
	  return function propsLinkFn(vm, scope) {
	    // store resolved props info
	    vm._props = {};
	    var i = props.length;
	    var prop, path, options, value, raw;
	    while (i--) {
	      prop = props[i];
	      raw = prop.raw;
	      path = prop.path;
	      options = prop.options;
	      vm._props[path] = prop;
	      if (raw === null) {
	        // initialize absent prop
	        initProp(vm, prop, undefined);
	      } else if (prop.dynamic) {
	        // dynamic prop
	        if (prop.mode === propBindingModes.ONE_TIME) {
	          // one time binding
	          value = (scope || vm._context || vm).$get(prop.parentPath);
	          initProp(vm, prop, value);
	        } else {
	          if (vm._context) {
	            // dynamic binding
	            vm._bindDir({
	              name: 'prop',
	              def: propDef,
	              prop: prop
	            }, null, null, scope); // el, host, scope
	          } else {
	              // root instance
	              initProp(vm, prop, vm.$get(prop.parentPath));
	            }
	        }
	      } else if (prop.optimizedLiteral) {
	        // optimized literal, cast it and just set once
	        var stripped = stripQuotes(raw);
	        value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
	        initProp(vm, prop, value);
	      } else {
	        // string literal, but we need to cater for
	        // Boolean props with no value, or with same
	        // literal value (e.g. disabled="disabled")
	        // see https://github.com/vuejs/vue-loader/issues/182
	        value = options.type === Boolean && (raw === '' || raw === hyphenate(prop.name)) ? true : raw;
	        initProp(vm, prop, value);
	      }
	    }
	  };
	}
	
	/**
	 * Set a prop's initial value on a vm and its data object.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @param {*} value
	 */
	
	function initProp(vm, prop, value) {
	  var key = prop.path;
	  value = coerceProp(prop, value);
	  if (value === undefined) {
	    value = getPropDefaultValue(vm, prop.options);
	  }
	  if (assertProp(prop, value)) {
	    defineReactive(vm, key, value);
	  }
	}
	
	/**
	 * Get the default value of a prop.
	 *
	 * @param {Vue} vm
	 * @param {Object} options
	 * @return {*}
	 */
	
	function getPropDefaultValue(vm, options) {
	  // no default, return undefined
	  if (!hasOwn(options, 'default')) {
	    // absent boolean value defaults to false
	    return options.type === Boolean ? false : undefined;
	  }
	  var def = options['default'];
	  // warn against non-factory defaults for Object & Array
	  if (isObject(def)) {
	    process.env.NODE_ENV !== 'production' && warn('Object/Array as default prop values will be shared ' + 'across multiple instances. Use a factory function ' + 'to return the default value instead.');
	  }
	  // call factory function for non-Function types
	  return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
	}
	
	/**
	 * Assert whether a prop is valid.
	 *
	 * @param {Object} prop
	 * @param {*} value
	 */
	
	function assertProp(prop, value) {
	  if (!prop.options.required && ( // non-required
	  prop.raw === null || // abscent
	  value == null) // null or undefined
	  ) {
	      return true;
	    }
	  var options = prop.options;
	  var type = options.type;
	  var valid = true;
	  var expectedType;
	  if (type) {
	    if (type === String) {
	      expectedType = 'string';
	      valid = typeof value === expectedType;
	    } else if (type === Number) {
	      expectedType = 'number';
	      valid = typeof value === 'number';
	    } else if (type === Boolean) {
	      expectedType = 'boolean';
	      valid = typeof value === 'boolean';
	    } else if (type === Function) {
	      expectedType = 'function';
	      valid = typeof value === 'function';
	    } else if (type === Object) {
	      expectedType = 'object';
	      valid = isPlainObject(value);
	    } else if (type === Array) {
	      expectedType = 'array';
	      valid = isArray(value);
	    } else {
	      valid = value instanceof type;
	    }
	  }
	  if (!valid) {
	    process.env.NODE_ENV !== 'production' && warn('Invalid prop: type check failed for ' + prop.path + '="' + prop.raw + '".' + ' Expected ' + formatType(expectedType) + ', got ' + formatValue(value) + '.');
	    return false;
	  }
	  var validator = options.validator;
	  if (validator) {
	    if (!validator(value)) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid prop: custom validator check failed for ' + prop.path + '="' + prop.raw + '"');
	      return false;
	    }
	  }
	  return true;
	}
	
	/**
	 * Force parsing value with coerce option.
	 *
	 * @param {*} value
	 * @param {Object} options
	 * @return {*}
	 */
	
	function coerceProp(prop, value) {
	  var coerce = prop.options.coerce;
	  if (!coerce) {
	    return value;
	  }
	  // coerce is a function
	  return coerce(value);
	}
	
	function formatType(val) {
	  return val ? val.charAt(0).toUpperCase() + val.slice(1) : 'custom type';
	}
	
	function formatValue(val) {
	  return Object.prototype.toString.call(val).slice(8, -1);
	}
	
	var bindingModes = config._propBindingModes;
	
	var propDef = {
	
	  bind: function bind() {
	    var child = this.vm;
	    var parent = child._context;
	    // passed in from compiler directly
	    var prop = this.descriptor.prop;
	    var childKey = prop.path;
	    var parentKey = prop.parentPath;
	    var twoWay = prop.mode === bindingModes.TWO_WAY;
	    var isSimple = isSimplePath(parentKey);
	
	    var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
	      val = coerceProp(prop, val);
	      if (assertProp(prop, val)) {
	        if (isSimple) {
	          withoutConversion(function () {
	            child[childKey] = val;
	          });
	        } else {
	          child[childKey] = val;
	        }
	      }
	    }, {
	      twoWay: twoWay,
	      filters: prop.filters,
	      // important: props need to be observed on the
	      // v-for scope if present
	      scope: this._scope
	    });
	
	    // set the child initial value.
	    var value = parentWatcher.value;
	    if (isSimple && value !== undefined) {
	      withoutConversion(function () {
	        initProp(child, prop, value);
	      });
	    } else {
	      initProp(child, prop, value);
	    }
	
	    // setup two-way binding
	    if (twoWay) {
	      // important: defer the child watcher creation until
	      // the created hook (after data observation)
	      var self = this;
	      child.$once('pre-hook:created', function () {
	        self.childWatcher = new Watcher(child, childKey, function (val) {
	          parentWatcher.set(val);
	        }, {
	          // ensure sync upward before parent sync down.
	          // this is necessary in cases e.g. the child
	          // mutates a prop array, then replaces it. (#1683)
	          sync: true
	        });
	      });
	    }
	  },
	
	  unbind: function unbind() {
	    this.parentWatcher.teardown();
	    if (this.childWatcher) {
	      this.childWatcher.teardown();
	    }
	  }
	};
	
	var queue$1 = [];
	var queued = false;
	
	/**
	 * Push a job into the queue.
	 *
	 * @param {Function} job
	 */
	
	function pushJob(job) {
	  queue$1.push(job);
	  if (!queued) {
	    queued = true;
	    nextTick(flush);
	  }
	}
	
	/**
	 * Flush the queue, and do one forced reflow before
	 * triggering transitions.
	 */
	
	function flush() {
	  // Force layout
	  var f = document.documentElement.offsetHeight;
	  for (var i = 0; i < queue$1.length; i++) {
	    queue$1[i]();
	  }
	  queue$1 = [];
	  queued = false;
	  // dummy return, so js linters don't complain about
	  // unused variable f
	  return f;
	}
	
	var TYPE_TRANSITION = 'transition';
	var TYPE_ANIMATION = 'animation';
	var transDurationProp = transitionProp + 'Duration';
	var animDurationProp = animationProp + 'Duration';
	
	/**
	 * If a just-entered element is applied the
	 * leave class while its enter transition hasn't started yet,
	 * and the transitioned property has the same value for both
	 * enter/leave, then the leave transition will be skipped and
	 * the transitionend event never fires. This function ensures
	 * its callback to be called after a transition has started
	 * by waiting for double raf.
	 *
	 * It falls back to setTimeout on devices that support CSS
	 * transitions but not raf (e.g. Android 4.2 browser) - since
	 * these environments are usually slow, we are giving it a
	 * relatively large timeout.
	 */
	
	var raf = inBrowser && window.requestAnimationFrame;
	var waitForTransitionStart = raf
	/* istanbul ignore next */
	? function (fn) {
	  raf(function () {
	    raf(fn);
	  });
	} : function (fn) {
	  setTimeout(fn, 50);
	};
	
	/**
	 * A Transition object that encapsulates the state and logic
	 * of the transition.
	 *
	 * @param {Element} el
	 * @param {String} id
	 * @param {Object} hooks
	 * @param {Vue} vm
	 */
	function Transition(el, id, hooks, vm) {
	  this.id = id;
	  this.el = el;
	  this.enterClass = hooks && hooks.enterClass || id + '-enter';
	  this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
	  this.hooks = hooks;
	  this.vm = vm;
	  // async state
	  this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
	  this.justEntered = false;
	  this.entered = this.left = false;
	  this.typeCache = {};
	  // check css transition type
	  this.type = hooks && hooks.type;
	  /* istanbul ignore if */
	  if (process.env.NODE_ENV !== 'production') {
	    if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
	      warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type);
	    }
	  }
	  // bind
	  var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
	    self[m] = bind(self[m], self);
	  });
	}
	
	var p$1 = Transition.prototype;
	
	/**
	 * Start an entering transition.
	 *
	 * 1. enter transition triggered
	 * 2. call beforeEnter hook
	 * 3. add enter class
	 * 4. insert/show element
	 * 5. call enter hook (with possible explicit js callback)
	 * 6. reflow
	 * 7. based on transition type:
	 *    - transition:
	 *        remove class now, wait for transitionend,
	 *        then done if there's no explicit js callback.
	 *    - animation:
	 *        wait for animationend, remove class,
	 *        then done if there's no explicit js callback.
	 *    - no css transition:
	 *        done now if there's no explicit js callback.
	 * 8. wait for either done or js callback, then call
	 *    afterEnter hook.
	 *
	 * @param {Function} op - insert/show the element
	 * @param {Function} [cb]
	 */
	
	p$1.enter = function (op, cb) {
	  this.cancelPending();
	  this.callHook('beforeEnter');
	  this.cb = cb;
	  addClass(this.el, this.enterClass);
	  op();
	  this.entered = false;
	  this.callHookWithCb('enter');
	  if (this.entered) {
	    return; // user called done synchronously.
	  }
	  this.cancel = this.hooks && this.hooks.enterCancelled;
	  pushJob(this.enterNextTick);
	};
	
	/**
	 * The "nextTick" phase of an entering transition, which is
	 * to be pushed into a queue and executed after a reflow so
	 * that removing the class can trigger a CSS transition.
	 */
	
	p$1.enterNextTick = function () {
	  var _this = this;
	
	  // prevent transition skipping
	  this.justEntered = true;
	  waitForTransitionStart(function () {
	    _this.justEntered = false;
	  });
	  var enterDone = this.enterDone;
	  var type = this.getCssTransitionType(this.enterClass);
	  if (!this.pendingJsCb) {
	    if (type === TYPE_TRANSITION) {
	      // trigger transition by removing enter class now
	      removeClass(this.el, this.enterClass);
	      this.setupCssCb(transitionEndEvent, enterDone);
	    } else if (type === TYPE_ANIMATION) {
	      this.setupCssCb(animationEndEvent, enterDone);
	    } else {
	      enterDone();
	    }
	  } else if (type === TYPE_TRANSITION) {
	    removeClass(this.el, this.enterClass);
	  }
	};
	
	/**
	 * The "cleanup" phase of an entering transition.
	 */
	
	p$1.enterDone = function () {
	  this.entered = true;
	  this.cancel = this.pendingJsCb = null;
	  removeClass(this.el, this.enterClass);
	  this.callHook('afterEnter');
	  if (this.cb) this.cb();
	};
	
	/**
	 * Start a leaving transition.
	 *
	 * 1. leave transition triggered.
	 * 2. call beforeLeave hook
	 * 3. add leave class (trigger css transition)
	 * 4. call leave hook (with possible explicit js callback)
	 * 5. reflow if no explicit js callback is provided
	 * 6. based on transition type:
	 *    - transition or animation:
	 *        wait for end event, remove class, then done if
	 *        there's no explicit js callback.
	 *    - no css transition:
	 *        done if there's no explicit js callback.
	 * 7. wait for either done or js callback, then call
	 *    afterLeave hook.
	 *
	 * @param {Function} op - remove/hide the element
	 * @param {Function} [cb]
	 */
	
	p$1.leave = function (op, cb) {
	  this.cancelPending();
	  this.callHook('beforeLeave');
	  this.op = op;
	  this.cb = cb;
	  addClass(this.el, this.leaveClass);
	  this.left = false;
	  this.callHookWithCb('leave');
	  if (this.left) {
	    return; // user called done synchronously.
	  }
	  this.cancel = this.hooks && this.hooks.leaveCancelled;
	  // only need to handle leaveDone if
	  // 1. the transition is already done (synchronously called
	  //    by the user, which causes this.op set to null)
	  // 2. there's no explicit js callback
	  if (this.op && !this.pendingJsCb) {
	    // if a CSS transition leaves immediately after enter,
	    // the transitionend event never fires. therefore we
	    // detect such cases and end the leave immediately.
	    if (this.justEntered) {
	      this.leaveDone();
	    } else {
	      pushJob(this.leaveNextTick);
	    }
	  }
	};
	
	/**
	 * The "nextTick" phase of a leaving transition.
	 */
	
	p$1.leaveNextTick = function () {
	  var type = this.getCssTransitionType(this.leaveClass);
	  if (type) {
	    var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
	    this.setupCssCb(event, this.leaveDone);
	  } else {
	    this.leaveDone();
	  }
	};
	
	/**
	 * The "cleanup" phase of a leaving transition.
	 */
	
	p$1.leaveDone = function () {
	  this.left = true;
	  this.cancel = this.pendingJsCb = null;
	  this.op();
	  removeClass(this.el, this.leaveClass);
	  this.callHook('afterLeave');
	  if (this.cb) this.cb();
	  this.op = null;
	};
	
	/**
	 * Cancel any pending callbacks from a previously running
	 * but not finished transition.
	 */
	
	p$1.cancelPending = function () {
	  this.op = this.cb = null;
	  var hasPending = false;
	  if (this.pendingCssCb) {
	    hasPending = true;
	    off(this.el, this.pendingCssEvent, this.pendingCssCb);
	    this.pendingCssEvent = this.pendingCssCb = null;
	  }
	  if (this.pendingJsCb) {
	    hasPending = true;
	    this.pendingJsCb.cancel();
	    this.pendingJsCb = null;
	  }
	  if (hasPending) {
	    removeClass(this.el, this.enterClass);
	    removeClass(this.el, this.leaveClass);
	  }
	  if (this.cancel) {
	    this.cancel.call(this.vm, this.el);
	    this.cancel = null;
	  }
	};
	
	/**
	 * Call a user-provided synchronous hook function.
	 *
	 * @param {String} type
	 */
	
	p$1.callHook = function (type) {
	  if (this.hooks && this.hooks[type]) {
	    this.hooks[type].call(this.vm, this.el);
	  }
	};
	
	/**
	 * Call a user-provided, potentially-async hook function.
	 * We check for the length of arguments to see if the hook
	 * expects a `done` callback. If true, the transition's end
	 * will be determined by when the user calls that callback;
	 * otherwise, the end is determined by the CSS transition or
	 * animation.
	 *
	 * @param {String} type
	 */
	
	p$1.callHookWithCb = function (type) {
	  var hook = this.hooks && this.hooks[type];
	  if (hook) {
	    if (hook.length > 1) {
	      this.pendingJsCb = cancellable(this[type + 'Done']);
	    }
	    hook.call(this.vm, this.el, this.pendingJsCb);
	  }
	};
	
	/**
	 * Get an element's transition type based on the
	 * calculated styles.
	 *
	 * @param {String} className
	 * @return {Number}
	 */
	
	p$1.getCssTransitionType = function (className) {
	  /* istanbul ignore if */
	  if (!transitionEndEvent ||
	  // skip CSS transitions if page is not visible -
	  // this solves the issue of transitionend events not
	  // firing until the page is visible again.
	  // pageVisibility API is supported in IE10+, same as
	  // CSS transitions.
	  document.hidden ||
	  // explicit js-only transition
	  this.hooks && this.hooks.css === false ||
	  // element is hidden
	  isHidden(this.el)) {
	    return;
	  }
	  var type = this.type || this.typeCache[className];
	  if (type) return type;
	  var inlineStyles = this.el.style;
	  var computedStyles = window.getComputedStyle(this.el);
	  var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
	  if (transDuration && transDuration !== '0s') {
	    type = TYPE_TRANSITION;
	  } else {
	    var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
	    if (animDuration && animDuration !== '0s') {
	      type = TYPE_ANIMATION;
	    }
	  }
	  if (type) {
	    this.typeCache[className] = type;
	  }
	  return type;
	};
	
	/**
	 * Setup a CSS transitionend/animationend callback.
	 *
	 * @param {String} event
	 * @param {Function} cb
	 */
	
	p$1.setupCssCb = function (event, cb) {
	  this.pendingCssEvent = event;
	  var self = this;
	  var el = this.el;
	  var onEnd = this.pendingCssCb = function (e) {
	    if (e.target === el) {
	      off(el, event, onEnd);
	      self.pendingCssEvent = self.pendingCssCb = null;
	      if (!self.pendingJsCb && cb) {
	        cb();
	      }
	    }
	  };
	  on(el, event, onEnd);
	};
	
	/**
	 * Check if an element is hidden - in that case we can just
	 * skip the transition alltogether.
	 *
	 * @param {Element} el
	 * @return {Boolean}
	 */
	
	function isHidden(el) {
	  if (/svg$/.test(el.namespaceURI)) {
	    // SVG elements do not have offset(Width|Height)
	    // so we need to check the client rect
	    var rect = el.getBoundingClientRect();
	    return !(rect.width || rect.height);
	  } else {
	    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	  }
	}
	
	var transition$1 = {
	
	  priority: TRANSITION,
	
	  update: function update(id, oldId) {
	    var el = this.el;
	    // resolve on owner vm
	    var hooks = resolveAsset(this.vm.$options, 'transitions', id);
	    id = id || 'v';
	    el.__v_trans = new Transition(el, id, hooks, this.vm);
	    if (oldId) {
	      removeClass(el, oldId + '-transition');
	    }
	    addClass(el, id + '-transition');
	  }
	};
	
	var internalDirectives = {
	  style: style,
	  'class': vClass,
	  component: component,
	  prop: propDef,
	  transition: transition$1
	};
	
	// special binding prefixes
	var bindRE = /^v-bind:|^:/;
	var onRE = /^v-on:|^@/;
	var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
	var modifierRE = /\.[^\.]+/g;
	var transitionRE = /^(v-bind:|:)?transition$/;
	
	// default directive priority
	var DEFAULT_PRIORITY = 1000;
	var DEFAULT_TERMINAL_PRIORITY = 2000;
	
	/**
	 * Compile a template and return a reusable composite link
	 * function, which recursively contains more link functions
	 * inside. This top level compile function would normally
	 * be called on instance root nodes, but can also be used
	 * for partial compilation if the partial argument is true.
	 *
	 * The returned composite link function, when called, will
	 * return an unlink function that tearsdown all directives
	 * created during the linking phase.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Object} options
	 * @param {Boolean} partial
	 * @return {Function}
	 */
	
	function compile(el, options, partial) {
	  // link function for the node itself.
	  var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
	  // link function for the childNodes
	  var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && el.tagName !== 'SCRIPT' && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;
	
	  /**
	   * A composite linker function to be called on a already
	   * compiled piece of DOM, which instantiates all directive
	   * instances.
	   *
	   * @param {Vue} vm
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host] - host vm of transcluded content
	   * @param {Object} [scope] - v-for scope
	   * @param {Fragment} [frag] - link context fragment
	   * @return {Function|undefined}
	   */
	
	  return function compositeLinkFn(vm, el, host, scope, frag) {
	    // cache childNodes before linking parent, fix #657
	    var childNodes = toArray(el.childNodes);
	    // link
	    var dirs = linkAndCapture(function compositeLinkCapturer() {
	      if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
	      if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
	    }, vm);
	    return makeUnlinkFn(vm, dirs);
	  };
	}
	
	/**
	 * Apply a linker to a vm/element pair and capture the
	 * directives created during the process.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 */
	
	function linkAndCapture(linker, vm) {
	  /* istanbul ignore if */
	  if (process.env.NODE_ENV === 'production') {
	    // reset directives before every capture in production
	    // mode, so that when unlinking we don't need to splice
	    // them out (which turns out to be a perf hit).
	    // they are kept in development mode because they are
	    // useful for Vue's own tests.
	    vm._directives = [];
	  }
	  var originalDirCount = vm._directives.length;
	  linker();
	  var dirs = vm._directives.slice(originalDirCount);
	  dirs.sort(directiveComparator);
	  for (var i = 0, l = dirs.length; i < l; i++) {
	    dirs[i]._bind();
	  }
	  return dirs;
	}
	
	/**
	 * Directive priority sort comparator
	 *
	 * @param {Object} a
	 * @param {Object} b
	 */
	
	function directiveComparator(a, b) {
	  a = a.descriptor.def.priority || DEFAULT_PRIORITY;
	  b = b.descriptor.def.priority || DEFAULT_PRIORITY;
	  return a > b ? -1 : a === b ? 0 : 1;
	}
	
	/**
	 * Linker functions return an unlink function that
	 * tearsdown all directives instances generated during
	 * the process.
	 *
	 * We create unlink functions with only the necessary
	 * information to avoid retaining additional closures.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Vue} [context]
	 * @param {Array} [contextDirs]
	 * @return {Function}
	 */
	
	function makeUnlinkFn(vm, dirs, context, contextDirs) {
	  function unlink(destroying) {
	    teardownDirs(vm, dirs, destroying);
	    if (context && contextDirs) {
	      teardownDirs(context, contextDirs);
	    }
	  }
	  // expose linked directives
	  unlink.dirs = dirs;
	  return unlink;
	}
	
	/**
	 * Teardown partial linked directives.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Boolean} destroying
	 */
	
	function teardownDirs(vm, dirs, destroying) {
	  var i = dirs.length;
	  while (i--) {
	    dirs[i]._teardown();
	    if (process.env.NODE_ENV !== 'production' && !destroying) {
	      vm._directives.$remove(dirs[i]);
	    }
	  }
	}
	
	/**
	 * Compile link props on an instance.
	 *
	 * @param {Vue} vm
	 * @param {Element} el
	 * @param {Object} props
	 * @param {Object} [scope]
	 * @return {Function}
	 */
	
	function compileAndLinkProps(vm, el, props, scope) {
	  var propsLinkFn = compileProps(el, props);
	  var propDirs = linkAndCapture(function () {
	    propsLinkFn(vm, scope);
	  }, vm);
	  return makeUnlinkFn(vm, propDirs);
	}
	
	/**
	 * Compile the root element of an instance.
	 *
	 * 1. attrs on context container (context scope)
	 * 2. attrs on the component template root node, if
	 *    replace:true (child scope)
	 *
	 * If this is a fragment instance, we only need to compile 1.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @param {Object} contextOptions
	 * @return {Function}
	 */
	
	function compileRoot(el, options, contextOptions) {
	  var containerAttrs = options._containerAttrs;
	  var replacerAttrs = options._replacerAttrs;
	  var contextLinkFn, replacerLinkFn;
	
	  // only need to compile other attributes for
	  // non-fragment instances
	  if (el.nodeType !== 11) {
	    // for components, container and replacer need to be
	    // compiled separately and linked in different scopes.
	    if (options._asComponent) {
	      // 2. container attributes
	      if (containerAttrs && contextOptions) {
	        contextLinkFn = compileDirectives(containerAttrs, contextOptions);
	      }
	      if (replacerAttrs) {
	        // 3. replacer attributes
	        replacerLinkFn = compileDirectives(replacerAttrs, options);
	      }
	    } else {
	      // non-component, just compile as a normal element.
	      replacerLinkFn = compileDirectives(el.attributes, options);
	    }
	  } else if (process.env.NODE_ENV !== 'production' && containerAttrs) {
	    // warn container directives for fragment instances
	    var names = containerAttrs.filter(function (attr) {
	      // allow vue-loader/vueify scoped css attributes
	      return attr.name.indexOf('_v-') < 0 &&
	      // allow event listeners
	      !onRE.test(attr.name) &&
	      // allow slots
	      attr.name !== 'slot';
	    }).map(function (attr) {
	      return '"' + attr.name + '"';
	    });
	    if (names.length) {
	      var plural = names.length > 1;
	      warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment_Instance');
	    }
	  }
	
	  options._containerAttrs = options._replacerAttrs = null;
	  return function rootLinkFn(vm, el, scope) {
	    // link context scope dirs
	    var context = vm._context;
	    var contextDirs;
	    if (context && contextLinkFn) {
	      contextDirs = linkAndCapture(function () {
	        contextLinkFn(context, el, null, scope);
	      }, context);
	    }
	
	    // link self
	    var selfDirs = linkAndCapture(function () {
	      if (replacerLinkFn) replacerLinkFn(vm, el);
	    }, vm);
	
	    // return the unlink function that tearsdown context
	    // container directives.
	    return makeUnlinkFn(vm, selfDirs, context, contextDirs);
	  };
	}
	
	/**
	 * Compile a node and return a nodeLinkFn based on the
	 * node type.
	 *
	 * @param {Node} node
	 * @param {Object} options
	 * @return {Function|null}
	 */
	
	function compileNode(node, options) {
	  var type = node.nodeType;
	  if (type === 1 && node.tagName !== 'SCRIPT') {
	    return compileElement(node, options);
	  } else if (type === 3 && node.data.trim()) {
	    return compileTextNode(node, options);
	  } else {
	    return null;
	  }
	}
	
	/**
	 * Compile an element and return a nodeLinkFn.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|null}
	 */
	
	function compileElement(el, options) {
	  // preprocess textareas.
	  // textarea treats its text content as the initial value.
	  // just bind it as an attr directive for value.
	  if (el.tagName === 'TEXTAREA') {
	    var tokens = parseText(el.value);
	    if (tokens) {
	      el.setAttribute(':value', tokensToExp(tokens));
	      el.value = '';
	    }
	  }
	  var linkFn;
	  var hasAttrs = el.hasAttributes();
	  var attrs = hasAttrs && toArray(el.attributes);
	  // check terminal directives (for & if)
	  if (hasAttrs) {
	    linkFn = checkTerminalDirectives(el, attrs, options);
	  }
	  // check element directives
	  if (!linkFn) {
	    linkFn = checkElementDirectives(el, options);
	  }
	  // check component
	  if (!linkFn) {
	    linkFn = checkComponent(el, options);
	  }
	  // normal directives
	  if (!linkFn && hasAttrs) {
	    linkFn = compileDirectives(attrs, options);
	  }
	  return linkFn;
	}
	
	/**
	 * Compile a textNode and return a nodeLinkFn.
	 *
	 * @param {TextNode} node
	 * @param {Object} options
	 * @return {Function|null} textNodeLinkFn
	 */
	
	function compileTextNode(node, options) {
	  // skip marked text nodes
	  if (node._skip) {
	    return removeText;
	  }
	
	  var tokens = parseText(node.wholeText);
	  if (!tokens) {
	    return null;
	  }
	
	  // mark adjacent text nodes as skipped,
	  // because we are using node.wholeText to compile
	  // all adjacent text nodes together. This fixes
	  // issues in IE where sometimes it splits up a single
	  // text node into multiple ones.
	  var next = node.nextSibling;
	  while (next && next.nodeType === 3) {
	    next._skip = true;
	    next = next.nextSibling;
	  }
	
	  var frag = document.createDocumentFragment();
	  var el, token;
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    token = tokens[i];
	    el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
	    frag.appendChild(el);
	  }
	  return makeTextNodeLinkFn(tokens, frag, options);
	}
	
	/**
	 * Linker for an skipped text node.
	 *
	 * @param {Vue} vm
	 * @param {Text} node
	 */
	
	function removeText(vm, node) {
	  remove(node);
	}
	
	/**
	 * Process a single text token.
	 *
	 * @param {Object} token
	 * @param {Object} options
	 * @return {Node}
	 */
	
	function processTextToken(token, options) {
	  var el;
	  if (token.oneTime) {
	    el = document.createTextNode(token.value);
	  } else {
	    if (token.html) {
	      el = document.createComment('v-html');
	      setTokenType('html');
	    } else {
	      // IE will clean up empty textNodes during
	      // frag.cloneNode(true), so we have to give it
	      // something here...
	      el = document.createTextNode(' ');
	      setTokenType('text');
	    }
	  }
	  function setTokenType(type) {
	    if (token.descriptor) return;
	    var parsed = parseDirective(token.value);
	    token.descriptor = {
	      name: type,
	      def: directives[type],
	      expression: parsed.expression,
	      filters: parsed.filters
	    };
	  }
	  return el;
	}
	
	/**
	 * Build a function that processes a textNode.
	 *
	 * @param {Array<Object>} tokens
	 * @param {DocumentFragment} frag
	 */
	
	function makeTextNodeLinkFn(tokens, frag) {
	  return function textNodeLinkFn(vm, el, host, scope) {
	    var fragClone = frag.cloneNode(true);
	    var childNodes = toArray(fragClone.childNodes);
	    var token, value, node;
	    for (var i = 0, l = tokens.length; i < l; i++) {
	      token = tokens[i];
	      value = token.value;
	      if (token.tag) {
	        node = childNodes[i];
	        if (token.oneTime) {
	          value = (scope || vm).$eval(value);
	          if (token.html) {
	            replace(node, parseTemplate(value, true));
	          } else {
	            node.data = value;
	          }
	        } else {
	          vm._bindDir(token.descriptor, node, host, scope);
	        }
	      }
	    }
	    replace(el, fragClone);
	  };
	}
	
	/**
	 * Compile a node list and return a childLinkFn.
	 *
	 * @param {NodeList} nodeList
	 * @param {Object} options
	 * @return {Function|undefined}
	 */
	
	function compileNodeList(nodeList, options) {
	  var linkFns = [];
	  var nodeLinkFn, childLinkFn, node;
	  for (var i = 0, l = nodeList.length; i < l; i++) {
	    node = nodeList[i];
	    nodeLinkFn = compileNode(node, options);
	    childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
	    linkFns.push(nodeLinkFn, childLinkFn);
	  }
	  return linkFns.length ? makeChildLinkFn(linkFns) : null;
	}
	
	/**
	 * Make a child link function for a node's childNodes.
	 *
	 * @param {Array<Function>} linkFns
	 * @return {Function} childLinkFn
	 */
	
	function makeChildLinkFn(linkFns) {
	  return function childLinkFn(vm, nodes, host, scope, frag) {
	    var node, nodeLinkFn, childrenLinkFn;
	    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
	      node = nodes[n];
	      nodeLinkFn = linkFns[i++];
	      childrenLinkFn = linkFns[i++];
	      // cache childNodes before linking parent, fix #657
	      var childNodes = toArray(node.childNodes);
	      if (nodeLinkFn) {
	        nodeLinkFn(vm, node, host, scope, frag);
	      }
	      if (childrenLinkFn) {
	        childrenLinkFn(vm, childNodes, host, scope, frag);
	      }
	    }
	  };
	}
	
	/**
	 * Check for element directives (custom elements that should
	 * be resovled as terminal directives).
	 *
	 * @param {Element} el
	 * @param {Object} options
	 */
	
	function checkElementDirectives(el, options) {
	  var tag = el.tagName.toLowerCase();
	  if (commonTagRE.test(tag)) {
	    return;
	  }
	  var def = resolveAsset(options, 'elementDirectives', tag);
	  if (def) {
	    return makeTerminalNodeLinkFn(el, tag, '', options, def);
	  }
	}
	
	/**
	 * Check if an element is a component. If yes, return
	 * a component link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|undefined}
	 */
	
	function checkComponent(el, options) {
	  var component = checkComponentAttr(el, options);
	  if (component) {
	    var ref = findRef(el);
	    var descriptor = {
	      name: 'component',
	      ref: ref,
	      expression: component.id,
	      def: internalDirectives.component,
	      modifiers: {
	        literal: !component.dynamic
	      }
	    };
	    var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
	      if (ref) {
	        defineReactive((scope || vm).$refs, ref, null);
	      }
	      vm._bindDir(descriptor, el, host, scope, frag);
	    };
	    componentLinkFn.terminal = true;
	    return componentLinkFn;
	  }
	}
	
	/**
	 * Check an element for terminal directives in fixed order.
	 * If it finds one, return a terminal link function.
	 *
	 * @param {Element} el
	 * @param {Array} attrs
	 * @param {Object} options
	 * @return {Function} terminalLinkFn
	 */
	
	function checkTerminalDirectives(el, attrs, options) {
	  // skip v-pre
	  if (getAttr(el, 'v-pre') !== null) {
	    return skip;
	  }
	  // skip v-else block, but only if following v-if
	  if (el.hasAttribute('v-else')) {
	    var prev = el.previousElementSibling;
	    if (prev && prev.hasAttribute('v-if')) {
	      return skip;
	    }
	  }
	
	  var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
	  for (var i = 0, j = attrs.length; i < j; i++) {
	    attr = attrs[i];
	    modifiers = parseModifiers(attr.name);
	    name = attr.name.replace(modifierRE, '');
	    if (matched = name.match(dirAttrRE)) {
	      def = resolveAsset(options, 'directives', matched[1]);
	      if (def && def.terminal) {
	        if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
	          termDef = def;
	          rawName = attr.name;
	          value = attr.value;
	          dirName = matched[1];
	          arg = matched[2];
	        }
	      }
	    }
	  }
	
	  if (termDef) {
	    return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
	  }
	}
	
	function skip() {}
	skip.terminal = true;
	
	/**
	 * Build a node link function for a terminal directive.
	 * A terminal link function terminates the current
	 * compilation recursion and handles compilation of the
	 * subtree in the directive.
	 *
	 * @param {Element} el
	 * @param {String} dirName
	 * @param {String} value
	 * @param {Object} options
	 * @param {Object} def
	 * @param {String} [rawName]
	 * @param {String} [arg]
	 * @param {Object} [modifiers]
	 * @return {Function} terminalLinkFn
	 */
	
	function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
	  var parsed = parseDirective(value);
	  var descriptor = {
	    name: dirName,
	    arg: arg,
	    expression: parsed.expression,
	    filters: parsed.filters,
	    raw: value,
	    attr: rawName,
	    modifiers: modifiers,
	    def: def
	  };
	  // check ref for v-for and router-view
	  if (dirName === 'for' || dirName === 'router-view') {
	    descriptor.ref = findRef(el);
	  }
	  var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
	    if (descriptor.ref) {
	      defineReactive((scope || vm).$refs, descriptor.ref, null);
	    }
	    vm._bindDir(descriptor, el, host, scope, frag);
	  };
	  fn.terminal = true;
	  return fn;
	}
	
	/**
	 * Compile the directives on an element and return a linker.
	 *
	 * @param {Array|NamedNodeMap} attrs
	 * @param {Object} options
	 * @return {Function}
	 */
	
	function compileDirectives(attrs, options) {
	  var i = attrs.length;
	  var dirs = [];
	  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
	  while (i--) {
	    attr = attrs[i];
	    name = rawName = attr.name;
	    value = rawValue = attr.value;
	    tokens = parseText(value);
	    // reset arg
	    arg = null;
	    // check modifiers
	    modifiers = parseModifiers(name);
	    name = name.replace(modifierRE, '');
	
	    // attribute interpolations
	    if (tokens) {
	      value = tokensToExp(tokens);
	      arg = name;
	      pushDir('bind', directives.bind, tokens);
	      // warn against mixing mustaches with v-bind
	      if (process.env.NODE_ENV !== 'production') {
	        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
	          return attr.name === ':class' || attr.name === 'v-bind:class';
	        })) {
	          warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.');
	        }
	      }
	    } else
	
	      // special attribute: transition
	      if (transitionRE.test(name)) {
	        modifiers.literal = !bindRE.test(name);
	        pushDir('transition', internalDirectives.transition);
	      } else
	
	        // event handlers
	        if (onRE.test(name)) {
	          arg = name.replace(onRE, '');
	          pushDir('on', directives.on);
	        } else
	
	          // attribute bindings
	          if (bindRE.test(name)) {
	            dirName = name.replace(bindRE, '');
	            if (dirName === 'style' || dirName === 'class') {
	              pushDir(dirName, internalDirectives[dirName]);
	            } else {
	              arg = dirName;
	              pushDir('bind', directives.bind);
	            }
	          } else
	
	            // normal directives
	            if (matched = name.match(dirAttrRE)) {
	              dirName = matched[1];
	              arg = matched[2];
	
	              // skip v-else (when used with v-show)
	              if (dirName === 'else') {
	                continue;
	              }
	
	              dirDef = resolveAsset(options, 'directives', dirName);
	
	              if (process.env.NODE_ENV !== 'production') {
	                assertAsset(dirDef, 'directive', dirName);
	              }
	
	              if (dirDef) {
	                pushDir(dirName, dirDef);
	              }
	            }
	  }
	
	  /**
	   * Push a directive.
	   *
	   * @param {String} dirName
	   * @param {Object|Function} def
	   * @param {Array} [interpTokens]
	   */
	
	  function pushDir(dirName, def, interpTokens) {
	    var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
	    var parsed = !hasOneTimeToken && parseDirective(value);
	    dirs.push({
	      name: dirName,
	      attr: rawName,
	      raw: rawValue,
	      def: def,
	      arg: arg,
	      modifiers: modifiers,
	      // conversion from interpolation strings with one-time token
	      // to expression is differed until directive bind time so that we
	      // have access to the actual vm context for one-time bindings.
	      expression: parsed && parsed.expression,
	      filters: parsed && parsed.filters,
	      interp: interpTokens,
	      hasOneTime: hasOneTimeToken
	    });
	  }
	
	  if (dirs.length) {
	    return makeNodeLinkFn(dirs);
	  }
	}
	
	/**
	 * Parse modifiers from directive attribute name.
	 *
	 * @param {String} name
	 * @return {Object}
	 */
	
	function parseModifiers(name) {
	  var res = Object.create(null);
	  var match = name.match(modifierRE);
	  if (match) {
	    var i = match.length;
	    while (i--) {
	      res[match[i].slice(1)] = true;
	    }
	  }
	  return res;
	}
	
	/**
	 * Build a link function for all directives on a single node.
	 *
	 * @param {Array} directives
	 * @return {Function} directivesLinkFn
	 */
	
	function makeNodeLinkFn(directives) {
	  return function nodeLinkFn(vm, el, host, scope, frag) {
	    // reverse apply because it's sorted low to high
	    var i = directives.length;
	    while (i--) {
	      vm._bindDir(directives[i], el, host, scope, frag);
	    }
	  };
	}
	
	/**
	 * Check if an interpolation string contains one-time tokens.
	 *
	 * @param {Array} tokens
	 * @return {Boolean}
	 */
	
	function hasOneTime(tokens) {
	  var i = tokens.length;
	  while (i--) {
	    if (tokens[i].oneTime) return true;
	  }
	}
	
	var specialCharRE = /[^\w\-:\.]/;
	
	/**
	 * Process an element or a DocumentFragment based on a
	 * instance option object. This allows us to transclude
	 * a template node/fragment before the instance is created,
	 * so the processed fragment can then be cloned and reused
	 * in v-for.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */
	
	function transclude(el, options) {
	  // extract container attributes to pass them down
	  // to compiler, because they need to be compiled in
	  // parent scope. we are mutating the options object here
	  // assuming the same object will be used for compile
	  // right after this.
	  if (options) {
	    options._containerAttrs = extractAttrs(el);
	  }
	  // for template tags, what we want is its content as
	  // a documentFragment (for fragment instances)
	  if (isTemplate(el)) {
	    el = parseTemplate(el);
	  }
	  if (options) {
	    if (options._asComponent && !options.template) {
	      options.template = '<slot></slot>';
	    }
	    if (options.template) {
	      options._content = extractContent(el);
	      el = transcludeTemplate(el, options);
	    }
	  }
	  if (isFragment(el)) {
	    // anchors for fragment instance
	    // passing in `persist: true` to avoid them being
	    // discarded by IE during template cloning
	    prepend(createAnchor('v-start', true), el);
	    el.appendChild(createAnchor('v-end', true));
	  }
	  return el;
	}
	
	/**
	 * Process the template option.
	 * If the replace option is true this will swap the $el.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */
	
	function transcludeTemplate(el, options) {
	  var template = options.template;
	  var frag = parseTemplate(template, true);
	  if (frag) {
	    var replacer = frag.firstChild;
	    var tag = replacer.tagName && replacer.tagName.toLowerCase();
	    if (options.replace) {
	      /* istanbul ignore if */
	      if (el === document.body) {
	        process.env.NODE_ENV !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
	      }
	      // there are many cases where the instance must
	      // become a fragment instance: basically anything that
	      // can create more than 1 root nodes.
	      if (
	      // multi-children template
	      frag.childNodes.length > 1 ||
	      // non-element template
	      replacer.nodeType !== 1 ||
	      // single nested component
	      tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
	      // element directive
	      resolveAsset(options, 'elementDirectives', tag) ||
	      // for block
	      replacer.hasAttribute('v-for') ||
	      // if block
	      replacer.hasAttribute('v-if')) {
	        return frag;
	      } else {
	        options._replacerAttrs = extractAttrs(replacer);
	        mergeAttrs(el, replacer);
	        return replacer;
	      }
	    } else {
	      el.appendChild(frag);
	      return el;
	    }
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid template option: ' + template);
	  }
	}
	
	/**
	 * Helper to extract a component container's attributes
	 * into a plain object array.
	 *
	 * @param {Element} el
	 * @return {Array}
	 */
	
	function extractAttrs(el) {
	  if (el.nodeType === 1 && el.hasAttributes()) {
	    return toArray(el.attributes);
	  }
	}
	
	/**
	 * Merge the attributes of two elements, and make sure
	 * the class names are merged properly.
	 *
	 * @param {Element} from
	 * @param {Element} to
	 */
	
	function mergeAttrs(from, to) {
	  var attrs = from.attributes;
	  var i = attrs.length;
	  var name, value;
	  while (i--) {
	    name = attrs[i].name;
	    value = attrs[i].value;
	    if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
	      to.setAttribute(name, value);
	    } else if (name === 'class' && !parseText(value)) {
	      value.trim().split(/\s+/).forEach(function (cls) {
	        addClass(to, cls);
	      });
	    }
	  }
	}
	
	/**
	 * Scan and determine slot content distribution.
	 * We do this during transclusion instead at compile time so that
	 * the distribution is decoupled from the compilation order of
	 * the slots.
	 *
	 * @param {Element|DocumentFragment} template
	 * @param {Element} content
	 * @param {Vue} vm
	 */
	
	function resolveSlots(vm, content) {
	  if (!content) {
	    return;
	  }
	  var contents = vm._slotContents = Object.create(null);
	  var el, name;
	  for (var i = 0, l = content.children.length; i < l; i++) {
	    el = content.children[i];
	    /* eslint-disable no-cond-assign */
	    if (name = el.getAttribute('slot')) {
	      (contents[name] || (contents[name] = [])).push(el);
	    }
	    /* eslint-enable no-cond-assign */
	    if (process.env.NODE_ENV !== 'production' && getBindAttr(el, 'slot')) {
	      warn('The "slot" attribute must be static.');
	    }
	  }
	  for (name in contents) {
	    contents[name] = extractFragment(contents[name], content);
	  }
	  if (content.hasChildNodes()) {
	    contents['default'] = extractFragment(content.childNodes, content);
	  }
	}
	
	/**
	 * Extract qualified content nodes from a node list.
	 *
	 * @param {NodeList} nodes
	 * @return {DocumentFragment}
	 */
	
	function extractFragment(nodes, parent) {
	  var frag = document.createDocumentFragment();
	  nodes = toArray(nodes);
	  for (var i = 0, l = nodes.length; i < l; i++) {
	    var node = nodes[i];
	    if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
	      parent.removeChild(node);
	      node = parseTemplate(node);
	    }
	    frag.appendChild(node);
	  }
	  return frag;
	}
	
	
	
	var compiler = Object.freeze({
		compile: compile,
		compileAndLinkProps: compileAndLinkProps,
		compileRoot: compileRoot,
		transclude: transclude,
		resolveSlots: resolveSlots
	});
	
	function stateMixin (Vue) {
	  /**
	   * Accessor for `$data` property, since setting $data
	   * requires observing the new object and updating
	   * proxied properties.
	   */
	
	  Object.defineProperty(Vue.prototype, '$data', {
	    get: function get() {
	      return this._data;
	    },
	    set: function set(newData) {
	      if (newData !== this._data) {
	        this._setData(newData);
	      }
	    }
	  });
	
	  /**
	   * Setup the scope of an instance, which contains:
	   * - observed data
	   * - computed properties
	   * - user methods
	   * - meta properties
	   */
	
	  Vue.prototype._initState = function () {
	    this._initProps();
	    this._initMeta();
	    this._initMethods();
	    this._initData();
	    this._initComputed();
	  };
	
	  /**
	   * Initialize props.
	   */
	
	  Vue.prototype._initProps = function () {
	    var options = this.$options;
	    var el = options.el;
	    var props = options.props;
	    if (props && !el) {
	      process.env.NODE_ENV !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.');
	    }
	    // make sure to convert string selectors into element now
	    el = options.el = query(el);
	    this._propsUnlinkFn = el && el.nodeType === 1 && props
	    // props must be linked in proper scope if inside v-for
	    ? compileAndLinkProps(this, el, props, this._scope) : null;
	  };
	
	  /**
	   * Initialize the data.
	   */
	
	  Vue.prototype._initData = function () {
	    var dataFn = this.$options.data;
	    var data = this._data = dataFn ? dataFn() : {};
	    if (!isPlainObject(data)) {
	      data = {};
	      process.env.NODE_ENV !== 'production' && warn('data functions should return an object.');
	    }
	    var props = this._props;
	    var runtimeData = this._runtimeData ? typeof this._runtimeData === 'function' ? this._runtimeData() : this._runtimeData : null;
	    // proxy data on instance
	    var keys = Object.keys(data);
	    var i, key;
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      // there are two scenarios where we can proxy a data key:
	      // 1. it's not already defined as a prop
	      // 2. it's provided via a instantiation option AND there are no
	      //    template prop present
	      if (!props || !hasOwn(props, key) || runtimeData && hasOwn(runtimeData, key) && props[key].raw === null) {
	        this._proxy(key);
	      } else if (process.env.NODE_ENV !== 'production') {
	        warn('Data field "' + key + '" is already defined ' + 'as a prop. Use prop default value instead.');
	      }
	    }
	    // observe data
	    observe(data, this);
	  };
	
	  /**
	   * Swap the instance's $data. Called in $data's setter.
	   *
	   * @param {Object} newData
	   */
	
	  Vue.prototype._setData = function (newData) {
	    newData = newData || {};
	    var oldData = this._data;
	    this._data = newData;
	    var keys, key, i;
	    // unproxy keys not present in new data
	    keys = Object.keys(oldData);
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      if (!(key in newData)) {
	        this._unproxy(key);
	      }
	    }
	    // proxy keys not already proxied,
	    // and trigger change for changed values
	    keys = Object.keys(newData);
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      if (!hasOwn(this, key)) {
	        // new property
	        this._proxy(key);
	      }
	    }
	    oldData.__ob__.removeVm(this);
	    observe(newData, this);
	    this._digest();
	  };
	
	  /**
	   * Proxy a property, so that
	   * vm.prop === vm._data.prop
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype._proxy = function (key) {
	    if (!isReserved(key)) {
	      // need to store ref to self here
	      // because these getter/setters might
	      // be called by child scopes via
	      // prototype inheritance.
	      var self = this;
	      Object.defineProperty(self, key, {
	        configurable: true,
	        enumerable: true,
	        get: function proxyGetter() {
	          return self._data[key];
	        },
	        set: function proxySetter(val) {
	          self._data[key] = val;
	        }
	      });
	    }
	  };
	
	  /**
	   * Unproxy a property.
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype._unproxy = function (key) {
	    if (!isReserved(key)) {
	      delete this[key];
	    }
	  };
	
	  /**
	   * Force update on every watcher in scope.
	   */
	
	  Vue.prototype._digest = function () {
	    for (var i = 0, l = this._watchers.length; i < l; i++) {
	      this._watchers[i].update(true); // shallow updates
	    }
	  };
	
	  /**
	   * Setup computed properties. They are essentially
	   * special getter/setters
	   */
	
	  function noop() {}
	  Vue.prototype._initComputed = function () {
	    var computed = this.$options.computed;
	    if (computed) {
	      for (var key in computed) {
	        var userDef = computed[key];
	        var def = {
	          enumerable: true,
	          configurable: true
	        };
	        if (typeof userDef === 'function') {
	          def.get = makeComputedGetter(userDef, this);
	          def.set = noop;
	        } else {
	          def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
	          def.set = userDef.set ? bind(userDef.set, this) : noop;
	        }
	        Object.defineProperty(this, key, def);
	      }
	    }
	  };
	
	  function makeComputedGetter(getter, owner) {
	    var watcher = new Watcher(owner, getter, null, {
	      lazy: true
	    });
	    return function computedGetter() {
	      if (watcher.dirty) {
	        watcher.evaluate();
	      }
	      if (Dep.target) {
	        watcher.depend();
	      }
	      return watcher.value;
	    };
	  }
	
	  /**
	   * Setup instance methods. Methods must be bound to the
	   * instance since they might be passed down as a prop to
	   * child components.
	   */
	
	  Vue.prototype._initMethods = function () {
	    var methods = this.$options.methods;
	    if (methods) {
	      for (var key in methods) {
	        this[key] = bind(methods[key], this);
	      }
	    }
	  };
	
	  /**
	   * Initialize meta information like $index, $key & $value.
	   */
	
	  Vue.prototype._initMeta = function () {
	    var metas = this.$options._meta;
	    if (metas) {
	      for (var key in metas) {
	        defineReactive(this, key, metas[key]);
	      }
	    }
	  };
	}
	
	var eventRE = /^v-on:|^@/;
	
	function eventsMixin (Vue) {
	  /**
	   * Setup the instance's option events & watchers.
	   * If the value is a string, we pull it from the
	   * instance's methods by name.
	   */
	
	  Vue.prototype._initEvents = function () {
	    var options = this.$options;
	    if (options._asComponent) {
	      registerComponentEvents(this, options.el);
	    }
	    registerCallbacks(this, '$on', options.events);
	    registerCallbacks(this, '$watch', options.watch);
	  };
	
	  /**
	   * Register v-on events on a child component
	   *
	   * @param {Vue} vm
	   * @param {Element} el
	   */
	
	  function registerComponentEvents(vm, el) {
	    var attrs = el.attributes;
	    var name, handler;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      name = attrs[i].name;
	      if (eventRE.test(name)) {
	        name = name.replace(eventRE, '');
	        handler = (vm._scope || vm._context).$eval(attrs[i].value, true);
	        if (typeof handler === 'function') {
	          handler._fromParent = true;
	          vm.$on(name.replace(eventRE), handler);
	        } else if (process.env.NODE_ENV !== 'production') {
	          warn('v-on:' + name + '="' + attrs[i].value + '"' + (vm.$options.name ? ' on component <' + vm.$options.name + '>' : '') + ' expects a function value, got ' + handler);
	        }
	      }
	    }
	  }
	
	  /**
	   * Register callbacks for option events and watchers.
	   *
	   * @param {Vue} vm
	   * @param {String} action
	   * @param {Object} hash
	   */
	
	  function registerCallbacks(vm, action, hash) {
	    if (!hash) return;
	    var handlers, key, i, j;
	    for (key in hash) {
	      handlers = hash[key];
	      if (isArray(handlers)) {
	        for (i = 0, j = handlers.length; i < j; i++) {
	          register(vm, action, key, handlers[i]);
	        }
	      } else {
	        register(vm, action, key, handlers);
	      }
	    }
	  }
	
	  /**
	   * Helper to register an event/watch callback.
	   *
	   * @param {Vue} vm
	   * @param {String} action
	   * @param {String} key
	   * @param {Function|String|Object} handler
	   * @param {Object} [options]
	   */
	
	  function register(vm, action, key, handler, options) {
	    var type = typeof handler;
	    if (type === 'function') {
	      vm[action](key, handler, options);
	    } else if (type === 'string') {
	      var methods = vm.$options.methods;
	      var method = methods && methods[handler];
	      if (method) {
	        vm[action](key, method, options);
	      } else {
	        process.env.NODE_ENV !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".');
	      }
	    } else if (handler && type === 'object') {
	      register(vm, action, key, handler.handler, handler);
	    }
	  }
	
	  /**
	   * Setup recursive attached/detached calls
	   */
	
	  Vue.prototype._initDOMHooks = function () {
	    this.$on('hook:attached', onAttached);
	    this.$on('hook:detached', onDetached);
	  };
	
	  /**
	   * Callback to recursively call attached hook on children
	   */
	
	  function onAttached() {
	    if (!this._isAttached) {
	      this._isAttached = true;
	      this.$children.forEach(callAttach);
	    }
	  }
	
	  /**
	   * Iterator to call attached hook
	   *
	   * @param {Vue} child
	   */
	
	  function callAttach(child) {
	    if (!child._isAttached && inDoc(child.$el)) {
	      child._callHook('attached');
	    }
	  }
	
	  /**
	   * Callback to recursively call detached hook on children
	   */
	
	  function onDetached() {
	    if (this._isAttached) {
	      this._isAttached = false;
	      this.$children.forEach(callDetach);
	    }
	  }
	
	  /**
	   * Iterator to call detached hook
	   *
	   * @param {Vue} child
	   */
	
	  function callDetach(child) {
	    if (child._isAttached && !inDoc(child.$el)) {
	      child._callHook('detached');
	    }
	  }
	
	  /**
	   * Trigger all handlers for a hook
	   *
	   * @param {String} hook
	   */
	
	  Vue.prototype._callHook = function (hook) {
	    this.$emit('pre-hook:' + hook);
	    var handlers = this.$options[hook];
	    if (handlers) {
	      for (var i = 0, j = handlers.length; i < j; i++) {
	        handlers[i].call(this);
	      }
	    }
	    this.$emit('hook:' + hook);
	  };
	}
	
	function noop() {}
	
	/**
	 * A directive links a DOM element with a piece of data,
	 * which is the result of evaluating an expression.
	 * It registers a watcher with the expression and calls
	 * the DOM update function when a change is triggered.
	 *
	 * @param {Object} descriptor
	 *                 - {String} name
	 *                 - {Object} def
	 *                 - {String} expression
	 *                 - {Array<Object>} [filters]
	 *                 - {Object} [modifiers]
	 *                 - {Boolean} literal
	 *                 - {String} attr
	 *                 - {String} arg
	 *                 - {String} raw
	 *                 - {String} [ref]
	 *                 - {Array<Object>} [interp]
	 *                 - {Boolean} [hasOneTime]
	 * @param {Vue} vm
	 * @param {Node} el
	 * @param {Vue} [host] - transclusion host component
	 * @param {Object} [scope] - v-for scope
	 * @param {Fragment} [frag] - owner fragment
	 * @constructor
	 */
	function Directive(descriptor, vm, el, host, scope, frag) {
	  this.vm = vm;
	  this.el = el;
	  // copy descriptor properties
	  this.descriptor = descriptor;
	  this.name = descriptor.name;
	  this.expression = descriptor.expression;
	  this.arg = descriptor.arg;
	  this.modifiers = descriptor.modifiers;
	  this.filters = descriptor.filters;
	  this.literal = this.modifiers && this.modifiers.literal;
	  // private
	  this._locked = false;
	  this._bound = false;
	  this._listeners = null;
	  // link context
	  this._host = host;
	  this._scope = scope;
	  this._frag = frag;
	  // store directives on node in dev mode
	  if (process.env.NODE_ENV !== 'production' && this.el) {
	    this.el._vue_directives = this.el._vue_directives || [];
	    this.el._vue_directives.push(this);
	  }
	}
	
	/**
	 * Initialize the directive, mixin definition properties,
	 * setup the watcher, call definition bind() and update()
	 * if present.
	 */
	
	Directive.prototype._bind = function () {
	  var name = this.name;
	  var descriptor = this.descriptor;
	
	  // remove attribute
	  if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
	    var attr = descriptor.attr || 'v-' + name;
	    this.el.removeAttribute(attr);
	  }
	
	  // copy def properties
	  var def = descriptor.def;
	  if (typeof def === 'function') {
	    this.update = def;
	  } else {
	    extend(this, def);
	  }
	
	  // setup directive params
	  this._setupParams();
	
	  // initial bind
	  if (this.bind) {
	    this.bind();
	  }
	  this._bound = true;
	
	  if (this.literal) {
	    this.update && this.update(descriptor.raw);
	  } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
	    // wrapped updater for context
	    var dir = this;
	    if (this.update) {
	      this._update = function (val, oldVal) {
	        if (!dir._locked) {
	          dir.update(val, oldVal);
	        }
	      };
	    } else {
	      this._update = noop;
	    }
	    var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
	    var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
	    var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
	    {
	      filters: this.filters,
	      twoWay: this.twoWay,
	      deep: this.deep,
	      preProcess: preProcess,
	      postProcess: postProcess,
	      scope: this._scope
	    });
	    // v-model with inital inline value need to sync back to
	    // model instead of update to DOM on init. They would
	    // set the afterBind hook to indicate that.
	    if (this.afterBind) {
	      this.afterBind();
	    } else if (this.update) {
	      this.update(watcher.value);
	    }
	  }
	};
	
	/**
	 * Setup all param attributes, e.g. track-by,
	 * transition-mode, etc...
	 */
	
	Directive.prototype._setupParams = function () {
	  if (!this.params) {
	    return;
	  }
	  var params = this.params;
	  // swap the params array with a fresh object.
	  this.params = Object.create(null);
	  var i = params.length;
	  var key, val, mappedKey;
	  while (i--) {
	    key = hyphenate(params[i]);
	    mappedKey = camelize(key);
	    val = getBindAttr(this.el, key);
	    if (val != null) {
	      // dynamic
	      this._setupParamWatcher(mappedKey, val);
	    } else {
	      // static
	      val = getAttr(this.el, key);
	      if (val != null) {
	        this.params[mappedKey] = val === '' ? true : val;
	      }
	    }
	  }
	};
	
	/**
	 * Setup a watcher for a dynamic param.
	 *
	 * @param {String} key
	 * @param {String} expression
	 */
	
	Directive.prototype._setupParamWatcher = function (key, expression) {
	  var self = this;
	  var called = false;
	  var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
	    self.params[key] = val;
	    // since we are in immediate mode,
	    // only call the param change callbacks if this is not the first update.
	    if (called) {
	      var cb = self.paramWatchers && self.paramWatchers[key];
	      if (cb) {
	        cb.call(self, val, oldVal);
	      }
	    } else {
	      called = true;
	    }
	  }, {
	    immediate: true,
	    user: false
	  });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
	};
	
	/**
	 * Check if the directive is a function caller
	 * and if the expression is a callable one. If both true,
	 * we wrap up the expression and use it as the event
	 * handler.
	 *
	 * e.g. on-click="a++"
	 *
	 * @return {Boolean}
	 */
	
	Directive.prototype._checkStatement = function () {
	  var expression = this.expression;
	  if (expression && this.acceptStatement && !isSimplePath(expression)) {
	    var fn = parseExpression(expression).get;
	    var scope = this._scope || this.vm;
	    var handler = function handler(e) {
	      scope.$event = e;
	      fn.call(scope, scope);
	      scope.$event = null;
	    };
	    if (this.filters) {
	      handler = scope._applyFilters(handler, null, this.filters);
	    }
	    this.update(handler);
	    return true;
	  }
	};
	
	/**
	 * Set the corresponding value with the setter.
	 * This should only be used in two-way directives
	 * e.g. v-model.
	 *
	 * @param {*} value
	 * @public
	 */
	
	Directive.prototype.set = function (value) {
	  /* istanbul ignore else */
	  if (this.twoWay) {
	    this._withLock(function () {
	      this._watcher.set(value);
	    });
	  } else if (process.env.NODE_ENV !== 'production') {
	    warn('Directive.set() can only be used inside twoWay' + 'directives.');
	  }
	};
	
	/**
	 * Execute a function while preventing that function from
	 * triggering updates on this directive instance.
	 *
	 * @param {Function} fn
	 */
	
	Directive.prototype._withLock = function (fn) {
	  var self = this;
	  self._locked = true;
	  fn.call(self);
	  nextTick(function () {
	    self._locked = false;
	  });
	};
	
	/**
	 * Convenience method that attaches a DOM event listener
	 * to the directive element and autometically tears it down
	 * during unbind.
	 *
	 * @param {String} event
	 * @param {Function} handler
	 * @param {Boolean} [useCapture]
	 */
	
	Directive.prototype.on = function (event, handler, useCapture) {
	  on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
	};
	
	/**
	 * Teardown the watcher and call unbind.
	 */
	
	Directive.prototype._teardown = function () {
	  if (this._bound) {
	    this._bound = false;
	    if (this.unbind) {
	      this.unbind();
	    }
	    if (this._watcher) {
	      this._watcher.teardown();
	    }
	    var listeners = this._listeners;
	    var i;
	    if (listeners) {
	      i = listeners.length;
	      while (i--) {
	        off(this.el, listeners[i][0], listeners[i][1]);
	      }
	    }
	    var unwatchFns = this._paramUnwatchFns;
	    if (unwatchFns) {
	      i = unwatchFns.length;
	      while (i--) {
	        unwatchFns[i]();
	      }
	    }
	    if (process.env.NODE_ENV !== 'production' && this.el) {
	      this.el._vue_directives.$remove(this);
	    }
	    this.vm = this.el = this._watcher = this._listeners = null;
	  }
	};
	
	function lifecycleMixin (Vue) {
	  /**
	   * Update v-ref for component.
	   *
	   * @param {Boolean} remove
	   */
	
	  Vue.prototype._updateRef = function (remove) {
	    var ref = this.$options._ref;
	    if (ref) {
	      var refs = (this._scope || this._context).$refs;
	      if (remove) {
	        if (refs[ref] === this) {
	          refs[ref] = null;
	        }
	      } else {
	        refs[ref] = this;
	      }
	    }
	  };
	
	  /**
	   * Transclude, compile and link element.
	   *
	   * If a pre-compiled linker is available, that means the
	   * passed in element will be pre-transcluded and compiled
	   * as well - all we need to do is to call the linker.
	   *
	   * Otherwise we need to call transclude/compile/link here.
	   *
	   * @param {Element} el
	   */
	
	  Vue.prototype._compile = function (el) {
	    var options = this.$options;
	
	    // transclude and init element
	    // transclude can potentially replace original
	    // so we need to keep reference; this step also injects
	    // the template and caches the original attributes
	    // on the container node and replacer node.
	    var original = el;
	    el = transclude(el, options);
	    this._initElement(el);
	
	    // handle v-pre on root node (#2026)
	    if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
	      return;
	    }
	
	    // root is always compiled per-instance, because
	    // container attrs and props can be different every time.
	    var contextOptions = this._context && this._context.$options;
	    var rootLinker = compileRoot(el, options, contextOptions);
	
	    // resolve slot distribution
	    resolveSlots(this, options._content);
	
	    // compile and link the rest
	    var contentLinkFn;
	    var ctor = this.constructor;
	    // component compilation can be cached
	    // as long as it's not using inline-template
	    if (options._linkerCachable) {
	      contentLinkFn = ctor.linker;
	      if (!contentLinkFn) {
	        contentLinkFn = ctor.linker = compile(el, options);
	      }
	    }
	
	    // link phase
	    // make sure to link root with prop scope!
	    var rootUnlinkFn = rootLinker(this, el, this._scope);
	    var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);
	
	    // register composite unlink function
	    // to be called during instance destruction
	    this._unlinkFn = function () {
	      rootUnlinkFn();
	      // passing destroying: true to avoid searching and
	      // splicing the directives
	      contentUnlinkFn(true);
	    };
	
	    // finally replace original
	    if (options.replace) {
	      replace(original, el);
	    }
	
	    this._isCompiled = true;
	    this._callHook('compiled');
	  };
	
	  /**
	   * Initialize instance element. Called in the public
	   * $mount() method.
	   *
	   * @param {Element} el
	   */
	
	  Vue.prototype._initElement = function (el) {
	    if (isFragment(el)) {
	      this._isFragment = true;
	      this.$el = this._fragmentStart = el.firstChild;
	      this._fragmentEnd = el.lastChild;
	      // set persisted text anchors to empty
	      if (this._fragmentStart.nodeType === 3) {
	        this._fragmentStart.data = this._fragmentEnd.data = '';
	      }
	      this._fragment = el;
	    } else {
	      this.$el = el;
	    }
	    this.$el.__vue__ = this;
	    this._callHook('beforeCompile');
	  };
	
	  /**
	   * Create and bind a directive to an element.
	   *
	   * @param {Object} descriptor - parsed directive descriptor
	   * @param {Node} node   - target node
	   * @param {Vue} [host] - transclusion host component
	   * @param {Object} [scope] - v-for scope
	   * @param {Fragment} [frag] - owner fragment
	   */
	
	  Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
	    this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
	  };
	
	  /**
	   * Teardown an instance, unobserves the data, unbind all the
	   * directives, turn off all the event listeners, etc.
	   *
	   * @param {Boolean} remove - whether to remove the DOM node.
	   * @param {Boolean} deferCleanup - if true, defer cleanup to
	   *                                 be called later
	   */
	
	  Vue.prototype._destroy = function (remove, deferCleanup) {
	    if (this._isBeingDestroyed) {
	      if (!deferCleanup) {
	        this._cleanup();
	      }
	      return;
	    }
	
	    var destroyReady;
	    var pendingRemoval;
	
	    var self = this;
	    // Cleanup should be called either synchronously or asynchronoysly as
	    // callback of this.$remove(), or if remove and deferCleanup are false.
	    // In any case it should be called after all other removing, unbinding and
	    // turning of is done
	    var cleanupIfPossible = function cleanupIfPossible() {
	      if (destroyReady && !pendingRemoval && !deferCleanup) {
	        self._cleanup();
	      }
	    };
	
	    // remove DOM element
	    if (remove && this.$el) {
	      pendingRemoval = true;
	      this.$remove(function () {
	        pendingRemoval = false;
	        cleanupIfPossible();
	      });
	    }
	
	    this._callHook('beforeDestroy');
	    this._isBeingDestroyed = true;
	    var i;
	    // remove self from parent. only necessary
	    // if parent is not being destroyed as well.
	    var parent = this.$parent;
	    if (parent && !parent._isBeingDestroyed) {
	      parent.$children.$remove(this);
	      // unregister ref (remove: true)
	      this._updateRef(true);
	    }
	    // destroy all children.
	    i = this.$children.length;
	    while (i--) {
	      this.$children[i].$destroy();
	    }
	    // teardown props
	    if (this._propsUnlinkFn) {
	      this._propsUnlinkFn();
	    }
	    // teardown all directives. this also tearsdown all
	    // directive-owned watchers.
	    if (this._unlinkFn) {
	      this._unlinkFn();
	    }
	    i = this._watchers.length;
	    while (i--) {
	      this._watchers[i].teardown();
	    }
	    // remove reference to self on $el
	    if (this.$el) {
	      this.$el.__vue__ = null;
	    }
	
	    destroyReady = true;
	    cleanupIfPossible();
	  };
	
	  /**
	   * Clean up to ensure garbage collection.
	   * This is called after the leave transition if there
	   * is any.
	   */
	
	  Vue.prototype._cleanup = function () {
	    if (this._isDestroyed) {
	      return;
	    }
	    // remove self from owner fragment
	    // do it in cleanup so that we can call $destroy with
	    // defer right when a fragment is about to be removed.
	    if (this._frag) {
	      this._frag.children.$remove(this);
	    }
	    // remove reference from data ob
	    // frozen object may not have observer.
	    if (this._data.__ob__) {
	      this._data.__ob__.removeVm(this);
	    }
	    // Clean up references to private properties and other
	    // instances. preserve reference to _data so that proxy
	    // accessors still work. The only potential side effect
	    // here is that mutating the instance after it's destroyed
	    // may affect the state of other components that are still
	    // observing the same object, but that seems to be a
	    // reasonable responsibility for the user rather than
	    // always throwing an error on them.
	    this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
	    // call the last hook...
	    this._isDestroyed = true;
	    this._callHook('destroyed');
	    // turn off all instance listeners.
	    this.$off();
	  };
	}
	
	function miscMixin (Vue) {
	  /**
	   * Apply a list of filter (descriptors) to a value.
	   * Using plain for loops here because this will be called in
	   * the getter of any watcher with filters so it is very
	   * performance sensitive.
	   *
	   * @param {*} value
	   * @param {*} [oldValue]
	   * @param {Array} filters
	   * @param {Boolean} write
	   * @return {*}
	   */
	
	  Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
	    var filter, fn, args, arg, offset, i, l, j, k;
	    for (i = 0, l = filters.length; i < l; i++) {
	      filter = filters[write ? l - i - 1 : i];
	      fn = resolveAsset(this.$options, 'filters', filter.name);
	      if (process.env.NODE_ENV !== 'production') {
	        assertAsset(fn, 'filter', filter.name);
	      }
	      if (!fn) continue;
	      fn = write ? fn.write : fn.read || fn;
	      if (typeof fn !== 'function') continue;
	      args = write ? [value, oldValue] : [value];
	      offset = write ? 2 : 1;
	      if (filter.args) {
	        for (j = 0, k = filter.args.length; j < k; j++) {
	          arg = filter.args[j];
	          args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
	        }
	      }
	      value = fn.apply(this, args);
	    }
	    return value;
	  };
	
	  /**
	   * Resolve a component, depending on whether the component
	   * is defined normally or using an async factory function.
	   * Resolves synchronously if already resolved, otherwise
	   * resolves asynchronously and caches the resolved
	   * constructor on the factory.
	   *
	   * @param {String|Function} value
	   * @param {Function} cb
	   */
	
	  Vue.prototype._resolveComponent = function (value, cb) {
	    var factory;
	    if (typeof value === 'function') {
	      factory = value;
	    } else {
	      factory = resolveAsset(this.$options, 'components', value);
	      if (process.env.NODE_ENV !== 'production') {
	        assertAsset(factory, 'component', value);
	      }
	    }
	    if (!factory) {
	      return;
	    }
	    // async component factory
	    if (!factory.options) {
	      if (factory.resolved) {
	        // cached
	        cb(factory.resolved);
	      } else if (factory.requested) {
	        // pool callbacks
	        factory.pendingCallbacks.push(cb);
	      } else {
	        factory.requested = true;
	        var cbs = factory.pendingCallbacks = [cb];
	        factory.call(this, function resolve(res) {
	          if (isPlainObject(res)) {
	            res = Vue.extend(res);
	          }
	          // cache resolved
	          factory.resolved = res;
	          // invoke callbacks
	          for (var i = 0, l = cbs.length; i < l; i++) {
	            cbs[i](res);
	          }
	        }, function reject(reason) {
	          process.env.NODE_ENV !== 'production' && warn('Failed to resolve async component' + (typeof value === 'string' ? ': ' + value : '') + '. ' + (reason ? '\nReason: ' + reason : ''));
	        });
	      }
	    } else {
	      // normal component
	      cb(factory);
	    }
	  };
	}
	
	var filterRE$1 = /[^|]\|[^|]/;
	
	function dataAPI (Vue) {
	  /**
	   * Get the value from an expression on this vm.
	   *
	   * @param {String} exp
	   * @param {Boolean} [asStatement]
	   * @return {*}
	   */
	
	  Vue.prototype.$get = function (exp, asStatement) {
	    var res = parseExpression(exp);
	    if (res) {
	      if (asStatement && !isSimplePath(exp)) {
	        var self = this;
	        return function statementHandler() {
	          self.$arguments = toArray(arguments);
	          var result = res.get.call(self, self);
	          self.$arguments = null;
	          return result;
	        };
	      } else {
	        try {
	          return res.get.call(this, this);
	        } catch (e) {}
	      }
	    }
	  };
	
	  /**
	   * Set the value from an expression on this vm.
	   * The expression must be a valid left-hand
	   * expression in an assignment.
	   *
	   * @param {String} exp
	   * @param {*} val
	   */
	
	  Vue.prototype.$set = function (exp, val) {
	    var res = parseExpression(exp, true);
	    if (res && res.set) {
	      res.set.call(this, this, val);
	    }
	  };
	
	  /**
	   * Delete a property on the VM
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype.$delete = function (key) {
	    del(this._data, key);
	  };
	
	  /**
	   * Watch an expression, trigger callback when its
	   * value changes.
	   *
	   * @param {String|Function} expOrFn
	   * @param {Function} cb
	   * @param {Object} [options]
	   *                 - {Boolean} deep
	   *                 - {Boolean} immediate
	   * @return {Function} - unwatchFn
	   */
	
	  Vue.prototype.$watch = function (expOrFn, cb, options) {
	    var vm = this;
	    var parsed;
	    if (typeof expOrFn === 'string') {
	      parsed = parseDirective(expOrFn);
	      expOrFn = parsed.expression;
	    }
	    var watcher = new Watcher(vm, expOrFn, cb, {
	      deep: options && options.deep,
	      sync: options && options.sync,
	      filters: parsed && parsed.filters,
	      user: !options || options.user !== false
	    });
	    if (options && options.immediate) {
	      cb.call(vm, watcher.value);
	    }
	    return function unwatchFn() {
	      watcher.teardown();
	    };
	  };
	
	  /**
	   * Evaluate a text directive, including filters.
	   *
	   * @param {String} text
	   * @param {Boolean} [asStatement]
	   * @return {String}
	   */
	
	  Vue.prototype.$eval = function (text, asStatement) {
	    // check for filters.
	    if (filterRE$1.test(text)) {
	      var dir = parseDirective(text);
	      // the filter regex check might give false positive
	      // for pipes inside strings, so it's possible that
	      // we don't get any filters here
	      var val = this.$get(dir.expression, asStatement);
	      return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
	    } else {
	      // no filter
	      return this.$get(text, asStatement);
	    }
	  };
	
	  /**
	   * Interpolate a piece of template text.
	   *
	   * @param {String} text
	   * @return {String}
	   */
	
	  Vue.prototype.$interpolate = function (text) {
	    var tokens = parseText(text);
	    var vm = this;
	    if (tokens) {
	      if (tokens.length === 1) {
	        return vm.$eval(tokens[0].value) + '';
	      } else {
	        return tokens.map(function (token) {
	          return token.tag ? vm.$eval(token.value) : token.value;
	        }).join('');
	      }
	    } else {
	      return text;
	    }
	  };
	
	  /**
	   * Log instance data as a plain JS object
	   * so that it is easier to inspect in console.
	   * This method assumes console is available.
	   *
	   * @param {String} [path]
	   */
	
	  Vue.prototype.$log = function (path) {
	    var data = path ? getPath(this._data, path) : this._data;
	    if (data) {
	      data = clean(data);
	    }
	    // include computed fields
	    if (!path) {
	      var key;
	      for (key in this.$options.computed) {
	        data[key] = clean(this[key]);
	      }
	      if (this._props) {
	        for (key in this._props) {
	          data[key] = clean(this[key]);
	        }
	      }
	    }
	    console.log(data);
	  };
	
	  /**
	   * "clean" a getter/setter converted object into a plain
	   * object copy.
	   *
	   * @param {Object} - obj
	   * @return {Object}
	   */
	
	  function clean(obj) {
	    return JSON.parse(JSON.stringify(obj));
	  }
	}
	
	function domAPI (Vue) {
	  /**
	   * Convenience on-instance nextTick. The callback is
	   * auto-bound to the instance, and this avoids component
	   * modules having to rely on the global Vue.
	   *
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$nextTick = function (fn) {
	    nextTick(fn, this);
	  };
	
	  /**
	   * Append instance to target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$appendTo = function (target, cb, withTransition) {
	    return insert(this, target, cb, withTransition, append, appendWithTransition);
	  };
	
	  /**
	   * Prepend instance to target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$prependTo = function (target, cb, withTransition) {
	    target = query(target);
	    if (target.hasChildNodes()) {
	      this.$before(target.firstChild, cb, withTransition);
	    } else {
	      this.$appendTo(target, cb, withTransition);
	    }
	    return this;
	  };
	
	  /**
	   * Insert instance before target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$before = function (target, cb, withTransition) {
	    return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
	  };
	
	  /**
	   * Insert instance after target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$after = function (target, cb, withTransition) {
	    target = query(target);
	    if (target.nextSibling) {
	      this.$before(target.nextSibling, cb, withTransition);
	    } else {
	      this.$appendTo(target.parentNode, cb, withTransition);
	    }
	    return this;
	  };
	
	  /**
	   * Remove instance from DOM
	   *
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$remove = function (cb, withTransition) {
	    if (!this.$el.parentNode) {
	      return cb && cb();
	    }
	    var inDocument = this._isAttached && inDoc(this.$el);
	    // if we are not in document, no need to check
	    // for transitions
	    if (!inDocument) withTransition = false;
	    var self = this;
	    var realCb = function realCb() {
	      if (inDocument) self._callHook('detached');
	      if (cb) cb();
	    };
	    if (this._isFragment) {
	      removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
	    } else {
	      var op = withTransition === false ? removeWithCb : removeWithTransition;
	      op(this.$el, this, realCb);
	    }
	    return this;
	  };
	
	  /**
	   * Shared DOM insertion function.
	   *
	   * @param {Vue} vm
	   * @param {Element} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition]
	   * @param {Function} op1 - op for non-transition insert
	   * @param {Function} op2 - op for transition insert
	   * @return vm
	   */
	
	  function insert(vm, target, cb, withTransition, op1, op2) {
	    target = query(target);
	    var targetIsDetached = !inDoc(target);
	    var op = withTransition === false || targetIsDetached ? op1 : op2;
	    var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
	    if (vm._isFragment) {
	      mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
	        op(node, target, vm);
	      });
	      cb && cb();
	    } else {
	      op(vm.$el, target, vm, cb);
	    }
	    if (shouldCallHook) {
	      vm._callHook('attached');
	    }
	    return vm;
	  }
	
	  /**
	   * Check for selectors
	   *
	   * @param {String|Element} el
	   */
	
	  function query(el) {
	    return typeof el === 'string' ? document.querySelector(el) : el;
	  }
	
	  /**
	   * Append operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Node} target
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function append(el, target, vm, cb) {
	    target.appendChild(el);
	    if (cb) cb();
	  }
	
	  /**
	   * InsertBefore operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Node} target
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function beforeWithCb(el, target, vm, cb) {
	    before(el, target);
	    if (cb) cb();
	  }
	
	  /**
	   * Remove operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function removeWithCb(el, vm, cb) {
	    remove(el);
	    if (cb) cb();
	  }
	}
	
	function eventsAPI (Vue) {
	  /**
	   * Listen on the given `event` with `fn`.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$on = function (event, fn) {
	    (this._events[event] || (this._events[event] = [])).push(fn);
	    modifyListenerCount(this, event, 1);
	    return this;
	  };
	
	  /**
	   * Adds an `event` listener that will be invoked a single
	   * time then automatically removed.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$once = function (event, fn) {
	    var self = this;
	    function on() {
	      self.$off(event, on);
	      fn.apply(this, arguments);
	    }
	    on.fn = fn;
	    this.$on(event, on);
	    return this;
	  };
	
	  /**
	   * Remove the given callback for `event` or all
	   * registered callbacks.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$off = function (event, fn) {
	    var cbs;
	    // all
	    if (!arguments.length) {
	      if (this.$parent) {
	        for (event in this._events) {
	          cbs = this._events[event];
	          if (cbs) {
	            modifyListenerCount(this, event, -cbs.length);
	          }
	        }
	      }
	      this._events = {};
	      return this;
	    }
	    // specific event
	    cbs = this._events[event];
	    if (!cbs) {
	      return this;
	    }
	    if (arguments.length === 1) {
	      modifyListenerCount(this, event, -cbs.length);
	      this._events[event] = null;
	      return this;
	    }
	    // specific handler
	    var cb;
	    var i = cbs.length;
	    while (i--) {
	      cb = cbs[i];
	      if (cb === fn || cb.fn === fn) {
	        modifyListenerCount(this, event, -1);
	        cbs.splice(i, 1);
	        break;
	      }
	    }
	    return this;
	  };
	
	  /**
	   * Trigger an event on self.
	   *
	   * @param {String|Object} event
	   * @return {Boolean} shouldPropagate
	   */
	
	  Vue.prototype.$emit = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    var cbs = this._events[event];
	    var shouldPropagate = isSource || !cbs;
	    if (cbs) {
	      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
	      // this is a somewhat hacky solution to the question raised
	      // in #2102: for an inline component listener like <comp @test="doThis">,
	      // the propagation handling is somewhat broken. Therefore we
	      // need to treat these inline callbacks differently.
	      var hasParentCbs = isSource && cbs.some(function (cb) {
	        return cb._fromParent;
	      });
	      if (hasParentCbs) {
	        shouldPropagate = false;
	      }
	      var args = toArray(arguments, 1);
	      for (var i = 0, l = cbs.length; i < l; i++) {
	        var cb = cbs[i];
	        var res = cb.apply(this, args);
	        if (res === true && (!hasParentCbs || cb._fromParent)) {
	          shouldPropagate = true;
	        }
	      }
	    }
	    return shouldPropagate;
	  };
	
	  /**
	   * Recursively broadcast an event to all children instances.
	   *
	   * @param {String|Object} event
	   * @param {...*} additional arguments
	   */
	
	  Vue.prototype.$broadcast = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    // if no child has registered for this event,
	    // then there's no need to broadcast.
	    if (!this._eventsCount[event]) return;
	    var children = this.$children;
	    var args = toArray(arguments);
	    if (isSource) {
	      // use object event to indicate non-source emit
	      // on children
	      args[0] = { name: event, source: this };
	    }
	    for (var i = 0, l = children.length; i < l; i++) {
	      var child = children[i];
	      var shouldPropagate = child.$emit.apply(child, args);
	      if (shouldPropagate) {
	        child.$broadcast.apply(child, args);
	      }
	    }
	    return this;
	  };
	
	  /**
	   * Recursively propagate an event up the parent chain.
	   *
	   * @param {String} event
	   * @param {...*} additional arguments
	   */
	
	  Vue.prototype.$dispatch = function (event) {
	    var shouldPropagate = this.$emit.apply(this, arguments);
	    if (!shouldPropagate) return;
	    var parent = this.$parent;
	    var args = toArray(arguments);
	    // use object event to indicate non-source emit
	    // on parents
	    args[0] = { name: event, source: this };
	    while (parent) {
	      shouldPropagate = parent.$emit.apply(parent, args);
	      parent = shouldPropagate ? parent.$parent : null;
	    }
	    return this;
	  };
	
	  /**
	   * Modify the listener counts on all parents.
	   * This bookkeeping allows $broadcast to return early when
	   * no child has listened to a certain event.
	   *
	   * @param {Vue} vm
	   * @param {String} event
	   * @param {Number} count
	   */
	
	  var hookRE = /^hook:/;
	  function modifyListenerCount(vm, event, count) {
	    var parent = vm.$parent;
	    // hooks do not get broadcasted so no need
	    // to do bookkeeping for them
	    if (!parent || !count || hookRE.test(event)) return;
	    while (parent) {
	      parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
	      parent = parent.$parent;
	    }
	  }
	}
	
	function lifecycleAPI (Vue) {
	  /**
	   * Set instance target element and kick off the compilation
	   * process. The passed in `el` can be a selector string, an
	   * existing Element, or a DocumentFragment (for block
	   * instances).
	   *
	   * @param {Element|DocumentFragment|string} el
	   * @public
	   */
	
	  Vue.prototype.$mount = function (el) {
	    if (this._isCompiled) {
	      process.env.NODE_ENV !== 'production' && warn('$mount() should be called only once.');
	      return;
	    }
	    el = query(el);
	    if (!el) {
	      el = document.createElement('div');
	    }
	    this._compile(el);
	    this._initDOMHooks();
	    if (inDoc(this.$el)) {
	      this._callHook('attached');
	      ready.call(this);
	    } else {
	      this.$once('hook:attached', ready);
	    }
	    return this;
	  };
	
	  /**
	   * Mark an instance as ready.
	   */
	
	  function ready() {
	    this._isAttached = true;
	    this._isReady = true;
	    this._callHook('ready');
	  }
	
	  /**
	   * Teardown the instance, simply delegate to the internal
	   * _destroy.
	   *
	   * @param {Boolean} remove
	   * @param {Boolean} deferCleanup
	   */
	
	  Vue.prototype.$destroy = function (remove, deferCleanup) {
	    this._destroy(remove, deferCleanup);
	  };
	
	  /**
	   * Partially compile a piece of DOM and return a
	   * decompile function.
	   *
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host]
	   * @param {Object} [scope]
	   * @param {Fragment} [frag]
	   * @return {Function}
	   */
	
	  Vue.prototype.$compile = function (el, host, scope, frag) {
	    return compile(el, this.$options, true)(this, el, host, scope, frag);
	  };
	}
	
	/**
	 * The exposed Vue constructor.
	 *
	 * API conventions:
	 * - public API methods/properties are prefixed with `$`
	 * - internal methods/properties are prefixed with `_`
	 * - non-prefixed properties are assumed to be proxied user
	 *   data.
	 *
	 * @constructor
	 * @param {Object} [options]
	 * @public
	 */
	
	function Vue(options) {
	  this._init(options);
	}
	
	// install internals
	initMixin(Vue);
	stateMixin(Vue);
	eventsMixin(Vue);
	lifecycleMixin(Vue);
	miscMixin(Vue);
	
	// install instance APIs
	dataAPI(Vue);
	domAPI(Vue);
	eventsAPI(Vue);
	lifecycleAPI(Vue);
	
	var slot = {
	
	  priority: SLOT,
	  params: ['name'],
	
	  bind: function bind() {
	    // this was resolved during component transclusion
	    var name = this.params.name || 'default';
	    var content = this.vm._slotContents && this.vm._slotContents[name];
	    if (!content || !content.hasChildNodes()) {
	      this.fallback();
	    } else {
	      this.compile(content.cloneNode(true), this.vm._context, this.vm);
	    }
	  },
	
	  compile: function compile(content, context, host) {
	    if (content && context) {
	      if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
	        // if the inserted slot has v-if
	        // inject fallback content as the v-else
	        var elseBlock = document.createElement('template');
	        elseBlock.setAttribute('v-else', '');
	        elseBlock.innerHTML = this.el.innerHTML;
	        // the else block should be compiled in child scope
	        elseBlock._context = this.vm;
	        content.appendChild(elseBlock);
	      }
	      var scope = host ? host._scope : this._scope;
	      this.unlink = context.$compile(content, host, scope, this._frag);
	    }
	    if (content) {
	      replace(this.el, content);
	    } else {
	      remove(this.el);
	    }
	  },
	
	  fallback: function fallback() {
	    this.compile(extractContent(this.el, true), this.vm);
	  },
	
	  unbind: function unbind() {
	    if (this.unlink) {
	      this.unlink();
	    }
	  }
	};
	
	var partial = {
	
	  priority: PARTIAL,
	
	  params: ['name'],
	
	  // watch changes to name for dynamic partials
	  paramWatchers: {
	    name: function name(value) {
	      vIf.remove.call(this);
	      if (value) {
	        this.insert(value);
	      }
	    }
	  },
	
	  bind: function bind() {
	    this.anchor = createAnchor('v-partial');
	    replace(this.el, this.anchor);
	    this.insert(this.params.name);
	  },
	
	  insert: function insert(id) {
	    var partial = resolveAsset(this.vm.$options, 'partials', id);
	    if (process.env.NODE_ENV !== 'production') {
	      assertAsset(partial, 'partial', id);
	    }
	    if (partial) {
	      this.factory = new FragmentFactory(this.vm, partial);
	      vIf.insert.call(this);
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	  }
	};
	
	var elementDirectives = {
	  slot: slot,
	  partial: partial
	};
	
	var convertArray = vFor._postProcess;
	
	/**
	 * Limit filter for arrays
	 *
	 * @param {Number} n
	 * @param {Number} offset (Decimal expected)
	 */
	
	function limitBy(arr, n, offset) {
	  offset = offset ? parseInt(offset, 10) : 0;
	  n = toNumber(n);
	  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
	}
	
	/**
	 * Filter filter for arrays
	 *
	 * @param {String} search
	 * @param {String} [delimiter]
	 * @param {String} ...dataKeys
	 */
	
	function filterBy(arr, search, delimiter) {
	  arr = convertArray(arr);
	  if (search == null) {
	    return arr;
	  }
	  if (typeof search === 'function') {
	    return arr.filter(search);
	  }
	  // cast to lowercase string
	  search = ('' + search).toLowerCase();
	  // allow optional `in` delimiter
	  // because why not
	  var n = delimiter === 'in' ? 3 : 2;
	  // extract and flatten keys
	  var keys = toArray(arguments, n).reduce(function (prev, cur) {
	    return prev.concat(cur);
	  }, []);
	  var res = [];
	  var item, key, val, j;
	  for (var i = 0, l = arr.length; i < l; i++) {
	    item = arr[i];
	    val = item && item.$value || item;
	    j = keys.length;
	    if (j) {
	      while (j--) {
	        key = keys[j];
	        if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
	          res.push(item);
	          break;
	        }
	      }
	    } else if (contains(item, search)) {
	      res.push(item);
	    }
	  }
	  return res;
	}
	
	/**
	 * Filter filter for arrays
	 *
	 * @param {String} sortKey
	 * @param {String} reverse
	 */
	
	function orderBy(arr, sortKey, reverse) {
	  arr = convertArray(arr);
	  if (!sortKey) {
	    return arr;
	  }
	  var order = reverse && reverse < 0 ? -1 : 1;
	  // sort on a copy to avoid mutating original array
	  return arr.slice().sort(function (a, b) {
	    if (sortKey !== '$key') {
	      if (isObject(a) && '$value' in a) a = a.$value;
	      if (isObject(b) && '$value' in b) b = b.$value;
	    }
	    a = isObject(a) ? getPath(a, sortKey) : a;
	    b = isObject(b) ? getPath(b, sortKey) : b;
	    return a === b ? 0 : a > b ? order : -order;
	  });
	}
	
	/**
	 * String contain helper
	 *
	 * @param {*} val
	 * @param {String} search
	 */
	
	function contains(val, search) {
	  var i;
	  if (isPlainObject(val)) {
	    var keys = Object.keys(val);
	    i = keys.length;
	    while (i--) {
	      if (contains(val[keys[i]], search)) {
	        return true;
	      }
	    }
	  } else if (isArray(val)) {
	    i = val.length;
	    while (i--) {
	      if (contains(val[i], search)) {
	        return true;
	      }
	    }
	  } else if (val != null) {
	    return val.toString().toLowerCase().indexOf(search) > -1;
	  }
	}
	
	var digitsRE = /(\d{3})(?=\d)/g;
	
	// asset collections must be a plain object.
	var filters = {
	
	  orderBy: orderBy,
	  filterBy: filterBy,
	  limitBy: limitBy,
	
	  /**
	   * Stringify value.
	   *
	   * @param {Number} indent
	   */
	
	  json: {
	    read: function read(value, indent) {
	      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
	    },
	    write: function write(value) {
	      try {
	        return JSON.parse(value);
	      } catch (e) {
	        return value;
	      }
	    }
	  },
	
	  /**
	   * 'abc' => 'Abc'
	   */
	
	  capitalize: function capitalize(value) {
	    if (!value && value !== 0) return '';
	    value = value.toString();
	    return value.charAt(0).toUpperCase() + value.slice(1);
	  },
	
	  /**
	   * 'abc' => 'ABC'
	   */
	
	  uppercase: function uppercase(value) {
	    return value || value === 0 ? value.toString().toUpperCase() : '';
	  },
	
	  /**
	   * 'AbC' => 'abc'
	   */
	
	  lowercase: function lowercase(value) {
	    return value || value === 0 ? value.toString().toLowerCase() : '';
	  },
	
	  /**
	   * 12345 => $12,345.00
	   *
	   * @param {String} sign
	   */
	
	  currency: function currency(value, _currency) {
	    value = parseFloat(value);
	    if (!isFinite(value) || !value && value !== 0) return '';
	    _currency = _currency != null ? _currency : '$';
	    var stringified = Math.abs(value).toFixed(2);
	    var _int = stringified.slice(0, -3);
	    var i = _int.length % 3;
	    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
	    var _float = stringified.slice(-3);
	    var sign = value < 0 ? '-' : '';
	    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
	  },
	
	  /**
	   * 'item' => 'items'
	   *
	   * @params
	   *  an array of strings corresponding to
	   *  the single, double, triple ... forms of the word to
	   *  be pluralized. When the number to be pluralized
	   *  exceeds the length of the args, it will use the last
	   *  entry in the array.
	   *
	   *  e.g. ['single', 'double', 'triple', 'multiple']
	   */
	
	  pluralize: function pluralize(value) {
	    var args = toArray(arguments, 1);
	    return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
	  },
	
	  /**
	   * Debounce a handler function.
	   *
	   * @param {Function} handler
	   * @param {Number} delay = 300
	   * @return {Function}
	   */
	
	  debounce: function debounce(handler, delay) {
	    if (!handler) return;
	    if (!delay) {
	      delay = 300;
	    }
	    return _debounce(handler, delay);
	  }
	};
	
	function installGlobalAPI (Vue) {
	  /**
	   * Vue and every constructor that extends Vue has an
	   * associated options object, which can be accessed during
	   * compilation steps as `this.constructor.options`.
	   *
	   * These can be seen as the default options of every
	   * Vue instance.
	   */
	
	  Vue.options = {
	    directives: directives,
	    elementDirectives: elementDirectives,
	    filters: filters,
	    transitions: {},
	    components: {},
	    partials: {},
	    replace: true
	  };
	
	  /**
	   * Expose useful internals
	   */
	
	  Vue.util = util;
	  Vue.config = config;
	  Vue.set = set;
	  Vue['delete'] = del;
	  Vue.nextTick = nextTick;
	
	  /**
	   * The following are exposed for advanced usage / plugins
	   */
	
	  Vue.compiler = compiler;
	  Vue.FragmentFactory = FragmentFactory;
	  Vue.internalDirectives = internalDirectives;
	  Vue.parsers = {
	    path: path,
	    text: text,
	    template: template,
	    directive: directive,
	    expression: expression
	  };
	
	  /**
	   * Each instance constructor, including Vue, has a unique
	   * cid. This enables us to create wrapped "child
	   * constructors" for prototypal inheritance and cache them.
	   */
	
	  Vue.cid = 0;
	  var cid = 1;
	
	  /**
	   * Class inheritance
	   *
	   * @param {Object} extendOptions
	   */
	
	  Vue.extend = function (extendOptions) {
	    extendOptions = extendOptions || {};
	    var Super = this;
	    var isFirstExtend = Super.cid === 0;
	    if (isFirstExtend && extendOptions._Ctor) {
	      return extendOptions._Ctor;
	    }
	    var name = extendOptions.name || Super.options.name;
	    if (process.env.NODE_ENV !== 'production') {
	      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
	        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
	        name = null;
	      }
	    }
	    var Sub = createClass(name || 'VueComponent');
	    Sub.prototype = Object.create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.cid = cid++;
	    Sub.options = mergeOptions(Super.options, extendOptions);
	    Sub['super'] = Super;
	    // allow further extension
	    Sub.extend = Super.extend;
	    // create asset registers, so extended classes
	    // can have their private assets too.
	    config._assetTypes.forEach(function (type) {
	      Sub[type] = Super[type];
	    });
	    // enable recursive self-lookup
	    if (name) {
	      Sub.options.components[name] = Sub;
	    }
	    // cache constructor
	    if (isFirstExtend) {
	      extendOptions._Ctor = Sub;
	    }
	    return Sub;
	  };
	
	  /**
	   * A function that returns a sub-class constructor with the
	   * given name. This gives us much nicer output when
	   * logging instances in the console.
	   *
	   * @param {String} name
	   * @return {Function}
	   */
	
	  function createClass(name) {
	    /* eslint-disable no-new-func */
	    return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
	    /* eslint-enable no-new-func */
	  }
	
	  /**
	   * Plugin system
	   *
	   * @param {Object} plugin
	   */
	
	  Vue.use = function (plugin) {
	    /* istanbul ignore if */
	    if (plugin.installed) {
	      return;
	    }
	    // additional parameters
	    var args = toArray(arguments, 1);
	    args.unshift(this);
	    if (typeof plugin.install === 'function') {
	      plugin.install.apply(plugin, args);
	    } else {
	      plugin.apply(null, args);
	    }
	    plugin.installed = true;
	    return this;
	  };
	
	  /**
	   * Apply a global mixin by merging it into the default
	   * options.
	   */
	
	  Vue.mixin = function (mixin) {
	    Vue.options = mergeOptions(Vue.options, mixin);
	  };
	
	  /**
	   * Create asset registration methods with the following
	   * signature:
	   *
	   * @param {String} id
	   * @param {*} definition
	   */
	
	  config._assetTypes.forEach(function (type) {
	    Vue[type] = function (id, definition) {
	      if (!definition) {
	        return this.options[type + 's'][id];
	      } else {
	        /* istanbul ignore if */
	        if (process.env.NODE_ENV !== 'production') {
	          if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
	            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
	          }
	        }
	        if (type === 'component' && isPlainObject(definition)) {
	          definition.name = id;
	          definition = Vue.extend(definition);
	        }
	        this.options[type + 's'][id] = definition;
	        return definition;
	      }
	    };
	  });
	
	  // expose internal transition API
	  extend(Vue.transition, transition);
	}
	
	installGlobalAPI(Vue);
	
	Vue.version = '1.0.20';
	
	// devtools global hook
	/* istanbul ignore next */
	if (config.devtools) {
	  if (devtools) {
	    devtools.emit('init', Vue);
	  } else if (process.env.NODE_ENV !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
	    console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
	  }
	}
	
	module.exports = Vue;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(22), __webpack_require__(57), __webpack_require__(2)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue, $) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	Vue.use(__webpack_require__(59));
	
	var state = window.state;
	
	var GalleryManager = function (_Vue) {
		_inherits(GalleryManager, _Vue);
	
		function GalleryManager() {
			_classCallCheck(this, GalleryManager);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(GalleryManager).call(this, {
				el: '.gallery',
				data: {
					items: [],
					busy: false,
					next: '/api/gallery.php'
				},
				methods: {
					loadMore: function loadMore() {
						var _this2 = this;
	
						this.busy = true;
	
						$.getJSON(this.next, function (res) {
	
							_this2.next = res.next;
	
							res.items.forEach(function (item) {
								_this2.items.push(item);
							});
	
							setTimeout(function () {
								_this2.busy = false;
							}, 100);
						});
					},
					loadMap: function loadMap(e, item) {
						state.loadMap(item);
					}
				}
			}));
		}
	
		return GalleryManager;
	}(Vue);
	
	exports.default = GalleryManager;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57), __webpack_require__(2)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue) {(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.infiniteScroll = global.infiniteScroll || {})));
	}(this, function (exports) { 'use strict';
	
	  var throttle = function throttle(fn, delay) {
	    var now, lastExec, timer, context, args; //eslint-disable-line
	
	    var execute = function execute() {
	      fn.apply(context, args);
	      lastExec = now;
	    };
	
	    return function () {
	      context = this;
	      args = arguments;
	
	      now = Date.now();
	
	      if (timer) {
	        clearTimeout(timer);
	        timer = null;
	      }
	
	      if (lastExec) {
	        var diff = delay - (now - lastExec);
	        if (diff < 0) {
	          execute();
	        } else {
	          timer = setTimeout(function () {
	            execute();
	          }, diff);
	        }
	      } else {
	        execute();
	      }
	    };
	  };
	
	  var getScrollTop = function getScrollTop(element) {
	    if (element === window) {
	      return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
	    }
	
	    return element.scrollTop;
	  };
	
	  var getComputedStyle = document.defaultView.getComputedStyle;
	
	  var getScrollEventTarget = function getScrollEventTarget(element) {
	    var currentNode = element;
	    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.nodeType === 1) {
	      var overflowY = getComputedStyle(currentNode).overflowY;
	      if (overflowY === 'scroll' || overflowY === 'auto') {
	        return currentNode;
	      }
	      currentNode = currentNode.parentNode;
	    }
	    return window;
	  };
	
	  var getVisibleHeight = function getVisibleHeight(element) {
	    if (element === window) {
	      return document.documentElement.clientHeight;
	    }
	
	    return element.clientHeight;
	  };
	
	  var getElementTop = function getElementTop(element) {
	    if (element === window) {
	      return getScrollTop(window);
	    }
	    return element.getBoundingClientRect().top + getScrollTop(window);
	  };
	
	  var isAttached = function isAttached(element) {
	    var currentNode = element.parentNode;
	    while (currentNode) {
	      if (currentNode.tagName === 'HTML') {
	        return true;
	      }
	      if (currentNode.nodeType === 11) {
	        return false;
	      }
	      currentNode = currentNode.parentNode;
	    }
	    return false;
	  };
	
	  var infiniteScroll = {
	    doBind: function doBind() {
	      if (this.binded) return; // eslint-disable-line
	      this.binded = true;
	
	      var directive = this;
	      var element = directive.el;
	
	      directive.scrollEventTarget = getScrollEventTarget(element);
	      directive.scrollListener = throttle(directive.doCheck.bind(directive), 200);
	      directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);
	
	      var disabledExpr = element.getAttribute('infinite-scroll-disabled');
	      var disabled = false;
	
	      if (disabledExpr) {
	        this.vm.$watch(disabledExpr, function (value) {
	          directive.disabled = value;
	          if (!value && directive.immediateCheck) {
	            directive.doCheck();
	          }
	        });
	        disabled = Boolean(directive.vm.$get(disabledExpr));
	      }
	      directive.disabled = disabled;
	
	      var distanceExpr = element.getAttribute('infinite-scroll-distance');
	      var distance = 0;
	      if (distanceExpr) {
	        distance = Number(directive.vm.$get(distanceExpr));
	        if (isNaN(distance)) {
	          distance = 0;
	        }
	      }
	      directive.distance = distance;
	
	      var immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check');
	      var immediateCheck = true;
	      if (immediateCheckExpr) {
	        immediateCheck = Boolean(directive.vm.$get(immediateCheckExpr));
	      }
	      directive.immediateCheck = immediateCheck;
	
	      if (immediateCheck) {
	        directive.doCheck();
	      }
	
	      var eventName = element.getAttribute('infinite-scroll-listen-for-event');
	      if (eventName) {
	        directive.vm.$on(eventName, function () {
	          directive.doCheck();
	        });
	      }
	    },
	
	    doCheck: function doCheck(force) {
	      var scrollEventTarget = this.scrollEventTarget;
	      var element = this.el;
	      var distance = this.distance;
	
	      if (force !== true && this.disabled) return; //eslint-disable-line
	      var viewportScrollTop = getScrollTop(scrollEventTarget);
	      var viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);
	
	      var shouldTrigger = false;
	
	      if (scrollEventTarget === element) {
	        shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
	      } else {
	        var elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop;
	
	        shouldTrigger = viewportBottom + distance >= elementBottom;
	      }
	
	      if (shouldTrigger && this.expression) {
	        this.vm.$get(this.expression);
	      }
	    },
	
	    bind: function bind() {
	      var directive = this;
	      var element = this.el;
	
	      directive.vm.$on('hook:ready', function () {
	        if (isAttached(element)) {
	          directive.doBind();
	        }
	      });
	
	      this.bindTryCount = 0;
	
	      var tryBind = function tryBind() {
	        if (directive.bindTryCount > 10) return; //eslint-disable-line
	        directive.bindTryCount++;
	        if (isAttached(element)) {
	          directive.doBind();
	        } else {
	          setTimeout(tryBind, 50);
	        }
	      };
	
	      tryBind();
	    },
	
	    unbind: function unbind() {
	      this.scrollEventTarget.removeEventListener('scroll', this.scrollListener);
	    }
	  };
	
	  if (window.Vue) {
	    window.infiniteScroll = infiniteScroll;
	    Vue.use(install);
	  }
	
	  function install(Vue) {
	    Vue.directive('infiniteScroll', infiniteScroll);
	  }
	
	  exports.install = install;
	  exports.infiniteScroll = infiniteScroll;
	
	}));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, THREE) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(61);
	
	__webpack_require__(62);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _basePass = __webpack_require__(63);
	
	var _basePass2 = _interopRequireDefault(_basePass);
	
	var _pingpongRenderTarget = __webpack_require__(65);
	
	var _pingpongRenderTarget2 = _interopRequireDefault(_pingpongRenderTarget);
	
	var _caRenderTarget = __webpack_require__(66);
	
	var _caRenderTarget2 = _interopRequireDefault(_caRenderTarget);
	
	var _brush = __webpack_require__(68);
	
	var _brush2 = _interopRequireDefault(_brush);
	
	var _cursor = __webpack_require__(69);
	
	var _cursor2 = _interopRequireDefault(_cursor);
	
	var _share = __webpack_require__(73);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _base64Util = __webpack_require__(74);
	
	var _base64Util2 = _interopRequireDefault(_base64Util);
	
	var _mobile = __webpack_require__(70);
	
	var _mobile2 = _interopRequireDefault(_mobile);
	
	var _systems = __webpack_require__(3);
	
	var _systems2 = _interopRequireDefault(_systems);
	
	var _help = __webpack_require__(75);
	
	var _help2 = _interopRequireDefault(_help);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var renderer = window.renderer;
	var state = window.state;
	var router = window.router;
	
	var reKeyNumerical = /[1-9]/;
	var isKeyNumerical = function isKeyNumerical(key) {
		return reKeyNumerical.exec(key) != null;
	};
	
	var Canvas = function () {
		function Canvas() {
			var _this = this;
	
			_classCallCheck(this, Canvas);
	
			this.$canvasWrapper = $('.canvas');
			this.$canvas = $('#canvas');
	
			this.clock = new THREE.Clock(true);
	
			this.cursor = new _cursor2.default(this.$canvasWrapper);
			this.$brush = new _brush2.default();
			this.pingpong = new _pingpongRenderTarget2.default();
	
			this.share = new _share2.default();
	
			this.$help = new _help2.default();
	
			this.renderPass = new _basePass2.default({
				fragmentShader: __webpack_require__(67),
				uniforms: {
					buffer: { type: 't', value: null }
				}
			});
	
			$('.canvas__paused').on({
				click: function click() {
					state.resume();
				},
				mousedown: function mousedown(e) {
					e.stopPropagation();
				}
			});
	
			// uniforms
			this.uniforms = {
				resolution: { type: 'v2', value: new THREE.Vector2() },
				time: { type: 'f', value: this.clock.getElapsedTime() },
				seed: { type: 'f', value: 0 },
				dx: { type: 'f', value: null },
				dy: { type: 'f', value: null },
	
				buffer: { type: 't', value: null },
				prevPos: { type: 'v2', value: this.cursor.prevPos },
				curtPos: { type: 'v2', value: this.cursor.curtPos },
				cursorMode: { type: 'i', value: 0 },
	
				brushType: { type: 'i', value: null },
				brushSize2: { type: 'f', value: null },
				isUpdateCA: { type: 'i', value: state.current == 'draw' ? 1 : 0 }
			};
	
			this.filterUniforms = {
				buffer: { type: 't', value: null },
				curtPos: { type: 'v2', value: this.cursor.curtPos },
				brushSize2: { type: 'f', value: null },
				shareRect: { type: 'v4', value: new THREE.Vector4() },
				outerOpacity: { type: 'f', value: null }
			};
	
			// event
			$(window).on({
				'throttledresize': this.onResize.bind(this),
				'keyup': this.onKeyup.bind(this)
			});
	
			this.cursor.on('size-changed', function (size) {
				_this.$brush.changeSize(size);
			});
	
			this.clear = this.clear.bind(this);
	
			state.onclear = this.clear.bind(this);
			state.onpostMap = this.postMap.bind(this);
	
			state.onchangeType = function (evt, from, to, type) {
				_this.changeType(type);
			};
	
			state.onleaveloading = function () {
				_this.$canvas.removeClass('is-hidden');
			};
			state.onloadMap = function (event, from, to, item) {
				_this.loadMap(item);
			};
	
			state.onenterdraw = function () {
				if (_this.uniforms) _this.uniforms.isUpdateCA.value = 1;
			};
			state.onleavedraw = function () {
				if (_this.uniforms) _this.uniforms.isUpdateCA.value = 0;
			};
		}
	
		_createClass(Canvas, [{
			key: 'changeType',
			value: function changeType(type) {
				var system = _systems2.default[type];
	
				this.system = system;
	
				// this.$brush.init(system)
				this.$brush.$set('brushes', system.brushes);
				this.$help.$set('system', system);
	
				this.caPass = new _basePass2.default({
					fragmentShader: system.caShader,
					uniforms: this.uniforms
				});
	
				var filterUniforms = Object.assign(this.filterUniforms, this.system.filterUniforms);
	
				this.filterPass = new _basePass2.default({
					fragmentShader: system.filterShader,
					uniforms: filterUniforms
				});
				this.share.updateUniforms(this.filterPass.uniforms);
	
				this.onResize();
			}
		}, {
			key: 'onKeyup',
			value: function onKeyup(e) {
	
				var key = String.fromCharCode(e.keyCode);
	
				switch (key) {
					case ' ':
						// Space
						state.togglePause();
						break;
					case 'S':
						state.postMap();
						break;
					case 'G':
						state.showGallery();
						break;
					case 'C':
						state.clear();
						break;
					default:
						if (e.keyCode == 38) {
							this.$brush.changeSize(this.$brush.size + 1);
						} else if (e.keyCode == 40) {
							this.$brush.changeSize(this.$brush.size - 1);
						} else if (isKeyNumerical(key)) {
							this.$brush.changePaletteIndex(parseInt(key) - 1);
						}
				}
			}
		}, {
			key: 'clear',
			value: function clear() {
				this.pingpong.clear();
			}
		}, {
			key: 'onResize',
			value: function onResize() {
				var ww = window.innerWidth;
				var wh = window.innerHeight;
				var DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
	
				if (_mobile2.default.getOrientation() == 'portrait') {
					var _ref = [wh, ww];
					ww = _ref[0];
					wh = _ref[1];
				}
	
				renderer.setSize(ww, wh);
				renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	
				this.updateResolution(Math.ceil(ww / _config2.default.CELL_WIDTH), Math.ceil(wh / _config2.default.CELL_WIDTH));
			}
		}, {
			key: 'updateResolution',
			value: function updateResolution(w, h) {
	
				this.width = w;
				this.height = h;
	
				this.uniforms.resolution.value.set(w, h);
				this.uniforms.dx.value = 1.0 / w;
				this.uniforms.dy.value = 1.0 / h;
	
				this.pingpong.setSize(w, h);
	
				if (this.filteredTex) this.filteredTex.dispose();
				this.filteredTex = new _caRenderTarget2.default(w, h);
				this.renderPass.uniforms.buffer.value = this.filteredTex;
	
				this.share.updateResolution(w, h);
	
				this.render(false);
			}
		}, {
			key: 'loadMap',
			value: function loadMap(item) {
				var _this2 = this;
	
				if (!this.system || this.system.type != item.type) {
					this.changeType(item.type);
				}
	
				var map = new Image();
	
				map.onload = function () {
	
					var $canvas = document.createElement('canvas');
					var ctx = $canvas.getContext('2d');
					var shareRect = _this2.filterPass.uniforms.shareRect.value;
	
					$canvas.width = _this2.width;
					$canvas.height = _this2.height;
					ctx.drawImage(map, shareRect.x, shareRect.y, _config2.default.SHARE_WIDTH, _config2.default.SHARE_HEIGHT);
	
					var texture = new THREE.Texture($canvas);
					texture.minFilter = THREE.NearestFilter;
					texture.magFilter = THREE.NearestFilter;
					_this2.pingpong.resetByTexture(texture);
	
					_this2.render();
	
					state.previewMap();
				};
	
				map.onerror = function () {
					state.resume();
					console.error('CanvasManager: cannot load map');
				};
	
				map.src = item.map;
			}
		}, {
			key: 'render',
			value: function render() {
	
				if (!this.system) return;
	
				// 1. update CA
				this.uniforms.buffer.value = this.pingpong.src;
				this.cursor.update();
	
				this.uniforms.time.value = this.clock.getElapsedTime();
				this.uniforms.seed.value = Math.random();
				this.uniforms.cursorMode.value = this.cursor.mode;
				this.uniforms.brushType.value = this.$brush.index;
				this.uniforms.brushSize2.value = this.$brush.size2;
				this.caPass.render(this.pingpong.dst);
	
				this.pingpong.swap();
	
				/// 2. filter
				this.filterPass.uniforms.buffer.value = this.pingpong.dst;
				this.filterPass.uniforms.brushSize2.value = this.$brush.size2;
				this.filterPass.render(this.filteredTex);
	
				// 3. render to main canvas
				this.renderPass.render();
			}
		}, {
			key: 'postMap',
			value: function postMap() {
	
				var rect = this.share.rect;
	
				var x = rect.x;
				var y = rect.y;
				var w = _config2.default.SHARE_WIDTH;
				var h = _config2.default.SHARE_HEIGHT;
	
				var pixels = new Uint8Array(w * h * 4);
				this.pingpong.readPixels(x, y, w, h, pixels);
	
				// 1. check
				var filled = false;
	
				for (var i = 0, len = w * h; i < len; i++) {
					if (pixels[i * 4] || pixels[i * 4 + 1] || pixels[i * 4 + 2]) {
						filled = true;
						break;
					}
				}
	
				if (!filled) {
					state.showShare('failed', { message: 'Please draw something.' });
					return;
				}
	
				// 2. encode canvas to base64
				var map64 = _base64Util2.default.convertArray(pixels, w, h);
	
				// re-draw without cursor highlight
				this.filterPass.uniforms.brushSize2.value = -1;
				this.filterPass.render(this.filteredTex);
				this.filteredTex.readPixels(x, y, w, h, pixels);
	
				var thumb64 = _base64Util2.default.convertArray(pixels, w, h);
	
				// 3. create data
				$.ajax({
					type: 'POST',
					url: '/api/post.php',
					data: {
						type: this.system.type,
						map: map64,
						thumb: thumb64,
						parent_id: state.id,
						base_color: this.system.baseColor
					},
	
					success: function success(data) {
						console.log(data);
						var json = null;
						try {
							json = JSON.parse(data);
						} catch (e) {
							console.error('CanvasManager: JSON parse error');
							json = {
								status: 'failed',
								content: {
									message: 'Unknown error occured.'
								}
							};
						}
						state.showShare(json);
					}
	
				});
			}
		}]);
	
		return Canvas;
	}();

	exports.default = Canvas;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(15)))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/*
	 * throttledresize: special jQuery event that happens at a reduced rate compared to "resize"
	 *
	 * latest version and complete README available on Github:
	 * https://github.com/louisremi/jquery-smartresize
	 *
	 * Copyright 2012 @louis_remi
	 * Licensed under the MIT license.
	 *
	 * This saved you an hour of work? 
	 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
	 */
	(function($) {
	
	var $event = $.event,
		$special,
		dummy = {_:0},
		frame = 0,
		wasResized, animRunning;
	
	$special = $event.special.throttledresize = {
		setup: function() {
			$( this ).on( "resize", $special.handler );
		},
		teardown: function() {
			$( this ).off( "resize", $special.handler );
		},
		handler: function( event, execAsap ) {
			// Save the context
			var context = this,
				args = arguments;
	
			wasResized = true;
	
			if ( !animRunning ) {
				setInterval(function(){
					frame++;
	
					if ( frame > $special.threshold && wasResized || execAsap ) {
						// set correct event type
						event.type = "throttledresize";
						$event.dispatch.apply( context, args );
						wasResized = false;
						frame = 0;
					}
					if ( frame > 9 ) {
						$(dummy).stop();
						animRunning = false;
						frame = 0;
					}
				}, 30);
				animRunning = true;
			}
		},
		threshold: 0
	};
	
	})(jQuery);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	window.renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById('canvas'),
		antialias: false,
		alpha: false,
		precision: 'mediump',
		stencil: false,
		depth: false,
		premultipledAlpha: false,
		softObject: false
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BasePass = function () {
		function BasePass(option) {
			_classCallCheck(this, BasePass);
	
			this.scene = new THREE.Scene();
			this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
	
			this.uniforms = option.uniforms || {};
	
			var mat = new THREE.RawShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: option.vertexShader || __webpack_require__(64),
				fragmentShader: option.fragmentShader
			});
	
			var geom = new THREE.PlaneBufferGeometry(2, 2);
	
			// let geom = new THREE.BufferGeometry()
	
			//  y
			//  A
			//  |
			//
			// [0]---[1]
			//  |   / |
			//  |  /  |
			//  | /   |
			// [2]---[3]  --> x
	
			// let positions = new Float32Array([
			// 	-1, +1, 0,
			// 	+1, +1, 0,
			// 	-1, -1, 0,
			// 	+1, -1, 0
			// ])
	
			// let uvs = new Float32Array([
			// 	0, 1,
			// 	1, 1,
			// 	0, 0,
			// 	1, 0
			// ])
	
			// let aIndices = new Uint16Array([
			// 	0, 2, 1,
			// 	2, 3, 1
			// ])
	
			// geom.addAttribute('position', new THREE.BufferAttribute(positions, 3))
			// geom.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))
			// geom.setIndex(new THREE.BufferAttribute(aIndices))
	
			var plane = new THREE.Mesh(geom, mat);
			this.scene.add(plane);
		}
	
		_createClass(BasePass, [{
			key: 'render',
			value: function render(targetRenderer) {
				window.renderer.render(this.scene, this.camera, targetRenderer);
			}
		}]);
	
		return BasePass;
	}();

	exports.default = BasePass;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\nprecision mediump int;\n#define GLSLIFY 1\n\nattribute vec2 uv;\nattribute vec3 position;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n\tvUv = vec2(uv.x, uv.y);\n\tgl_Position = vec4(position, 1.0);\n}"

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _caRenderTarget = __webpack_require__(66);
	
	var _caRenderTarget2 = _interopRequireDefault(_caRenderTarget);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var renderer = window.renderer;
	
	var PingpongRenderTarget = function () {
		function PingpongRenderTarget(w, h) {
			_classCallCheck(this, PingpongRenderTarget);
	
			if (w && h) {
				this.setSize(w, h);
			}
		}
	
		_createClass(PingpongRenderTarget, [{
			key: 'setSize',
			value: function setSize(w, h) {
	
				if (this.width == w && this.height == h) return;
	
				var croppedTex = null;
	
				if (this.src) {
					var ox = Math.floor((this.width - w) / 2);
					var oy = Math.floor((this.height - h) / 2);
					var pixels = new Uint8Array(w * h * 4);
					renderer.readRenderTargetPixels(this.src, ox, oy, w, h, pixels);
					croppedTex = new THREE.DataTexture(pixels, w, h);
				}
	
				if (!this.src) this.src = new _caRenderTarget2.default(w, h);
				if (!this.dst) this.dst = new _caRenderTarget2.default(w, h);
	
				this.src.setSize(w, h);
				this.dst.setSize(w, h);
				this.width = w;
				this.height = h;
	
				if (croppedTex) this.src.resetByTexture(croppedTex);
			}
		}, {
			key: 'readPixels',
			value: function readPixels(x, y, w, h, pixels) {
				renderer.readRenderTargetPixels(this.dst, x, y, w, h, pixels);
			}
		}, {
			key: 'resetByTexture',
			value: function resetByTexture(texture) {
				this.src.resetByTexture(texture);
				this.dst.resetByTexture(texture);
			}
		}, {
			key: 'swap',
			value: function swap() {
				var _ref = [this.dst, this.src];
				this.src = _ref[0];
				this.dst = _ref[1];
			}
		}, {
			key: 'clear',
			value: function clear() {
				this.src.dispose();
				this.dst.dispose();
				this.src = new _caRenderTarget2.default(this.width, this.height);
				this.dst = new _caRenderTarget2.default(this.width, this.height);
			}
	
			// trim
	
		}]);
	
		return PingpongRenderTarget;
	}();

	exports.default = PingpongRenderTarget;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _basePass = __webpack_require__(63);
	
	var _basePass2 = _interopRequireDefault(_basePass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var resetPass = new _basePass2.default({
		fragmentShader: __webpack_require__(67),
		uniforms: {
			buffer: { type: 't', value: null }
		}
	});
	
	var renderer = window.renderer;
	
	var CARenderTarget = function (_THREE$WebGLRenderTar) {
		_inherits(CARenderTarget, _THREE$WebGLRenderTar);
	
		function CARenderTarget(w, h) {
			_classCallCheck(this, CARenderTarget);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(CARenderTarget).call(this, w, h, {
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter,
				format: THREE.RGBAFormat
			}));
		}
	
		_createClass(CARenderTarget, [{
			key: 'readPixels',
			value: function readPixels(x, y, w, h, pixels) {
				renderer.readRenderTargetPixels(this, x, y, w, h, pixels);
			}
		}, {
			key: 'resetByTexture',
			value: function resetByTexture(texture) {
				texture.needsUpdate = true;
				resetPass.uniforms.buffer.value = texture;
				resetPass.render(this);
			}
		}]);
	
		return CARenderTarget;
	}(THREE.WebGLRenderTarget);
	
	exports.default = CARenderTarget;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\nprecision mediump int;\n#define GLSLIFY 1\n\nuniform sampler2D buffer;\n\nvarying vec2 vUv;\n\nvoid main() {\n  gl_FragColor = texture2D(buffer, vUv);\n}"

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	Vue.config.debug = true;
	
	var Brush = function (_Vue) {
		_inherits(Brush, _Vue);
	
		function Brush() {
			_classCallCheck(this, Brush);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(Brush).call(this, {
				el: '.palette',
				data: {
					brushes: {
						list: {},
						active: null,
						order: []
					}
				},
	
				computed: {
					index: function index() {
						return this.brushes.list[this.brushes.active].index;
					},
					size: function size() {
						return this.brushes.list[this.brushes.active].size;
					},
					size2: function size2() {
						return Math.pow(this.brushes.list[this.brushes.active].size, 2);
					},
					brushList: function brushList() {
						var list = [];
						this.system.brush;
					}
				},
	
				methods: {
					changeType: function changeType(type) {
						this.brushes.active = type;
					}
				}
			}));
		}
	
		_createClass(Brush, [{
			key: 'changeSize',
			value: function changeSize(size) {
				this.brushes.list[this.brushes.active].size = Math.max(0.5, size);
			}
		}, {
			key: 'changePaletteIndex',
			value: function changePaletteIndex(index) {
				this.brushes.active = this.brushes.order[index];
			}
		}]);
	
		return Brush;
	}(Vue);
	
	exports.default = Brush;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, THREE) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _eventemitter = __webpack_require__(55);
	
	var _eventemitter2 = _interopRequireDefault(_eventemitter);
	
	var _mobile = __webpack_require__(70);
	
	var _mobile2 = _interopRequireDefault(_mobile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BUTTON_RIGHT = 2;
	
	var router = window.router;
	
	var Mode = {
		NONE: 0,
		DRAW: 1,
		SIZING: 2
	};
	
	var Cursor = function (_EventEmitter) {
		_inherits(Cursor, _EventEmitter);
	
		function Cursor() {
			_classCallCheck(this, Cursor);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cursor).call(this));
	
			_this.$region = $('.canvas');
	
			// public
			_this.curtPos = new THREE.Vector2();
			_this.prevPos = new THREE.Vector2();
	
			// private
			_this.coord = new THREE.Vector2();
			_this.mode = Mode.NONE;
			// this.mode = Mode.none
	
			_this.isPortrait = _mobile2.default.getOrientation() == 'portrait';
	
			_mobile2.default.on('orientationchange', function (orientation) {
				_this.isPortrait = orientation == 'portrait';
			});
	
			_this.$region.on({
	
				'mousedown': function mousedown(e) {
					if (e.button == 2) {
						_this.mode = Mode.SIZING;
						_this.sx = e.clientX / _config2.default.CELL_WIDTH;
						_this.sy = e.clientY / _config2.default.CELL_WIDTH;
					} else {
						_this.mode = Mode.DRAW;
						_this.updateCoord(e.clientX, e.clientY, true);
					}
				},
	
				'mousemove': function mousemove(e) {
					if (_this.mode == Mode.SIZING) {
						var x = e.clientX / _config2.default.CELL_WIDTH,
						    y = e.clientY / _config2.default.CELL_WIDTH;
	
						var size = Math.pow(_this.sx - x, 2) + Math.pow(_this.sy - y, 2);
						size = Math.round(Math.sqrt(size));
	
						_this.emit('size-changed', size);
					} else {
						_this.updateCoord(e.clientX, e.clientY);
					}
				},
	
				'mouseup mouseleave': function mouseupMouseleave(e) {
					_this.mode = Mode.NONE;
				},
	
				// mobile
				'touchstart': function touchstart(e) {
					e.preventDefault();
					_this.mode = Mode.DRAW;
					_this.updateCoord(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, true);
				},
	
				'touchmove': function touchmove(e) {
					e.preventDefault();
					_this.updateCoord(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
				},
	
				'touchend': function touchend(e) {
					e.preventDefault();
					_this.mode = Mode.NONE;
				}
			});
	
			return _this;
		}
	
		_createClass(Cursor, [{
			key: 'updateCoord',
			value: function updateCoord(x, y, reset) {
				if (this.isPortrait) {
					this.coord.set(y / _config2.default.CELL_WIDTH, (window.innerWidth - x) / _config2.default.CELL_WIDTH);
				} else {
					this.coord.set(x / _config2.default.CELL_WIDTH, y / _config2.default.CELL_WIDTH);
				}
	
				if (reset !== undefined) this.curtPos.copy(this.coord);
			}
		}, {
			key: 'update',
			value: function update() {
				// console.log(this.curtPos.x, this.curtPos.y)
				this.prevPos.copy(this.curtPos);
				this.curtPos.copy(this.coord);
			}
		}]);
	
		return Cursor;
	}(_eventemitter2.default);

	exports.default = Cursor;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(15)))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _eventemitter = __webpack_require__(55);
	
	var _eventemitter2 = _interopRequireDefault(_eventemitter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var state = window.state;
	
	var Mobile = function (_EventEmitter) {
		_inherits(Mobile, _EventEmitter);
	
		function Mobile() {
			_classCallCheck(this, Mobile);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mobile).call(this));
	
			if (!_config2.default.PC) {
	
				$(window).on('orientationchange', function () {
	
					var orientation = _this.getOrientation();
					$('body').attr('data-orientation', orientation);
	
					_this.emit('orientationchange', orientation);
				}).trigger('orientationchange');
			}
	
			_this.mq = __webpack_require__(71);
			_this.mq.on('change', function (breakpoint) {
	
				if (breakpoint == 'pc' && state.is('menu')) {
					state.resume();
				}
			});
	
			$('.menu__btn').on('click', function () {
				if (state.current == 'draw') {
					state.expandMenu();
				} else if (state.current == 'menu') {
					state.resume();
				}
			});
	
			return _this;
		}
	
		_createClass(Mobile, [{
			key: 'getOrientation',
			value: function getOrientation() {
				if (_config2.default.PC) {
					return null;
				} else {
					if (typeof window.orientation !== 'undefined' && Math.abs(window.orientation) != 90) {
						return 'portrait';
					} else {
						return 'landscape';
					}
				}
			}
		}]);
	
		return Mobile;
	}(_eventemitter2.default);
	
	exports.default = new Mobile();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/*global require, module, window, document */
	
	'use strict';
	var Emitter = __webpack_require__(72);
	var emitter = new Emitter();
	
	if (window && window.getComputedStyle && window.addEventListener) {
	  var style, last;
	
	  var getCurrentBreakpoint = function () {
	    if (!style) {
	      style = window.getComputedStyle(document.body, ':after');
	    }
	
	    return style.getPropertyValue('content').replace(/'|"/g, '');
	  };
	
	  var publishChange = function (breakpoint) {
	    emitter.emit(breakpoint).emit('change', breakpoint);
	  };
	
	  var checkBreakpoint = function () {
	    var current = getCurrentBreakpoint();
	
	    if (current !== last) {
	      publishChange(current);
	      last = current;
	    }
	  };
	
	  window.addEventListener('load', checkBreakpoint);
	  window.addEventListener('resize', checkBreakpoint);
	}
	
	module.exports = emitter;


/***/ },
/* 72 */
/***/ function(module, exports) {

	function E () {
		// Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}
	
	E.prototype = {
		on: function (name, callback, ctx) {
	    var e = this.e || (this.e = {});
	
	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });
	
	    return this;
	  },
	
	  once: function (name, callback, ctx) {
	    var self = this;
	    function listener () {
	      self.off(name, listener);
	      callback.apply(ctx, arguments);
	    };
	
	    listener._ = callback
	    return this.on(name, listener, ctx);
	  },
	
	  emit: function (name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;
	
	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }
	
	    return this;
	  },
	
	  off: function (name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];
	
	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
	          liveEvents.push(evts[i]);
	      }
	    }
	
	    // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910
	
	    (liveEvents.length)
	      ? e[name] = liveEvents
	      : delete e[name];
	
	    return this;
	  }
	};
	
	module.exports = E;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Vue) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _javascriptStateMachine = __webpack_require__(19);
	
	var _javascriptStateMachine2 = _interopRequireDefault(_javascriptStateMachine);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var state = window.state;
	
	var OUTER_OPACITY = {
		draw: 0.93,
		preview: 0.5,
		share: 0,
		frames: 10
	};
	
	var Share = function () {
		function Share() {
			var _this = this;
	
			_classCallCheck(this, Share);
	
			$('.menu__share').on({
				'mouseenter': function mouseenter() {
					_this.setOuterOpacity(OUTER_OPACITY.preview);
				},
				'mouseleave': function mouseleave() {
					if (state.current != 'share') _this.setOuterOpacity(OUTER_OPACITY.draw);
				}
			});
	
			this.alert = new Vue({
				el: '.alert',
				data: {
					show: false,
					status: '',
					message: '',
					url: '',
					id: null
				},
				methods: {
					resume: function resume() {
						state.resume();
					},
					showGallery: function showGallery() {
						state.showGallery();
					},
					tweet: function tweet() {
						var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
						    width = 550,
						    height = 420,
						    winHeight = screen.height,
						    winWidth = screen.width;
	
						var left = Math.round(winWidth / 2 - width / 2);
						var top = 0;
	
						if (winHeight > height) top = Math.round(winHeight / 2 - height / 2);
	
						var params = {
							url: this.url,
							text: 'Fuse #' + this.id
						};
	
						var intentUrl = 'https://twitter.com/intent/tweet?' + $.param(params);
	
						window.open(intentUrl, 'intent', windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
					}
				}
			});
	
			state.onposting = function (s) {
				_this.setOuterOpacity(OUTER_OPACITY.share);
			};
	
			state.onshowShare = this.onShowShare.bind(this.alert);
	
			state.onleaveshare = function () {
				_this.alert.$data.show = false;
				_this.setOuterOpacity(OUTER_OPACITY.draw);
	
				setTimeout(function () {
					return state.transition();
				}, 550);
	
				return _javascriptStateMachine2.default.ASYNC;
			};
		}
	
		_createClass(Share, [{
			key: 'updateUniforms',
			value: function updateUniforms(uniforms) {
				this.uniforms = uniforms;
				this.uniforms.outerOpacity.value = OUTER_OPACITY.draw;
			}
		}, {
			key: 'updateResolution',
			value: function updateResolution(w, h) {
				var x = Math.floor((w - _config2.default.SHARE_WIDTH) / 2);
				var y = Math.floor((h - _config2.default.SHARE_HEIGHT) / 2);
				this.uniforms.shareRect.value.set(x, y, x + _config2.default.SHARE_WIDTH, y + _config2.default.SHARE_HEIGHT);
			}
		}, {
			key: 'setOuterOpacity',
			value: function setOuterOpacity(target) {
				var _this2 = this;
	
				var current = this.uniforms.outerOpacity.value;
				var step = Math.abs(target - current) / OUTER_OPACITY.frames;
	
				if (target < current) {
					step *= -1;
				}
	
				var isEnd = current <= target ? function (current, target) {
					return target <= current;
				} : function (current, target) {
					return current <= target;
				};
	
				clearInterval(this.outerOpacityTimer);
	
				this.outerOpacityTimer = setInterval(function () {
	
					var value = _this2.uniforms.outerOpacity.value + step;
	
					if (isEnd(value, target)) {
						value = target;
						clearInterval(_this2.outerOpacityTimer);
					}
	
					_this2.uniforms.outerOpacity.value = value;
				}, 20);
			}
		}, {
			key: 'onShowShare',
			value: function onShowShare(event, from, to, res) {
	
				if (res.status == 'failed') {
					this.message = res.content.message;
				} else if (res.status == 'succeed') {
					this.url = res.content.url;
					this.id = res.content.id;
				}
	
				this.status = res.status;
	
				console.log(this.status);
				this.show = true;
			}
		}, {
			key: 'rect',
			get: function get() {
				return this.uniforms.shareRect.value;
			}
		}]);
	
		return Share;
	}();

	exports.default = Share;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(57)))

/***/ },
/* 74 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Base64Util = function () {
		function Base64Util() {
			_classCallCheck(this, Base64Util);
	
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
		}
	
		_createClass(Base64Util, [{
			key: 'convertArray',
			value: function convertArray(pixels, w, h) {
	
				this.canvas.width = w;
				this.canvas.height = h;
	
				// Copy the pixels to a 2D canvas
				var imageData = this.ctx.createImageData(w, h);
				imageData.data.set(pixels);
				this.ctx.putImageData(imageData, 0, 0);
	
				return this.canvas.toDataURL();
			}
	
			// export convertImageToBase64(img) {
		}, {
			key: 'convertImage',
			value: function convertImage(img) {
	
				this.canvas.width = img.width;
				this.canvas.height = img.height;
	
				this.ctx.drawImage(img, 0, 0);
	
				return this.canvas.toDataURL();
			}
		}]);
	
		return Base64Util;
	}();
	
	exports.default = new Base64Util();

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Vue) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _hexRgb = __webpack_require__(76);
	
	var _hexRgb2 = _interopRequireDefault(_hexRgb);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Help = function (_Vue) {
		_inherits(Help, _Vue);
	
		function Help() {
			_classCallCheck(this, Help);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(Help).call(this, {
				// el: '.help',
				data: function data() {
					return {
						system: {
							brushes: {
								list: {},
								order: []
							},
							name: '',
							help: ''
						}
					};
				},
				computed: {
					htmlHelp: function htmlHelp() {
						var _this2 = this;
	
						var help = this.system.help;
	
						this.system.brushes.order.forEach(function (type) {
							var brush = _this2.system.brushes.list[type];
							var color = brush.color;
							var rgb = (0, _hexRgb2.default)(color);
							var brightness = (rgb[0] + rgb[1] + rgb[2]) / 3.0;
							if (brightness < 64) {
								color = 'rgb(' + (rgb[0] + 32) + ', ' + (rgb[1] + 32) + ', ' + (rgb[2] + 32) + ')';
							}
							help = help.split(brush.name).join('<span style=\'color: ' + color + ';border-color:' + color + ';\'>' + brush.name + '</span>');
						});
	
						return help;
					}
				}
			}));
		}
	
		return Help;
	}(Vue);
	
	exports.default = Help;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)))

/***/ },
/* 76 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (hex) {
		if (typeof hex !== 'string') {
			throw new TypeError('Expected a string');
		}
	
		hex = hex.replace(/^#/, '');
	
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
	
		var num = parseInt(hex, 16);
	
		return [num >> 16, num >> 8 & 255, num & 255];
	};


/***/ }
]));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL34vdGlja2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZXZlbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2V2ZW50ZW1pdHRlcjMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vfi92dWUvZGlzdC92dWUuY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9nYWxsZXJ5LmpzIiwid2VicGFjazovLy8uL34vdnVlLWluZmluaXRlLXNjcm9sbC92dWUtaW5maW5pdGUtc2Nyb2xsLmpzIiwid2VicGFjazovLy8uL3NyYy9jYW52YXMuanMiLCJ3ZWJwYWNrOi8vLy4vd2ViX21vZHVsZXMvanF1ZXJ5LnRocm90dGxlZHJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2xvYmFsLXJlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9iYXNlLXBhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYWRlcnMvYmFzZS1wYXNzLnZlcnQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Bpbmdwb25nLXJlbmRlci10YXJnZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NhLXJlbmRlci10YXJnZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYWRlcnMvcGFzc3RocnUuZnJhZyIsIndlYnBhY2s6Ly8vLi9zcmMvYnJ1c2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1cnNvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9iaWxlLmpzIiwid2VicGFjazovLy8uL34vbWVkaWEtcXVlcnktbGlzdGVuZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlLmpzIiwid2VicGFjazovLy8uL3NyYy9iYXNlNjQtdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaGVscC5qcyIsIndlYnBhY2s6Ly8vLi9+L2hleC1yZ2IvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUdBLEtBQU0sZUFBZSxPQUFPLFlBQVA7QUFDckIsS0FBTSxRQUFRLE9BQU8sS0FBUDs7S0FFTztBQUVwQixXQUZvQixHQUVwQixHQUFjOzs7eUJBRk0sS0FFTjs7QUFFYixRQUFLLEtBQUwsR0FBYSxvQkFBYixDQUZhO0FBR2IsUUFBSyxNQUFMLEdBQWMsc0JBQWQsQ0FIYTtBQUliLFFBQUssT0FBTCxHQUFlLHVCQUFmLENBSmE7O0FBTWIsUUFBSyxVQUFMLEdBQWtCLDBCQUFsQixDQU5hOztBQVFiLFNBQU0sV0FBTixHQUFvQixZQUFNO0FBQ3pCLFVBQUssVUFBTCxHQUFrQixLQUFsQixDQUR5QjtJQUFOLENBUlA7QUFXYixTQUFNLFVBQU4sR0FBbUIsWUFBTTtBQUN4QixVQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FEd0I7SUFBTixDQVhOOztBQWViLFlBQVMsYUFBVCxHQUF5QjtXQUFNO0lBQU4sQ0FmWjs7QUFpQmIsU0FBTSxJQUFOLEdBakJhOztBQW1CYix5QkFBTyxFQUFFLFNBQUYsRUFBYSxDQUFiLENBQVAsRUFBd0IsRUFBeEIsRUFBNEIsRUFBNUIsQ0FBK0IsTUFBL0IsRUFBdUMsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBdkMsRUFuQmE7O0FBcUJiLFVBQU8sSUFBUCxvQkFyQmE7R0FBZDs7ZUFGb0I7OzBCQTJCYjtBQUNOLFNBQUssTUFBTCxDQUFZLE1BQVosR0FETTs7OztTQTNCYTs7Ozs7Ozs7OztBQ1pyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtB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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxFQUFFO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLElBQUk7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsUUFBUTtBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztB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QUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsY0FBYztBQUN6QixZQUFXLFFBQVE7QUFDbkIsWUFBVyxRQUFRO0FBQ25CLGFBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBd0MsT0FBTztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxNQUFNO0FBQ2pCLFlBQVcsRUFBRTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMLGdEQUErQztBQUMvQyxNQUFLO0FBQ0wsb0NBQW1DO0FBQ25DO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSwrQ0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsYUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsYUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxvQ0FBbUM7QUFDbkM7QUFDQSxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxzQ0FBcUMsT0FBTztBQUM1QztBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUIsaUJBQWlCO0FBQzFDO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBa0MsT0FBTztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQixjQUFhLFNBQVM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsZ0JBQWdCO0FBQzdCLGNBQWEsU0FBUztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsU0FBUztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQSxjQUFhLE9BQU87QUFDcEIsZUFBYyxJQUFJO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLFNBQVM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLElBQUk7QUFDakIsY0FBYSxTQUFTO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QyxPQUFPO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLE9BQU87QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBOEMsT0FBTztBQUNyRCxzQ0FBcUM7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYSxJQUFJO0FBQ2pCLGNBQWEsUUFBUTtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUMsT0FBTztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsSUFBSTtBQUNqQixjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF3QyxPQUFPO0FBQy9DO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYSxJQUFJO0FBQ2pCLGNBQWEsT0FBTztBQUNwQixjQUFhLE9BQU87QUFDcEIsY0FBYSx1QkFBdUI7QUFDcEMsY0FBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsSUFBSTtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYSxJQUFJO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsY0FBYztBQUNwQyx1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsUUFBUTtBQUM5Qix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsT0FBTztBQUM3Qix1QkFBc0IsY0FBYztBQUNwQyx1QkFBc0IsUUFBUTtBQUM5QixZQUFXLElBQUk7QUFDZixZQUFXLEtBQUs7QUFDaEIsWUFBVyxJQUFJO0FBQ2YsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsWUFBVyxPQUFPO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHLEVBQUU7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsRUFBRTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsU0FBUztBQUNwQixZQUFXLFFBQVE7QUFDbkI7O0FBRUE7QUFDQSwyQ0FBMEM7QUFDMUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsUUFBUTtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsUUFBUTtBQUNyQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLE9BQU87QUFDcEIsY0FBYSxLQUFLO0FBQ2xCLGNBQWEsSUFBSTtBQUNqQixjQUFhLE9BQU87QUFDcEIsY0FBYSxTQUFTO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsUUFBUTtBQUNyQixjQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUksTUFBTSxzQkFBTyxLQUFQLENBQU4sQ0FIdUM7QUFJM0MsV0FBSSxhQUFhLENBQUMsSUFBSSxDQUFKLElBQVMsSUFBSSxDQUFKLENBQVQsR0FBa0IsSUFBSSxDQUFKLENBQWxCLENBQUQsR0FBNkIsR0FBN0IsQ0FKMEI7QUFLM0MsV0FBSSxhQUFhLEVBQWIsRUFBaUI7QUFDcEIsMEJBQWUsSUFBSSxDQUFKLElBQVMsRUFBVCxZQUFnQixJQUFJLENBQUosSUFBUyxFQUFULFlBQWdCLElBQUksQ0FBSixJQUFTLEVBQVQsT0FBL0MsQ0FEb0I7UUFBckI7QUFHQSxjQUFPLEtBQUssS0FBTCxDQUFXLE1BQU0sSUFBTixDQUFYLENBQXVCLElBQXZCLDJCQUFtRCwyQkFBc0IsaUJBQVcsTUFBTSxJQUFOLFlBQXBGLENBQVAsQ0FSMkM7T0FBVixDQUFsQyxDQUhvQjs7QUFjcEIsYUFBTyxJQUFQLENBZG9CO01BQVg7S0FEWDtPQWZZO0dBQWQ7O1NBRm9CO0dBQWE7O21CQUFiLEs7Ozs7Ozs7QUNGckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSIsImZpbGUiOiIxLjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGlja2VyIGZyb20gJ3RpY2tlcidcblxuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9uYXZpZ2F0aW9uLmpzJ1xuaW1wb3J0IEhvbWUgZnJvbSAnLi9ob21lLmpzJ1xuaW1wb3J0IEdhbGxlcnkgZnJvbSAnLi9nYWxsZXJ5LmpzJ1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcy5qcydcbmltcG9ydCBTeXN0ZW1zIGZyb20gJy4vc3lzdGVtcy5qcydcblxuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB3aW5kb3cuaW5pdGlhbFN0YXRlXG5jb25zdCBzdGF0ZSA9IHdpbmRvdy5zdGF0ZVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0dGhpcy4kaG9tZSA9IG5ldyBIb21lKClcblx0XHR0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMoKVxuXHRcdHRoaXMuZ2FsbGVyeSA9IG5ldyBHYWxsZXJ5KClcblxuXHRcdHRoaXMubmF2aWdhdGlvbiA9IG5ldyBOYXZpZ2F0aW9uKClcblxuXHRcdHN0YXRlLm9uZW50ZXJob21lID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5wbGF5VGlja2VyID0gZmFsc2Vcblx0XHR9XG5cdFx0c3RhdGUub25sZXZlaG9tZSA9ICgpID0+IHtcblx0XHRcdHRoaXMucGxheVRpY2tlciA9IHRydWVcblx0XHR9XG5cblx0XHRkb2N1bWVudC5vbmNvbnRleHRtZW51ID0gKCkgPT4gZmFsc2VcblxuXHRcdHN0YXRlLmluaXQoKVxuXG5cdFx0dGlja2VyKCQoJyNjYW52YXMnKVswXSwgNTApLm9uKCdkcmF3JywgdGhpcy5kcmF3LmJpbmQodGhpcykpXG5cblx0XHR3aW5kb3cudGljayA9IHRpY2tlclxuXHRcdFxuXHR9XG5cblx0ZHJhdygpIHtcblx0XHR0aGlzLmNhbnZhcy5yZW5kZXIoKVxuXHR9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwLmpzXG4gKiovIiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuXG52YXIgX3JhZiA9XG4gIGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgZ2xvYmFsLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICBnbG9iYWwubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gIGdsb2JhbC5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICBnbG9iYWwub1JlcXVlc3RBbmltYXRpb25GcmFtZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRpY2tlclxuXG52YXIgY3VycnRpbWUgPVxuICBnbG9iYWwucGVyZm9ybWFuY2UgJiZcbiAgZ2xvYmFsLnBlcmZvcm1hbmNlLm5vdyA/IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKVxuICB9IDogRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiArbmV3IERhdGVcbiAgfVxuXG5mdW5jdGlvbiB0aWNrZXIoZWxlbWVudCwgcmF0ZSwgbGltaXQpIHtcbiAgdmFyIGZwcyA9IDEwMDAgLyAocmF0ZSB8fCA2MClcbiAgICAsIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyXG4gICAgLCBsYXN0ID0gY3VycnRpbWUoKVxuICAgICwgdGltZSA9IDBcblxuICB2YXIgcmFmID0gX3JhZiB8fCBmdW5jdGlvbihmbiwgZWwpIHtcbiAgICBzZXRUaW1lb3V0KGZuLCBmcHMpXG4gIH1cblxuICBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gK2xpbWl0ICsgMSA6IDJcblxuICBmdW5jdGlvbiBsb29wKCkge1xuICAgIHJhZihsb29wLCBlbGVtZW50IHx8IG51bGwpXG5cbiAgICB2YXIgbm93ID0gY3VycnRpbWUoKVxuICAgIHZhciBkdCA9IG5vdyAtIGxhc3RcbiAgICB2YXIgbiA9IGxpbWl0XG5cbiAgICBlbWl0dGVyLmVtaXQoJ2RhdGEnLCBkdClcbiAgICB0aW1lICs9IGR0XG4gICAgd2hpbGUgKHRpbWUgPiBmcHMgJiYgbikge1xuICAgICAgdGltZSAtPSBmcHNcbiAgICAgIG4gLT0gMVxuICAgICAgZW1pdHRlci5lbWl0KCd0aWNrJywgZnBzKVxuICAgIH1cblxuICAgIHRpbWUgPSAodGltZSArIGZwcyAqIDEwMDApICUgZnBzXG4gICAgaWYgKG4gIT09IGxpbWl0KSBlbWl0dGVyLmVtaXQoJ2RyYXcnLCB0aW1lIC8gZnBzKVxuICAgIGxhc3QgPSBub3dcbiAgfVxuXG4gIGxvb3AoKVxuXG4gIHJldHVybiBlbWl0dGVyXG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi90aWNrZXIvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZXZlbnRzL2V2ZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDUzXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnXG5cbmxldCBzdGF0ZSA9IHdpbmRvdy5zdGF0ZVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZpZ2F0aW9uIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cblx0XHQkKCcubWVudV9fY2hhbmdlJykub24oJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c3RhdGUuc2hvd0hvbWUoKVxuXHRcdH0pXG5cblx0XHQkKCcubWVudV9fY2xlYXInKS5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRzdGF0ZS5jbGVhcigpXG5cdFx0fSlcblxuXHRcdCQoJy5tZW51X19oZWxwJykub24oJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c3RhdGUuc2hvd0hlbHAoKVxuXHRcdH0pXG5cblx0XHQkKCcubWVudV9fc2hhcmUnKS5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRzdGF0ZS5wb3N0TWFwKClcblx0XHR9KVxuXG5cdFx0JCgnLm1lbnVfX2dhbGxlcnknKS5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRzdGF0ZS5zaG93R2FsbGVyeSgpXG5cdFx0fSlcblxuXHRcdCQoJy5sYXllcicpLm9uKCdjbGljaycsICgpID0+IHtcblx0XHRcdHN0YXRlLnJlc3VtZSgpXG5cdFx0fSlcblxuXHR9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbmF2aWdhdGlvbi5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vXG4vLyBXZSBzdG9yZSBvdXIgRUUgb2JqZWN0cyBpbiBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBgfmAgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Qgb3ZlcnJpZGRlbiBvclxuLy8gdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy8gV2UgYWxzbyBhc3N1bWUgdGhhdCBgT2JqZWN0LmNyZWF0ZShudWxsKWAgaXMgYXZhaWxhYmxlIHdoZW4gdGhlIGV2ZW50IG5hbWVcbi8vIGlzIGFuIEVTNiBTeW1ib2wuXG4vL1xudmFyIHByZWZpeCA9IHR5cGVvZiBPYmplY3QuY3JlYXRlICE9PSAnZnVuY3Rpb24nID8gJ34nIDogZmFsc2U7XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgRXZlbnRFbWl0dGVyIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBDb250ZXh0IGZvciBmdW5jdGlvbiBleGVjdXRpb24uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBPbmx5IGVtaXQgb25jZVxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBNaW5pbWFsIEV2ZW50RW1pdHRlciBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogRXZlbnRFbWl0dGVyIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHsgLyogTm90aGluZyB0byBzZXQgKi8gfVxuXG4vKipcbiAqIEhvbGQgdGhlIGFzc2lnbmVkIEV2ZW50RW1pdHRlcnMgYnkgbmFtZS5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkXG4gKiBsaXN0ZW5lcnMuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1xuICAgICwgbmFtZXMgPSBbXVxuICAgICwgbmFtZTtcblxuICBpZiAoIWV2ZW50cykgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiBldmVudHMpIHtcbiAgICBpZiAoaGFzLmNhbGwoZXZlbnRzLCBuYW1lKSkgbmFtZXMucHVzaChwcmVmaXggPyBuYW1lLnNsaWNlKDEpIDogbmFtZSk7XG4gIH1cblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHJldHVybiBuYW1lcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhldmVudHMpKTtcbiAgfVxuXG4gIHJldHVybiBuYW1lcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCBvZiBhc3NpZ25lZCBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudHMgdGhhdCBzaG91bGQgYmUgbGlzdGVkLlxuICogQHBhcmFtIHtCb29sZWFufSBleGlzdHMgV2Ugb25seSBuZWVkIHRvIGtub3cgaWYgdGhlcmUgYXJlIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtBcnJheXxCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQsIGV4aXN0cykge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgYXZhaWxhYmxlID0gdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogRW1pdCBhbiBldmVudCB0byBhbGwgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJbmRpY2F0aW9uIGlmIHdlJ3ZlIGVtaXR0ZWQgYW4gZXZlbnQuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgbGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgY2FzZSAxOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQpLCB0cnVlO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlO1xuICAgICAgY2FzZSA0OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMpLCB0cnVlO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgNjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuZm4uYXBwbHkobGlzdGVuZXJzLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAsIGo7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgbmV3IEV2ZW50TGlzdGVuZXIgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBDYWxsYmFjayBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IG9mIHRoZSBmdW5jdGlvbi5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSBwcmVmaXggPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXI7XG4gIGVsc2Uge1xuICAgIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICAgIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbXG4gICAgICB0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhbiBFdmVudExpc3RlbmVyIHRoYXQncyBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgb2YgdGhlIGZ1bmN0aW9uLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSBwcmVmaXggPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXI7XG4gIGVsc2Uge1xuICAgIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICAgIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbXG4gICAgICB0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudCB3ZSB3YW50IHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciB0aGF0IHdlIG5lZWQgdG8gZmluZC5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgT25seSByZW1vdmUgbGlzdGVuZXJzIG1hdGNoaW5nIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmNlIGxpc3RlbmVycy5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGV2ZW50cyA9IFtdO1xuXG4gIGlmIChmbikge1xuICAgIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICAgIGlmIChcbiAgICAgICAgICAgbGlzdGVuZXJzLmZuICE9PSBmblxuICAgICAgICB8fCAob25jZSAmJiAhbGlzdGVuZXJzLm9uY2UpXG4gICAgICAgIHx8IChjb250ZXh0ICYmIGxpc3RlbmVycy5jb250ZXh0ICE9PSBjb250ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVycyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm5cbiAgICAgICAgICB8fCAob25jZSAmJiAhbGlzdGVuZXJzW2ldLm9uY2UpXG4gICAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICAgICkge1xuICAgICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gIC8vXG4gIGlmIChldmVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2dF0gPSBldmVudHMubGVuZ3RoID09PSAxID8gZXZlbnRzWzBdIDogZXZlbnRzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpc3RlbmVycyBvciBvbmx5IHRoZSBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudCB3YW50IHRvIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvci5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gdGhpcztcblxuICBpZiAoZXZlbnQpIGRlbGV0ZSB0aGlzLl9ldmVudHNbcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudF07XG4gIGVsc2UgdGhpcy5fZXZlbnRzID0gcHJlZml4ID8ge30gOiBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGRvZXNuJ3QgYXBwbHkgYW55bW9yZS5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBwcmVmaXguXG4vL1xuRXZlbnRFbWl0dGVyLnByZWZpeGVkID0gcHJlZml4O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZXZlbnRlbWl0dGVyMy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDU1XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJpbXBvcnQgU3lzdGVtcyBmcm9tICcuL3N5c3RlbXMuanMnXG5cbmNvbnN0IHN0YXRlID0gd2luZG93LnN0YXRlXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHRuZXcgVnVlKHtcblx0XHRcdGVsOiAnLmhvbWUnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRzeXN0ZW1zOiBTeXN0ZW1zLFxuXHRcdFx0XHR0eXBlOiBudWxsXG5cdFx0XHR9LFxuXHRcdFx0bWV0aG9kczoge1xuXHRcdFx0XHRjaGFuZ2VUeXBlKGUsIHR5cGUpIHtcblx0XHRcdFx0XHRzdGF0ZS5jaGFuZ2VUeXBlKHR5cGUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvaG9tZS5qc1xuICoqLyIsIi8qIVxuICogVnVlLmpzIHYxLjAuMjBcbiAqIChjKSAyMDE2IEV2YW4gWW91XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gc2V0KG9iaiwga2V5LCB2YWwpIHtcbiAgaWYgKGhhc093bihvYmosIGtleSkpIHtcbiAgICBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9iai5faXNWdWUpIHtcbiAgICBzZXQob2JqLl9kYXRhLCBrZXksIHZhbCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBvYiA9IG9iai5fX29iX187XG4gIGlmICghb2IpIHtcbiAgICBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm47XG4gIH1cbiAgb2IuY29udmVydChrZXksIHZhbCk7XG4gIG9iLmRlcC5ub3RpZnkoKTtcbiAgaWYgKG9iLnZtcykge1xuICAgIHZhciBpID0gb2Iudm1zLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB2YXIgdm0gPSBvYi52bXNbaV07XG4gICAgICB2bS5fcHJveHkoa2V5KTtcbiAgICAgIHZtLl9kaWdlc3QoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBwcm9wZXJ0eSBhbmQgdHJpZ2dlciBjaGFuZ2UgaWYgbmVjZXNzYXJ5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5mdW5jdGlvbiBkZWwob2JqLCBrZXkpIHtcbiAgaWYgKCFoYXNPd24ob2JqLCBrZXkpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRlbGV0ZSBvYmpba2V5XTtcbiAgdmFyIG9iID0gb2JqLl9fb2JfXztcbiAgaWYgKCFvYikge1xuICAgIHJldHVybjtcbiAgfVxuICBvYi5kZXAubm90aWZ5KCk7XG4gIGlmIChvYi52bXMpIHtcbiAgICB2YXIgaSA9IG9iLnZtcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdmFyIHZtID0gb2Iudm1zW2ldO1xuICAgICAgdm0uX3VucHJveHkoa2V5KTtcbiAgICAgIHZtLl9kaWdlc3QoKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgb2JqZWN0IGhhcyB0aGUgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBoYXNPd24ob2JqLCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGV4cHJlc3Npb24gaXMgYSBsaXRlcmFsIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxudmFyIGxpdGVyYWxWYWx1ZVJFID0gL15cXHM/KHRydWV8ZmFsc2V8LT9bXFxkXFwuXSt8J1teJ10qJ3xcIlteXCJdKlwiKVxccz8kLztcblxuZnVuY3Rpb24gaXNMaXRlcmFsKGV4cCkge1xuICByZXR1cm4gbGl0ZXJhbFZhbHVlUkUudGVzdChleHApO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RyaW5nIHN0YXJ0cyB3aXRoICQgb3IgX1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gaXNSZXNlcnZlZChzdHIpIHtcbiAgdmFyIGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMCk7XG4gIHJldHVybiBjID09PSAweDI0IHx8IGMgPT09IDB4NUY7XG59XG5cbi8qKlxuICogR3VhcmQgdGV4dCBvdXRwdXQsIG1ha2Ugc3VyZSB1bmRlZmluZWQgb3V0cHV0c1xuICogZW1wdHkgc3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIF90b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUudG9TdHJpbmcoKTtcbn1cblxuLyoqXG4gKiBDaGVjayBhbmQgY29udmVydCBwb3NzaWJsZSBudW1lcmljIHN0cmluZ3MgdG8gbnVtYmVyc1xuICogYmVmb3JlIHNldHRpbmcgYmFjayB0byBkYXRhXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7KnxOdW1iZXJ9XG4gKi9cblxuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnNlZCA9IE51bWJlcih2YWx1ZSk7XG4gICAgcmV0dXJuIGlzTmFOKHBhcnNlZCkgPyB2YWx1ZSA6IHBhcnNlZDtcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgc3RyaW5nIGJvb2xlYW4gbGl0ZXJhbHMgaW50byByZWFsIGJvb2xlYW5zLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp8Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiB0b0Jvb2xlYW4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogdmFsdWUgPT09ICdmYWxzZScgPyBmYWxzZSA6IHZhbHVlO1xufVxuXG4vKipcbiAqIFN0cmlwIHF1b3RlcyBmcm9tIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nIHwgZmFsc2V9XG4gKi9cblxuZnVuY3Rpb24gc3RyaXBRdW90ZXMoc3RyKSB7XG4gIHZhciBhID0gc3RyLmNoYXJDb2RlQXQoMCk7XG4gIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoc3RyLmxlbmd0aCAtIDEpO1xuICByZXR1cm4gYSA9PT0gYiAmJiAoYSA9PT0gMHgyMiB8fCBhID09PSAweDI3KSA/IHN0ci5zbGljZSgxLCAtMSkgOiBzdHI7XG59XG5cbi8qKlxuICogQ2FtZWxpemUgYSBoeXBoZW4tZGVsbWl0ZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG52YXIgY2FtZWxpemVSRSA9IC8tKFxcdykvZztcblxuZnVuY3Rpb24gY2FtZWxpemUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbGl6ZVJFLCB0b1VwcGVyKTtcbn1cblxuZnVuY3Rpb24gdG9VcHBlcihfLCBjKSB7XG4gIHJldHVybiBjID8gYy50b1VwcGVyQ2FzZSgpIDogJyc7XG59XG5cbi8qKlxuICogSHlwaGVuYXRlIGEgY2FtZWxDYXNlIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGh5cGhlbmF0ZVJFID0gLyhbYS16XFxkXSkoW0EtWl0pL2c7XG5cbmZ1bmN0aW9uIGh5cGhlbmF0ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGh5cGhlbi91bmRlcnNjb3JlL3NsYXNoIGRlbGltaXRlcmVkIG5hbWVzIGludG9cbiAqIGNhbWVsaXplZCBjbGFzc05hbWVzLlxuICpcbiAqIGUuZy4gbXktY29tcG9uZW50ID0+IE15Q29tcG9uZW50XG4gKiAgICAgIHNvbWVfZWxzZSAgICA9PiBTb21lRWxzZVxuICogICAgICBzb21lL2NvbXAgICAgPT4gU29tZUNvbXBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNsYXNzaWZ5UkUgPSAvKD86XnxbLV9cXC9dKShcXHcpL2c7XG5cbmZ1bmN0aW9uIGNsYXNzaWZ5KHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2xhc3NpZnlSRSwgdG9VcHBlcik7XG59XG5cbi8qKlxuICogU2ltcGxlIGJpbmQsIGZhc3RlciB0aGFuIG5hdGl2ZVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBiaW5kKGZuLCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHJldHVybiBsID8gbCA+IDEgPyBmbi5hcHBseShjdHgsIGFyZ3VtZW50cykgOiBmbi5jYWxsKGN0eCwgYSkgOiBmbi5jYWxsKGN0eCk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBBcnJheS1saWtlIG9iamVjdCB0byBhIHJlYWwgQXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheS1saWtlfSBsaXN0XG4gKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0XSAtIHN0YXJ0IGluZGV4XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiB0b0FycmF5KGxpc3QsIHN0YXJ0KSB7XG4gIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgdmFyIGkgPSBsaXN0Lmxlbmd0aCAtIHN0YXJ0O1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGkpO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgcmV0W2ldID0gbGlzdFtpICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogTWl4IHByb3BlcnRpZXMgaW50byB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b1xuICogQHBhcmFtIHtPYmplY3R9IGZyb21cbiAqL1xuXG5mdW5jdGlvbiBleHRlbmQodG8sIGZyb20pIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcm9tKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gdG87XG59XG5cbi8qKlxuICogUXVpY2sgb2JqZWN0IGNoZWNrIC0gdGhpcyBpcyBwcmltYXJpbHkgdXNlZCB0byB0ZWxsXG4gKiBPYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcyB3aGVuIHdlIGtub3cgdGhlIHZhbHVlXG4gKiBpcyBhIEpTT04tY29tcGxpYW50IHR5cGUuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogU3RyaWN0IG9iamVjdCB0eXBlIGNoZWNrLiBPbmx5IHJldHVybnMgdHJ1ZVxuICogZm9yIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIE9CSkVDVF9TVFJJTkcgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gT0JKRUNUX1NUUklORztcbn1cblxuLyoqXG4gKiBBcnJheSB0eXBlIGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBEZWZpbmUgYSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBbZW51bWVyYWJsZV1cbiAqL1xuXG5mdW5jdGlvbiBkZWYob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICB2YWx1ZTogdmFsLFxuICAgIGVudW1lcmFibGU6ICEhZW51bWVyYWJsZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8qKlxuICogRGVib3VuY2UgYSBmdW5jdGlvbiBzbyBpdCBvbmx5IGdldHMgY2FsbGVkIGFmdGVyIHRoZVxuICogaW5wdXQgc3RvcHMgYXJyaXZpbmcgYWZ0ZXIgdGhlIGdpdmVuIHdhaXQgcGVyaW9kLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmNcbiAqIEBwYXJhbSB7TnVtYmVyfSB3YWl0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKi9cblxuZnVuY3Rpb24gX2RlYm91bmNlKGZ1bmMsIHdhaXQpIHtcbiAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IERhdGUubm93KCkgLSB0aW1lc3RhbXA7XG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuICB9O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBNYW51YWwgaW5kZXhPZiBiZWNhdXNlIGl0J3Mgc2xpZ2h0bHkgZmFzdGVyIHRoYW5cbiAqIG5hdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKi9cblxuZnVuY3Rpb24gaW5kZXhPZihhcnIsIG9iaikge1xuICB2YXIgaSA9IGFyci5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAoYXJyW2ldID09PSBvYmopIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBNYWtlIGEgY2FuY2VsbGFibGUgdmVyc2lvbiBvZiBhbiBhc3luYyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY2FuY2VsbGFibGUoZm4pIHtcbiAgdmFyIGNiID0gZnVuY3Rpb24gY2IoKSB7XG4gICAgaWYgKCFjYi5jYW5jZWxsZWQpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbiAgY2IuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgIGNiLmNhbmNlbGxlZCA9IHRydWU7XG4gIH07XG4gIHJldHVybiBjYjtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0d28gdmFsdWVzIGFyZSBsb29zZWx5IGVxdWFsIC0gdGhhdCBpcyxcbiAqIGlmIHRoZXkgYXJlIHBsYWluIG9iamVjdHMsIGRvIHRoZXkgaGF2ZSB0aGUgc2FtZSBzaGFwZT9cbiAqXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBsb29zZUVxdWFsKGEsIGIpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG4gIHJldHVybiBhID09IGIgfHwgKGlzT2JqZWN0KGEpICYmIGlzT2JqZWN0KGIpID8gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpIDogZmFsc2UpO1xuICAvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xufVxuXG52YXIgaGFzUHJvdG8gPSAoJ19fcHJvdG9fXycgaW4ge30pO1xuXG4vLyBCcm93c2VyIGVudmlyb25tZW50IHNuaWZmaW5nXG52YXIgaW5Ccm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdykgIT09ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vLyBkZXRlY3QgZGV2dG9vbHNcbnZhciBkZXZ0b29scyA9IGluQnJvd3NlciAmJiB3aW5kb3cuX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXztcblxuLy8gVUEgc25pZmZpbmcgZm9yIHdvcmtpbmcgYXJvdW5kIGJyb3dzZXItc3BlY2lmaWMgcXVpcmtzXG52YXIgVUEgPSBpbkJyb3dzZXIgJiYgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbnZhciBpc0lFOSA9IFVBICYmIFVBLmluZGV4T2YoJ21zaWUgOS4wJykgPiAwO1xudmFyIGlzQW5kcm9pZCA9IFVBICYmIFVBLmluZGV4T2YoJ2FuZHJvaWQnKSA+IDA7XG5cbnZhciB0cmFuc2l0aW9uUHJvcCA9IHVuZGVmaW5lZDtcbnZhciB0cmFuc2l0aW9uRW5kRXZlbnQgPSB1bmRlZmluZWQ7XG52YXIgYW5pbWF0aW9uUHJvcCA9IHVuZGVmaW5lZDtcbnZhciBhbmltYXRpb25FbmRFdmVudCA9IHVuZGVmaW5lZDtcblxuLy8gVHJhbnNpdGlvbiBwcm9wZXJ0eS9ldmVudCBzbmlmZmluZ1xuaWYgKGluQnJvd3NlciAmJiAhaXNJRTkpIHtcbiAgdmFyIGlzV2Via2l0VHJhbnMgPSB3aW5kb3cub250cmFuc2l0aW9uZW5kID09PSB1bmRlZmluZWQgJiYgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkO1xuICB2YXIgaXNXZWJraXRBbmltID0gd2luZG93Lm9uYW5pbWF0aW9uZW5kID09PSB1bmRlZmluZWQgJiYgd2luZG93Lm9ud2Via2l0YW5pbWF0aW9uZW5kICE9PSB1bmRlZmluZWQ7XG4gIHRyYW5zaXRpb25Qcm9wID0gaXNXZWJraXRUcmFucyA/ICdXZWJraXRUcmFuc2l0aW9uJyA6ICd0cmFuc2l0aW9uJztcbiAgdHJhbnNpdGlvbkVuZEV2ZW50ID0gaXNXZWJraXRUcmFucyA/ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyA6ICd0cmFuc2l0aW9uZW5kJztcbiAgYW5pbWF0aW9uUHJvcCA9IGlzV2Via2l0QW5pbSA/ICdXZWJraXRBbmltYXRpb24nIDogJ2FuaW1hdGlvbic7XG4gIGFuaW1hdGlvbkVuZEV2ZW50ID0gaXNXZWJraXRBbmltID8gJ3dlYmtpdEFuaW1hdGlvbkVuZCcgOiAnYW5pbWF0aW9uZW5kJztcbn1cblxuLyoqXG4gKiBEZWZlciBhIHRhc2sgdG8gZXhlY3V0ZSBpdCBhc3luY2hyb25vdXNseS4gSWRlYWxseSB0aGlzXG4gKiBzaG91bGQgYmUgZXhlY3V0ZWQgYXMgYSBtaWNyb3Rhc2ssIHNvIHdlIGxldmVyYWdlXG4gKiBNdXRhdGlvbk9ic2VydmVyIGlmIGl0J3MgYXZhaWxhYmxlLCBhbmQgZmFsbGJhY2sgdG9cbiAqIHNldFRpbWVvdXQoMCkuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqL1xuXG52YXIgbmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgY2FsbGJhY2tzID0gW107XG4gIHZhciBwZW5kaW5nID0gZmFsc2U7XG4gIHZhciB0aW1lckZ1bmM7XG4gIGZ1bmN0aW9uIG5leHRUaWNrSGFuZGxlcigpIHtcbiAgICBwZW5kaW5nID0gZmFsc2U7XG4gICAgdmFyIGNvcGllcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBjYWxsYmFja3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvcGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29waWVzW2ldKCk7XG4gICAgfVxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICh0eXBlb2YgTXV0YXRpb25PYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobmV4dFRpY2tIYW5kbGVyKTtcbiAgICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb3VudGVyKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRleHROb2RlLCB7XG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gICAgfSk7XG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyO1xuICAgICAgdGV4dE5vZGUuZGF0YSA9IGNvdW50ZXI7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyB3ZWJwYWNrIGF0dGVtcHRzIHRvIGluamVjdCBhIHNoaW0gZm9yIHNldEltbWVkaWF0ZVxuICAgIC8vIGlmIGl0IGlzIHVzZWQgYXMgYSBnbG9iYWwsIHNvIHdlIGhhdmUgdG8gd29yayBhcm91bmQgdGhhdCB0b1xuICAgIC8vIGF2b2lkIGJ1bmRsaW5nIHVubmVjZXNzYXJ5IGNvZGUuXG4gICAgdmFyIGNvbnRleHQgPSBpbkJyb3dzZXIgPyB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHt9O1xuICAgIHRpbWVyRnVuYyA9IGNvbnRleHQuc2V0SW1tZWRpYXRlIHx8IHNldFRpbWVvdXQ7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChjYiwgY3R4KSB7XG4gICAgdmFyIGZ1bmMgPSBjdHggPyBmdW5jdGlvbiAoKSB7XG4gICAgICBjYi5jYWxsKGN0eCk7XG4gICAgfSA6IGNiO1xuICAgIGNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xuICAgIGlmIChwZW5kaW5nKSByZXR1cm47XG4gICAgcGVuZGluZyA9IHRydWU7XG4gICAgdGltZXJGdW5jKG5leHRUaWNrSGFuZGxlciwgMCk7XG4gIH07XG59KSgpO1xuXG5mdW5jdGlvbiBDYWNoZShsaW1pdCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLmxpbWl0ID0gbGltaXQ7XG4gIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fa2V5bWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxudmFyIHAgPSBDYWNoZS5wcm90b3R5cGU7XG5cbi8qKlxuICogUHV0IDx2YWx1ZT4gaW50byB0aGUgY2FjaGUgYXNzb2NpYXRlZCB3aXRoIDxrZXk+LlxuICogUmV0dXJucyB0aGUgZW50cnkgd2hpY2ggd2FzIHJlbW92ZWQgdG8gbWFrZSByb29tIGZvclxuICogdGhlIG5ldyBlbnRyeS4gT3RoZXJ3aXNlIHVuZGVmaW5lZCBpcyByZXR1cm5lZC5cbiAqIChpLmUuIGlmIHRoZXJlIHdhcyBlbm91Z2ggcm9vbSBhbHJlYWR5KS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtFbnRyeXx1bmRlZmluZWR9XG4gKi9cblxucC5wdXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgcmVtb3ZlZDtcbiAgaWYgKHRoaXMuc2l6ZSA9PT0gdGhpcy5saW1pdCkge1xuICAgIHJlbW92ZWQgPSB0aGlzLnNoaWZ0KCk7XG4gIH1cblxuICB2YXIgZW50cnkgPSB0aGlzLmdldChrZXksIHRydWUpO1xuICBpZiAoIWVudHJ5KSB7XG4gICAgZW50cnkgPSB7XG4gICAgICBrZXk6IGtleVxuICAgIH07XG4gICAgdGhpcy5fa2V5bWFwW2tleV0gPSBlbnRyeTtcbiAgICBpZiAodGhpcy50YWlsKSB7XG4gICAgICB0aGlzLnRhaWwubmV3ZXIgPSBlbnRyeTtcbiAgICAgIGVudHJ5Lm9sZGVyID0gdGhpcy50YWlsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWQgPSBlbnRyeTtcbiAgICB9XG4gICAgdGhpcy50YWlsID0gZW50cnk7XG4gICAgdGhpcy5zaXplKys7XG4gIH1cbiAgZW50cnkudmFsdWUgPSB2YWx1ZTtcblxuICByZXR1cm4gcmVtb3ZlZDtcbn07XG5cbi8qKlxuICogUHVyZ2UgdGhlIGxlYXN0IHJlY2VudGx5IHVzZWQgKG9sZGVzdCkgZW50cnkgZnJvbSB0aGVcbiAqIGNhY2hlLiBSZXR1cm5zIHRoZSByZW1vdmVkIGVudHJ5IG9yIHVuZGVmaW5lZCBpZiB0aGVcbiAqIGNhY2hlIHdhcyBlbXB0eS5cbiAqL1xuXG5wLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZW50cnkgPSB0aGlzLmhlYWQ7XG4gIGlmIChlbnRyeSkge1xuICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXdlcjtcbiAgICB0aGlzLmhlYWQub2xkZXIgPSB1bmRlZmluZWQ7XG4gICAgZW50cnkubmV3ZXIgPSBlbnRyeS5vbGRlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9rZXltYXBbZW50cnkua2V5XSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNpemUtLTtcbiAgfVxuICByZXR1cm4gZW50cnk7XG59O1xuXG4vKipcbiAqIEdldCBhbmQgcmVnaXN0ZXIgcmVjZW50IHVzZSBvZiA8a2V5Pi4gUmV0dXJucyB0aGUgdmFsdWVcbiAqIGFzc29jaWF0ZWQgd2l0aCA8a2V5PiBvciB1bmRlZmluZWQgaWYgbm90IGluIGNhY2hlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmV0dXJuRW50cnlcbiAqIEByZXR1cm4ge0VudHJ5fCp9XG4gKi9cblxucC5nZXQgPSBmdW5jdGlvbiAoa2V5LCByZXR1cm5FbnRyeSkge1xuICB2YXIgZW50cnkgPSB0aGlzLl9rZXltYXBba2V5XTtcbiAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgaWYgKGVudHJ5ID09PSB0aGlzLnRhaWwpIHtcbiAgICByZXR1cm4gcmV0dXJuRW50cnkgPyBlbnRyeSA6IGVudHJ5LnZhbHVlO1xuICB9XG4gIC8vIEhFQUQtLS0tLS0tLS0tLS0tLVRBSUxcbiAgLy8gICA8Lm9sZGVyICAgLm5ld2VyPlxuICAvLyAgPC0tLSBhZGQgZGlyZWN0aW9uIC0tXG4gIC8vICAgQSAgQiAgQyAgPEQ+ICBFXG4gIGlmIChlbnRyeS5uZXdlcikge1xuICAgIGlmIChlbnRyeSA9PT0gdGhpcy5oZWFkKSB7XG4gICAgICB0aGlzLmhlYWQgPSBlbnRyeS5uZXdlcjtcbiAgICB9XG4gICAgZW50cnkubmV3ZXIub2xkZXIgPSBlbnRyeS5vbGRlcjsgLy8gQyA8LS0gRS5cbiAgfVxuICBpZiAoZW50cnkub2xkZXIpIHtcbiAgICBlbnRyeS5vbGRlci5uZXdlciA9IGVudHJ5Lm5ld2VyOyAvLyBDLiAtLT4gRVxuICB9XG4gIGVudHJ5Lm5ld2VyID0gdW5kZWZpbmVkOyAvLyBEIC0teFxuICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbDsgLy8gRC4gLS0+IEVcbiAgaWYgKHRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbC5uZXdlciA9IGVudHJ5OyAvLyBFLiA8LS0gRFxuICB9XG4gIHRoaXMudGFpbCA9IGVudHJ5O1xuICByZXR1cm4gcmV0dXJuRW50cnkgPyBlbnRyeSA6IGVudHJ5LnZhbHVlO1xufTtcblxudmFyIGNhY2hlJDEgPSBuZXcgQ2FjaGUoMTAwMCk7XG52YXIgZmlsdGVyVG9rZW5SRSA9IC9bXlxccydcIl0rfCdbXiddKid8XCJbXlwiXSpcIi9nO1xudmFyIHJlc2VydmVkQXJnUkUgPSAvXmluJHxeLT9cXGQrLztcblxuLyoqXG4gKiBQYXJzZXIgc3RhdGVcbiAqL1xuXG52YXIgc3RyO1xudmFyIGRpcjtcbnZhciBjO1xudmFyIHByZXY7XG52YXIgaTtcbnZhciBsO1xudmFyIGxhc3RGaWx0ZXJJbmRleDtcbnZhciBpblNpbmdsZTtcbnZhciBpbkRvdWJsZTtcbnZhciBjdXJseTtcbnZhciBzcXVhcmU7XG52YXIgcGFyZW47XG4vKipcbiAqIFB1c2ggYSBmaWx0ZXIgdG8gdGhlIGN1cnJlbnQgZGlyZWN0aXZlIG9iamVjdFxuICovXG5cbmZ1bmN0aW9uIHB1c2hGaWx0ZXIoKSB7XG4gIHZhciBleHAgPSBzdHIuc2xpY2UobGFzdEZpbHRlckluZGV4LCBpKS50cmltKCk7XG4gIHZhciBmaWx0ZXI7XG4gIGlmIChleHApIHtcbiAgICBmaWx0ZXIgPSB7fTtcbiAgICB2YXIgdG9rZW5zID0gZXhwLm1hdGNoKGZpbHRlclRva2VuUkUpO1xuICAgIGZpbHRlci5uYW1lID0gdG9rZW5zWzBdO1xuICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMSkge1xuICAgICAgZmlsdGVyLmFyZ3MgPSB0b2tlbnMuc2xpY2UoMSkubWFwKHByb2Nlc3NGaWx0ZXJBcmcpO1xuICAgIH1cbiAgfVxuICBpZiAoZmlsdGVyKSB7XG4gICAgKGRpci5maWx0ZXJzID0gZGlyLmZpbHRlcnMgfHwgW10pLnB1c2goZmlsdGVyKTtcbiAgfVxuICBsYXN0RmlsdGVySW5kZXggPSBpICsgMTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBhcmd1bWVudCBpcyBkeW5hbWljIGFuZCBzdHJpcCBxdW90ZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyZ1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3NGaWx0ZXJBcmcoYXJnKSB7XG4gIGlmIChyZXNlcnZlZEFyZ1JFLnRlc3QoYXJnKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdG9OdW1iZXIoYXJnKSxcbiAgICAgIGR5bmFtaWM6IGZhbHNlXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc3RyaXBwZWQgPSBzdHJpcFF1b3RlcyhhcmcpO1xuICAgIHZhciBkeW5hbWljID0gc3RyaXBwZWQgPT09IGFyZztcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGR5bmFtaWMgPyBhcmcgOiBzdHJpcHBlZCxcbiAgICAgIGR5bmFtaWM6IGR5bmFtaWNcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUGFyc2UgYSBkaXJlY3RpdmUgdmFsdWUgYW5kIGV4dHJhY3QgdGhlIGV4cHJlc3Npb25cbiAqIGFuZCBpdHMgZmlsdGVycyBpbnRvIGEgZGVzY3JpcHRvci5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIFwiYSArIDEgfCB1cHBlcmNhc2VcIiB3aWxsIHlpZWxkOlxuICoge1xuICogICBleHByZXNzaW9uOiAnYSArIDEnLFxuICogICBmaWx0ZXJzOiBbXG4gKiAgICAgeyBuYW1lOiAndXBwZXJjYXNlJywgYXJnczogbnVsbCB9XG4gKiAgIF1cbiAqIH1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlRGlyZWN0aXZlKHMpIHtcbiAgdmFyIGhpdCA9IGNhY2hlJDEuZ2V0KHMpO1xuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdDtcbiAgfVxuXG4gIC8vIHJlc2V0IHBhcnNlciBzdGF0ZVxuICBzdHIgPSBzO1xuICBpblNpbmdsZSA9IGluRG91YmxlID0gZmFsc2U7XG4gIGN1cmx5ID0gc3F1YXJlID0gcGFyZW4gPSAwO1xuICBsYXN0RmlsdGVySW5kZXggPSAwO1xuICBkaXIgPSB7fTtcblxuICBmb3IgKGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHByZXYgPSBjO1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoaW5TaW5nbGUpIHtcbiAgICAgIC8vIGNoZWNrIHNpbmdsZSBxdW90ZVxuICAgICAgaWYgKGMgPT09IDB4MjcgJiYgcHJldiAhPT0gMHg1QykgaW5TaW5nbGUgPSAhaW5TaW5nbGU7XG4gICAgfSBlbHNlIGlmIChpbkRvdWJsZSkge1xuICAgICAgLy8gY2hlY2sgZG91YmxlIHF1b3RlXG4gICAgICBpZiAoYyA9PT0gMHgyMiAmJiBwcmV2ICE9PSAweDVDKSBpbkRvdWJsZSA9ICFpbkRvdWJsZTtcbiAgICB9IGVsc2UgaWYgKGMgPT09IDB4N0MgJiYgLy8gcGlwZVxuICAgIHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAhPT0gMHg3QyAmJiBzdHIuY2hhckNvZGVBdChpIC0gMSkgIT09IDB4N0MpIHtcbiAgICAgIGlmIChkaXIuZXhwcmVzc2lvbiA9PSBudWxsKSB7XG4gICAgICAgIC8vIGZpcnN0IGZpbHRlciwgZW5kIG9mIGV4cHJlc3Npb25cbiAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDE7XG4gICAgICAgIGRpci5leHByZXNzaW9uID0gc3RyLnNsaWNlKDAsIGkpLnRyaW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFscmVhZHkgaGFzIGZpbHRlclxuICAgICAgICBwdXNoRmlsdGVyKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICBjYXNlIDB4MjI6XG4gICAgICAgICAgaW5Eb3VibGUgPSB0cnVlO2JyZWFrOyAvLyBcIlxuICAgICAgICBjYXNlIDB4Mjc6XG4gICAgICAgICAgaW5TaW5nbGUgPSB0cnVlO2JyZWFrOyAvLyAnXG4gICAgICAgIGNhc2UgMHgyODpcbiAgICAgICAgICBwYXJlbisrO2JyZWFrOyAvLyAoXG4gICAgICAgIGNhc2UgMHgyOTpcbiAgICAgICAgICBwYXJlbi0tO2JyZWFrOyAvLyApXG4gICAgICAgIGNhc2UgMHg1QjpcbiAgICAgICAgICBzcXVhcmUrKzticmVhazsgLy8gW1xuICAgICAgICBjYXNlIDB4NUQ6XG4gICAgICAgICAgc3F1YXJlLS07YnJlYWs7IC8vIF1cbiAgICAgICAgY2FzZSAweDdCOlxuICAgICAgICAgIGN1cmx5Kys7YnJlYWs7IC8vIHtcbiAgICAgICAgY2FzZSAweDdEOlxuICAgICAgICAgIGN1cmx5LS07YnJlYWs7IC8vIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZGlyLmV4cHJlc3Npb24gPT0gbnVsbCkge1xuICAgIGRpci5leHByZXNzaW9uID0gc3RyLnNsaWNlKDAsIGkpLnRyaW0oKTtcbiAgfSBlbHNlIGlmIChsYXN0RmlsdGVySW5kZXggIT09IDApIHtcbiAgICBwdXNoRmlsdGVyKCk7XG4gIH1cblxuICBjYWNoZSQxLnB1dChzLCBkaXIpO1xuICByZXR1cm4gZGlyO1xufVxuXG52YXIgZGlyZWN0aXZlID0gT2JqZWN0LmZyZWV6ZSh7XG4gIHBhcnNlRGlyZWN0aXZlOiBwYXJzZURpcmVjdGl2ZVxufSk7XG5cbnZhciByZWdleEVzY2FwZVJFID0gL1stLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZztcbnZhciBjYWNoZSA9IHVuZGVmaW5lZDtcbnZhciB0YWdSRSA9IHVuZGVmaW5lZDtcbnZhciBodG1sUkUgPSB1bmRlZmluZWQ7XG4vKipcbiAqIEVzY2FwZSBhIHN0cmluZyBzbyBpdCBjYW4gYmUgdXNlZCBpbiBhIFJlZ0V4cFxuICogY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhFc2NhcGVSRSwgJ1xcXFwkJicpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlUmVnZXgoKSB7XG4gIHZhciBvcGVuID0gZXNjYXBlUmVnZXgoY29uZmlnLmRlbGltaXRlcnNbMF0pO1xuICB2YXIgY2xvc2UgPSBlc2NhcGVSZWdleChjb25maWcuZGVsaW1pdGVyc1sxXSk7XG4gIHZhciB1bnNhZmVPcGVuID0gZXNjYXBlUmVnZXgoY29uZmlnLnVuc2FmZURlbGltaXRlcnNbMF0pO1xuICB2YXIgdW5zYWZlQ2xvc2UgPSBlc2NhcGVSZWdleChjb25maWcudW5zYWZlRGVsaW1pdGVyc1sxXSk7XG4gIHRhZ1JFID0gbmV3IFJlZ0V4cCh1bnNhZmVPcGVuICsgJyguKz8pJyArIHVuc2FmZUNsb3NlICsgJ3wnICsgb3BlbiArICcoLis/KScgKyBjbG9zZSwgJ2cnKTtcbiAgaHRtbFJFID0gbmV3IFJlZ0V4cCgnXicgKyB1bnNhZmVPcGVuICsgJy4qJyArIHVuc2FmZUNsb3NlICsgJyQnKTtcbiAgLy8gcmVzZXQgY2FjaGVcbiAgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMCk7XG59XG5cbi8qKlxuICogUGFyc2UgYSB0ZW1wbGF0ZSB0ZXh0IHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7QXJyYXk8T2JqZWN0PiB8IG51bGx9XG4gKiAgICAgICAgICAgICAgIC0ge1N0cmluZ30gdHlwZVxuICogICAgICAgICAgICAgICAtIHtTdHJpbmd9IHZhbHVlXG4gKiAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtodG1sXVxuICogICAgICAgICAgICAgICAtIHtCb29sZWFufSBbb25lVGltZV1cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZVRleHQodGV4dCkge1xuICBpZiAoIWNhY2hlKSB7XG4gICAgY29tcGlsZVJlZ2V4KCk7XG4gIH1cbiAgdmFyIGhpdCA9IGNhY2hlLmdldCh0ZXh0KTtcbiAgaWYgKGhpdCkge1xuICAgIHJldHVybiBoaXQ7XG4gIH1cbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxuL2csICcnKTtcbiAgaWYgKCF0YWdSRS50ZXN0KHRleHQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHRva2VucyA9IFtdO1xuICB2YXIgbGFzdEluZGV4ID0gdGFnUkUubGFzdEluZGV4ID0gMDtcbiAgdmFyIG1hdGNoLCBpbmRleCwgaHRtbCwgdmFsdWUsIGZpcnN0LCBvbmVUaW1lO1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuICB3aGlsZSAobWF0Y2ggPSB0YWdSRS5leGVjKHRleHQpKSB7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuICAgIGluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgLy8gcHVzaCB0ZXh0IHRva2VuXG4gICAgaWYgKGluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHZhbHVlOiB0ZXh0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gdGFnIHRva2VuXG4gICAgaHRtbCA9IGh0bWxSRS50ZXN0KG1hdGNoWzBdKTtcbiAgICB2YWx1ZSA9IGh0bWwgPyBtYXRjaFsxXSA6IG1hdGNoWzJdO1xuICAgIGZpcnN0ID0gdmFsdWUuY2hhckNvZGVBdCgwKTtcbiAgICBvbmVUaW1lID0gZmlyc3QgPT09IDQyOyAvLyAqXG4gICAgdmFsdWUgPSBvbmVUaW1lID8gdmFsdWUuc2xpY2UoMSkgOiB2YWx1ZTtcbiAgICB0b2tlbnMucHVzaCh7XG4gICAgICB0YWc6IHRydWUsXG4gICAgICB2YWx1ZTogdmFsdWUudHJpbSgpLFxuICAgICAgaHRtbDogaHRtbCxcbiAgICAgIG9uZVRpbWU6IG9uZVRpbWVcbiAgICB9KTtcbiAgICBsYXN0SW5kZXggPSBpbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaCh7XG4gICAgICB2YWx1ZTogdGV4dC5zbGljZShsYXN0SW5kZXgpXG4gICAgfSk7XG4gIH1cbiAgY2FjaGUucHV0KHRleHQsIHRva2Vucyk7XG4gIHJldHVybiB0b2tlbnM7XG59XG5cbi8qKlxuICogRm9ybWF0IGEgbGlzdCBvZiB0b2tlbnMgaW50byBhbiBleHByZXNzaW9uLlxuICogZS5nLiB0b2tlbnMgcGFyc2VkIGZyb20gJ2Ege3tifX0gYycgY2FuIGJlIHNlcmlhbGl6ZWRcbiAqIGludG8gb25lIHNpbmdsZSBleHByZXNzaW9uIGFzICdcImEgXCIgKyBiICsgXCIgY1wiJy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7VnVlfSBbdm1dXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdG9rZW5zVG9FeHAodG9rZW5zLCB2bSkge1xuICBpZiAodG9rZW5zLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgIHJldHVybiBmb3JtYXRUb2tlbih0b2tlbiwgdm0pO1xuICAgIH0pLmpvaW4oJysnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZm9ybWF0VG9rZW4odG9rZW5zWzBdLCB2bSwgdHJ1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBzaW5nbGUgdG9rZW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICogQHBhcmFtIHtCb29sZWFufSBbc2luZ2xlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdFRva2VuKHRva2VuLCB2bSwgc2luZ2xlKSB7XG4gIHJldHVybiB0b2tlbi50YWcgPyB0b2tlbi5vbmVUaW1lICYmIHZtID8gJ1wiJyArIHZtLiRldmFsKHRva2VuLnZhbHVlKSArICdcIicgOiBpbmxpbmVGaWx0ZXJzKHRva2VuLnZhbHVlLCBzaW5nbGUpIDogJ1wiJyArIHRva2VuLnZhbHVlICsgJ1wiJztcbn1cblxuLyoqXG4gKiBGb3IgYW4gYXR0cmlidXRlIHdpdGggbXVsdGlwbGUgaW50ZXJwb2xhdGlvbiB0YWdzLFxuICogZS5nLiBhdHRyPVwic29tZS17e3RoaW5nIHwgZmlsdGVyfX1cIiwgaW4gb3JkZXIgdG8gY29tYmluZVxuICogdGhlIHdob2xlIHRoaW5nIGludG8gYSBzaW5nbGUgd2F0Y2hhYmxlIGV4cHJlc3Npb24sIHdlXG4gKiBoYXZlIHRvIGlubGluZSB0aG9zZSBmaWx0ZXJzLiBUaGlzIGZ1bmN0aW9uIGRvZXMgZXhhY3RseVxuICogdGhhdC4gVGhpcyBpcyBhIGJpdCBoYWNreSBidXQgaXQgYXZvaWRzIGhlYXZ5IGNoYW5nZXNcbiAqIHRvIGRpcmVjdGl2ZSBwYXJzZXIgYW5kIHdhdGNoZXIgbWVjaGFuaXNtLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2luZ2xlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdLztcbmZ1bmN0aW9uIGlubGluZUZpbHRlcnMoZXhwLCBzaW5nbGUpIHtcbiAgaWYgKCFmaWx0ZXJSRS50ZXN0KGV4cCkpIHtcbiAgICByZXR1cm4gc2luZ2xlID8gZXhwIDogJygnICsgZXhwICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHZhciBkaXIgPSBwYXJzZURpcmVjdGl2ZShleHApO1xuICAgIGlmICghZGlyLmZpbHRlcnMpIHtcbiAgICAgIHJldHVybiAnKCcgKyBleHAgKyAnKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAndGhpcy5fYXBwbHlGaWx0ZXJzKCcgKyBkaXIuZXhwcmVzc2lvbiArIC8vIHZhbHVlXG4gICAgICAnLG51bGwsJyArIC8vIG9sZFZhbHVlIChudWxsIGZvciByZWFkKVxuICAgICAgSlNPTi5zdHJpbmdpZnkoZGlyLmZpbHRlcnMpICsgLy8gZmlsdGVyIGRlc2NyaXB0b3JzXG4gICAgICAnLGZhbHNlKSc7IC8vIHdyaXRlP1xuICAgIH1cbiAgfVxufVxuXG52YXIgdGV4dCA9IE9iamVjdC5mcmVlemUoe1xuICBjb21waWxlUmVnZXg6IGNvbXBpbGVSZWdleCxcbiAgcGFyc2VUZXh0OiBwYXJzZVRleHQsXG4gIHRva2Vuc1RvRXhwOiB0b2tlbnNUb0V4cFxufSk7XG5cbnZhciBkZWxpbWl0ZXJzID0gWyd7eycsICd9fSddO1xudmFyIHVuc2FmZURlbGltaXRlcnMgPSBbJ3t7eycsICd9fX0nXTtcblxudmFyIGNvbmZpZyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHtcblxuICAvKipcbiAgICogV2hldGhlciB0byBwcmludCBkZWJ1ZyBtZXNzYWdlcy5cbiAgICogQWxzbyBlbmFibGVzIHN0YWNrIHRyYWNlIGZvciB3YXJuaW5ncy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIGRlYnVnOiBmYWxzZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBzdXBwcmVzcyB3YXJuaW5ncy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIHNpbGVudDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gdXNlIGFzeW5jIHJlbmRlcmluZy5cbiAgICovXG5cbiAgYXN5bmM6IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gd2FybiBhZ2FpbnN0IGVycm9ycyBjYXVnaHQgd2hlbiBldmFsdWF0aW5nXG4gICAqIGV4cHJlc3Npb25zLlxuICAgKi9cblxuICB3YXJuRXhwcmVzc2lvbkVycm9yczogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBhbGxvdyBkZXZ0b29scyBpbnNwZWN0aW9uLlxuICAgKiBEaXNhYmxlZCBieSBkZWZhdWx0IGluIHByb2R1Y3Rpb24gYnVpbGRzLlxuICAgKi9cblxuICBkZXZ0b29sczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyxcblxuICAvKipcbiAgICogSW50ZXJuYWwgZmxhZyB0byBpbmRpY2F0ZSB0aGUgZGVsaW1pdGVycyBoYXZlIGJlZW5cbiAgICogY2hhbmdlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIF9kZWxpbWl0ZXJzQ2hhbmdlZDogdHJ1ZSxcblxuICAvKipcbiAgICogTGlzdCBvZiBhc3NldCB0eXBlcyB0aGF0IGEgY29tcG9uZW50IGNhbiBvd24uXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG5cbiAgX2Fzc2V0VHlwZXM6IFsnY29tcG9uZW50JywgJ2RpcmVjdGl2ZScsICdlbGVtZW50RGlyZWN0aXZlJywgJ2ZpbHRlcicsICd0cmFuc2l0aW9uJywgJ3BhcnRpYWwnXSxcblxuICAvKipcbiAgICogcHJvcCBiaW5kaW5nIG1vZGVzXG4gICAqL1xuXG4gIF9wcm9wQmluZGluZ01vZGVzOiB7XG4gICAgT05FX1dBWTogMCxcbiAgICBUV09fV0FZOiAxLFxuICAgIE9ORV9USU1FOiAyXG4gIH0sXG5cbiAgLyoqXG4gICAqIE1heCBjaXJjdWxhciB1cGRhdGVzIGFsbG93ZWQgaW4gYSBiYXRjaGVyIGZsdXNoIGN5Y2xlLlxuICAgKi9cblxuICBfbWF4VXBkYXRlQ291bnQ6IDEwMFxuXG59LCB7XG4gIGRlbGltaXRlcnM6IHsgLyoqXG4gICAgICAgICAgICAgICAgICogSW50ZXJwb2xhdGlvbiBkZWxpbWl0ZXJzLiBDaGFuZ2luZyB0aGVzZSB3b3VsZCB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgICogdGhlIHRleHQgcGFyc2VyIHRvIHJlLWNvbXBpbGUgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cbiAgICAgICAgICAgICAgICAgKi9cblxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIGRlbGltaXRlcnM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWwpIHtcbiAgICAgIGRlbGltaXRlcnMgPSB2YWw7XG4gICAgICBjb21waWxlUmVnZXgoKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH0sXG4gIHVuc2FmZURlbGltaXRlcnM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB1bnNhZmVEZWxpbWl0ZXJzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsKSB7XG4gICAgICB1bnNhZmVEZWxpbWl0ZXJzID0gdmFsO1xuICAgICAgY29tcGlsZVJlZ2V4KCk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxuICB9XG59KTtcblxudmFyIHdhcm4gPSB1bmRlZmluZWQ7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc0NvbnNvbGUgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgd2FybiA9IGZ1bmN0aW9uIChtc2csIGUpIHtcbiAgICAgIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCB8fCBjb25maWcuZGVidWcpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignW1Z1ZSB3YXJuXTogJyArIG1zZyk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihuZXcgRXJyb3IoJ1dhcm5pbmcgU3RhY2sgVHJhY2UnKS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcbn1cblxuLyoqXG4gKiBBcHBlbmQgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5mdW5jdGlvbiBhcHBlbmRXaXRoVHJhbnNpdGlvbihlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHlUcmFuc2l0aW9uKGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKTtcbiAgfSwgdm0sIGNiKTtcbn1cblxuLyoqXG4gKiBJbnNlcnRCZWZvcmUgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5mdW5jdGlvbiBiZWZvcmVXaXRoVHJhbnNpdGlvbihlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHlUcmFuc2l0aW9uKGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlKGVsLCB0YXJnZXQpO1xuICB9LCB2bSwgY2IpO1xufVxuXG4vKipcbiAqIFJlbW92ZSB3aXRoIHRyYW5zaXRpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlV2l0aFRyYW5zaXRpb24oZWwsIHZtLCBjYikge1xuICBhcHBseVRyYW5zaXRpb24oZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVtb3ZlKGVsKTtcbiAgfSwgdm0sIGNiKTtcbn1cblxuLyoqXG4gKiBBcHBseSB0cmFuc2l0aW9ucyB3aXRoIGFuIG9wZXJhdGlvbiBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uXG4gKiAgICAgICAgICAgICAgICAgIDE6IGVudGVyXG4gKiAgICAgICAgICAgICAgICAgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHRoZSBhY3R1YWwgRE9NIG9wZXJhdGlvblxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uKGVsLCBkaXJlY3Rpb24sIG9wLCB2bSwgY2IpIHtcbiAgdmFyIHRyYW5zaXRpb24gPSBlbC5fX3ZfdHJhbnM7XG4gIGlmICghdHJhbnNpdGlvbiB8fFxuICAvLyBza2lwIGlmIHRoZXJlIGFyZSBubyBqcyBob29rcyBhbmQgQ1NTIHRyYW5zaXRpb24gaXNcbiAgLy8gbm90IHN1cHBvcnRlZFxuICAhdHJhbnNpdGlvbi5ob29rcyAmJiAhdHJhbnNpdGlvbkVuZEV2ZW50IHx8XG4gIC8vIHNraXAgdHJhbnNpdGlvbnMgZm9yIGluaXRpYWwgY29tcGlsZVxuICAhdm0uX2lzQ29tcGlsZWQgfHxcbiAgLy8gaWYgdGhlIHZtIGlzIGJlaW5nIG1hbmlwdWxhdGVkIGJ5IGEgcGFyZW50IGRpcmVjdGl2ZVxuICAvLyBkdXJpbmcgdGhlIHBhcmVudCdzIGNvbXBpbGF0aW9uIHBoYXNlLCBza2lwIHRoZVxuICAvLyBhbmltYXRpb24uXG4gIHZtLiRwYXJlbnQgJiYgIXZtLiRwYXJlbnQuX2lzQ29tcGlsZWQpIHtcbiAgICBvcCgpO1xuICAgIGlmIChjYikgY2IoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGFjdGlvbiA9IGRpcmVjdGlvbiA+IDAgPyAnZW50ZXInIDogJ2xlYXZlJztcbiAgdHJhbnNpdGlvblthY3Rpb25dKG9wLCBjYik7XG59XG5cbnZhciB0cmFuc2l0aW9uID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGFwcGVuZFdpdGhUcmFuc2l0aW9uOiBhcHBlbmRXaXRoVHJhbnNpdGlvbixcbiAgYmVmb3JlV2l0aFRyYW5zaXRpb246IGJlZm9yZVdpdGhUcmFuc2l0aW9uLFxuICByZW1vdmVXaXRoVHJhbnNpdGlvbjogcmVtb3ZlV2l0aFRyYW5zaXRpb24sXG4gIGFwcGx5VHJhbnNpdGlvbjogYXBwbHlUcmFuc2l0aW9uXG59KTtcblxuLyoqXG4gKiBRdWVyeSBhbiBlbGVtZW50IHNlbGVjdG9yIGlmIGl0J3Mgbm90IGFuIGVsZW1lbnQgYWxyZWFkeS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBxdWVyeShlbCkge1xuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzZWxlY3RvciA9IGVsO1xuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKCdDYW5ub3QgZmluZCBlbGVtZW50OiAnICsgc2VsZWN0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZWw7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBub2RlIGlzIGluIHRoZSBkb2N1bWVudC5cbiAqIE5vdGU6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyBzaG91bGQgd29yayBoZXJlXG4gKiBidXQgYWx3YXlzIHJldHVybnMgZmFsc2UgZm9yIGNvbW1lbnQgbm9kZXMgaW4gcGhhbnRvbWpzLFxuICogbWFraW5nIHVuaXQgdGVzdHMgZGlmZmljdWx0LiBUaGlzIGlzIGZpeGVkIGJ5IGRvaW5nIHRoZVxuICogY29udGFpbnMoKSBjaGVjayBvbiB0aGUgbm9kZSdzIHBhcmVudE5vZGUgaW5zdGVhZCBvZlxuICogdGhlIG5vZGUgaXRzZWxmLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBpbkRvYyhub2RlKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciBwYXJlbnQgPSBub2RlICYmIG5vZGUucGFyZW50Tm9kZTtcbiAgcmV0dXJuIGRvYyA9PT0gbm9kZSB8fCBkb2MgPT09IHBhcmVudCB8fCAhIShwYXJlbnQgJiYgcGFyZW50Lm5vZGVUeXBlID09PSAxICYmIGRvYy5jb250YWlucyhwYXJlbnQpKTtcbn1cblxuLyoqXG4gKiBHZXQgYW5kIHJlbW92ZSBhbiBhdHRyaWJ1dGUgZnJvbSBhIG5vZGUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gX2F0dHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRBdHRyKG5vZGUsIF9hdHRyKSB7XG4gIHZhciB2YWwgPSBub2RlLmdldEF0dHJpYnV0ZShfYXR0cik7XG4gIGlmICh2YWwgIT09IG51bGwpIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShfYXR0cik7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuLyoqXG4gKiBHZXQgYW4gYXR0cmlidXRlIHdpdGggY29sb24gb3Igdi1iaW5kOiBwcmVmaXguXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7U3RyaW5nfG51bGx9XG4gKi9cblxuZnVuY3Rpb24gZ2V0QmluZEF0dHIobm9kZSwgbmFtZSkge1xuICB2YXIgdmFsID0gZ2V0QXR0cihub2RlLCAnOicgKyBuYW1lKTtcbiAgaWYgKHZhbCA9PT0gbnVsbCkge1xuICAgIHZhbCA9IGdldEF0dHIobm9kZSwgJ3YtYmluZDonICsgbmFtZSk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuLyoqXG4gKiBDaGVjayB0aGUgcHJlc2VuY2Ugb2YgYSBiaW5kIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmZ1bmN0aW9uIGhhc0JpbmRBdHRyKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuaGFzQXR0cmlidXRlKG5hbWUpIHx8IG5vZGUuaGFzQXR0cmlidXRlKCc6JyArIG5hbWUpIHx8IG5vZGUuaGFzQXR0cmlidXRlKCd2LWJpbmQ6JyArIG5hbWUpO1xufVxuXG4vKipcbiAqIEluc2VydCBlbCBiZWZvcmUgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5mdW5jdGlvbiBiZWZvcmUoZWwsIHRhcmdldCkge1xuICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldCk7XG59XG5cbi8qKlxuICogSW5zZXJ0IGVsIGFmdGVyIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZnVuY3Rpb24gYWZ0ZXIoZWwsIHRhcmdldCkge1xuICBpZiAodGFyZ2V0Lm5leHRTaWJsaW5nKSB7XG4gICAgYmVmb3JlKGVsLCB0YXJnZXQubmV4dFNpYmxpbmcpO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBlbCBmcm9tIERPTVxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5mdW5jdGlvbiByZW1vdmUoZWwpIHtcbiAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG59XG5cbi8qKlxuICogUHJlcGVuZCBlbCB0byB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmZ1bmN0aW9uIHByZXBlbmQoZWwsIHRhcmdldCkge1xuICBpZiAodGFyZ2V0LmZpcnN0Q2hpbGQpIHtcbiAgICBiZWZvcmUoZWwsIHRhcmdldC5maXJzdENoaWxkKTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpO1xuICB9XG59XG5cbi8qKlxuICogUmVwbGFjZSB0YXJnZXQgd2l0aCBlbFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZnVuY3Rpb24gcmVwbGFjZSh0YXJnZXQsIGVsKSB7XG4gIHZhciBwYXJlbnQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQoZWwsIHRhcmdldCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIgc2hvcnRoYW5kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3VzZUNhcHR1cmVdXG4gKi9cblxuZnVuY3Rpb24gb24oZWwsIGV2ZW50LCBjYiwgdXNlQ2FwdHVyZSkge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYiwgdXNlQ2FwdHVyZSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVyIHNob3J0aGFuZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxuZnVuY3Rpb24gb2ZmKGVsLCBldmVudCwgY2IpIHtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2IpO1xufVxuXG4vKipcbiAqIEZvciBJRTkgY29tcGF0OiB3aGVuIGJvdGggY2xhc3MgYW5kIDpjbGFzcyBhcmUgcHJlc2VudFxuICogZ2V0QXR0cmlidXRlKCdjbGFzcycpIHJldHVybnMgd3JvbmcgdmFsdWUuLi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gZ2V0Q2xhc3MoZWwpIHtcbiAgdmFyIGNsYXNzbmFtZSA9IGVsLmNsYXNzTmFtZTtcbiAgaWYgKHR5cGVvZiBjbGFzc25hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgY2xhc3NuYW1lID0gY2xhc3NuYW1lLmJhc2VWYWwgfHwgJyc7XG4gIH1cbiAgcmV0dXJuIGNsYXNzbmFtZTtcbn1cblxuLyoqXG4gKiBJbiBJRTksIHNldEF0dHJpYnV0ZSgnY2xhc3MnKSB3aWxsIHJlc3VsdCBpbiBlbXB0eSBjbGFzc1xuICogaWYgdGhlIGVsZW1lbnQgYWxzbyBoYXMgdGhlIDpjbGFzcyBhdHRyaWJ1dGU7IEhvd2V2ZXIgaW5cbiAqIFBoYW50b21KUywgc2V0dGluZyBgY2xhc3NOYW1lYCBkb2VzIG5vdCB3b3JrIG9uIFNWRyBlbGVtZW50cy4uLlxuICogU28gd2UgaGF2ZSB0byBkbyBhIGNvbmRpdGlvbmFsIGNoZWNrIGhlcmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGNsc1xuICovXG5cbmZ1bmN0aW9uIHNldENsYXNzKGVsLCBjbHMpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc0lFOSAmJiAhL3N2ZyQvLnRlc3QoZWwubmFtZXNwYWNlVVJJKSkge1xuICAgIGVsLmNsYXNzTmFtZSA9IGNscztcbiAgfSBlbHNlIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xzKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGNsc1xuICovXG5cbmZ1bmN0aW9uIGFkZENsYXNzKGVsLCBjbHMpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3VyID0gJyAnICsgZ2V0Q2xhc3MoZWwpICsgJyAnO1xuICAgIGlmIChjdXIuaW5kZXhPZignICcgKyBjbHMgKyAnICcpIDwgMCkge1xuICAgICAgc2V0Q2xhc3MoZWwsIChjdXIgKyBjbHMpLnRyaW0oKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGNsYXNzIHdpdGggY29tcGF0aWJpbGl0eSBmb3IgSUUgJiBTVkdcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xzXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBjdXIgPSAnICcgKyBnZXRDbGFzcyhlbCkgKyAnICc7XG4gICAgdmFyIHRhciA9ICcgJyArIGNscyArICcgJztcbiAgICB3aGlsZSAoY3VyLmluZGV4T2YodGFyKSA+PSAwKSB7XG4gICAgICBjdXIgPSBjdXIucmVwbGFjZSh0YXIsICcgJyk7XG4gICAgfVxuICAgIHNldENsYXNzKGVsLCBjdXIudHJpbSgpKTtcbiAgfVxuICBpZiAoIWVsLmNsYXNzTmFtZSkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3QgcmF3IGNvbnRlbnQgaW5zaWRlIGFuIGVsZW1lbnQgaW50byBhIHRlbXBvcmFyeVxuICogY29udGFpbmVyIGRpdlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYXNGcmFnbWVudFxuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIGV4dHJhY3RDb250ZW50KGVsLCBhc0ZyYWdtZW50KSB7XG4gIHZhciBjaGlsZDtcbiAgdmFyIHJhd0NvbnRlbnQ7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoaXNUZW1wbGF0ZShlbCkgJiYgaXNGcmFnbWVudChlbC5jb250ZW50KSkge1xuICAgIGVsID0gZWwuY29udGVudDtcbiAgfVxuICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgdHJpbU5vZGUoZWwpO1xuICAgIHJhd0NvbnRlbnQgPSBhc0ZyYWdtZW50ID8gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uZC1hc3NpZ24gKi9cbiAgICB3aGlsZSAoY2hpbGQgPSBlbC5maXJzdENoaWxkKSB7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbmQtYXNzaWduICovXG4gICAgICByYXdDb250ZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJhd0NvbnRlbnQ7XG59XG5cbi8qKlxuICogVHJpbSBwb3NzaWJsZSBlbXB0eSBoZWFkL3RhaWwgdGV4dCBhbmQgY29tbWVudFxuICogbm9kZXMgaW5zaWRlIGEgcGFyZW50LlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICovXG5cbmZ1bmN0aW9uIHRyaW1Ob2RlKG5vZGUpIHtcbiAgdmFyIGNoaWxkO1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1zZXF1ZW5jZXMgKi9cbiAgd2hpbGUgKChjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZCwgaXNUcmltbWFibGUoY2hpbGQpKSkge1xuICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICB9XG4gIHdoaWxlICgoY2hpbGQgPSBub2RlLmxhc3RDaGlsZCwgaXNUcmltbWFibGUoY2hpbGQpKSkge1xuICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tc2VxdWVuY2VzICovXG59XG5cbmZ1bmN0aW9uIGlzVHJpbW1hYmxlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiYgKG5vZGUubm9kZVR5cGUgPT09IDMgJiYgIW5vZGUuZGF0YS50cmltKCkgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOCk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gZWxlbWVudCBpcyBhIHRlbXBsYXRlIHRhZy5cbiAqIE5vdGUgaWYgdGhlIHRlbXBsYXRlIGFwcGVhcnMgaW5zaWRlIGFuIFNWRyBpdHMgdGFnTmFtZVxuICogd2lsbCBiZSBpbiBsb3dlcmNhc2UuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmZ1bmN0aW9uIGlzVGVtcGxhdGUoZWwpIHtcbiAgcmV0dXJuIGVsLnRhZ05hbWUgJiYgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndGVtcGxhdGUnO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBcImFuY2hvclwiIGZvciBwZXJmb3JtaW5nIGRvbSBpbnNlcnRpb24vcmVtb3ZhbHMuXG4gKiBUaGlzIGlzIHVzZWQgaW4gYSBudW1iZXIgb2Ygc2NlbmFyaW9zOlxuICogLSBmcmFnbWVudCBpbnN0YW5jZVxuICogLSB2LWh0bWxcbiAqIC0gdi1pZlxuICogLSB2LWZvclxuICogLSBjb21wb25lbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY29udGVudFxuICogQHBhcmFtIHtCb29sZWFufSBwZXJzaXN0IC0gSUUgdHJhc2hlcyBlbXB0eSB0ZXh0Tm9kZXMgb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lTm9kZSh0cnVlKSwgc28gaW4gY2VydGFpblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZXMgdGhlIGFuY2hvciBuZWVkcyB0byBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9uLWVtcHR5IHRvIGJlIHBlcnNpc3RlZCBpblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVzLlxuICogQHJldHVybiB7Q29tbWVudHxUZXh0fVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUFuY2hvcihjb250ZW50LCBwZXJzaXN0KSB7XG4gIHZhciBhbmNob3IgPSBjb25maWcuZGVidWcgPyBkb2N1bWVudC5jcmVhdGVDb21tZW50KGNvbnRlbnQpIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGVyc2lzdCA/ICcgJyA6ICcnKTtcbiAgYW5jaG9yLl9fdl9hbmNob3IgPSB0cnVlO1xuICByZXR1cm4gYW5jaG9yO1xufVxuXG4vKipcbiAqIEZpbmQgYSBjb21wb25lbnQgcmVmIGF0dHJpYnV0ZSB0aGF0IHN0YXJ0cyB3aXRoICQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcmV0dXJuIHtTdHJpbmd8dW5kZWZpbmVkfVxuICovXG5cbnZhciByZWZSRSA9IC9edi1yZWY6LztcblxuZnVuY3Rpb24gZmluZFJlZihub2RlKSB7XG4gIGlmIChub2RlLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgIHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBhdHRyc1tpXS5uYW1lO1xuICAgICAgaWYgKHJlZlJFLnRlc3QobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNhbWVsaXplKG5hbWUucmVwbGFjZShyZWZSRSwgJycpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNYXAgYSBmdW5jdGlvbiB0byBhIHJhbmdlIG9mIG5vZGVzIC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7Tm9kZX0gZW5kXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcFxuICovXG5cbmZ1bmN0aW9uIG1hcE5vZGVSYW5nZShub2RlLCBlbmQsIG9wKSB7XG4gIHZhciBuZXh0O1xuICB3aGlsZSAobm9kZSAhPT0gZW5kKSB7XG4gICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgb3Aobm9kZSk7XG4gICAgbm9kZSA9IG5leHQ7XG4gIH1cbiAgb3AoZW5kKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSByYW5nZSBvZiBub2RlcyB3aXRoIHRyYW5zaXRpb24sIHN0b3JlXG4gKiB0aGUgbm9kZXMgaW4gYSBmcmFnbWVudCB3aXRoIGNvcnJlY3Qgb3JkZXJpbmcsXG4gKiBhbmQgY2FsbCBjYWxsYmFjayB3aGVuIGRvbmUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICogQHBhcmFtIHtOb2RlfSBlbmRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSBmcmFnXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmZ1bmN0aW9uIHJlbW92ZU5vZGVSYW5nZShzdGFydCwgZW5kLCB2bSwgZnJhZywgY2IpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdmFyIHJlbW92ZWQgPSAwO1xuICB2YXIgbm9kZXMgPSBbXTtcbiAgbWFwTm9kZVJhbmdlKHN0YXJ0LCBlbmQsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUgPT09IGVuZCkgZG9uZSA9IHRydWU7XG4gICAgbm9kZXMucHVzaChub2RlKTtcbiAgICByZW1vdmVXaXRoVHJhbnNpdGlvbihub2RlLCB2bSwgb25SZW1vdmVkKTtcbiAgfSk7XG4gIGZ1bmN0aW9uIG9uUmVtb3ZlZCgpIHtcbiAgICByZW1vdmVkKys7XG4gICAgaWYgKGRvbmUgJiYgcmVtb3ZlZCA+PSBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgICBjYiAmJiBjYigpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBhIERvY3VtZW50RnJhZ21lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmZ1bmN0aW9uIGlzRnJhZ21lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLm5vZGVUeXBlID09PSAxMTtcbn1cblxuLyoqXG4gKiBHZXQgb3V0ZXJIVE1MIG9mIGVsZW1lbnRzLCB0YWtpbmcgY2FyZVxuICogb2YgU1ZHIGVsZW1lbnRzIGluIElFIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGdldE91dGVySFRNTChlbCkge1xuICBpZiAoZWwub3V0ZXJIVE1MKSB7XG4gICAgcmV0dXJuIGVsLm91dGVySFRNTDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5pbm5lckhUTUw7XG4gIH1cbn1cblxudmFyIGNvbW1vblRhZ1JFID0gL14oZGl2fHB8c3BhbnxpbWd8YXxifGl8YnJ8dWx8b2x8bGl8aDF8aDJ8aDN8aDR8aDV8aDZ8Y29kZXxwcmV8dGFibGV8dGh8dGR8dHJ8Zm9ybXxsYWJlbHxpbnB1dHxzZWxlY3R8b3B0aW9ufG5hdnxhcnRpY2xlfHNlY3Rpb258aGVhZGVyfGZvb3RlcikkL2k7XG52YXIgcmVzZXJ2ZWRUYWdSRSA9IC9eKHNsb3R8cGFydGlhbHxjb21wb25lbnQpJC9pO1xuXG52YXIgaXNVbmtub3duRWxlbWVudCA9IHVuZGVmaW5lZDtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGlzVW5rbm93bkVsZW1lbnQgPSBmdW5jdGlvbiAoZWwsIHRhZykge1xuICAgIGlmICh0YWcuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI4MjEwMzY0LzEwNzAyNDRcbiAgICAgIHJldHVybiBlbC5jb25zdHJ1Y3RvciA9PT0gd2luZG93LkhUTUxVbmtub3duRWxlbWVudCB8fCBlbC5jb25zdHJ1Y3RvciA9PT0gd2luZG93LkhUTUxFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKC9IVE1MVW5rbm93bkVsZW1lbnQvLnRlc3QoZWwudG9TdHJpbmcoKSkgJiZcbiAgICAgICAgLy8gQ2hyb21lIHJldHVybnMgdW5rbm93biBmb3Igc2V2ZXJhbCBIVE1MNSBlbGVtZW50cy5cbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTU0MDUyNlxuICAgICAgICAhL14oZGF0YXx0aW1lfHJ0Y3xyYikkLy50ZXN0KHRhZylcbiAgICAgICk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgYSBjb21wb25lbnQsIGlmIHllcyByZXR1cm4gaXRzXG4gKiBjb21wb25lbnQgaWQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gY2hlY2tDb21wb25lbnRBdHRyKGVsLCBvcHRpb25zKSB7XG4gIHZhciB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIHZhciBoYXNBdHRycyA9IGVsLmhhc0F0dHJpYnV0ZXMoKTtcbiAgaWYgKCFjb21tb25UYWdSRS50ZXN0KHRhZykgJiYgIXJlc2VydmVkVGFnUkUudGVzdCh0YWcpKSB7XG4gICAgaWYgKHJlc29sdmVBc3NldChvcHRpb25zLCAnY29tcG9uZW50cycsIHRhZykpIHtcbiAgICAgIHJldHVybiB7IGlkOiB0YWcgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGlzID0gaGFzQXR0cnMgJiYgZ2V0SXNCaW5kaW5nKGVsKTtcbiAgICAgIGlmIChpcykge1xuICAgICAgICByZXR1cm4gaXM7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkVGFnID0gb3B0aW9ucy5fY29tcG9uZW50TmFtZU1hcCAmJiBvcHRpb25zLl9jb21wb25lbnROYW1lTWFwW3RhZ107XG4gICAgICAgIGlmIChleHBlY3RlZFRhZykge1xuICAgICAgICAgIHdhcm4oJ1Vua25vd24gY3VzdG9tIGVsZW1lbnQ6IDwnICsgdGFnICsgJz4gLSAnICsgJ2RpZCB5b3UgbWVhbiA8JyArIGV4cGVjdGVkVGFnICsgJz4/ICcgKyAnSFRNTCBpcyBjYXNlLWluc2Vuc2l0aXZlLCByZW1lbWJlciB0byB1c2Uga2ViYWItY2FzZSBpbiB0ZW1wbGF0ZXMuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNVbmtub3duRWxlbWVudChlbCwgdGFnKSkge1xuICAgICAgICAgIHdhcm4oJ1Vua25vd24gY3VzdG9tIGVsZW1lbnQ6IDwnICsgdGFnICsgJz4gLSBkaWQgeW91ICcgKyAncmVnaXN0ZXIgdGhlIGNvbXBvbmVudCBjb3JyZWN0bHk/IEZvciByZWN1cnNpdmUgY29tcG9uZW50cywgJyArICdtYWtlIHN1cmUgdG8gcHJvdmlkZSB0aGUgXCJuYW1lXCIgb3B0aW9uLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGhhc0F0dHJzKSB7XG4gICAgcmV0dXJuIGdldElzQmluZGluZyhlbCk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgXCJpc1wiIGJpbmRpbmcgZnJvbSBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gZ2V0SXNCaW5kaW5nKGVsKSB7XG4gIC8vIGR5bmFtaWMgc3ludGF4XG4gIHZhciBleHAgPSBnZXRBdHRyKGVsLCAnaXMnKTtcbiAgaWYgKGV4cCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHsgaWQ6IGV4cCB9O1xuICB9IGVsc2Uge1xuICAgIGV4cCA9IGdldEJpbmRBdHRyKGVsLCAnaXMnKTtcbiAgICBpZiAoZXhwICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB7IGlkOiBleHAsIGR5bmFtaWM6IHRydWUgfTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb24gb3ZlcndyaXRpbmcgc3RyYXRlZ2llcyBhcmUgZnVuY3Rpb25zIHRoYXQgaGFuZGxlXG4gKiBob3cgdG8gbWVyZ2UgYSBwYXJlbnQgb3B0aW9uIHZhbHVlIGFuZCBhIGNoaWxkIG9wdGlvblxuICogdmFsdWUgaW50byB0aGUgZmluYWwgdmFsdWUuXG4gKlxuICogQWxsIHN0cmF0ZWd5IGZ1bmN0aW9ucyBmb2xsb3cgdGhlIHNhbWUgc2lnbmF0dXJlOlxuICpcbiAqIEBwYXJhbSB7Kn0gcGFyZW50VmFsXG4gKiBAcGFyYW0geyp9IGNoaWxkVmFsXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICovXG5cbnZhciBzdHJhdHMgPSBjb25maWcub3B0aW9uTWVyZ2VTdHJhdGVnaWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiBIZWxwZXIgdGhhdCByZWN1cnNpdmVseSBtZXJnZXMgdHdvIGRhdGEgb2JqZWN0cyB0b2dldGhlci5cbiAqL1xuXG5mdW5jdGlvbiBtZXJnZURhdGEodG8sIGZyb20pIHtcbiAgdmFyIGtleSwgdG9WYWwsIGZyb21WYWw7XG4gIGZvciAoa2V5IGluIGZyb20pIHtcbiAgICB0b1ZhbCA9IHRvW2tleV07XG4gICAgZnJvbVZhbCA9IGZyb21ba2V5XTtcbiAgICBpZiAoIWhhc093bih0bywga2V5KSkge1xuICAgICAgc2V0KHRvLCBrZXksIGZyb21WYWwpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodG9WYWwpICYmIGlzT2JqZWN0KGZyb21WYWwpKSB7XG4gICAgICBtZXJnZURhdGEodG9WYWwsIGZyb21WYWwpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59XG5cbi8qKlxuICogRGF0YVxuICovXG5cbnN0cmF0cy5kYXRhID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtKSB7XG4gIGlmICghdm0pIHtcbiAgICAvLyBpbiBhIFZ1ZS5leHRlbmQgbWVyZ2UsIGJvdGggc2hvdWxkIGJlIGZ1bmN0aW9uc1xuICAgIGlmICghY2hpbGRWYWwpIHtcbiAgICAgIHJldHVybiBwYXJlbnRWYWw7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybignVGhlIFwiZGF0YVwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICsgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArICdkZWZpbml0aW9ucy4nKTtcbiAgICAgIHJldHVybiBwYXJlbnRWYWw7XG4gICAgfVxuICAgIGlmICghcGFyZW50VmFsKSB7XG4gICAgICByZXR1cm4gY2hpbGRWYWw7XG4gICAgfVxuICAgIC8vIHdoZW4gcGFyZW50VmFsICYgY2hpbGRWYWwgYXJlIGJvdGggcHJlc2VudCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgICAvLyBtZXJnZWQgcmVzdWx0IG9mIGJvdGggZnVuY3Rpb25zLi4uIG5vIG5lZWQgdG9cbiAgICAvLyBjaGVjayBpZiBwYXJlbnRWYWwgaXMgYSBmdW5jdGlvbiBoZXJlIGJlY2F1c2VcbiAgICAvLyBpdCBoYXMgdG8gYmUgYSBmdW5jdGlvbiB0byBwYXNzIHByZXZpb3VzIG1lcmdlcy5cbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkRGF0YUZuKCkge1xuICAgICAgcmV0dXJuIG1lcmdlRGF0YShjaGlsZFZhbC5jYWxsKHRoaXMpLCBwYXJlbnRWYWwuY2FsbCh0aGlzKSk7XG4gICAgfTtcbiAgfSBlbHNlIGlmIChwYXJlbnRWYWwgfHwgY2hpbGRWYWwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkSW5zdGFuY2VEYXRhRm4oKSB7XG4gICAgICAvLyBpbnN0YW5jZSBtZXJnZVxuICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHR5cGVvZiBjaGlsZFZhbCA9PT0gJ2Z1bmN0aW9uJyA/IGNoaWxkVmFsLmNhbGwodm0pIDogY2hpbGRWYWw7XG4gICAgICB2YXIgZGVmYXVsdERhdGEgPSB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nID8gcGFyZW50VmFsLmNhbGwodm0pIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKGluc3RhbmNlRGF0YSkge1xuICAgICAgICByZXR1cm4gbWVyZ2VEYXRhKGluc3RhbmNlRGF0YSwgZGVmYXVsdERhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHREYXRhO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogRWxcbiAqL1xuXG5zdHJhdHMuZWwgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0pIHtcbiAgaWYgKCF2bSAmJiBjaGlsZFZhbCAmJiB0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ1RoZSBcImVsXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgKyAndGhhdCByZXR1cm5zIGEgcGVyLWluc3RhbmNlIHZhbHVlIGluIGNvbXBvbmVudCAnICsgJ2RlZmluaXRpb25zLicpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgcmV0ID0gY2hpbGRWYWwgfHwgcGFyZW50VmFsO1xuICAvLyBpbnZva2UgdGhlIGVsZW1lbnQgZmFjdG9yeSBpZiB0aGlzIGlzIGluc3RhbmNlIG1lcmdlXG4gIHJldHVybiB2bSAmJiB0eXBlb2YgcmV0ID09PSAnZnVuY3Rpb24nID8gcmV0LmNhbGwodm0pIDogcmV0O1xufTtcblxuLyoqXG4gKiBIb29rcyBhbmQgcGFyYW0gYXR0cmlidXRlcyBhcmUgbWVyZ2VkIGFzIGFycmF5cy5cbiAqL1xuXG5zdHJhdHMuaW5pdCA9IHN0cmF0cy5jcmVhdGVkID0gc3RyYXRzLnJlYWR5ID0gc3RyYXRzLmF0dGFjaGVkID0gc3RyYXRzLmRldGFjaGVkID0gc3RyYXRzLmJlZm9yZUNvbXBpbGUgPSBzdHJhdHMuY29tcGlsZWQgPSBzdHJhdHMuYmVmb3JlRGVzdHJveSA9IHN0cmF0cy5kZXN0cm95ZWQgPSBzdHJhdHMuYWN0aXZhdGUgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICByZXR1cm4gY2hpbGRWYWwgPyBwYXJlbnRWYWwgPyBwYXJlbnRWYWwuY29uY2F0KGNoaWxkVmFsKSA6IGlzQXJyYXkoY2hpbGRWYWwpID8gY2hpbGRWYWwgOiBbY2hpbGRWYWxdIDogcGFyZW50VmFsO1xufTtcblxuLyoqXG4gKiAwLjExIGRlcHJlY2F0aW9uIHdhcm5pbmdcbiAqL1xuXG5zdHJhdHMucGFyYW1BdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ1wicGFyYW1BdHRyaWJ1dGVzXCIgb3B0aW9uIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gMC4xMi4gJyArICdVc2UgXCJwcm9wc1wiIGluc3RlYWQuJyk7XG59O1xuXG4vKipcbiAqIEFzc2V0c1xuICpcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cbiAqIGEgdGhyZWUtd2F5IG1lcmdlIGJldHdlZW4gY29uc3RydWN0b3Igb3B0aW9ucywgaW5zdGFuY2VcbiAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlQXNzZXRzKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgdmFyIHJlcyA9IE9iamVjdC5jcmVhdGUocGFyZW50VmFsKTtcbiAgcmV0dXJuIGNoaWxkVmFsID8gZXh0ZW5kKHJlcywgZ3VhcmRBcnJheUFzc2V0cyhjaGlsZFZhbCkpIDogcmVzO1xufVxuXG5jb25maWcuX2Fzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICBzdHJhdHNbdHlwZSArICdzJ10gPSBtZXJnZUFzc2V0cztcbn0pO1xuXG4vKipcbiAqIEV2ZW50cyAmIFdhdGNoZXJzLlxuICpcbiAqIEV2ZW50cyAmIHdhdGNoZXJzIGhhc2hlcyBzaG91bGQgbm90IG92ZXJ3cml0ZSBvbmVcbiAqIGFub3RoZXIsIHNvIHdlIG1lcmdlIHRoZW0gYXMgYXJyYXlzLlxuICovXG5cbnN0cmF0cy53YXRjaCA9IHN0cmF0cy5ldmVudHMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBpZiAoIWNoaWxkVmFsKSByZXR1cm4gcGFyZW50VmFsO1xuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsO1xuICB2YXIgcmV0ID0ge307XG4gIGV4dGVuZChyZXQsIHBhcmVudFZhbCk7XG4gIGZvciAodmFyIGtleSBpbiBjaGlsZFZhbCkge1xuICAgIHZhciBwYXJlbnQgPSByZXRba2V5XTtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZFZhbFtrZXldO1xuICAgIGlmIChwYXJlbnQgJiYgIWlzQXJyYXkocGFyZW50KSkge1xuICAgICAgcGFyZW50ID0gW3BhcmVudF07XG4gICAgfVxuICAgIHJldFtrZXldID0gcGFyZW50ID8gcGFyZW50LmNvbmNhdChjaGlsZCkgOiBbY2hpbGRdO1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqIE90aGVyIG9iamVjdCBoYXNoZXMuXG4gKi9cblxuc3RyYXRzLnByb3BzID0gc3RyYXRzLm1ldGhvZHMgPSBzdHJhdHMuY29tcHV0ZWQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBpZiAoIWNoaWxkVmFsKSByZXR1cm4gcGFyZW50VmFsO1xuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsO1xuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZXh0ZW5kKHJldCwgcGFyZW50VmFsKTtcbiAgZXh0ZW5kKHJldCwgY2hpbGRWYWwpO1xuICByZXR1cm4gcmV0O1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHN0cmF0ZWd5LlxuICovXG5cbnZhciBkZWZhdWx0U3RyYXQgPSBmdW5jdGlvbiBkZWZhdWx0U3RyYXQocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICByZXR1cm4gY2hpbGRWYWwgPT09IHVuZGVmaW5lZCA/IHBhcmVudFZhbCA6IGNoaWxkVmFsO1xufTtcblxuLyoqXG4gKiBNYWtlIHN1cmUgY29tcG9uZW50IG9wdGlvbnMgZ2V0IGNvbnZlcnRlZCB0byBhY3R1YWxcbiAqIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5cbmZ1bmN0aW9uIGd1YXJkQ29tcG9uZW50cyhvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmNvbXBvbmVudHMpIHtcbiAgICB2YXIgY29tcG9uZW50cyA9IG9wdGlvbnMuY29tcG9uZW50cyA9IGd1YXJkQXJyYXlBc3NldHMob3B0aW9ucy5jb21wb25lbnRzKTtcbiAgICB2YXIgaWRzID0gT2JqZWN0LmtleXMoY29tcG9uZW50cyk7XG4gICAgdmFyIGRlZjtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hcCA9IG9wdGlvbnMuX2NvbXBvbmVudE5hbWVNYXAgPSB7fTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBpZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gaWRzW2ldO1xuICAgICAgaWYgKGNvbW1vblRhZ1JFLnRlc3Qoa2V5KSB8fCByZXNlcnZlZFRhZ1JFLnRlc3Qoa2V5KSkge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0RvIG5vdCB1c2UgYnVpbHQtaW4gb3IgcmVzZXJ2ZWQgSFRNTCBlbGVtZW50cyBhcyBjb21wb25lbnQgJyArICdpZDogJyArIGtleSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8gcmVjb3JkIGEgYWxsIGxvd2VyY2FzZSA8LT4ga2ViYWItY2FzZSBtYXBwaW5nIGZvclxuICAgICAgLy8gcG9zc2libGUgY3VzdG9tIGVsZW1lbnQgY2FzZSBlcnJvciB3YXJuaW5nXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBtYXBba2V5LnJlcGxhY2UoLy0vZywgJycpLnRvTG93ZXJDYXNlKCldID0gaHlwaGVuYXRlKGtleSk7XG4gICAgICB9XG4gICAgICBkZWYgPSBjb21wb25lbnRzW2tleV07XG4gICAgICBpZiAoaXNQbGFpbk9iamVjdChkZWYpKSB7XG4gICAgICAgIGNvbXBvbmVudHNba2V5XSA9IFZ1ZS5leHRlbmQoZGVmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFbnN1cmUgYWxsIHByb3BzIG9wdGlvbiBzeW50YXggYXJlIG5vcm1hbGl6ZWQgaW50byB0aGVcbiAqIE9iamVjdC1iYXNlZCBmb3JtYXQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuXG5mdW5jdGlvbiBndWFyZFByb3BzKG9wdGlvbnMpIHtcbiAgdmFyIHByb3BzID0gb3B0aW9ucy5wcm9wcztcbiAgdmFyIGksIHZhbDtcbiAgaWYgKGlzQXJyYXkocHJvcHMpKSB7XG4gICAgb3B0aW9ucy5wcm9wcyA9IHt9O1xuICAgIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdmFsID0gcHJvcHNbaV07XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb3B0aW9ucy5wcm9wc1t2YWxdID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAodmFsLm5hbWUpIHtcbiAgICAgICAgb3B0aW9ucy5wcm9wc1t2YWwubmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QocHJvcHMpKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgaSA9IGtleXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhbCA9IHByb3BzW2tleXNbaV1dO1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJvcHNba2V5c1tpXV0gPSB7IHR5cGU6IHZhbCB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEd1YXJkIGFuIEFycmF5LWZvcm1hdCBhc3NldHMgb3B0aW9uIGFuZCBjb252ZXJ0ZWQgaXRcbiAqIGludG8gdGhlIGtleS12YWx1ZSBPYmplY3QgZm9ybWF0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBhc3NldHNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBndWFyZEFycmF5QXNzZXRzKGFzc2V0cykge1xuICBpZiAoaXNBcnJheShhc3NldHMpKSB7XG4gICAgdmFyIHJlcyA9IHt9O1xuICAgIHZhciBpID0gYXNzZXRzLmxlbmd0aDtcbiAgICB2YXIgYXNzZXQ7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXNzZXQgPSBhc3NldHNbaV07XG4gICAgICB2YXIgaWQgPSB0eXBlb2YgYXNzZXQgPT09ICdmdW5jdGlvbicgPyBhc3NldC5vcHRpb25zICYmIGFzc2V0Lm9wdGlvbnMubmFtZSB8fCBhc3NldC5pZCA6IGFzc2V0Lm5hbWUgfHwgYXNzZXQuaWQ7XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybignQXJyYXktc3ludGF4IGFzc2V0cyBtdXN0IHByb3ZpZGUgYSBcIm5hbWVcIiBvciBcImlkXCIgZmllbGQuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNbaWRdID0gYXNzZXQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgcmV0dXJuIGFzc2V0cztcbn1cblxuLyoqXG4gKiBNZXJnZSB0d28gb3B0aW9uIG9iamVjdHMgaW50byBhIG5ldyBvbmUuXG4gKiBDb3JlIHV0aWxpdHkgdXNlZCBpbiBib3RoIGluc3RhbnRpYXRpb24gYW5kIGluaGVyaXRhbmNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjaGlsZFxuICogQHBhcmFtIHtWdWV9IFt2bV0gLSBpZiB2bSBpcyBwcmVzZW50LCBpbmRpY2F0ZXMgdGhpcyBpc1xuICogICAgICAgICAgICAgICAgICAgICBhbiBpbnN0YW50aWF0aW9uIG1lcmdlLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlT3B0aW9ucyhwYXJlbnQsIGNoaWxkLCB2bSkge1xuICBndWFyZENvbXBvbmVudHMoY2hpbGQpO1xuICBndWFyZFByb3BzKGNoaWxkKTtcbiAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKGNoaWxkLm1peGlucykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubWl4aW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyZW50ID0gbWVyZ2VPcHRpb25zKHBhcmVudCwgY2hpbGQubWl4aW5zW2ldLCB2bSk7XG4gICAgfVxuICB9XG4gIGZvciAoa2V5IGluIHBhcmVudCkge1xuICAgIG1lcmdlRmllbGQoa2V5KTtcbiAgfVxuICBmb3IgKGtleSBpbiBjaGlsZCkge1xuICAgIGlmICghaGFzT3duKHBhcmVudCwga2V5KSkge1xuICAgICAgbWVyZ2VGaWVsZChrZXkpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtZXJnZUZpZWxkKGtleSkge1xuICAgIHZhciBzdHJhdCA9IHN0cmF0c1trZXldIHx8IGRlZmF1bHRTdHJhdDtcbiAgICBvcHRpb25zW2tleV0gPSBzdHJhdChwYXJlbnRba2V5XSwgY2hpbGRba2V5XSwgdm0sIGtleSk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhbiBhc3NldC5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBiZWNhdXNlIGNoaWxkIGluc3RhbmNlcyBuZWVkIGFjY2Vzc1xuICogdG8gYXNzZXRzIGRlZmluZWQgaW4gaXRzIGFuY2VzdG9yIGNoYWluLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gKiBAcmV0dXJuIHtPYmplY3R8RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gcmVzb2x2ZUFzc2V0KG9wdGlvbnMsIHR5cGUsIGlkKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYXNzZXRzID0gb3B0aW9uc1t0eXBlXTtcbiAgdmFyIGNhbWVsaXplZElkO1xuICByZXR1cm4gYXNzZXRzW2lkXSB8fFxuICAvLyBjYW1lbENhc2UgSURcbiAgYXNzZXRzW2NhbWVsaXplZElkID0gY2FtZWxpemUoaWQpXSB8fFxuICAvLyBQYXNjYWwgQ2FzZSBJRFxuICBhc3NldHNbY2FtZWxpemVkSWQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYW1lbGl6ZWRJZC5zbGljZSgxKV07XG59XG5cbi8qKlxuICogQXNzZXJ0IGFzc2V0IGV4aXN0c1xuICovXG5cbmZ1bmN0aW9uIGFzc2VydEFzc2V0KHZhbCwgdHlwZSwgaWQpIHtcbiAgaWYgKCF2YWwpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0ZhaWxlZCB0byByZXNvbHZlICcgKyB0eXBlICsgJzogJyArIGlkKTtcbiAgfVxufVxuXG52YXIgdWlkJDEgPSAwO1xuXG4vKipcbiAqIEEgZGVwIGlzIGFuIG9ic2VydmFibGUgdGhhdCBjYW4gaGF2ZSBtdWx0aXBsZVxuICogZGlyZWN0aXZlcyBzdWJzY3JpYmluZyB0byBpdC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRGVwKCkge1xuICB0aGlzLmlkID0gdWlkJDErKztcbiAgdGhpcy5zdWJzID0gW107XG59XG5cbi8vIHRoZSBjdXJyZW50IHRhcmdldCB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZC5cbi8vIHRoaXMgaXMgZ2xvYmFsbHkgdW5pcXVlIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb25seSBvbmVcbi8vIHdhdGNoZXIgYmVpbmcgZXZhbHVhdGVkIGF0IGFueSB0aW1lLlxuRGVwLnRhcmdldCA9IG51bGw7XG5cbi8qKlxuICogQWRkIGEgZGlyZWN0aXZlIHN1YnNjcmliZXIuXG4gKlxuICogQHBhcmFtIHtEaXJlY3RpdmV9IHN1YlxuICovXG5cbkRlcC5wcm90b3R5cGUuYWRkU3ViID0gZnVuY3Rpb24gKHN1Yikge1xuICB0aGlzLnN1YnMucHVzaChzdWIpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxuRGVwLnByb3RvdHlwZS5yZW1vdmVTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHRoaXMuc3Vicy4kcmVtb3ZlKHN1Yik7XG59O1xuXG4vKipcbiAqIEFkZCBzZWxmIGFzIGEgZGVwZW5kZW5jeSB0byB0aGUgdGFyZ2V0IHdhdGNoZXIuXG4gKi9cblxuRGVwLnByb3RvdHlwZS5kZXBlbmQgPSBmdW5jdGlvbiAoKSB7XG4gIERlcC50YXJnZXQuYWRkRGVwKHRoaXMpO1xufTtcblxuLyoqXG4gKiBOb3RpZnkgYWxsIHN1YnNjcmliZXJzIG9mIGEgbmV3IHZhbHVlLlxuICovXG5cbkRlcC5wcm90b3R5cGUubm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAvLyBzdGFibGl6ZSB0aGUgc3Vic2NyaWJlciBsaXN0IGZpcnN0XG4gIHZhciBzdWJzID0gdG9BcnJheSh0aGlzLnN1YnMpO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHN1YnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgc3Vic1tpXS51cGRhdGUoKTtcbiAgfVxufTtcblxudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG52YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmNyZWF0ZShhcnJheVByb3RvKVxuXG4vKipcbiAqIEludGVyY2VwdCBtdXRhdGluZyBtZXRob2RzIGFuZCBlbWl0IGV2ZW50c1xuICovXG5cbjtbJ3B1c2gnLCAncG9wJywgJ3NoaWZ0JywgJ3Vuc2hpZnQnLCAnc3BsaWNlJywgJ3NvcnQnLCAncmV2ZXJzZSddLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdO1xuICBkZWYoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IoKSB7XG4gICAgLy8gYXZvaWQgbGVha2luZyBhcmd1bWVudHM6XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vY2xvc3VyZS13aXRoLWFyZ3VtZW50c1xuICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKTtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG4gICAgdmFyIG9iID0gdGhpcy5fX29iX187XG4gICAgdmFyIGluc2VydGVkO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdwdXNoJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Vuc2hpZnQnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3BsaWNlJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKGluc2VydGVkKSBvYi5vYnNlcnZlQXJyYXkoaW5zZXJ0ZWQpO1xuICAgIC8vIG5vdGlmeSBjaGFuZ2VcbiAgICBvYi5kZXAubm90aWZ5KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBTd2FwIHRoZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBpbmRleCB3aXRoIGEgbmV3IHZhbHVlXG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHsqfSAtIHJlcGxhY2VkIGVsZW1lbnRcbiAqL1xuXG5kZWYoYXJyYXlQcm90bywgJyRzZXQnLCBmdW5jdGlvbiAkc2V0KGluZGV4LCB2YWwpIHtcbiAgaWYgKGluZGV4ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBOdW1iZXIoaW5kZXgpICsgMTtcbiAgfVxuICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEsIHZhbClbMF07XG59KTtcblxuLyoqXG4gKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gcmVtb3ZlIHRoZSBlbGVtZW50IGF0IGdpdmVuIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5kZWYoYXJyYXlQcm90bywgJyRyZW1vdmUnLCBmdW5jdGlvbiAkcmVtb3ZlKGl0ZW0pIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICghdGhpcy5sZW5ndGgpIHJldHVybjtcbiAgdmFyIGluZGV4ID0gaW5kZXhPZih0aGlzLCBpdGVtKTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59KTtcblxudmFyIGFycmF5S2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGFycmF5TWV0aG9kcyk7XG5cbi8qKlxuICogQnkgZGVmYXVsdCwgd2hlbiBhIHJlYWN0aXZlIHByb3BlcnR5IGlzIHNldCwgdGhlIG5ldyB2YWx1ZSBpc1xuICogYWxzbyBjb252ZXJ0ZWQgdG8gYmVjb21lIHJlYWN0aXZlLiBIb3dldmVyIGluIGNlcnRhaW4gY2FzZXMsIGUuZy5cbiAqIHYtZm9yIHNjb3BlIGFsaWFzIGFuZCBwcm9wcywgd2UgZG9uJ3Qgd2FudCB0byBmb3JjZSBjb252ZXJzaW9uXG4gKiBiZWNhdXNlIHRoZSB2YWx1ZSBtYXkgYmUgYSBuZXN0ZWQgdmFsdWUgdW5kZXIgYSBmcm96ZW4gZGF0YSBzdHJ1Y3R1cmUuXG4gKlxuICogU28gd2hlbmV2ZXIgd2Ugd2FudCB0byBzZXQgYSByZWFjdGl2ZSBwcm9wZXJ0eSB3aXRob3V0IGZvcmNpbmdcbiAqIGNvbnZlcnNpb24gb24gdGhlIG5ldyB2YWx1ZSwgd2Ugd3JhcCB0aGF0IGNhbGwgaW5zaWRlIHRoaXMgZnVuY3Rpb24uXG4gKi9cblxudmFyIHNob3VsZENvbnZlcnQgPSB0cnVlO1xuXG5mdW5jdGlvbiB3aXRob3V0Q29udmVyc2lvbihmbikge1xuICBzaG91bGRDb252ZXJ0ID0gZmFsc2U7XG4gIGZuKCk7XG4gIHNob3VsZENvbnZlcnQgPSB0cnVlO1xufVxuXG4vKipcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIGVhY2ggb2JzZXJ2ZWRcbiAqIG9iamVjdC4gT25jZSBhdHRhY2hlZCwgdGhlIG9ic2VydmVyIGNvbnZlcnRzIHRhcmdldFxuICogb2JqZWN0J3MgcHJvcGVydHkga2V5cyBpbnRvIGdldHRlci9zZXR0ZXJzIHRoYXRcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaGVzIHVwZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IHZhbHVlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBPYnNlcnZlcih2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIHRoaXMuZGVwID0gbmV3IERlcCgpO1xuICBkZWYodmFsdWUsICdfX29iX18nLCB0aGlzKTtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFyIGF1Z21lbnQgPSBoYXNQcm90byA/IHByb3RvQXVnbWVudCA6IGNvcHlBdWdtZW50O1xuICAgIGF1Z21lbnQodmFsdWUsIGFycmF5TWV0aG9kcywgYXJyYXlLZXlzKTtcbiAgICB0aGlzLm9ic2VydmVBcnJheSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy53YWxrKHZhbHVlKTtcbiAgfVxufVxuXG4vLyBJbnN0YW5jZSBtZXRob2RzXG5cbi8qKlxuICogV2FsayB0aHJvdWdoIGVhY2ggcHJvcGVydHkgYW5kIGNvbnZlcnQgdGhlbSBpbnRvXG4gKiBnZXR0ZXIvc2V0dGVycy4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW5cbiAqIHZhbHVlIHR5cGUgaXMgT2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5PYnNlcnZlci5wcm90b3R5cGUud2FsayA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdGhpcy5jb252ZXJ0KGtleXNbaV0sIG9ialtrZXlzW2ldXSk7XG4gIH1cbn07XG5cbi8qKlxuICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gaXRlbXNcbiAqL1xuXG5PYnNlcnZlci5wcm90b3R5cGUub2JzZXJ2ZUFycmF5ID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb2JzZXJ2ZShpdGVtc1tpXSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ29udmVydCBhIHByb3BlcnR5IGludG8gZ2V0dGVyL3NldHRlciBzbyB3ZSBjYW4gZW1pdFxuICogdGhlIGV2ZW50cyB3aGVuIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC9jaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuT2JzZXJ2ZXIucHJvdG90eXBlLmNvbnZlcnQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgZGVmaW5lUmVhY3RpdmUodGhpcy52YWx1ZSwga2V5LCB2YWwpO1xufTtcblxuLyoqXG4gKiBBZGQgYW4gb3duZXIgdm0sIHNvIHRoYXQgd2hlbiAkc2V0LyRkZWxldGUgbXV0YXRpb25zXG4gKiBoYXBwZW4gd2UgY2FuIG5vdGlmeSBvd25lciB2bXMgdG8gcHJveHkgdGhlIGtleXMgYW5kXG4gKiBkaWdlc3QgdGhlIHdhdGNoZXJzLiBUaGlzIGlzIG9ubHkgY2FsbGVkIHdoZW4gdGhlIG9iamVjdFxuICogaXMgb2JzZXJ2ZWQgYXMgYW4gaW5zdGFuY2UncyByb290ICRkYXRhLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbk9ic2VydmVyLnByb3RvdHlwZS5hZGRWbSA9IGZ1bmN0aW9uICh2bSkge1xuICAodGhpcy52bXMgfHwgKHRoaXMudm1zID0gW10pKS5wdXNoKHZtKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIG93bmVyIHZtLiBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBvYmplY3QgaXNcbiAqIHN3YXBwZWQgb3V0IGFzIGFuIGluc3RhbmNlJ3MgJGRhdGEgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbk9ic2VydmVyLnByb3RvdHlwZS5yZW1vdmVWbSA9IGZ1bmN0aW9uICh2bSkge1xuICB0aGlzLnZtcy4kcmVtb3ZlKHZtKTtcbn07XG5cbi8vIGhlbHBlcnNcblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXG4gKiB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIF9fcHJvdG9fX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcmNcbiAqL1xuXG5mdW5jdGlvbiBwcm90b0F1Z21lbnQodGFyZ2V0LCBzcmMpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbiAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHNyYztcbiAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xufVxuXG4vKipcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBkZWZpbmluZ1xuICogaGlkZGVuIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvXG4gKi9cblxuZnVuY3Rpb24gY29weUF1Z21lbnQodGFyZ2V0LCBzcmMsIGtleXMpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGRlZih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2UgZm9yIGEgdmFsdWUsXG4gKiByZXR1cm5zIHRoZSBuZXcgb2JzZXJ2ZXIgaWYgc3VjY2Vzc2Z1bGx5IG9ic2VydmVkLFxuICogb3IgdGhlIGV4aXN0aW5nIG9ic2VydmVyIGlmIHRoZSB2YWx1ZSBhbHJlYWR5IGhhcyBvbmUuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqIEByZXR1cm4ge09ic2VydmVyfHVuZGVmaW5lZH1cbiAqIEBzdGF0aWNcbiAqL1xuXG5mdW5jdGlvbiBvYnNlcnZlKHZhbHVlLCB2bSkge1xuICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG9iO1xuICBpZiAoaGFzT3duKHZhbHVlLCAnX19vYl9fJykgJiYgdmFsdWUuX19vYl9fIGluc3RhbmNlb2YgT2JzZXJ2ZXIpIHtcbiAgICBvYiA9IHZhbHVlLl9fb2JfXztcbiAgfSBlbHNlIGlmIChzaG91bGRDb252ZXJ0ICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc1BsYWluT2JqZWN0KHZhbHVlKSkgJiYgT2JqZWN0LmlzRXh0ZW5zaWJsZSh2YWx1ZSkgJiYgIXZhbHVlLl9pc1Z1ZSkge1xuICAgIG9iID0gbmV3IE9ic2VydmVyKHZhbHVlKTtcbiAgfVxuICBpZiAob2IgJiYgdm0pIHtcbiAgICBvYi5hZGRWbSh2bSk7XG4gIH1cbiAgcmV0dXJuIG9iO1xufVxuXG4vKipcbiAqIERlZmluZSBhIHJlYWN0aXZlIHByb3BlcnR5IG9uIGFuIE9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlKG9iaiwga2V5LCB2YWwpIHtcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKTtcblxuICB2YXIgcHJvcGVydHkgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KTtcbiAgaWYgKHByb3BlcnR5ICYmIHByb3BlcnR5LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBjYXRlciBmb3IgcHJlLWRlZmluZWQgZ2V0dGVyL3NldHRlcnNcbiAgdmFyIGdldHRlciA9IHByb3BlcnR5ICYmIHByb3BlcnR5LmdldDtcbiAgdmFyIHNldHRlciA9IHByb3BlcnR5ICYmIHByb3BlcnR5LnNldDtcblxuICB2YXIgY2hpbGRPYiA9IG9ic2VydmUodmFsKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZUdldHRlcigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XG4gICAgICBpZiAoRGVwLnRhcmdldCkge1xuICAgICAgICBkZXAuZGVwZW5kKCk7XG4gICAgICAgIGlmIChjaGlsZE9iKSB7XG4gICAgICAgICAgY2hpbGRPYi5kZXAuZGVwZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgZm9yICh2YXIgZSwgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGUgPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgIGUgJiYgZS5fX29iX18gJiYgZS5fX29iX18uZGVwLmRlcGVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlcihuZXdWYWwpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XG4gICAgICBpZiAobmV3VmFsID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgIHNldHRlci5jYWxsKG9iaiwgbmV3VmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IG5ld1ZhbDtcbiAgICAgIH1cbiAgICAgIGNoaWxkT2IgPSBvYnNlcnZlKG5ld1ZhbCk7XG4gICAgICBkZXAubm90aWZ5KCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG5cbnZhciB1dGlsID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGRlZmluZVJlYWN0aXZlOiBkZWZpbmVSZWFjdGl2ZSxcblx0c2V0OiBzZXQsXG5cdGRlbDogZGVsLFxuXHRoYXNPd246IGhhc093bixcblx0aXNMaXRlcmFsOiBpc0xpdGVyYWwsXG5cdGlzUmVzZXJ2ZWQ6IGlzUmVzZXJ2ZWQsXG5cdF90b1N0cmluZzogX3RvU3RyaW5nLFxuXHR0b051bWJlcjogdG9OdW1iZXIsXG5cdHRvQm9vbGVhbjogdG9Cb29sZWFuLFxuXHRzdHJpcFF1b3Rlczogc3RyaXBRdW90ZXMsXG5cdGNhbWVsaXplOiBjYW1lbGl6ZSxcblx0aHlwaGVuYXRlOiBoeXBoZW5hdGUsXG5cdGNsYXNzaWZ5OiBjbGFzc2lmeSxcblx0YmluZDogYmluZCxcblx0dG9BcnJheTogdG9BcnJheSxcblx0ZXh0ZW5kOiBleHRlbmQsXG5cdGlzT2JqZWN0OiBpc09iamVjdCxcblx0aXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcblx0ZGVmOiBkZWYsXG5cdGRlYm91bmNlOiBfZGVib3VuY2UsXG5cdGluZGV4T2Y6IGluZGV4T2YsXG5cdGNhbmNlbGxhYmxlOiBjYW5jZWxsYWJsZSxcblx0bG9vc2VFcXVhbDogbG9vc2VFcXVhbCxcblx0aXNBcnJheTogaXNBcnJheSxcblx0aGFzUHJvdG86IGhhc1Byb3RvLFxuXHRpbkJyb3dzZXI6IGluQnJvd3Nlcixcblx0ZGV2dG9vbHM6IGRldnRvb2xzLFxuXHRpc0lFOTogaXNJRTksXG5cdGlzQW5kcm9pZDogaXNBbmRyb2lkLFxuXHRnZXQgdHJhbnNpdGlvblByb3AgKCkgeyByZXR1cm4gdHJhbnNpdGlvblByb3A7IH0sXG5cdGdldCB0cmFuc2l0aW9uRW5kRXZlbnQgKCkgeyByZXR1cm4gdHJhbnNpdGlvbkVuZEV2ZW50OyB9LFxuXHRnZXQgYW5pbWF0aW9uUHJvcCAoKSB7IHJldHVybiBhbmltYXRpb25Qcm9wOyB9LFxuXHRnZXQgYW5pbWF0aW9uRW5kRXZlbnQgKCkgeyByZXR1cm4gYW5pbWF0aW9uRW5kRXZlbnQ7IH0sXG5cdG5leHRUaWNrOiBuZXh0VGljayxcblx0cXVlcnk6IHF1ZXJ5LFxuXHRpbkRvYzogaW5Eb2MsXG5cdGdldEF0dHI6IGdldEF0dHIsXG5cdGdldEJpbmRBdHRyOiBnZXRCaW5kQXR0cixcblx0aGFzQmluZEF0dHI6IGhhc0JpbmRBdHRyLFxuXHRiZWZvcmU6IGJlZm9yZSxcblx0YWZ0ZXI6IGFmdGVyLFxuXHRyZW1vdmU6IHJlbW92ZSxcblx0cHJlcGVuZDogcHJlcGVuZCxcblx0cmVwbGFjZTogcmVwbGFjZSxcblx0b246IG9uLFxuXHRvZmY6IG9mZixcblx0c2V0Q2xhc3M6IHNldENsYXNzLFxuXHRhZGRDbGFzczogYWRkQ2xhc3MsXG5cdHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcblx0ZXh0cmFjdENvbnRlbnQ6IGV4dHJhY3RDb250ZW50LFxuXHR0cmltTm9kZTogdHJpbU5vZGUsXG5cdGlzVGVtcGxhdGU6IGlzVGVtcGxhdGUsXG5cdGNyZWF0ZUFuY2hvcjogY3JlYXRlQW5jaG9yLFxuXHRmaW5kUmVmOiBmaW5kUmVmLFxuXHRtYXBOb2RlUmFuZ2U6IG1hcE5vZGVSYW5nZSxcblx0cmVtb3ZlTm9kZVJhbmdlOiByZW1vdmVOb2RlUmFuZ2UsXG5cdGlzRnJhZ21lbnQ6IGlzRnJhZ21lbnQsXG5cdGdldE91dGVySFRNTDogZ2V0T3V0ZXJIVE1MLFxuXHRtZXJnZU9wdGlvbnM6IG1lcmdlT3B0aW9ucyxcblx0cmVzb2x2ZUFzc2V0OiByZXNvbHZlQXNzZXQsXG5cdGFzc2VydEFzc2V0OiBhc3NlcnRBc3NldCxcblx0Y2hlY2tDb21wb25lbnRBdHRyOiBjaGVja0NvbXBvbmVudEF0dHIsXG5cdGNvbW1vblRhZ1JFOiBjb21tb25UYWdSRSxcblx0cmVzZXJ2ZWRUYWdSRTogcmVzZXJ2ZWRUYWdSRSxcblx0Z2V0IHdhcm4gKCkgeyByZXR1cm4gd2FybjsgfVxufSk7XG5cbnZhciB1aWQgPSAwO1xuXG5mdW5jdGlvbiBpbml0TWl4aW4gKFZ1ZSkge1xuICAvKipcbiAgICogVGhlIG1haW4gaW5pdCBzZXF1ZW5jZS4gVGhpcyBpcyBjYWxsZWQgZm9yIGV2ZXJ5XG4gICAqIGluc3RhbmNlLCBpbmNsdWRpbmcgb25lcyB0aGF0IGFyZSBjcmVhdGVkIGZyb20gZXh0ZW5kZWRcbiAgICogY29uc3RydWN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoaXMgb3B0aW9ucyBvYmplY3Qgc2hvdWxkIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIGNsYXNzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyBhbmQgdGhlIG9wdGlvbnMgcGFzc2VkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gdG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLiRwYXJlbnQgPSBvcHRpb25zLnBhcmVudDtcbiAgICB0aGlzLiRyb290ID0gdGhpcy4kcGFyZW50ID8gdGhpcy4kcGFyZW50LiRyb290IDogdGhpcztcbiAgICB0aGlzLiRjaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMuJHJlZnMgPSB7fTsgLy8gY2hpbGQgdm0gcmVmZXJlbmNlc1xuICAgIHRoaXMuJGVscyA9IHt9OyAvLyBlbGVtZW50IHJlZmVyZW5jZXNcbiAgICB0aGlzLl93YXRjaGVycyA9IFtdOyAvLyBhbGwgd2F0Y2hlcnMgYXMgYW4gYXJyYXlcbiAgICB0aGlzLl9kaXJlY3RpdmVzID0gW107IC8vIGFsbCBkaXJlY3RpdmVzXG5cbiAgICAvLyBhIHVpZFxuICAgIHRoaXMuX3VpZCA9IHVpZCsrO1xuXG4gICAgLy8gYSBmbGFnIHRvIGF2b2lkIHRoaXMgYmVpbmcgb2JzZXJ2ZWRcbiAgICB0aGlzLl9pc1Z1ZSA9IHRydWU7XG5cbiAgICAvLyBldmVudHMgYm9va2tlZXBpbmdcbiAgICB0aGlzLl9ldmVudHMgPSB7fTsgLy8gcmVnaXN0ZXJlZCBjYWxsYmFja3NcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IHt9OyAvLyBmb3IgJGJyb2FkY2FzdCBvcHRpbWl6YXRpb25cblxuICAgIC8vIGZyYWdtZW50IGluc3RhbmNlIHByb3BlcnRpZXNcbiAgICB0aGlzLl9pc0ZyYWdtZW50ID0gZmFsc2U7XG4gICAgdGhpcy5fZnJhZ21lbnQgPSAvLyBAdHlwZSB7RG9jdW1lbnRGcmFnbWVudH1cbiAgICB0aGlzLl9mcmFnbWVudFN0YXJ0ID0gLy8gQHR5cGUge1RleHR8Q29tbWVudH1cbiAgICB0aGlzLl9mcmFnbWVudEVuZCA9IG51bGw7IC8vIEB0eXBlIHtUZXh0fENvbW1lbnR9XG5cbiAgICAvLyBsaWZlY3ljbGUgc3RhdGVcbiAgICB0aGlzLl9pc0NvbXBpbGVkID0gdGhpcy5faXNEZXN0cm95ZWQgPSB0aGlzLl9pc1JlYWR5ID0gdGhpcy5faXNBdHRhY2hlZCA9IHRoaXMuX2lzQmVpbmdEZXN0cm95ZWQgPSB0aGlzLl92Rm9yUmVtb3ZpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl91bmxpbmtGbiA9IG51bGw7XG5cbiAgICAvLyBjb250ZXh0OlxuICAgIC8vIGlmIHRoaXMgaXMgYSB0cmFuc2NsdWRlZCBjb21wb25lbnQsIGNvbnRleHRcbiAgICAvLyB3aWxsIGJlIHRoZSBjb21tb24gcGFyZW50IHZtIG9mIHRoaXMgaW5zdGFuY2VcbiAgICAvLyBhbmQgaXRzIGhvc3QuXG4gICAgdGhpcy5fY29udGV4dCA9IG9wdGlvbnMuX2NvbnRleHQgfHwgdGhpcy4kcGFyZW50O1xuXG4gICAgLy8gc2NvcGU6XG4gICAgLy8gaWYgdGhpcyBpcyBpbnNpZGUgYW4gaW5saW5lIHYtZm9yLCB0aGUgc2NvcGVcbiAgICAvLyB3aWxsIGJlIHRoZSBpbnRlcm1lZGlhdGUgc2NvcGUgY3JlYXRlZCBmb3IgdGhpc1xuICAgIC8vIHJlcGVhdCBmcmFnbWVudC4gdGhpcyBpcyB1c2VkIGZvciBsaW5raW5nIHByb3BzXG4gICAgLy8gYW5kIGNvbnRhaW5lciBkaXJlY3RpdmVzLlxuICAgIHRoaXMuX3Njb3BlID0gb3B0aW9ucy5fc2NvcGU7XG5cbiAgICAvLyBmcmFnbWVudDpcbiAgICAvLyBpZiB0aGlzIGluc3RhbmNlIGlzIGNvbXBpbGVkIGluc2lkZSBhIEZyYWdtZW50LCBpdFxuICAgIC8vIG5lZWRzIHRvIHJlaWdzdGVyIGl0c2VsZiBhcyBhIGNoaWxkIG9mIHRoYXQgZnJhZ21lbnRcbiAgICAvLyBmb3IgYXR0YWNoL2RldGFjaCB0byB3b3JrIHByb3Blcmx5LlxuICAgIHRoaXMuX2ZyYWcgPSBvcHRpb25zLl9mcmFnO1xuICAgIGlmICh0aGlzLl9mcmFnKSB7XG4gICAgICB0aGlzLl9mcmFnLmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuXG4gICAgLy8gcHVzaCBzZWxmIGludG8gcGFyZW50IC8gdHJhbnNjbHVzaW9uIGhvc3RcbiAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICB0aGlzLiRwYXJlbnQuJGNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuXG4gICAgLy8gbWVyZ2Ugb3B0aW9ucy5cbiAgICBvcHRpb25zID0gdGhpcy4kb3B0aW9ucyA9IG1lcmdlT3B0aW9ucyh0aGlzLmNvbnN0cnVjdG9yLm9wdGlvbnMsIG9wdGlvbnMsIHRoaXMpO1xuXG4gICAgLy8gc2V0IHJlZlxuICAgIHRoaXMuX3VwZGF0ZVJlZigpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBkYXRhIGFzIGVtcHR5IG9iamVjdC5cbiAgICAvLyBpdCB3aWxsIGJlIGZpbGxlZCB1cCBpbiBfaW5pdFNjb3BlKCkuXG4gICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgLy8gc2F2ZSByYXcgY29uc3RydWN0b3IgZGF0YSBiZWZvcmUgbWVyZ2VcbiAgICAvLyBzbyB0aGF0IHdlIGtub3cgd2hpY2ggcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgYXRcbiAgICAvLyBpbnN0YW50aWF0aW9uLlxuICAgIHRoaXMuX3J1bnRpbWVEYXRhID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgLy8gY2FsbCBpbml0IGhvb2tcbiAgICB0aGlzLl9jYWxsSG9vaygnaW5pdCcpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBkYXRhIG9ic2VydmF0aW9uIGFuZCBzY29wZSBpbmhlcml0YW5jZS5cbiAgICB0aGlzLl9pbml0U3RhdGUoKTtcblxuICAgIC8vIHNldHVwIGV2ZW50IHN5c3RlbSBhbmQgb3B0aW9uIGV2ZW50cy5cbiAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG5cbiAgICAvLyBjYWxsIGNyZWF0ZWQgaG9va1xuICAgIHRoaXMuX2NhbGxIb29rKCdjcmVhdGVkJyk7XG5cbiAgICAvLyBpZiBgZWxgIG9wdGlvbiBpcyBwYXNzZWQsIHN0YXJ0IGNvbXBpbGF0aW9uLlxuICAgIGlmIChvcHRpb25zLmVsKSB7XG4gICAgICB0aGlzLiRtb3VudChvcHRpb25zLmVsKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBwYXRoQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMCk7XG5cbi8vIGFjdGlvbnNcbnZhciBBUFBFTkQgPSAwO1xudmFyIFBVU0ggPSAxO1xudmFyIElOQ19TVUJfUEFUSF9ERVBUSCA9IDI7XG52YXIgUFVTSF9TVUJfUEFUSCA9IDM7XG5cbi8vIHN0YXRlc1xudmFyIEJFRk9SRV9QQVRIID0gMDtcbnZhciBJTl9QQVRIID0gMTtcbnZhciBCRUZPUkVfSURFTlQgPSAyO1xudmFyIElOX0lERU5UID0gMztcbnZhciBJTl9TVUJfUEFUSCA9IDQ7XG52YXIgSU5fU0lOR0xFX1FVT1RFID0gNTtcbnZhciBJTl9ET1VCTEVfUVVPVEUgPSA2O1xudmFyIEFGVEVSX1BBVEggPSA3O1xudmFyIEVSUk9SID0gODtcblxudmFyIHBhdGhTdGF0ZU1hY2hpbmUgPSBbXTtcblxucGF0aFN0YXRlTWFjaGluZVtCRUZPUkVfUEFUSF0gPSB7XG4gICd3cyc6IFtCRUZPUkVfUEFUSF0sXG4gICdpZGVudCc6IFtJTl9JREVOVCwgQVBQRU5EXSxcbiAgJ1snOiBbSU5fU1VCX1BBVEhdLFxuICAnZW9mJzogW0FGVEVSX1BBVEhdXG59O1xuXG5wYXRoU3RhdGVNYWNoaW5lW0lOX1BBVEhdID0ge1xuICAnd3MnOiBbSU5fUEFUSF0sXG4gICcuJzogW0JFRk9SRV9JREVOVF0sXG4gICdbJzogW0lOX1NVQl9QQVRIXSxcbiAgJ2VvZic6IFtBRlRFUl9QQVRIXVxufTtcblxucGF0aFN0YXRlTWFjaGluZVtCRUZPUkVfSURFTlRdID0ge1xuICAnd3MnOiBbQkVGT1JFX0lERU5UXSxcbiAgJ2lkZW50JzogW0lOX0lERU5ULCBBUFBFTkRdXG59O1xuXG5wYXRoU3RhdGVNYWNoaW5lW0lOX0lERU5UXSA9IHtcbiAgJ2lkZW50JzogW0lOX0lERU5ULCBBUFBFTkRdLFxuICAnMCc6IFtJTl9JREVOVCwgQVBQRU5EXSxcbiAgJ251bWJlcic6IFtJTl9JREVOVCwgQVBQRU5EXSxcbiAgJ3dzJzogW0lOX1BBVEgsIFBVU0hdLFxuICAnLic6IFtCRUZPUkVfSURFTlQsIFBVU0hdLFxuICAnWyc6IFtJTl9TVUJfUEFUSCwgUFVTSF0sXG4gICdlb2YnOiBbQUZURVJfUEFUSCwgUFVTSF1cbn07XG5cbnBhdGhTdGF0ZU1hY2hpbmVbSU5fU1VCX1BBVEhdID0ge1xuICBcIidcIjogW0lOX1NJTkdMRV9RVU9URSwgQVBQRU5EXSxcbiAgJ1wiJzogW0lOX0RPVUJMRV9RVU9URSwgQVBQRU5EXSxcbiAgJ1snOiBbSU5fU1VCX1BBVEgsIElOQ19TVUJfUEFUSF9ERVBUSF0sXG4gICddJzogW0lOX1BBVEgsIFBVU0hfU1VCX1BBVEhdLFxuICAnZW9mJzogRVJST1IsXG4gICdlbHNlJzogW0lOX1NVQl9QQVRILCBBUFBFTkRdXG59O1xuXG5wYXRoU3RhdGVNYWNoaW5lW0lOX1NJTkdMRV9RVU9URV0gPSB7XG4gIFwiJ1wiOiBbSU5fU1VCX1BBVEgsIEFQUEVORF0sXG4gICdlb2YnOiBFUlJPUixcbiAgJ2Vsc2UnOiBbSU5fU0lOR0xFX1FVT1RFLCBBUFBFTkRdXG59O1xuXG5wYXRoU3RhdGVNYWNoaW5lW0lOX0RPVUJMRV9RVU9URV0gPSB7XG4gICdcIic6IFtJTl9TVUJfUEFUSCwgQVBQRU5EXSxcbiAgJ2VvZic6IEVSUk9SLFxuICAnZWxzZSc6IFtJTl9ET1VCTEVfUVVPVEUsIEFQUEVORF1cbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGEgY2hhcmFjdGVyIGluIGEga2V5cGF0aC5cbiAqXG4gKiBAcGFyYW0ge0NoYXJ9IGNoXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHR5cGVcbiAqL1xuXG5mdW5jdGlvbiBnZXRQYXRoQ2hhclR5cGUoY2gpIHtcbiAgaWYgKGNoID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJ2VvZic7XG4gIH1cblxuICB2YXIgY29kZSA9IGNoLmNoYXJDb2RlQXQoMCk7XG5cbiAgc3dpdGNoIChjb2RlKSB7XG4gICAgY2FzZSAweDVCOiAvLyBbXG4gICAgY2FzZSAweDVEOiAvLyBdXG4gICAgY2FzZSAweDJFOiAvLyAuXG4gICAgY2FzZSAweDIyOiAvLyBcIlxuICAgIGNhc2UgMHgyNzogLy8gJ1xuICAgIGNhc2UgMHgzMDpcbiAgICAgIC8vIDBcbiAgICAgIHJldHVybiBjaDtcblxuICAgIGNhc2UgMHg1RjogLy8gX1xuICAgIGNhc2UgMHgyNDpcbiAgICAgIC8vICRcbiAgICAgIHJldHVybiAnaWRlbnQnO1xuXG4gICAgY2FzZSAweDIwOiAvLyBTcGFjZVxuICAgIGNhc2UgMHgwOTogLy8gVGFiXG4gICAgY2FzZSAweDBBOiAvLyBOZXdsaW5lXG4gICAgY2FzZSAweDBEOiAvLyBSZXR1cm5cbiAgICBjYXNlIDB4QTA6IC8vIE5vLWJyZWFrIHNwYWNlXG4gICAgY2FzZSAweEZFRkY6IC8vIEJ5dGUgT3JkZXIgTWFya1xuICAgIGNhc2UgMHgyMDI4OiAvLyBMaW5lIFNlcGFyYXRvclxuICAgIGNhc2UgMHgyMDI5OlxuICAgICAgLy8gUGFyYWdyYXBoIFNlcGFyYXRvclxuICAgICAgcmV0dXJuICd3cyc7XG4gIH1cblxuICAvLyBhLXosIEEtWlxuICBpZiAoY29kZSA+PSAweDYxICYmIGNvZGUgPD0gMHg3QSB8fCBjb2RlID49IDB4NDEgJiYgY29kZSA8PSAweDVBKSB7XG4gICAgcmV0dXJuICdpZGVudCc7XG4gIH1cblxuICAvLyAxLTlcbiAgaWYgKGNvZGUgPj0gMHgzMSAmJiBjb2RlIDw9IDB4MzkpIHtcbiAgICByZXR1cm4gJ251bWJlcic7XG4gIH1cblxuICByZXR1cm4gJ2Vsc2UnO1xufVxuXG4vKipcbiAqIEZvcm1hdCBhIHN1YlBhdGgsIHJldHVybiBpdHMgcGxhaW4gZm9ybSBpZiBpdCBpc1xuICogYSBsaXRlcmFsIHN0cmluZyBvciBudW1iZXIuIE90aGVyd2lzZSBwcmVwZW5kIHRoZVxuICogZHluYW1pYyBpbmRpY2F0b3IgKCopLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0U3ViUGF0aChwYXRoKSB7XG4gIHZhciB0cmltbWVkID0gcGF0aC50cmltKCk7XG4gIC8vIGludmFsaWQgbGVhZGluZyAwXG4gIGlmIChwYXRoLmNoYXJBdCgwKSA9PT0gJzAnICYmIGlzTmFOKHBhdGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBpc0xpdGVyYWwodHJpbW1lZCkgPyBzdHJpcFF1b3Rlcyh0cmltbWVkKSA6ICcqJyArIHRyaW1tZWQ7XG59XG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgcGF0aCBpbnRvIGFuIGFycmF5IG9mIHNlZ21lbnRzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEByZXR1cm4ge0FycmF5fHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShwYXRoKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciBpbmRleCA9IC0xO1xuICB2YXIgbW9kZSA9IEJFRk9SRV9QQVRIO1xuICB2YXIgc3ViUGF0aERlcHRoID0gMDtcbiAgdmFyIGMsIG5ld0NoYXIsIGtleSwgdHlwZSwgdHJhbnNpdGlvbiwgYWN0aW9uLCB0eXBlTWFwO1xuXG4gIHZhciBhY3Rpb25zID0gW107XG5cbiAgYWN0aW9uc1tQVVNIXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoa2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAga2V5ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICBhY3Rpb25zW0FQUEVORF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBrZXkgPSBuZXdDaGFyO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgKz0gbmV3Q2hhcjtcbiAgICB9XG4gIH07XG5cbiAgYWN0aW9uc1tJTkNfU1VCX1BBVEhfREVQVEhdID0gZnVuY3Rpb24gKCkge1xuICAgIGFjdGlvbnNbQVBQRU5EXSgpO1xuICAgIHN1YlBhdGhEZXB0aCsrO1xuICB9O1xuXG4gIGFjdGlvbnNbUFVTSF9TVUJfUEFUSF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHN1YlBhdGhEZXB0aCA+IDApIHtcbiAgICAgIHN1YlBhdGhEZXB0aC0tO1xuICAgICAgbW9kZSA9IElOX1NVQl9QQVRIO1xuICAgICAgYWN0aW9uc1tBUFBFTkRdKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YlBhdGhEZXB0aCA9IDA7XG4gICAgICBrZXkgPSBmb3JtYXRTdWJQYXRoKGtleSk7XG4gICAgICBpZiAoa2V5ID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3Rpb25zW1BVU0hdKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIG1heWJlVW5lc2NhcGVRdW90ZSgpIHtcbiAgICB2YXIgbmV4dENoYXIgPSBwYXRoW2luZGV4ICsgMV07XG4gICAgaWYgKG1vZGUgPT09IElOX1NJTkdMRV9RVU9URSAmJiBuZXh0Q2hhciA9PT0gXCInXCIgfHwgbW9kZSA9PT0gSU5fRE9VQkxFX1FVT1RFICYmIG5leHRDaGFyID09PSAnXCInKSB7XG4gICAgICBpbmRleCsrO1xuICAgICAgbmV3Q2hhciA9ICdcXFxcJyArIG5leHRDaGFyO1xuICAgICAgYWN0aW9uc1tBUFBFTkRdKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB3aGlsZSAobW9kZSAhPSBudWxsKSB7XG4gICAgaW5kZXgrKztcbiAgICBjID0gcGF0aFtpbmRleF07XG5cbiAgICBpZiAoYyA9PT0gJ1xcXFwnICYmIG1heWJlVW5lc2NhcGVRdW90ZSgpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB0eXBlID0gZ2V0UGF0aENoYXJUeXBlKGMpO1xuICAgIHR5cGVNYXAgPSBwYXRoU3RhdGVNYWNoaW5lW21vZGVdO1xuICAgIHRyYW5zaXRpb24gPSB0eXBlTWFwW3R5cGVdIHx8IHR5cGVNYXBbJ2Vsc2UnXSB8fCBFUlJPUjtcblxuICAgIGlmICh0cmFuc2l0aW9uID09PSBFUlJPUikge1xuICAgICAgcmV0dXJuOyAvLyBwYXJzZSBlcnJvclxuICAgIH1cblxuICAgIG1vZGUgPSB0cmFuc2l0aW9uWzBdO1xuICAgIGFjdGlvbiA9IGFjdGlvbnNbdHJhbnNpdGlvblsxXV07XG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgbmV3Q2hhciA9IHRyYW5zaXRpb25bMl07XG4gICAgICBuZXdDaGFyID0gbmV3Q2hhciA9PT0gdW5kZWZpbmVkID8gYyA6IG5ld0NoYXI7XG4gICAgICBpZiAoYWN0aW9uKCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kZSA9PT0gQUZURVJfUEFUSCkge1xuICAgICAga2V5cy5yYXcgPSBwYXRoO1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXh0ZXJuYWwgcGFyc2UgdGhhdCBjaGVjayBmb3IgYSBjYWNoZSBoaXQgZmlyc3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHJldHVybiB7QXJyYXl8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlUGF0aChwYXRoKSB7XG4gIHZhciBoaXQgPSBwYXRoQ2FjaGUuZ2V0KHBhdGgpO1xuICBpZiAoIWhpdCkge1xuICAgIGhpdCA9IHBhcnNlKHBhdGgpO1xuICAgIGlmIChoaXQpIHtcbiAgICAgIHBhdGhDYWNoZS5wdXQocGF0aCwgaGl0KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhpdDtcbn1cblxuLyoqXG4gKiBHZXQgZnJvbSBhbiBvYmplY3QgZnJvbSBhIHBhdGggc3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqL1xuXG5mdW5jdGlvbiBnZXRQYXRoKG9iaiwgcGF0aCkge1xuICByZXR1cm4gcGFyc2VFeHByZXNzaW9uKHBhdGgpLmdldChvYmopO1xufVxuXG4vKipcbiAqIFdhcm4gYWdhaW5zdCBzZXR0aW5nIG5vbi1leGlzdGVudCByb290IHBhdGggb24gYSB2bS5cbiAqL1xuXG52YXIgd2Fybk5vbkV4aXN0ZW50O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgd2Fybk5vbkV4aXN0ZW50ID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB3YXJuKCdZb3UgYXJlIHNldHRpbmcgYSBub24tZXhpc3RlbnQgcGF0aCBcIicgKyBwYXRoLnJhdyArICdcIiAnICsgJ29uIGEgdm0gaW5zdGFuY2UuIENvbnNpZGVyIHByZS1pbml0aWFsaXppbmcgdGhlIHByb3BlcnR5ICcgKyAnd2l0aCB0aGUgXCJkYXRhXCIgb3B0aW9uIGZvciBtb3JlIHJlbGlhYmxlIHJlYWN0aXZpdHkgJyArICdhbmQgYmV0dGVyIHBlcmZvcm1hbmNlLicpO1xuICB9O1xufVxuXG4vKipcbiAqIFNldCBvbiBhbiBvYmplY3QgZnJvbSBhIHBhdGhcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZyB8IEFycmF5fSBwYXRoXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmZ1bmN0aW9uIHNldFBhdGgob2JqLCBwYXRoLCB2YWwpIHtcbiAgdmFyIG9yaWdpbmFsID0gb2JqO1xuICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgcGF0aCA9IHBhcnNlKHBhdGgpO1xuICB9XG4gIGlmICghcGF0aCB8fCAhaXNPYmplY3Qob2JqKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdCwga2V5O1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgbGFzdCA9IG9iajtcbiAgICBrZXkgPSBwYXRoW2ldO1xuICAgIGlmIChrZXkuY2hhckF0KDApID09PSAnKicpIHtcbiAgICAgIGtleSA9IHBhcnNlRXhwcmVzc2lvbihrZXkuc2xpY2UoMSkpLmdldC5jYWxsKG9yaWdpbmFsLCBvcmlnaW5hbCk7XG4gICAgfVxuICAgIGlmIChpIDwgbCAtIDEpIHtcbiAgICAgIG9iaiA9IG9ialtrZXldO1xuICAgICAgaWYgKCFpc09iamVjdChvYmopKSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBsYXN0Ll9pc1Z1ZSkge1xuICAgICAgICAgIHdhcm5Ob25FeGlzdGVudChwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBzZXQobGFzdCwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai4kc2V0KGtleSwgdmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIG9iai5faXNWdWUpIHtcbiAgICAgICAgICB3YXJuTm9uRXhpc3RlbnQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0KG9iaiwga2V5LCB2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIHBhdGggPSBPYmplY3QuZnJlZXplKHtcbiAgcGFyc2VQYXRoOiBwYXJzZVBhdGgsXG4gIGdldFBhdGg6IGdldFBhdGgsXG4gIHNldFBhdGg6IHNldFBhdGhcbn0pO1xuXG52YXIgZXhwcmVzc2lvbkNhY2hlID0gbmV3IENhY2hlKDEwMDApO1xuXG52YXIgYWxsb3dlZEtleXdvcmRzID0gJ01hdGgsRGF0ZSx0aGlzLHRydWUsZmFsc2UsbnVsbCx1bmRlZmluZWQsSW5maW5pdHksTmFOLCcgKyAnaXNOYU4saXNGaW5pdGUsZGVjb2RlVVJJLGRlY29kZVVSSUNvbXBvbmVudCxlbmNvZGVVUkksJyArICdlbmNvZGVVUklDb21wb25lbnQscGFyc2VJbnQscGFyc2VGbG9hdCc7XG52YXIgYWxsb3dlZEtleXdvcmRzUkUgPSBuZXcgUmVnRXhwKCdeKCcgKyBhbGxvd2VkS2V5d29yZHMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8JykgKyAnXFxcXGIpJyk7XG5cbi8vIGtleXdvcmRzIHRoYXQgZG9uJ3QgbWFrZSBzZW5zZSBpbnNpZGUgZXhwcmVzc2lvbnNcbnZhciBpbXByb3BlcktleXdvcmRzID0gJ2JyZWFrLGNhc2UsY2xhc3MsY2F0Y2gsY29uc3QsY29udGludWUsZGVidWdnZXIsZGVmYXVsdCwnICsgJ2RlbGV0ZSxkbyxlbHNlLGV4cG9ydCxleHRlbmRzLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLCcgKyAnaW1wb3J0LGluLGluc3RhbmNlb2YsbGV0LHJldHVybixzdXBlcixzd2l0Y2gsdGhyb3csdHJ5LCcgKyAndmFyLHdoaWxlLHdpdGgseWllbGQsZW51bSxhd2FpdCxpbXBsZW1lbnRzLHBhY2thZ2UsJyArICdwcm90ZWN0ZWQsc3RhdGljLGludGVyZmFjZSxwcml2YXRlLHB1YmxpYyc7XG52YXIgaW1wcm9wZXJLZXl3b3Jkc1JFID0gbmV3IFJlZ0V4cCgnXignICsgaW1wcm9wZXJLZXl3b3Jkcy5yZXBsYWNlKC8sL2csICdcXFxcYnwnKSArICdcXFxcYiknKTtcblxudmFyIHdzUkUgPSAvXFxzL2c7XG52YXIgbmV3bGluZVJFID0gL1xcbi9nO1xudmFyIHNhdmVSRSA9IC9bXFx7LF1cXHMqW1xcd1xcJF9dK1xccyo6fCgnKD86W14nXFxcXF18XFxcXC4pKid8XCIoPzpbXlwiXFxcXF18XFxcXC4pKlwifGAoPzpbXmBcXFxcXXxcXFxcLikqXFwkXFx7fFxcfSg/OlteYFxcXFxdfFxcXFwuKSpgfGAoPzpbXmBcXFxcXXxcXFxcLikqYCl8bmV3IHx0eXBlb2YgfHZvaWQgL2c7XG52YXIgcmVzdG9yZVJFID0gL1wiKFxcZCspXCIvZztcbnZhciBwYXRoVGVzdFJFID0gL15bQS1aYS16XyRdW1xcdyRdKig/OlxcLltBLVphLXpfJF1bXFx3JF0qfFxcWycuKj8nXFxdfFxcW1wiLio/XCJcXF18XFxbXFxkK1xcXXxcXFtbQS1aYS16XyRdW1xcdyRdKlxcXSkqJC87XG52YXIgaWRlbnRSRSA9IC9bXlxcdyRcXC5dKD86W0EtWmEtel8kXVtcXHckXSopL2c7XG52YXIgYm9vbGVhbkxpdGVyYWxSRSA9IC9eKD86dHJ1ZXxmYWxzZSkkLztcblxuLyoqXG4gKiBTYXZlIC8gUmV3cml0ZSAvIFJlc3RvcmVcbiAqXG4gKiBXaGVuIHJld3JpdGluZyBwYXRocyBmb3VuZCBpbiBhbiBleHByZXNzaW9uLCBpdCBpc1xuICogcG9zc2libGUgZm9yIHRoZSBzYW1lIGxldHRlciBzZXF1ZW5jZXMgdG8gYmUgZm91bmQgaW5cbiAqIHN0cmluZ3MgYW5kIE9iamVjdCBsaXRlcmFsIHByb3BlcnR5IGtleXMuIFRoZXJlZm9yZSB3ZVxuICogcmVtb3ZlIGFuZCBzdG9yZSB0aGVzZSBwYXJ0cyBpbiBhIHRlbXBvcmFyeSBhcnJheSwgYW5kXG4gKiByZXN0b3JlIHRoZW0gYWZ0ZXIgdGhlIHBhdGggcmV3cml0ZS5cbiAqL1xuXG52YXIgc2F2ZWQgPSBbXTtcblxuLyoqXG4gKiBTYXZlIHJlcGxhY2VyXG4gKlxuICogVGhlIHNhdmUgcmVnZXggY2FuIG1hdGNoIHR3byBwb3NzaWJsZSBjYXNlczpcbiAqIDEuIEFuIG9wZW5pbmcgb2JqZWN0IGxpdGVyYWxcbiAqIDIuIEEgc3RyaW5nXG4gKiBJZiBtYXRjaGVkIGFzIGEgcGxhaW4gc3RyaW5nLCB3ZSBuZWVkIHRvIGVzY2FwZSBpdHNcbiAqIG5ld2xpbmVzLCBzaW5jZSB0aGUgc3RyaW5nIG5lZWRzIHRvIGJlIHByZXNlcnZlZCB3aGVuXG4gKiBnZW5lcmF0aW5nIHRoZSBmdW5jdGlvbiBib2R5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpc1N0cmluZyAtIHN0ciBpZiBtYXRjaGVkIGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9IC0gcGxhY2Vob2xkZXIgd2l0aCBpbmRleFxuICovXG5cbmZ1bmN0aW9uIHNhdmUoc3RyLCBpc1N0cmluZykge1xuICB2YXIgaSA9IHNhdmVkLmxlbmd0aDtcbiAgc2F2ZWRbaV0gPSBpc1N0cmluZyA/IHN0ci5yZXBsYWNlKG5ld2xpbmVSRSwgJ1xcXFxuJykgOiBzdHI7XG4gIHJldHVybiAnXCInICsgaSArICdcIic7XG59XG5cbi8qKlxuICogUGF0aCByZXdyaXRlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJhd1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHJld3JpdGUocmF3KSB7XG4gIHZhciBjID0gcmF3LmNoYXJBdCgwKTtcbiAgdmFyIHBhdGggPSByYXcuc2xpY2UoMSk7XG4gIGlmIChhbGxvd2VkS2V5d29yZHNSRS50ZXN0KHBhdGgpKSB7XG4gICAgcmV0dXJuIHJhdztcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gcGF0aC5pbmRleE9mKCdcIicpID4gLTEgPyBwYXRoLnJlcGxhY2UocmVzdG9yZVJFLCByZXN0b3JlKSA6IHBhdGg7XG4gICAgcmV0dXJuIGMgKyAnc2NvcGUuJyArIHBhdGg7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXN0b3JlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGkgLSBtYXRjaGVkIHNhdmUgaW5kZXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByZXN0b3JlKHN0ciwgaSkge1xuICByZXR1cm4gc2F2ZWRbaV07XG59XG5cbi8qKlxuICogUmV3cml0ZSBhbiBleHByZXNzaW9uLCBwcmVmaXhpbmcgYWxsIHBhdGggYWNjZXNzb3JzIHdpdGhcbiAqIGBzY29wZS5gIGFuZCBnZW5lcmF0ZSBnZXR0ZXIvc2V0dGVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlR2V0dGVyKGV4cCkge1xuICBpZiAoaW1wcm9wZXJLZXl3b3Jkc1JFLnRlc3QoZXhwKSkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybignQXZvaWQgdXNpbmcgcmVzZXJ2ZWQga2V5d29yZHMgaW4gZXhwcmVzc2lvbjogJyArIGV4cCk7XG4gIH1cbiAgLy8gcmVzZXQgc3RhdGVcbiAgc2F2ZWQubGVuZ3RoID0gMDtcbiAgLy8gc2F2ZSBzdHJpbmdzIGFuZCBvYmplY3QgbGl0ZXJhbCBrZXlzXG4gIHZhciBib2R5ID0gZXhwLnJlcGxhY2Uoc2F2ZVJFLCBzYXZlKS5yZXBsYWNlKHdzUkUsICcnKTtcbiAgLy8gcmV3cml0ZSBhbGwgcGF0aHNcbiAgLy8gcGFkIDEgc3BhY2UgaGVyZSBiZWNhdWUgdGhlIHJlZ2V4IG1hdGNoZXMgMSBleHRyYSBjaGFyXG4gIGJvZHkgPSAoJyAnICsgYm9keSkucmVwbGFjZShpZGVudFJFLCByZXdyaXRlKS5yZXBsYWNlKHJlc3RvcmVSRSwgcmVzdG9yZSk7XG4gIHJldHVybiBtYWtlR2V0dGVyRm4oYm9keSk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBnZXR0ZXIgZnVuY3Rpb24uIFJlcXVpcmVzIGV2YWwuXG4gKlxuICogV2UgaXNvbGF0ZSB0aGUgdHJ5L2NhdGNoIHNvIGl0IGRvZXNuJ3QgYWZmZWN0IHRoZVxuICogb3B0aW1pemF0aW9uIG9mIHRoZSBwYXJzZSBmdW5jdGlvbiB3aGVuIGl0IGlzIG5vdCBjYWxsZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlR2V0dGVyRm4oYm9keSkge1xuICB0cnkge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLW5ldy1mdW5jICovXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAncmV0dXJuICcgKyBib2R5ICsgJzsnKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLW5ldy1mdW5jICovXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0ludmFsaWQgZXhwcmVzc2lvbi4gJyArICdHZW5lcmF0ZWQgZnVuY3Rpb24gYm9keTogJyArIGJvZHkpO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIHNldHRlciBmdW5jdGlvbiBmb3IgdGhlIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVTZXR0ZXIoZXhwKSB7XG4gIHZhciBwYXRoID0gcGFyc2VQYXRoKGV4cCk7XG4gIGlmIChwYXRoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgdmFsKSB7XG4gICAgICBzZXRQYXRoKHNjb3BlLCBwYXRoLCB2YWwpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKCdJbnZhbGlkIHNldHRlciBleHByZXNzaW9uOiAnICsgZXhwKTtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIGFuIGV4cHJlc3Npb24gaW50byByZS13cml0dGVuIGdldHRlci9zZXR0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbmVlZFNldFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGV4cCwgbmVlZFNldCkge1xuICBleHAgPSBleHAudHJpbSgpO1xuICAvLyB0cnkgY2FjaGVcbiAgdmFyIGhpdCA9IGV4cHJlc3Npb25DYWNoZS5nZXQoZXhwKTtcbiAgaWYgKGhpdCkge1xuICAgIGlmIChuZWVkU2V0ICYmICFoaXQuc2V0KSB7XG4gICAgICBoaXQuc2V0ID0gY29tcGlsZVNldHRlcihoaXQuZXhwKTtcbiAgICB9XG4gICAgcmV0dXJuIGhpdDtcbiAgfVxuICB2YXIgcmVzID0geyBleHA6IGV4cCB9O1xuICByZXMuZ2V0ID0gaXNTaW1wbGVQYXRoKGV4cCkgJiYgZXhwLmluZGV4T2YoJ1snKSA8IDBcbiAgLy8gb3B0aW1pemVkIHN1cGVyIHNpbXBsZSBnZXR0ZXJcbiAgPyBtYWtlR2V0dGVyRm4oJ3Njb3BlLicgKyBleHApXG4gIC8vIGR5bmFtaWMgZ2V0dGVyXG4gIDogY29tcGlsZUdldHRlcihleHApO1xuICBpZiAobmVlZFNldCkge1xuICAgIHJlcy5zZXQgPSBjb21waWxlU2V0dGVyKGV4cCk7XG4gIH1cbiAgZXhwcmVzc2lvbkNhY2hlLnB1dChleHAsIHJlcyk7XG4gIHJldHVybiByZXM7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gZXhwcmVzc2lvbiBpcyBhIHNpbXBsZSBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gaXNTaW1wbGVQYXRoKGV4cCkge1xuICByZXR1cm4gcGF0aFRlc3RSRS50ZXN0KGV4cCkgJiZcbiAgLy8gZG9uJ3QgdHJlYXQgdHJ1ZS9mYWxzZSBhcyBwYXRoc1xuICAhYm9vbGVhbkxpdGVyYWxSRS50ZXN0KGV4cCkgJiZcbiAgLy8gTWF0aCBjb25zdGFudHMgZS5nLiBNYXRoLlBJLCBNYXRoLkUgZXRjLlxuICBleHAuc2xpY2UoMCwgNSkgIT09ICdNYXRoLic7XG59XG5cbnZhciBleHByZXNzaW9uID0gT2JqZWN0LmZyZWV6ZSh7XG4gIHBhcnNlRXhwcmVzc2lvbjogcGFyc2VFeHByZXNzaW9uLFxuICBpc1NpbXBsZVBhdGg6IGlzU2ltcGxlUGF0aFxufSk7XG5cbi8vIHdlIGhhdmUgdHdvIHNlcGFyYXRlIHF1ZXVlczogb25lIGZvciBkaXJlY3RpdmUgdXBkYXRlc1xuLy8gYW5kIG9uZSBmb3IgdXNlciB3YXRjaGVyIHJlZ2lzdGVyZWQgdmlhICR3YXRjaCgpLlxuLy8gd2Ugd2FudCB0byBndWFyYW50ZWUgZGlyZWN0aXZlIHVwZGF0ZXMgdG8gYmUgY2FsbGVkXG4vLyBiZWZvcmUgdXNlciB3YXRjaGVycyBzbyB0aGF0IHdoZW4gdXNlciB3YXRjaGVycyBhcmVcbi8vIHRyaWdnZXJlZCwgdGhlIERPTSB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBpbiB1cGRhdGVkXG4vLyBzdGF0ZS5cblxudmFyIHF1ZXVlSW5kZXg7XG52YXIgcXVldWUgPSBbXTtcbnZhciB1c2VyUXVldWUgPSBbXTtcbnZhciBoYXMgPSB7fTtcbnZhciBjaXJjdWxhciA9IHt9O1xudmFyIHdhaXRpbmcgPSBmYWxzZTtcbnZhciBpbnRlcm5hbFF1ZXVlRGVwbGV0ZWQgPSBmYWxzZTtcblxuLyoqXG4gKiBSZXNldCB0aGUgYmF0Y2hlcidzIHN0YXRlLlxuICovXG5cbmZ1bmN0aW9uIHJlc2V0QmF0Y2hlclN0YXRlKCkge1xuICBxdWV1ZSA9IFtdO1xuICB1c2VyUXVldWUgPSBbXTtcbiAgaGFzID0ge307XG4gIGNpcmN1bGFyID0ge307XG4gIHdhaXRpbmcgPSBpbnRlcm5hbFF1ZXVlRGVwbGV0ZWQgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBGbHVzaCBib3RoIHF1ZXVlcyBhbmQgcnVuIHRoZSB3YXRjaGVycy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaEJhdGNoZXJRdWV1ZSgpIHtcbiAgcnVuQmF0Y2hlclF1ZXVlKHF1ZXVlKTtcbiAgaW50ZXJuYWxRdWV1ZURlcGxldGVkID0gdHJ1ZTtcbiAgcnVuQmF0Y2hlclF1ZXVlKHVzZXJRdWV1ZSk7XG4gIC8vIGRldiB0b29sIGhvb2tcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChkZXZ0b29scyAmJiBjb25maWcuZGV2dG9vbHMpIHtcbiAgICBkZXZ0b29scy5lbWl0KCdmbHVzaCcpO1xuICB9XG4gIHJlc2V0QmF0Y2hlclN0YXRlKCk7XG59XG5cbi8qKlxuICogUnVuIHRoZSB3YXRjaGVycyBpbiBhIHNpbmdsZSBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBxdWV1ZVxuICovXG5cbmZ1bmN0aW9uIHJ1bkJhdGNoZXJRdWV1ZShxdWV1ZSkge1xuICAvLyBkbyBub3QgY2FjaGUgbGVuZ3RoIGJlY2F1c2UgbW9yZSB3YXRjaGVycyBtaWdodCBiZSBwdXNoZWRcbiAgLy8gYXMgd2UgcnVuIGV4aXN0aW5nIHdhdGNoZXJzXG4gIGZvciAocXVldWVJbmRleCA9IDA7IHF1ZXVlSW5kZXggPCBxdWV1ZS5sZW5ndGg7IHF1ZXVlSW5kZXgrKykge1xuICAgIHZhciB3YXRjaGVyID0gcXVldWVbcXVldWVJbmRleF07XG4gICAgdmFyIGlkID0gd2F0Y2hlci5pZDtcbiAgICBoYXNbaWRdID0gbnVsbDtcbiAgICB3YXRjaGVyLnJ1bigpO1xuICAgIC8vIGluIGRldiBidWlsZCwgY2hlY2sgYW5kIHN0b3AgY2lyY3VsYXIgdXBkYXRlcy5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBoYXNbaWRdICE9IG51bGwpIHtcbiAgICAgIGNpcmN1bGFyW2lkXSA9IChjaXJjdWxhcltpZF0gfHwgMCkgKyAxO1xuICAgICAgaWYgKGNpcmN1bGFyW2lkXSA+IGNvbmZpZy5fbWF4VXBkYXRlQ291bnQpIHtcbiAgICAgICAgcXVldWUuc3BsaWNlKGhhc1tpZF0sIDEpO1xuICAgICAgICB3YXJuKCdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgZm9yIHdhdGNoZXIgJyArICd3aXRoIGV4cHJlc3Npb246ICcgKyB3YXRjaGVyLmV4cHJlc3Npb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFB1c2ggYSB3YXRjaGVyIGludG8gdGhlIHdhdGNoZXIgcXVldWUuXG4gKiBKb2JzIHdpdGggZHVwbGljYXRlIElEcyB3aWxsIGJlIHNraXBwZWQgdW5sZXNzIGl0J3NcbiAqIHB1c2hlZCB3aGVuIHRoZSBxdWV1ZSBpcyBiZWluZyBmbHVzaGVkLlxuICpcbiAqIEBwYXJhbSB7V2F0Y2hlcn0gd2F0Y2hlclxuICogICBwcm9wZXJ0aWVzOlxuICogICAtIHtOdW1iZXJ9IGlkXG4gKiAgIC0ge0Z1bmN0aW9ufSBydW5cbiAqL1xuXG5mdW5jdGlvbiBwdXNoV2F0Y2hlcih3YXRjaGVyKSB7XG4gIHZhciBpZCA9IHdhdGNoZXIuaWQ7XG4gIGlmIChoYXNbaWRdID09IG51bGwpIHtcbiAgICBpZiAoaW50ZXJuYWxRdWV1ZURlcGxldGVkICYmICF3YXRjaGVyLnVzZXIpIHtcbiAgICAgIC8vIGFuIGludGVybmFsIHdhdGNoZXIgdHJpZ2dlcmVkIGJ5IGEgdXNlciB3YXRjaGVyLi4uXG4gICAgICAvLyBsZXQncyBydW4gaXQgaW1tZWRpYXRlbHkgYWZ0ZXIgY3VycmVudCB1c2VyIHdhdGNoZXIgaXMgZG9uZS5cbiAgICAgIHVzZXJRdWV1ZS5zcGxpY2UocXVldWVJbmRleCArIDEsIDAsIHdhdGNoZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwdXNoIHdhdGNoZXIgaW50byBhcHByb3ByaWF0ZSBxdWV1ZVxuICAgICAgdmFyIHEgPSB3YXRjaGVyLnVzZXIgPyB1c2VyUXVldWUgOiBxdWV1ZTtcbiAgICAgIGhhc1tpZF0gPSBxLmxlbmd0aDtcbiAgICAgIHEucHVzaCh3YXRjaGVyKTtcbiAgICAgIC8vIHF1ZXVlIHRoZSBmbHVzaFxuICAgICAgaWYgKCF3YWl0aW5nKSB7XG4gICAgICAgIHdhaXRpbmcgPSB0cnVlO1xuICAgICAgICBuZXh0VGljayhmbHVzaEJhdGNoZXJRdWV1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciB1aWQkMiA9IDA7XG5cbi8qKlxuICogQSB3YXRjaGVyIHBhcnNlcyBhbiBleHByZXNzaW9uLCBjb2xsZWN0cyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgZmlyZXMgY2FsbGJhY2sgd2hlbiB0aGUgZXhwcmVzc2lvbiB2YWx1ZSBjaGFuZ2VzLlxuICogVGhpcyBpcyB1c2VkIGZvciBib3RoIHRoZSAkd2F0Y2goKSBhcGkgYW5kIGRpcmVjdGl2ZXMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gZXhwT3JGblxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXl9IGZpbHRlcnNcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSB0d29XYXlcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBkZWVwXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gdXNlclxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IHN5bmNcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBsYXp5XG4gKiAgICAgICAgICAgICAgICAgLSB7RnVuY3Rpb259IFtwcmVQcm9jZXNzXVxuICogICAgICAgICAgICAgICAgIC0ge0Z1bmN0aW9ufSBbcG9zdFByb2Nlc3NdXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gV2F0Y2hlcih2bSwgZXhwT3JGbiwgY2IsIG9wdGlvbnMpIHtcbiAgLy8gbWl4IGluIG9wdGlvbnNcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBleHRlbmQodGhpcywgb3B0aW9ucyk7XG4gIH1cbiAgdmFyIGlzRm4gPSB0eXBlb2YgZXhwT3JGbiA9PT0gJ2Z1bmN0aW9uJztcbiAgdGhpcy52bSA9IHZtO1xuICB2bS5fd2F0Y2hlcnMucHVzaCh0aGlzKTtcbiAgdGhpcy5leHByZXNzaW9uID0gZXhwT3JGbjtcbiAgdGhpcy5jYiA9IGNiO1xuICB0aGlzLmlkID0gKyt1aWQkMjsgLy8gdWlkIGZvciBiYXRjaGluZ1xuICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gIHRoaXMuZGlydHkgPSB0aGlzLmxhenk7IC8vIGZvciBsYXp5IHdhdGNoZXJzXG4gIHRoaXMuZGVwcyA9IFtdO1xuICB0aGlzLm5ld0RlcHMgPSBbXTtcbiAgdGhpcy5kZXBJZHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB0aGlzLm5ld0RlcElkcyA9IG51bGw7XG4gIHRoaXMucHJldkVycm9yID0gbnVsbDsgLy8gZm9yIGFzeW5jIGVycm9yIHN0YWNrc1xuICAvLyBwYXJzZSBleHByZXNzaW9uIGZvciBnZXR0ZXIvc2V0dGVyXG4gIGlmIChpc0ZuKSB7XG4gICAgdGhpcy5nZXR0ZXIgPSBleHBPckZuO1xuICAgIHRoaXMuc2V0dGVyID0gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIHZhciByZXMgPSBwYXJzZUV4cHJlc3Npb24oZXhwT3JGbiwgdGhpcy50d29XYXkpO1xuICAgIHRoaXMuZ2V0dGVyID0gcmVzLmdldDtcbiAgICB0aGlzLnNldHRlciA9IHJlcy5zZXQ7XG4gIH1cbiAgdGhpcy52YWx1ZSA9IHRoaXMubGF6eSA/IHVuZGVmaW5lZCA6IHRoaXMuZ2V0KCk7XG4gIC8vIHN0YXRlIGZvciBhdm9pZGluZyBmYWxzZSB0cmlnZ2VycyBmb3IgZGVlcCBhbmQgQXJyYXlcbiAgLy8gd2F0Y2hlcnMgZHVyaW5nIHZtLl9kaWdlc3QoKVxuICB0aGlzLnF1ZXVlZCA9IHRoaXMuc2hhbGxvdyA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEV2YWx1YXRlIHRoZSBnZXR0ZXIsIGFuZCByZS1jb2xsZWN0IGRlcGVuZGVuY2llcy5cbiAqL1xuXG5XYXRjaGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYmVmb3JlR2V0KCk7XG4gIHZhciBzY29wZSA9IHRoaXMuc2NvcGUgfHwgdGhpcy52bTtcbiAgdmFyIHZhbHVlO1xuICB0cnkge1xuICAgIHZhbHVlID0gdGhpcy5nZXR0ZXIuY2FsbChzY29wZSwgc2NvcGUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgY29uZmlnLndhcm5FeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICB3YXJuKCdFcnJvciB3aGVuIGV2YWx1YXRpbmcgZXhwcmVzc2lvbiBcIicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIuICcgKyAoY29uZmlnLmRlYnVnID8gJycgOiAnVHVybiBvbiBkZWJ1ZyBtb2RlIHRvIHNlZSBzdGFjayB0cmFjZS4nKSwgZSk7XG4gICAgfVxuICB9XG4gIC8vIFwidG91Y2hcIiBldmVyeSBwcm9wZXJ0eSBzbyB0aGV5IGFyZSBhbGwgdHJhY2tlZCBhc1xuICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcbiAgaWYgKHRoaXMuZGVlcCkge1xuICAgIHRyYXZlcnNlKHZhbHVlKTtcbiAgfVxuICBpZiAodGhpcy5wcmVQcm9jZXNzKSB7XG4gICAgdmFsdWUgPSB0aGlzLnByZVByb2Nlc3ModmFsdWUpO1xuICB9XG4gIGlmICh0aGlzLmZpbHRlcnMpIHtcbiAgICB2YWx1ZSA9IHNjb3BlLl9hcHBseUZpbHRlcnModmFsdWUsIG51bGwsIHRoaXMuZmlsdGVycywgZmFsc2UpO1xuICB9XG4gIGlmICh0aGlzLnBvc3RQcm9jZXNzKSB7XG4gICAgdmFsdWUgPSB0aGlzLnBvc3RQcm9jZXNzKHZhbHVlKTtcbiAgfVxuICB0aGlzLmFmdGVyR2V0KCk7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIHdpdGggdGhlIHNldHRlci5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxuV2F0Y2hlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBzY29wZSA9IHRoaXMuc2NvcGUgfHwgdGhpcy52bTtcbiAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgIHZhbHVlID0gc2NvcGUuX2FwcGx5RmlsdGVycyh2YWx1ZSwgdGhpcy52YWx1ZSwgdGhpcy5maWx0ZXJzLCB0cnVlKTtcbiAgfVxuICB0cnkge1xuICAgIHRoaXMuc2V0dGVyLmNhbGwoc2NvcGUsIHNjb3BlLCB2YWx1ZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcud2FybkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAgIHdhcm4oJ0Vycm9yIHdoZW4gZXZhbHVhdGluZyBzZXR0ZXIgXCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiJywgZSk7XG4gICAgfVxuICB9XG4gIC8vIHR3by13YXkgc3luYyBmb3Igdi1mb3IgYWxpYXNcbiAgdmFyIGZvckNvbnRleHQgPSBzY29wZS4kZm9yQ29udGV4dDtcbiAgaWYgKGZvckNvbnRleHQgJiYgZm9yQ29udGV4dC5hbGlhcyA9PT0gdGhpcy5leHByZXNzaW9uKSB7XG4gICAgaWYgKGZvckNvbnRleHQuZmlsdGVycykge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKCdJdCBzZWVtcyB5b3UgYXJlIHVzaW5nIHR3by13YXkgYmluZGluZyBvbiAnICsgJ2Egdi1mb3IgYWxpYXMgKCcgKyB0aGlzLmV4cHJlc3Npb24gKyAnKSwgYW5kIHRoZSAnICsgJ3YtZm9yIGhhcyBmaWx0ZXJzLiBUaGlzIHdpbGwgbm90IHdvcmsgcHJvcGVybHkuICcgKyAnRWl0aGVyIHJlbW92ZSB0aGUgZmlsdGVycyBvciB1c2UgYW4gYXJyYXkgb2YgJyArICdvYmplY3RzIGFuZCBiaW5kIHRvIG9iamVjdCBwcm9wZXJ0aWVzIGluc3RlYWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvckNvbnRleHQuX3dpdGhMb2NrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzY29wZS4ka2V5KSB7XG4gICAgICAgIC8vIG9yaWdpbmFsIGlzIGFuIG9iamVjdFxuICAgICAgICBmb3JDb250ZXh0LnJhd1ZhbHVlW3Njb3BlLiRrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JDb250ZXh0LnJhd1ZhbHVlLiRzZXQoc2NvcGUuJGluZGV4LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogUHJlcGFyZSBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5cbldhdGNoZXIucHJvdG90eXBlLmJlZm9yZUdldCA9IGZ1bmN0aW9uICgpIHtcbiAgRGVwLnRhcmdldCA9IHRoaXM7XG4gIHRoaXMubmV3RGVwSWRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdGhpcy5uZXdEZXBzLmxlbmd0aCA9IDA7XG59O1xuXG4vKipcbiAqIEFkZCBhIGRlcGVuZGVuY3kgdG8gdGhpcyBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtEZXB9IGRlcFxuICovXG5cbldhdGNoZXIucHJvdG90eXBlLmFkZERlcCA9IGZ1bmN0aW9uIChkZXApIHtcbiAgdmFyIGlkID0gZGVwLmlkO1xuICBpZiAoIXRoaXMubmV3RGVwSWRzW2lkXSkge1xuICAgIHRoaXMubmV3RGVwSWRzW2lkXSA9IHRydWU7XG4gICAgdGhpcy5uZXdEZXBzLnB1c2goZGVwKTtcbiAgICBpZiAoIXRoaXMuZGVwSWRzW2lkXSkge1xuICAgICAgZGVwLmFkZFN1Yih0aGlzKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQ2xlYW4gdXAgZm9yIGRlcGVuZGVuY3kgY29sbGVjdGlvbi5cbiAqL1xuXG5XYXRjaGVyLnByb3RvdHlwZS5hZnRlckdldCA9IGZ1bmN0aW9uICgpIHtcbiAgRGVwLnRhcmdldCA9IG51bGw7XG4gIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBkZXAgPSB0aGlzLmRlcHNbaV07XG4gICAgaWYgKCF0aGlzLm5ld0RlcElkc1tkZXAuaWRdKSB7XG4gICAgICBkZXAucmVtb3ZlU3ViKHRoaXMpO1xuICAgIH1cbiAgfVxuICB0aGlzLmRlcElkcyA9IHRoaXMubmV3RGVwSWRzO1xuICB2YXIgdG1wID0gdGhpcy5kZXBzO1xuICB0aGlzLmRlcHMgPSB0aGlzLm5ld0RlcHM7XG4gIHRoaXMubmV3RGVwcyA9IHRtcDtcbn07XG5cbi8qKlxuICogU3Vic2NyaWJlciBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgZGVwZW5kZW5jeSBjaGFuZ2VzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hhbGxvd1xuICovXG5cbldhdGNoZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChzaGFsbG93KSB7XG4gIGlmICh0aGlzLmxhenkpIHtcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh0aGlzLnN5bmMgfHwgIWNvbmZpZy5hc3luYykge1xuICAgIHRoaXMucnVuKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgcXVldWVkLCBvbmx5IG92ZXJ3cml0ZSBzaGFsbG93IHdpdGggbm9uLXNoYWxsb3csXG4gICAgLy8gYnV0IG5vdCB0aGUgb3RoZXIgd2F5IGFyb3VuZC5cbiAgICB0aGlzLnNoYWxsb3cgPSB0aGlzLnF1ZXVlZCA/IHNoYWxsb3cgPyB0aGlzLnNoYWxsb3cgOiBmYWxzZSA6ICEhc2hhbGxvdztcbiAgICB0aGlzLnF1ZXVlZCA9IHRydWU7XG4gICAgLy8gcmVjb3JkIGJlZm9yZS1wdXNoIGVycm9yIHN0YWNrIGluIGRlYnVnIG1vZGVcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcuZGVidWcpIHtcbiAgICAgIHRoaXMucHJldkVycm9yID0gbmV3IEVycm9yKCdbdnVlXSBhc3luYyBzdGFjayB0cmFjZScpO1xuICAgIH1cbiAgICBwdXNoV2F0Y2hlcih0aGlzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBCYXRjaGVyIGpvYiBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCBieSB0aGUgYmF0Y2hlci5cbiAqL1xuXG5XYXRjaGVyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KCk7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLnZhbHVlIHx8XG4gICAgLy8gRGVlcCB3YXRjaGVycyBhbmQgd2F0Y2hlcnMgb24gT2JqZWN0L0FycmF5cyBzaG91bGQgZmlyZSBldmVuXG4gICAgLy8gd2hlbiB0aGUgdmFsdWUgaXMgdGhlIHNhbWUsIGJlY2F1c2UgdGhlIHZhbHVlIG1heVxuICAgIC8vIGhhdmUgbXV0YXRlZDsgYnV0IG9ubHkgZG8gc28gaWYgdGhpcyBpcyBhXG4gICAgLy8gbm9uLXNoYWxsb3cgdXBkYXRlIChjYXVzZWQgYnkgYSB2bSBkaWdlc3QpLlxuICAgIChpc09iamVjdCh2YWx1ZSkgfHwgdGhpcy5kZWVwKSAmJiAhdGhpcy5zaGFsbG93KSB7XG4gICAgICAvLyBzZXQgbmV3IHZhbHVlXG4gICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgLy8gaW4gZGVidWcgKyBhc3luYyBtb2RlLCB3aGVuIGEgd2F0Y2hlciBjYWxsYmFja3NcbiAgICAgIC8vIHRocm93cywgd2UgYWxzbyB0aHJvdyB0aGUgc2F2ZWQgYmVmb3JlLXB1c2ggZXJyb3JcbiAgICAgIC8vIHNvIHRoZSBmdWxsIGNyb3NzLXRpY2sgc3RhY2sgdHJhY2UgaXMgYXZhaWxhYmxlLlxuICAgICAgdmFyIHByZXZFcnJvciA9IHRoaXMucHJldkVycm9yO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcuZGVidWcgJiYgcHJldkVycm9yKSB7XG4gICAgICAgIHRoaXMucHJldkVycm9yID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmNiLmNhbGwodGhpcy52bSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IHByZXZFcnJvcjtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNiLmNhbGwodGhpcy52bSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5xdWV1ZWQgPSB0aGlzLnNoYWxsb3cgPSBmYWxzZTtcbiAgfVxufTtcblxuLyoqXG4gKiBFdmFsdWF0ZSB0aGUgdmFsdWUgb2YgdGhlIHdhdGNoZXIuXG4gKiBUaGlzIG9ubHkgZ2V0cyBjYWxsZWQgZm9yIGxhenkgd2F0Y2hlcnMuXG4gKi9cblxuV2F0Y2hlci5wcm90b3R5cGUuZXZhbHVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIGF2b2lkIG92ZXJ3cml0aW5nIGFub3RoZXIgd2F0Y2hlciB0aGF0IGlzIGJlaW5nXG4gIC8vIGNvbGxlY3RlZC5cbiAgdmFyIGN1cnJlbnQgPSBEZXAudGFyZ2V0O1xuICB0aGlzLnZhbHVlID0gdGhpcy5nZXQoKTtcbiAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICBEZXAudGFyZ2V0ID0gY3VycmVudDtcbn07XG5cbi8qKlxuICogRGVwZW5kIG9uIGFsbCBkZXBzIGNvbGxlY3RlZCBieSB0aGlzIHdhdGNoZXIuXG4gKi9cblxuV2F0Y2hlci5wcm90b3R5cGUuZGVwZW5kID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSA9IHRoaXMuZGVwcy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLmRlcHNbaV0uZGVwZW5kKCk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIHNlbGYgZnJvbSBhbGwgZGVwZW5kZW5jaWVzJyBzdWJjcmliZXIgbGlzdC5cbiAqL1xuXG5XYXRjaGVyLnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgLy8gcmVtb3ZlIHNlbGYgZnJvbSB2bSdzIHdhdGNoZXIgbGlzdFxuICAgIC8vIHRoaXMgaXMgYSBzb21ld2hhdCBleHBlbnNpdmUgb3BlcmF0aW9uIHNvIHdlIHNraXAgaXRcbiAgICAvLyBpZiB0aGUgdm0gaXMgYmVpbmcgZGVzdHJveWVkIG9yIGlzIHBlcmZvcm1pbmcgYSB2LWZvclxuICAgIC8vIHJlLXJlbmRlciAodGhlIHdhdGNoZXIgbGlzdCBpcyB0aGVuIGZpbHRlcmVkIGJ5IHYtZm9yKS5cbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQgJiYgIXRoaXMudm0uX3ZGb3JSZW1vdmluZykge1xuICAgICAgdGhpcy52bS5fd2F0Y2hlcnMuJHJlbW92ZSh0aGlzKTtcbiAgICB9XG4gICAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHRoaXMuZGVwc1tpXS5yZW1vdmVTdWIodGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy52bSA9IHRoaXMuY2IgPSB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBSZWNydXNpdmVseSB0cmF2ZXJzZSBhbiBvYmplY3QgdG8gZXZva2UgYWxsIGNvbnZlcnRlZFxuICogZ2V0dGVycywgc28gdGhhdCBldmVyeSBuZXN0ZWQgcHJvcGVydHkgaW5zaWRlIHRoZSBvYmplY3RcbiAqIGlzIGNvbGxlY3RlZCBhcyBhIFwiZGVlcFwiIGRlcGVuZGVuY3kuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5mdW5jdGlvbiB0cmF2ZXJzZSh2YWwpIHtcbiAgdmFyIGksIGtleXM7XG4gIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICBpID0gdmFsLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB0cmF2ZXJzZSh2YWxbaV0pO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcbiAgICBpID0ga2V5cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkgdHJhdmVyc2UodmFsW2tleXNbaV1dKTtcbiAgfVxufVxuXG52YXIgdGV4dCQxID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgdGhpcy5hdHRyID0gdGhpcy5lbC5ub2RlVHlwZSA9PT0gMyA/ICdkYXRhJyA6ICd0ZXh0Q29udGVudCc7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUodmFsdWUpIHtcbiAgICB0aGlzLmVsW3RoaXMuYXR0cl0gPSBfdG9TdHJpbmcodmFsdWUpO1xuICB9XG59O1xuXG52YXIgdGVtcGxhdGVDYWNoZSA9IG5ldyBDYWNoZSgxMDAwKTtcbnZhciBpZFNlbGVjdG9yQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMCk7XG5cbnZhciBtYXAgPSB7XG4gIGVmYXVsdDogWzAsICcnLCAnJ10sXG4gIGxlZ2VuZDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gIHRyOiBbMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nXSxcbiAgY29sOiBbMiwgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nXVxufTtcblxubWFwLnRkID0gbWFwLnRoID0gWzMsICc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+J107XG5cbm1hcC5vcHRpb24gPSBtYXAub3B0Z3JvdXAgPSBbMSwgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsICc8L3NlbGVjdD4nXTtcblxubWFwLnRoZWFkID0gbWFwLnRib2R5ID0gbWFwLmNvbGdyb3VwID0gbWFwLmNhcHRpb24gPSBtYXAudGZvb3QgPSBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXTtcblxubWFwLmcgPSBtYXAuZGVmcyA9IG1hcC5zeW1ib2wgPSBtYXAudXNlID0gbWFwLmltYWdlID0gbWFwLnRleHQgPSBtYXAuY2lyY2xlID0gbWFwLmVsbGlwc2UgPSBtYXAubGluZSA9IG1hcC5wYXRoID0gbWFwLnBvbHlnb24gPSBtYXAucG9seWxpbmUgPSBtYXAucmVjdCA9IFsxLCAnPHN2ZyAnICsgJ3htbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAnICsgJ3htbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiICcgKyAneG1sbnM6ZXY9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHNcIicgKyAndmVyc2lvbj1cIjEuMVwiPicsICc8L3N2Zz4nXTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIG5vZGUgaXMgYSBzdXBwb3J0ZWQgdGVtcGxhdGUgbm9kZSB3aXRoIGFcbiAqIERvY3VtZW50RnJhZ21lbnQgY29udGVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gaXNSZWFsVGVtcGxhdGUobm9kZSkge1xuICByZXR1cm4gaXNUZW1wbGF0ZShub2RlKSAmJiBpc0ZyYWdtZW50KG5vZGUuY29udGVudCk7XG59XG5cbnZhciB0YWdSRSQxID0gLzwoW1xcdzotXSspLztcbnZhciBlbnRpdHlSRSA9IC8mIz9cXHcrPzsvO1xuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgdGVtcGxhdGUgdG8gYSBEb2N1bWVudEZyYWdtZW50LlxuICogRGV0ZXJtaW5lcyBjb3JyZWN0IHdyYXBwaW5nIGJ5IHRhZyB0eXBlcy4gV3JhcHBpbmdcbiAqIHN0cmF0ZWd5IGZvdW5kIGluIGpRdWVyeSAmIGNvbXBvbmVudC9kb21pZnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlU3RyaW5nXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJhd1xuICogQHJldHVybiB7RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdUb0ZyYWdtZW50KHRlbXBsYXRlU3RyaW5nLCByYXcpIHtcbiAgLy8gdHJ5IGEgY2FjaGUgaGl0IGZpcnN0XG4gIHZhciBjYWNoZUtleSA9IHJhdyA/IHRlbXBsYXRlU3RyaW5nIDogdGVtcGxhdGVTdHJpbmcudHJpbSgpO1xuICB2YXIgaGl0ID0gdGVtcGxhdGVDYWNoZS5nZXQoY2FjaGVLZXkpO1xuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdDtcbiAgfVxuXG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB2YXIgdGFnTWF0Y2ggPSB0ZW1wbGF0ZVN0cmluZy5tYXRjaCh0YWdSRSQxKTtcbiAgdmFyIGVudGl0eU1hdGNoID0gZW50aXR5UkUudGVzdCh0ZW1wbGF0ZVN0cmluZyk7XG5cbiAgaWYgKCF0YWdNYXRjaCAmJiAhZW50aXR5TWF0Y2gpIHtcbiAgICAvLyB0ZXh0IG9ubHksIHJldHVybiBhIHNpbmdsZSB0ZXh0IG5vZGUuXG4gICAgZnJhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZW1wbGF0ZVN0cmluZykpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSB0YWdNYXRjaCAmJiB0YWdNYXRjaFsxXTtcbiAgICB2YXIgd3JhcCA9IG1hcFt0YWddIHx8IG1hcC5lZmF1bHQ7XG4gICAgdmFyIGRlcHRoID0gd3JhcFswXTtcbiAgICB2YXIgcHJlZml4ID0gd3JhcFsxXTtcbiAgICB2YXIgc3VmZml4ID0gd3JhcFsyXTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgbm9kZS5pbm5lckhUTUwgPSBwcmVmaXggKyB0ZW1wbGF0ZVN0cmluZyArIHN1ZmZpeDtcbiAgICB3aGlsZSAoZGVwdGgtLSkge1xuICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkO1xuICAgIH1cblxuICAgIHZhciBjaGlsZDtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuICAgIHdoaWxlIChjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuICB9XG4gIGlmICghcmF3KSB7XG4gICAgdHJpbU5vZGUoZnJhZyk7XG4gIH1cbiAgdGVtcGxhdGVDYWNoZS5wdXQoY2FjaGVLZXksIGZyYWcpO1xuICByZXR1cm4gZnJhZztcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdGVtcGxhdGUgbm9kZSB0byBhIERvY3VtZW50RnJhZ21lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIG5vZGVUb0ZyYWdtZW50KG5vZGUpIHtcbiAgLy8gaWYgaXRzIGEgdGVtcGxhdGUgdGFnIGFuZCB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCxcbiAgLy8gaXRzIGNvbnRlbnQgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50LlxuICBpZiAoaXNSZWFsVGVtcGxhdGUobm9kZSkpIHtcbiAgICB0cmltTm9kZShub2RlLmNvbnRlbnQpO1xuICAgIHJldHVybiBub2RlLmNvbnRlbnQ7XG4gIH1cbiAgLy8gc2NyaXB0IHRlbXBsYXRlXG4gIGlmIChub2RlLnRhZ05hbWUgPT09ICdTQ1JJUFQnKSB7XG4gICAgcmV0dXJuIHN0cmluZ1RvRnJhZ21lbnQobm9kZS50ZXh0Q29udGVudCk7XG4gIH1cbiAgLy8gbm9ybWFsIG5vZGUsIGNsb25lIGl0IHRvIGF2b2lkIG11dGF0aW5nIHRoZSBvcmlnaW5hbFxuICB2YXIgY2xvbmVkTm9kZSA9IGNsb25lTm9kZShub2RlKTtcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBjaGlsZDtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uZC1hc3NpZ24gKi9cbiAgd2hpbGUgKGNoaWxkID0gY2xvbmVkTm9kZS5maXJzdENoaWxkKSB7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG4gIHRyaW1Ob2RlKGZyYWcpO1xuICByZXR1cm4gZnJhZztcbn1cblxuLy8gVGVzdCBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSBTYWZhcmkgdGVtcGxhdGUgY2xvbmluZyBidWdcbi8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3d1Zy5jZ2k/aWQ9MTM3NzU1XG52YXIgaGFzQnJva2VuVGVtcGxhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaW5Ccm93c2VyKSB7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhLmlubmVySFRNTCA9ICc8dGVtcGxhdGU+MTwvdGVtcGxhdGU+JztcbiAgICByZXR1cm4gIWEuY2xvbmVOb2RlKHRydWUpLmZpcnN0Q2hpbGQuaW5uZXJIVE1MO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSkoKTtcblxuLy8gVGVzdCBmb3IgSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBjbG9uZSBidWdcbnZhciBoYXNUZXh0YXJlYUNsb25lQnVnID0gKGZ1bmN0aW9uICgpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGluQnJvd3Nlcikge1xuICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB0LnBsYWNlaG9sZGVyID0gJ3QnO1xuICAgIHJldHVybiB0LmNsb25lTm9kZSh0cnVlKS52YWx1ZSA9PT0gJ3QnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSkoKTtcblxuLyoqXG4gKiAxLiBEZWFsIHdpdGggU2FmYXJpIGNsb25pbmcgbmVzdGVkIDx0ZW1wbGF0ZT4gYnVnIGJ5XG4gKiAgICBtYW51YWxseSBjbG9uaW5nIGFsbCB0ZW1wbGF0ZSBpbnN0YW5jZXMuXG4gKiAyLiBEZWFsIHdpdGggSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBidWcgYnkgc2V0dGluZ1xuICogICAgdGhlIGNvcnJlY3QgdmFsdWUgYWZ0ZXIgY2xvbmluZy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gbm9kZVxuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIGNsb25lTm9kZShub2RlKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIW5vZGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIHJldHVybiBub2RlLmNsb25lTm9kZSgpO1xuICB9XG4gIHZhciByZXMgPSBub2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgdmFyIGksIG9yaWdpbmFsLCBjbG9uZWQ7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoaGFzQnJva2VuVGVtcGxhdGUpIHtcbiAgICB2YXIgdGVtcENsb25lID0gcmVzO1xuICAgIGlmIChpc1JlYWxUZW1wbGF0ZShub2RlKSkge1xuICAgICAgbm9kZSA9IG5vZGUuY29udGVudDtcbiAgICAgIHRlbXBDbG9uZSA9IHJlcy5jb250ZW50O1xuICAgIH1cbiAgICBvcmlnaW5hbCA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKTtcbiAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICBjbG9uZWQgPSB0ZW1wQ2xvbmUucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKTtcbiAgICAgIGkgPSBjbG9uZWQubGVuZ3RoO1xuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjbG9uZWRbaV0ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2xvbmVOb2RlKG9yaWdpbmFsW2ldKSwgY2xvbmVkW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNUZXh0YXJlYUNsb25lQnVnKSB7XG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgcmVzLnZhbHVlID0gbm9kZS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ2luYWwgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJyk7XG4gICAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICAgIGNsb25lZCA9IHJlcy5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xuICAgICAgICBpID0gY2xvbmVkLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIGNsb25lZFtpXS52YWx1ZSA9IG9yaWdpbmFsW2ldLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgdGVtcGxhdGUgb3B0aW9uIGFuZCBub3JtYWxpemVzIGl0IGludG8gYVxuICogYSBEb2N1bWVudEZyYWdtZW50IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBwYXJ0aWFsIG9yIGFcbiAqIGluc3RhbmNlIHRlbXBsYXRlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdGVtcGxhdGVcbiAqICAgICAgICBQb3NzaWJsZSB2YWx1ZXMgaW5jbHVkZTpcbiAqICAgICAgICAtIERvY3VtZW50RnJhZ21lbnQgb2JqZWN0XG4gKiAgICAgICAgLSBOb2RlIG9iamVjdCBvZiB0eXBlIFRlbXBsYXRlXG4gKiAgICAgICAgLSBpZCBzZWxlY3RvcjogJyNzb21lLXRlbXBsYXRlLWlkJ1xuICogICAgICAgIC0gdGVtcGxhdGUgc3RyaW5nOiAnPGRpdj48c3Bhbj57e21zZ319PC9zcGFuPjwvZGl2PidcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hvdWxkQ2xvbmVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmF3XG4gKiAgICAgICAgaW5saW5lIEhUTUwgaW50ZXJwb2xhdGlvbi4gRG8gbm90IGNoZWNrIGZvciBpZFxuICogICAgICAgIHNlbGVjdG9yIGFuZCBrZWVwIHdoaXRlc3BhY2UgaW4gdGhlIHN0cmluZy5cbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUodGVtcGxhdGUsIHNob3VsZENsb25lLCByYXcpIHtcbiAgdmFyIG5vZGUsIGZyYWc7XG5cbiAgLy8gaWYgdGhlIHRlbXBsYXRlIGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudCxcbiAgLy8gZG8gbm90aGluZ1xuICBpZiAoaXNGcmFnbWVudCh0ZW1wbGF0ZSkpIHtcbiAgICB0cmltTm9kZSh0ZW1wbGF0ZSk7XG4gICAgcmV0dXJuIHNob3VsZENsb25lID8gY2xvbmVOb2RlKHRlbXBsYXRlKSA6IHRlbXBsYXRlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBpZCBzZWxlY3RvclxuICAgIGlmICghcmF3ICYmIHRlbXBsYXRlLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAvLyBpZCBzZWxlY3RvciBjYW4gYmUgY2FjaGVkIHRvb1xuICAgICAgZnJhZyA9IGlkU2VsZWN0b3JDYWNoZS5nZXQodGVtcGxhdGUpO1xuICAgICAgaWYgKCFmcmFnKSB7XG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZS5zbGljZSgxKSk7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgZnJhZyA9IG5vZGVUb0ZyYWdtZW50KG5vZGUpO1xuICAgICAgICAgIC8vIHNhdmUgc2VsZWN0b3IgdG8gY2FjaGVcbiAgICAgICAgICBpZFNlbGVjdG9yQ2FjaGUucHV0KHRlbXBsYXRlLCBmcmFnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3JtYWwgc3RyaW5nIHRlbXBsYXRlXG4gICAgICBmcmFnID0gc3RyaW5nVG9GcmFnbWVudCh0ZW1wbGF0ZSwgcmF3KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGVtcGxhdGUubm9kZVR5cGUpIHtcbiAgICAvLyBhIGRpcmVjdCBub2RlXG4gICAgZnJhZyA9IG5vZGVUb0ZyYWdtZW50KHRlbXBsYXRlKTtcbiAgfVxuXG4gIHJldHVybiBmcmFnICYmIHNob3VsZENsb25lID8gY2xvbmVOb2RlKGZyYWcpIDogZnJhZztcbn1cblxudmFyIHRlbXBsYXRlID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGNsb25lTm9kZTogY2xvbmVOb2RlLFxuICBwYXJzZVRlbXBsYXRlOiBwYXJzZVRlbXBsYXRlXG59KTtcblxudmFyIGh0bWwgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICAvLyBhIGNvbW1lbnQgbm9kZSBtZWFucyB0aGlzIGlzIGEgYmluZGluZyBmb3JcbiAgICAvLyB7e3sgaW5saW5lIHVuZXNjYXBlZCBodG1sIH19fVxuICAgIGlmICh0aGlzLmVsLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAvLyBob2xkIG5vZGVzXG4gICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAvLyByZXBsYWNlIHRoZSBwbGFjZWhvbGRlciB3aXRoIHByb3BlciBhbmNob3JcbiAgICAgIHRoaXMuYW5jaG9yID0gY3JlYXRlQW5jaG9yKCd2LWh0bWwnKTtcbiAgICAgIHJlcGxhY2UodGhpcy5lbCwgdGhpcy5hbmNob3IpO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSh2YWx1ZSkge1xuICAgIHZhbHVlID0gX3RvU3RyaW5nKHZhbHVlKTtcbiAgICBpZiAodGhpcy5ub2Rlcykge1xuICAgICAgdGhpcy5zd2FwKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgc3dhcDogZnVuY3Rpb24gc3dhcCh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBvbGQgbm9kZXNcbiAgICB2YXIgaSA9IHRoaXMubm9kZXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHJlbW92ZSh0aGlzLm5vZGVzW2ldKTtcbiAgICB9XG4gICAgLy8gY29udmVydCBuZXcgdmFsdWUgdG8gYSBmcmFnbWVudFxuICAgIC8vIGRvIG5vdCBhdHRlbXB0IHRvIHJldHJpZXZlIGZyb20gaWQgc2VsZWN0b3JcbiAgICB2YXIgZnJhZyA9IHBhcnNlVGVtcGxhdGUodmFsdWUsIHRydWUsIHRydWUpO1xuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgdG8gdGhlc2Ugbm9kZXMgc28gd2UgY2FuIHJlbW92ZSBsYXRlclxuICAgIHRoaXMubm9kZXMgPSB0b0FycmF5KGZyYWcuY2hpbGROb2Rlcyk7XG4gICAgYmVmb3JlKGZyYWcsIHRoaXMuYW5jaG9yKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBYnN0cmFjdGlvbiBmb3IgYSBwYXJ0aWFsbHktY29tcGlsZWQgZnJhZ21lbnQuXG4gKiBDYW4gb3B0aW9uYWxseSBjb21waWxlIGNvbnRlbnQgd2l0aCBhIGNoaWxkIHNjb3BlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpbmtlclxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGZyYWdcbiAqIEBwYXJhbSB7VnVlfSBbaG9zdF1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc2NvcGVdXG4gKiBAcGFyYW0ge0ZyYWdtZW50fSBbcGFyZW50RnJhZ11cbiAqL1xuZnVuY3Rpb24gRnJhZ21lbnQobGlua2VyLCB2bSwgZnJhZywgaG9zdCwgc2NvcGUsIHBhcmVudEZyYWcpIHtcbiAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB0aGlzLmNoaWxkRnJhZ3MgPSBbXTtcbiAgdGhpcy52bSA9IHZtO1xuICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gIHRoaXMuaW5zZXJ0ZWQgPSBmYWxzZTtcbiAgdGhpcy5wYXJlbnRGcmFnID0gcGFyZW50RnJhZztcbiAgaWYgKHBhcmVudEZyYWcpIHtcbiAgICBwYXJlbnRGcmFnLmNoaWxkRnJhZ3MucHVzaCh0aGlzKTtcbiAgfVxuICB0aGlzLnVubGluayA9IGxpbmtlcih2bSwgZnJhZywgaG9zdCwgc2NvcGUsIHRoaXMpO1xuICB2YXIgc2luZ2xlID0gdGhpcy5zaW5nbGUgPSBmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmXG4gIC8vIGRvIG5vdCBnbyBzaW5nbGUgbW9kZSBpZiB0aGUgb25seSBub2RlIGlzIGFuIGFuY2hvclxuICAhZnJhZy5jaGlsZE5vZGVzWzBdLl9fdl9hbmNob3I7XG4gIGlmIChzaW5nbGUpIHtcbiAgICB0aGlzLm5vZGUgPSBmcmFnLmNoaWxkTm9kZXNbMF07XG4gICAgdGhpcy5iZWZvcmUgPSBzaW5nbGVCZWZvcmU7XG4gICAgdGhpcy5yZW1vdmUgPSBzaW5nbGVSZW1vdmU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ub2RlID0gY3JlYXRlQW5jaG9yKCdmcmFnbWVudC1zdGFydCcpO1xuICAgIHRoaXMuZW5kID0gY3JlYXRlQW5jaG9yKCdmcmFnbWVudC1lbmQnKTtcbiAgICB0aGlzLmZyYWcgPSBmcmFnO1xuICAgIHByZXBlbmQodGhpcy5ub2RlLCBmcmFnKTtcbiAgICBmcmFnLmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgICB0aGlzLmJlZm9yZSA9IG11bHRpQmVmb3JlO1xuICAgIHRoaXMucmVtb3ZlID0gbXVsdGlSZW1vdmU7XG4gIH1cbiAgdGhpcy5ub2RlLl9fdl9mcmFnID0gdGhpcztcbn1cblxuLyoqXG4gKiBDYWxsIGF0dGFjaC9kZXRhY2ggZm9yIGFsbCBjb21wb25lbnRzIGNvbnRhaW5lZCB3aXRoaW5cbiAqIHRoaXMgZnJhZ21lbnQuIEFsc28gZG8gc28gcmVjdXJzaXZlbHkgZm9yIGFsbCBjaGlsZFxuICogZnJhZ21lbnRzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhvb2tcbiAqL1xuXG5GcmFnbWVudC5wcm90b3R5cGUuY2FsbEhvb2sgPSBmdW5jdGlvbiAoaG9vaykge1xuICB2YXIgaSwgbDtcbiAgZm9yIChpID0gMCwgbCA9IHRoaXMuY2hpbGRGcmFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB0aGlzLmNoaWxkRnJhZ3NbaV0uY2FsbEhvb2soaG9vayk7XG4gIH1cbiAgZm9yIChpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaG9vayh0aGlzLmNoaWxkcmVuW2ldKTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbnNlcnQgZnJhZ21lbnQgYmVmb3JlIHRhcmdldCwgc2luZ2xlIG5vZGUgdmVyc2lvblxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFuc2l0aW9uXG4gKi9cblxuZnVuY3Rpb24gc2luZ2xlQmVmb3JlKHRhcmdldCwgd2l0aFRyYW5zaXRpb24pIHtcbiAgdGhpcy5pbnNlcnRlZCA9IHRydWU7XG4gIHZhciBtZXRob2QgPSB3aXRoVHJhbnNpdGlvbiAhPT0gZmFsc2UgPyBiZWZvcmVXaXRoVHJhbnNpdGlvbiA6IGJlZm9yZTtcbiAgbWV0aG9kKHRoaXMubm9kZSwgdGFyZ2V0LCB0aGlzLnZtKTtcbiAgaWYgKGluRG9jKHRoaXMubm9kZSkpIHtcbiAgICB0aGlzLmNhbGxIb29rKGF0dGFjaCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgZnJhZ21lbnQsIHNpbmdsZSBub2RlIHZlcnNpb25cbiAqL1xuXG5mdW5jdGlvbiBzaW5nbGVSZW1vdmUoKSB7XG4gIHRoaXMuaW5zZXJ0ZWQgPSBmYWxzZTtcbiAgdmFyIHNob3VsZENhbGxSZW1vdmUgPSBpbkRvYyh0aGlzLm5vZGUpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuYmVmb3JlUmVtb3ZlKCk7XG4gIHJlbW92ZVdpdGhUcmFuc2l0aW9uKHRoaXMubm9kZSwgdGhpcy52bSwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzaG91bGRDYWxsUmVtb3ZlKSB7XG4gICAgICBzZWxmLmNhbGxIb29rKGRldGFjaCk7XG4gICAgfVxuICAgIHNlbGYuZGVzdHJveSgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgZnJhZ21lbnQgYmVmb3JlIHRhcmdldCwgbXVsdGktbm9kZXMgdmVyc2lvblxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFuc2l0aW9uXG4gKi9cblxuZnVuY3Rpb24gbXVsdGlCZWZvcmUodGFyZ2V0LCB3aXRoVHJhbnNpdGlvbikge1xuICB0aGlzLmluc2VydGVkID0gdHJ1ZTtcbiAgdmFyIHZtID0gdGhpcy52bTtcbiAgdmFyIG1ldGhvZCA9IHdpdGhUcmFuc2l0aW9uICE9PSBmYWxzZSA/IGJlZm9yZVdpdGhUcmFuc2l0aW9uIDogYmVmb3JlO1xuICBtYXBOb2RlUmFuZ2UodGhpcy5ub2RlLCB0aGlzLmVuZCwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBtZXRob2Qobm9kZSwgdGFyZ2V0LCB2bSk7XG4gIH0pO1xuICBpZiAoaW5Eb2ModGhpcy5ub2RlKSkge1xuICAgIHRoaXMuY2FsbEhvb2soYXR0YWNoKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBmcmFnbWVudCwgbXVsdGktbm9kZXMgdmVyc2lvblxuICovXG5cbmZ1bmN0aW9uIG11bHRpUmVtb3ZlKCkge1xuICB0aGlzLmluc2VydGVkID0gZmFsc2U7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHNob3VsZENhbGxSZW1vdmUgPSBpbkRvYyh0aGlzLm5vZGUpO1xuICB0aGlzLmJlZm9yZVJlbW92ZSgpO1xuICByZW1vdmVOb2RlUmFuZ2UodGhpcy5ub2RlLCB0aGlzLmVuZCwgdGhpcy52bSwgdGhpcy5mcmFnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNob3VsZENhbGxSZW1vdmUpIHtcbiAgICAgIHNlbGYuY2FsbEhvb2soZGV0YWNoKTtcbiAgICB9XG4gICAgc2VsZi5kZXN0cm95KCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFByZXBhcmUgdGhlIGZyYWdtZW50IGZvciByZW1vdmFsLlxuICovXG5cbkZyYWdtZW50LnByb3RvdHlwZS5iZWZvcmVSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpLCBsO1xuICBmb3IgKGkgPSAwLCBsID0gdGhpcy5jaGlsZEZyYWdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIC8vIGNhbGwgdGhlIHNhbWUgbWV0aG9kIHJlY3Vyc2l2ZWx5IG9uIGNoaWxkXG4gICAgLy8gZnJhZ21lbnRzLCBkZXB0aC1maXJzdFxuICAgIHRoaXMuY2hpbGRGcmFnc1tpXS5iZWZvcmVSZW1vdmUoZmFsc2UpO1xuICB9XG4gIGZvciAoaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIC8vIENhbGwgZGVzdHJveSBmb3IgYWxsIGNvbnRhaW5lZCBpbnN0YW5jZXMsXG4gICAgLy8gd2l0aCByZW1vdmU6ZmFsc2UgYW5kIGRlZmVyOnRydWUuXG4gICAgLy8gRGVmZXIgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugd2UgbmVlZCB0b1xuICAgIC8vIGtlZXAgdGhlIGNoaWxkcmVuIHRvIGNhbGwgZGV0YWNoIGhvb2tzXG4gICAgLy8gb24gdGhlbS5cbiAgICB0aGlzLmNoaWxkcmVuW2ldLiRkZXN0cm95KGZhbHNlLCB0cnVlKTtcbiAgfVxuICB2YXIgZGlycyA9IHRoaXMudW5saW5rLmRpcnM7XG4gIGZvciAoaSA9IDAsIGwgPSBkaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIC8vIGRpc2FibGUgdGhlIHdhdGNoZXJzIG9uIGFsbCB0aGUgZGlyZWN0aXZlc1xuICAgIC8vIHNvIHRoYXQgdGhlIHJlbmRlcmVkIGNvbnRlbnQgc3RheXMgdGhlIHNhbWVcbiAgICAvLyBkdXJpbmcgcmVtb3ZhbC5cbiAgICBkaXJzW2ldLl93YXRjaGVyICYmIGRpcnNbaV0uX3dhdGNoZXIudGVhcmRvd24oKTtcbiAgfVxufTtcblxuLyoqXG4gKiBEZXN0cm95IHRoZSBmcmFnbWVudC5cbiAqL1xuXG5GcmFnbWVudC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMucGFyZW50RnJhZykge1xuICAgIHRoaXMucGFyZW50RnJhZy5jaGlsZEZyYWdzLiRyZW1vdmUodGhpcyk7XG4gIH1cbiAgdGhpcy5ub2RlLl9fdl9mcmFnID0gbnVsbDtcbiAgdGhpcy51bmxpbmsoKTtcbn07XG5cbi8qKlxuICogQ2FsbCBhdHRhY2ggaG9vayBmb3IgYSBWdWUgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHtWdWV9IGNoaWxkXG4gKi9cblxuZnVuY3Rpb24gYXR0YWNoKGNoaWxkKSB7XG4gIGlmICghY2hpbGQuX2lzQXR0YWNoZWQgJiYgaW5Eb2MoY2hpbGQuJGVsKSkge1xuICAgIGNoaWxkLl9jYWxsSG9vaygnYXR0YWNoZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIENhbGwgZGV0YWNoIGhvb2sgZm9yIGEgVnVlIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7VnVlfSBjaGlsZFxuICovXG5cbmZ1bmN0aW9uIGRldGFjaChjaGlsZCkge1xuICBpZiAoY2hpbGQuX2lzQXR0YWNoZWQgJiYgIWluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2RldGFjaGVkJyk7XG4gIH1cbn1cblxudmFyIGxpbmtlckNhY2hlID0gbmV3IENhY2hlKDUwMDApO1xuXG4vKipcbiAqIEEgZmFjdG9yeSB0aGF0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBpbnN0YW5jZXMgb2YgYVxuICogZnJhZ21lbnQuIENhY2hlcyB0aGUgY29tcGlsZWQgbGlua2VyIGlmIHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtFbGVtZW50fFN0cmluZ30gZWxcbiAqL1xuZnVuY3Rpb24gRnJhZ21lbnRGYWN0b3J5KHZtLCBlbCkge1xuICB0aGlzLnZtID0gdm07XG4gIHZhciB0ZW1wbGF0ZTtcbiAgdmFyIGlzU3RyaW5nID0gdHlwZW9mIGVsID09PSAnc3RyaW5nJztcbiAgaWYgKGlzU3RyaW5nIHx8IGlzVGVtcGxhdGUoZWwpKSB7XG4gICAgdGVtcGxhdGUgPSBwYXJzZVRlbXBsYXRlKGVsLCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChlbCk7XG4gIH1cbiAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAvLyBsaW5rZXIgY2FuIGJlIGNhY2hlZCwgYnV0IG9ubHkgZm9yIGNvbXBvbmVudHNcbiAgdmFyIGxpbmtlcjtcbiAgdmFyIGNpZCA9IHZtLmNvbnN0cnVjdG9yLmNpZDtcbiAgaWYgKGNpZCA+IDApIHtcbiAgICB2YXIgY2FjaGVJZCA9IGNpZCArIChpc1N0cmluZyA/IGVsIDogZ2V0T3V0ZXJIVE1MKGVsKSk7XG4gICAgbGlua2VyID0gbGlua2VyQ2FjaGUuZ2V0KGNhY2hlSWQpO1xuICAgIGlmICghbGlua2VyKSB7XG4gICAgICBsaW5rZXIgPSBjb21waWxlKHRlbXBsYXRlLCB2bS4kb3B0aW9ucywgdHJ1ZSk7XG4gICAgICBsaW5rZXJDYWNoZS5wdXQoY2FjaGVJZCwgbGlua2VyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGlua2VyID0gY29tcGlsZSh0ZW1wbGF0ZSwgdm0uJG9wdGlvbnMsIHRydWUpO1xuICB9XG4gIHRoaXMubGlua2VyID0gbGlua2VyO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGZyYWdtZW50IGluc3RhbmNlIHdpdGggZ2l2ZW4gaG9zdCBhbmQgc2NvcGUuXG4gKlxuICogQHBhcmFtIHtWdWV9IGhvc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZVxuICogQHBhcmFtIHtGcmFnbWVudH0gcGFyZW50RnJhZ1xuICovXG5cbkZyYWdtZW50RmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGhvc3QsIHNjb3BlLCBwYXJlbnRGcmFnKSB7XG4gIHZhciBmcmFnID0gY2xvbmVOb2RlKHRoaXMudGVtcGxhdGUpO1xuICByZXR1cm4gbmV3IEZyYWdtZW50KHRoaXMubGlua2VyLCB0aGlzLnZtLCBmcmFnLCBob3N0LCBzY29wZSwgcGFyZW50RnJhZyk7XG59O1xuXG52YXIgT04gPSA3MDA7XG52YXIgTU9ERUwgPSA4MDA7XG52YXIgQklORCA9IDg1MDtcbnZhciBUUkFOU0lUSU9OID0gMTEwMDtcbnZhciBFTCA9IDE1MDA7XG52YXIgQ09NUE9ORU5UID0gMTUwMDtcbnZhciBQQVJUSUFMID0gMTc1MDtcbnZhciBGT1IgPSAyMDAwO1xudmFyIElGID0gMjAwMDtcbnZhciBTTE9UID0gMjEwMDtcblxudmFyIHVpZCQzID0gMDtcblxudmFyIHZGb3IgPSB7XG5cbiAgcHJpb3JpdHk6IEZPUixcbiAgdGVybWluYWw6IHRydWUsXG5cbiAgcGFyYW1zOiBbJ3RyYWNrLWJ5JywgJ3N0YWdnZXInLCAnZW50ZXItc3RhZ2dlcicsICdsZWF2ZS1zdGFnZ2VyJ10sXG5cbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICAvLyBzdXBwb3J0IFwiaXRlbSBpbi9vZiBpdGVtc1wiIHN5bnRheFxuICAgIHZhciBpbk1hdGNoID0gdGhpcy5leHByZXNzaW9uLm1hdGNoKC8oLiopICg/OmlufG9mKSAoLiopLyk7XG4gICAgaWYgKGluTWF0Y2gpIHtcbiAgICAgIHZhciBpdE1hdGNoID0gaW5NYXRjaFsxXS5tYXRjaCgvXFwoKC4qKSwoLiopXFwpLyk7XG4gICAgICBpZiAoaXRNYXRjaCkge1xuICAgICAgICB0aGlzLml0ZXJhdG9yID0gaXRNYXRjaFsxXS50cmltKCk7XG4gICAgICAgIHRoaXMuYWxpYXMgPSBpdE1hdGNoWzJdLnRyaW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWxpYXMgPSBpbk1hdGNoWzFdLnRyaW0oKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGluTWF0Y2hbMl07XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmFsaWFzKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0FsaWFzIGlzIHJlcXVpcmVkIGluIHYtZm9yLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVpZCBhcyBhIGNhY2hlIGlkZW50aWZpZXJcbiAgICB0aGlzLmlkID0gJ19fdi1mb3JfXycgKyArK3VpZCQzO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhbiBvcHRpb24gbGlzdCxcbiAgICAvLyBzbyB0aGF0IHdlIGtub3cgaWYgd2UgbmVlZCB0byB1cGRhdGUgdGhlIDxzZWxlY3Q+J3NcbiAgICAvLyB2LW1vZGVsIHdoZW4gdGhlIG9wdGlvbiBsaXN0IGhhcyBjaGFuZ2VkLlxuICAgIC8vIGJlY2F1c2Ugdi1tb2RlbCBoYXMgYSBsb3dlciBwcmlvcml0eSB0aGFuIHYtZm9yLFxuICAgIC8vIHRoZSB2LW1vZGVsIGlzIG5vdCBib3VuZCBoZXJlIHlldCwgc28gd2UgaGF2ZSB0b1xuICAgIC8vIHJldHJpdmUgaXQgaW4gdGhlIGFjdHVhbCB1cGRhdGVNb2RlbCgpIGZ1bmN0aW9uLlxuICAgIHZhciB0YWcgPSB0aGlzLmVsLnRhZ05hbWU7XG4gICAgdGhpcy5pc09wdGlvbiA9ICh0YWcgPT09ICdPUFRJT04nIHx8IHRhZyA9PT0gJ09QVEdST1VQJykgJiYgdGhpcy5lbC5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdTRUxFQ1QnO1xuXG4gICAgLy8gc2V0dXAgYW5jaG9yIG5vZGVzXG4gICAgdGhpcy5zdGFydCA9IGNyZWF0ZUFuY2hvcigndi1mb3Itc3RhcnQnKTtcbiAgICB0aGlzLmVuZCA9IGNyZWF0ZUFuY2hvcigndi1mb3ItZW5kJyk7XG4gICAgcmVwbGFjZSh0aGlzLmVsLCB0aGlzLmVuZCk7XG4gICAgYmVmb3JlKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcblxuICAgIC8vIGNhY2hlXG4gICAgdGhpcy5jYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBmcmFnbWVudCBmYWN0b3J5XG4gICAgdGhpcy5mYWN0b3J5ID0gbmV3IEZyYWdtZW50RmFjdG9yeSh0aGlzLnZtLCB0aGlzLmVsKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkYXRhKSB7XG4gICAgdGhpcy5kaWZmKGRhdGEpO1xuICAgIHRoaXMudXBkYXRlUmVmKCk7XG4gICAgdGhpcy51cGRhdGVNb2RlbCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEaWZmLCBiYXNlZCBvbiBuZXcgZGF0YSBhbmQgb2xkIGRhdGEsIGRldGVybWluZSB0aGVcbiAgICogbWluaW11bSBhbW91bnQgb2YgRE9NIG1hbmlwdWxhdGlvbnMgbmVlZGVkIHRvIG1ha2UgdGhlXG4gICAqIERPTSByZWZsZWN0IHRoZSBuZXcgZGF0YSBBcnJheS5cbiAgICpcbiAgICogVGhlIGFsZ29yaXRobSBkaWZmcyB0aGUgbmV3IGRhdGEgQXJyYXkgYnkgc3RvcmluZyBhXG4gICAqIGhpZGRlbiByZWZlcmVuY2UgdG8gYW4gb3duZXIgdm0gaW5zdGFuY2Ugb24gcHJldmlvdXNseVxuICAgKiBzZWVuIGRhdGEuIFRoaXMgYWxsb3dzIHVzIHRvIGFjaGlldmUgTyhuKSB3aGljaCBpc1xuICAgKiBiZXR0ZXIgdGhhbiBhIGxldmVuc2h0ZWluIGRpc3RhbmNlIGJhc2VkIGFsZ29yaXRobSxcbiAgICogd2hpY2ggaXMgTyhtICogbikuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFcbiAgICovXG5cbiAgZGlmZjogZnVuY3Rpb24gZGlmZihkYXRhKSB7XG4gICAgLy8gY2hlY2sgaWYgdGhlIEFycmF5IHdhcyBjb252ZXJ0ZWQgZnJvbSBhbiBPYmplY3RcbiAgICB2YXIgaXRlbSA9IGRhdGFbMF07XG4gICAgdmFyIGNvbnZlcnRlZEZyb21PYmplY3QgPSB0aGlzLmZyb21PYmplY3QgPSBpc09iamVjdChpdGVtKSAmJiBoYXNPd24oaXRlbSwgJyRrZXknKSAmJiBoYXNPd24oaXRlbSwgJyR2YWx1ZScpO1xuXG4gICAgdmFyIHRyYWNrQnlLZXkgPSB0aGlzLnBhcmFtcy50cmFja0J5O1xuICAgIHZhciBvbGRGcmFncyA9IHRoaXMuZnJhZ3M7XG4gICAgdmFyIGZyYWdzID0gdGhpcy5mcmFncyA9IG5ldyBBcnJheShkYXRhLmxlbmd0aCk7XG4gICAgdmFyIGFsaWFzID0gdGhpcy5hbGlhcztcbiAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLml0ZXJhdG9yO1xuICAgIHZhciBzdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgdmFyIGVuZCA9IHRoaXMuZW5kO1xuICAgIHZhciBpbkRvY3VtZW50ID0gaW5Eb2Moc3RhcnQpO1xuICAgIHZhciBpbml0ID0gIW9sZEZyYWdzO1xuICAgIHZhciBpLCBsLCBmcmFnLCBrZXksIHZhbHVlLCBwcmltaXRpdmU7XG5cbiAgICAvLyBGaXJzdCBwYXNzLCBnbyB0aHJvdWdoIHRoZSBuZXcgQXJyYXkgYW5kIGZpbGwgdXBcbiAgICAvLyB0aGUgbmV3IGZyYWdzIGFycmF5LiBJZiBhIHBpZWNlIG9mIGRhdGEgaGFzIGEgY2FjaGVkXG4gICAgLy8gaW5zdGFuY2UgZm9yIGl0LCB3ZSByZXVzZSBpdC4gT3RoZXJ3aXNlIGJ1aWxkIGEgbmV3XG4gICAgLy8gaW5zdGFuY2UuXG4gICAgZm9yIChpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpdGVtID0gZGF0YVtpXTtcbiAgICAgIGtleSA9IGNvbnZlcnRlZEZyb21PYmplY3QgPyBpdGVtLiRrZXkgOiBudWxsO1xuICAgICAgdmFsdWUgPSBjb252ZXJ0ZWRGcm9tT2JqZWN0ID8gaXRlbS4kdmFsdWUgOiBpdGVtO1xuICAgICAgcHJpbWl0aXZlID0gIWlzT2JqZWN0KHZhbHVlKTtcbiAgICAgIGZyYWcgPSAhaW5pdCAmJiB0aGlzLmdldENhY2hlZEZyYWcodmFsdWUsIGksIGtleSk7XG4gICAgICBpZiAoZnJhZykge1xuICAgICAgICAvLyByZXVzYWJsZSBmcmFnbWVudFxuICAgICAgICBmcmFnLnJldXNlZCA9IHRydWU7XG4gICAgICAgIC8vIHVwZGF0ZSAkaW5kZXhcbiAgICAgICAgZnJhZy5zY29wZS4kaW5kZXggPSBpO1xuICAgICAgICAvLyB1cGRhdGUgJGtleVxuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgZnJhZy5zY29wZS4ka2V5ID0ga2V5O1xuICAgICAgICB9XG4gICAgICAgIC8vIHVwZGF0ZSBpdGVyYXRvclxuICAgICAgICBpZiAoaXRlcmF0b3IpIHtcbiAgICAgICAgICBmcmFnLnNjb3BlW2l0ZXJhdG9yXSA9IGtleSAhPT0gbnVsbCA/IGtleSA6IGk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdXBkYXRlIGRhdGEgZm9yIHRyYWNrLWJ5LCBvYmplY3QgcmVwZWF0ICZcbiAgICAgICAgLy8gcHJpbWl0aXZlIHZhbHVlcy5cbiAgICAgICAgaWYgKHRyYWNrQnlLZXkgfHwgY29udmVydGVkRnJvbU9iamVjdCB8fCBwcmltaXRpdmUpIHtcbiAgICAgICAgICB3aXRob3V0Q29udmVyc2lvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmcmFnLnNjb3BlW2FsaWFzXSA9IHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZXcgaXNudGFuY2VcbiAgICAgICAgZnJhZyA9IHRoaXMuY3JlYXRlKHZhbHVlLCBhbGlhcywgaSwga2V5KTtcbiAgICAgICAgZnJhZy5mcmVzaCA9ICFpbml0O1xuICAgICAgfVxuICAgICAgZnJhZ3NbaV0gPSBmcmFnO1xuICAgICAgaWYgKGluaXQpIHtcbiAgICAgICAgZnJhZy5iZWZvcmUoZW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB3ZSdyZSBkb25lIGZvciB0aGUgaW5pdGlhbCByZW5kZXIuXG4gICAgaWYgKGluaXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTZWNvbmQgcGFzcywgZ28gdGhyb3VnaCB0aGUgb2xkIGZyYWdtZW50cyBhbmRcbiAgICAvLyBkZXN0cm95IHRob3NlIHdobyBhcmUgbm90IHJldXNlZCAoYW5kIHJlbW92ZSB0aGVtXG4gICAgLy8gZnJvbSBjYWNoZSlcbiAgICB2YXIgcmVtb3ZhbEluZGV4ID0gMDtcbiAgICB2YXIgdG90YWxSZW1vdmVkID0gb2xkRnJhZ3MubGVuZ3RoIC0gZnJhZ3MubGVuZ3RoO1xuICAgIC8vIHdoZW4gcmVtb3ZpbmcgYSBsYXJnZSBudW1iZXIgb2YgZnJhZ21lbnRzLCB3YXRjaGVyIHJlbW92YWxcbiAgICAvLyB0dXJucyBvdXQgdG8gYmUgYSBwZXJmIGJvdHRsZW5lY2ssIHNvIHdlIGJhdGNoIHRoZSB3YXRjaGVyXG4gICAgLy8gcmVtb3ZhbHMgaW50byBhIHNpbmdsZSBmaWx0ZXIgY2FsbCFcbiAgICB0aGlzLnZtLl92Rm9yUmVtb3ZpbmcgPSB0cnVlO1xuICAgIGZvciAoaSA9IDAsIGwgPSBvbGRGcmFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZyYWcgPSBvbGRGcmFnc1tpXTtcbiAgICAgIGlmICghZnJhZy5yZXVzZWQpIHtcbiAgICAgICAgdGhpcy5kZWxldGVDYWNoZWRGcmFnKGZyYWcpO1xuICAgICAgICB0aGlzLnJlbW92ZShmcmFnLCByZW1vdmFsSW5kZXgrKywgdG90YWxSZW1vdmVkLCBpbkRvY3VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52bS5fdkZvclJlbW92aW5nID0gZmFsc2U7XG4gICAgaWYgKHJlbW92YWxJbmRleCkge1xuICAgICAgdGhpcy52bS5fd2F0Y2hlcnMgPSB0aGlzLnZtLl93YXRjaGVycy5maWx0ZXIoZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgcmV0dXJuIHcuYWN0aXZlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRmluYWwgcGFzcywgbW92ZS9pbnNlcnQgbmV3IGZyYWdtZW50cyBpbnRvIHRoZVxuICAgIC8vIHJpZ2h0IHBsYWNlLlxuICAgIHZhciB0YXJnZXRQcmV2LCBwcmV2RWwsIGN1cnJlbnRQcmV2O1xuICAgIHZhciBpbnNlcnRpb25JbmRleCA9IDA7XG4gICAgZm9yIChpID0gMCwgbCA9IGZyYWdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZnJhZyA9IGZyYWdzW2ldO1xuICAgICAgLy8gdGhpcyBpcyB0aGUgZnJhZyB0aGF0IHdlIHNob3VsZCBiZSBhZnRlclxuICAgICAgdGFyZ2V0UHJldiA9IGZyYWdzW2kgLSAxXTtcbiAgICAgIHByZXZFbCA9IHRhcmdldFByZXYgPyB0YXJnZXRQcmV2LnN0YWdnZXJDYiA/IHRhcmdldFByZXYuc3RhZ2dlckFuY2hvciA6IHRhcmdldFByZXYuZW5kIHx8IHRhcmdldFByZXYubm9kZSA6IHN0YXJ0O1xuICAgICAgaWYgKGZyYWcucmV1c2VkICYmICFmcmFnLnN0YWdnZXJDYikge1xuICAgICAgICBjdXJyZW50UHJldiA9IGZpbmRQcmV2RnJhZyhmcmFnLCBzdGFydCwgdGhpcy5pZCk7XG4gICAgICAgIGlmIChjdXJyZW50UHJldiAhPT0gdGFyZ2V0UHJldiAmJiAoIWN1cnJlbnRQcmV2IHx8XG4gICAgICAgIC8vIG9wdGltaXphdGlvbiBmb3IgbW92aW5nIGEgc2luZ2xlIGl0ZW0uXG4gICAgICAgIC8vIHRoYW5rcyB0byBzdWdnZXN0aW9ucyBieSBAbGl2b3JhcyBpbiAjMTgwN1xuICAgICAgICBmaW5kUHJldkZyYWcoY3VycmVudFByZXYsIHN0YXJ0LCB0aGlzLmlkKSAhPT0gdGFyZ2V0UHJldikpIHtcbiAgICAgICAgICB0aGlzLm1vdmUoZnJhZywgcHJldkVsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmV3IGluc3RhbmNlLCBvciBzdGlsbCBpbiBzdGFnZ2VyLlxuICAgICAgICAvLyBpbnNlcnQgd2l0aCB1cGRhdGVkIHN0YWdnZXIgaW5kZXguXG4gICAgICAgIHRoaXMuaW5zZXJ0KGZyYWcsIGluc2VydGlvbkluZGV4KyssIHByZXZFbCwgaW5Eb2N1bWVudCk7XG4gICAgICB9XG4gICAgICBmcmFnLnJldXNlZCA9IGZyYWcuZnJlc2ggPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBmcmFnbWVudCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWxpYXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICAgKiBAcmV0dXJuIHtGcmFnbWVudH1cbiAgICovXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUodmFsdWUsIGFsaWFzLCBpbmRleCwga2V5KSB7XG4gICAgdmFyIGhvc3QgPSB0aGlzLl9ob3N0O1xuICAgIC8vIGNyZWF0ZSBpdGVyYXRpb24gc2NvcGVcbiAgICB2YXIgcGFyZW50U2NvcGUgPSB0aGlzLl9zY29wZSB8fCB0aGlzLnZtO1xuICAgIHZhciBzY29wZSA9IE9iamVjdC5jcmVhdGUocGFyZW50U2NvcGUpO1xuICAgIC8vIHJlZiBob2xkZXIgZm9yIHRoZSBzY29wZVxuICAgIHNjb3BlLiRyZWZzID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRTY29wZS4kcmVmcyk7XG4gICAgc2NvcGUuJGVscyA9IE9iamVjdC5jcmVhdGUocGFyZW50U2NvcGUuJGVscyk7XG4gICAgLy8gbWFrZSBzdXJlIHBvaW50ICRwYXJlbnQgdG8gcGFyZW50IHNjb3BlXG4gICAgc2NvcGUuJHBhcmVudCA9IHBhcmVudFNjb3BlO1xuICAgIC8vIGZvciB0d28td2F5IGJpbmRpbmcgb24gYWxpYXNcbiAgICBzY29wZS4kZm9yQ29udGV4dCA9IHRoaXM7XG4gICAgLy8gZGVmaW5lIHNjb3BlIHByb3BlcnRpZXNcbiAgICAvLyBpbXBvcnRhbnQ6IGRlZmluZSB0aGUgc2NvcGUgYWxpYXMgd2l0aG91dCBmb3JjZWQgY29udmVyc2lvblxuICAgIC8vIHNvIHRoYXQgZnJvemVuIGRhdGEgc3RydWN0dXJlcyByZW1haW4gbm9uLXJlYWN0aXZlLlxuICAgIHdpdGhvdXRDb252ZXJzaW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgIGRlZmluZVJlYWN0aXZlKHNjb3BlLCBhbGlhcywgdmFsdWUpO1xuICAgIH0pO1xuICAgIGRlZmluZVJlYWN0aXZlKHNjb3BlLCAnJGluZGV4JywgaW5kZXgpO1xuICAgIGlmIChrZXkpIHtcbiAgICAgIGRlZmluZVJlYWN0aXZlKHNjb3BlLCAnJGtleScsIGtleSk7XG4gICAgfSBlbHNlIGlmIChzY29wZS4ka2V5KSB7XG4gICAgICAvLyBhdm9pZCBhY2NpZGVudGFsIGZhbGxiYWNrXG4gICAgICBkZWYoc2NvcGUsICcka2V5JywgbnVsbCk7XG4gICAgfVxuICAgIGlmICh0aGlzLml0ZXJhdG9yKSB7XG4gICAgICBkZWZpbmVSZWFjdGl2ZShzY29wZSwgdGhpcy5pdGVyYXRvciwga2V5ICE9PSBudWxsID8ga2V5IDogaW5kZXgpO1xuICAgIH1cbiAgICB2YXIgZnJhZyA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoaG9zdCwgc2NvcGUsIHRoaXMuX2ZyYWcpO1xuICAgIGZyYWcuZm9ySWQgPSB0aGlzLmlkO1xuICAgIHRoaXMuY2FjaGVGcmFnKHZhbHVlLCBmcmFnLCBpbmRleCwga2V5KTtcbiAgICByZXR1cm4gZnJhZztcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIHRoZSB2LXJlZiBvbiBvd25lciB2bS5cbiAgICovXG5cbiAgdXBkYXRlUmVmOiBmdW5jdGlvbiB1cGRhdGVSZWYoKSB7XG4gICAgdmFyIHJlZiA9IHRoaXMuZGVzY3JpcHRvci5yZWY7XG4gICAgaWYgKCFyZWYpIHJldHVybjtcbiAgICB2YXIgaGFzaCA9ICh0aGlzLl9zY29wZSB8fCB0aGlzLnZtKS4kcmVmcztcbiAgICB2YXIgcmVmcztcbiAgICBpZiAoIXRoaXMuZnJvbU9iamVjdCkge1xuICAgICAgcmVmcyA9IHRoaXMuZnJhZ3MubWFwKGZpbmRWbUZyb21GcmFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVmcyA9IHt9O1xuICAgICAgdGhpcy5mcmFncy5mb3JFYWNoKGZ1bmN0aW9uIChmcmFnKSB7XG4gICAgICAgIHJlZnNbZnJhZy5zY29wZS4ka2V5XSA9IGZpbmRWbUZyb21GcmFnKGZyYWcpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGhhc2hbcmVmXSA9IHJlZnM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvciBvcHRpb24gbGlzdHMsIHVwZGF0ZSB0aGUgY29udGFpbmluZyB2LW1vZGVsIG9uXG4gICAqIHBhcmVudCA8c2VsZWN0Pi5cbiAgICovXG5cbiAgdXBkYXRlTW9kZWw6IGZ1bmN0aW9uIHVwZGF0ZU1vZGVsKCkge1xuICAgIGlmICh0aGlzLmlzT3B0aW9uKSB7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICAgICAgdmFyIG1vZGVsID0gcGFyZW50ICYmIHBhcmVudC5fX3ZfbW9kZWw7XG4gICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgbW9kZWwuZm9yY2VVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc2VydCBhIGZyYWdtZW50LiBIYW5kbGVzIHN0YWdnZXJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7RnJhZ21lbnR9IGZyYWdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7Tm9kZX0gcHJldkVsXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5Eb2N1bWVudFxuICAgKi9cblxuICBpbnNlcnQ6IGZ1bmN0aW9uIGluc2VydChmcmFnLCBpbmRleCwgcHJldkVsLCBpbkRvY3VtZW50KSB7XG4gICAgaWYgKGZyYWcuc3RhZ2dlckNiKSB7XG4gICAgICBmcmFnLnN0YWdnZXJDYi5jYW5jZWwoKTtcbiAgICAgIGZyYWcuc3RhZ2dlckNiID0gbnVsbDtcbiAgICB9XG4gICAgdmFyIHN0YWdnZXJBbW91bnQgPSB0aGlzLmdldFN0YWdnZXIoZnJhZywgaW5kZXgsIG51bGwsICdlbnRlcicpO1xuICAgIGlmIChpbkRvY3VtZW50ICYmIHN0YWdnZXJBbW91bnQpIHtcbiAgICAgIC8vIGNyZWF0ZSBhbiBhbmNob3IgYW5kIGluc2VydCBpdCBzeW5jaHJvbm91c2x5LFxuICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gcmVzb2x2ZSB0aGUgY29ycmVjdCBvcmRlciB3aXRob3V0XG4gICAgICAvLyB3b3JyeWluZyBhYm91dCBzb21lIGVsZW1lbnRzIG5vdCBpbnNlcnRlZCB5ZXRcbiAgICAgIHZhciBhbmNob3IgPSBmcmFnLnN0YWdnZXJBbmNob3I7XG4gICAgICBpZiAoIWFuY2hvcikge1xuICAgICAgICBhbmNob3IgPSBmcmFnLnN0YWdnZXJBbmNob3IgPSBjcmVhdGVBbmNob3IoJ3N0YWdnZXItYW5jaG9yJyk7XG4gICAgICAgIGFuY2hvci5fX3ZfZnJhZyA9IGZyYWc7XG4gICAgICB9XG4gICAgICBhZnRlcihhbmNob3IsIHByZXZFbCk7XG4gICAgICB2YXIgb3AgPSBmcmFnLnN0YWdnZXJDYiA9IGNhbmNlbGxhYmxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnJhZy5zdGFnZ2VyQ2IgPSBudWxsO1xuICAgICAgICBmcmFnLmJlZm9yZShhbmNob3IpO1xuICAgICAgICByZW1vdmUoYW5jaG9yKTtcbiAgICAgIH0pO1xuICAgICAgc2V0VGltZW91dChvcCwgc3RhZ2dlckFtb3VudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyYWcuYmVmb3JlKHByZXZFbC5uZXh0U2libGluZyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBmcmFnbWVudC4gSGFuZGxlcyBzdGFnZ2VyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0ZyYWdtZW50fSBmcmFnXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge051bWJlcn0gdG90YWxcbiAgICogQHBhcmFtIHtCb29sZWFufSBpbkRvY3VtZW50XG4gICAqL1xuXG4gIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGZyYWcsIGluZGV4LCB0b3RhbCwgaW5Eb2N1bWVudCkge1xuICAgIGlmIChmcmFnLnN0YWdnZXJDYikge1xuICAgICAgZnJhZy5zdGFnZ2VyQ2IuY2FuY2VsKCk7XG4gICAgICBmcmFnLnN0YWdnZXJDYiA9IG51bGw7XG4gICAgICAvLyBpdCdzIG5vdCBwb3NzaWJsZSBmb3IgdGhlIHNhbWUgZnJhZyB0byBiZSByZW1vdmVkXG4gICAgICAvLyB0d2ljZSwgc28gaWYgd2UgaGF2ZSBhIHBlbmRpbmcgc3RhZ2dlciBjYWxsYmFjayxcbiAgICAgIC8vIGl0IG1lYW5zIHRoaXMgZnJhZyBpcyBxdWV1ZWQgZm9yIGVudGVyIGJ1dCByZW1vdmVkXG4gICAgICAvLyBiZWZvcmUgaXRzIHRyYW5zaXRpb24gc3RhcnRlZC4gU2luY2UgaXQgaXMgYWxyZWFkeVxuICAgICAgLy8gZGVzdHJveWVkLCB3ZSBjYW4ganVzdCBsZWF2ZSBpdCBpbiBkZXRhY2hlZCBzdGF0ZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHN0YWdnZXJBbW91bnQgPSB0aGlzLmdldFN0YWdnZXIoZnJhZywgaW5kZXgsIHRvdGFsLCAnbGVhdmUnKTtcbiAgICBpZiAoaW5Eb2N1bWVudCAmJiBzdGFnZ2VyQW1vdW50KSB7XG4gICAgICB2YXIgb3AgPSBmcmFnLnN0YWdnZXJDYiA9IGNhbmNlbGxhYmxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnJhZy5zdGFnZ2VyQ2IgPSBudWxsO1xuICAgICAgICBmcmFnLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICBzZXRUaW1lb3V0KG9wLCBzdGFnZ2VyQW1vdW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJhZy5yZW1vdmUoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1vdmUgYSBmcmFnbWVudCB0byBhIG5ldyBwb3NpdGlvbi5cbiAgICogRm9yY2Ugbm8gdHJhbnNpdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtGcmFnbWVudH0gZnJhZ1xuICAgKiBAcGFyYW0ge05vZGV9IHByZXZFbFxuICAgKi9cblxuICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKGZyYWcsIHByZXZFbCkge1xuICAgIC8vIGZpeCBhIGNvbW1vbiBpc3N1ZSB3aXRoIFNvcnRhYmxlOlxuICAgIC8vIGlmIHByZXZFbCBkb2Vzbid0IGhhdmUgbmV4dFNpYmxpbmcsIHRoaXMgbWVhbnMgaXQnc1xuICAgIC8vIGJlZW4gZHJhZ2dlZCBhZnRlciB0aGUgZW5kIGFuY2hvci4gSnVzdCByZS1wb3NpdGlvblxuICAgIC8vIHRoZSBlbmQgYW5jaG9yIHRvIHRoZSBlbmQgb2YgdGhlIGNvbnRhaW5lci5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXByZXZFbC5uZXh0U2libGluZykge1xuICAgICAgdGhpcy5lbmQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmVuZCk7XG4gICAgfVxuICAgIGZyYWcuYmVmb3JlKHByZXZFbC5uZXh0U2libGluZywgZmFsc2UpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDYWNoZSBhIGZyYWdtZW50IHVzaW5nIHRyYWNrLWJ5IG9yIHRoZSBvYmplY3Qga2V5LlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7RnJhZ21lbnR9IGZyYWdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICAgKi9cblxuICBjYWNoZUZyYWc6IGZ1bmN0aW9uIGNhY2hlRnJhZyh2YWx1ZSwgZnJhZywgaW5kZXgsIGtleSkge1xuICAgIHZhciB0cmFja0J5S2V5ID0gdGhpcy5wYXJhbXMudHJhY2tCeTtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLmNhY2hlO1xuICAgIHZhciBwcmltaXRpdmUgPSAhaXNPYmplY3QodmFsdWUpO1xuICAgIHZhciBpZDtcbiAgICBpZiAoa2V5IHx8IHRyYWNrQnlLZXkgfHwgcHJpbWl0aXZlKSB7XG4gICAgICBpZCA9IHRyYWNrQnlLZXkgPyB0cmFja0J5S2V5ID09PSAnJGluZGV4JyA/IGluZGV4IDogdmFsdWVbdHJhY2tCeUtleV0gOiBrZXkgfHwgdmFsdWU7XG4gICAgICBpZiAoIWNhY2hlW2lkXSkge1xuICAgICAgICBjYWNoZVtpZF0gPSBmcmFnO1xuICAgICAgfSBlbHNlIGlmICh0cmFja0J5S2V5ICE9PSAnJGluZGV4Jykge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHRoaXMud2FybkR1cGxpY2F0ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gdGhpcy5pZDtcbiAgICAgIGlmIChoYXNPd24odmFsdWUsIGlkKSkge1xuICAgICAgICBpZiAodmFsdWVbaWRdID09PSBudWxsKSB7XG4gICAgICAgICAgdmFsdWVbaWRdID0gZnJhZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHRoaXMud2FybkR1cGxpY2F0ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZih2YWx1ZSwgaWQsIGZyYWcpO1xuICAgICAgfVxuICAgIH1cbiAgICBmcmFnLnJhdyA9IHZhbHVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgYSBjYWNoZWQgZnJhZ21lbnQgZnJvbSB0aGUgdmFsdWUvaW5kZXgva2V5XG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7RnJhZ21lbnR9XG4gICAqL1xuXG4gIGdldENhY2hlZEZyYWc6IGZ1bmN0aW9uIGdldENhY2hlZEZyYWcodmFsdWUsIGluZGV4LCBrZXkpIHtcbiAgICB2YXIgdHJhY2tCeUtleSA9IHRoaXMucGFyYW1zLnRyYWNrQnk7XG4gICAgdmFyIHByaW1pdGl2ZSA9ICFpc09iamVjdCh2YWx1ZSk7XG4gICAgdmFyIGZyYWc7XG4gICAgaWYgKGtleSB8fCB0cmFja0J5S2V5IHx8IHByaW1pdGl2ZSkge1xuICAgICAgdmFyIGlkID0gdHJhY2tCeUtleSA/IHRyYWNrQnlLZXkgPT09ICckaW5kZXgnID8gaW5kZXggOiB2YWx1ZVt0cmFja0J5S2V5XSA6IGtleSB8fCB2YWx1ZTtcbiAgICAgIGZyYWcgPSB0aGlzLmNhY2hlW2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJhZyA9IHZhbHVlW3RoaXMuaWRdO1xuICAgIH1cbiAgICBpZiAoZnJhZyAmJiAoZnJhZy5yZXVzZWQgfHwgZnJhZy5mcmVzaCkpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdGhpcy53YXJuRHVwbGljYXRlKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhIGZyYWdtZW50IGZyb20gY2FjaGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnJhZ21lbnR9IGZyYWdcbiAgICovXG5cbiAgZGVsZXRlQ2FjaGVkRnJhZzogZnVuY3Rpb24gZGVsZXRlQ2FjaGVkRnJhZyhmcmFnKSB7XG4gICAgdmFyIHZhbHVlID0gZnJhZy5yYXc7XG4gICAgdmFyIHRyYWNrQnlLZXkgPSB0aGlzLnBhcmFtcy50cmFja0J5O1xuICAgIHZhciBzY29wZSA9IGZyYWcuc2NvcGU7XG4gICAgdmFyIGluZGV4ID0gc2NvcGUuJGluZGV4O1xuICAgIC8vIGZpeCAjOTQ4OiBhdm9pZCBhY2NpZGVudGFsbHkgZmFsbCB0aHJvdWdoIHRvXG4gICAgLy8gYSBwYXJlbnQgcmVwZWF0ZXIgd2hpY2ggaGFwcGVucyB0byBoYXZlICRrZXkuXG4gICAgdmFyIGtleSA9IGhhc093bihzY29wZSwgJyRrZXknKSAmJiBzY29wZS4ka2V5O1xuICAgIHZhciBwcmltaXRpdmUgPSAhaXNPYmplY3QodmFsdWUpO1xuICAgIGlmICh0cmFja0J5S2V5IHx8IGtleSB8fCBwcmltaXRpdmUpIHtcbiAgICAgIHZhciBpZCA9IHRyYWNrQnlLZXkgPyB0cmFja0J5S2V5ID09PSAnJGluZGV4JyA/IGluZGV4IDogdmFsdWVbdHJhY2tCeUtleV0gOiBrZXkgfHwgdmFsdWU7XG4gICAgICB0aGlzLmNhY2hlW2lkXSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlW3RoaXMuaWRdID0gbnVsbDtcbiAgICAgIGZyYWcucmF3ID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3RhZ2dlciBhbW91bnQgZm9yIGFuIGluc2VydGlvbi9yZW1vdmFsLlxuICAgKlxuICAgKiBAcGFyYW0ge0ZyYWdtZW50fSBmcmFnXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge051bWJlcn0gdG90YWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAgICovXG5cbiAgZ2V0U3RhZ2dlcjogZnVuY3Rpb24gZ2V0U3RhZ2dlcihmcmFnLCBpbmRleCwgdG90YWwsIHR5cGUpIHtcbiAgICB0eXBlID0gdHlwZSArICdTdGFnZ2VyJztcbiAgICB2YXIgdHJhbnMgPSBmcmFnLm5vZGUuX192X3RyYW5zO1xuICAgIHZhciBob29rcyA9IHRyYW5zICYmIHRyYW5zLmhvb2tzO1xuICAgIHZhciBob29rID0gaG9va3MgJiYgKGhvb2tzW3R5cGVdIHx8IGhvb2tzLnN0YWdnZXIpO1xuICAgIHJldHVybiBob29rID8gaG9vay5jYWxsKGZyYWcsIGluZGV4LCB0b3RhbCkgOiBpbmRleCAqIHBhcnNlSW50KHRoaXMucGFyYW1zW3R5cGVdIHx8IHRoaXMucGFyYW1zLnN0YWdnZXIsIDEwKTtcbiAgfSxcblxuICAvKipcbiAgICogUHJlLXByb2Nlc3MgdGhlIHZhbHVlIGJlZm9yZSBwaXBpbmcgaXQgdGhyb3VnaCB0aGVcbiAgICogZmlsdGVycy4gVGhpcyBpcyBwYXNzZWQgdG8gYW5kIGNhbGxlZCBieSB0aGUgd2F0Y2hlci5cbiAgICovXG5cbiAgX3ByZVByb2Nlc3M6IGZ1bmN0aW9uIF9wcmVQcm9jZXNzKHZhbHVlKSB7XG4gICAgLy8gcmVnYXJkbGVzcyBvZiB0eXBlLCBzdG9yZSB0aGUgdW4tZmlsdGVyZWQgcmF3IHZhbHVlLlxuICAgIHRoaXMucmF3VmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFBvc3QtcHJvY2VzcyB0aGUgdmFsdWUgYWZ0ZXIgaXQgaGFzIGJlZW4gcGlwZWQgdGhyb3VnaFxuICAgKiB0aGUgZmlsdGVycy4gVGhpcyBpcyBwYXNzZWQgdG8gYW5kIGNhbGxlZCBieSB0aGUgd2F0Y2hlci5cbiAgICpcbiAgICogSXQgaXMgbmVjZXNzYXJ5IGZvciB0aGlzIHRvIGJlIGNhbGxlZCBkdXJpbmcgdGhlXG4gICAqIHdhdGhjZXIncyBkZXBlbmRlbmN5IGNvbGxlY3Rpb24gcGhhc2UgYmVjYXVzZSB3ZSB3YW50XG4gICAqIHRoZSB2LWZvciB0byB1cGRhdGUgd2hlbiB0aGUgc291cmNlIE9iamVjdCBpcyBtdXRhdGVkLlxuICAgKi9cblxuICBfcG9zdFByb2Nlc3M6IGZ1bmN0aW9uIF9wb3N0UHJvY2Vzcyh2YWx1ZSkge1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpIHtcbiAgICAgIC8vIGNvbnZlcnQgcGxhaW4gb2JqZWN0IHRvIGFycmF5LlxuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICAgICAgdmFyIHJlcyA9IG5ldyBBcnJheShpKTtcbiAgICAgIHZhciBrZXk7XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgIHJlc1tpXSA9IHtcbiAgICAgICAgICAka2V5OiBrZXksXG4gICAgICAgICAgJHZhbHVlOiB2YWx1ZVtrZXldXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcmFuZ2UodmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIHx8IFtdO1xuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uIHVuYmluZCgpIHtcbiAgICBpZiAodGhpcy5kZXNjcmlwdG9yLnJlZikge1xuICAgICAgKHRoaXMuX3Njb3BlIHx8IHRoaXMudm0pLiRyZWZzW3RoaXMuZGVzY3JpcHRvci5yZWZdID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZnJhZ3MpIHtcbiAgICAgIHZhciBpID0gdGhpcy5mcmFncy5sZW5ndGg7XG4gICAgICB2YXIgZnJhZztcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgZnJhZyA9IHRoaXMuZnJhZ3NbaV07XG4gICAgICAgIHRoaXMuZGVsZXRlQ2FjaGVkRnJhZyhmcmFnKTtcbiAgICAgICAgZnJhZy5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEhlbHBlciB0byBmaW5kIHRoZSBwcmV2aW91cyBlbGVtZW50IHRoYXQgaXMgYSBmcmFnbWVudFxuICogYW5jaG9yLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGEgZGVzdHJveWVkIGZyYWcnc1xuICogZWxlbWVudCBjb3VsZCBzdGlsbCBiZSBsaW5nZXJpbmcgaW4gdGhlIERPTSBiZWZvcmUgaXRzXG4gKiBsZWF2aW5nIHRyYW5zaXRpb24gZmluaXNoZXMsIGJ1dCBpdHMgaW5zZXJ0ZWQgZmxhZ1xuICogc2hvdWxkIGhhdmUgYmVlbiBzZXQgdG8gZmFsc2Ugc28gd2UgY2FuIHNraXAgdGhlbS5cbiAqXG4gKiBJZiB0aGlzIGlzIGEgYmxvY2sgcmVwZWF0LCB3ZSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBvbmx5XG4gKiByZXR1cm4gZnJhZyB0aGF0IGlzIGJvdW5kIHRvIHRoaXMgdi1mb3IuIChzZWUgIzkyOSlcbiAqXG4gKiBAcGFyYW0ge0ZyYWdtZW50fSBmcmFnXG4gKiBAcGFyYW0ge0NvbW1lbnR8VGV4dH0gYW5jaG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAqIEByZXR1cm4ge0ZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIGZpbmRQcmV2RnJhZyhmcmFnLCBhbmNob3IsIGlkKSB7XG4gIHZhciBlbCA9IGZyYWcubm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIWVsKSByZXR1cm47XG4gIGZyYWcgPSBlbC5fX3ZfZnJhZztcbiAgd2hpbGUgKCghZnJhZyB8fCBmcmFnLmZvcklkICE9PSBpZCB8fCAhZnJhZy5pbnNlcnRlZCkgJiYgZWwgIT09IGFuY2hvcikge1xuICAgIGVsID0gZWwucHJldmlvdXNTaWJsaW5nO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBmcmFnID0gZWwuX192X2ZyYWc7XG4gIH1cbiAgcmV0dXJuIGZyYWc7XG59XG5cbi8qKlxuICogRmluZCBhIHZtIGZyb20gYSBmcmFnbWVudC5cbiAqXG4gKiBAcGFyYW0ge0ZyYWdtZW50fSBmcmFnXG4gKiBAcmV0dXJuIHtWdWV8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGZpbmRWbUZyb21GcmFnKGZyYWcpIHtcbiAgdmFyIG5vZGUgPSBmcmFnLm5vZGU7XG4gIC8vIGhhbmRsZSBtdWx0aS1ub2RlIGZyYWdcbiAgaWYgKGZyYWcuZW5kKSB7XG4gICAgd2hpbGUgKCFub2RlLl9fdnVlX18gJiYgbm9kZSAhPT0gZnJhZy5lbmQgJiYgbm9kZS5uZXh0U2libGluZykge1xuICAgICAgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2RlLl9fdnVlX187XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcmFuZ2UgYXJyYXkgZnJvbSBnaXZlbiBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIHJhbmdlKG4pIHtcbiAgdmFyIGkgPSAtMTtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShNYXRoLmZsb29yKG4pKTtcbiAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICByZXRbaV0gPSBpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZGb3Iud2FybkR1cGxpY2F0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHdhcm4oJ0R1cGxpY2F0ZSB2YWx1ZSBmb3VuZCBpbiB2LWZvcj1cIicgKyB0aGlzLmRlc2NyaXB0b3IucmF3ICsgJ1wiOiAnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpICsgJy4gVXNlIHRyYWNrLWJ5PVwiJGluZGV4XCIgaWYgJyArICd5b3UgYXJlIGV4cGVjdGluZyBkdXBsaWNhdGUgdmFsdWVzLicpO1xuICB9O1xufVxuXG52YXIgdklmID0ge1xuXG4gIHByaW9yaXR5OiBJRixcbiAgdGVybWluYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIGlmICghZWwuX192dWVfXykge1xuICAgICAgLy8gY2hlY2sgZWxzZSBibG9ja1xuICAgICAgdmFyIG5leHQgPSBlbC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICBpZiAobmV4dCAmJiBnZXRBdHRyKG5leHQsICd2LWVsc2UnKSAhPT0gbnVsbCkge1xuICAgICAgICByZW1vdmUobmV4dCk7XG4gICAgICAgIHRoaXMuZWxzZUVsID0gbmV4dDtcbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIG1haW4gYmxvY2tcbiAgICAgIHRoaXMuYW5jaG9yID0gY3JlYXRlQW5jaG9yKCd2LWlmJyk7XG4gICAgICByZXBsYWNlKGVsLCB0aGlzLmFuY2hvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2Fybigndi1pZj1cIicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgY2Fubm90IGJlICcgKyAndXNlZCBvbiBhbiBpbnN0YW5jZSByb290IGVsZW1lbnQuJyk7XG4gICAgICB0aGlzLmludmFsaWQgPSB0cnVlO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmludmFsaWQpIHJldHVybjtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5mcmFnKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9LFxuXG4gIGluc2VydDogZnVuY3Rpb24gaW5zZXJ0KCkge1xuICAgIGlmICh0aGlzLmVsc2VGcmFnKSB7XG4gICAgICB0aGlzLmVsc2VGcmFnLnJlbW92ZSgpO1xuICAgICAgdGhpcy5lbHNlRnJhZyA9IG51bGw7XG4gICAgfVxuICAgIC8vIGxhenkgaW5pdCBmYWN0b3J5XG4gICAgaWYgKCF0aGlzLmZhY3RvcnkpIHtcbiAgICAgIHRoaXMuZmFjdG9yeSA9IG5ldyBGcmFnbWVudEZhY3RvcnkodGhpcy52bSwgdGhpcy5lbCk7XG4gICAgfVxuICAgIHRoaXMuZnJhZyA9IHRoaXMuZmFjdG9yeS5jcmVhdGUodGhpcy5faG9zdCwgdGhpcy5fc2NvcGUsIHRoaXMuX2ZyYWcpO1xuICAgIHRoaXMuZnJhZy5iZWZvcmUodGhpcy5hbmNob3IpO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLmZyYWcpIHtcbiAgICAgIHRoaXMuZnJhZy5yZW1vdmUoKTtcbiAgICAgIHRoaXMuZnJhZyA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLmVsc2VFbCAmJiAhdGhpcy5lbHNlRnJhZykge1xuICAgICAgaWYgKCF0aGlzLmVsc2VGYWN0b3J5KSB7XG4gICAgICAgIHRoaXMuZWxzZUZhY3RvcnkgPSBuZXcgRnJhZ21lbnRGYWN0b3J5KHRoaXMuZWxzZUVsLl9jb250ZXh0IHx8IHRoaXMudm0sIHRoaXMuZWxzZUVsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZWxzZUZyYWcgPSB0aGlzLmVsc2VGYWN0b3J5LmNyZWF0ZSh0aGlzLl9ob3N0LCB0aGlzLl9zY29wZSwgdGhpcy5fZnJhZyk7XG4gICAgICB0aGlzLmVsc2VGcmFnLmJlZm9yZSh0aGlzLmFuY2hvcik7XG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKCkge1xuICAgIGlmICh0aGlzLmZyYWcpIHtcbiAgICAgIHRoaXMuZnJhZy5kZXN0cm95KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVsc2VGcmFnKSB7XG4gICAgICB0aGlzLmVsc2VGcmFnLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBzaG93ID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgLy8gY2hlY2sgZWxzZSBibG9ja1xuICAgIHZhciBuZXh0ID0gdGhpcy5lbC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgaWYgKG5leHQgJiYgZ2V0QXR0cihuZXh0LCAndi1lbHNlJykgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuZWxzZUVsID0gbmV4dDtcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUodmFsdWUpIHtcbiAgICB0aGlzLmFwcGx5KHRoaXMuZWwsIHZhbHVlKTtcbiAgICBpZiAodGhpcy5lbHNlRWwpIHtcbiAgICAgIHRoaXMuYXBwbHkodGhpcy5lbHNlRWwsICF2YWx1ZSk7XG4gICAgfVxuICB9LFxuXG4gIGFwcGx5OiBmdW5jdGlvbiBhcHBseShlbCwgdmFsdWUpIHtcbiAgICBpZiAoaW5Eb2MoZWwpKSB7XG4gICAgICBhcHBseVRyYW5zaXRpb24oZWwsIHZhbHVlID8gMSA6IC0xLCB0b2dnbGUsIHRoaXMudm0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b2dnbGUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSc7XG4gICAgfVxuICB9XG59O1xuXG52YXIgdGV4dCQyID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG4gICAgdmFyIGlzUmFuZ2UgPSBlbC50eXBlID09PSAncmFuZ2UnO1xuICAgIHZhciBsYXp5ID0gdGhpcy5wYXJhbXMubGF6eTtcbiAgICB2YXIgbnVtYmVyID0gdGhpcy5wYXJhbXMubnVtYmVyO1xuICAgIHZhciBkZWJvdW5jZSA9IHRoaXMucGFyYW1zLmRlYm91bmNlO1xuXG4gICAgLy8gaGFuZGxlIGNvbXBvc2l0aW9uIGV2ZW50cy5cbiAgICAvLyAgIGh0dHA6Ly9ibG9nLmV2YW55b3UubWUvMjAxNC8wMS8wMy9jb21wb3NpdGlvbi1ldmVudC9cbiAgICAvLyBza2lwIHRoaXMgZm9yIEFuZHJvaWQgYmVjYXVzZSBpdCBoYW5kbGVzIGNvbXBvc2l0aW9uXG4gICAgLy8gZXZlbnRzIHF1aXRlIGRpZmZlcmVudGx5LiBBbmRyb2lkIGRvZXNuJ3QgdHJpZ2dlclxuICAgIC8vIGNvbXBvc2l0aW9uIGV2ZW50cyBmb3IgbGFuZ3VhZ2UgaW5wdXQgbWV0aG9kcyBlLmcuXG4gICAgLy8gQ2hpbmVzZSwgYnV0IGluc3RlYWQgdHJpZ2dlcnMgdGhlbSBmb3Igc3BlbGxpbmdcbiAgICAvLyBzdWdnZXN0aW9ucy4uLiAoc2VlIERpc2N1c3Npb24vIzE2MilcbiAgICB2YXIgY29tcG9zaW5nID0gZmFsc2U7XG4gICAgaWYgKCFpc0FuZHJvaWQgJiYgIWlzUmFuZ2UpIHtcbiAgICAgIHRoaXMub24oJ2NvbXBvc2l0aW9uc3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbXBvc2luZyA9IHRydWU7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub24oJ2NvbXBvc2l0aW9uZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb21wb3NpbmcgPSBmYWxzZTtcbiAgICAgICAgLy8gaW4gSUUxMSB0aGUgXCJjb21wb3NpdGlvbmVuZFwiIGV2ZW50IGZpcmVzIEFGVEVSXG4gICAgICAgIC8vIHRoZSBcImlucHV0XCIgZXZlbnQsIHNvIHRoZSBpbnB1dCBoYW5kbGVyIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gYXQgdGhlIGVuZC4uLiBoYXZlIHRvIGNhbGwgaXQgaGVyZS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gIzEzMjc6IGluIGxhenkgbW9kZSB0aGlzIGlzIHVuZWNlc3NhcnkuXG4gICAgICAgIGlmICghbGF6eSkge1xuICAgICAgICAgIHNlbGYubGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcHJldmVudCBtZXNzaW5nIHdpdGggdGhlIGlucHV0IHdoZW4gdXNlciBpcyB0eXBpbmcsXG4gICAgLy8gYW5kIGZvcmNlIHVwZGF0ZSBvbiBibHVyLlxuICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIGlmICghaXNSYW5nZSAmJiAhbGF6eSkge1xuICAgICAgdGhpcy5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuZm9jdXNlZCA9IHRydWU7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub24oJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgICAvLyBkbyBub3Qgc3luYyB2YWx1ZSBhZnRlciBmcmFnbWVudCByZW1vdmFsICgjMjAxNylcbiAgICAgICAgaWYgKCFzZWxmLl9mcmFnIHx8IHNlbGYuX2ZyYWcuaW5zZXJ0ZWQpIHtcbiAgICAgICAgICBzZWxmLnJhd0xpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE5vdyBhdHRhY2ggdGhlIG1haW4gbGlzdGVuZXJcbiAgICB0aGlzLmxpc3RlbmVyID0gdGhpcy5yYXdMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjb21wb3NpbmcgfHwgIXNlbGYuX2JvdW5kKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB2YWwgPSBudW1iZXIgfHwgaXNSYW5nZSA/IHRvTnVtYmVyKGVsLnZhbHVlKSA6IGVsLnZhbHVlO1xuICAgICAgc2VsZi5zZXQodmFsKTtcbiAgICAgIC8vIGZvcmNlIHVwZGF0ZSBvbiBuZXh0IHRpY2sgdG8gYXZvaWQgbG9jayAmIHNhbWUgdmFsdWVcbiAgICAgIC8vIGFsc28gb25seSB1cGRhdGUgd2hlbiB1c2VyIGlzIG5vdCB0eXBpbmdcbiAgICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNlbGYuX2JvdW5kICYmICFzZWxmLmZvY3VzZWQpIHtcbiAgICAgICAgICBzZWxmLnVwZGF0ZShzZWxmLl93YXRjaGVyLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIGFwcGx5IGRlYm91bmNlXG4gICAgaWYgKGRlYm91bmNlKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyID0gX2RlYm91bmNlKHRoaXMubGlzdGVuZXIsIGRlYm91bmNlKTtcbiAgICB9XG5cbiAgICAvLyBTdXBwb3J0IGpRdWVyeSBldmVudHMsIHNpbmNlIGpRdWVyeS50cmlnZ2VyKCkgZG9lc24ndFxuICAgIC8vIHRyaWdnZXIgbmF0aXZlIGV2ZW50cyBpbiBzb21lIGNhc2VzIGFuZCBzb21lIHBsdWdpbnNcbiAgICAvLyByZWx5IG9uICQudHJpZ2dlcigpXG4gICAgLy9cbiAgICAvLyBXZSB3YW50IHRvIG1ha2Ugc3VyZSBpZiBhIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHVzaW5nXG4gICAgLy8galF1ZXJ5LCBpdCBpcyBhbHNvIHJlbW92ZWQgd2l0aCBqUXVlcnksIHRoYXQncyB3aHlcbiAgICAvLyB3ZSBkbyB0aGUgY2hlY2sgZm9yIGVhY2ggZGlyZWN0aXZlIGluc3RhbmNlIGFuZFxuICAgIC8vIHN0b3JlIHRoYXQgY2hlY2sgcmVzdWx0IG9uIGl0c2VsZi4gVGhpcyBhbHNvIGFsbG93c1xuICAgIC8vIGVhc2llciB0ZXN0IGNvdmVyYWdlIGNvbnRyb2wgYnkgdW5zZXR0aW5nIHRoZSBnbG9iYWxcbiAgICAvLyBqUXVlcnkgdmFyaWFibGUgaW4gdGVzdHMuXG4gICAgdGhpcy5oYXNqUXVlcnkgPSB0eXBlb2YgalF1ZXJ5ID09PSAnZnVuY3Rpb24nO1xuICAgIGlmICh0aGlzLmhhc2pRdWVyeSkge1xuICAgICAgdmFyIG1ldGhvZCA9IGpRdWVyeS5mbi5vbiA/ICdvbicgOiAnYmluZCc7XG4gICAgICBqUXVlcnkoZWwpW21ldGhvZF0oJ2NoYW5nZScsIHRoaXMucmF3TGlzdGVuZXIpO1xuICAgICAgaWYgKCFsYXp5KSB7XG4gICAgICAgIGpRdWVyeShlbClbbWV0aG9kXSgnaW5wdXQnLCB0aGlzLmxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbignY2hhbmdlJywgdGhpcy5yYXdMaXN0ZW5lcik7XG4gICAgICBpZiAoIWxhenkpIHtcbiAgICAgICAgdGhpcy5vbignaW5wdXQnLCB0aGlzLmxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJRTkgZG9lc24ndCBmaXJlIGlucHV0IGV2ZW50IG9uIGJhY2tzcGFjZS9kZWwvY3V0XG4gICAgaWYgKCFsYXp5ICYmIGlzSUU5KSB7XG4gICAgICB0aGlzLm9uKCdjdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5leHRUaWNrKHNlbGYubGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQ2IHx8IGUua2V5Q29kZSA9PT0gOCkge1xuICAgICAgICAgIHNlbGYubGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IGluaXRpYWwgdmFsdWUgaWYgcHJlc2VudFxuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykgfHwgZWwudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyAmJiBlbC52YWx1ZS50cmltKCkpIHtcbiAgICAgIHRoaXMuYWZ0ZXJCaW5kID0gdGhpcy5saXN0ZW5lcjtcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUodmFsdWUpIHtcbiAgICB0aGlzLmVsLnZhbHVlID0gX3RvU3RyaW5nKHZhbHVlKTtcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uIHVuYmluZCgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIGlmICh0aGlzLmhhc2pRdWVyeSkge1xuICAgICAgdmFyIG1ldGhvZCA9IGpRdWVyeS5mbi5vZmYgPyAnb2ZmJyA6ICd1bmJpbmQnO1xuICAgICAgalF1ZXJ5KGVsKVttZXRob2RdKCdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKTtcbiAgICAgIGpRdWVyeShlbClbbWV0aG9kXSgnaW5wdXQnLCB0aGlzLmxpc3RlbmVyKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciByYWRpbyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuXG4gICAgdGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhbHVlIG92ZXJ3cml0ZSB2aWEgdi1iaW5kOnZhbHVlXG4gICAgICBpZiAoZWwuaGFzT3duUHJvcGVydHkoJ192YWx1ZScpKSB7XG4gICAgICAgIHJldHVybiBlbC5fdmFsdWU7XG4gICAgICB9XG4gICAgICB2YXIgdmFsID0gZWwudmFsdWU7XG4gICAgICBpZiAoc2VsZi5wYXJhbXMubnVtYmVyKSB7XG4gICAgICAgIHZhbCA9IHRvTnVtYmVyKHZhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH07XG5cbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZXQoc2VsZi5nZXRWYWx1ZSgpKTtcbiAgICB9O1xuICAgIHRoaXMub24oJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpO1xuXG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnY2hlY2tlZCcpKSB7XG4gICAgICB0aGlzLmFmdGVyQmluZCA9IHRoaXMubGlzdGVuZXI7XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5lbC5jaGVja2VkID0gbG9vc2VFcXVhbCh2YWx1ZSwgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgfVxufTtcblxudmFyIHNlbGVjdCA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuXG4gICAgLy8gbWV0aG9kIHRvIGZvcmNlIHVwZGF0ZSBET00gdXNpbmcgbGF0ZXN0IHZhbHVlLlxuICAgIHRoaXMuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fd2F0Y2hlcikge1xuICAgICAgICBzZWxmLnVwZGF0ZShzZWxmLl93YXRjaGVyLmdldCgpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhIG11bHRpcGxlIHNlbGVjdFxuICAgIHZhciBtdWx0aXBsZSA9IHRoaXMubXVsdGlwbGUgPSBlbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJyk7XG5cbiAgICAvLyBhdHRhY2ggbGlzdGVuZXJcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gZ2V0VmFsdWUoZWwsIG11bHRpcGxlKTtcbiAgICAgIHZhbHVlID0gc2VsZi5wYXJhbXMubnVtYmVyID8gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5tYXAodG9OdW1iZXIpIDogdG9OdW1iZXIodmFsdWUpIDogdmFsdWU7XG4gICAgICBzZWxmLnNldCh2YWx1ZSk7XG4gICAgfTtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKTtcblxuICAgIC8vIGlmIGhhcyBpbml0aWFsIHZhbHVlLCBzZXQgYWZ0ZXJCaW5kXG4gICAgdmFyIGluaXRWYWx1ZSA9IGdldFZhbHVlKGVsLCBtdWx0aXBsZSwgdHJ1ZSk7XG4gICAgaWYgKG11bHRpcGxlICYmIGluaXRWYWx1ZS5sZW5ndGggfHwgIW11bHRpcGxlICYmIGluaXRWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5hZnRlckJpbmQgPSB0aGlzLmxpc3RlbmVyO1xuICAgIH1cblxuICAgIC8vIEFsbCBtYWpvciBicm93c2VycyBleGNlcHQgRmlyZWZveCByZXNldHNcbiAgICAvLyBzZWxlY3RlZEluZGV4IHdpdGggdmFsdWUgLTEgdG8gMCB3aGVuIHRoZSBlbGVtZW50XG4gICAgLy8gaXMgYXBwZW5kZWQgdG8gYSBuZXcgcGFyZW50LCB0aGVyZWZvcmUgd2UgaGF2ZSB0b1xuICAgIC8vIGZvcmNlIGEgRE9NIHVwZGF0ZSB3aGVuZXZlciB0aGF0IGhhcHBlbnMuLi5cbiAgICB0aGlzLnZtLiRvbignaG9vazphdHRhY2hlZCcsIHRoaXMuZm9yY2VVcGRhdGUpO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKHZhbHVlKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgdmFyIG11bHRpID0gdGhpcy5tdWx0aXBsZSAmJiBpc0FycmF5KHZhbHVlKTtcbiAgICB2YXIgb3B0aW9ucyA9IGVsLm9wdGlvbnM7XG4gICAgdmFyIGkgPSBvcHRpb25zLmxlbmd0aDtcbiAgICB2YXIgb3AsIHZhbDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBvcCA9IG9wdGlvbnNbaV07XG4gICAgICB2YWwgPSBvcC5oYXNPd25Qcm9wZXJ0eSgnX3ZhbHVlJykgPyBvcC5fdmFsdWUgOiBvcC52YWx1ZTtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuICAgICAgb3Auc2VsZWN0ZWQgPSBtdWx0aSA/IGluZGV4T2YkMSh2YWx1ZSwgdmFsKSA+IC0xIDogbG9vc2VFcXVhbCh2YWx1ZSwgdmFsKTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgdGhpcy52bS4kb2ZmKCdob29rOmF0dGFjaGVkJywgdGhpcy5mb3JjZVVwZGF0ZSk7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IHNlbGVjdCB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7U2VsZWN0RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbXVsdGlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdFxuICogQHJldHVybiB7QXJyYXl8Kn1cbiAqL1xuXG5mdW5jdGlvbiBnZXRWYWx1ZShlbCwgbXVsdGksIGluaXQpIHtcbiAgdmFyIHJlcyA9IG11bHRpID8gW10gOiBudWxsO1xuICB2YXIgb3AsIHZhbCwgc2VsZWN0ZWQ7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gZWwub3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBvcCA9IGVsLm9wdGlvbnNbaV07XG4gICAgc2VsZWN0ZWQgPSBpbml0ID8gb3AuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpIDogb3Auc2VsZWN0ZWQ7XG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICB2YWwgPSBvcC5oYXNPd25Qcm9wZXJ0eSgnX3ZhbHVlJykgPyBvcC5fdmFsdWUgOiBvcC52YWx1ZTtcbiAgICAgIGlmIChtdWx0aSkge1xuICAgICAgICByZXMucHVzaCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBOYXRpdmUgQXJyYXkuaW5kZXhPZiB1c2VzIHN0cmljdCBlcXVhbCwgYnV0IGluIHRoaXNcbiAqIGNhc2Ugd2UgbmVlZCB0byBtYXRjaCBzdHJpbmcvbnVtYmVycyB3aXRoIGN1c3RvbSBlcXVhbC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZnVuY3Rpb24gaW5kZXhPZiQxKGFyciwgdmFsKSB7XG4gIHZhciBpID0gYXJyLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChsb29zZUVxdWFsKGFycltpXSwgdmFsKSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxudmFyIGNoZWNrYm94ID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG5cbiAgICB0aGlzLmdldFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGVsLmhhc093blByb3BlcnR5KCdfdmFsdWUnKSA/IGVsLl92YWx1ZSA6IHNlbGYucGFyYW1zLm51bWJlciA/IHRvTnVtYmVyKGVsLnZhbHVlKSA6IGVsLnZhbHVlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRCb29sZWFuVmFsdWUoKSB7XG4gICAgICB2YXIgdmFsID0gZWwuY2hlY2tlZDtcbiAgICAgIGlmICh2YWwgJiYgZWwuaGFzT3duUHJvcGVydHkoJ190cnVlVmFsdWUnKSkge1xuICAgICAgICByZXR1cm4gZWwuX3RydWVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghdmFsICYmIGVsLmhhc093blByb3BlcnR5KCdfZmFsc2VWYWx1ZScpKSB7XG4gICAgICAgIHJldHVybiBlbC5fZmFsc2VWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBtb2RlbCA9IHNlbGYuX3dhdGNoZXIudmFsdWU7XG4gICAgICBpZiAoaXNBcnJheShtb2RlbCkpIHtcbiAgICAgICAgdmFyIHZhbCA9IHNlbGYuZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYgKGVsLmNoZWNrZWQpIHtcbiAgICAgICAgICBpZiAoaW5kZXhPZihtb2RlbCwgdmFsKSA8IDApIHtcbiAgICAgICAgICAgIG1vZGVsLnB1c2godmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9kZWwuJHJlbW92ZSh2YWwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNldChnZXRCb29sZWFuVmFsdWUoKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub24oJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpO1xuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2NoZWNrZWQnKSkge1xuICAgICAgdGhpcy5hZnRlckJpbmQgPSB0aGlzLmxpc3RlbmVyO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSh2YWx1ZSkge1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBlbC5jaGVja2VkID0gaW5kZXhPZih2YWx1ZSwgdGhpcy5nZXRWYWx1ZSgpKSA+IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWwuaGFzT3duUHJvcGVydHkoJ190cnVlVmFsdWUnKSkge1xuICAgICAgICBlbC5jaGVja2VkID0gbG9vc2VFcXVhbCh2YWx1ZSwgZWwuX3RydWVWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gISF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBoYW5kbGVycyA9IHtcbiAgdGV4dDogdGV4dCQyLFxuICByYWRpbzogcmFkaW8sXG4gIHNlbGVjdDogc2VsZWN0LFxuICBjaGVja2JveDogY2hlY2tib3hcbn07XG5cbnZhciBtb2RlbCA9IHtcblxuICBwcmlvcml0eTogTU9ERUwsXG4gIHR3b1dheTogdHJ1ZSxcbiAgaGFuZGxlcnM6IGhhbmRsZXJzLFxuICBwYXJhbXM6IFsnbGF6eScsICdudW1iZXInLCAnZGVib3VuY2UnXSxcblxuICAvKipcbiAgICogUG9zc2libGUgZWxlbWVudHM6XG4gICAqICAgPHNlbGVjdD5cbiAgICogICA8dGV4dGFyZWE+XG4gICAqICAgPGlucHV0IHR5cGU9XCIqXCI+XG4gICAqICAgICAtIHRleHRcbiAgICogICAgIC0gY2hlY2tib3hcbiAgICogICAgIC0gcmFkaW9cbiAgICogICAgIC0gbnVtYmVyXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgLy8gZnJpZW5kbHkgd2FybmluZy4uLlxuICAgIHRoaXMuY2hlY2tGaWx0ZXJzKCk7XG4gICAgaWYgKHRoaXMuaGFzUmVhZCAmJiAhdGhpcy5oYXNXcml0ZSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKCdJdCBzZWVtcyB5b3UgYXJlIHVzaW5nIGEgcmVhZC1vbmx5IGZpbHRlciB3aXRoICcgKyAndi1tb2RlbC4gWW91IG1pZ2h0IHdhbnQgdG8gdXNlIGEgdHdvLXdheSBmaWx0ZXIgJyArICd0byBlbnN1cmUgY29ycmVjdCBiZWhhdmlvci4nKTtcbiAgICB9XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICB2YXIgdGFnID0gZWwudGFnTmFtZTtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAodGFnID09PSAnSU5QVVQnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnNbZWwudHlwZV0gfHwgaGFuZGxlcnMudGV4dDtcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVycy5zZWxlY3Q7XG4gICAgfSBlbHNlIGlmICh0YWcgPT09ICdURVhUQVJFQScpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVycy50ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ3YtbW9kZWwgZG9lcyBub3Qgc3VwcG9ydCBlbGVtZW50IHR5cGU6ICcgKyB0YWcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbC5fX3ZfbW9kZWwgPSB0aGlzO1xuICAgIGhhbmRsZXIuYmluZC5jYWxsKHRoaXMpO1xuICAgIHRoaXMudXBkYXRlID0gaGFuZGxlci51cGRhdGU7XG4gICAgdGhpcy5fdW5iaW5kID0gaGFuZGxlci51bmJpbmQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIHJlYWQvd3JpdGUgZmlsdGVyIHN0YXRzLlxuICAgKi9cblxuICBjaGVja0ZpbHRlcnM6IGZ1bmN0aW9uIGNoZWNrRmlsdGVycygpIHtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVycztcbiAgICBpZiAoIWZpbHRlcnMpIHJldHVybjtcbiAgICB2YXIgaSA9IGZpbHRlcnMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciBmaWx0ZXIgPSByZXNvbHZlQXNzZXQodGhpcy52bS4kb3B0aW9ucywgJ2ZpbHRlcnMnLCBmaWx0ZXJzW2ldLm5hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicgfHwgZmlsdGVyLnJlYWQpIHtcbiAgICAgICAgdGhpcy5oYXNSZWFkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXIud3JpdGUpIHtcbiAgICAgICAgdGhpcy5oYXNXcml0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKCkge1xuICAgIHRoaXMuZWwuX192X21vZGVsID0gbnVsbDtcbiAgICB0aGlzLl91bmJpbmQgJiYgdGhpcy5fdW5iaW5kKCk7XG4gIH1cbn07XG5cbi8vIGtleUNvZGUgYWxpYXNlc1xudmFyIGtleUNvZGVzID0ge1xuICBlc2M6IDI3LFxuICB0YWI6IDksXG4gIGVudGVyOiAxMyxcbiAgc3BhY2U6IDMyLFxuICAnZGVsZXRlJzogWzgsIDQ2XSxcbiAgdXA6IDM4LFxuICBsZWZ0OiAzNyxcbiAgcmlnaHQ6IDM5LFxuICBkb3duOiA0MFxufTtcblxuZnVuY3Rpb24ga2V5RmlsdGVyKGhhbmRsZXIsIGtleXMpIHtcbiAgdmFyIGNvZGVzID0ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBjaGFyQ29kZSA9IGtleS5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjaGFyQ29kZSA+IDQ3ICYmIGNoYXJDb2RlIDwgNTgpIHtcbiAgICAgIHJldHVybiBwYXJzZUludChrZXksIDEwKTtcbiAgICB9XG4gICAgaWYgKGtleS5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNoYXJDb2RlID0ga2V5LnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgICAgIGlmIChjaGFyQ29kZSA+IDY0ICYmIGNoYXJDb2RlIDwgOTEpIHtcbiAgICAgICAgcmV0dXJuIGNoYXJDb2RlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5Q29kZXNba2V5XTtcbiAgfSk7XG4gIGNvZGVzID0gW10uY29uY2F0LmFwcGx5KFtdLCBjb2Rlcyk7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlIYW5kbGVyKGUpIHtcbiAgICBpZiAoY29kZXMuaW5kZXhPZihlLmtleUNvZGUpID4gLTEpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBzdG9wRmlsdGVyKGhhbmRsZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHN0b3BIYW5kbGVyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByZXZlbnRGaWx0ZXIoaGFuZGxlcikge1xuICByZXR1cm4gZnVuY3Rpb24gcHJldmVudEhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gaGFuZGxlci5jYWxsKHRoaXMsIGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZWxmRmlsdGVyKGhhbmRsZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHNlbGZIYW5kbGVyKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbCh0aGlzLCBlKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBvbiQxID0ge1xuXG4gIHByaW9yaXR5OiBPTixcbiAgYWNjZXB0U3RhdGVtZW50OiB0cnVlLFxuICBrZXlDb2Rlczoga2V5Q29kZXMsXG5cbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICAvLyBkZWFsIHdpdGggaWZyYW1lc1xuICAgIGlmICh0aGlzLmVsLnRhZ05hbWUgPT09ICdJRlJBTUUnICYmIHRoaXMuYXJnICE9PSAnbG9hZCcpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuaWZyYW1lQmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb24oc2VsZi5lbC5jb250ZW50V2luZG93LCBzZWxmLmFyZywgc2VsZi5oYW5kbGVyLCBzZWxmLm1vZGlmaWVycy5jYXB0dXJlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLm9uKCdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKTtcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoaGFuZGxlcikge1xuICAgIC8vIHN0dWIgYSBub29wIGZvciB2LW9uIHdpdGggbm8gdmFsdWUsXG4gICAgLy8gZS5nLiBAbW91c2Vkb3duLnByZXZlbnRcbiAgICBpZiAoIXRoaXMuZGVzY3JpcHRvci5yYXcpIHtcbiAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2Fybigndi1vbjonICsgdGhpcy5hcmcgKyAnPVwiJyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiBleHBlY3RzIGEgZnVuY3Rpb24gdmFsdWUsICcgKyAnZ290ICcgKyBoYW5kbGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBtb2RpZmllcnNcbiAgICBpZiAodGhpcy5tb2RpZmllcnMuc3RvcCkge1xuICAgICAgaGFuZGxlciA9IHN0b3BGaWx0ZXIoaGFuZGxlcik7XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZGlmaWVycy5wcmV2ZW50KSB7XG4gICAgICBoYW5kbGVyID0gcHJldmVudEZpbHRlcihoYW5kbGVyKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kaWZpZXJzLnNlbGYpIHtcbiAgICAgIGhhbmRsZXIgPSBzZWxmRmlsdGVyKGhhbmRsZXIpO1xuICAgIH1cbiAgICAvLyBrZXkgZmlsdGVyXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLm1vZGlmaWVycykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBrZXkgIT09ICdzdG9wJyAmJiBrZXkgIT09ICdwcmV2ZW50JyAmJiBrZXkgIT09ICdzZWxmJztcbiAgICB9KTtcbiAgICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICAgIGhhbmRsZXIgPSBrZXlGaWx0ZXIoaGFuZGxlciwga2V5cyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG5cbiAgICBpZiAodGhpcy5pZnJhbWVCaW5kKSB7XG4gICAgICB0aGlzLmlmcmFtZUJpbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb24odGhpcy5lbCwgdGhpcy5hcmcsIHRoaXMuaGFuZGxlciwgdGhpcy5tb2RpZmllcnMuY2FwdHVyZSk7XG4gICAgfVxuICB9LFxuXG4gIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmlmcmFtZUJpbmQgPyB0aGlzLmVsLmNvbnRlbnRXaW5kb3cgOiB0aGlzLmVsO1xuICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgIG9mZihlbCwgdGhpcy5hcmcsIHRoaXMuaGFuZGxlcik7XG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxufTtcblxudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICctbXMtJ107XG52YXIgY2FtZWxQcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcyddO1xudmFyIGltcG9ydGFudFJFID0gLyFpbXBvcnRhbnQ7PyQvO1xudmFyIHByb3BDYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbnZhciB0ZXN0RWwgPSBudWxsO1xuXG52YXIgc3R5bGUgPSB7XG5cbiAgZGVlcDogdHJ1ZSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVsLnN0eWxlLmNzc1RleHQgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLmhhbmRsZU9iamVjdCh2YWx1ZS5yZWR1Y2UoZXh0ZW5kLCB7fSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZU9iamVjdCh2YWx1ZSB8fCB7fSk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZU9iamVjdDogZnVuY3Rpb24gaGFuZGxlT2JqZWN0KHZhbHVlKSB7XG4gICAgLy8gY2FjaGUgb2JqZWN0IHN0eWxlcyBzbyB0aGF0IG9ubHkgY2hhbmdlZCBwcm9wc1xuICAgIC8vIGFyZSBhY3R1YWxseSB1cGRhdGVkLlxuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGUgfHwgKHRoaXMuY2FjaGUgPSB7fSk7XG4gICAgdmFyIG5hbWUsIHZhbDtcbiAgICBmb3IgKG5hbWUgaW4gY2FjaGUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gdmFsdWUpKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlU2luZ2xlKG5hbWUsIG51bGwpO1xuICAgICAgICBkZWxldGUgY2FjaGVbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobmFtZSBpbiB2YWx1ZSkge1xuICAgICAgdmFsID0gdmFsdWVbbmFtZV07XG4gICAgICBpZiAodmFsICE9PSBjYWNoZVtuYW1lXSkge1xuICAgICAgICBjYWNoZVtuYW1lXSA9IHZhbDtcbiAgICAgICAgdGhpcy5oYW5kbGVTaW5nbGUobmFtZSwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlU2luZ2xlOiBmdW5jdGlvbiBoYW5kbGVTaW5nbGUocHJvcCwgdmFsdWUpIHtcbiAgICBwcm9wID0gbm9ybWFsaXplKHByb3ApO1xuICAgIGlmICghcHJvcCkgcmV0dXJuOyAvLyB1bnN1cHBvcnRlZCBwcm9wXG4gICAgLy8gY2FzdCBwb3NzaWJsZSBudW1iZXJzL2Jvb2xlYW5zIGludG8gc3RyaW5nc1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB2YWx1ZSArPSAnJztcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHZhciBpc0ltcG9ydGFudCA9IGltcG9ydGFudFJFLnRlc3QodmFsdWUpID8gJ2ltcG9ydGFudCcgOiAnJztcbiAgICAgIGlmIChpc0ltcG9ydGFudCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoaW1wb3J0YW50UkUsICcnKS50cmltKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcCk7XG4gICAgfVxuICB9XG5cbn07XG5cbi8qKlxuICogTm9ybWFsaXplIGEgQ1NTIHByb3BlcnR5IG5hbWUuXG4gKiAtIGNhY2hlIHJlc3VsdFxuICogLSBhdXRvIHByZWZpeFxuICogLSBjYW1lbENhc2UgLT4gZGFzaC1jYXNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemUocHJvcCkge1xuICBpZiAocHJvcENhY2hlW3Byb3BdKSB7XG4gICAgcmV0dXJuIHByb3BDYWNoZVtwcm9wXTtcbiAgfVxuICB2YXIgcmVzID0gcHJlZml4KHByb3ApO1xuICBwcm9wQ2FjaGVbcHJvcF0gPSBwcm9wQ2FjaGVbcmVzXSA9IHJlcztcbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBBdXRvIGRldGVjdCB0aGUgYXBwcm9wcmlhdGUgcHJlZml4IGZvciBhIENTUyBwcm9wZXJ0eS5cbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81MjM2OTJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHByZWZpeChwcm9wKSB7XG4gIHByb3AgPSBoeXBoZW5hdGUocHJvcCk7XG4gIHZhciBjYW1lbCA9IGNhbWVsaXplKHByb3ApO1xuICB2YXIgdXBwZXIgPSBjYW1lbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhbWVsLnNsaWNlKDEpO1xuICBpZiAoIXRlc3RFbCkge1xuICAgIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB9XG4gIHZhciBpID0gcHJlZml4ZXMubGVuZ3RoO1xuICB2YXIgcHJlZml4ZWQ7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBwcmVmaXhlZCA9IGNhbWVsUHJlZml4ZXNbaV0gKyB1cHBlcjtcbiAgICBpZiAocHJlZml4ZWQgaW4gdGVzdEVsLnN0eWxlKSB7XG4gICAgICByZXR1cm4gcHJlZml4ZXNbaV0gKyBwcm9wO1xuICAgIH1cbiAgfVxuICBpZiAoY2FtZWwgaW4gdGVzdEVsLnN0eWxlKSB7XG4gICAgcmV0dXJuIHByb3A7XG4gIH1cbn1cblxuLy8geGxpbmtcbnZhciB4bGlua05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xudmFyIHhsaW5rUkUgPSAvXnhsaW5rOi87XG5cbi8vIGNoZWNrIGZvciBhdHRyaWJ1dGVzIHRoYXQgcHJvaGliaXQgaW50ZXJwb2xhdGlvbnNcbnZhciBkaXNhbGxvd2VkSW50ZXJwQXR0clJFID0gL152LXxeOnxeQHxeKD86aXN8dHJhbnNpdGlvbnx0cmFuc2l0aW9uLW1vZGV8ZGVib3VuY2V8dHJhY2stYnl8c3RhZ2dlcnxlbnRlci1zdGFnZ2VyfGxlYXZlLXN0YWdnZXIpJC87XG4vLyB0aGVzZSBhdHRyaWJ1dGVzIHNob3VsZCBhbHNvIHNldCB0aGVpciBjb3JyZXNwb25kaW5nIHByb3BlcnRpZXNcbi8vIGJlY2F1c2UgdGhleSBvbmx5IGFmZmVjdCB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgZWxlbWVudFxudmFyIGF0dHJXaXRoUHJvcHNSRSA9IC9eKD86dmFsdWV8Y2hlY2tlZHxzZWxlY3RlZHxtdXRlZCkkLztcbi8vIHRoZXNlIGF0dHJpYnV0ZXMgZXhwZWN0IGVudW1yYXRlZCB2YWx1ZXMgb2YgXCJ0cnVlXCIgb3IgXCJmYWxzZVwiXG4vLyBidXQgYXJlIG5vdCBib29sZWFuIGF0dHJpYnV0ZXNcbnZhciBlbnVtZXJhdGVkQXR0clJFID0gL14oPzpkcmFnZ2FibGV8Y29udGVudGVkaXRhYmxlfHNwZWxsY2hlY2spJC87XG5cbi8vIHRoZXNlIGF0dHJpYnV0ZXMgc2hvdWxkIHNldCBhIGhpZGRlbiBwcm9wZXJ0eSBmb3Jcbi8vIGJpbmRpbmcgdi1tb2RlbCB0byBvYmplY3QgdmFsdWVzXG52YXIgbW9kZWxQcm9wcyA9IHtcbiAgdmFsdWU6ICdfdmFsdWUnLFxuICAndHJ1ZS12YWx1ZSc6ICdfdHJ1ZVZhbHVlJyxcbiAgJ2ZhbHNlLXZhbHVlJzogJ19mYWxzZVZhbHVlJ1xufTtcblxudmFyIGJpbmQkMSA9IHtcblxuICBwcmlvcml0eTogQklORCxcblxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgIHZhciBhdHRyID0gdGhpcy5hcmc7XG4gICAgdmFyIHRhZyA9IHRoaXMuZWwudGFnTmFtZTtcbiAgICAvLyBzaG91bGQgYmUgZGVlcCB3YXRjaCBvbiBvYmplY3QgbW9kZVxuICAgIGlmICghYXR0cikge1xuICAgICAgdGhpcy5kZWVwID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gaGFuZGxlIGludGVycG9sYXRpb24gYmluZGluZ3NcbiAgICB2YXIgZGVzY3JpcHRvciA9IHRoaXMuZGVzY3JpcHRvcjtcbiAgICB2YXIgdG9rZW5zID0gZGVzY3JpcHRvci5pbnRlcnA7XG4gICAgaWYgKHRva2Vucykge1xuICAgICAgLy8gaGFuZGxlIGludGVycG9sYXRpb25zIHdpdGggb25lLXRpbWUgdG9rZW5zXG4gICAgICBpZiAoZGVzY3JpcHRvci5oYXNPbmVUaW1lKSB7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRva2Vuc1RvRXhwKHRva2VucywgdGhpcy5fc2NvcGUgfHwgdGhpcy52bSk7XG4gICAgICB9XG5cbiAgICAgIC8vIG9ubHkgYWxsb3cgYmluZGluZyBvbiBuYXRpdmUgYXR0cmlidXRlc1xuICAgICAgaWYgKGRpc2FsbG93ZWRJbnRlcnBBdHRyUkUudGVzdChhdHRyKSB8fCBhdHRyID09PSAnbmFtZScgJiYgKHRhZyA9PT0gJ1BBUlRJQUwnIHx8IHRhZyA9PT0gJ1NMT1QnKSkge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oYXR0ciArICc9XCInICsgZGVzY3JpcHRvci5yYXcgKyAnXCI6ICcgKyAnYXR0cmlidXRlIGludGVycG9sYXRpb24gaXMgbm90IGFsbG93ZWQgaW4gVnVlLmpzICcgKyAnZGlyZWN0aXZlcyBhbmQgc3BlY2lhbCBhdHRyaWJ1dGVzLicpO1xuICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgdGhpcy5pbnZhbGlkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIgcmF3ID0gYXR0ciArICc9XCInICsgZGVzY3JpcHRvci5yYXcgKyAnXCI6ICc7XG4gICAgICAgIC8vIHdhcm4gc3JjXG4gICAgICAgIGlmIChhdHRyID09PSAnc3JjJykge1xuICAgICAgICAgIHdhcm4ocmF3ICsgJ2ludGVycG9sYXRpb24gaW4gXCJzcmNcIiBhdHRyaWJ1dGUgd2lsbCBjYXVzZSAnICsgJ2EgNDA0IHJlcXVlc3QuIFVzZSB2LWJpbmQ6c3JjIGluc3RlYWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3YXJuIHN0eWxlXG4gICAgICAgIGlmIChhdHRyID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgd2FybihyYXcgKyAnaW50ZXJwb2xhdGlvbiBpbiBcInN0eWxlXCIgYXR0cmlidXRlIHdpbGwgY2F1c2UgJyArICd0aGUgYXR0cmlidXRlIHRvIGJlIGRpc2NhcmRlZCBpbiBJbnRlcm5ldCBFeHBsb3Jlci4gJyArICdVc2Ugdi1iaW5kOnN0eWxlIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUodmFsdWUpIHtcbiAgICBpZiAodGhpcy5pbnZhbGlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBhdHRyID0gdGhpcy5hcmc7XG4gICAgaWYgKHRoaXMuYXJnKSB7XG4gICAgICB0aGlzLmhhbmRsZVNpbmdsZShhdHRyLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlT2JqZWN0KHZhbHVlIHx8IHt9KTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gc2hhcmUgb2JqZWN0IGhhbmRsZXIgd2l0aCB2LWJpbmQ6Y2xhc3NcbiAgaGFuZGxlT2JqZWN0OiBzdHlsZS5oYW5kbGVPYmplY3QsXG5cbiAgaGFuZGxlU2luZ2xlOiBmdW5jdGlvbiBoYW5kbGVTaW5nbGUoYXR0ciwgdmFsdWUpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIHZhciBpbnRlcnAgPSB0aGlzLmRlc2NyaXB0b3IuaW50ZXJwO1xuICAgIGlmICh0aGlzLm1vZGlmaWVycy5jYW1lbCkge1xuICAgICAgYXR0ciA9IGNhbWVsaXplKGF0dHIpO1xuICAgIH1cbiAgICBpZiAoIWludGVycCAmJiBhdHRyV2l0aFByb3BzUkUudGVzdChhdHRyKSAmJiBhdHRyIGluIGVsKSB7XG4gICAgICBlbFthdHRyXSA9IGF0dHIgPT09ICd2YWx1ZScgPyB2YWx1ZSA9PSBudWxsIC8vIElFOSB3aWxsIHNldCBpbnB1dC52YWx1ZSB0byBcIm51bGxcIiBmb3IgbnVsbC4uLlxuICAgICAgPyAnJyA6IHZhbHVlIDogdmFsdWU7XG4gICAgfVxuICAgIC8vIHNldCBtb2RlbCBwcm9wc1xuICAgIHZhciBtb2RlbFByb3AgPSBtb2RlbFByb3BzW2F0dHJdO1xuICAgIGlmICghaW50ZXJwICYmIG1vZGVsUHJvcCkge1xuICAgICAgZWxbbW9kZWxQcm9wXSA9IHZhbHVlO1xuICAgICAgLy8gdXBkYXRlIHYtbW9kZWwgaWYgcHJlc2VudFxuICAgICAgdmFyIG1vZGVsID0gZWwuX192X21vZGVsO1xuICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLmxpc3RlbmVyKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRvIG5vdCBzZXQgdmFsdWUgYXR0cmlidXRlIGZvciB0ZXh0YXJlYVxuICAgIGlmIChhdHRyID09PSAndmFsdWUnICYmIGVsLnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gdXBkYXRlIGF0dHJpYnV0ZVxuICAgIGlmIChlbnVtZXJhdGVkQXR0clJFLnRlc3QoYXR0cikpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSA/ICd0cnVlJyA6ICdmYWxzZScpO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChhdHRyID09PSAnY2xhc3MnKSB7XG4gICAgICAgIC8vIGhhbmRsZSBlZGdlIGNhc2UgIzE5NjA6XG4gICAgICAgIC8vIGNsYXNzIGludGVycG9sYXRpb24gc2hvdWxkIG5vdCBvdmVyd3JpdGUgVnVlIHRyYW5zaXRpb24gY2xhc3NcbiAgICAgICAgaWYgKGVsLl9fdl90cmFucykge1xuICAgICAgICAgIHZhbHVlICs9ICcgJyArIGVsLl9fdl90cmFucy5pZCArICctdHJhbnNpdGlvbic7XG4gICAgICAgIH1cbiAgICAgICAgc2V0Q2xhc3MoZWwsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoeGxpbmtSRS50ZXN0KGF0dHIpKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rTlMsIGF0dHIsIHZhbHVlID09PSB0cnVlID8gJycgOiB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUgPT09IHRydWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgIH1cbiAgfVxufTtcblxudmFyIGVsID0ge1xuXG4gIHByaW9yaXR5OiBFTCxcblxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5hcmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGlkID0gdGhpcy5pZCA9IGNhbWVsaXplKHRoaXMuYXJnKTtcbiAgICB2YXIgcmVmcyA9ICh0aGlzLl9zY29wZSB8fCB0aGlzLnZtKS4kZWxzO1xuICAgIGlmIChoYXNPd24ocmVmcywgaWQpKSB7XG4gICAgICByZWZzW2lkXSA9IHRoaXMuZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmluZVJlYWN0aXZlKHJlZnMsIGlkLCB0aGlzLmVsKTtcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgdmFyIHJlZnMgPSAodGhpcy5fc2NvcGUgfHwgdGhpcy52bSkuJGVscztcbiAgICBpZiAocmVmc1t0aGlzLmlkXSA9PT0gdGhpcy5lbCkge1xuICAgICAgcmVmc1t0aGlzLmlkXSA9IG51bGw7XG4gICAgfVxuICB9XG59O1xuXG52YXIgcmVmID0ge1xuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2Fybigndi1yZWY6JyArIHRoaXMuYXJnICsgJyBtdXN0IGJlIHVzZWQgb24gYSBjaGlsZCAnICsgJ2NvbXBvbmVudC4gRm91bmQgb24gPCcgKyB0aGlzLmVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSArICc+LicpO1xuICB9XG59O1xuXG52YXIgY2xvYWsgPSB7XG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICB0aGlzLnZtLiRvbmNlKCdwcmUtaG9vazpjb21waWxlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgndi1jbG9haycpO1xuICAgIH0pO1xuICB9XG59O1xuXG4vLyBtdXN0IGV4cG9ydCBwbGFpbiBvYmplY3RcbnZhciBkaXJlY3RpdmVzID0ge1xuICB0ZXh0OiB0ZXh0JDEsXG4gIGh0bWw6IGh0bWwsXG4gICdmb3InOiB2Rm9yLFxuICAnaWYnOiB2SWYsXG4gIHNob3c6IHNob3csXG4gIG1vZGVsOiBtb2RlbCxcbiAgb246IG9uJDEsXG4gIGJpbmQ6IGJpbmQkMSxcbiAgZWw6IGVsLFxuICByZWY6IHJlZixcbiAgY2xvYWs6IGNsb2FrXG59O1xuXG52YXIgdkNsYXNzID0ge1xuXG4gIGRlZXA6IHRydWUsXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5oYW5kbGVPYmplY3Qoc3RyaW5nVG9PYmplY3QodmFsdWUpKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XG4gICAgICB0aGlzLmhhbmRsZU9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5oYW5kbGVBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xlYW51cCgpO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVPYmplY3Q6IGZ1bmN0aW9uIGhhbmRsZU9iamVjdCh2YWx1ZSkge1xuICAgIHRoaXMuY2xlYW51cCh2YWx1ZSk7XG4gICAgdGhpcy5wcmV2S2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgICBzZXRPYmplY3RDbGFzc2VzKHRoaXMuZWwsIHZhbHVlKTtcbiAgfSxcblxuICBoYW5kbGVBcnJheTogZnVuY3Rpb24gaGFuZGxlQXJyYXkodmFsdWUpIHtcbiAgICB0aGlzLmNsZWFudXAodmFsdWUpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgdmFsID0gdmFsdWVbaV07XG4gICAgICBpZiAodmFsICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgICBzZXRPYmplY3RDbGFzc2VzKHRoaXMuZWwsIHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgICAgICBhZGRDbGFzcyh0aGlzLmVsLCB2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnByZXZLZXlzID0gdmFsdWUuc2xpY2UoKTtcbiAgfSxcblxuICBjbGVhbnVwOiBmdW5jdGlvbiBjbGVhbnVwKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMucHJldktleXMpIHtcbiAgICAgIHZhciBpID0gdGhpcy5wcmV2S2V5cy5sZW5ndGg7XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLnByZXZLZXlzW2ldO1xuICAgICAgICBpZiAoIWtleSkgY29udGludWU7XG4gICAgICAgIGlmIChpc1BsYWluT2JqZWN0KGtleSkpIHtcbiAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGtleSk7XG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICByZW1vdmVDbGFzcyh0aGlzLmVsLCBrZXlzW2tdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwga2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0T2JqZWN0Q2xhc3NlcyhlbCwgb2JqKSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmIChvYmpba2V5XSkge1xuICAgICAgYWRkQ2xhc3MoZWwsIGtleSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0cmluZ1RvT2JqZWN0KHZhbHVlKSB7XG4gIHZhciByZXMgPSB7fTtcbiAgdmFyIGtleXMgPSB2YWx1ZS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHJlc1trZXlzW2ldXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIGNvbXBvbmVudCA9IHtcblxuICBwcmlvcml0eTogQ09NUE9ORU5ULFxuXG4gIHBhcmFtczogWydrZWVwLWFsaXZlJywgJ3RyYW5zaXRpb24tbW9kZScsICdpbmxpbmUtdGVtcGxhdGUnXSxcblxuICAvKipcbiAgICogU2V0dXAuIFR3byBwb3NzaWJsZSB1c2FnZXM6XG4gICAqXG4gICAqIC0gc3RhdGljOlxuICAgKiAgIDxjb21wPiBvciA8ZGl2IHYtY29tcG9uZW50PVwiY29tcFwiPlxuICAgKlxuICAgKiAtIGR5bmFtaWM6XG4gICAqICAgPGNvbXBvbmVudCA6aXM9XCJ2aWV3XCI+XG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgaWYgKCF0aGlzLmVsLl9fdnVlX18pIHtcbiAgICAgIC8vIGtlZXAtYWxpdmUgY2FjaGVcbiAgICAgIHRoaXMua2VlcEFsaXZlID0gdGhpcy5wYXJhbXMua2VlcEFsaXZlO1xuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIGlubGluZS10ZW1wbGF0ZVxuICAgICAgaWYgKHRoaXMucGFyYW1zLmlubGluZVRlbXBsYXRlKSB7XG4gICAgICAgIC8vIGV4dHJhY3QgaW5saW5lIHRlbXBsYXRlIGFzIGEgRG9jdW1lbnRGcmFnbWVudFxuICAgICAgICB0aGlzLmlubGluZVRlbXBsYXRlID0gZXh0cmFjdENvbnRlbnQodGhpcy5lbCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICAvLyBjb21wb25lbnQgcmVzb2x1dGlvbiByZWxhdGVkIHN0YXRlXG4gICAgICB0aGlzLnBlbmRpbmdDb21wb25lbnRDYiA9IHRoaXMuQ29tcG9uZW50ID0gbnVsbDtcbiAgICAgIC8vIHRyYW5zaXRpb24gcmVsYXRlZCBzdGF0ZVxuICAgICAgdGhpcy5wZW5kaW5nUmVtb3ZhbHMgPSAwO1xuICAgICAgdGhpcy5wZW5kaW5nUmVtb3ZhbENiID0gbnVsbDtcbiAgICAgIC8vIGNyZWF0ZSBhIHJlZiBhbmNob3JcbiAgICAgIHRoaXMuYW5jaG9yID0gY3JlYXRlQW5jaG9yKCd2LWNvbXBvbmVudCcpO1xuICAgICAgcmVwbGFjZSh0aGlzLmVsLCB0aGlzLmFuY2hvcik7XG4gICAgICAvLyByZW1vdmUgaXMgYXR0cmlidXRlLlxuICAgICAgLy8gdGhpcyBpcyByZW1vdmVkIGR1cmluZyBjb21waWxhdGlvbiwgYnV0IGJlY2F1c2UgY29tcGlsYXRpb24gaXNcbiAgICAgIC8vIGNhY2hlZCwgd2hlbiB0aGUgY29tcG9uZW50IGlzIHVzZWQgZWxzZXdoZXJlIHRoaXMgYXR0cmlidXRlXG4gICAgICAvLyB3aWxsIHJlbWFpbiBhdCBsaW5rIHRpbWUuXG4gICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSgnaXMnKTtcbiAgICAgIC8vIHJlbW92ZSByZWYsIHNhbWUgYXMgYWJvdmVcbiAgICAgIGlmICh0aGlzLmRlc2NyaXB0b3IucmVmKSB7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKCd2LXJlZjonICsgaHlwaGVuYXRlKHRoaXMuZGVzY3JpcHRvci5yZWYpKTtcbiAgICAgIH1cbiAgICAgIC8vIGlmIHN0YXRpYywgYnVpbGQgcmlnaHQgbm93LlxuICAgICAgaWYgKHRoaXMubGl0ZXJhbCkge1xuICAgICAgICB0aGlzLnNldENvbXBvbmVudCh0aGlzLmV4cHJlc3Npb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ2Nhbm5vdCBtb3VudCBjb21wb25lbnQgXCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiICcgKyAnb24gYWxyZWFkeSBtb3VudGVkIGVsZW1lbnQ6ICcgKyB0aGlzLmVsKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFB1YmxpYyB1cGRhdGUsIGNhbGxlZCBieSB0aGUgd2F0Y2hlciBpbiB0aGUgZHluYW1pY1xuICAgKiBsaXRlcmFsIHNjZW5hcmlvLCBlLmcuIDxjb21wb25lbnQgOmlzPVwidmlld1wiPlxuICAgKi9cblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSh2YWx1ZSkge1xuICAgIGlmICghdGhpcy5saXRlcmFsKSB7XG4gICAgICB0aGlzLnNldENvbXBvbmVudCh2YWx1ZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTd2l0Y2ggZHluYW1pYyBjb21wb25lbnRzLiBNYXkgcmVzb2x2ZSB0aGUgY29tcG9uZW50XG4gICAqIGFzeW5jaHJvbm91c2x5LCBhbmQgcGVyZm9ybSB0cmFuc2l0aW9uIGJhc2VkIG9uXG4gICAqIHNwZWNpZmllZCB0cmFuc2l0aW9uIG1vZGUuIEFjY2VwdHMgYSBmZXcgYWRkaXRpb25hbFxuICAgKiBhcmd1bWVudHMgc3BlY2lmaWNhbGx5IGZvciB2dWUtcm91dGVyLlxuICAgKlxuICAgKiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIGZ1bGwgdHJhbnNpdGlvbiBpc1xuICAgKiBmaW5pc2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICovXG5cbiAgc2V0Q29tcG9uZW50OiBmdW5jdGlvbiBzZXRDb21wb25lbnQodmFsdWUsIGNiKSB7XG4gICAgdGhpcy5pbnZhbGlkYXRlUGVuZGluZygpO1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIC8vIGp1c3QgcmVtb3ZlIGN1cnJlbnRcbiAgICAgIHRoaXMudW5idWlsZCh0cnVlKTtcbiAgICAgIHRoaXMucmVtb3ZlKHRoaXMuY2hpbGRWTSwgY2IpO1xuICAgICAgdGhpcy5jaGlsZFZNID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5yZXNvbHZlQ29tcG9uZW50KHZhbHVlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYubW91bnRDb21wb25lbnQoY2IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gdXNlIHdoZW4gY3JlYXRpbmdcbiAgICogdGhlIGNoaWxkIHZtLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdmFsdWVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICovXG5cbiAgcmVzb2x2ZUNvbXBvbmVudDogZnVuY3Rpb24gcmVzb2x2ZUNvbXBvbmVudCh2YWx1ZSwgY2IpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5wZW5kaW5nQ29tcG9uZW50Q2IgPSBjYW5jZWxsYWJsZShmdW5jdGlvbiAoQ29tcG9uZW50KSB7XG4gICAgICBzZWxmLkNvbXBvbmVudE5hbWUgPSBDb21wb25lbnQub3B0aW9ucy5uYW1lIHx8ICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBudWxsKTtcbiAgICAgIHNlbGYuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgICB0aGlzLnZtLl9yZXNvbHZlQ29tcG9uZW50KHZhbHVlLCB0aGlzLnBlbmRpbmdDb21wb25lbnRDYik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSB1c2luZyB0aGUgY3VycmVudCBjb25zdHJ1Y3RvciBhbmRcbiAgICogcmVwbGFjZSB0aGUgZXhpc3RpbmcgaW5zdGFuY2UuIFRoaXMgbWV0aG9kIGRvZXNuJ3QgY2FyZVxuICAgKiB3aGV0aGVyIHRoZSBuZXcgY29tcG9uZW50IGFuZCB0aGUgb2xkIG9uZSBhcmUgYWN0dWFsbHlcbiAgICogdGhlIHNhbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICovXG5cbiAgbW91bnRDb21wb25lbnQ6IGZ1bmN0aW9uIG1vdW50Q29tcG9uZW50KGNiKSB7XG4gICAgLy8gYWN0dWFsIG1vdW50XG4gICAgdGhpcy51bmJ1aWxkKHRydWUpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYWN0aXZhdGVIb29rcyA9IHRoaXMuQ29tcG9uZW50Lm9wdGlvbnMuYWN0aXZhdGU7XG4gICAgdmFyIGNhY2hlZCA9IHRoaXMuZ2V0Q2FjaGVkKCk7XG4gICAgdmFyIG5ld0NvbXBvbmVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICBpZiAoYWN0aXZhdGVIb29rcyAmJiAhY2FjaGVkKSB7XG4gICAgICB0aGlzLndhaXRpbmdGb3IgPSBuZXdDb21wb25lbnQ7XG4gICAgICBjYWxsQWN0aXZhdGVIb29rcyhhY3RpdmF0ZUhvb2tzLCBuZXdDb21wb25lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNlbGYud2FpdGluZ0ZvciAhPT0gbmV3Q29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYud2FpdGluZ0ZvciA9IG51bGw7XG4gICAgICAgIHNlbGYudHJhbnNpdGlvbihuZXdDb21wb25lbnQsIGNiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1cGRhdGUgcmVmIGZvciBrZXB0LWFsaXZlIGNvbXBvbmVudFxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICBuZXdDb21wb25lbnQuX3VwZGF0ZVJlZigpO1xuICAgICAgfVxuICAgICAgdGhpcy50cmFuc2l0aW9uKG5ld0NvbXBvbmVudCwgY2IpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogV2hlbiB0aGUgY29tcG9uZW50IGNoYW5nZXMgb3IgdW5iaW5kcyBiZWZvcmUgYW4gYXN5bmNcbiAgICogY29uc3RydWN0b3IgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG8gaW52YWxpZGF0ZSBpdHNcbiAgICogcGVuZGluZyBjYWxsYmFjay5cbiAgICovXG5cbiAgaW52YWxpZGF0ZVBlbmRpbmc6IGZ1bmN0aW9uIGludmFsaWRhdGVQZW5kaW5nKCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmdDb21wb25lbnRDYikge1xuICAgICAgdGhpcy5wZW5kaW5nQ29tcG9uZW50Q2IuY2FuY2VsKCk7XG4gICAgICB0aGlzLnBlbmRpbmdDb21wb25lbnRDYiA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZS9pbnNlcnQgYSBuZXcgY2hpbGQgdm0uXG4gICAqIElmIGtlZXAgYWxpdmUgYW5kIGhhcyBjYWNoZWQgaW5zdGFuY2UsIGluc2VydCB0aGF0XG4gICAqIGluc3RhbmNlOyBvdGhlcndpc2UgYnVpbGQgYSBuZXcgb25lIGFuZCBjYWNoZSBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtleHRyYU9wdGlvbnNdXG4gICAqIEByZXR1cm4ge1Z1ZX0gLSB0aGUgY3JlYXRlZCBpbnN0YW5jZVxuICAgKi9cblxuICBidWlsZDogZnVuY3Rpb24gYnVpbGQoZXh0cmFPcHRpb25zKSB7XG4gICAgdmFyIGNhY2hlZCA9IHRoaXMuZ2V0Q2FjaGVkKCk7XG4gICAgaWYgKGNhY2hlZCkge1xuICAgICAgcmV0dXJuIGNhY2hlZDtcbiAgICB9XG4gICAgaWYgKHRoaXMuQ29tcG9uZW50KSB7XG4gICAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBuYW1lOiB0aGlzLkNvbXBvbmVudE5hbWUsXG4gICAgICAgIGVsOiBjbG9uZU5vZGUodGhpcy5lbCksXG4gICAgICAgIHRlbXBsYXRlOiB0aGlzLmlubGluZVRlbXBsYXRlLFxuICAgICAgICAvLyBtYWtlIHN1cmUgdG8gYWRkIHRoZSBjaGlsZCB3aXRoIGNvcnJlY3QgcGFyZW50XG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYSB0cmFuc2NsdWRlZCBjb21wb25lbnQsIGl0cyBwYXJlbnRcbiAgICAgICAgLy8gc2hvdWxkIGJlIHRoZSB0cmFuc2NsdXNpb24gaG9zdC5cbiAgICAgICAgcGFyZW50OiB0aGlzLl9ob3N0IHx8IHRoaXMudm0sXG4gICAgICAgIC8vIGlmIG5vIGlubGluZS10ZW1wbGF0ZSwgdGhlbiB0aGUgY29tcGlsZWRcbiAgICAgICAgLy8gbGlua2VyIGNhbiBiZSBjYWNoZWQgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cbiAgICAgICAgX2xpbmtlckNhY2hhYmxlOiAhdGhpcy5pbmxpbmVUZW1wbGF0ZSxcbiAgICAgICAgX3JlZjogdGhpcy5kZXNjcmlwdG9yLnJlZixcbiAgICAgICAgX2FzQ29tcG9uZW50OiB0cnVlLFxuICAgICAgICBfaXNSb3V0ZXJWaWV3OiB0aGlzLl9pc1JvdXRlclZpZXcsXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYSB0cmFuc2NsdWRlZCBjb21wb25lbnQsIGNvbnRleHRcbiAgICAgICAgLy8gd2lsbCBiZSB0aGUgY29tbW9uIHBhcmVudCB2bSBvZiB0aGlzIGluc3RhbmNlXG4gICAgICAgIC8vIGFuZCBpdHMgaG9zdC5cbiAgICAgICAgX2NvbnRleHQ6IHRoaXMudm0sXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgaW5zaWRlIGFuIGlubGluZSB2LWZvciwgdGhlIHNjb3BlXG4gICAgICAgIC8vIHdpbGwgYmUgdGhlIGludGVybWVkaWF0ZSBzY29wZSBjcmVhdGVkIGZvciB0aGlzXG4gICAgICAgIC8vIHJlcGVhdCBmcmFnbWVudC4gdGhpcyBpcyB1c2VkIGZvciBsaW5raW5nIHByb3BzXG4gICAgICAgIC8vIGFuZCBjb250YWluZXIgZGlyZWN0aXZlcy5cbiAgICAgICAgX3Njb3BlOiB0aGlzLl9zY29wZSxcbiAgICAgICAgLy8gcGFzcyBpbiB0aGUgb3duZXIgZnJhZ21lbnQgb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgIC8vIHRoaXMgaXMgbmVjZXNzYXJ5IHNvIHRoYXQgdGhlIGZyYWdtZW50IGNhbiBrZWVwXG4gICAgICAgIC8vIHRyYWNrIG9mIGl0cyBjb250YWluZWQgY29tcG9uZW50cyBpbiBvcmRlciB0b1xuICAgICAgICAvLyBjYWxsIGF0dGFjaC9kZXRhY2ggaG9va3MgZm9yIHRoZW0uXG4gICAgICAgIF9mcmFnOiB0aGlzLl9mcmFnXG4gICAgICB9O1xuICAgICAgLy8gZXh0cmEgb3B0aW9uc1xuICAgICAgLy8gaW4gMS4wLjAgdGhpcyBpcyB1c2VkIGJ5IHZ1ZS1yb3V0ZXIgb25seVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIGV4dGVuZChvcHRpb25zLCBleHRyYU9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdmFyIGNoaWxkID0gbmV3IHRoaXMuQ29tcG9uZW50KG9wdGlvbnMpO1xuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGVbdGhpcy5Db21wb25lbnQuY2lkXSA9IGNoaWxkO1xuICAgICAgfVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0aGlzLmVsLmhhc0F0dHJpYnV0ZSgndHJhbnNpdGlvbicpICYmIGNoaWxkLl9pc0ZyYWdtZW50KSB7XG4gICAgICAgIHdhcm4oJ1RyYW5zaXRpb25zIHdpbGwgbm90IHdvcmsgb24gYSBmcmFnbWVudCBpbnN0YW5jZS4gJyArICdUZW1wbGF0ZTogJyArIGNoaWxkLiRvcHRpb25zLnRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyeSB0byBnZXQgYSBjYWNoZWQgaW5zdGFuY2Ugb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtWdWV8dW5kZWZpbmVkfVxuICAgKi9cblxuICBnZXRDYWNoZWQ6IGZ1bmN0aW9uIGdldENhY2hlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5rZWVwQWxpdmUgJiYgdGhpcy5jYWNoZVt0aGlzLkNvbXBvbmVudC5jaWRdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUZWFyZG93biB0aGUgY3VycmVudCBjaGlsZCwgYnV0IGRlZmVycyBjbGVhbnVwIHNvXG4gICAqIHRoYXQgd2UgY2FuIHNlcGFyYXRlIHRoZSBkZXN0cm95IGFuZCByZW1vdmFsIHN0ZXBzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlZmVyXG4gICAqL1xuXG4gIHVuYnVpbGQ6IGZ1bmN0aW9uIHVuYnVpbGQoZGVmZXIpIHtcbiAgICBpZiAodGhpcy53YWl0aW5nRm9yKSB7XG4gICAgICBpZiAoIXRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMud2FpdGluZ0Zvci4kZGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgdGhpcy53YWl0aW5nRm9yID0gbnVsbDtcbiAgICB9XG4gICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZFZNO1xuICAgIGlmICghY2hpbGQgfHwgdGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAvLyByZW1vdmUgcmVmXG4gICAgICAgIGNoaWxkLl9pbmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGNoaWxkLl91cGRhdGVSZWYodHJ1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHRoZSBzb2xlIHB1cnBvc2Ugb2YgYGRlZmVyQ2xlYW51cGAgaXMgc28gdGhhdCB3ZSBjYW5cbiAgICAvLyBcImRlYWN0aXZhdGVcIiB0aGUgdm0gcmlnaHQgbm93IGFuZCBwZXJmb3JtIERPTSByZW1vdmFsXG4gICAgLy8gbGF0ZXIuXG4gICAgY2hpbGQuJGRlc3Ryb3koZmFsc2UsIGRlZmVyKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGN1cnJlbnQgZGVzdHJveWVkIGNoaWxkIGFuZCBtYW51YWxseSBkb1xuICAgKiB0aGUgY2xlYW51cCBhZnRlciByZW1vdmFsLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICAgKi9cblxuICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShjaGlsZCwgY2IpIHtcbiAgICB2YXIga2VlcEFsaXZlID0gdGhpcy5rZWVwQWxpdmU7XG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICAvLyB3ZSBtYXkgaGF2ZSBhIGNvbXBvbmVudCBzd2l0Y2ggd2hlbiBhIHByZXZpb3VzXG4gICAgICAvLyBjb21wb25lbnQgaXMgc3RpbGwgYmVpbmcgdHJhbnNpdGlvbmVkIG91dC5cbiAgICAgIC8vIHdlIHdhbnQgdG8gdHJpZ2dlciBvbmx5IG9uZSBsYXN0ZXN0IGluc2VydGlvbiBjYlxuICAgICAgLy8gd2hlbiB0aGUgZXhpc3RpbmcgdHJhbnNpdGlvbiBmaW5pc2hlcy4gKCMxMTE5KVxuICAgICAgdGhpcy5wZW5kaW5nUmVtb3ZhbHMrKztcbiAgICAgIHRoaXMucGVuZGluZ1JlbW92YWxDYiA9IGNiO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgY2hpbGQuJHJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucGVuZGluZ1JlbW92YWxzLS07XG4gICAgICAgIGlmICgha2VlcEFsaXZlKSBjaGlsZC5fY2xlYW51cCgpO1xuICAgICAgICBpZiAoIXNlbGYucGVuZGluZ1JlbW92YWxzICYmIHNlbGYucGVuZGluZ1JlbW92YWxDYikge1xuICAgICAgICAgIHNlbGYucGVuZGluZ1JlbW92YWxDYigpO1xuICAgICAgICAgIHNlbGYucGVuZGluZ1JlbW92YWxDYiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoY2IpIHtcbiAgICAgIGNiKCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBY3R1YWxseSBzd2FwIHRoZSBjb21wb25lbnRzLCBkZXBlbmRpbmcgb24gdGhlXG4gICAqIHRyYW5zaXRpb24gbW9kZS4gRGVmYXVsdHMgdG8gc2ltdWx0YW5lb3VzLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICovXG5cbiAgdHJhbnNpdGlvbjogZnVuY3Rpb24gdHJhbnNpdGlvbih0YXJnZXQsIGNiKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5jaGlsZFZNO1xuICAgIC8vIGZvciBkZXZ0b29sIGluc3BlY3Rpb25cbiAgICBpZiAoY3VycmVudCkgY3VycmVudC5faW5hY3RpdmUgPSB0cnVlO1xuICAgIHRhcmdldC5faW5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmNoaWxkVk0gPSB0YXJnZXQ7XG4gICAgc3dpdGNoIChzZWxmLnBhcmFtcy50cmFuc2l0aW9uTW9kZSkge1xuICAgICAgY2FzZSAnaW4tb3V0JzpcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5hbmNob3IsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50LCBjYik7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ291dC1pbic6XG4gICAgICAgIHNlbGYucmVtb3ZlKGN1cnJlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0YXJnZXQuJGJlZm9yZShzZWxmLmFuY2hvciwgY2IpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50KTtcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5hbmNob3IsIGNiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVuYmluZC5cbiAgICovXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgdGhpcy5pbnZhbGlkYXRlUGVuZGluZygpO1xuICAgIC8vIERvIG5vdCBkZWZlciBjbGVhbnVwIHdoZW4gdW5iaW5kaW5nXG4gICAgdGhpcy51bmJ1aWxkKCk7XG4gICAgLy8gZGVzdHJveSBhbGwga2VlcC1hbGl2ZSBjYWNoZWQgaW5zdGFuY2VzXG4gICAgaWYgKHRoaXMuY2FjaGUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmNhY2hlKSB7XG4gICAgICAgIHRoaXMuY2FjaGVba2V5XS4kZGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIENhbGwgYWN0aXZhdGUgaG9va3MgaW4gb3JkZXIgKGFzeW5jaHJvbm91cylcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBob29rc1xuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmZ1bmN0aW9uIGNhbGxBY3RpdmF0ZUhvb2tzKGhvb2tzLCB2bSwgY2IpIHtcbiAgdmFyIHRvdGFsID0gaG9va3MubGVuZ3RoO1xuICB2YXIgY2FsbGVkID0gMDtcbiAgaG9va3NbMF0uY2FsbCh2bSwgbmV4dCk7XG4gIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgaWYgKCsrY2FsbGVkID49IHRvdGFsKSB7XG4gICAgICBjYigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBob29rc1tjYWxsZWRdLmNhbGwodm0sIG5leHQpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgcHJvcEJpbmRpbmdNb2RlcyA9IGNvbmZpZy5fcHJvcEJpbmRpbmdNb2RlcztcbnZhciBlbXB0eSA9IHt9O1xuXG4vLyByZWdleGVzXG52YXIgaWRlbnRSRSQxID0gL15bJF9hLXpBLVpdK1tcXHckXSokLztcbnZhciBzZXR0YWJsZVBhdGhSRSA9IC9eW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbW15cXFtcXF1dK1xcXSkqJC87XG5cbi8qKlxuICogQ29tcGlsZSBwcm9wcyBvbiBhIHJvb3QgZWxlbWVudCBhbmQgcmV0dXJuXG4gKiBhIHByb3BzIGxpbmsgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wT3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHByb3BzTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVByb3BzKGVsLCBwcm9wT3B0aW9ucykge1xuICB2YXIgcHJvcHMgPSBbXTtcbiAgdmFyIG5hbWVzID0gT2JqZWN0LmtleXMocHJvcE9wdGlvbnMpO1xuICB2YXIgaSA9IG5hbWVzLmxlbmd0aDtcbiAgdmFyIG9wdGlvbnMsIG5hbWUsIGF0dHIsIHZhbHVlLCBwYXRoLCBwYXJzZWQsIHByb3A7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBuYW1lID0gbmFtZXNbaV07XG4gICAgb3B0aW9ucyA9IHByb3BPcHRpb25zW25hbWVdIHx8IGVtcHR5O1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgbmFtZSA9PT0gJyRkYXRhJykge1xuICAgICAgd2FybignRG8gbm90IHVzZSAkZGF0YSBhcyBwcm9wLicpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gcHJvcHMgY291bGQgY29udGFpbiBkYXNoZXMsIHdoaWNoIHdpbGwgYmVcbiAgICAvLyBpbnRlcnByZXRlZCBhcyBtaW51cyBjYWxjdWxhdGlvbnMgYnkgdGhlIHBhcnNlclxuICAgIC8vIHNvIHdlIG5lZWQgdG8gY2FtZWxpemUgdGhlIHBhdGggaGVyZVxuICAgIHBhdGggPSBjYW1lbGl6ZShuYW1lKTtcbiAgICBpZiAoIWlkZW50UkUkMS50ZXN0KHBhdGgpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0ludmFsaWQgcHJvcCBrZXk6IFwiJyArIG5hbWUgKyAnXCIuIFByb3Aga2V5cyAnICsgJ211c3QgYmUgdmFsaWQgaWRlbnRpZmllcnMuJyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwcm9wID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgbW9kZTogcHJvcEJpbmRpbmdNb2Rlcy5PTkVfV0FZLFxuICAgICAgcmF3OiBudWxsXG4gICAgfTtcblxuICAgIGF0dHIgPSBoeXBoZW5hdGUobmFtZSk7XG4gICAgLy8gZmlyc3QgY2hlY2sgZHluYW1pYyB2ZXJzaW9uXG4gICAgaWYgKCh2YWx1ZSA9IGdldEJpbmRBdHRyKGVsLCBhdHRyKSkgPT09IG51bGwpIHtcbiAgICAgIGlmICgodmFsdWUgPSBnZXRCaW5kQXR0cihlbCwgYXR0ciArICcuc3luYycpKSAhPT0gbnVsbCkge1xuICAgICAgICBwcm9wLm1vZGUgPSBwcm9wQmluZGluZ01vZGVzLlRXT19XQVk7XG4gICAgICB9IGVsc2UgaWYgKCh2YWx1ZSA9IGdldEJpbmRBdHRyKGVsLCBhdHRyICsgJy5vbmNlJykpICE9PSBudWxsKSB7XG4gICAgICAgIHByb3AubW9kZSA9IHByb3BCaW5kaW5nTW9kZXMuT05FX1RJTUU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgLy8gaGFzIGR5bmFtaWMgYmluZGluZyFcbiAgICAgIHByb3AucmF3ID0gdmFsdWU7XG4gICAgICBwYXJzZWQgPSBwYXJzZURpcmVjdGl2ZSh2YWx1ZSk7XG4gICAgICB2YWx1ZSA9IHBhcnNlZC5leHByZXNzaW9uO1xuICAgICAgcHJvcC5maWx0ZXJzID0gcGFyc2VkLmZpbHRlcnM7XG4gICAgICAvLyBjaGVjayBiaW5kaW5nIHR5cGVcbiAgICAgIGlmIChpc0xpdGVyYWwodmFsdWUpICYmICFwYXJzZWQuZmlsdGVycykge1xuICAgICAgICAvLyBmb3IgZXhwcmVzc2lvbnMgY29udGFpbmluZyBsaXRlcmFsIG51bWJlcnMgYW5kXG4gICAgICAgIC8vIGJvb2xlYW5zLCB0aGVyZSdzIG5vIG5lZWQgdG8gc2V0dXAgYSBwcm9wIGJpbmRpbmcsXG4gICAgICAgIC8vIHNvIHdlIGNhbiBvcHRpbWl6ZSB0aGVtIGFzIGEgb25lLXRpbWUgc2V0LlxuICAgICAgICBwcm9wLm9wdGltaXplZExpdGVyYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvcC5keW5hbWljID0gdHJ1ZTtcbiAgICAgICAgLy8gY2hlY2sgbm9uLXNldHRhYmxlIHBhdGggZm9yIHR3by13YXkgYmluZGluZ3NcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgcHJvcC5tb2RlID09PSBwcm9wQmluZGluZ01vZGVzLlRXT19XQVkgJiYgIXNldHRhYmxlUGF0aFJFLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgcHJvcC5tb2RlID0gcHJvcEJpbmRpbmdNb2Rlcy5PTkVfV0FZO1xuICAgICAgICAgIHdhcm4oJ0Nhbm5vdCBiaW5kIHR3by13YXkgcHJvcCB3aXRoIG5vbi1zZXR0YWJsZSAnICsgJ3BhcmVudCBwYXRoOiAnICsgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcm9wLnBhcmVudFBhdGggPSB2YWx1ZTtcblxuICAgICAgLy8gd2FybiByZXF1aXJlZCB0d28td2F5XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBvcHRpb25zLnR3b1dheSAmJiBwcm9wLm1vZGUgIT09IHByb3BCaW5kaW5nTW9kZXMuVFdPX1dBWSkge1xuICAgICAgICB3YXJuKCdQcm9wIFwiJyArIG5hbWUgKyAnXCIgZXhwZWN0cyBhIHR3by13YXkgYmluZGluZyB0eXBlLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKHZhbHVlID0gZ2V0QXR0cihlbCwgYXR0cikpICE9PSBudWxsKSB7XG4gICAgICAvLyBoYXMgbGl0ZXJhbCBiaW5kaW5nIVxuICAgICAgcHJvcC5yYXcgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8vIGNoZWNrIHBvc3NpYmxlIGNhbWVsQ2FzZSBwcm9wIHVzYWdlXG4gICAgICB2YXIgbG93ZXJDYXNlTmFtZSA9IHBhdGgudG9Mb3dlckNhc2UoKTtcbiAgICAgIHZhbHVlID0gL1tBLVpcXC1dLy50ZXN0KG5hbWUpICYmIChlbC5nZXRBdHRyaWJ1dGUobG93ZXJDYXNlTmFtZSkgfHwgZWwuZ2V0QXR0cmlidXRlKCc6JyArIGxvd2VyQ2FzZU5hbWUpIHx8IGVsLmdldEF0dHJpYnV0ZSgndi1iaW5kOicgKyBsb3dlckNhc2VOYW1lKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJzonICsgbG93ZXJDYXNlTmFtZSArICcub25jZScpIHx8IGVsLmdldEF0dHJpYnV0ZSgndi1iaW5kOicgKyBsb3dlckNhc2VOYW1lICsgJy5vbmNlJykgfHwgZWwuZ2V0QXR0cmlidXRlKCc6JyArIGxvd2VyQ2FzZU5hbWUgKyAnLnN5bmMnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3YtYmluZDonICsgbG93ZXJDYXNlTmFtZSArICcuc3luYycpKTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB3YXJuKCdQb3NzaWJsZSB1c2FnZSBlcnJvciBmb3IgcHJvcCBgJyArIGxvd2VyQ2FzZU5hbWUgKyAnYCAtICcgKyAnZGlkIHlvdSBtZWFuIGAnICsgYXR0ciArICdgPyBIVE1MIGlzIGNhc2UtaW5zZW5zaXRpdmUsIHJlbWVtYmVyIHRvIHVzZSAnICsgJ2tlYmFiLWNhc2UgZm9yIHByb3BzIGluIHRlbXBsYXRlcy4nKTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZXF1aXJlZCkge1xuICAgICAgICAvLyB3YXJuIG1pc3NpbmcgcmVxdWlyZWRcbiAgICAgICAgd2FybignTWlzc2luZyByZXF1aXJlZCBwcm9wOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHB1c2ggcHJvcFxuICAgIHByb3BzLnB1c2gocHJvcCk7XG4gIH1cbiAgcmV0dXJuIG1ha2VQcm9wc0xpbmtGbihwcm9wcyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgcHJvcHMgdG8gYSB2bS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wc1xuICogQHJldHVybiB7RnVuY3Rpb259IHByb3BzTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZVByb3BzTGlua0ZuKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcm9wc0xpbmtGbih2bSwgc2NvcGUpIHtcbiAgICAvLyBzdG9yZSByZXNvbHZlZCBwcm9wcyBpbmZvXG4gICAgdm0uX3Byb3BzID0ge307XG4gICAgdmFyIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgdmFyIHByb3AsIHBhdGgsIG9wdGlvbnMsIHZhbHVlLCByYXc7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgcmF3ID0gcHJvcC5yYXc7XG4gICAgICBwYXRoID0gcHJvcC5wYXRoO1xuICAgICAgb3B0aW9ucyA9IHByb3Aub3B0aW9ucztcbiAgICAgIHZtLl9wcm9wc1twYXRoXSA9IHByb3A7XG4gICAgICBpZiAocmF3ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGluaXRpYWxpemUgYWJzZW50IHByb3BcbiAgICAgICAgaW5pdFByb3Aodm0sIHByb3AsIHVuZGVmaW5lZCk7XG4gICAgICB9IGVsc2UgaWYgKHByb3AuZHluYW1pYykge1xuICAgICAgICAvLyBkeW5hbWljIHByb3BcbiAgICAgICAgaWYgKHByb3AubW9kZSA9PT0gcHJvcEJpbmRpbmdNb2Rlcy5PTkVfVElNRSkge1xuICAgICAgICAgIC8vIG9uZSB0aW1lIGJpbmRpbmdcbiAgICAgICAgICB2YWx1ZSA9IChzY29wZSB8fCB2bS5fY29udGV4dCB8fCB2bSkuJGdldChwcm9wLnBhcmVudFBhdGgpO1xuICAgICAgICAgIGluaXRQcm9wKHZtLCBwcm9wLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHZtLl9jb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBkeW5hbWljIGJpbmRpbmdcbiAgICAgICAgICAgIHZtLl9iaW5kRGlyKHtcbiAgICAgICAgICAgICAgbmFtZTogJ3Byb3AnLFxuICAgICAgICAgICAgICBkZWY6IHByb3BEZWYsXG4gICAgICAgICAgICAgIHByb3A6IHByb3BcbiAgICAgICAgICAgIH0sIG51bGwsIG51bGwsIHNjb3BlKTsgLy8gZWwsIGhvc3QsIHNjb3BlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gcm9vdCBpbnN0YW5jZVxuICAgICAgICAgICAgICBpbml0UHJvcCh2bSwgcHJvcCwgdm0uJGdldChwcm9wLnBhcmVudFBhdGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcm9wLm9wdGltaXplZExpdGVyYWwpIHtcbiAgICAgICAgLy8gb3B0aW1pemVkIGxpdGVyYWwsIGNhc3QgaXQgYW5kIGp1c3Qgc2V0IG9uY2VcbiAgICAgICAgdmFyIHN0cmlwcGVkID0gc3RyaXBRdW90ZXMocmF3KTtcbiAgICAgICAgdmFsdWUgPSBzdHJpcHBlZCA9PT0gcmF3ID8gdG9Cb29sZWFuKHRvTnVtYmVyKHJhdykpIDogc3RyaXBwZWQ7XG4gICAgICAgIGluaXRQcm9wKHZtLCBwcm9wLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdHJpbmcgbGl0ZXJhbCwgYnV0IHdlIG5lZWQgdG8gY2F0ZXIgZm9yXG4gICAgICAgIC8vIEJvb2xlYW4gcHJvcHMgd2l0aCBubyB2YWx1ZSwgb3Igd2l0aCBzYW1lXG4gICAgICAgIC8vIGxpdGVyYWwgdmFsdWUgKGUuZy4gZGlzYWJsZWQ9XCJkaXNhYmxlZFwiKVxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZS1sb2FkZXIvaXNzdWVzLzE4MlxuICAgICAgICB2YWx1ZSA9IG9wdGlvbnMudHlwZSA9PT0gQm9vbGVhbiAmJiAocmF3ID09PSAnJyB8fCByYXcgPT09IGh5cGhlbmF0ZShwcm9wLm5hbWUpKSA/IHRydWUgOiByYXc7XG4gICAgICAgIGluaXRQcm9wKHZtLCBwcm9wLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFNldCBhIHByb3AncyBpbml0aWFsIHZhbHVlIG9uIGEgdm0gYW5kIGl0cyBkYXRhIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxuZnVuY3Rpb24gaW5pdFByb3Aodm0sIHByb3AsIHZhbHVlKSB7XG4gIHZhciBrZXkgPSBwcm9wLnBhdGg7XG4gIHZhbHVlID0gY29lcmNlUHJvcChwcm9wLCB2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBnZXRQcm9wRGVmYXVsdFZhbHVlKHZtLCBwcm9wLm9wdGlvbnMpO1xuICB9XG4gIGlmIChhc3NlcnRQcm9wKHByb3AsIHZhbHVlKSkge1xuICAgIGRlZmluZVJlYWN0aXZlKHZtLCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhIHByb3AuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7Kn1cbiAqL1xuXG5mdW5jdGlvbiBnZXRQcm9wRGVmYXVsdFZhbHVlKHZtLCBvcHRpb25zKSB7XG4gIC8vIG5vIGRlZmF1bHQsIHJldHVybiB1bmRlZmluZWRcbiAgaWYgKCFoYXNPd24ob3B0aW9ucywgJ2RlZmF1bHQnKSkge1xuICAgIC8vIGFic2VudCBib29sZWFuIHZhbHVlIGRlZmF1bHRzIHRvIGZhbHNlXG4gICAgcmV0dXJuIG9wdGlvbnMudHlwZSA9PT0gQm9vbGVhbiA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICB9XG4gIHZhciBkZWYgPSBvcHRpb25zWydkZWZhdWx0J107XG4gIC8vIHdhcm4gYWdhaW5zdCBub24tZmFjdG9yeSBkZWZhdWx0cyBmb3IgT2JqZWN0ICYgQXJyYXlcbiAgaWYgKGlzT2JqZWN0KGRlZikpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ09iamVjdC9BcnJheSBhcyBkZWZhdWx0IHByb3AgdmFsdWVzIHdpbGwgYmUgc2hhcmVkICcgKyAnYWNyb3NzIG11bHRpcGxlIGluc3RhbmNlcy4gVXNlIGEgZmFjdG9yeSBmdW5jdGlvbiAnICsgJ3RvIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZSBpbnN0ZWFkLicpO1xuICB9XG4gIC8vIGNhbGwgZmFjdG9yeSBmdW5jdGlvbiBmb3Igbm9uLUZ1bmN0aW9uIHR5cGVzXG4gIHJldHVybiB0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nICYmIG9wdGlvbnMudHlwZSAhPT0gRnVuY3Rpb24gPyBkZWYuY2FsbCh2bSkgOiBkZWY7XG59XG5cbi8qKlxuICogQXNzZXJ0IHdoZXRoZXIgYSBwcm9wIGlzIHZhbGlkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxuZnVuY3Rpb24gYXNzZXJ0UHJvcChwcm9wLCB2YWx1ZSkge1xuICBpZiAoIXByb3Aub3B0aW9ucy5yZXF1aXJlZCAmJiAoIC8vIG5vbi1yZXF1aXJlZFxuICBwcm9wLnJhdyA9PT0gbnVsbCB8fCAvLyBhYnNjZW50XG4gIHZhbHVlID09IG51bGwpIC8vIG51bGwgb3IgdW5kZWZpbmVkXG4gICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB2YXIgb3B0aW9ucyA9IHByb3Aub3B0aW9ucztcbiAgdmFyIHR5cGUgPSBvcHRpb25zLnR5cGU7XG4gIHZhciB2YWxpZCA9IHRydWU7XG4gIHZhciBleHBlY3RlZFR5cGU7XG4gIGlmICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT09IFN0cmluZykge1xuICAgICAgZXhwZWN0ZWRUeXBlID0gJ3N0cmluZyc7XG4gICAgICB2YWxpZCA9IHR5cGVvZiB2YWx1ZSA9PT0gZXhwZWN0ZWRUeXBlO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gTnVtYmVyKSB7XG4gICAgICBleHBlY3RlZFR5cGUgPSAnbnVtYmVyJztcbiAgICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJztcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IEJvb2xlYW4pIHtcbiAgICAgIGV4cGVjdGVkVHlwZSA9ICdib29sZWFuJztcbiAgICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbic7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBGdW5jdGlvbikge1xuICAgICAgZXhwZWN0ZWRUeXBlID0gJ2Z1bmN0aW9uJztcbiAgICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gT2JqZWN0KSB7XG4gICAgICBleHBlY3RlZFR5cGUgPSAnb2JqZWN0JztcbiAgICAgIHZhbGlkID0gaXNQbGFpbk9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBBcnJheSkge1xuICAgICAgZXhwZWN0ZWRUeXBlID0gJ2FycmF5JztcbiAgICAgIHZhbGlkID0gaXNBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbGlkID0gdmFsdWUgaW5zdGFuY2VvZiB0eXBlO1xuICAgIH1cbiAgfVxuICBpZiAoIXZhbGlkKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKCdJbnZhbGlkIHByb3A6IHR5cGUgY2hlY2sgZmFpbGVkIGZvciAnICsgcHJvcC5wYXRoICsgJz1cIicgKyBwcm9wLnJhdyArICdcIi4nICsgJyBFeHBlY3RlZCAnICsgZm9ybWF0VHlwZShleHBlY3RlZFR5cGUpICsgJywgZ290ICcgKyBmb3JtYXRWYWx1ZSh2YWx1ZSkgKyAnLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdmFsaWRhdG9yID0gb3B0aW9ucy52YWxpZGF0b3I7XG4gIGlmICh2YWxpZGF0b3IpIHtcbiAgICBpZiAoIXZhbGlkYXRvcih2YWx1ZSkpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FybignSW52YWxpZCBwcm9wOiBjdXN0b20gdmFsaWRhdG9yIGNoZWNrIGZhaWxlZCBmb3IgJyArIHByb3AucGF0aCArICc9XCInICsgcHJvcC5yYXcgKyAnXCInKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogRm9yY2UgcGFyc2luZyB2YWx1ZSB3aXRoIGNvZXJjZSBvcHRpb24uXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4geyp9XG4gKi9cblxuZnVuY3Rpb24gY29lcmNlUHJvcChwcm9wLCB2YWx1ZSkge1xuICB2YXIgY29lcmNlID0gcHJvcC5vcHRpb25zLmNvZXJjZTtcbiAgaWYgKCFjb2VyY2UpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgLy8gY29lcmNlIGlzIGEgZnVuY3Rpb25cbiAgcmV0dXJuIGNvZXJjZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFR5cGUodmFsKSB7XG4gIHJldHVybiB2YWwgPyB2YWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2YWwuc2xpY2UoMSkgOiAnY3VzdG9tIHR5cGUnO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWwpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpLnNsaWNlKDgsIC0xKTtcbn1cblxudmFyIGJpbmRpbmdNb2RlcyA9IGNvbmZpZy5fcHJvcEJpbmRpbmdNb2RlcztcblxudmFyIHByb3BEZWYgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLnZtO1xuICAgIHZhciBwYXJlbnQgPSBjaGlsZC5fY29udGV4dDtcbiAgICAvLyBwYXNzZWQgaW4gZnJvbSBjb21waWxlciBkaXJlY3RseVxuICAgIHZhciBwcm9wID0gdGhpcy5kZXNjcmlwdG9yLnByb3A7XG4gICAgdmFyIGNoaWxkS2V5ID0gcHJvcC5wYXRoO1xuICAgIHZhciBwYXJlbnRLZXkgPSBwcm9wLnBhcmVudFBhdGg7XG4gICAgdmFyIHR3b1dheSA9IHByb3AubW9kZSA9PT0gYmluZGluZ01vZGVzLlRXT19XQVk7XG4gICAgdmFyIGlzU2ltcGxlID0gaXNTaW1wbGVQYXRoKHBhcmVudEtleSk7XG5cbiAgICB2YXIgcGFyZW50V2F0Y2hlciA9IHRoaXMucGFyZW50V2F0Y2hlciA9IG5ldyBXYXRjaGVyKHBhcmVudCwgcGFyZW50S2V5LCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICB2YWwgPSBjb2VyY2VQcm9wKHByb3AsIHZhbCk7XG4gICAgICBpZiAoYXNzZXJ0UHJvcChwcm9wLCB2YWwpKSB7XG4gICAgICAgIGlmIChpc1NpbXBsZSkge1xuICAgICAgICAgIHdpdGhvdXRDb252ZXJzaW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNoaWxkW2NoaWxkS2V5XSA9IHZhbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZFtjaGlsZEtleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB0d29XYXk6IHR3b1dheSxcbiAgICAgIGZpbHRlcnM6IHByb3AuZmlsdGVycyxcbiAgICAgIC8vIGltcG9ydGFudDogcHJvcHMgbmVlZCB0byBiZSBvYnNlcnZlZCBvbiB0aGVcbiAgICAgIC8vIHYtZm9yIHNjb3BlIGlmIHByZXNlbnRcbiAgICAgIHNjb3BlOiB0aGlzLl9zY29wZVxuICAgIH0pO1xuXG4gICAgLy8gc2V0IHRoZSBjaGlsZCBpbml0aWFsIHZhbHVlLlxuICAgIHZhciB2YWx1ZSA9IHBhcmVudFdhdGNoZXIudmFsdWU7XG4gICAgaWYgKGlzU2ltcGxlICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHdpdGhvdXRDb252ZXJzaW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5pdFByb3AoY2hpbGQsIHByb3AsIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0UHJvcChjaGlsZCwgcHJvcCwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIHNldHVwIHR3by13YXkgYmluZGluZ1xuICAgIGlmICh0d29XYXkpIHtcbiAgICAgIC8vIGltcG9ydGFudDogZGVmZXIgdGhlIGNoaWxkIHdhdGNoZXIgY3JlYXRpb24gdW50aWxcbiAgICAgIC8vIHRoZSBjcmVhdGVkIGhvb2sgKGFmdGVyIGRhdGEgb2JzZXJ2YXRpb24pXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBjaGlsZC4kb25jZSgncHJlLWhvb2s6Y3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5jaGlsZFdhdGNoZXIgPSBuZXcgV2F0Y2hlcihjaGlsZCwgY2hpbGRLZXksIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICBwYXJlbnRXYXRjaGVyLnNldCh2YWwpO1xuICAgICAgICB9LCB7XG4gICAgICAgICAgLy8gZW5zdXJlIHN5bmMgdXB3YXJkIGJlZm9yZSBwYXJlbnQgc3luYyBkb3duLlxuICAgICAgICAgIC8vIHRoaXMgaXMgbmVjZXNzYXJ5IGluIGNhc2VzIGUuZy4gdGhlIGNoaWxkXG4gICAgICAgICAgLy8gbXV0YXRlcyBhIHByb3AgYXJyYXksIHRoZW4gcmVwbGFjZXMgaXQuICgjMTY4MylcbiAgICAgICAgICBzeW5jOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKCkge1xuICAgIHRoaXMucGFyZW50V2F0Y2hlci50ZWFyZG93bigpO1xuICAgIGlmICh0aGlzLmNoaWxkV2F0Y2hlcikge1xuICAgICAgdGhpcy5jaGlsZFdhdGNoZXIudGVhcmRvd24oKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBxdWV1ZSQxID0gW107XG52YXIgcXVldWVkID0gZmFsc2U7XG5cbi8qKlxuICogUHVzaCBhIGpvYiBpbnRvIHRoZSBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBqb2JcbiAqL1xuXG5mdW5jdGlvbiBwdXNoSm9iKGpvYikge1xuICBxdWV1ZSQxLnB1c2goam9iKTtcbiAgaWYgKCFxdWV1ZWQpIHtcbiAgICBxdWV1ZWQgPSB0cnVlO1xuICAgIG5leHRUaWNrKGZsdXNoKTtcbiAgfVxufVxuXG4vKipcbiAqIEZsdXNoIHRoZSBxdWV1ZSwgYW5kIGRvIG9uZSBmb3JjZWQgcmVmbG93IGJlZm9yZVxuICogdHJpZ2dlcmluZyB0cmFuc2l0aW9ucy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgLy8gRm9yY2UgbGF5b3V0XG4gIHZhciBmID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZSQxLmxlbmd0aDsgaSsrKSB7XG4gICAgcXVldWUkMVtpXSgpO1xuICB9XG4gIHF1ZXVlJDEgPSBbXTtcbiAgcXVldWVkID0gZmFsc2U7XG4gIC8vIGR1bW15IHJldHVybiwgc28ganMgbGludGVycyBkb24ndCBjb21wbGFpbiBhYm91dFxuICAvLyB1bnVzZWQgdmFyaWFibGUgZlxuICByZXR1cm4gZjtcbn1cblxudmFyIFRZUEVfVFJBTlNJVElPTiA9ICd0cmFuc2l0aW9uJztcbnZhciBUWVBFX0FOSU1BVElPTiA9ICdhbmltYXRpb24nO1xudmFyIHRyYW5zRHVyYXRpb25Qcm9wID0gdHJhbnNpdGlvblByb3AgKyAnRHVyYXRpb24nO1xudmFyIGFuaW1EdXJhdGlvblByb3AgPSBhbmltYXRpb25Qcm9wICsgJ0R1cmF0aW9uJztcblxuLyoqXG4gKiBJZiBhIGp1c3QtZW50ZXJlZCBlbGVtZW50IGlzIGFwcGxpZWQgdGhlXG4gKiBsZWF2ZSBjbGFzcyB3aGlsZSBpdHMgZW50ZXIgdHJhbnNpdGlvbiBoYXNuJ3Qgc3RhcnRlZCB5ZXQsXG4gKiBhbmQgdGhlIHRyYW5zaXRpb25lZCBwcm9wZXJ0eSBoYXMgdGhlIHNhbWUgdmFsdWUgZm9yIGJvdGhcbiAqIGVudGVyL2xlYXZlLCB0aGVuIHRoZSBsZWF2ZSB0cmFuc2l0aW9uIHdpbGwgYmUgc2tpcHBlZCBhbmRcbiAqIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50IG5ldmVyIGZpcmVzLiBUaGlzIGZ1bmN0aW9uIGVuc3VyZXNcbiAqIGl0cyBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgYSB0cmFuc2l0aW9uIGhhcyBzdGFydGVkXG4gKiBieSB3YWl0aW5nIGZvciBkb3VibGUgcmFmLlxuICpcbiAqIEl0IGZhbGxzIGJhY2sgdG8gc2V0VGltZW91dCBvbiBkZXZpY2VzIHRoYXQgc3VwcG9ydCBDU1NcbiAqIHRyYW5zaXRpb25zIGJ1dCBub3QgcmFmIChlLmcuIEFuZHJvaWQgNC4yIGJyb3dzZXIpIC0gc2luY2VcbiAqIHRoZXNlIGVudmlyb25tZW50cyBhcmUgdXN1YWxseSBzbG93LCB3ZSBhcmUgZ2l2aW5nIGl0IGFcbiAqIHJlbGF0aXZlbHkgbGFyZ2UgdGltZW91dC5cbiAqL1xuXG52YXIgcmFmID0gaW5Ccm93c2VyICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG52YXIgd2FpdEZvclRyYW5zaXRpb25TdGFydCA9IHJhZlxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbj8gZnVuY3Rpb24gKGZuKSB7XG4gIHJhZihmdW5jdGlvbiAoKSB7XG4gICAgcmFmKGZuKTtcbiAgfSk7XG59IDogZnVuY3Rpb24gKGZuKSB7XG4gIHNldFRpbWVvdXQoZm4sIDUwKTtcbn07XG5cbi8qKlxuICogQSBUcmFuc2l0aW9uIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUgc3RhdGUgYW5kIGxvZ2ljXG4gKiBvZiB0aGUgdHJhbnNpdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBob29rc1xuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cbmZ1bmN0aW9uIFRyYW5zaXRpb24oZWwsIGlkLCBob29rcywgdm0pIHtcbiAgdGhpcy5pZCA9IGlkO1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMuZW50ZXJDbGFzcyA9IGhvb2tzICYmIGhvb2tzLmVudGVyQ2xhc3MgfHwgaWQgKyAnLWVudGVyJztcbiAgdGhpcy5sZWF2ZUNsYXNzID0gaG9va3MgJiYgaG9va3MubGVhdmVDbGFzcyB8fCBpZCArICctbGVhdmUnO1xuICB0aGlzLmhvb2tzID0gaG9va3M7XG4gIHRoaXMudm0gPSB2bTtcbiAgLy8gYXN5bmMgc3RhdGVcbiAgdGhpcy5wZW5kaW5nQ3NzRXZlbnQgPSB0aGlzLnBlbmRpbmdDc3NDYiA9IHRoaXMuY2FuY2VsID0gdGhpcy5wZW5kaW5nSnNDYiA9IHRoaXMub3AgPSB0aGlzLmNiID0gbnVsbDtcbiAgdGhpcy5qdXN0RW50ZXJlZCA9IGZhbHNlO1xuICB0aGlzLmVudGVyZWQgPSB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgdGhpcy50eXBlQ2FjaGUgPSB7fTtcbiAgLy8gY2hlY2sgY3NzIHRyYW5zaXRpb24gdHlwZVxuICB0aGlzLnR5cGUgPSBob29rcyAmJiBob29rcy50eXBlO1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAodGhpcy50eXBlICYmIHRoaXMudHlwZSAhPT0gVFlQRV9UUkFOU0lUSU9OICYmIHRoaXMudHlwZSAhPT0gVFlQRV9BTklNQVRJT04pIHtcbiAgICAgIHdhcm4oJ2ludmFsaWQgQ1NTIHRyYW5zaXRpb24gdHlwZSBmb3IgdHJhbnNpdGlvbj1cIicgKyB0aGlzLmlkICsgJ1wiOiAnICsgdGhpcy50eXBlKTtcbiAgICB9XG4gIH1cbiAgLy8gYmluZFxuICB2YXIgc2VsZiA9IHRoaXM7WydlbnRlck5leHRUaWNrJywgJ2VudGVyRG9uZScsICdsZWF2ZU5leHRUaWNrJywgJ2xlYXZlRG9uZSddLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICBzZWxmW21dID0gYmluZChzZWxmW21dLCBzZWxmKTtcbiAgfSk7XG59XG5cbnZhciBwJDEgPSBUcmFuc2l0aW9uLnByb3RvdHlwZTtcblxuLyoqXG4gKiBTdGFydCBhbiBlbnRlcmluZyB0cmFuc2l0aW9uLlxuICpcbiAqIDEuIGVudGVyIHRyYW5zaXRpb24gdHJpZ2dlcmVkXG4gKiAyLiBjYWxsIGJlZm9yZUVudGVyIGhvb2tcbiAqIDMuIGFkZCBlbnRlciBjbGFzc1xuICogNC4gaW5zZXJ0L3Nob3cgZWxlbWVudFxuICogNS4gY2FsbCBlbnRlciBob29rICh3aXRoIHBvc3NpYmxlIGV4cGxpY2l0IGpzIGNhbGxiYWNrKVxuICogNi4gcmVmbG93XG4gKiA3LiBiYXNlZCBvbiB0cmFuc2l0aW9uIHR5cGU6XG4gKiAgICAtIHRyYW5zaXRpb246XG4gKiAgICAgICAgcmVtb3ZlIGNsYXNzIG5vdywgd2FpdCBmb3IgdHJhbnNpdGlvbmVuZCxcbiAqICAgICAgICB0aGVuIGRvbmUgaWYgdGhlcmUncyBubyBleHBsaWNpdCBqcyBjYWxsYmFjay5cbiAqICAgIC0gYW5pbWF0aW9uOlxuICogICAgICAgIHdhaXQgZm9yIGFuaW1hdGlvbmVuZCwgcmVtb3ZlIGNsYXNzLFxuICogICAgICAgIHRoZW4gZG9uZSBpZiB0aGVyZSdzIG5vIGV4cGxpY2l0IGpzIGNhbGxiYWNrLlxuICogICAgLSBubyBjc3MgdHJhbnNpdGlvbjpcbiAqICAgICAgICBkb25lIG5vdyBpZiB0aGVyZSdzIG5vIGV4cGxpY2l0IGpzIGNhbGxiYWNrLlxuICogOC4gd2FpdCBmb3IgZWl0aGVyIGRvbmUgb3IganMgY2FsbGJhY2ssIHRoZW4gY2FsbFxuICogICAgYWZ0ZXJFbnRlciBob29rLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gaW5zZXJ0L3Nob3cgdGhlIGVsZW1lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5wJDEuZW50ZXIgPSBmdW5jdGlvbiAob3AsIGNiKSB7XG4gIHRoaXMuY2FuY2VsUGVuZGluZygpO1xuICB0aGlzLmNhbGxIb29rKCdiZWZvcmVFbnRlcicpO1xuICB0aGlzLmNiID0gY2I7XG4gIGFkZENsYXNzKHRoaXMuZWwsIHRoaXMuZW50ZXJDbGFzcyk7XG4gIG9wKCk7XG4gIHRoaXMuZW50ZXJlZCA9IGZhbHNlO1xuICB0aGlzLmNhbGxIb29rV2l0aENiKCdlbnRlcicpO1xuICBpZiAodGhpcy5lbnRlcmVkKSB7XG4gICAgcmV0dXJuOyAvLyB1c2VyIGNhbGxlZCBkb25lIHN5bmNocm9ub3VzbHkuXG4gIH1cbiAgdGhpcy5jYW5jZWwgPSB0aGlzLmhvb2tzICYmIHRoaXMuaG9va3MuZW50ZXJDYW5jZWxsZWQ7XG4gIHB1c2hKb2IodGhpcy5lbnRlck5leHRUaWNrKTtcbn07XG5cbi8qKlxuICogVGhlIFwibmV4dFRpY2tcIiBwaGFzZSBvZiBhbiBlbnRlcmluZyB0cmFuc2l0aW9uLCB3aGljaCBpc1xuICogdG8gYmUgcHVzaGVkIGludG8gYSBxdWV1ZSBhbmQgZXhlY3V0ZWQgYWZ0ZXIgYSByZWZsb3cgc29cbiAqIHRoYXQgcmVtb3ZpbmcgdGhlIGNsYXNzIGNhbiB0cmlnZ2VyIGEgQ1NTIHRyYW5zaXRpb24uXG4gKi9cblxucCQxLmVudGVyTmV4dFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgLy8gcHJldmVudCB0cmFuc2l0aW9uIHNraXBwaW5nXG4gIHRoaXMuanVzdEVudGVyZWQgPSB0cnVlO1xuICB3YWl0Rm9yVHJhbnNpdGlvblN0YXJ0KGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5qdXN0RW50ZXJlZCA9IGZhbHNlO1xuICB9KTtcbiAgdmFyIGVudGVyRG9uZSA9IHRoaXMuZW50ZXJEb25lO1xuICB2YXIgdHlwZSA9IHRoaXMuZ2V0Q3NzVHJhbnNpdGlvblR5cGUodGhpcy5lbnRlckNsYXNzKTtcbiAgaWYgKCF0aGlzLnBlbmRpbmdKc0NiKSB7XG4gICAgaWYgKHR5cGUgPT09IFRZUEVfVFJBTlNJVElPTikge1xuICAgICAgLy8gdHJpZ2dlciB0cmFuc2l0aW9uIGJ5IHJlbW92aW5nIGVudGVyIGNsYXNzIG5vd1xuICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5lbnRlckNsYXNzKTtcbiAgICAgIHRoaXMuc2V0dXBDc3NDYih0cmFuc2l0aW9uRW5kRXZlbnQsIGVudGVyRG9uZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBUWVBFX0FOSU1BVElPTikge1xuICAgICAgdGhpcy5zZXR1cENzc0NiKGFuaW1hdGlvbkVuZEV2ZW50LCBlbnRlckRvbmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlckRvbmUoKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9UUkFOU0lUSU9OKSB7XG4gICAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5lbnRlckNsYXNzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgXCJjbGVhbnVwXCIgcGhhc2Ugb2YgYW4gZW50ZXJpbmcgdHJhbnNpdGlvbi5cbiAqL1xuXG5wJDEuZW50ZXJEb25lID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmVudGVyZWQgPSB0cnVlO1xuICB0aGlzLmNhbmNlbCA9IHRoaXMucGVuZGluZ0pzQ2IgPSBudWxsO1xuICByZW1vdmVDbGFzcyh0aGlzLmVsLCB0aGlzLmVudGVyQ2xhc3MpO1xuICB0aGlzLmNhbGxIb29rKCdhZnRlckVudGVyJyk7XG4gIGlmICh0aGlzLmNiKSB0aGlzLmNiKCk7XG59O1xuXG4vKipcbiAqIFN0YXJ0IGEgbGVhdmluZyB0cmFuc2l0aW9uLlxuICpcbiAqIDEuIGxlYXZlIHRyYW5zaXRpb24gdHJpZ2dlcmVkLlxuICogMi4gY2FsbCBiZWZvcmVMZWF2ZSBob29rXG4gKiAzLiBhZGQgbGVhdmUgY2xhc3MgKHRyaWdnZXIgY3NzIHRyYW5zaXRpb24pXG4gKiA0LiBjYWxsIGxlYXZlIGhvb2sgKHdpdGggcG9zc2libGUgZXhwbGljaXQganMgY2FsbGJhY2spXG4gKiA1LiByZWZsb3cgaWYgbm8gZXhwbGljaXQganMgY2FsbGJhY2sgaXMgcHJvdmlkZWRcbiAqIDYuIGJhc2VkIG9uIHRyYW5zaXRpb24gdHlwZTpcbiAqICAgIC0gdHJhbnNpdGlvbiBvciBhbmltYXRpb246XG4gKiAgICAgICAgd2FpdCBmb3IgZW5kIGV2ZW50LCByZW1vdmUgY2xhc3MsIHRoZW4gZG9uZSBpZlxuICogICAgICAgIHRoZXJlJ3Mgbm8gZXhwbGljaXQganMgY2FsbGJhY2suXG4gKiAgICAtIG5vIGNzcyB0cmFuc2l0aW9uOlxuICogICAgICAgIGRvbmUgaWYgdGhlcmUncyBubyBleHBsaWNpdCBqcyBjYWxsYmFjay5cbiAqIDcuIHdhaXQgZm9yIGVpdGhlciBkb25lIG9yIGpzIGNhbGxiYWNrLCB0aGVuIGNhbGxcbiAqICAgIGFmdGVyTGVhdmUgaG9vay5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHJlbW92ZS9oaWRlIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxucCQxLmxlYXZlID0gZnVuY3Rpb24gKG9wLCBjYikge1xuICB0aGlzLmNhbmNlbFBlbmRpbmcoKTtcbiAgdGhpcy5jYWxsSG9vaygnYmVmb3JlTGVhdmUnKTtcbiAgdGhpcy5vcCA9IG9wO1xuICB0aGlzLmNiID0gY2I7XG4gIGFkZENsYXNzKHRoaXMuZWwsIHRoaXMubGVhdmVDbGFzcyk7XG4gIHRoaXMubGVmdCA9IGZhbHNlO1xuICB0aGlzLmNhbGxIb29rV2l0aENiKCdsZWF2ZScpO1xuICBpZiAodGhpcy5sZWZ0KSB7XG4gICAgcmV0dXJuOyAvLyB1c2VyIGNhbGxlZCBkb25lIHN5bmNocm9ub3VzbHkuXG4gIH1cbiAgdGhpcy5jYW5jZWwgPSB0aGlzLmhvb2tzICYmIHRoaXMuaG9va3MubGVhdmVDYW5jZWxsZWQ7XG4gIC8vIG9ubHkgbmVlZCB0byBoYW5kbGUgbGVhdmVEb25lIGlmXG4gIC8vIDEuIHRoZSB0cmFuc2l0aW9uIGlzIGFscmVhZHkgZG9uZSAoc3luY2hyb25vdXNseSBjYWxsZWRcbiAgLy8gICAgYnkgdGhlIHVzZXIsIHdoaWNoIGNhdXNlcyB0aGlzLm9wIHNldCB0byBudWxsKVxuICAvLyAyLiB0aGVyZSdzIG5vIGV4cGxpY2l0IGpzIGNhbGxiYWNrXG4gIGlmICh0aGlzLm9wICYmICF0aGlzLnBlbmRpbmdKc0NiKSB7XG4gICAgLy8gaWYgYSBDU1MgdHJhbnNpdGlvbiBsZWF2ZXMgaW1tZWRpYXRlbHkgYWZ0ZXIgZW50ZXIsXG4gICAgLy8gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgbmV2ZXIgZmlyZXMuIHRoZXJlZm9yZSB3ZVxuICAgIC8vIGRldGVjdCBzdWNoIGNhc2VzIGFuZCBlbmQgdGhlIGxlYXZlIGltbWVkaWF0ZWx5LlxuICAgIGlmICh0aGlzLmp1c3RFbnRlcmVkKSB7XG4gICAgICB0aGlzLmxlYXZlRG9uZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoSm9iKHRoaXMubGVhdmVOZXh0VGljayk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBcIm5leHRUaWNrXCIgcGhhc2Ugb2YgYSBsZWF2aW5nIHRyYW5zaXRpb24uXG4gKi9cblxucCQxLmxlYXZlTmV4dFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0eXBlID0gdGhpcy5nZXRDc3NUcmFuc2l0aW9uVHlwZSh0aGlzLmxlYXZlQ2xhc3MpO1xuICBpZiAodHlwZSkge1xuICAgIHZhciBldmVudCA9IHR5cGUgPT09IFRZUEVfVFJBTlNJVElPTiA/IHRyYW5zaXRpb25FbmRFdmVudCA6IGFuaW1hdGlvbkVuZEV2ZW50O1xuICAgIHRoaXMuc2V0dXBDc3NDYihldmVudCwgdGhpcy5sZWF2ZURvbmUpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubGVhdmVEb25lKCk7XG4gIH1cbn07XG5cbi8qKlxuICogVGhlIFwiY2xlYW51cFwiIHBoYXNlIG9mIGEgbGVhdmluZyB0cmFuc2l0aW9uLlxuICovXG5cbnAkMS5sZWF2ZURvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubGVmdCA9IHRydWU7XG4gIHRoaXMuY2FuY2VsID0gdGhpcy5wZW5kaW5nSnNDYiA9IG51bGw7XG4gIHRoaXMub3AoKTtcbiAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5sZWF2ZUNsYXNzKTtcbiAgdGhpcy5jYWxsSG9vaygnYWZ0ZXJMZWF2ZScpO1xuICBpZiAodGhpcy5jYikgdGhpcy5jYigpO1xuICB0aGlzLm9wID0gbnVsbDtcbn07XG5cbi8qKlxuICogQ2FuY2VsIGFueSBwZW5kaW5nIGNhbGxiYWNrcyBmcm9tIGEgcHJldmlvdXNseSBydW5uaW5nXG4gKiBidXQgbm90IGZpbmlzaGVkIHRyYW5zaXRpb24uXG4gKi9cblxucCQxLmNhbmNlbFBlbmRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMub3AgPSB0aGlzLmNiID0gbnVsbDtcbiAgdmFyIGhhc1BlbmRpbmcgPSBmYWxzZTtcbiAgaWYgKHRoaXMucGVuZGluZ0Nzc0NiKSB7XG4gICAgaGFzUGVuZGluZyA9IHRydWU7XG4gICAgb2ZmKHRoaXMuZWwsIHRoaXMucGVuZGluZ0Nzc0V2ZW50LCB0aGlzLnBlbmRpbmdDc3NDYik7XG4gICAgdGhpcy5wZW5kaW5nQ3NzRXZlbnQgPSB0aGlzLnBlbmRpbmdDc3NDYiA9IG51bGw7XG4gIH1cbiAgaWYgKHRoaXMucGVuZGluZ0pzQ2IpIHtcbiAgICBoYXNQZW5kaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnBlbmRpbmdKc0NiLmNhbmNlbCgpO1xuICAgIHRoaXMucGVuZGluZ0pzQ2IgPSBudWxsO1xuICB9XG4gIGlmIChoYXNQZW5kaW5nKSB7XG4gICAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5lbnRlckNsYXNzKTtcbiAgICByZW1vdmVDbGFzcyh0aGlzLmVsLCB0aGlzLmxlYXZlQ2xhc3MpO1xuICB9XG4gIGlmICh0aGlzLmNhbmNlbCkge1xuICAgIHRoaXMuY2FuY2VsLmNhbGwodGhpcy52bSwgdGhpcy5lbCk7XG4gICAgdGhpcy5jYW5jZWwgPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIENhbGwgYSB1c2VyLXByb3ZpZGVkIHN5bmNocm9ub3VzIGhvb2sgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuXG5wJDEuY2FsbEhvb2sgPSBmdW5jdGlvbiAodHlwZSkge1xuICBpZiAodGhpcy5ob29rcyAmJiB0aGlzLmhvb2tzW3R5cGVdKSB7XG4gICAgdGhpcy5ob29rc1t0eXBlXS5jYWxsKHRoaXMudm0sIHRoaXMuZWwpO1xuICB9XG59O1xuXG4vKipcbiAqIENhbGwgYSB1c2VyLXByb3ZpZGVkLCBwb3RlbnRpYWxseS1hc3luYyBob29rIGZ1bmN0aW9uLlxuICogV2UgY2hlY2sgZm9yIHRoZSBsZW5ndGggb2YgYXJndW1lbnRzIHRvIHNlZSBpZiB0aGUgaG9va1xuICogZXhwZWN0cyBhIGBkb25lYCBjYWxsYmFjay4gSWYgdHJ1ZSwgdGhlIHRyYW5zaXRpb24ncyBlbmRcbiAqIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSB3aGVuIHRoZSB1c2VyIGNhbGxzIHRoYXQgY2FsbGJhY2s7XG4gKiBvdGhlcndpc2UsIHRoZSBlbmQgaXMgZGV0ZXJtaW5lZCBieSB0aGUgQ1NTIHRyYW5zaXRpb24gb3JcbiAqIGFuaW1hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5cbnAkMS5jYWxsSG9va1dpdGhDYiA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHZhciBob29rID0gdGhpcy5ob29rcyAmJiB0aGlzLmhvb2tzW3R5cGVdO1xuICBpZiAoaG9vaykge1xuICAgIGlmIChob29rLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMucGVuZGluZ0pzQ2IgPSBjYW5jZWxsYWJsZSh0aGlzW3R5cGUgKyAnRG9uZSddKTtcbiAgICB9XG4gICAgaG9vay5jYWxsKHRoaXMudm0sIHRoaXMuZWwsIHRoaXMucGVuZGluZ0pzQ2IpO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhbiBlbGVtZW50J3MgdHJhbnNpdGlvbiB0eXBlIGJhc2VkIG9uIHRoZVxuICogY2FsY3VsYXRlZCBzdHlsZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5cbnAkMS5nZXRDc3NUcmFuc2l0aW9uVHlwZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICghdHJhbnNpdGlvbkVuZEV2ZW50IHx8XG4gIC8vIHNraXAgQ1NTIHRyYW5zaXRpb25zIGlmIHBhZ2UgaXMgbm90IHZpc2libGUgLVxuICAvLyB0aGlzIHNvbHZlcyB0aGUgaXNzdWUgb2YgdHJhbnNpdGlvbmVuZCBldmVudHMgbm90XG4gIC8vIGZpcmluZyB1bnRpbCB0aGUgcGFnZSBpcyB2aXNpYmxlIGFnYWluLlxuICAvLyBwYWdlVmlzaWJpbGl0eSBBUEkgaXMgc3VwcG9ydGVkIGluIElFMTArLCBzYW1lIGFzXG4gIC8vIENTUyB0cmFuc2l0aW9ucy5cbiAgZG9jdW1lbnQuaGlkZGVuIHx8XG4gIC8vIGV4cGxpY2l0IGpzLW9ubHkgdHJhbnNpdGlvblxuICB0aGlzLmhvb2tzICYmIHRoaXMuaG9va3MuY3NzID09PSBmYWxzZSB8fFxuICAvLyBlbGVtZW50IGlzIGhpZGRlblxuICBpc0hpZGRlbih0aGlzLmVsKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgdHlwZSA9IHRoaXMudHlwZSB8fCB0aGlzLnR5cGVDYWNoZVtjbGFzc05hbWVdO1xuICBpZiAodHlwZSkgcmV0dXJuIHR5cGU7XG4gIHZhciBpbmxpbmVTdHlsZXMgPSB0aGlzLmVsLnN0eWxlO1xuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsKTtcbiAgdmFyIHRyYW5zRHVyYXRpb24gPSBpbmxpbmVTdHlsZXNbdHJhbnNEdXJhdGlvblByb3BdIHx8IGNvbXB1dGVkU3R5bGVzW3RyYW5zRHVyYXRpb25Qcm9wXTtcbiAgaWYgKHRyYW5zRHVyYXRpb24gJiYgdHJhbnNEdXJhdGlvbiAhPT0gJzBzJykge1xuICAgIHR5cGUgPSBUWVBFX1RSQU5TSVRJT047XG4gIH0gZWxzZSB7XG4gICAgdmFyIGFuaW1EdXJhdGlvbiA9IGlubGluZVN0eWxlc1thbmltRHVyYXRpb25Qcm9wXSB8fCBjb21wdXRlZFN0eWxlc1thbmltRHVyYXRpb25Qcm9wXTtcbiAgICBpZiAoYW5pbUR1cmF0aW9uICYmIGFuaW1EdXJhdGlvbiAhPT0gJzBzJykge1xuICAgICAgdHlwZSA9IFRZUEVfQU5JTUFUSU9OO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZSkge1xuICAgIHRoaXMudHlwZUNhY2hlW2NsYXNzTmFtZV0gPSB0eXBlO1xuICB9XG4gIHJldHVybiB0eXBlO1xufTtcblxuLyoqXG4gKiBTZXR1cCBhIENTUyB0cmFuc2l0aW9uZW5kL2FuaW1hdGlvbmVuZCBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxucCQxLnNldHVwQ3NzQ2IgPSBmdW5jdGlvbiAoZXZlbnQsIGNiKSB7XG4gIHRoaXMucGVuZGluZ0Nzc0V2ZW50ID0gZXZlbnQ7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGVsID0gdGhpcy5lbDtcbiAgdmFyIG9uRW5kID0gdGhpcy5wZW5kaW5nQ3NzQ2IgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgIG9mZihlbCwgZXZlbnQsIG9uRW5kKTtcbiAgICAgIHNlbGYucGVuZGluZ0Nzc0V2ZW50ID0gc2VsZi5wZW5kaW5nQ3NzQ2IgPSBudWxsO1xuICAgICAgaWYgKCFzZWxmLnBlbmRpbmdKc0NiICYmIGNiKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBvbihlbCwgZXZlbnQsIG9uRW5kKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gZWxlbWVudCBpcyBoaWRkZW4gLSBpbiB0aGF0IGNhc2Ugd2UgY2FuIGp1c3RcbiAqIHNraXAgdGhlIHRyYW5zaXRpb24gYWxsdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBpc0hpZGRlbihlbCkge1xuICBpZiAoL3N2ZyQvLnRlc3QoZWwubmFtZXNwYWNlVVJJKSkge1xuICAgIC8vIFNWRyBlbGVtZW50cyBkbyBub3QgaGF2ZSBvZmZzZXQoV2lkdGh8SGVpZ2h0KVxuICAgIC8vIHNvIHdlIG5lZWQgdG8gY2hlY2sgdGhlIGNsaWVudCByZWN0XG4gICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gIShyZWN0LndpZHRoIHx8IHJlY3QuaGVpZ2h0KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gIShlbC5vZmZzZXRXaWR0aCB8fCBlbC5vZmZzZXRIZWlnaHQgfHwgZWwuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGgpO1xuICB9XG59XG5cbnZhciB0cmFuc2l0aW9uJDEgPSB7XG5cbiAgcHJpb3JpdHk6IFRSQU5TSVRJT04sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoaWQsIG9sZElkKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICAvLyByZXNvbHZlIG9uIG93bmVyIHZtXG4gICAgdmFyIGhvb2tzID0gcmVzb2x2ZUFzc2V0KHRoaXMudm0uJG9wdGlvbnMsICd0cmFuc2l0aW9ucycsIGlkKTtcbiAgICBpZCA9IGlkIHx8ICd2JztcbiAgICBlbC5fX3ZfdHJhbnMgPSBuZXcgVHJhbnNpdGlvbihlbCwgaWQsIGhvb2tzLCB0aGlzLnZtKTtcbiAgICBpZiAob2xkSWQpIHtcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBvbGRJZCArICctdHJhbnNpdGlvbicpO1xuICAgIH1cbiAgICBhZGRDbGFzcyhlbCwgaWQgKyAnLXRyYW5zaXRpb24nKTtcbiAgfVxufTtcblxudmFyIGludGVybmFsRGlyZWN0aXZlcyA9IHtcbiAgc3R5bGU6IHN0eWxlLFxuICAnY2xhc3MnOiB2Q2xhc3MsXG4gIGNvbXBvbmVudDogY29tcG9uZW50LFxuICBwcm9wOiBwcm9wRGVmLFxuICB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uJDFcbn07XG5cbi8vIHNwZWNpYWwgYmluZGluZyBwcmVmaXhlc1xudmFyIGJpbmRSRSA9IC9edi1iaW5kOnxeOi87XG52YXIgb25SRSA9IC9edi1vbjp8XkAvO1xudmFyIGRpckF0dHJSRSA9IC9edi0oW146XSspKD86JHw6KC4qKSQpLztcbnZhciBtb2RpZmllclJFID0gL1xcLlteXFwuXSsvZztcbnZhciB0cmFuc2l0aW9uUkUgPSAvXih2LWJpbmQ6fDopP3RyYW5zaXRpb24kLztcblxuLy8gZGVmYXVsdCBkaXJlY3RpdmUgcHJpb3JpdHlcbnZhciBERUZBVUxUX1BSSU9SSVRZID0gMTAwMDtcbnZhciBERUZBVUxUX1RFUk1JTkFMX1BSSU9SSVRZID0gMjAwMDtcblxuLyoqXG4gKiBDb21waWxlIGEgdGVtcGxhdGUgYW5kIHJldHVybiBhIHJldXNhYmxlIGNvbXBvc2l0ZSBsaW5rXG4gKiBmdW5jdGlvbiwgd2hpY2ggcmVjdXJzaXZlbHkgY29udGFpbnMgbW9yZSBsaW5rIGZ1bmN0aW9uc1xuICogaW5zaWRlLiBUaGlzIHRvcCBsZXZlbCBjb21waWxlIGZ1bmN0aW9uIHdvdWxkIG5vcm1hbGx5XG4gKiBiZSBjYWxsZWQgb24gaW5zdGFuY2Ugcm9vdCBub2RlcywgYnV0IGNhbiBhbHNvIGJlIHVzZWRcbiAqIGZvciBwYXJ0aWFsIGNvbXBpbGF0aW9uIGlmIHRoZSBwYXJ0aWFsIGFyZ3VtZW50IGlzIHRydWUuXG4gKlxuICogVGhlIHJldHVybmVkIGNvbXBvc2l0ZSBsaW5rIGZ1bmN0aW9uLCB3aGVuIGNhbGxlZCwgd2lsbFxuICogcmV0dXJuIGFuIHVubGluayBmdW5jdGlvbiB0aGF0IHRlYXJzZG93biBhbGwgZGlyZWN0aXZlc1xuICogY3JlYXRlZCBkdXJpbmcgdGhlIGxpbmtpbmcgcGhhc2UuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBwYXJ0aWFsXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlKGVsLCBvcHRpb25zLCBwYXJ0aWFsKSB7XG4gIC8vIGxpbmsgZnVuY3Rpb24gZm9yIHRoZSBub2RlIGl0c2VsZi5cbiAgdmFyIG5vZGVMaW5rRm4gPSBwYXJ0aWFsIHx8ICFvcHRpb25zLl9hc0NvbXBvbmVudCA/IGNvbXBpbGVOb2RlKGVsLCBvcHRpb25zKSA6IG51bGw7XG4gIC8vIGxpbmsgZnVuY3Rpb24gZm9yIHRoZSBjaGlsZE5vZGVzXG4gIHZhciBjaGlsZExpbmtGbiA9ICEobm9kZUxpbmtGbiAmJiBub2RlTGlua0ZuLnRlcm1pbmFsKSAmJiBlbC50YWdOYW1lICE9PSAnU0NSSVBUJyAmJiBlbC5oYXNDaGlsZE5vZGVzKCkgPyBjb21waWxlTm9kZUxpc3QoZWwuY2hpbGROb2Rlcywgb3B0aW9ucykgOiBudWxsO1xuXG4gIC8qKlxuICAgKiBBIGNvbXBvc2l0ZSBsaW5rZXIgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGEgYWxyZWFkeVxuICAgKiBjb21waWxlZCBwaWVjZSBvZiBET00sIHdoaWNoIGluc3RhbnRpYXRlcyBhbGwgZGlyZWN0aXZlXG4gICAqIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICAgKiBAcGFyYW0ge1Z1ZX0gW2hvc3RdIC0gaG9zdCB2bSBvZiB0cmFuc2NsdWRlZCBjb250ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc2NvcGVdIC0gdi1mb3Igc2NvcGVcbiAgICogQHBhcmFtIHtGcmFnbWVudH0gW2ZyYWddIC0gbGluayBjb250ZXh0IGZyYWdtZW50XG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAgICovXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBvc2l0ZUxpbmtGbih2bSwgZWwsIGhvc3QsIHNjb3BlLCBmcmFnKSB7XG4gICAgLy8gY2FjaGUgY2hpbGROb2RlcyBiZWZvcmUgbGlua2luZyBwYXJlbnQsIGZpeCAjNjU3XG4gICAgdmFyIGNoaWxkTm9kZXMgPSB0b0FycmF5KGVsLmNoaWxkTm9kZXMpO1xuICAgIC8vIGxpbmtcbiAgICB2YXIgZGlycyA9IGxpbmtBbmRDYXB0dXJlKGZ1bmN0aW9uIGNvbXBvc2l0ZUxpbmtDYXB0dXJlcigpIHtcbiAgICAgIGlmIChub2RlTGlua0ZuKSBub2RlTGlua0ZuKHZtLCBlbCwgaG9zdCwgc2NvcGUsIGZyYWcpO1xuICAgICAgaWYgKGNoaWxkTGlua0ZuKSBjaGlsZExpbmtGbih2bSwgY2hpbGROb2RlcywgaG9zdCwgc2NvcGUsIGZyYWcpO1xuICAgIH0sIHZtKTtcbiAgICByZXR1cm4gbWFrZVVubGlua0ZuKHZtLCBkaXJzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBBcHBseSBhIGxpbmtlciB0byBhIHZtL2VsZW1lbnQgcGFpciBhbmQgY2FwdHVyZSB0aGVcbiAqIGRpcmVjdGl2ZXMgY3JlYXRlZCBkdXJpbmcgdGhlIHByb2Nlc3MuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlua2VyXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5mdW5jdGlvbiBsaW5rQW5kQ2FwdHVyZShsaW5rZXIsIHZtKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIHJlc2V0IGRpcmVjdGl2ZXMgYmVmb3JlIGV2ZXJ5IGNhcHR1cmUgaW4gcHJvZHVjdGlvblxuICAgIC8vIG1vZGUsIHNvIHRoYXQgd2hlbiB1bmxpbmtpbmcgd2UgZG9uJ3QgbmVlZCB0byBzcGxpY2VcbiAgICAvLyB0aGVtIG91dCAod2hpY2ggdHVybnMgb3V0IHRvIGJlIGEgcGVyZiBoaXQpLlxuICAgIC8vIHRoZXkgYXJlIGtlcHQgaW4gZGV2ZWxvcG1lbnQgbW9kZSBiZWNhdXNlIHRoZXkgYXJlXG4gICAgLy8gdXNlZnVsIGZvciBWdWUncyBvd24gdGVzdHMuXG4gICAgdm0uX2RpcmVjdGl2ZXMgPSBbXTtcbiAgfVxuICB2YXIgb3JpZ2luYWxEaXJDb3VudCA9IHZtLl9kaXJlY3RpdmVzLmxlbmd0aDtcbiAgbGlua2VyKCk7XG4gIHZhciBkaXJzID0gdm0uX2RpcmVjdGl2ZXMuc2xpY2Uob3JpZ2luYWxEaXJDb3VudCk7XG4gIGRpcnMuc29ydChkaXJlY3RpdmVDb21wYXJhdG9yKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBkaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGRpcnNbaV0uX2JpbmQoKTtcbiAgfVxuICByZXR1cm4gZGlycztcbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgcHJpb3JpdHkgc29ydCBjb21wYXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKi9cblxuZnVuY3Rpb24gZGlyZWN0aXZlQ29tcGFyYXRvcihhLCBiKSB7XG4gIGEgPSBhLmRlc2NyaXB0b3IuZGVmLnByaW9yaXR5IHx8IERFRkFVTFRfUFJJT1JJVFk7XG4gIGIgPSBiLmRlc2NyaXB0b3IuZGVmLnByaW9yaXR5IHx8IERFRkFVTFRfUFJJT1JJVFk7XG4gIHJldHVybiBhID4gYiA/IC0xIDogYSA9PT0gYiA/IDAgOiAxO1xufVxuXG4vKipcbiAqIExpbmtlciBmdW5jdGlvbnMgcmV0dXJuIGFuIHVubGluayBmdW5jdGlvbiB0aGF0XG4gKiB0ZWFyc2Rvd24gYWxsIGRpcmVjdGl2ZXMgaW5zdGFuY2VzIGdlbmVyYXRlZCBkdXJpbmdcbiAqIHRoZSBwcm9jZXNzLlxuICpcbiAqIFdlIGNyZWF0ZSB1bmxpbmsgZnVuY3Rpb25zIHdpdGggb25seSB0aGUgbmVjZXNzYXJ5XG4gKiBpbmZvcm1hdGlvbiB0byBhdm9pZCByZXRhaW5pbmcgYWRkaXRpb25hbCBjbG9zdXJlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7QXJyYXl9IGRpcnNcbiAqIEBwYXJhbSB7VnVlfSBbY29udGV4dF1cbiAqIEBwYXJhbSB7QXJyYXl9IFtjb250ZXh0RGlyc11cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIG1ha2VVbmxpbmtGbih2bSwgZGlycywgY29udGV4dCwgY29udGV4dERpcnMpIHtcbiAgZnVuY3Rpb24gdW5saW5rKGRlc3Ryb3lpbmcpIHtcbiAgICB0ZWFyZG93bkRpcnModm0sIGRpcnMsIGRlc3Ryb3lpbmcpO1xuICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHREaXJzKSB7XG4gICAgICB0ZWFyZG93bkRpcnMoY29udGV4dCwgY29udGV4dERpcnMpO1xuICAgIH1cbiAgfVxuICAvLyBleHBvc2UgbGlua2VkIGRpcmVjdGl2ZXNcbiAgdW5saW5rLmRpcnMgPSBkaXJzO1xuICByZXR1cm4gdW5saW5rO1xufVxuXG4vKipcbiAqIFRlYXJkb3duIHBhcnRpYWwgbGlua2VkIGRpcmVjdGl2ZXMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0FycmF5fSBkaXJzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlc3Ryb3lpbmdcbiAqL1xuXG5mdW5jdGlvbiB0ZWFyZG93bkRpcnModm0sIGRpcnMsIGRlc3Ryb3lpbmcpIHtcbiAgdmFyIGkgPSBkaXJzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIGRpcnNbaV0uX3RlYXJkb3duKCk7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgIWRlc3Ryb3lpbmcpIHtcbiAgICAgIHZtLl9kaXJlY3RpdmVzLiRyZW1vdmUoZGlyc1tpXSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBsaW5rIHByb3BzIG9uIGFuIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge09iamVjdH0gW3Njb3BlXVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZUFuZExpbmtQcm9wcyh2bSwgZWwsIHByb3BzLCBzY29wZSkge1xuICB2YXIgcHJvcHNMaW5rRm4gPSBjb21waWxlUHJvcHMoZWwsIHByb3BzKTtcbiAgdmFyIHByb3BEaXJzID0gbGlua0FuZENhcHR1cmUoZnVuY3Rpb24gKCkge1xuICAgIHByb3BzTGlua0ZuKHZtLCBzY29wZSk7XG4gIH0sIHZtKTtcbiAgcmV0dXJuIG1ha2VVbmxpbmtGbih2bSwgcHJvcERpcnMpO1xufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIHJvb3QgZWxlbWVudCBvZiBhbiBpbnN0YW5jZS5cbiAqXG4gKiAxLiBhdHRycyBvbiBjb250ZXh0IGNvbnRhaW5lciAoY29udGV4dCBzY29wZSlcbiAqIDIuIGF0dHJzIG9uIHRoZSBjb21wb25lbnQgdGVtcGxhdGUgcm9vdCBub2RlLCBpZlxuICogICAgcmVwbGFjZTp0cnVlIChjaGlsZCBzY29wZSlcbiAqXG4gKiBJZiB0aGlzIGlzIGEgZnJhZ21lbnQgaW5zdGFuY2UsIHdlIG9ubHkgbmVlZCB0byBjb21waWxlIDEuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0T3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVJvb3QoZWwsIG9wdGlvbnMsIGNvbnRleHRPcHRpb25zKSB7XG4gIHZhciBjb250YWluZXJBdHRycyA9IG9wdGlvbnMuX2NvbnRhaW5lckF0dHJzO1xuICB2YXIgcmVwbGFjZXJBdHRycyA9IG9wdGlvbnMuX3JlcGxhY2VyQXR0cnM7XG4gIHZhciBjb250ZXh0TGlua0ZuLCByZXBsYWNlckxpbmtGbjtcblxuICAvLyBvbmx5IG5lZWQgdG8gY29tcGlsZSBvdGhlciBhdHRyaWJ1dGVzIGZvclxuICAvLyBub24tZnJhZ21lbnQgaW5zdGFuY2VzXG4gIGlmIChlbC5ub2RlVHlwZSAhPT0gMTEpIHtcbiAgICAvLyBmb3IgY29tcG9uZW50cywgY29udGFpbmVyIGFuZCByZXBsYWNlciBuZWVkIHRvIGJlXG4gICAgLy8gY29tcGlsZWQgc2VwYXJhdGVseSBhbmQgbGlua2VkIGluIGRpZmZlcmVudCBzY29wZXMuXG4gICAgaWYgKG9wdGlvbnMuX2FzQ29tcG9uZW50KSB7XG4gICAgICAvLyAyLiBjb250YWluZXIgYXR0cmlidXRlc1xuICAgICAgaWYgKGNvbnRhaW5lckF0dHJzICYmIGNvbnRleHRPcHRpb25zKSB7XG4gICAgICAgIGNvbnRleHRMaW5rRm4gPSBjb21waWxlRGlyZWN0aXZlcyhjb250YWluZXJBdHRycywgY29udGV4dE9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcGxhY2VyQXR0cnMpIHtcbiAgICAgICAgLy8gMy4gcmVwbGFjZXIgYXR0cmlidXRlc1xuICAgICAgICByZXBsYWNlckxpbmtGbiA9IGNvbXBpbGVEaXJlY3RpdmVzKHJlcGxhY2VyQXR0cnMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub24tY29tcG9uZW50LCBqdXN0IGNvbXBpbGUgYXMgYSBub3JtYWwgZWxlbWVudC5cbiAgICAgIHJlcGxhY2VyTGlua0ZuID0gY29tcGlsZURpcmVjdGl2ZXMoZWwuYXR0cmlidXRlcywgb3B0aW9ucyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgY29udGFpbmVyQXR0cnMpIHtcbiAgICAvLyB3YXJuIGNvbnRhaW5lciBkaXJlY3RpdmVzIGZvciBmcmFnbWVudCBpbnN0YW5jZXNcbiAgICB2YXIgbmFtZXMgPSBjb250YWluZXJBdHRycy5maWx0ZXIoZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgIC8vIGFsbG93IHZ1ZS1sb2FkZXIvdnVlaWZ5IHNjb3BlZCBjc3MgYXR0cmlidXRlc1xuICAgICAgcmV0dXJuIGF0dHIubmFtZS5pbmRleE9mKCdfdi0nKSA8IDAgJiZcbiAgICAgIC8vIGFsbG93IGV2ZW50IGxpc3RlbmVyc1xuICAgICAgIW9uUkUudGVzdChhdHRyLm5hbWUpICYmXG4gICAgICAvLyBhbGxvdyBzbG90c1xuICAgICAgYXR0ci5uYW1lICE9PSAnc2xvdCc7XG4gICAgfSkubWFwKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICByZXR1cm4gJ1wiJyArIGF0dHIubmFtZSArICdcIic7XG4gICAgfSk7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgdmFyIHBsdXJhbCA9IG5hbWVzLmxlbmd0aCA+IDE7XG4gICAgICB3YXJuKCdBdHRyaWJ1dGUnICsgKHBsdXJhbCA/ICdzICcgOiAnICcpICsgbmFtZXMuam9pbignLCAnKSArIChwbHVyYWwgPyAnIGFyZScgOiAnIGlzJykgKyAnIGlnbm9yZWQgb24gY29tcG9uZW50ICcgKyAnPCcgKyBvcHRpb25zLmVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSArICc+IGJlY2F1c2UgJyArICd0aGUgY29tcG9uZW50IGlzIGEgZnJhZ21lbnQgaW5zdGFuY2U6ICcgKyAnaHR0cDovL3Z1ZWpzLm9yZy9ndWlkZS9jb21wb25lbnRzLmh0bWwjRnJhZ21lbnRfSW5zdGFuY2UnKTtcbiAgICB9XG4gIH1cblxuICBvcHRpb25zLl9jb250YWluZXJBdHRycyA9IG9wdGlvbnMuX3JlcGxhY2VyQXR0cnMgPSBudWxsO1xuICByZXR1cm4gZnVuY3Rpb24gcm9vdExpbmtGbih2bSwgZWwsIHNjb3BlKSB7XG4gICAgLy8gbGluayBjb250ZXh0IHNjb3BlIGRpcnNcbiAgICB2YXIgY29udGV4dCA9IHZtLl9jb250ZXh0O1xuICAgIHZhciBjb250ZXh0RGlycztcbiAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0TGlua0ZuKSB7XG4gICAgICBjb250ZXh0RGlycyA9IGxpbmtBbmRDYXB0dXJlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGV4dExpbmtGbihjb250ZXh0LCBlbCwgbnVsbCwgc2NvcGUpO1xuICAgICAgfSwgY29udGV4dCk7XG4gICAgfVxuXG4gICAgLy8gbGluayBzZWxmXG4gICAgdmFyIHNlbGZEaXJzID0gbGlua0FuZENhcHR1cmUoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcGxhY2VyTGlua0ZuKSByZXBsYWNlckxpbmtGbih2bSwgZWwpO1xuICAgIH0sIHZtKTtcblxuICAgIC8vIHJldHVybiB0aGUgdW5saW5rIGZ1bmN0aW9uIHRoYXQgdGVhcnNkb3duIGNvbnRleHRcbiAgICAvLyBjb250YWluZXIgZGlyZWN0aXZlcy5cbiAgICByZXR1cm4gbWFrZVVubGlua0ZuKHZtLCBzZWxmRGlycywgY29udGV4dCwgY29udGV4dERpcnMpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbXBpbGUgYSBub2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuIGJhc2VkIG9uIHRoZVxuICogbm9kZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGUobm9kZSwgb3B0aW9ucykge1xuICB2YXIgdHlwZSA9IG5vZGUubm9kZVR5cGU7XG4gIGlmICh0eXBlID09PSAxICYmIG5vZGUudGFnTmFtZSAhPT0gJ1NDUklQVCcpIHtcbiAgICByZXR1cm4gY29tcGlsZUVsZW1lbnQobm9kZSwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gMyAmJiBub2RlLmRhdGEudHJpbSgpKSB7XG4gICAgcmV0dXJuIGNvbXBpbGVUZXh0Tm9kZShub2RlLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYW4gZWxlbWVudCBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRWxlbWVudChlbCwgb3B0aW9ucykge1xuICAvLyBwcmVwcm9jZXNzIHRleHRhcmVhcy5cbiAgLy8gdGV4dGFyZWEgdHJlYXRzIGl0cyB0ZXh0IGNvbnRlbnQgYXMgdGhlIGluaXRpYWwgdmFsdWUuXG4gIC8vIGp1c3QgYmluZCBpdCBhcyBhbiBhdHRyIGRpcmVjdGl2ZSBmb3IgdmFsdWUuXG4gIGlmIChlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgdmFyIHRva2VucyA9IHBhcnNlVGV4dChlbC52YWx1ZSk7XG4gICAgaWYgKHRva2Vucykge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCc6dmFsdWUnLCB0b2tlbnNUb0V4cCh0b2tlbnMpKTtcbiAgICAgIGVsLnZhbHVlID0gJyc7XG4gICAgfVxuICB9XG4gIHZhciBsaW5rRm47XG4gIHZhciBoYXNBdHRycyA9IGVsLmhhc0F0dHJpYnV0ZXMoKTtcbiAgdmFyIGF0dHJzID0gaGFzQXR0cnMgJiYgdG9BcnJheShlbC5hdHRyaWJ1dGVzKTtcbiAgLy8gY2hlY2sgdGVybWluYWwgZGlyZWN0aXZlcyAoZm9yICYgaWYpXG4gIGlmIChoYXNBdHRycykge1xuICAgIGxpbmtGbiA9IGNoZWNrVGVybWluYWxEaXJlY3RpdmVzKGVsLCBhdHRycywgb3B0aW9ucyk7XG4gIH1cbiAgLy8gY2hlY2sgZWxlbWVudCBkaXJlY3RpdmVzXG4gIGlmICghbGlua0ZuKSB7XG4gICAgbGlua0ZuID0gY2hlY2tFbGVtZW50RGlyZWN0aXZlcyhlbCwgb3B0aW9ucyk7XG4gIH1cbiAgLy8gY2hlY2sgY29tcG9uZW50XG4gIGlmICghbGlua0ZuKSB7XG4gICAgbGlua0ZuID0gY2hlY2tDb21wb25lbnQoZWwsIG9wdGlvbnMpO1xuICB9XG4gIC8vIG5vcm1hbCBkaXJlY3RpdmVzXG4gIGlmICghbGlua0ZuICYmIGhhc0F0dHJzKSB7XG4gICAgbGlua0ZuID0gY29tcGlsZURpcmVjdGl2ZXMoYXR0cnMsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBsaW5rRm47XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIHRleHROb2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7VGV4dE5vZGV9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnxudWxsfSB0ZXh0Tm9kZUxpbmtGblxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVUZXh0Tm9kZShub2RlLCBvcHRpb25zKSB7XG4gIC8vIHNraXAgbWFya2VkIHRleHQgbm9kZXNcbiAgaWYgKG5vZGUuX3NraXApIHtcbiAgICByZXR1cm4gcmVtb3ZlVGV4dDtcbiAgfVxuXG4gIHZhciB0b2tlbnMgPSBwYXJzZVRleHQobm9kZS53aG9sZVRleHQpO1xuICBpZiAoIXRva2Vucykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gbWFyayBhZGphY2VudCB0ZXh0IG5vZGVzIGFzIHNraXBwZWQsXG4gIC8vIGJlY2F1c2Ugd2UgYXJlIHVzaW5nIG5vZGUud2hvbGVUZXh0IHRvIGNvbXBpbGVcbiAgLy8gYWxsIGFkamFjZW50IHRleHQgbm9kZXMgdG9nZXRoZXIuIFRoaXMgZml4ZXNcbiAgLy8gaXNzdWVzIGluIElFIHdoZXJlIHNvbWV0aW1lcyBpdCBzcGxpdHMgdXAgYSBzaW5nbGVcbiAgLy8gdGV4dCBub2RlIGludG8gbXVsdGlwbGUgb25lcy5cbiAgdmFyIG5leHQgPSBub2RlLm5leHRTaWJsaW5nO1xuICB3aGlsZSAobmV4dCAmJiBuZXh0Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgbmV4dC5fc2tpcCA9IHRydWU7XG4gICAgbmV4dCA9IG5leHQubmV4dFNpYmxpbmc7XG4gIH1cblxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGVsLCB0b2tlbjtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgZWwgPSB0b2tlbi50YWcgPyBwcm9jZXNzVGV4dFRva2VuKHRva2VuLCBvcHRpb25zKSA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKTtcbiAgICBmcmFnLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuICByZXR1cm4gbWFrZVRleHROb2RlTGlua0ZuKHRva2VucywgZnJhZywgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogTGlua2VyIGZvciBhbiBza2lwcGVkIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7VGV4dH0gbm9kZVxuICovXG5cbmZ1bmN0aW9uIHJlbW92ZVRleHQodm0sIG5vZGUpIHtcbiAgcmVtb3ZlKG5vZGUpO1xufVxuXG4vKipcbiAqIFByb2Nlc3MgYSBzaW5nbGUgdGV4dCB0b2tlbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3NUZXh0VG9rZW4odG9rZW4sIG9wdGlvbnMpIHtcbiAgdmFyIGVsO1xuICBpZiAodG9rZW4ub25lVGltZSkge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaHRtbCcpO1xuICAgICAgc2V0VG9rZW5UeXBlKCdodG1sJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElFIHdpbGwgY2xlYW4gdXAgZW1wdHkgdGV4dE5vZGVzIGR1cmluZ1xuICAgICAgLy8gZnJhZy5jbG9uZU5vZGUodHJ1ZSksIHNvIHdlIGhhdmUgdG8gZ2l2ZSBpdFxuICAgICAgLy8gc29tZXRoaW5nIGhlcmUuLi5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKTtcbiAgICAgIHNldFRva2VuVHlwZSgndGV4dCcpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXRUb2tlblR5cGUodHlwZSkge1xuICAgIGlmICh0b2tlbi5kZXNjcmlwdG9yKSByZXR1cm47XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlRGlyZWN0aXZlKHRva2VuLnZhbHVlKTtcbiAgICB0b2tlbi5kZXNjcmlwdG9yID0ge1xuICAgICAgbmFtZTogdHlwZSxcbiAgICAgIGRlZjogZGlyZWN0aXZlc1t0eXBlXSxcbiAgICAgIGV4cHJlc3Npb246IHBhcnNlZC5leHByZXNzaW9uLFxuICAgICAgZmlsdGVyczogcGFyc2VkLmZpbHRlcnNcbiAgICB9O1xuICB9XG4gIHJldHVybiBlbDtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIGZ1bmN0aW9uIHRoYXQgcHJvY2Vzc2VzIGEgdGV4dE5vZGUuXG4gKlxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSB0b2tlbnNcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gZnJhZ1xuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXh0Tm9kZUxpbmtGbih0b2tlbnMsIGZyYWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRleHROb2RlTGlua0ZuKHZtLCBlbCwgaG9zdCwgc2NvcGUpIHtcbiAgICB2YXIgZnJhZ0Nsb25lID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgdmFyIGNoaWxkTm9kZXMgPSB0b0FycmF5KGZyYWdDbG9uZS5jaGlsZE5vZGVzKTtcbiAgICB2YXIgdG9rZW4sIHZhbHVlLCBub2RlO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICB2YWx1ZSA9IHRva2VuLnZhbHVlO1xuICAgICAgaWYgKHRva2VuLnRhZykge1xuICAgICAgICBub2RlID0gY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgaWYgKHRva2VuLm9uZVRpbWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IChzY29wZSB8fCB2bSkuJGV2YWwodmFsdWUpO1xuICAgICAgICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICAgICAgICByZXBsYWNlKG5vZGUsIHBhcnNlVGVtcGxhdGUodmFsdWUsIHRydWUpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZtLl9iaW5kRGlyKHRva2VuLmRlc2NyaXB0b3IsIG5vZGUsIGhvc3QsIHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXBsYWNlKGVsLCBmcmFnQ2xvbmUpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbXBpbGUgYSBub2RlIGxpc3QgYW5kIHJldHVybiBhIGNoaWxkTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R9IG5vZGVMaXN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVOb2RlTGlzdChub2RlTGlzdCwgb3B0aW9ucykge1xuICB2YXIgbGlua0ZucyA9IFtdO1xuICB2YXIgbm9kZUxpbmtGbiwgY2hpbGRMaW5rRm4sIG5vZGU7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZUxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgbm9kZSA9IG5vZGVMaXN0W2ldO1xuICAgIG5vZGVMaW5rRm4gPSBjb21waWxlTm9kZShub2RlLCBvcHRpb25zKTtcbiAgICBjaGlsZExpbmtGbiA9ICEobm9kZUxpbmtGbiAmJiBub2RlTGlua0ZuLnRlcm1pbmFsKSAmJiBub2RlLnRhZ05hbWUgIT09ICdTQ1JJUFQnICYmIG5vZGUuaGFzQ2hpbGROb2RlcygpID8gY29tcGlsZU5vZGVMaXN0KG5vZGUuY2hpbGROb2Rlcywgb3B0aW9ucykgOiBudWxsO1xuICAgIGxpbmtGbnMucHVzaChub2RlTGlua0ZuLCBjaGlsZExpbmtGbik7XG4gIH1cbiAgcmV0dXJuIGxpbmtGbnMubGVuZ3RoID8gbWFrZUNoaWxkTGlua0ZuKGxpbmtGbnMpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBNYWtlIGEgY2hpbGQgbGluayBmdW5jdGlvbiBmb3IgYSBub2RlJ3MgY2hpbGROb2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gbGlua0Zuc1xuICogQHJldHVybiB7RnVuY3Rpb259IGNoaWxkTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZUNoaWxkTGlua0ZuKGxpbmtGbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNoaWxkTGlua0ZuKHZtLCBub2RlcywgaG9zdCwgc2NvcGUsIGZyYWcpIHtcbiAgICB2YXIgbm9kZSwgbm9kZUxpbmtGbiwgY2hpbGRyZW5MaW5rRm47XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSAwLCBsID0gbGlua0Zucy5sZW5ndGg7IGkgPCBsOyBuKyspIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tuXTtcbiAgICAgIG5vZGVMaW5rRm4gPSBsaW5rRm5zW2krK107XG4gICAgICBjaGlsZHJlbkxpbmtGbiA9IGxpbmtGbnNbaSsrXTtcbiAgICAgIC8vIGNhY2hlIGNoaWxkTm9kZXMgYmVmb3JlIGxpbmtpbmcgcGFyZW50LCBmaXggIzY1N1xuICAgICAgdmFyIGNoaWxkTm9kZXMgPSB0b0FycmF5KG5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICBpZiAobm9kZUxpbmtGbikge1xuICAgICAgICBub2RlTGlua0ZuKHZtLCBub2RlLCBob3N0LCBzY29wZSwgZnJhZyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRyZW5MaW5rRm4pIHtcbiAgICAgICAgY2hpbGRyZW5MaW5rRm4odm0sIGNoaWxkTm9kZXMsIGhvc3QsIHNjb3BlLCBmcmFnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIGVsZW1lbnQgZGlyZWN0aXZlcyAoY3VzdG9tIGVsZW1lbnRzIHRoYXQgc2hvdWxkXG4gKiBiZSByZXNvdmxlZCBhcyB0ZXJtaW5hbCBkaXJlY3RpdmVzKS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5cbmZ1bmN0aW9uIGNoZWNrRWxlbWVudERpcmVjdGl2ZXMoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGNvbW1vblRhZ1JFLnRlc3QodGFnKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgZGVmID0gcmVzb2x2ZUFzc2V0KG9wdGlvbnMsICdlbGVtZW50RGlyZWN0aXZlcycsIHRhZyk7XG4gIGlmIChkZWYpIHtcbiAgICByZXR1cm4gbWFrZVRlcm1pbmFsTm9kZUxpbmtGbihlbCwgdGFnLCAnJywgb3B0aW9ucywgZGVmKTtcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgYSBjb21wb25lbnQuIElmIHllcywgcmV0dXJuXG4gKiBhIGNvbXBvbmVudCBsaW5rIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gY2hlY2tDb21wb25lbnQoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGNvbXBvbmVudCA9IGNoZWNrQ29tcG9uZW50QXR0cihlbCwgb3B0aW9ucyk7XG4gIGlmIChjb21wb25lbnQpIHtcbiAgICB2YXIgcmVmID0gZmluZFJlZihlbCk7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSB7XG4gICAgICBuYW1lOiAnY29tcG9uZW50JyxcbiAgICAgIHJlZjogcmVmLFxuICAgICAgZXhwcmVzc2lvbjogY29tcG9uZW50LmlkLFxuICAgICAgZGVmOiBpbnRlcm5hbERpcmVjdGl2ZXMuY29tcG9uZW50LFxuICAgICAgbW9kaWZpZXJzOiB7XG4gICAgICAgIGxpdGVyYWw6ICFjb21wb25lbnQuZHluYW1pY1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGNvbXBvbmVudExpbmtGbiA9IGZ1bmN0aW9uIGNvbXBvbmVudExpbmtGbih2bSwgZWwsIGhvc3QsIHNjb3BlLCBmcmFnKSB7XG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlYWN0aXZlKChzY29wZSB8fCB2bSkuJHJlZnMsIHJlZiwgbnVsbCk7XG4gICAgICB9XG4gICAgICB2bS5fYmluZERpcihkZXNjcmlwdG9yLCBlbCwgaG9zdCwgc2NvcGUsIGZyYWcpO1xuICAgIH07XG4gICAgY29tcG9uZW50TGlua0ZuLnRlcm1pbmFsID0gdHJ1ZTtcbiAgICByZXR1cm4gY29tcG9uZW50TGlua0ZuO1xuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgYW4gZWxlbWVudCBmb3IgdGVybWluYWwgZGlyZWN0aXZlcyBpbiBmaXhlZCBvcmRlci5cbiAqIElmIGl0IGZpbmRzIG9uZSwgcmV0dXJuIGEgdGVybWluYWwgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0FycmF5fSBhdHRyc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbmZ1bmN0aW9uIGNoZWNrVGVybWluYWxEaXJlY3RpdmVzKGVsLCBhdHRycywgb3B0aW9ucykge1xuICAvLyBza2lwIHYtcHJlXG4gIGlmIChnZXRBdHRyKGVsLCAndi1wcmUnKSAhPT0gbnVsbCkge1xuICAgIHJldHVybiBza2lwO1xuICB9XG4gIC8vIHNraXAgdi1lbHNlIGJsb2NrLCBidXQgb25seSBpZiBmb2xsb3dpbmcgdi1pZlxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCd2LWVsc2UnKSkge1xuICAgIHZhciBwcmV2ID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICBpZiAocHJldiAmJiBwcmV2Lmhhc0F0dHJpYnV0ZSgndi1pZicpKSB7XG4gICAgICByZXR1cm4gc2tpcDtcbiAgICB9XG4gIH1cblxuICB2YXIgYXR0ciwgbmFtZSwgdmFsdWUsIG1vZGlmaWVycywgbWF0Y2hlZCwgZGlyTmFtZSwgcmF3TmFtZSwgYXJnLCBkZWYsIHRlcm1EZWY7XG4gIGZvciAodmFyIGkgPSAwLCBqID0gYXR0cnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgYXR0ciA9IGF0dHJzW2ldO1xuICAgIG1vZGlmaWVycyA9IHBhcnNlTW9kaWZpZXJzKGF0dHIubmFtZSk7XG4gICAgbmFtZSA9IGF0dHIubmFtZS5yZXBsYWNlKG1vZGlmaWVyUkUsICcnKTtcbiAgICBpZiAobWF0Y2hlZCA9IG5hbWUubWF0Y2goZGlyQXR0clJFKSkge1xuICAgICAgZGVmID0gcmVzb2x2ZUFzc2V0KG9wdGlvbnMsICdkaXJlY3RpdmVzJywgbWF0Y2hlZFsxXSk7XG4gICAgICBpZiAoZGVmICYmIGRlZi50ZXJtaW5hbCkge1xuICAgICAgICBpZiAoIXRlcm1EZWYgfHwgKGRlZi5wcmlvcml0eSB8fCBERUZBVUxUX1RFUk1JTkFMX1BSSU9SSVRZKSA+IHRlcm1EZWYucHJpb3JpdHkpIHtcbiAgICAgICAgICB0ZXJtRGVmID0gZGVmO1xuICAgICAgICAgIHJhd05hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgICAgdmFsdWUgPSBhdHRyLnZhbHVlO1xuICAgICAgICAgIGRpck5hbWUgPSBtYXRjaGVkWzFdO1xuICAgICAgICAgIGFyZyA9IG1hdGNoZWRbMl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodGVybURlZikge1xuICAgIHJldHVybiBtYWtlVGVybWluYWxOb2RlTGlua0ZuKGVsLCBkaXJOYW1lLCB2YWx1ZSwgb3B0aW9ucywgdGVybURlZiwgcmF3TmFtZSwgYXJnLCBtb2RpZmllcnMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNraXAoKSB7fVxuc2tpcC50ZXJtaW5hbCA9IHRydWU7XG5cbi8qKlxuICogQnVpbGQgYSBub2RlIGxpbmsgZnVuY3Rpb24gZm9yIGEgdGVybWluYWwgZGlyZWN0aXZlLlxuICogQSB0ZXJtaW5hbCBsaW5rIGZ1bmN0aW9uIHRlcm1pbmF0ZXMgdGhlIGN1cnJlbnRcbiAqIGNvbXBpbGF0aW9uIHJlY3Vyc2lvbiBhbmQgaGFuZGxlcyBjb21waWxhdGlvbiBvZiB0aGVcbiAqIHN1YnRyZWUgaW4gdGhlIGRpcmVjdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IGRlZlxuICogQHBhcmFtIHtTdHJpbmd9IFtyYXdOYW1lXVxuICogQHBhcmFtIHtTdHJpbmd9IFthcmddXG4gKiBAcGFyYW0ge09iamVjdH0gW21vZGlmaWVyc11cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXJtaW5hbE5vZGVMaW5rRm4oZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zLCBkZWYsIHJhd05hbWUsIGFyZywgbW9kaWZpZXJzKSB7XG4gIHZhciBwYXJzZWQgPSBwYXJzZURpcmVjdGl2ZSh2YWx1ZSk7XG4gIHZhciBkZXNjcmlwdG9yID0ge1xuICAgIG5hbWU6IGRpck5hbWUsXG4gICAgYXJnOiBhcmcsXG4gICAgZXhwcmVzc2lvbjogcGFyc2VkLmV4cHJlc3Npb24sXG4gICAgZmlsdGVyczogcGFyc2VkLmZpbHRlcnMsXG4gICAgcmF3OiB2YWx1ZSxcbiAgICBhdHRyOiByYXdOYW1lLFxuICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLFxuICAgIGRlZjogZGVmXG4gIH07XG4gIC8vIGNoZWNrIHJlZiBmb3Igdi1mb3IgYW5kIHJvdXRlci12aWV3XG4gIGlmIChkaXJOYW1lID09PSAnZm9yJyB8fCBkaXJOYW1lID09PSAncm91dGVyLXZpZXcnKSB7XG4gICAgZGVzY3JpcHRvci5yZWYgPSBmaW5kUmVmKGVsKTtcbiAgfVxuICB2YXIgZm4gPSBmdW5jdGlvbiB0ZXJtaW5hbE5vZGVMaW5rRm4odm0sIGVsLCBob3N0LCBzY29wZSwgZnJhZykge1xuICAgIGlmIChkZXNjcmlwdG9yLnJlZikge1xuICAgICAgZGVmaW5lUmVhY3RpdmUoKHNjb3BlIHx8IHZtKS4kcmVmcywgZGVzY3JpcHRvci5yZWYsIG51bGwpO1xuICAgIH1cbiAgICB2bS5fYmluZERpcihkZXNjcmlwdG9yLCBlbCwgaG9zdCwgc2NvcGUsIGZyYWcpO1xuICB9O1xuICBmbi50ZXJtaW5hbCA9IHRydWU7XG4gIHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBDb21waWxlIHRoZSBkaXJlY3RpdmVzIG9uIGFuIGVsZW1lbnQgYW5kIHJldHVybiBhIGxpbmtlci5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fE5hbWVkTm9kZU1hcH0gYXR0cnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRGlyZWN0aXZlcyhhdHRycywgb3B0aW9ucykge1xuICB2YXIgaSA9IGF0dHJzLmxlbmd0aDtcbiAgdmFyIGRpcnMgPSBbXTtcbiAgdmFyIGF0dHIsIG5hbWUsIHZhbHVlLCByYXdOYW1lLCByYXdWYWx1ZSwgZGlyTmFtZSwgYXJnLCBtb2RpZmllcnMsIGRpckRlZiwgdG9rZW5zLCBtYXRjaGVkO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgYXR0ciA9IGF0dHJzW2ldO1xuICAgIG5hbWUgPSByYXdOYW1lID0gYXR0ci5uYW1lO1xuICAgIHZhbHVlID0gcmF3VmFsdWUgPSBhdHRyLnZhbHVlO1xuICAgIHRva2VucyA9IHBhcnNlVGV4dCh2YWx1ZSk7XG4gICAgLy8gcmVzZXQgYXJnXG4gICAgYXJnID0gbnVsbDtcbiAgICAvLyBjaGVjayBtb2RpZmllcnNcbiAgICBtb2RpZmllcnMgPSBwYXJzZU1vZGlmaWVycyhuYW1lKTtcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKG1vZGlmaWVyUkUsICcnKTtcblxuICAgIC8vIGF0dHJpYnV0ZSBpbnRlcnBvbGF0aW9uc1xuICAgIGlmICh0b2tlbnMpIHtcbiAgICAgIHZhbHVlID0gdG9rZW5zVG9FeHAodG9rZW5zKTtcbiAgICAgIGFyZyA9IG5hbWU7XG4gICAgICBwdXNoRGlyKCdiaW5kJywgZGlyZWN0aXZlcy5iaW5kLCB0b2tlbnMpO1xuICAgICAgLy8gd2FybiBhZ2FpbnN0IG1peGluZyBtdXN0YWNoZXMgd2l0aCB2LWJpbmRcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnICYmIEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwoYXR0cnMsIGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHIubmFtZSA9PT0gJzpjbGFzcycgfHwgYXR0ci5uYW1lID09PSAndi1iaW5kOmNsYXNzJztcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICB3YXJuKCdjbGFzcz1cIicgKyByYXdWYWx1ZSArICdcIjogRG8gbm90IG1peCBtdXN0YWNoZSBpbnRlcnBvbGF0aW9uICcgKyAnYW5kIHYtYmluZCBmb3IgXCJjbGFzc1wiIG9uIHRoZSBzYW1lIGVsZW1lbnQuIFVzZSBvbmUgb3IgdGhlIG90aGVyLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlXG5cbiAgICAgIC8vIHNwZWNpYWwgYXR0cmlidXRlOiB0cmFuc2l0aW9uXG4gICAgICBpZiAodHJhbnNpdGlvblJFLnRlc3QobmFtZSkpIHtcbiAgICAgICAgbW9kaWZpZXJzLmxpdGVyYWwgPSAhYmluZFJFLnRlc3QobmFtZSk7XG4gICAgICAgIHB1c2hEaXIoJ3RyYW5zaXRpb24nLCBpbnRlcm5hbERpcmVjdGl2ZXMudHJhbnNpdGlvbik7XG4gICAgICB9IGVsc2VcblxuICAgICAgICAvLyBldmVudCBoYW5kbGVyc1xuICAgICAgICBpZiAob25SRS50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgYXJnID0gbmFtZS5yZXBsYWNlKG9uUkUsICcnKTtcbiAgICAgICAgICBwdXNoRGlyKCdvbicsIGRpcmVjdGl2ZXMub24pO1xuICAgICAgICB9IGVsc2VcblxuICAgICAgICAgIC8vIGF0dHJpYnV0ZSBiaW5kaW5nc1xuICAgICAgICAgIGlmIChiaW5kUkUudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgZGlyTmFtZSA9IG5hbWUucmVwbGFjZShiaW5kUkUsICcnKTtcbiAgICAgICAgICAgIGlmIChkaXJOYW1lID09PSAnc3R5bGUnIHx8IGRpck5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgcHVzaERpcihkaXJOYW1lLCBpbnRlcm5hbERpcmVjdGl2ZXNbZGlyTmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYXJnID0gZGlyTmFtZTtcbiAgICAgICAgICAgICAgcHVzaERpcignYmluZCcsIGRpcmVjdGl2ZXMuYmluZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlXG5cbiAgICAgICAgICAgIC8vIG5vcm1hbCBkaXJlY3RpdmVzXG4gICAgICAgICAgICBpZiAobWF0Y2hlZCA9IG5hbWUubWF0Y2goZGlyQXR0clJFKSkge1xuICAgICAgICAgICAgICBkaXJOYW1lID0gbWF0Y2hlZFsxXTtcbiAgICAgICAgICAgICAgYXJnID0gbWF0Y2hlZFsyXTtcblxuICAgICAgICAgICAgICAvLyBza2lwIHYtZWxzZSAod2hlbiB1c2VkIHdpdGggdi1zaG93KVxuICAgICAgICAgICAgICBpZiAoZGlyTmFtZSA9PT0gJ2Vsc2UnKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBkaXJEZWYgPSByZXNvbHZlQXNzZXQob3B0aW9ucywgJ2RpcmVjdGl2ZXMnLCBkaXJOYW1lKTtcblxuICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGFzc2VydEFzc2V0KGRpckRlZiwgJ2RpcmVjdGl2ZScsIGRpck5hbWUpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGRpckRlZikge1xuICAgICAgICAgICAgICAgIHB1c2hEaXIoZGlyTmFtZSwgZGlyRGVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1c2ggYSBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkaXJOYW1lXG4gICAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBkZWZcbiAgICogQHBhcmFtIHtBcnJheX0gW2ludGVycFRva2Vuc11cbiAgICovXG5cbiAgZnVuY3Rpb24gcHVzaERpcihkaXJOYW1lLCBkZWYsIGludGVycFRva2Vucykge1xuICAgIHZhciBoYXNPbmVUaW1lVG9rZW4gPSBpbnRlcnBUb2tlbnMgJiYgaGFzT25lVGltZShpbnRlcnBUb2tlbnMpO1xuICAgIHZhciBwYXJzZWQgPSAhaGFzT25lVGltZVRva2VuICYmIHBhcnNlRGlyZWN0aXZlKHZhbHVlKTtcbiAgICBkaXJzLnB1c2goe1xuICAgICAgbmFtZTogZGlyTmFtZSxcbiAgICAgIGF0dHI6IHJhd05hbWUsXG4gICAgICByYXc6IHJhd1ZhbHVlLFxuICAgICAgZGVmOiBkZWYsXG4gICAgICBhcmc6IGFyZyxcbiAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLFxuICAgICAgLy8gY29udmVyc2lvbiBmcm9tIGludGVycG9sYXRpb24gc3RyaW5ncyB3aXRoIG9uZS10aW1lIHRva2VuXG4gICAgICAvLyB0byBleHByZXNzaW9uIGlzIGRpZmZlcmVkIHVudGlsIGRpcmVjdGl2ZSBiaW5kIHRpbWUgc28gdGhhdCB3ZVxuICAgICAgLy8gaGF2ZSBhY2Nlc3MgdG8gdGhlIGFjdHVhbCB2bSBjb250ZXh0IGZvciBvbmUtdGltZSBiaW5kaW5ncy5cbiAgICAgIGV4cHJlc3Npb246IHBhcnNlZCAmJiBwYXJzZWQuZXhwcmVzc2lvbixcbiAgICAgIGZpbHRlcnM6IHBhcnNlZCAmJiBwYXJzZWQuZmlsdGVycyxcbiAgICAgIGludGVycDogaW50ZXJwVG9rZW5zLFxuICAgICAgaGFzT25lVGltZTogaGFzT25lVGltZVRva2VuXG4gICAgfSk7XG4gIH1cblxuICBpZiAoZGlycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbWFrZU5vZGVMaW5rRm4oZGlycyk7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBtb2RpZmllcnMgZnJvbSBkaXJlY3RpdmUgYXR0cmlidXRlIG5hbWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZU1vZGlmaWVycyhuYW1lKSB7XG4gIHZhciByZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgbWF0Y2ggPSBuYW1lLm1hdGNoKG1vZGlmaWVyUkUpO1xuICBpZiAobWF0Y2gpIHtcbiAgICB2YXIgaSA9IG1hdGNoLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICByZXNbbWF0Y2hbaV0uc2xpY2UoMSldID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBCdWlsZCBhIGxpbmsgZnVuY3Rpb24gZm9yIGFsbCBkaXJlY3RpdmVzIG9uIGEgc2luZ2xlIG5vZGUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZGlyZWN0aXZlc1xuICogQHJldHVybiB7RnVuY3Rpb259IGRpcmVjdGl2ZXNMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBtYWtlTm9kZUxpbmtGbihkaXJlY3RpdmVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBub2RlTGlua0ZuKHZtLCBlbCwgaG9zdCwgc2NvcGUsIGZyYWcpIHtcbiAgICAvLyByZXZlcnNlIGFwcGx5IGJlY2F1c2UgaXQncyBzb3J0ZWQgbG93IHRvIGhpZ2hcbiAgICB2YXIgaSA9IGRpcmVjdGl2ZXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZtLl9iaW5kRGlyKGRpcmVjdGl2ZXNbaV0sIGVsLCBob3N0LCBzY29wZSwgZnJhZyk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGludGVycG9sYXRpb24gc3RyaW5nIGNvbnRhaW5zIG9uZS10aW1lIHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gaGFzT25lVGltZSh0b2tlbnMpIHtcbiAgdmFyIGkgPSB0b2tlbnMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHRva2Vuc1tpXS5vbmVUaW1lKSByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG52YXIgc3BlY2lhbENoYXJSRSA9IC9bXlxcd1xcLTpcXC5dLztcblxuLyoqXG4gKiBQcm9jZXNzIGFuIGVsZW1lbnQgb3IgYSBEb2N1bWVudEZyYWdtZW50IGJhc2VkIG9uIGFcbiAqIGluc3RhbmNlIG9wdGlvbiBvYmplY3QuIFRoaXMgYWxsb3dzIHVzIHRvIHRyYW5zY2x1ZGVcbiAqIGEgdGVtcGxhdGUgbm9kZS9mcmFnbWVudCBiZWZvcmUgdGhlIGluc3RhbmNlIGlzIGNyZWF0ZWQsXG4gKiBzbyB0aGUgcHJvY2Vzc2VkIGZyYWdtZW50IGNhbiB0aGVuIGJlIGNsb25lZCBhbmQgcmV1c2VkXG4gKiBpbiB2LWZvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIHRyYW5zY2x1ZGUoZWwsIG9wdGlvbnMpIHtcbiAgLy8gZXh0cmFjdCBjb250YWluZXIgYXR0cmlidXRlcyB0byBwYXNzIHRoZW0gZG93blxuICAvLyB0byBjb21waWxlciwgYmVjYXVzZSB0aGV5IG5lZWQgdG8gYmUgY29tcGlsZWQgaW5cbiAgLy8gcGFyZW50IHNjb3BlLiB3ZSBhcmUgbXV0YXRpbmcgdGhlIG9wdGlvbnMgb2JqZWN0IGhlcmVcbiAgLy8gYXNzdW1pbmcgdGhlIHNhbWUgb2JqZWN0IHdpbGwgYmUgdXNlZCBmb3IgY29tcGlsZVxuICAvLyByaWdodCBhZnRlciB0aGlzLlxuICBpZiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMuX2NvbnRhaW5lckF0dHJzID0gZXh0cmFjdEF0dHJzKGVsKTtcbiAgfVxuICAvLyBmb3IgdGVtcGxhdGUgdGFncywgd2hhdCB3ZSB3YW50IGlzIGl0cyBjb250ZW50IGFzXG4gIC8vIGEgZG9jdW1lbnRGcmFnbWVudCAoZm9yIGZyYWdtZW50IGluc3RhbmNlcylcbiAgaWYgKGlzVGVtcGxhdGUoZWwpKSB7XG4gICAgZWwgPSBwYXJzZVRlbXBsYXRlKGVsKTtcbiAgfVxuICBpZiAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLl9hc0NvbXBvbmVudCAmJiAhb3B0aW9ucy50ZW1wbGF0ZSkge1xuICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9ICc8c2xvdD48L3Nsb3Q+JztcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICAgIG9wdGlvbnMuX2NvbnRlbnQgPSBleHRyYWN0Q29udGVudChlbCk7XG4gICAgICBlbCA9IHRyYW5zY2x1ZGVUZW1wbGF0ZShlbCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG4gIGlmIChpc0ZyYWdtZW50KGVsKSkge1xuICAgIC8vIGFuY2hvcnMgZm9yIGZyYWdtZW50IGluc3RhbmNlXG4gICAgLy8gcGFzc2luZyBpbiBgcGVyc2lzdDogdHJ1ZWAgdG8gYXZvaWQgdGhlbSBiZWluZ1xuICAgIC8vIGRpc2NhcmRlZCBieSBJRSBkdXJpbmcgdGVtcGxhdGUgY2xvbmluZ1xuICAgIHByZXBlbmQoY3JlYXRlQW5jaG9yKCd2LXN0YXJ0JywgdHJ1ZSksIGVsKTtcbiAgICBlbC5hcHBlbmRDaGlsZChjcmVhdGVBbmNob3IoJ3YtZW5kJywgdHJ1ZSkpO1xuICB9XG4gIHJldHVybiBlbDtcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSB0ZW1wbGF0ZSBvcHRpb24uXG4gKiBJZiB0aGUgcmVwbGFjZSBvcHRpb24gaXMgdHJ1ZSB0aGlzIHdpbGwgc3dhcCB0aGUgJGVsLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZVRlbXBsYXRlKGVsLCBvcHRpb25zKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGU7XG4gIHZhciBmcmFnID0gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gIGlmIChmcmFnKSB7XG4gICAgdmFyIHJlcGxhY2VyID0gZnJhZy5maXJzdENoaWxkO1xuICAgIHZhciB0YWcgPSByZXBsYWNlci50YWdOYW1lICYmIHJlcGxhY2VyLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChlbCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ1lvdSBhcmUgbW91bnRpbmcgYW4gaW5zdGFuY2Ugd2l0aCBhIHRlbXBsYXRlIHRvICcgKyAnPGJvZHk+LiBUaGlzIHdpbGwgcmVwbGFjZSA8Ym9keT4gZW50aXJlbHkuIFlvdSAnICsgJ3Nob3VsZCBwcm9iYWJseSB1c2UgYHJlcGxhY2U6IGZhbHNlYCBoZXJlLicpO1xuICAgICAgfVxuICAgICAgLy8gdGhlcmUgYXJlIG1hbnkgY2FzZXMgd2hlcmUgdGhlIGluc3RhbmNlIG11c3RcbiAgICAgIC8vIGJlY29tZSBhIGZyYWdtZW50IGluc3RhbmNlOiBiYXNpY2FsbHkgYW55dGhpbmcgdGhhdFxuICAgICAgLy8gY2FuIGNyZWF0ZSBtb3JlIHRoYW4gMSByb290IG5vZGVzLlxuICAgICAgaWYgKFxuICAgICAgLy8gbXVsdGktY2hpbGRyZW4gdGVtcGxhdGVcbiAgICAgIGZyYWcuY2hpbGROb2Rlcy5sZW5ndGggPiAxIHx8XG4gICAgICAvLyBub24tZWxlbWVudCB0ZW1wbGF0ZVxuICAgICAgcmVwbGFjZXIubm9kZVR5cGUgIT09IDEgfHxcbiAgICAgIC8vIHNpbmdsZSBuZXN0ZWQgY29tcG9uZW50XG4gICAgICB0YWcgPT09ICdjb21wb25lbnQnIHx8IHJlc29sdmVBc3NldChvcHRpb25zLCAnY29tcG9uZW50cycsIHRhZykgfHwgaGFzQmluZEF0dHIocmVwbGFjZXIsICdpcycpIHx8XG4gICAgICAvLyBlbGVtZW50IGRpcmVjdGl2ZVxuICAgICAgcmVzb2x2ZUFzc2V0KG9wdGlvbnMsICdlbGVtZW50RGlyZWN0aXZlcycsIHRhZykgfHxcbiAgICAgIC8vIGZvciBibG9ja1xuICAgICAgcmVwbGFjZXIuaGFzQXR0cmlidXRlKCd2LWZvcicpIHx8XG4gICAgICAvLyBpZiBibG9ja1xuICAgICAgcmVwbGFjZXIuaGFzQXR0cmlidXRlKCd2LWlmJykpIHtcbiAgICAgICAgcmV0dXJuIGZyYWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLl9yZXBsYWNlckF0dHJzID0gZXh0cmFjdEF0dHJzKHJlcGxhY2VyKTtcbiAgICAgICAgbWVyZ2VBdHRycyhlbCwgcmVwbGFjZXIpO1xuICAgICAgICByZXR1cm4gcmVwbGFjZXI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKGZyYWcpO1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0ludmFsaWQgdGVtcGxhdGUgb3B0aW9uOiAnICsgdGVtcGxhdGUpO1xuICB9XG59XG5cbi8qKlxuICogSGVscGVyIHRvIGV4dHJhY3QgYSBjb21wb25lbnQgY29udGFpbmVyJ3MgYXR0cmlidXRlc1xuICogaW50byBhIHBsYWluIG9iamVjdCBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBleHRyYWN0QXR0cnMoZWwpIHtcbiAgaWYgKGVsLm5vZGVUeXBlID09PSAxICYmIGVsLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgIHJldHVybiB0b0FycmF5KGVsLmF0dHJpYnV0ZXMpO1xuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgdGhlIGF0dHJpYnV0ZXMgb2YgdHdvIGVsZW1lbnRzLCBhbmQgbWFrZSBzdXJlXG4gKiB0aGUgY2xhc3MgbmFtZXMgYXJlIG1lcmdlZCBwcm9wZXJseS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGZyb21cbiAqIEBwYXJhbSB7RWxlbWVudH0gdG9cbiAqL1xuXG5mdW5jdGlvbiBtZXJnZUF0dHJzKGZyb20sIHRvKSB7XG4gIHZhciBhdHRycyA9IGZyb20uYXR0cmlidXRlcztcbiAgdmFyIGkgPSBhdHRycy5sZW5ndGg7XG4gIHZhciBuYW1lLCB2YWx1ZTtcbiAgd2hpbGUgKGktLSkge1xuICAgIG5hbWUgPSBhdHRyc1tpXS5uYW1lO1xuICAgIHZhbHVlID0gYXR0cnNbaV0udmFsdWU7XG4gICAgaWYgKCF0by5oYXNBdHRyaWJ1dGUobmFtZSkgJiYgIXNwZWNpYWxDaGFyUkUudGVzdChuYW1lKSkge1xuICAgICAgdG8uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdjbGFzcycgJiYgIXBhcnNlVGV4dCh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlLnRyaW0oKS5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24gKGNscykge1xuICAgICAgICBhZGRDbGFzcyh0bywgY2xzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNjYW4gYW5kIGRldGVybWluZSBzbG90IGNvbnRlbnQgZGlzdHJpYnV0aW9uLlxuICogV2UgZG8gdGhpcyBkdXJpbmcgdHJhbnNjbHVzaW9uIGluc3RlYWQgYXQgY29tcGlsZSB0aW1lIHNvIHRoYXRcbiAqIHRoZSBkaXN0cmlidXRpb24gaXMgZGVjb3VwbGVkIGZyb20gdGhlIGNvbXBpbGF0aW9uIG9yZGVyIG9mXG4gKiB0aGUgc2xvdHMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRlbnRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbmZ1bmN0aW9uIHJlc29sdmVTbG90cyh2bSwgY29udGVudCkge1xuICBpZiAoIWNvbnRlbnQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGNvbnRlbnRzID0gdm0uX3Nsb3RDb250ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBlbCwgbmFtZTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjb250ZW50LmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGVsID0gY29udGVudC5jaGlsZHJlbltpXTtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuICAgIGlmIChuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCdzbG90JykpIHtcbiAgICAgIChjb250ZW50c1tuYW1lXSB8fCAoY29udGVudHNbbmFtZV0gPSBbXSkpLnB1c2goZWwpO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbmQtYXNzaWduICovXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgZ2V0QmluZEF0dHIoZWwsICdzbG90JykpIHtcbiAgICAgIHdhcm4oJ1RoZSBcInNsb3RcIiBhdHRyaWJ1dGUgbXVzdCBiZSBzdGF0aWMuJyk7XG4gICAgfVxuICB9XG4gIGZvciAobmFtZSBpbiBjb250ZW50cykge1xuICAgIGNvbnRlbnRzW25hbWVdID0gZXh0cmFjdEZyYWdtZW50KGNvbnRlbnRzW25hbWVdLCBjb250ZW50KTtcbiAgfVxuICBpZiAoY29udGVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICBjb250ZW50c1snZGVmYXVsdCddID0gZXh0cmFjdEZyYWdtZW50KGNvbnRlbnQuY2hpbGROb2RlcywgY29udGVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IHF1YWxpZmllZCBjb250ZW50IG5vZGVzIGZyb20gYSBub2RlIGxpc3QuXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gbm9kZXNcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gZXh0cmFjdEZyYWdtZW50KG5vZGVzLCBwYXJlbnQpIHtcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIG5vZGVzID0gdG9BcnJheShub2Rlcyk7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAoaXNUZW1wbGF0ZShub2RlKSAmJiAhbm9kZS5oYXNBdHRyaWJ1dGUoJ3YtaWYnKSAmJiAhbm9kZS5oYXNBdHRyaWJ1dGUoJ3YtZm9yJykpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIG5vZGUgPSBwYXJzZVRlbXBsYXRlKG5vZGUpO1xuICAgIH1cbiAgICBmcmFnLmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG4gIHJldHVybiBmcmFnO1xufVxuXG5cblxudmFyIGNvbXBpbGVyID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGNvbXBpbGU6IGNvbXBpbGUsXG5cdGNvbXBpbGVBbmRMaW5rUHJvcHM6IGNvbXBpbGVBbmRMaW5rUHJvcHMsXG5cdGNvbXBpbGVSb290OiBjb21waWxlUm9vdCxcblx0dHJhbnNjbHVkZTogdHJhbnNjbHVkZSxcblx0cmVzb2x2ZVNsb3RzOiByZXNvbHZlU2xvdHNcbn0pO1xuXG5mdW5jdGlvbiBzdGF0ZU1peGluIChWdWUpIHtcbiAgLyoqXG4gICAqIEFjY2Vzc29yIGZvciBgJGRhdGFgIHByb3BlcnR5LCBzaW5jZSBzZXR0aW5nICRkYXRhXG4gICAqIHJlcXVpcmVzIG9ic2VydmluZyB0aGUgbmV3IG9iamVjdCBhbmQgdXBkYXRpbmdcbiAgICogcHJveGllZCBwcm9wZXJ0aWVzLlxuICAgKi9cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRkYXRhJywge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChuZXdEYXRhKSB7XG4gICAgICBpZiAobmV3RGF0YSAhPT0gdGhpcy5fZGF0YSkge1xuICAgICAgICB0aGlzLl9zZXREYXRhKG5ld0RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFNldHVwIHRoZSBzY29wZSBvZiBhbiBpbnN0YW5jZSwgd2hpY2ggY29udGFpbnM6XG4gICAqIC0gb2JzZXJ2ZWQgZGF0YVxuICAgKiAtIGNvbXB1dGVkIHByb3BlcnRpZXNcbiAgICogLSB1c2VyIG1ldGhvZHNcbiAgICogLSBtZXRhIHByb3BlcnRpZXNcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5faW5pdFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2luaXRQcm9wcygpO1xuICAgIHRoaXMuX2luaXRNZXRhKCk7XG4gICAgdGhpcy5faW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLl9pbml0RGF0YSgpO1xuICAgIHRoaXMuX2luaXRDb21wdXRlZCgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHByb3BzLlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9pbml0UHJvcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zO1xuICAgIHZhciBlbCA9IG9wdGlvbnMuZWw7XG4gICAgdmFyIHByb3BzID0gb3B0aW9ucy5wcm9wcztcbiAgICBpZiAocHJvcHMgJiYgIWVsKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ1Byb3BzIHdpbGwgbm90IGJlIGNvbXBpbGVkIGlmIG5vIGBlbGAgb3B0aW9uIGlzICcgKyAncHJvdmlkZWQgYXQgaW5zdGFudGlhdGlvbi4nKTtcbiAgICB9XG4gICAgLy8gbWFrZSBzdXJlIHRvIGNvbnZlcnQgc3RyaW5nIHNlbGVjdG9ycyBpbnRvIGVsZW1lbnQgbm93XG4gICAgZWwgPSBvcHRpb25zLmVsID0gcXVlcnkoZWwpO1xuICAgIHRoaXMuX3Byb3BzVW5saW5rRm4gPSBlbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSAmJiBwcm9wc1xuICAgIC8vIHByb3BzIG11c3QgYmUgbGlua2VkIGluIHByb3BlciBzY29wZSBpZiBpbnNpZGUgdi1mb3JcbiAgICA/IGNvbXBpbGVBbmRMaW5rUHJvcHModGhpcywgZWwsIHByb3BzLCB0aGlzLl9zY29wZSkgOiBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBkYXRhLlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9pbml0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0YUZuID0gdGhpcy4kb3B0aW9ucy5kYXRhO1xuICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YSA9IGRhdGFGbiA/IGRhdGFGbigpIDoge307XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ2RhdGEgZnVuY3Rpb25zIHNob3VsZCByZXR1cm4gYW4gb2JqZWN0LicpO1xuICAgIH1cbiAgICB2YXIgcHJvcHMgPSB0aGlzLl9wcm9wcztcbiAgICB2YXIgcnVudGltZURhdGEgPSB0aGlzLl9ydW50aW1lRGF0YSA/IHR5cGVvZiB0aGlzLl9ydW50aW1lRGF0YSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuX3J1bnRpbWVEYXRhKCkgOiB0aGlzLl9ydW50aW1lRGF0YSA6IG51bGw7XG4gICAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgdmFyIGksIGtleTtcbiAgICBpID0ga2V5cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIC8vIHRoZXJlIGFyZSB0d28gc2NlbmFyaW9zIHdoZXJlIHdlIGNhbiBwcm94eSBhIGRhdGEga2V5OlxuICAgICAgLy8gMS4gaXQncyBub3QgYWxyZWFkeSBkZWZpbmVkIGFzIGEgcHJvcFxuICAgICAgLy8gMi4gaXQncyBwcm92aWRlZCB2aWEgYSBpbnN0YW50aWF0aW9uIG9wdGlvbiBBTkQgdGhlcmUgYXJlIG5vXG4gICAgICAvLyAgICB0ZW1wbGF0ZSBwcm9wIHByZXNlbnRcbiAgICAgIGlmICghcHJvcHMgfHwgIWhhc093bihwcm9wcywga2V5KSB8fCBydW50aW1lRGF0YSAmJiBoYXNPd24ocnVudGltZURhdGEsIGtleSkgJiYgcHJvcHNba2V5XS5yYXcgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcHJveHkoa2V5KTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB3YXJuKCdEYXRhIGZpZWxkIFwiJyArIGtleSArICdcIiBpcyBhbHJlYWR5IGRlZmluZWQgJyArICdhcyBhIHByb3AuIFVzZSBwcm9wIGRlZmF1bHQgdmFsdWUgaW5zdGVhZC4nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gb2JzZXJ2ZSBkYXRhXG4gICAgb2JzZXJ2ZShkYXRhLCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogU3dhcCB0aGUgaW5zdGFuY2UncyAkZGF0YS4gQ2FsbGVkIGluICRkYXRhJ3Mgc2V0dGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV3RGF0YVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9zZXREYXRhID0gZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgICBuZXdEYXRhID0gbmV3RGF0YSB8fCB7fTtcbiAgICB2YXIgb2xkRGF0YSA9IHRoaXMuX2RhdGE7XG4gICAgdGhpcy5fZGF0YSA9IG5ld0RhdGE7XG4gICAgdmFyIGtleXMsIGtleSwgaTtcbiAgICAvLyB1bnByb3h5IGtleXMgbm90IHByZXNlbnQgaW4gbmV3IGRhdGFcbiAgICBrZXlzID0gT2JqZWN0LmtleXMob2xkRGF0YSk7XG4gICAgaSA9IGtleXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoIShrZXkgaW4gbmV3RGF0YSkpIHtcbiAgICAgICAgdGhpcy5fdW5wcm94eShrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBwcm94eSBrZXlzIG5vdCBhbHJlYWR5IHByb3hpZWQsXG4gICAgLy8gYW5kIHRyaWdnZXIgY2hhbmdlIGZvciBjaGFuZ2VkIHZhbHVlc1xuICAgIGtleXMgPSBPYmplY3Qua2V5cyhuZXdEYXRhKTtcbiAgICBpID0ga2V5cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmICghaGFzT3duKHRoaXMsIGtleSkpIHtcbiAgICAgICAgLy8gbmV3IHByb3BlcnR5XG4gICAgICAgIHRoaXMuX3Byb3h5KGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIG9sZERhdGEuX19vYl9fLnJlbW92ZVZtKHRoaXMpO1xuICAgIG9ic2VydmUobmV3RGF0YSwgdGhpcyk7XG4gICAgdGhpcy5fZGlnZXN0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFByb3h5IGEgcHJvcGVydHksIHNvIHRoYXRcbiAgICogdm0ucHJvcCA9PT0gdm0uX2RhdGEucHJvcFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuX3Byb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICAvLyBuZWVkIHRvIHN0b3JlIHJlZiB0byBzZWxmIGhlcmVcbiAgICAgIC8vIGJlY2F1c2UgdGhlc2UgZ2V0dGVyL3NldHRlcnMgbWlnaHRcbiAgICAgIC8vIGJlIGNhbGxlZCBieSBjaGlsZCBzY29wZXMgdmlhXG4gICAgICAvLyBwcm90b3R5cGUgaW5oZXJpdGFuY2UuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwga2V5LCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBwcm94eUdldHRlcigpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fZGF0YVtrZXldO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIHByb3h5U2V0dGVyKHZhbCkge1xuICAgICAgICAgIHNlbGYuX2RhdGFba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBVbnByb3h5IGEgcHJvcGVydHkuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5fdW5wcm94eSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIWlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEZvcmNlIHVwZGF0ZSBvbiBldmVyeSB3YXRjaGVyIGluIHNjb3BlLlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLl93YXRjaGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuX3dhdGNoZXJzW2ldLnVwZGF0ZSh0cnVlKTsgLy8gc2hhbGxvdyB1cGRhdGVzXG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZXR1cCBjb21wdXRlZCBwcm9wZXJ0aWVzLiBUaGV5IGFyZSBlc3NlbnRpYWxseVxuICAgKiBzcGVjaWFsIGdldHRlci9zZXR0ZXJzXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG5vb3AoKSB7fVxuICBWdWUucHJvdG90eXBlLl9pbml0Q29tcHV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXB1dGVkID0gdGhpcy4kb3B0aW9ucy5jb21wdXRlZDtcbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBjb21wdXRlZCkge1xuICAgICAgICB2YXIgdXNlckRlZiA9IGNvbXB1dGVkW2tleV07XG4gICAgICAgIHZhciBkZWYgPSB7XG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VyRGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZGVmLmdldCA9IG1ha2VDb21wdXRlZEdldHRlcih1c2VyRGVmLCB0aGlzKTtcbiAgICAgICAgICBkZWYuc2V0ID0gbm9vcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWYuZ2V0ID0gdXNlckRlZi5nZXQgPyB1c2VyRGVmLmNhY2hlICE9PSBmYWxzZSA/IG1ha2VDb21wdXRlZEdldHRlcih1c2VyRGVmLmdldCwgdGhpcykgOiBiaW5kKHVzZXJEZWYuZ2V0LCB0aGlzKSA6IG5vb3A7XG4gICAgICAgICAgZGVmLnNldCA9IHVzZXJEZWYuc2V0ID8gYmluZCh1c2VyRGVmLnNldCwgdGhpcykgOiBub29wO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIGRlZik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VDb21wdXRlZEdldHRlcihnZXR0ZXIsIG93bmVyKSB7XG4gICAgdmFyIHdhdGNoZXIgPSBuZXcgV2F0Y2hlcihvd25lciwgZ2V0dGVyLCBudWxsLCB7XG4gICAgICBsYXp5OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNvbXB1dGVkR2V0dGVyKCkge1xuICAgICAgaWYgKHdhdGNoZXIuZGlydHkpIHtcbiAgICAgICAgd2F0Y2hlci5ldmFsdWF0ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKERlcC50YXJnZXQpIHtcbiAgICAgICAgd2F0Y2hlci5kZXBlbmQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB3YXRjaGVyLnZhbHVlO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU2V0dXAgaW5zdGFuY2UgbWV0aG9kcy4gTWV0aG9kcyBtdXN0IGJlIGJvdW5kIHRvIHRoZVxuICAgKiBpbnN0YW5jZSBzaW5jZSB0aGV5IG1pZ2h0IGJlIHBhc3NlZCBkb3duIGFzIGEgcHJvcCB0b1xuICAgKiBjaGlsZCBjb21wb25lbnRzLlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9pbml0TWV0aG9kcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kcyA9IHRoaXMuJG9wdGlvbnMubWV0aG9kcztcbiAgICBpZiAobWV0aG9kcykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHtcbiAgICAgICAgdGhpc1trZXldID0gYmluZChtZXRob2RzW2tleV0sIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBtZXRhIGluZm9ybWF0aW9uIGxpa2UgJGluZGV4LCAka2V5ICYgJHZhbHVlLlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9pbml0TWV0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0YXMgPSB0aGlzLiRvcHRpb25zLl9tZXRhO1xuICAgIGlmIChtZXRhcykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG1ldGFzKSB7XG4gICAgICAgIGRlZmluZVJlYWN0aXZlKHRoaXMsIGtleSwgbWV0YXNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG52YXIgZXZlbnRSRSA9IC9edi1vbjp8XkAvO1xuXG5mdW5jdGlvbiBldmVudHNNaXhpbiAoVnVlKSB7XG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgaW5zdGFuY2UncyBvcHRpb24gZXZlbnRzICYgd2F0Y2hlcnMuXG4gICAqIElmIHRoZSB2YWx1ZSBpcyBhIHN0cmluZywgd2UgcHVsbCBpdCBmcm9tIHRoZVxuICAgKiBpbnN0YW5jZSdzIG1ldGhvZHMgYnkgbmFtZS5cbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMuX2FzQ29tcG9uZW50KSB7XG4gICAgICByZWdpc3RlckNvbXBvbmVudEV2ZW50cyh0aGlzLCBvcHRpb25zLmVsKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJDYWxsYmFja3ModGhpcywgJyRvbicsIG9wdGlvbnMuZXZlbnRzKTtcbiAgICByZWdpc3RlckNhbGxiYWNrcyh0aGlzLCAnJHdhdGNoJywgb3B0aW9ucy53YXRjaCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHYtb24gZXZlbnRzIG9uIGEgY2hpbGQgY29tcG9uZW50XG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50RXZlbnRzKHZtLCBlbCkge1xuICAgIHZhciBhdHRycyA9IGVsLmF0dHJpYnV0ZXM7XG4gICAgdmFyIG5hbWUsIGhhbmRsZXI7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5hbWUgPSBhdHRyc1tpXS5uYW1lO1xuICAgICAgaWYgKGV2ZW50UkUudGVzdChuYW1lKSkge1xuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKGV2ZW50UkUsICcnKTtcbiAgICAgICAgaGFuZGxlciA9ICh2bS5fc2NvcGUgfHwgdm0uX2NvbnRleHQpLiRldmFsKGF0dHJzW2ldLnZhbHVlLCB0cnVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaGFuZGxlci5fZnJvbVBhcmVudCA9IHRydWU7XG4gICAgICAgICAgdm0uJG9uKG5hbWUucmVwbGFjZShldmVudFJFKSwgaGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIHdhcm4oJ3Ytb246JyArIG5hbWUgKyAnPVwiJyArIGF0dHJzW2ldLnZhbHVlICsgJ1wiJyArICh2bS4kb3B0aW9ucy5uYW1lID8gJyBvbiBjb21wb25lbnQgPCcgKyB2bS4kb3B0aW9ucy5uYW1lICsgJz4nIDogJycpICsgJyBleHBlY3RzIGEgZnVuY3Rpb24gdmFsdWUsIGdvdCAnICsgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBvcHRpb24gZXZlbnRzIGFuZCB3YXRjaGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGhhc2hcbiAgICovXG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJDYWxsYmFja3Modm0sIGFjdGlvbiwgaGFzaCkge1xuICAgIGlmICghaGFzaCkgcmV0dXJuO1xuICAgIHZhciBoYW5kbGVycywga2V5LCBpLCBqO1xuICAgIGZvciAoa2V5IGluIGhhc2gpIHtcbiAgICAgIGhhbmRsZXJzID0gaGFzaFtrZXldO1xuICAgICAgaWYgKGlzQXJyYXkoaGFuZGxlcnMpKSB7XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnaXN0ZXIodm0sIGFjdGlvbiwga2V5LCBoYW5kbGVycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byByZWdpc3RlciBhbiBldmVudC93YXRjaCBjYWxsYmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ3xPYmplY3R9IGhhbmRsZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKi9cblxuICBmdW5jdGlvbiByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBoYW5kbGVyO1xuICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2bVthY3Rpb25dKGtleSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIG1ldGhvZHMgPSB2bS4kb3B0aW9ucy5tZXRob2RzO1xuICAgICAgdmFyIG1ldGhvZCA9IG1ldGhvZHMgJiYgbWV0aG9kc1toYW5kbGVyXTtcbiAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgdm1bYWN0aW9uXShrZXksIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ1Vua25vd24gbWV0aG9kOiBcIicgKyBoYW5kbGVyICsgJ1wiIHdoZW4gJyArICdyZWdpc3RlcmluZyBjYWxsYmFjayBmb3IgJyArIGFjdGlvbiArICc6IFwiJyArIGtleSArICdcIi4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgJiYgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJlZ2lzdGVyKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlci5oYW5kbGVyLCBoYW5kbGVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0dXAgcmVjdXJzaXZlIGF0dGFjaGVkL2RldGFjaGVkIGNhbGxzXG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuX2luaXRET01Ib29rcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRvbignaG9vazphdHRhY2hlZCcsIG9uQXR0YWNoZWQpO1xuICAgIHRoaXMuJG9uKCdob29rOmRldGFjaGVkJywgb25EZXRhY2hlZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY3Vyc2l2ZWx5IGNhbGwgYXR0YWNoZWQgaG9vayBvbiBjaGlsZHJlblxuICAgKi9cblxuICBmdW5jdGlvbiBvbkF0dGFjaGVkKCkge1xuICAgIGlmICghdGhpcy5faXNBdHRhY2hlZCkge1xuICAgICAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWU7XG4gICAgICB0aGlzLiRjaGlsZHJlbi5mb3JFYWNoKGNhbGxBdHRhY2gpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRvciB0byBjYWxsIGF0dGFjaGVkIGhvb2tcbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IGNoaWxkXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNhbGxBdHRhY2goY2hpbGQpIHtcbiAgICBpZiAoIWNoaWxkLl9pc0F0dGFjaGVkICYmIGluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICAgIGNoaWxkLl9jYWxsSG9vaygnYXR0YWNoZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjdXJzaXZlbHkgY2FsbCBkZXRhY2hlZCBob29rIG9uIGNoaWxkcmVuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uRGV0YWNoZWQoKSB7XG4gICAgaWYgKHRoaXMuX2lzQXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX2lzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuJGNoaWxkcmVuLmZvckVhY2goY2FsbERldGFjaCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdG9yIHRvIGNhbGwgZGV0YWNoZWQgaG9va1xuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gY2hpbGRcbiAgICovXG5cbiAgZnVuY3Rpb24gY2FsbERldGFjaChjaGlsZCkge1xuICAgIGlmIChjaGlsZC5faXNBdHRhY2hlZCAmJiAhaW5Eb2MoY2hpbGQuJGVsKSkge1xuICAgICAgY2hpbGQuX2NhbGxIb29rKCdkZXRhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFsbCBoYW5kbGVycyBmb3IgYSBob29rXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBob29rXG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuX2NhbGxIb29rID0gZnVuY3Rpb24gKGhvb2spIHtcbiAgICB0aGlzLiRlbWl0KCdwcmUtaG9vazonICsgaG9vayk7XG4gICAgdmFyIGhhbmRsZXJzID0gdGhpcy4kb3B0aW9uc1tob29rXTtcbiAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIGhhbmRsZXJzW2ldLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuJGVtaXQoJ2hvb2s6JyArIGhvb2spO1xuICB9O1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBsaW5rcyBhIERPTSBlbGVtZW50IHdpdGggYSBwaWVjZSBvZiBkYXRhLFxuICogd2hpY2ggaXMgdGhlIHJlc3VsdCBvZiBldmFsdWF0aW5nIGFuIGV4cHJlc3Npb24uXG4gKiBJdCByZWdpc3RlcnMgYSB3YXRjaGVyIHdpdGggdGhlIGV4cHJlc3Npb24gYW5kIGNhbGxzXG4gKiB0aGUgRE9NIHVwZGF0ZSBmdW5jdGlvbiB3aGVuIGEgY2hhbmdlIGlzIHRyaWdnZXJlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvclxuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gbmFtZVxuICogICAgICAgICAgICAgICAgIC0ge09iamVjdH0gZGVmXG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXk8T2JqZWN0Pn0gW2ZpbHRlcnNdXG4gKiAgICAgICAgICAgICAgICAgLSB7T2JqZWN0fSBbbW9kaWZpZXJzXVxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IGxpdGVyYWxcbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGF0dHJcbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGFyZ1xuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gcmF3XG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBbcmVmXVxuICogICAgICAgICAgICAgICAgIC0ge0FycmF5PE9iamVjdD59IFtpbnRlcnBdXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW2hhc09uZVRpbWVdXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7VnVlfSBbaG9zdF0gLSB0cmFuc2NsdXNpb24gaG9zdCBjb21wb25lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbc2NvcGVdIC0gdi1mb3Igc2NvcGVcbiAqIEBwYXJhbSB7RnJhZ21lbnR9IFtmcmFnXSAtIG93bmVyIGZyYWdtZW50XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRGlyZWN0aXZlKGRlc2NyaXB0b3IsIHZtLCBlbCwgaG9zdCwgc2NvcGUsIGZyYWcpIHtcbiAgdGhpcy52bSA9IHZtO1xuICB0aGlzLmVsID0gZWw7XG4gIC8vIGNvcHkgZGVzY3JpcHRvciBwcm9wZXJ0aWVzXG4gIHRoaXMuZGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XG4gIHRoaXMubmFtZSA9IGRlc2NyaXB0b3IubmFtZTtcbiAgdGhpcy5leHByZXNzaW9uID0gZGVzY3JpcHRvci5leHByZXNzaW9uO1xuICB0aGlzLmFyZyA9IGRlc2NyaXB0b3IuYXJnO1xuICB0aGlzLm1vZGlmaWVycyA9IGRlc2NyaXB0b3IubW9kaWZpZXJzO1xuICB0aGlzLmZpbHRlcnMgPSBkZXNjcmlwdG9yLmZpbHRlcnM7XG4gIHRoaXMubGl0ZXJhbCA9IHRoaXMubW9kaWZpZXJzICYmIHRoaXMubW9kaWZpZXJzLmxpdGVyYWw7XG4gIC8vIHByaXZhdGVcbiAgdGhpcy5fbG9ja2VkID0gZmFsc2U7XG4gIHRoaXMuX2JvdW5kID0gZmFsc2U7XG4gIHRoaXMuX2xpc3RlbmVycyA9IG51bGw7XG4gIC8vIGxpbmsgY29udGV4dFxuICB0aGlzLl9ob3N0ID0gaG9zdDtcbiAgdGhpcy5fc2NvcGUgPSBzY29wZTtcbiAgdGhpcy5fZnJhZyA9IGZyYWc7XG4gIC8vIHN0b3JlIGRpcmVjdGl2ZXMgb24gbm9kZSBpbiBkZXYgbW9kZVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0aGlzLmVsKSB7XG4gICAgdGhpcy5lbC5fdnVlX2RpcmVjdGl2ZXMgPSB0aGlzLmVsLl92dWVfZGlyZWN0aXZlcyB8fCBbXTtcbiAgICB0aGlzLmVsLl92dWVfZGlyZWN0aXZlcy5wdXNoKHRoaXMpO1xuICB9XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgZGlyZWN0aXZlLCBtaXhpbiBkZWZpbml0aW9uIHByb3BlcnRpZXMsXG4gKiBzZXR1cCB0aGUgd2F0Y2hlciwgY2FsbCBkZWZpbml0aW9uIGJpbmQoKSBhbmQgdXBkYXRlKClcbiAqIGlmIHByZXNlbnQuXG4gKi9cblxuRGlyZWN0aXZlLnByb3RvdHlwZS5fYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLm5hbWU7XG4gIHZhciBkZXNjcmlwdG9yID0gdGhpcy5kZXNjcmlwdG9yO1xuXG4gIC8vIHJlbW92ZSBhdHRyaWJ1dGVcbiAgaWYgKChuYW1lICE9PSAnY2xvYWsnIHx8IHRoaXMudm0uX2lzQ29tcGlsZWQpICYmIHRoaXMuZWwgJiYgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUpIHtcbiAgICB2YXIgYXR0ciA9IGRlc2NyaXB0b3IuYXR0ciB8fCAndi0nICsgbmFtZTtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgfVxuXG4gIC8vIGNvcHkgZGVmIHByb3BlcnRpZXNcbiAgdmFyIGRlZiA9IGRlc2NyaXB0b3IuZGVmO1xuICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMudXBkYXRlID0gZGVmO1xuICB9IGVsc2Uge1xuICAgIGV4dGVuZCh0aGlzLCBkZWYpO1xuICB9XG5cbiAgLy8gc2V0dXAgZGlyZWN0aXZlIHBhcmFtc1xuICB0aGlzLl9zZXR1cFBhcmFtcygpO1xuXG4gIC8vIGluaXRpYWwgYmluZFxuICBpZiAodGhpcy5iaW5kKSB7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgdGhpcy5fYm91bmQgPSB0cnVlO1xuXG4gIGlmICh0aGlzLmxpdGVyYWwpIHtcbiAgICB0aGlzLnVwZGF0ZSAmJiB0aGlzLnVwZGF0ZShkZXNjcmlwdG9yLnJhdyk7XG4gIH0gZWxzZSBpZiAoKHRoaXMuZXhwcmVzc2lvbiB8fCB0aGlzLm1vZGlmaWVycykgJiYgKHRoaXMudXBkYXRlIHx8IHRoaXMudHdvV2F5KSAmJiAhdGhpcy5fY2hlY2tTdGF0ZW1lbnQoKSkge1xuICAgIC8vIHdyYXBwZWQgdXBkYXRlciBmb3IgY29udGV4dFxuICAgIHZhciBkaXIgPSB0aGlzO1xuICAgIGlmICh0aGlzLnVwZGF0ZSkge1xuICAgICAgdGhpcy5fdXBkYXRlID0gZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgICAgIGlmICghZGlyLl9sb2NrZWQpIHtcbiAgICAgICAgICBkaXIudXBkYXRlKHZhbCwgb2xkVmFsKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlID0gbm9vcDtcbiAgICB9XG4gICAgdmFyIHByZVByb2Nlc3MgPSB0aGlzLl9wcmVQcm9jZXNzID8gYmluZCh0aGlzLl9wcmVQcm9jZXNzLCB0aGlzKSA6IG51bGw7XG4gICAgdmFyIHBvc3RQcm9jZXNzID0gdGhpcy5fcG9zdFByb2Nlc3MgPyBiaW5kKHRoaXMuX3Bvc3RQcm9jZXNzLCB0aGlzKSA6IG51bGw7XG4gICAgdmFyIHdhdGNoZXIgPSB0aGlzLl93YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcy52bSwgdGhpcy5leHByZXNzaW9uLCB0aGlzLl91cGRhdGUsIC8vIGNhbGxiYWNrXG4gICAge1xuICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgdHdvV2F5OiB0aGlzLnR3b1dheSxcbiAgICAgIGRlZXA6IHRoaXMuZGVlcCxcbiAgICAgIHByZVByb2Nlc3M6IHByZVByb2Nlc3MsXG4gICAgICBwb3N0UHJvY2VzczogcG9zdFByb2Nlc3MsXG4gICAgICBzY29wZTogdGhpcy5fc2NvcGVcbiAgICB9KTtcbiAgICAvLyB2LW1vZGVsIHdpdGggaW5pdGFsIGlubGluZSB2YWx1ZSBuZWVkIHRvIHN5bmMgYmFjayB0b1xuICAgIC8vIG1vZGVsIGluc3RlYWQgb2YgdXBkYXRlIHRvIERPTSBvbiBpbml0LiBUaGV5IHdvdWxkXG4gICAgLy8gc2V0IHRoZSBhZnRlckJpbmQgaG9vayB0byBpbmRpY2F0ZSB0aGF0LlxuICAgIGlmICh0aGlzLmFmdGVyQmluZCkge1xuICAgICAgdGhpcy5hZnRlckJpbmQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh3YXRjaGVyLnZhbHVlKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogU2V0dXAgYWxsIHBhcmFtIGF0dHJpYnV0ZXMsIGUuZy4gdHJhY2stYnksXG4gKiB0cmFuc2l0aW9uLW1vZGUsIGV0Yy4uLlxuICovXG5cbkRpcmVjdGl2ZS5wcm90b3R5cGUuX3NldHVwUGFyYW1zID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMucGFyYW1zKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcbiAgLy8gc3dhcCB0aGUgcGFyYW1zIGFycmF5IHdpdGggYSBmcmVzaCBvYmplY3QuXG4gIHRoaXMucGFyYW1zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGkgPSBwYXJhbXMubGVuZ3RoO1xuICB2YXIga2V5LCB2YWwsIG1hcHBlZEtleTtcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGh5cGhlbmF0ZShwYXJhbXNbaV0pO1xuICAgIG1hcHBlZEtleSA9IGNhbWVsaXplKGtleSk7XG4gICAgdmFsID0gZ2V0QmluZEF0dHIodGhpcy5lbCwga2V5KTtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIC8vIGR5bmFtaWNcbiAgICAgIHRoaXMuX3NldHVwUGFyYW1XYXRjaGVyKG1hcHBlZEtleSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RhdGljXG4gICAgICB2YWwgPSBnZXRBdHRyKHRoaXMuZWwsIGtleSk7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5wYXJhbXNbbWFwcGVkS2V5XSA9IHZhbCA9PT0gJycgPyB0cnVlIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBTZXR1cCBhIHdhdGNoZXIgZm9yIGEgZHluYW1pYyBwYXJhbS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICovXG5cbkRpcmVjdGl2ZS5wcm90b3R5cGUuX3NldHVwUGFyYW1XYXRjaGVyID0gZnVuY3Rpb24gKGtleSwgZXhwcmVzc2lvbikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgdmFyIHVud2F0Y2ggPSAodGhpcy5fc2NvcGUgfHwgdGhpcy52bSkuJHdhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgIHNlbGYucGFyYW1zW2tleV0gPSB2YWw7XG4gICAgLy8gc2luY2Ugd2UgYXJlIGluIGltbWVkaWF0ZSBtb2RlLFxuICAgIC8vIG9ubHkgY2FsbCB0aGUgcGFyYW0gY2hhbmdlIGNhbGxiYWNrcyBpZiB0aGlzIGlzIG5vdCB0aGUgZmlyc3QgdXBkYXRlLlxuICAgIGlmIChjYWxsZWQpIHtcbiAgICAgIHZhciBjYiA9IHNlbGYucGFyYW1XYXRjaGVycyAmJiBzZWxmLnBhcmFtV2F0Y2hlcnNba2V5XTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjYi5jYWxsKHNlbGYsIHZhbCwgb2xkVmFsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgdXNlcjogZmFsc2VcbiAgfSk7KHRoaXMuX3BhcmFtVW53YXRjaEZucyB8fCAodGhpcy5fcGFyYW1VbndhdGNoRm5zID0gW10pKS5wdXNoKHVud2F0Y2gpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZGlyZWN0aXZlIGlzIGEgZnVuY3Rpb24gY2FsbGVyXG4gKiBhbmQgaWYgdGhlIGV4cHJlc3Npb24gaXMgYSBjYWxsYWJsZSBvbmUuIElmIGJvdGggdHJ1ZSxcbiAqIHdlIHdyYXAgdXAgdGhlIGV4cHJlc3Npb24gYW5kIHVzZSBpdCBhcyB0aGUgZXZlbnRcbiAqIGhhbmRsZXIuXG4gKlxuICogZS5nLiBvbi1jbGljaz1cImErK1wiXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5EaXJlY3RpdmUucHJvdG90eXBlLl9jaGVja1N0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb247XG4gIGlmIChleHByZXNzaW9uICYmIHRoaXMuYWNjZXB0U3RhdGVtZW50ICYmICFpc1NpbXBsZVBhdGgoZXhwcmVzc2lvbikpIHtcbiAgICB2YXIgZm4gPSBwYXJzZUV4cHJlc3Npb24oZXhwcmVzc2lvbikuZ2V0O1xuICAgIHZhciBzY29wZSA9IHRoaXMuX3Njb3BlIHx8IHRoaXMudm07XG4gICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGUpIHtcbiAgICAgIHNjb3BlLiRldmVudCA9IGU7XG4gICAgICBmbi5jYWxsKHNjb3BlLCBzY29wZSk7XG4gICAgICBzY29wZS4kZXZlbnQgPSBudWxsO1xuICAgIH07XG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgaGFuZGxlciA9IHNjb3BlLl9hcHBseUZpbHRlcnMoaGFuZGxlciwgbnVsbCwgdGhpcy5maWx0ZXJzKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGUoaGFuZGxlcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIHdpdGggdGhlIHNldHRlci5cbiAqIFRoaXMgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiB0d28td2F5IGRpcmVjdGl2ZXNcbiAqIGUuZy4gdi1tb2RlbC5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcHVibGljXG4gKi9cblxuRGlyZWN0aXZlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHRoaXMudHdvV2F5KSB7XG4gICAgdGhpcy5fd2l0aExvY2soZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fd2F0Y2hlci5zZXQodmFsdWUpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB3YXJuKCdEaXJlY3RpdmUuc2V0KCkgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgdHdvV2F5JyArICdkaXJlY3RpdmVzLicpO1xuICB9XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgYSBmdW5jdGlvbiB3aGlsZSBwcmV2ZW50aW5nIHRoYXQgZnVuY3Rpb24gZnJvbVxuICogdHJpZ2dlcmluZyB1cGRhdGVzIG9uIHRoaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuRGlyZWN0aXZlLnByb3RvdHlwZS5fd2l0aExvY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLl9sb2NrZWQgPSB0cnVlO1xuICBmbi5jYWxsKHNlbGYpO1xuICBuZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fbG9ja2VkID0gZmFsc2U7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBDb252ZW5pZW5jZSBtZXRob2QgdGhhdCBhdHRhY2hlcyBhIERPTSBldmVudCBsaXN0ZW5lclxuICogdG8gdGhlIGRpcmVjdGl2ZSBlbGVtZW50IGFuZCBhdXRvbWV0aWNhbGx5IHRlYXJzIGl0IGRvd25cbiAqIGR1cmluZyB1bmJpbmQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt1c2VDYXB0dXJlXVxuICovXG5cbkRpcmVjdGl2ZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnQsIGhhbmRsZXIsIHVzZUNhcHR1cmUpIHtcbiAgb24odGhpcy5lbCwgZXZlbnQsIGhhbmRsZXIsIHVzZUNhcHR1cmUpOyh0aGlzLl9saXN0ZW5lcnMgfHwgKHRoaXMuX2xpc3RlbmVycyA9IFtdKSkucHVzaChbZXZlbnQsIGhhbmRsZXJdKTtcbn07XG5cbi8qKlxuICogVGVhcmRvd24gdGhlIHdhdGNoZXIgYW5kIGNhbGwgdW5iaW5kLlxuICovXG5cbkRpcmVjdGl2ZS5wcm90b3R5cGUuX3RlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYm91bmQpIHtcbiAgICB0aGlzLl9ib3VuZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnVuYmluZCkge1xuICAgICAgdGhpcy51bmJpbmQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3dhdGNoZXIpIHtcbiAgICAgIHRoaXMuX3dhdGNoZXIudGVhcmRvd24oKTtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcbiAgICB2YXIgaTtcbiAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgb2ZmKHRoaXMuZWwsIGxpc3RlbmVyc1tpXVswXSwgbGlzdGVuZXJzW2ldWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHVud2F0Y2hGbnMgPSB0aGlzLl9wYXJhbVVud2F0Y2hGbnM7XG4gICAgaWYgKHVud2F0Y2hGbnMpIHtcbiAgICAgIGkgPSB1bndhdGNoRm5zLmxlbmd0aDtcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdW53YXRjaEZuc1tpXSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0aGlzLmVsKSB7XG4gICAgICB0aGlzLmVsLl92dWVfZGlyZWN0aXZlcy4kcmVtb3ZlKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLnZtID0gdGhpcy5lbCA9IHRoaXMuX3dhdGNoZXIgPSB0aGlzLl9saXN0ZW5lcnMgPSBudWxsO1xuICB9XG59O1xuXG5mdW5jdGlvbiBsaWZlY3ljbGVNaXhpbiAoVnVlKSB7XG4gIC8qKlxuICAgKiBVcGRhdGUgdi1yZWYgZm9yIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtCb29sZWFufSByZW1vdmVcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5fdXBkYXRlUmVmID0gZnVuY3Rpb24gKHJlbW92ZSkge1xuICAgIHZhciByZWYgPSB0aGlzLiRvcHRpb25zLl9yZWY7XG4gICAgaWYgKHJlZikge1xuICAgICAgdmFyIHJlZnMgPSAodGhpcy5fc2NvcGUgfHwgdGhpcy5fY29udGV4dCkuJHJlZnM7XG4gICAgICBpZiAocmVtb3ZlKSB7XG4gICAgICAgIGlmIChyZWZzW3JlZl0gPT09IHRoaXMpIHtcbiAgICAgICAgICByZWZzW3JlZl0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWZzW3JlZl0gPSB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVHJhbnNjbHVkZSwgY29tcGlsZSBhbmQgbGluayBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhIHByZS1jb21waWxlZCBsaW5rZXIgaXMgYXZhaWxhYmxlLCB0aGF0IG1lYW5zIHRoZVxuICAgKiBwYXNzZWQgaW4gZWxlbWVudCB3aWxsIGJlIHByZS10cmFuc2NsdWRlZCBhbmQgY29tcGlsZWRcbiAgICogYXMgd2VsbCAtIGFsbCB3ZSBuZWVkIHRvIGRvIGlzIHRvIGNhbGwgdGhlIGxpbmtlci5cbiAgICpcbiAgICogT3RoZXJ3aXNlIHdlIG5lZWQgdG8gY2FsbCB0cmFuc2NsdWRlL2NvbXBpbGUvbGluayBoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnM7XG5cbiAgICAvLyB0cmFuc2NsdWRlIGFuZCBpbml0IGVsZW1lbnRcbiAgICAvLyB0cmFuc2NsdWRlIGNhbiBwb3RlbnRpYWxseSByZXBsYWNlIG9yaWdpbmFsXG4gICAgLy8gc28gd2UgbmVlZCB0byBrZWVwIHJlZmVyZW5jZTsgdGhpcyBzdGVwIGFsc28gaW5qZWN0c1xuICAgIC8vIHRoZSB0ZW1wbGF0ZSBhbmQgY2FjaGVzIHRoZSBvcmlnaW5hbCBhdHRyaWJ1dGVzXG4gICAgLy8gb24gdGhlIGNvbnRhaW5lciBub2RlIGFuZCByZXBsYWNlciBub2RlLlxuICAgIHZhciBvcmlnaW5hbCA9IGVsO1xuICAgIGVsID0gdHJhbnNjbHVkZShlbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpO1xuXG4gICAgLy8gaGFuZGxlIHYtcHJlIG9uIHJvb3Qgbm9kZSAoIzIwMjYpXG4gICAgaWYgKGVsLm5vZGVUeXBlID09PSAxICYmIGdldEF0dHIoZWwsICd2LXByZScpICE9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcm9vdCBpcyBhbHdheXMgY29tcGlsZWQgcGVyLWluc3RhbmNlLCBiZWNhdXNlXG4gICAgLy8gY29udGFpbmVyIGF0dHJzIGFuZCBwcm9wcyBjYW4gYmUgZGlmZmVyZW50IGV2ZXJ5IHRpbWUuXG4gICAgdmFyIGNvbnRleHRPcHRpb25zID0gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LiRvcHRpb25zO1xuICAgIHZhciByb290TGlua2VyID0gY29tcGlsZVJvb3QoZWwsIG9wdGlvbnMsIGNvbnRleHRPcHRpb25zKTtcblxuICAgIC8vIHJlc29sdmUgc2xvdCBkaXN0cmlidXRpb25cbiAgICByZXNvbHZlU2xvdHModGhpcywgb3B0aW9ucy5fY29udGVudCk7XG5cbiAgICAvLyBjb21waWxlIGFuZCBsaW5rIHRoZSByZXN0XG4gICAgdmFyIGNvbnRlbnRMaW5rRm47XG4gICAgdmFyIGN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNvbXBvbmVudCBjb21waWxhdGlvbiBjYW4gYmUgY2FjaGVkXG4gICAgLy8gYXMgbG9uZyBhcyBpdCdzIG5vdCB1c2luZyBpbmxpbmUtdGVtcGxhdGVcbiAgICBpZiAob3B0aW9ucy5fbGlua2VyQ2FjaGFibGUpIHtcbiAgICAgIGNvbnRlbnRMaW5rRm4gPSBjdG9yLmxpbmtlcjtcbiAgICAgIGlmICghY29udGVudExpbmtGbikge1xuICAgICAgICBjb250ZW50TGlua0ZuID0gY3Rvci5saW5rZXIgPSBjb21waWxlKGVsLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsaW5rIHBoYXNlXG4gICAgLy8gbWFrZSBzdXJlIHRvIGxpbmsgcm9vdCB3aXRoIHByb3Agc2NvcGUhXG4gICAgdmFyIHJvb3RVbmxpbmtGbiA9IHJvb3RMaW5rZXIodGhpcywgZWwsIHRoaXMuX3Njb3BlKTtcbiAgICB2YXIgY29udGVudFVubGlua0ZuID0gY29udGVudExpbmtGbiA/IGNvbnRlbnRMaW5rRm4odGhpcywgZWwpIDogY29tcGlsZShlbCwgb3B0aW9ucykodGhpcywgZWwpO1xuXG4gICAgLy8gcmVnaXN0ZXIgY29tcG9zaXRlIHVubGluayBmdW5jdGlvblxuICAgIC8vIHRvIGJlIGNhbGxlZCBkdXJpbmcgaW5zdGFuY2UgZGVzdHJ1Y3Rpb25cbiAgICB0aGlzLl91bmxpbmtGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJvb3RVbmxpbmtGbigpO1xuICAgICAgLy8gcGFzc2luZyBkZXN0cm95aW5nOiB0cnVlIHRvIGF2b2lkIHNlYXJjaGluZyBhbmRcbiAgICAgIC8vIHNwbGljaW5nIHRoZSBkaXJlY3RpdmVzXG4gICAgICBjb250ZW50VW5saW5rRm4odHJ1ZSk7XG4gICAgfTtcblxuICAgIC8vIGZpbmFsbHkgcmVwbGFjZSBvcmlnaW5hbFxuICAgIGlmIChvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgIHJlcGxhY2Uob3JpZ2luYWwsIGVsKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0NvbXBpbGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9jYWxsSG9vaygnY29tcGlsZWQnKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBpbnN0YW5jZSBlbGVtZW50LiBDYWxsZWQgaW4gdGhlIHB1YmxpY1xuICAgKiAkbW91bnQoKSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5faW5pdEVsZW1lbnQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoaXNGcmFnbWVudChlbCkpIHtcbiAgICAgIHRoaXMuX2lzRnJhZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy4kZWwgPSB0aGlzLl9mcmFnbWVudFN0YXJ0ID0gZWwuZmlyc3RDaGlsZDtcbiAgICAgIHRoaXMuX2ZyYWdtZW50RW5kID0gZWwubGFzdENoaWxkO1xuICAgICAgLy8gc2V0IHBlcnNpc3RlZCB0ZXh0IGFuY2hvcnMgdG8gZW1wdHlcbiAgICAgIGlmICh0aGlzLl9mcmFnbWVudFN0YXJ0Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIHRoaXMuX2ZyYWdtZW50U3RhcnQuZGF0YSA9IHRoaXMuX2ZyYWdtZW50RW5kLmRhdGEgPSAnJztcbiAgICAgIH1cbiAgICAgIHRoaXMuX2ZyYWdtZW50ID0gZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsID0gZWw7XG4gICAgfVxuICAgIHRoaXMuJGVsLl9fdnVlX18gPSB0aGlzO1xuICAgIHRoaXMuX2NhbGxIb29rKCdiZWZvcmVDb21waWxlJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgYmluZCBhIGRpcmVjdGl2ZSB0byBhbiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvciAtIHBhcnNlZCBkaXJlY3RpdmUgZGVzY3JpcHRvclxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgICAtIHRhcmdldCBub2RlXG4gICAqIEBwYXJhbSB7VnVlfSBbaG9zdF0gLSB0cmFuc2NsdXNpb24gaG9zdCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzY29wZV0gLSB2LWZvciBzY29wZVxuICAgKiBAcGFyYW0ge0ZyYWdtZW50fSBbZnJhZ10gLSBvd25lciBmcmFnbWVudFxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9iaW5kRGlyID0gZnVuY3Rpb24gKGRlc2NyaXB0b3IsIG5vZGUsIGhvc3QsIHNjb3BlLCBmcmFnKSB7XG4gICAgdGhpcy5fZGlyZWN0aXZlcy5wdXNoKG5ldyBEaXJlY3RpdmUoZGVzY3JpcHRvciwgdGhpcywgbm9kZSwgaG9zdCwgc2NvcGUsIGZyYWcpKTtcbiAgfTtcblxuICAvKipcbiAgICogVGVhcmRvd24gYW4gaW5zdGFuY2UsIHVub2JzZXJ2ZXMgdGhlIGRhdGEsIHVuYmluZCBhbGwgdGhlXG4gICAqIGRpcmVjdGl2ZXMsIHR1cm4gb2ZmIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlIC0gd2hldGhlciB0byByZW1vdmUgdGhlIERPTSBub2RlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlZmVyQ2xlYW51cCAtIGlmIHRydWUsIGRlZmVyIGNsZWFudXAgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBjYWxsZWQgbGF0ZXJcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5fZGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUsIGRlZmVyQ2xlYW51cCkge1xuICAgIGlmICh0aGlzLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgICBpZiAoIWRlZmVyQ2xlYW51cCkge1xuICAgICAgICB0aGlzLl9jbGVhbnVwKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRlc3Ryb3lSZWFkeTtcbiAgICB2YXIgcGVuZGluZ1JlbW92YWw7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gQ2xlYW51cCBzaG91bGQgYmUgY2FsbGVkIGVpdGhlciBzeW5jaHJvbm91c2x5IG9yIGFzeW5jaHJvbm95c2x5IGFzXG4gICAgLy8gY2FsbGJhY2sgb2YgdGhpcy4kcmVtb3ZlKCksIG9yIGlmIHJlbW92ZSBhbmQgZGVmZXJDbGVhbnVwIGFyZSBmYWxzZS5cbiAgICAvLyBJbiBhbnkgY2FzZSBpdCBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIGFsbCBvdGhlciByZW1vdmluZywgdW5iaW5kaW5nIGFuZFxuICAgIC8vIHR1cm5pbmcgb2YgaXMgZG9uZVxuICAgIHZhciBjbGVhbnVwSWZQb3NzaWJsZSA9IGZ1bmN0aW9uIGNsZWFudXBJZlBvc3NpYmxlKCkge1xuICAgICAgaWYgKGRlc3Ryb3lSZWFkeSAmJiAhcGVuZGluZ1JlbW92YWwgJiYgIWRlZmVyQ2xlYW51cCkge1xuICAgICAgICBzZWxmLl9jbGVhbnVwKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIHJlbW92ZSBET00gZWxlbWVudFxuICAgIGlmIChyZW1vdmUgJiYgdGhpcy4kZWwpIHtcbiAgICAgIHBlbmRpbmdSZW1vdmFsID0gdHJ1ZTtcbiAgICAgIHRoaXMuJHJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBlbmRpbmdSZW1vdmFsID0gZmFsc2U7XG4gICAgICAgIGNsZWFudXBJZlBvc3NpYmxlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9jYWxsSG9vaygnYmVmb3JlRGVzdHJveScpO1xuICAgIHRoaXMuX2lzQmVpbmdEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHZhciBpO1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gcGFyZW50LiBvbmx5IG5lY2Vzc2FyeVxuICAgIC8vIGlmIHBhcmVudCBpcyBub3QgYmVpbmcgZGVzdHJveWVkIGFzIHdlbGwuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMuJHBhcmVudDtcbiAgICBpZiAocGFyZW50ICYmICFwYXJlbnQuX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICAgIHBhcmVudC4kY2hpbGRyZW4uJHJlbW92ZSh0aGlzKTtcbiAgICAgIC8vIHVucmVnaXN0ZXIgcmVmIChyZW1vdmU6IHRydWUpXG4gICAgICB0aGlzLl91cGRhdGVSZWYodHJ1ZSk7XG4gICAgfVxuICAgIC8vIGRlc3Ryb3kgYWxsIGNoaWxkcmVuLlxuICAgIGkgPSB0aGlzLiRjaGlsZHJlbi5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGhpcy4kY2hpbGRyZW5baV0uJGRlc3Ryb3koKTtcbiAgICB9XG4gICAgLy8gdGVhcmRvd24gcHJvcHNcbiAgICBpZiAodGhpcy5fcHJvcHNVbmxpbmtGbikge1xuICAgICAgdGhpcy5fcHJvcHNVbmxpbmtGbigpO1xuICAgIH1cbiAgICAvLyB0ZWFyZG93biBhbGwgZGlyZWN0aXZlcy4gdGhpcyBhbHNvIHRlYXJzZG93biBhbGxcbiAgICAvLyBkaXJlY3RpdmUtb3duZWQgd2F0Y2hlcnMuXG4gICAgaWYgKHRoaXMuX3VubGlua0ZuKSB7XG4gICAgICB0aGlzLl91bmxpbmtGbigpO1xuICAgIH1cbiAgICBpID0gdGhpcy5fd2F0Y2hlcnMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHRoaXMuX3dhdGNoZXJzW2ldLnRlYXJkb3duKCk7XG4gICAgfVxuICAgIC8vIHJlbW92ZSByZWZlcmVuY2UgdG8gc2VsZiBvbiAkZWxcbiAgICBpZiAodGhpcy4kZWwpIHtcbiAgICAgIHRoaXMuJGVsLl9fdnVlX18gPSBudWxsO1xuICAgIH1cblxuICAgIGRlc3Ryb3lSZWFkeSA9IHRydWU7XG4gICAgY2xlYW51cElmUG9zc2libGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYW4gdXAgdG8gZW5zdXJlIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAgICogVGhpcyBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGxlYXZlIHRyYW5zaXRpb24gaWYgdGhlcmVcbiAgICogaXMgYW55LlxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLl9jbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIG93bmVyIGZyYWdtZW50XG4gICAgLy8gZG8gaXQgaW4gY2xlYW51cCBzbyB0aGF0IHdlIGNhbiBjYWxsICRkZXN0cm95IHdpdGhcbiAgICAvLyBkZWZlciByaWdodCB3aGVuIGEgZnJhZ21lbnQgaXMgYWJvdXQgdG8gYmUgcmVtb3ZlZC5cbiAgICBpZiAodGhpcy5fZnJhZykge1xuICAgICAgdGhpcy5fZnJhZy5jaGlsZHJlbi4kcmVtb3ZlKHRoaXMpO1xuICAgIH1cbiAgICAvLyByZW1vdmUgcmVmZXJlbmNlIGZyb20gZGF0YSBvYlxuICAgIC8vIGZyb3plbiBvYmplY3QgbWF5IG5vdCBoYXZlIG9ic2VydmVyLlxuICAgIGlmICh0aGlzLl9kYXRhLl9fb2JfXykge1xuICAgICAgdGhpcy5fZGF0YS5fX29iX18ucmVtb3ZlVm0odGhpcyk7XG4gICAgfVxuICAgIC8vIENsZWFuIHVwIHJlZmVyZW5jZXMgdG8gcHJpdmF0ZSBwcm9wZXJ0aWVzIGFuZCBvdGhlclxuICAgIC8vIGluc3RhbmNlcy4gcHJlc2VydmUgcmVmZXJlbmNlIHRvIF9kYXRhIHNvIHRoYXQgcHJveHlcbiAgICAvLyBhY2Nlc3NvcnMgc3RpbGwgd29yay4gVGhlIG9ubHkgcG90ZW50aWFsIHNpZGUgZWZmZWN0XG4gICAgLy8gaGVyZSBpcyB0aGF0IG11dGF0aW5nIHRoZSBpbnN0YW5jZSBhZnRlciBpdCdzIGRlc3Ryb3llZFxuICAgIC8vIG1heSBhZmZlY3QgdGhlIHN0YXRlIG9mIG90aGVyIGNvbXBvbmVudHMgdGhhdCBhcmUgc3RpbGxcbiAgICAvLyBvYnNlcnZpbmcgdGhlIHNhbWUgb2JqZWN0LCBidXQgdGhhdCBzZWVtcyB0byBiZSBhXG4gICAgLy8gcmVhc29uYWJsZSByZXNwb25zaWJpbGl0eSBmb3IgdGhlIHVzZXIgcmF0aGVyIHRoYW5cbiAgICAvLyBhbHdheXMgdGhyb3dpbmcgYW4gZXJyb3Igb24gdGhlbS5cbiAgICB0aGlzLiRlbCA9IHRoaXMuJHBhcmVudCA9IHRoaXMuJHJvb3QgPSB0aGlzLiRjaGlsZHJlbiA9IHRoaXMuX3dhdGNoZXJzID0gdGhpcy5fY29udGV4dCA9IHRoaXMuX3Njb3BlID0gdGhpcy5fZGlyZWN0aXZlcyA9IG51bGw7XG4gICAgLy8gY2FsbCB0aGUgbGFzdCBob29rLi4uXG4gICAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2NhbGxIb29rKCdkZXN0cm95ZWQnKTtcbiAgICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxuICAgIHRoaXMuJG9mZigpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBtaXNjTWl4aW4gKFZ1ZSkge1xuICAvKipcbiAgICogQXBwbHkgYSBsaXN0IG9mIGZpbHRlciAoZGVzY3JpcHRvcnMpIHRvIGEgdmFsdWUuXG4gICAqIFVzaW5nIHBsYWluIGZvciBsb29wcyBoZXJlIGJlY2F1c2UgdGhpcyB3aWxsIGJlIGNhbGxlZCBpblxuICAgKiB0aGUgZ2V0dGVyIG9mIGFueSB3YXRjaGVyIHdpdGggZmlsdGVycyBzbyBpdCBpcyB2ZXJ5XG4gICAqIHBlcmZvcm1hbmNlIHNlbnNpdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0geyp9IFtvbGRWYWx1ZV1cbiAgICogQHBhcmFtIHtBcnJheX0gZmlsdGVyc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdyaXRlXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuX2FwcGx5RmlsdGVycyA9IGZ1bmN0aW9uICh2YWx1ZSwgb2xkVmFsdWUsIGZpbHRlcnMsIHdyaXRlKSB7XG4gICAgdmFyIGZpbHRlciwgZm4sIGFyZ3MsIGFyZywgb2Zmc2V0LCBpLCBsLCBqLCBrO1xuICAgIGZvciAoaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZmlsdGVyID0gZmlsdGVyc1t3cml0ZSA/IGwgLSBpIC0gMSA6IGldO1xuICAgICAgZm4gPSByZXNvbHZlQXNzZXQodGhpcy4kb3B0aW9ucywgJ2ZpbHRlcnMnLCBmaWx0ZXIubmFtZSk7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBhc3NlcnRBc3NldChmbiwgJ2ZpbHRlcicsIGZpbHRlci5uYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmICghZm4pIGNvbnRpbnVlO1xuICAgICAgZm4gPSB3cml0ZSA/IGZuLndyaXRlIDogZm4ucmVhZCB8fCBmbjtcbiAgICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIGNvbnRpbnVlO1xuICAgICAgYXJncyA9IHdyaXRlID8gW3ZhbHVlLCBvbGRWYWx1ZV0gOiBbdmFsdWVdO1xuICAgICAgb2Zmc2V0ID0gd3JpdGUgPyAyIDogMTtcbiAgICAgIGlmIChmaWx0ZXIuYXJncykge1xuICAgICAgICBmb3IgKGogPSAwLCBrID0gZmlsdGVyLmFyZ3MubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgYXJnID0gZmlsdGVyLmFyZ3Nbal07XG4gICAgICAgICAgYXJnc1tqICsgb2Zmc2V0XSA9IGFyZy5keW5hbWljID8gdGhpcy4kZ2V0KGFyZy52YWx1ZSkgOiBhcmcudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUmVzb2x2ZSBhIGNvbXBvbmVudCwgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIGNvbXBvbmVudFxuICAgKiBpcyBkZWZpbmVkIG5vcm1hbGx5IG9yIHVzaW5nIGFuIGFzeW5jIGZhY3RvcnkgZnVuY3Rpb24uXG4gICAqIFJlc29sdmVzIHN5bmNocm9ub3VzbHkgaWYgYWxyZWFkeSByZXNvbHZlZCwgb3RoZXJ3aXNlXG4gICAqIHJlc29sdmVzIGFzeW5jaHJvbm91c2x5IGFuZCBjYWNoZXMgdGhlIHJlc29sdmVkXG4gICAqIGNvbnN0cnVjdG9yIG9uIHRoZSBmYWN0b3J5LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdmFsdWVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS5fcmVzb2x2ZUNvbXBvbmVudCA9IGZ1bmN0aW9uICh2YWx1ZSwgY2IpIHtcbiAgICB2YXIgZmFjdG9yeTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmYWN0b3J5ID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhY3RvcnkgPSByZXNvbHZlQXNzZXQodGhpcy4kb3B0aW9ucywgJ2NvbXBvbmVudHMnLCB2YWx1ZSk7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBhc3NlcnRBc3NldChmYWN0b3J5LCAnY29tcG9uZW50JywgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWZhY3RvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gYXN5bmMgY29tcG9uZW50IGZhY3RvcnlcbiAgICBpZiAoIWZhY3Rvcnkub3B0aW9ucykge1xuICAgICAgaWYgKGZhY3RvcnkucmVzb2x2ZWQpIHtcbiAgICAgICAgLy8gY2FjaGVkXG4gICAgICAgIGNiKGZhY3RvcnkucmVzb2x2ZWQpO1xuICAgICAgfSBlbHNlIGlmIChmYWN0b3J5LnJlcXVlc3RlZCkge1xuICAgICAgICAvLyBwb29sIGNhbGxiYWNrc1xuICAgICAgICBmYWN0b3J5LnBlbmRpbmdDYWxsYmFja3MucHVzaChjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5LnJlcXVlc3RlZCA9IHRydWU7XG4gICAgICAgIHZhciBjYnMgPSBmYWN0b3J5LnBlbmRpbmdDYWxsYmFja3MgPSBbY2JdO1xuICAgICAgICBmYWN0b3J5LmNhbGwodGhpcywgZnVuY3Rpb24gcmVzb2x2ZShyZXMpIHtcbiAgICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChyZXMpKSB7XG4gICAgICAgICAgICByZXMgPSBWdWUuZXh0ZW5kKHJlcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGNhY2hlIHJlc29sdmVkXG4gICAgICAgICAgZmFjdG9yeS5yZXNvbHZlZCA9IHJlcztcbiAgICAgICAgICAvLyBpbnZva2UgY2FsbGJhY2tzXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBjYnNbaV0ocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJ0ZhaWxlZCB0byByZXNvbHZlIGFzeW5jIGNvbXBvbmVudCcgKyAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/ICc6ICcgKyB2YWx1ZSA6ICcnKSArICcuICcgKyAocmVhc29uID8gJ1xcblJlYXNvbjogJyArIHJlYXNvbiA6ICcnKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3JtYWwgY29tcG9uZW50XG4gICAgICBjYihmYWN0b3J5KTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBmaWx0ZXJSRSQxID0gL1tefF1cXHxbXnxdLztcblxuZnVuY3Rpb24gZGF0YUFQSSAoVnVlKSB7XG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIGZyb20gYW4gZXhwcmVzc2lvbiBvbiB0aGlzIHZtLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FzU3RhdGVtZW50XVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRnZXQgPSBmdW5jdGlvbiAoZXhwLCBhc1N0YXRlbWVudCkge1xuICAgIHZhciByZXMgPSBwYXJzZUV4cHJlc3Npb24oZXhwKTtcbiAgICBpZiAocmVzKSB7XG4gICAgICBpZiAoYXNTdGF0ZW1lbnQgJiYgIWlzU2ltcGxlUGF0aChleHApKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHN0YXRlbWVudEhhbmRsZXIoKSB7XG4gICAgICAgICAgc2VsZi4kYXJndW1lbnRzID0gdG9BcnJheShhcmd1bWVudHMpO1xuICAgICAgICAgIHZhciByZXN1bHQgPSByZXMuZ2V0LmNhbGwoc2VsZiwgc2VsZik7XG4gICAgICAgICAgc2VsZi4kYXJndW1lbnRzID0gbnVsbDtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gcmVzLmdldC5jYWxsKHRoaXMsIHRoaXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2V0IHRoZSB2YWx1ZSBmcm9tIGFuIGV4cHJlc3Npb24gb24gdGhpcyB2bS5cbiAgICogVGhlIGV4cHJlc3Npb24gbXVzdCBiZSBhIHZhbGlkIGxlZnQtaGFuZFxuICAgKiBleHByZXNzaW9uIGluIGFuIGFzc2lnbm1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAgICogQHBhcmFtIHsqfSB2YWxcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS4kc2V0ID0gZnVuY3Rpb24gKGV4cCwgdmFsKSB7XG4gICAgdmFyIHJlcyA9IHBhcnNlRXhwcmVzc2lvbihleHAsIHRydWUpO1xuICAgIGlmIChyZXMgJiYgcmVzLnNldCkge1xuICAgICAgcmVzLnNldC5jYWxsKHRoaXMsIHRoaXMsIHZhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEZWxldGUgYSBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRkZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgZGVsKHRoaXMuX2RhdGEsIGtleSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhdGNoIGFuIGV4cHJlc3Npb24sIHRyaWdnZXIgY2FsbGJhY2sgd2hlbiBpdHNcbiAgICogdmFsdWUgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IGV4cE9yRm5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gZGVlcFxuICAgKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gaW1tZWRpYXRlXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIHVud2F0Y2hGblxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiR3YXRjaCA9IGZ1bmN0aW9uIChleHBPckZuLCBjYiwgb3B0aW9ucykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodHlwZW9mIGV4cE9yRm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJzZWQgPSBwYXJzZURpcmVjdGl2ZShleHBPckZuKTtcbiAgICAgIGV4cE9yRm4gPSBwYXJzZWQuZXhwcmVzc2lvbjtcbiAgICB9XG4gICAgdmFyIHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih2bSwgZXhwT3JGbiwgY2IsIHtcbiAgICAgIGRlZXA6IG9wdGlvbnMgJiYgb3B0aW9ucy5kZWVwLFxuICAgICAgc3luYzogb3B0aW9ucyAmJiBvcHRpb25zLnN5bmMsXG4gICAgICBmaWx0ZXJzOiBwYXJzZWQgJiYgcGFyc2VkLmZpbHRlcnMsXG4gICAgICB1c2VyOiAhb3B0aW9ucyB8fCBvcHRpb25zLnVzZXIgIT09IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5pbW1lZGlhdGUpIHtcbiAgICAgIGNiLmNhbGwodm0sIHdhdGNoZXIudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gdW53YXRjaEZuKCkge1xuICAgICAgd2F0Y2hlci50ZWFyZG93bigpO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIGEgdGV4dCBkaXJlY3RpdmUsIGluY2x1ZGluZyBmaWx0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthc1N0YXRlbWVudF1cbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRldmFsID0gZnVuY3Rpb24gKHRleHQsIGFzU3RhdGVtZW50KSB7XG4gICAgLy8gY2hlY2sgZm9yIGZpbHRlcnMuXG4gICAgaWYgKGZpbHRlclJFJDEudGVzdCh0ZXh0KSkge1xuICAgICAgdmFyIGRpciA9IHBhcnNlRGlyZWN0aXZlKHRleHQpO1xuICAgICAgLy8gdGhlIGZpbHRlciByZWdleCBjaGVjayBtaWdodCBnaXZlIGZhbHNlIHBvc2l0aXZlXG4gICAgICAvLyBmb3IgcGlwZXMgaW5zaWRlIHN0cmluZ3MsIHNvIGl0J3MgcG9zc2libGUgdGhhdFxuICAgICAgLy8gd2UgZG9uJ3QgZ2V0IGFueSBmaWx0ZXJzIGhlcmVcbiAgICAgIHZhciB2YWwgPSB0aGlzLiRnZXQoZGlyLmV4cHJlc3Npb24sIGFzU3RhdGVtZW50KTtcbiAgICAgIHJldHVybiBkaXIuZmlsdGVycyA/IHRoaXMuX2FwcGx5RmlsdGVycyh2YWwsIG51bGwsIGRpci5maWx0ZXJzKSA6IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gZmlsdGVyXG4gICAgICByZXR1cm4gdGhpcy4kZ2V0KHRleHQsIGFzU3RhdGVtZW50KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEludGVycG9sYXRlIGEgcGllY2Ugb2YgdGVtcGxhdGUgdGV4dC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRpbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgdmFyIHRva2VucyA9IHBhcnNlVGV4dCh0ZXh0KTtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIGlmICh0b2tlbnMpIHtcbiAgICAgIGlmICh0b2tlbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiB2bS4kZXZhbCh0b2tlbnNbMF0udmFsdWUpICsgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICByZXR1cm4gdG9rZW4udGFnID8gdm0uJGV2YWwodG9rZW4udmFsdWUpIDogdG9rZW4udmFsdWU7XG4gICAgICAgIH0pLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIExvZyBpbnN0YW5jZSBkYXRhIGFzIGEgcGxhaW4gSlMgb2JqZWN0XG4gICAqIHNvIHRoYXQgaXQgaXMgZWFzaWVyIHRvIGluc3BlY3QgaW4gY29uc29sZS5cbiAgICogVGhpcyBtZXRob2QgYXNzdW1lcyBjb25zb2xlIGlzIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwYXRoXVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRsb2cgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHZhciBkYXRhID0gcGF0aCA/IGdldFBhdGgodGhpcy5fZGF0YSwgcGF0aCkgOiB0aGlzLl9kYXRhO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBkYXRhID0gY2xlYW4oZGF0YSk7XG4gICAgfVxuICAgIC8vIGluY2x1ZGUgY29tcHV0ZWQgZmllbGRzXG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAgZm9yIChrZXkgaW4gdGhpcy4kb3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgICBkYXRhW2tleV0gPSBjbGVhbih0aGlzW2tleV0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3Byb3BzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIHRoaXMuX3Byb3BzKSB7XG4gICAgICAgICAgZGF0YVtrZXldID0gY2xlYW4odGhpc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfTtcblxuICAvKipcbiAgICogXCJjbGVhblwiIGEgZ2V0dGVyL3NldHRlciBjb252ZXJ0ZWQgb2JqZWN0IGludG8gYSBwbGFpblxuICAgKiBvYmplY3QgY29weS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IC0gb2JqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgZnVuY3Rpb24gY2xlYW4ob2JqKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZG9tQVBJIChWdWUpIHtcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIG9uLWluc3RhbmNlIG5leHRUaWNrLiBUaGUgY2FsbGJhY2sgaXNcbiAgICogYXV0by1ib3VuZCB0byB0aGUgaW5zdGFuY2UsIGFuZCB0aGlzIGF2b2lkcyBjb21wb25lbnRcbiAgICogbW9kdWxlcyBoYXZpbmcgdG8gcmVseSBvbiB0aGUgZ2xvYmFsIFZ1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS4kbmV4dFRpY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICBuZXh0VGljayhmbiwgdGhpcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFwcGVuZCBpbnN0YW5jZSB0byB0YXJnZXRcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuJGFwcGVuZFRvID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gICAgcmV0dXJuIGluc2VydCh0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbiwgYXBwZW5kLCBhcHBlbmRXaXRoVHJhbnNpdGlvbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFByZXBlbmQgaW5zdGFuY2UgdG8gdGFyZ2V0XG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRwcmVwZW5kVG8gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpO1xuICAgIGlmICh0YXJnZXQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICB0aGlzLiRiZWZvcmUodGFyZ2V0LmZpcnN0Q2hpbGQsIGNiLCB3aXRoVHJhbnNpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGFwcGVuZFRvKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluc2VydCBpbnN0YW5jZSBiZWZvcmUgdGFyZ2V0XG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRiZWZvcmUgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgICByZXR1cm4gaW5zZXJ0KHRoaXMsIHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uLCBiZWZvcmVXaXRoQ2IsIGJlZm9yZVdpdGhUcmFuc2l0aW9uKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5zZXJ0IGluc3RhbmNlIGFmdGVyIHRhcmdldFxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS4kYWZ0ZXIgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpO1xuICAgIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICAgIHRoaXMuJGJlZm9yZSh0YXJnZXQubmV4dFNpYmxpbmcsIGNiLCB3aXRoVHJhbnNpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGFwcGVuZFRvKHRhcmdldC5wYXJlbnROb2RlLCBjYiwgd2l0aFRyYW5zaXRpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIGluc3RhbmNlIGZyb20gRE9NXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRyZW1vdmUgPSBmdW5jdGlvbiAoY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gICAgaWYgKCF0aGlzLiRlbC5wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm4gY2IgJiYgY2IoKTtcbiAgICB9XG4gICAgdmFyIGluRG9jdW1lbnQgPSB0aGlzLl9pc0F0dGFjaGVkICYmIGluRG9jKHRoaXMuJGVsKTtcbiAgICAvLyBpZiB3ZSBhcmUgbm90IGluIGRvY3VtZW50LCBubyBuZWVkIHRvIGNoZWNrXG4gICAgLy8gZm9yIHRyYW5zaXRpb25zXG4gICAgaWYgKCFpbkRvY3VtZW50KSB3aXRoVHJhbnNpdGlvbiA9IGZhbHNlO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVhbENiID0gZnVuY3Rpb24gcmVhbENiKCkge1xuICAgICAgaWYgKGluRG9jdW1lbnQpIHNlbGYuX2NhbGxIb29rKCdkZXRhY2hlZCcpO1xuICAgICAgaWYgKGNiKSBjYigpO1xuICAgIH07XG4gICAgaWYgKHRoaXMuX2lzRnJhZ21lbnQpIHtcbiAgICAgIHJlbW92ZU5vZGVSYW5nZSh0aGlzLl9mcmFnbWVudFN0YXJ0LCB0aGlzLl9mcmFnbWVudEVuZCwgdGhpcywgdGhpcy5fZnJhZ21lbnQsIHJlYWxDYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZSA/IHJlbW92ZVdpdGhDYiA6IHJlbW92ZVdpdGhUcmFuc2l0aW9uO1xuICAgICAgb3AodGhpcy4kZWwsIHRoaXMsIHJlYWxDYik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaGFyZWQgRE9NIGluc2VydGlvbiBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wMSAtIG9wIGZvciBub24tdHJhbnNpdGlvbiBpbnNlcnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3AyIC0gb3AgZm9yIHRyYW5zaXRpb24gaW5zZXJ0XG4gICAqIEByZXR1cm4gdm1cbiAgICovXG5cbiAgZnVuY3Rpb24gaW5zZXJ0KHZtLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbiwgb3AxLCBvcDIpIHtcbiAgICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpO1xuICAgIHZhciB0YXJnZXRJc0RldGFjaGVkID0gIWluRG9jKHRhcmdldCk7XG4gICAgdmFyIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlIHx8IHRhcmdldElzRGV0YWNoZWQgPyBvcDEgOiBvcDI7XG4gICAgdmFyIHNob3VsZENhbGxIb29rID0gIXRhcmdldElzRGV0YWNoZWQgJiYgIXZtLl9pc0F0dGFjaGVkICYmICFpbkRvYyh2bS4kZWwpO1xuICAgIGlmICh2bS5faXNGcmFnbWVudCkge1xuICAgICAgbWFwTm9kZVJhbmdlKHZtLl9mcmFnbWVudFN0YXJ0LCB2bS5fZnJhZ21lbnRFbmQsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG9wKG5vZGUsIHRhcmdldCwgdm0pO1xuICAgICAgfSk7XG4gICAgICBjYiAmJiBjYigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcCh2bS4kZWwsIHRhcmdldCwgdm0sIGNiKTtcbiAgICB9XG4gICAgaWYgKHNob3VsZENhbGxIb29rKSB7XG4gICAgICB2bS5fY2FsbEhvb2soJ2F0dGFjaGVkJyk7XG4gICAgfVxuICAgIHJldHVybiB2bTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3Igc2VsZWN0b3JzXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHF1ZXJ5KGVsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBlbCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKSA6IGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZCBvcGVyYXRpb24gdGhhdCB0YWtlcyBhIGNhbGxiYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsXG4gICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGFwcGVuZChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIGlmIChjYikgY2IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnRCZWZvcmUgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBlbFxuICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgKiBAcGFyYW0ge1Z1ZX0gdm0gLSB1bnVzZWRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgKi9cblxuICBmdW5jdGlvbiBiZWZvcmVXaXRoQ2IoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gICAgYmVmb3JlKGVsLCB0YXJnZXQpO1xuICAgIGlmIChjYikgY2IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBlbFxuICAgKiBAcGFyYW0ge1Z1ZX0gdm0gLSB1bnVzZWRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgKi9cblxuICBmdW5jdGlvbiByZW1vdmVXaXRoQ2IoZWwsIHZtLCBjYikge1xuICAgIHJlbW92ZShlbCk7XG4gICAgaWYgKGNiKSBjYigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50c0FQSSAoVnVlKSB7XG4gIC8qKlxuICAgKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS4kb24gPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgKHRoaXMuX2V2ZW50c1tldmVudF0gfHwgKHRoaXMuX2V2ZW50c1tldmVudF0gPSBbXSkpLnB1c2goZm4pO1xuICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIDEpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAgICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuJG9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgc2VsZi4kb2ZmKGV2ZW50LCBvbik7XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBvbi5mbiA9IGZuO1xuICAgIHRoaXMuJG9uKGV2ZW50LCBvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gICAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciBjYnM7XG4gICAgLy8gYWxsXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICAgIGZvciAoZXZlbnQgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICAgICAgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgICBpZiAoY2JzKSB7XG4gICAgICAgICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvLyBzcGVjaWZpYyBldmVudFxuICAgIGNicyA9IHRoaXMuX2V2ZW50c1tldmVudF07XG4gICAgaWYgKCFjYnMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgbW9kaWZ5TGlzdGVuZXJDb3VudCh0aGlzLCBldmVudCwgLWNicy5sZW5ndGgpO1xuICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IG51bGw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gc3BlY2lmaWMgaGFuZGxlclxuICAgIHZhciBjYjtcbiAgICB2YXIgaSA9IGNicy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgY2IgPSBjYnNbaV07XG4gICAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtMSk7XG4gICAgICAgIGNicy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBldmVudCBvbiBzZWxmLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGV2ZW50XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHNob3VsZFByb3BhZ2F0ZVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRlbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGlzU291cmNlID0gdHlwZW9mIGV2ZW50ID09PSAnc3RyaW5nJztcbiAgICBldmVudCA9IGlzU291cmNlID8gZXZlbnQgOiBldmVudC5uYW1lO1xuICAgIHZhciBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuICAgIHZhciBzaG91bGRQcm9wYWdhdGUgPSBpc1NvdXJjZSB8fCAhY2JzO1xuICAgIGlmIChjYnMpIHtcbiAgICAgIGNicyA9IGNicy5sZW5ndGggPiAxID8gdG9BcnJheShjYnMpIDogY2JzO1xuICAgICAgLy8gdGhpcyBpcyBhIHNvbWV3aGF0IGhhY2t5IHNvbHV0aW9uIHRvIHRoZSBxdWVzdGlvbiByYWlzZWRcbiAgICAgIC8vIGluICMyMTAyOiBmb3IgYW4gaW5saW5lIGNvbXBvbmVudCBsaXN0ZW5lciBsaWtlIDxjb21wIEB0ZXN0PVwiZG9UaGlzXCI+LFxuICAgICAgLy8gdGhlIHByb3BhZ2F0aW9uIGhhbmRsaW5nIGlzIHNvbWV3aGF0IGJyb2tlbi4gVGhlcmVmb3JlIHdlXG4gICAgICAvLyBuZWVkIHRvIHRyZWF0IHRoZXNlIGlubGluZSBjYWxsYmFja3MgZGlmZmVyZW50bHkuXG4gICAgICB2YXIgaGFzUGFyZW50Q2JzID0gaXNTb3VyY2UgJiYgY2JzLnNvbWUoZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIHJldHVybiBjYi5fZnJvbVBhcmVudDtcbiAgICAgIH0pO1xuICAgICAgaWYgKGhhc1BhcmVudENicykge1xuICAgICAgICBzaG91bGRQcm9wYWdhdGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBjYiA9IGNic1tpXTtcbiAgICAgICAgdmFyIHJlcyA9IGNiLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICBpZiAocmVzID09PSB0cnVlICYmICghaGFzUGFyZW50Q2JzIHx8IGNiLl9mcm9tUGFyZW50KSkge1xuICAgICAgICAgIHNob3VsZFByb3BhZ2F0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNob3VsZFByb3BhZ2F0ZTtcbiAgfTtcblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgYnJvYWRjYXN0IGFuIGV2ZW50IHRvIGFsbCBjaGlsZHJlbiBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZXZlbnRcbiAgICogQHBhcmFtIHsuLi4qfSBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRicm9hZGNhc3QgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgaXNTb3VyY2UgPSB0eXBlb2YgZXZlbnQgPT09ICdzdHJpbmcnO1xuICAgIGV2ZW50ID0gaXNTb3VyY2UgPyBldmVudCA6IGV2ZW50Lm5hbWU7XG4gICAgLy8gaWYgbm8gY2hpbGQgaGFzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgZXZlbnQsXG4gICAgLy8gdGhlbiB0aGVyZSdzIG5vIG5lZWQgdG8gYnJvYWRjYXN0LlxuICAgIGlmICghdGhpcy5fZXZlbnRzQ291bnRbZXZlbnRdKSByZXR1cm47XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy4kY2hpbGRyZW47XG4gICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgaWYgKGlzU291cmNlKSB7XG4gICAgICAvLyB1c2Ugb2JqZWN0IGV2ZW50IHRvIGluZGljYXRlIG5vbi1zb3VyY2UgZW1pdFxuICAgICAgLy8gb24gY2hpbGRyZW5cbiAgICAgIGFyZ3NbMF0gPSB7IG5hbWU6IGV2ZW50LCBzb3VyY2U6IHRoaXMgfTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgdmFyIHNob3VsZFByb3BhZ2F0ZSA9IGNoaWxkLiRlbWl0LmFwcGx5KGNoaWxkLCBhcmdzKTtcbiAgICAgIGlmIChzaG91bGRQcm9wYWdhdGUpIHtcbiAgICAgICAgY2hpbGQuJGJyb2FkY2FzdC5hcHBseShjaGlsZCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBwcm9wYWdhdGUgYW4gZXZlbnQgdXAgdGhlIHBhcmVudCBjaGFpbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7Li4uKn0gYWRkaXRpb25hbCBhcmd1bWVudHNcbiAgICovXG5cbiAgVnVlLnByb3RvdHlwZS4kZGlzcGF0Y2ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc2hvdWxkUHJvcGFnYXRlID0gdGhpcy4kZW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICghc2hvdWxkUHJvcGFnYXRlKSByZXR1cm47XG4gICAgdmFyIHBhcmVudCA9IHRoaXMuJHBhcmVudDtcbiAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzKTtcbiAgICAvLyB1c2Ugb2JqZWN0IGV2ZW50IHRvIGluZGljYXRlIG5vbi1zb3VyY2UgZW1pdFxuICAgIC8vIG9uIHBhcmVudHNcbiAgICBhcmdzWzBdID0geyBuYW1lOiBldmVudCwgc291cmNlOiB0aGlzIH07XG4gICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgc2hvdWxkUHJvcGFnYXRlID0gcGFyZW50LiRlbWl0LmFwcGx5KHBhcmVudCwgYXJncyk7XG4gICAgICBwYXJlbnQgPSBzaG91bGRQcm9wYWdhdGUgPyBwYXJlbnQuJHBhcmVudCA6IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNb2RpZnkgdGhlIGxpc3RlbmVyIGNvdW50cyBvbiBhbGwgcGFyZW50cy5cbiAgICogVGhpcyBib29ra2VlcGluZyBhbGxvd3MgJGJyb2FkY2FzdCB0byByZXR1cm4gZWFybHkgd2hlblxuICAgKiBubyBjaGlsZCBoYXMgbGlzdGVuZWQgdG8gYSBjZXJ0YWluIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudFxuICAgKi9cblxuICB2YXIgaG9va1JFID0gL15ob29rOi87XG4gIGZ1bmN0aW9uIG1vZGlmeUxpc3RlbmVyQ291bnQodm0sIGV2ZW50LCBjb3VudCkge1xuICAgIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50O1xuICAgIC8vIGhvb2tzIGRvIG5vdCBnZXQgYnJvYWRjYXN0ZWQgc28gbm8gbmVlZFxuICAgIC8vIHRvIGRvIGJvb2trZWVwaW5nIGZvciB0aGVtXG4gICAgaWYgKCFwYXJlbnQgfHwgIWNvdW50IHx8IGhvb2tSRS50ZXN0KGV2ZW50KSkgcmV0dXJuO1xuICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdID0gKHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdIHx8IDApICsgY291bnQ7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbGlmZWN5Y2xlQVBJIChWdWUpIHtcbiAgLyoqXG4gICAqIFNldCBpbnN0YW5jZSB0YXJnZXQgZWxlbWVudCBhbmQga2ljayBvZmYgdGhlIGNvbXBpbGF0aW9uXG4gICAqIHByb2Nlc3MuIFRoZSBwYXNzZWQgaW4gYGVsYCBjYW4gYmUgYSBzZWxlY3RvciBzdHJpbmcsIGFuXG4gICAqIGV4aXN0aW5nIEVsZW1lbnQsIG9yIGEgRG9jdW1lbnRGcmFnbWVudCAoZm9yIGJsb2NrXG4gICAqIGluc3RhbmNlcykuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fHN0cmluZ30gZWxcbiAgICogQHB1YmxpY1xuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRtb3VudCA9IGZ1bmN0aW9uIChlbCkge1xuICAgIGlmICh0aGlzLl9pc0NvbXBpbGVkKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oJyRtb3VudCgpIHNob3VsZCBiZSBjYWxsZWQgb25seSBvbmNlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbCA9IHF1ZXJ5KGVsKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIH1cbiAgICB0aGlzLl9jb21waWxlKGVsKTtcbiAgICB0aGlzLl9pbml0RE9NSG9va3MoKTtcbiAgICBpZiAoaW5Eb2ModGhpcy4kZWwpKSB7XG4gICAgICB0aGlzLl9jYWxsSG9vaygnYXR0YWNoZWQnKTtcbiAgICAgIHJlYWR5LmNhbGwodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJG9uY2UoJ2hvb2s6YXR0YWNoZWQnLCByZWFkeSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNYXJrIGFuIGluc3RhbmNlIGFzIHJlYWR5LlxuICAgKi9cblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9pc1JlYWR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9jYWxsSG9vaygncmVhZHknKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZWFyZG93biB0aGUgaW5zdGFuY2UsIHNpbXBseSBkZWxlZ2F0ZSB0byB0aGUgaW50ZXJuYWxcbiAgICogX2Rlc3Ryb3kuXG4gICAqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVmZXJDbGVhbnVwXG4gICAqL1xuXG4gIFZ1ZS5wcm90b3R5cGUuJGRlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlLCBkZWZlckNsZWFudXApIHtcbiAgICB0aGlzLl9kZXN0cm95KHJlbW92ZSwgZGVmZXJDbGVhbnVwKTtcbiAgfTtcblxuICAvKipcbiAgICogUGFydGlhbGx5IGNvbXBpbGUgYSBwaWVjZSBvZiBET00gYW5kIHJldHVybiBhXG4gICAqIGRlY29tcGlsZSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gICAqIEBwYXJhbSB7VnVlfSBbaG9zdF1cbiAgICogQHBhcmFtIHtPYmplY3R9IFtzY29wZV1cbiAgICogQHBhcmFtIHtGcmFnbWVudH0gW2ZyYWddXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cblxuICBWdWUucHJvdG90eXBlLiRjb21waWxlID0gZnVuY3Rpb24gKGVsLCBob3N0LCBzY29wZSwgZnJhZykge1xuICAgIHJldHVybiBjb21waWxlKGVsLCB0aGlzLiRvcHRpb25zLCB0cnVlKSh0aGlzLCBlbCwgaG9zdCwgc2NvcGUsIGZyYWcpO1xuICB9O1xufVxuXG4vKipcbiAqIFRoZSBleHBvc2VkIFZ1ZSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBBUEkgY29udmVudGlvbnM6XG4gKiAtIHB1YmxpYyBBUEkgbWV0aG9kcy9wcm9wZXJ0aWVzIGFyZSBwcmVmaXhlZCB3aXRoIGAkYFxuICogLSBpbnRlcm5hbCBtZXRob2RzL3Byb3BlcnRpZXMgYXJlIHByZWZpeGVkIHdpdGggYF9gXG4gKiAtIG5vbi1wcmVmaXhlZCBwcm9wZXJ0aWVzIGFyZSBhc3N1bWVkIHRvIGJlIHByb3hpZWQgdXNlclxuICogICBkYXRhLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFZ1ZShvcHRpb25zKSB7XG4gIHRoaXMuX2luaXQob3B0aW9ucyk7XG59XG5cbi8vIGluc3RhbGwgaW50ZXJuYWxzXG5pbml0TWl4aW4oVnVlKTtcbnN0YXRlTWl4aW4oVnVlKTtcbmV2ZW50c01peGluKFZ1ZSk7XG5saWZlY3ljbGVNaXhpbihWdWUpO1xubWlzY01peGluKFZ1ZSk7XG5cbi8vIGluc3RhbGwgaW5zdGFuY2UgQVBJc1xuZGF0YUFQSShWdWUpO1xuZG9tQVBJKFZ1ZSk7XG5ldmVudHNBUEkoVnVlKTtcbmxpZmVjeWNsZUFQSShWdWUpO1xuXG52YXIgc2xvdCA9IHtcblxuICBwcmlvcml0eTogU0xPVCxcbiAgcGFyYW1zOiBbJ25hbWUnXSxcblxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgIC8vIHRoaXMgd2FzIHJlc29sdmVkIGR1cmluZyBjb21wb25lbnQgdHJhbnNjbHVzaW9uXG4gICAgdmFyIG5hbWUgPSB0aGlzLnBhcmFtcy5uYW1lIHx8ICdkZWZhdWx0JztcbiAgICB2YXIgY29udGVudCA9IHRoaXMudm0uX3Nsb3RDb250ZW50cyAmJiB0aGlzLnZtLl9zbG90Q29udGVudHNbbmFtZV07XG4gICAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5mYWxsYmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbXBpbGUoY29udGVudC5jbG9uZU5vZGUodHJ1ZSksIHRoaXMudm0uX2NvbnRleHQsIHRoaXMudm0pO1xuICAgIH1cbiAgfSxcblxuICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRlbnQsIGNvbnRleHQsIGhvc3QpIHtcbiAgICBpZiAoY29udGVudCAmJiBjb250ZXh0KSB7XG4gICAgICBpZiAodGhpcy5lbC5oYXNDaGlsZE5vZGVzKCkgJiYgY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiBjb250ZW50LmNoaWxkTm9kZXNbMF0ubm9kZVR5cGUgPT09IDEgJiYgY29udGVudC5jaGlsZE5vZGVzWzBdLmhhc0F0dHJpYnV0ZSgndi1pZicpKSB7XG4gICAgICAgIC8vIGlmIHRoZSBpbnNlcnRlZCBzbG90IGhhcyB2LWlmXG4gICAgICAgIC8vIGluamVjdCBmYWxsYmFjayBjb250ZW50IGFzIHRoZSB2LWVsc2VcbiAgICAgICAgdmFyIGVsc2VCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgIGVsc2VCbG9jay5zZXRBdHRyaWJ1dGUoJ3YtZWxzZScsICcnKTtcbiAgICAgICAgZWxzZUJsb2NrLmlubmVySFRNTCA9IHRoaXMuZWwuaW5uZXJIVE1MO1xuICAgICAgICAvLyB0aGUgZWxzZSBibG9jayBzaG91bGQgYmUgY29tcGlsZWQgaW4gY2hpbGQgc2NvcGVcbiAgICAgICAgZWxzZUJsb2NrLl9jb250ZXh0ID0gdGhpcy52bTtcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChlbHNlQmxvY2spO1xuICAgICAgfVxuICAgICAgdmFyIHNjb3BlID0gaG9zdCA/IGhvc3QuX3Njb3BlIDogdGhpcy5fc2NvcGU7XG4gICAgICB0aGlzLnVubGluayA9IGNvbnRleHQuJGNvbXBpbGUoY29udGVudCwgaG9zdCwgc2NvcGUsIHRoaXMuX2ZyYWcpO1xuICAgIH1cbiAgICBpZiAoY29udGVudCkge1xuICAgICAgcmVwbGFjZSh0aGlzLmVsLCBjb250ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlKHRoaXMuZWwpO1xuICAgIH1cbiAgfSxcblxuICBmYWxsYmFjazogZnVuY3Rpb24gZmFsbGJhY2soKSB7XG4gICAgdGhpcy5jb21waWxlKGV4dHJhY3RDb250ZW50KHRoaXMuZWwsIHRydWUpLCB0aGlzLnZtKTtcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uIHVuYmluZCgpIHtcbiAgICBpZiAodGhpcy51bmxpbmspIHtcbiAgICAgIHRoaXMudW5saW5rKCk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgcGFydGlhbCA9IHtcblxuICBwcmlvcml0eTogUEFSVElBTCxcblxuICBwYXJhbXM6IFsnbmFtZSddLFxuXG4gIC8vIHdhdGNoIGNoYW5nZXMgdG8gbmFtZSBmb3IgZHluYW1pYyBwYXJ0aWFsc1xuICBwYXJhbVdhdGNoZXJzOiB7XG4gICAgbmFtZTogZnVuY3Rpb24gbmFtZSh2YWx1ZSkge1xuICAgICAgdklmLnJlbW92ZS5jYWxsKHRoaXMpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICB0aGlzLmFuY2hvciA9IGNyZWF0ZUFuY2hvcigndi1wYXJ0aWFsJyk7XG4gICAgcmVwbGFjZSh0aGlzLmVsLCB0aGlzLmFuY2hvcik7XG4gICAgdGhpcy5pbnNlcnQodGhpcy5wYXJhbXMubmFtZSk7XG4gIH0sXG5cbiAgaW5zZXJ0OiBmdW5jdGlvbiBpbnNlcnQoaWQpIHtcbiAgICB2YXIgcGFydGlhbCA9IHJlc29sdmVBc3NldCh0aGlzLnZtLiRvcHRpb25zLCAncGFydGlhbHMnLCBpZCk7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGFzc2VydEFzc2V0KHBhcnRpYWwsICdwYXJ0aWFsJywgaWQpO1xuICAgIH1cbiAgICBpZiAocGFydGlhbCkge1xuICAgICAgdGhpcy5mYWN0b3J5ID0gbmV3IEZyYWdtZW50RmFjdG9yeSh0aGlzLnZtLCBwYXJ0aWFsKTtcbiAgICAgIHZJZi5pbnNlcnQuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgaWYgKHRoaXMuZnJhZykge1xuICAgICAgdGhpcy5mcmFnLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBlbGVtZW50RGlyZWN0aXZlcyA9IHtcbiAgc2xvdDogc2xvdCxcbiAgcGFydGlhbDogcGFydGlhbFxufTtcblxudmFyIGNvbnZlcnRBcnJheSA9IHZGb3IuX3Bvc3RQcm9jZXNzO1xuXG4vKipcbiAqIExpbWl0IGZpbHRlciBmb3IgYXJyYXlzXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgKERlY2ltYWwgZXhwZWN0ZWQpXG4gKi9cblxuZnVuY3Rpb24gbGltaXRCeShhcnIsIG4sIG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPyBwYXJzZUludChvZmZzZXQsIDEwKSA6IDA7XG4gIG4gPSB0b051bWJlcihuKTtcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJyA/IGFyci5zbGljZShvZmZzZXQsIG9mZnNldCArIG4pIDogYXJyO1xufVxuXG4vKipcbiAqIEZpbHRlciBmaWx0ZXIgZm9yIGFycmF5c1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVsaW1pdGVyXVxuICogQHBhcmFtIHtTdHJpbmd9IC4uLmRhdGFLZXlzXG4gKi9cblxuZnVuY3Rpb24gZmlsdGVyQnkoYXJyLCBzZWFyY2gsIGRlbGltaXRlcikge1xuICBhcnIgPSBjb252ZXJ0QXJyYXkoYXJyKTtcbiAgaWYgKHNlYXJjaCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBpZiAodHlwZW9mIHNlYXJjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBhcnIuZmlsdGVyKHNlYXJjaCk7XG4gIH1cbiAgLy8gY2FzdCB0byBsb3dlcmNhc2Ugc3RyaW5nXG4gIHNlYXJjaCA9ICgnJyArIHNlYXJjaCkudG9Mb3dlckNhc2UoKTtcbiAgLy8gYWxsb3cgb3B0aW9uYWwgYGluYCBkZWxpbWl0ZXJcbiAgLy8gYmVjYXVzZSB3aHkgbm90XG4gIHZhciBuID0gZGVsaW1pdGVyID09PSAnaW4nID8gMyA6IDI7XG4gIC8vIGV4dHJhY3QgYW5kIGZsYXR0ZW4ga2V5c1xuICB2YXIga2V5cyA9IHRvQXJyYXkoYXJndW1lbnRzLCBuKS5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cikge1xuICAgIHJldHVybiBwcmV2LmNvbmNhdChjdXIpO1xuICB9LCBbXSk7XG4gIHZhciByZXMgPSBbXTtcbiAgdmFyIGl0ZW0sIGtleSwgdmFsLCBqO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpdGVtID0gYXJyW2ldO1xuICAgIHZhbCA9IGl0ZW0gJiYgaXRlbS4kdmFsdWUgfHwgaXRlbTtcbiAgICBqID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKGopIHtcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAga2V5ID0ga2V5c1tqXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJyRrZXknICYmIGNvbnRhaW5zKGl0ZW0uJGtleSwgc2VhcmNoKSB8fCBjb250YWlucyhnZXRQYXRoKHZhbCwga2V5KSwgc2VhcmNoKSkge1xuICAgICAgICAgIHJlcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb250YWlucyhpdGVtLCBzZWFyY2gpKSB7XG4gICAgICByZXMucHVzaChpdGVtKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBGaWx0ZXIgZmlsdGVyIGZvciBhcnJheXNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc29ydEtleVxuICogQHBhcmFtIHtTdHJpbmd9IHJldmVyc2VcbiAqL1xuXG5mdW5jdGlvbiBvcmRlckJ5KGFyciwgc29ydEtleSwgcmV2ZXJzZSkge1xuICBhcnIgPSBjb252ZXJ0QXJyYXkoYXJyKTtcbiAgaWYgKCFzb3J0S2V5KSB7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICB2YXIgb3JkZXIgPSByZXZlcnNlICYmIHJldmVyc2UgPCAwID8gLTEgOiAxO1xuICAvLyBzb3J0IG9uIGEgY29weSB0byBhdm9pZCBtdXRhdGluZyBvcmlnaW5hbCBhcnJheVxuICByZXR1cm4gYXJyLnNsaWNlKCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChzb3J0S2V5ICE9PSAnJGtleScpIHtcbiAgICAgIGlmIChpc09iamVjdChhKSAmJiAnJHZhbHVlJyBpbiBhKSBhID0gYS4kdmFsdWU7XG4gICAgICBpZiAoaXNPYmplY3QoYikgJiYgJyR2YWx1ZScgaW4gYikgYiA9IGIuJHZhbHVlO1xuICAgIH1cbiAgICBhID0gaXNPYmplY3QoYSkgPyBnZXRQYXRoKGEsIHNvcnRLZXkpIDogYTtcbiAgICBiID0gaXNPYmplY3QoYikgPyBnZXRQYXRoKGIsIHNvcnRLZXkpIDogYjtcbiAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhID4gYiA/IG9yZGVyIDogLW9yZGVyO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTdHJpbmcgY29udGFpbiBoZWxwZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFxuICovXG5cbmZ1bmN0aW9uIGNvbnRhaW5zKHZhbCwgc2VhcmNoKSB7XG4gIHZhciBpO1xuICBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWwpO1xuICAgIGkgPSBrZXlzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAoY29udGFpbnModmFsW2tleXNbaV1dLCBzZWFyY2gpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICBpID0gdmFsLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAoY29udGFpbnModmFsW2ldLCBzZWFyY2gpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh2YWwgIT0gbnVsbCkge1xuICAgIHJldHVybiB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+IC0xO1xuICB9XG59XG5cbnZhciBkaWdpdHNSRSA9IC8oXFxkezN9KSg/PVxcZCkvZztcblxuLy8gYXNzZXQgY29sbGVjdGlvbnMgbXVzdCBiZSBhIHBsYWluIG9iamVjdC5cbnZhciBmaWx0ZXJzID0ge1xuXG4gIG9yZGVyQnk6IG9yZGVyQnksXG4gIGZpbHRlckJ5OiBmaWx0ZXJCeSxcbiAgbGltaXRCeTogbGltaXRCeSxcblxuICAvKipcbiAgICogU3RyaW5naWZ5IHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZW50XG4gICAqL1xuXG4gIGpzb246IHtcbiAgICByZWFkOiBmdW5jdGlvbiByZWFkKHZhbHVlLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgTnVtYmVyKGluZGVudCkgfHwgMik7XG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUodmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogJ2FiYycgPT4gJ0FiYydcbiAgICovXG5cbiAgY2FwaXRhbGl6ZTogZnVuY3Rpb24gY2FwaXRhbGl6ZSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHJldHVybiAnJztcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqICdhYmMnID0+ICdBQkMnXG4gICAqL1xuXG4gIHVwcGVyY2FzZTogZnVuY3Rpb24gdXBwZXJjYXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlIHx8IHZhbHVlID09PSAwID8gdmFsdWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpIDogJyc7XG4gIH0sXG5cbiAgLyoqXG4gICAqICdBYkMnID0+ICdhYmMnXG4gICAqL1xuXG4gIGxvd2VyY2FzZTogZnVuY3Rpb24gbG93ZXJjYXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlIHx8IHZhbHVlID09PSAwID8gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpIDogJyc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIDEyMzQ1ID0+ICQxMiwzNDUuMDBcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpZ25cbiAgICovXG5cbiAgY3VycmVuY3k6IGZ1bmN0aW9uIGN1cnJlbmN5KHZhbHVlLCBfY3VycmVuY3kpIHtcbiAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIGlmICghaXNGaW5pdGUodmFsdWUpIHx8ICF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuICcnO1xuICAgIF9jdXJyZW5jeSA9IF9jdXJyZW5jeSAhPSBudWxsID8gX2N1cnJlbmN5IDogJyQnO1xuICAgIHZhciBzdHJpbmdpZmllZCA9IE1hdGguYWJzKHZhbHVlKS50b0ZpeGVkKDIpO1xuICAgIHZhciBfaW50ID0gc3RyaW5naWZpZWQuc2xpY2UoMCwgLTMpO1xuICAgIHZhciBpID0gX2ludC5sZW5ndGggJSAzO1xuICAgIHZhciBoZWFkID0gaSA+IDAgPyBfaW50LnNsaWNlKDAsIGkpICsgKF9pbnQubGVuZ3RoID4gMyA/ICcsJyA6ICcnKSA6ICcnO1xuICAgIHZhciBfZmxvYXQgPSBzdHJpbmdpZmllZC5zbGljZSgtMyk7XG4gICAgdmFyIHNpZ24gPSB2YWx1ZSA8IDAgPyAnLScgOiAnJztcbiAgICByZXR1cm4gc2lnbiArIF9jdXJyZW5jeSArIGhlYWQgKyBfaW50LnNsaWNlKGkpLnJlcGxhY2UoZGlnaXRzUkUsICckMSwnKSArIF9mbG9hdDtcbiAgfSxcblxuICAvKipcbiAgICogJ2l0ZW0nID0+ICdpdGVtcydcbiAgICpcbiAgICogQHBhcmFtc1xuICAgKiAgYW4gYXJyYXkgb2Ygc3RyaW5ncyBjb3JyZXNwb25kaW5nIHRvXG4gICAqICB0aGUgc2luZ2xlLCBkb3VibGUsIHRyaXBsZSAuLi4gZm9ybXMgb2YgdGhlIHdvcmQgdG9cbiAgICogIGJlIHBsdXJhbGl6ZWQuIFdoZW4gdGhlIG51bWJlciB0byBiZSBwbHVyYWxpemVkXG4gICAqICBleGNlZWRzIHRoZSBsZW5ndGggb2YgdGhlIGFyZ3MsIGl0IHdpbGwgdXNlIHRoZSBsYXN0XG4gICAqICBlbnRyeSBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqICBlLmcuIFsnc2luZ2xlJywgJ2RvdWJsZScsICd0cmlwbGUnLCAnbXVsdGlwbGUnXVxuICAgKi9cblxuICBwbHVyYWxpemU6IGZ1bmN0aW9uIHBsdXJhbGl6ZSh2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDEgPyBhcmdzW3ZhbHVlICUgMTAgLSAxXSB8fCBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gOiBhcmdzWzBdICsgKHZhbHVlID09PSAxID8gJycgOiAncycpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWJvdW5jZSBhIGhhbmRsZXIgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5ID0gMzAwXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cblxuICBkZWJvdW5jZTogZnVuY3Rpb24gZGVib3VuY2UoaGFuZGxlciwgZGVsYXkpIHtcbiAgICBpZiAoIWhhbmRsZXIpIHJldHVybjtcbiAgICBpZiAoIWRlbGF5KSB7XG4gICAgICBkZWxheSA9IDMwMDtcbiAgICB9XG4gICAgcmV0dXJuIF9kZWJvdW5jZShoYW5kbGVyLCBkZWxheSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGluc3RhbGxHbG9iYWxBUEkgKFZ1ZSkge1xuICAvKipcbiAgICogVnVlIGFuZCBldmVyeSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgVnVlIGhhcyBhblxuICAgKiBhc3NvY2lhdGVkIG9wdGlvbnMgb2JqZWN0LCB3aGljaCBjYW4gYmUgYWNjZXNzZWQgZHVyaW5nXG4gICAqIGNvbXBpbGF0aW9uIHN0ZXBzIGFzIGB0aGlzLmNvbnN0cnVjdG9yLm9wdGlvbnNgLlxuICAgKlxuICAgKiBUaGVzZSBjYW4gYmUgc2VlbiBhcyB0aGUgZGVmYXVsdCBvcHRpb25zIG9mIGV2ZXJ5XG4gICAqIFZ1ZSBpbnN0YW5jZS5cbiAgICovXG5cbiAgVnVlLm9wdGlvbnMgPSB7XG4gICAgZGlyZWN0aXZlczogZGlyZWN0aXZlcyxcbiAgICBlbGVtZW50RGlyZWN0aXZlczogZWxlbWVudERpcmVjdGl2ZXMsXG4gICAgZmlsdGVyczogZmlsdGVycyxcbiAgICB0cmFuc2l0aW9uczoge30sXG4gICAgY29tcG9uZW50czoge30sXG4gICAgcGFydGlhbHM6IHt9LFxuICAgIHJlcGxhY2U6IHRydWVcbiAgfTtcblxuICAvKipcbiAgICogRXhwb3NlIHVzZWZ1bCBpbnRlcm5hbHNcbiAgICovXG5cbiAgVnVlLnV0aWwgPSB1dGlsO1xuICBWdWUuY29uZmlnID0gY29uZmlnO1xuICBWdWUuc2V0ID0gc2V0O1xuICBWdWVbJ2RlbGV0ZSddID0gZGVsO1xuICBWdWUubmV4dFRpY2sgPSBuZXh0VGljaztcblxuICAvKipcbiAgICogVGhlIGZvbGxvd2luZyBhcmUgZXhwb3NlZCBmb3IgYWR2YW5jZWQgdXNhZ2UgLyBwbHVnaW5zXG4gICAqL1xuXG4gIFZ1ZS5jb21waWxlciA9IGNvbXBpbGVyO1xuICBWdWUuRnJhZ21lbnRGYWN0b3J5ID0gRnJhZ21lbnRGYWN0b3J5O1xuICBWdWUuaW50ZXJuYWxEaXJlY3RpdmVzID0gaW50ZXJuYWxEaXJlY3RpdmVzO1xuICBWdWUucGFyc2VycyA9IHtcbiAgICBwYXRoOiBwYXRoLFxuICAgIHRleHQ6IHRleHQsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgIGRpcmVjdGl2ZTogZGlyZWN0aXZlLFxuICAgIGV4cHJlc3Npb246IGV4cHJlc3Npb25cbiAgfTtcblxuICAvKipcbiAgICogRWFjaCBpbnN0YW5jZSBjb25zdHJ1Y3RvciwgaW5jbHVkaW5nIFZ1ZSwgaGFzIGEgdW5pcXVlXG4gICAqIGNpZC4gVGhpcyBlbmFibGVzIHVzIHRvIGNyZWF0ZSB3cmFwcGVkIFwiY2hpbGRcbiAgICogY29uc3RydWN0b3JzXCIgZm9yIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UgYW5kIGNhY2hlIHRoZW0uXG4gICAqL1xuXG4gIFZ1ZS5jaWQgPSAwO1xuICB2YXIgY2lkID0gMTtcblxuICAvKipcbiAgICogQ2xhc3MgaW5oZXJpdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGV4dGVuZE9wdGlvbnNcbiAgICovXG5cbiAgVnVlLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XG4gICAgZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMgfHwge307XG4gICAgdmFyIFN1cGVyID0gdGhpcztcbiAgICB2YXIgaXNGaXJzdEV4dGVuZCA9IFN1cGVyLmNpZCA9PT0gMDtcbiAgICBpZiAoaXNGaXJzdEV4dGVuZCAmJiBleHRlbmRPcHRpb25zLl9DdG9yKSB7XG4gICAgICByZXR1cm4gZXh0ZW5kT3B0aW9ucy5fQ3RvcjtcbiAgICB9XG4gICAgdmFyIG5hbWUgPSBleHRlbmRPcHRpb25zLm5hbWUgfHwgU3VwZXIub3B0aW9ucy5uYW1lO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoIS9eW2EtekEtWl1bXFx3LV0qJC8udGVzdChuYW1lKSkge1xuICAgICAgICB3YXJuKCdJbnZhbGlkIGNvbXBvbmVudCBuYW1lOiBcIicgKyBuYW1lICsgJ1wiLiBDb21wb25lbnQgbmFtZXMgJyArICdjYW4gb25seSBjb250YWluIGFscGhhbnVtZXJpYyBjaGFyYWNhdGVycyBhbmQgdGhlIGh5cGhlbi4nKTtcbiAgICAgICAgbmFtZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBTdWIgPSBjcmVhdGVDbGFzcyhuYW1lIHx8ICdWdWVDb21wb25lbnQnKTtcbiAgICBTdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpO1xuICAgIFN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWI7XG4gICAgU3ViLmNpZCA9IGNpZCsrO1xuICAgIFN1Yi5vcHRpb25zID0gbWVyZ2VPcHRpb25zKFN1cGVyLm9wdGlvbnMsIGV4dGVuZE9wdGlvbnMpO1xuICAgIFN1Ylsnc3VwZXInXSA9IFN1cGVyO1xuICAgIC8vIGFsbG93IGZ1cnRoZXIgZXh0ZW5zaW9uXG4gICAgU3ViLmV4dGVuZCA9IFN1cGVyLmV4dGVuZDtcbiAgICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXG4gICAgLy8gY2FuIGhhdmUgdGhlaXIgcHJpdmF0ZSBhc3NldHMgdG9vLlxuICAgIGNvbmZpZy5fYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBTdWJbdHlwZV0gPSBTdXBlclt0eXBlXTtcbiAgICB9KTtcbiAgICAvLyBlbmFibGUgcmVjdXJzaXZlIHNlbGYtbG9va3VwXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIFN1Yi5vcHRpb25zLmNvbXBvbmVudHNbbmFtZV0gPSBTdWI7XG4gICAgfVxuICAgIC8vIGNhY2hlIGNvbnN0cnVjdG9yXG4gICAgaWYgKGlzRmlyc3RFeHRlbmQpIHtcbiAgICAgIGV4dGVuZE9wdGlvbnMuX0N0b3IgPSBTdWI7XG4gICAgfVxuICAgIHJldHVybiBTdWI7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc3ViLWNsYXNzIGNvbnN0cnVjdG9yIHdpdGggdGhlXG4gICAqIGdpdmVuIG5hbWUuIFRoaXMgZ2l2ZXMgdXMgbXVjaCBuaWNlciBvdXRwdXQgd2hlblxuICAgKiBsb2dnaW5nIGluc3RhbmNlcyBpbiB0aGUgY29uc29sZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKG5hbWUpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXctZnVuYyAqL1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgY2xhc3NpZnkobmFtZSkgKyAnIChvcHRpb25zKSB7IHRoaXMuX2luaXQob3B0aW9ucykgfScpKCk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1uZXctZnVuYyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIFBsdWdpbiBzeXN0ZW1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBsdWdpblxuICAgKi9cblxuICBWdWUudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChwbHVnaW4uaW5zdGFsbGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xuICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgICBpZiAodHlwZW9mIHBsdWdpbi5pbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwbHVnaW4uaW5zdGFsbC5hcHBseShwbHVnaW4sIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuICAgIHBsdWdpbi5pbnN0YWxsZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBcHBseSBhIGdsb2JhbCBtaXhpbiBieSBtZXJnaW5nIGl0IGludG8gdGhlIGRlZmF1bHRcbiAgICogb3B0aW9ucy5cbiAgICovXG5cbiAgVnVlLm1peGluID0gZnVuY3Rpb24gKG1peGluKSB7XG4gICAgVnVlLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoVnVlLm9wdGlvbnMsIG1peGluKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIGFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzIHdpdGggdGhlIGZvbGxvd2luZ1xuICAgKiBzaWduYXR1cmU6XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgKiBAcGFyYW0geyp9IGRlZmluaXRpb25cbiAgICovXG5cbiAgY29uZmlnLl9hc3NldFR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBWdWVbdHlwZV0gPSBmdW5jdGlvbiAoaWQsIGRlZmluaXRpb24pIHtcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGlmICh0eXBlID09PSAnY29tcG9uZW50JyAmJiAoY29tbW9uVGFnUkUudGVzdChpZCkgfHwgcmVzZXJ2ZWRUYWdSRS50ZXN0KGlkKSkpIHtcbiAgICAgICAgICAgIHdhcm4oJ0RvIG5vdCB1c2UgYnVpbHQtaW4gb3IgcmVzZXJ2ZWQgSFRNTCBlbGVtZW50cyBhcyBjb21wb25lbnQgJyArICdpZDogJyArIGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdjb21wb25lbnQnICYmIGlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcbiAgICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBpZDtcbiAgICAgICAgICBkZWZpbml0aW9uID0gVnVlLmV4dGVuZChkZWZpbml0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdID0gZGVmaW5pdGlvbjtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb247XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gZXhwb3NlIGludGVybmFsIHRyYW5zaXRpb24gQVBJXG4gIGV4dGVuZChWdWUudHJhbnNpdGlvbiwgdHJhbnNpdGlvbik7XG59XG5cbmluc3RhbGxHbG9iYWxBUEkoVnVlKTtcblxuVnVlLnZlcnNpb24gPSAnMS4wLjIwJztcblxuLy8gZGV2dG9vbHMgZ2xvYmFsIGhvb2tcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoY29uZmlnLmRldnRvb2xzKSB7XG4gIGlmIChkZXZ0b29scykge1xuICAgIGRldnRvb2xzLmVtaXQoJ2luaXQnLCBWdWUpO1xuICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgaW5Ccm93c2VyICYmIC9DaHJvbWVcXC9cXGQrLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgIGNvbnNvbGUubG9nKCdEb3dubG9hZCB0aGUgVnVlIERldnRvb2xzIGZvciBhIGJldHRlciBkZXZlbG9wbWVudCBleHBlcmllbmNlOlxcbicgKyAnaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZS1kZXZ0b29scycpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVnVlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS9kaXN0L3Z1ZS5jb21tb24uanNcbiAqKiBtb2R1bGUgaWQgPSA1N1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiVnVlLnVzZShyZXF1aXJlKCd2dWUtaW5maW5pdGUtc2Nyb2xsJykpXG5cbmNvbnN0IHN0YXRlID0gd2luZG93LnN0YXRlXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbGxlcnlNYW5hZ2VyIGV4dGVuZHMgVnVlIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKHtcblx0XHRcdGVsOiAnLmdhbGxlcnknLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpdGVtczogW10sXG5cdFx0XHRcdGJ1c3k6IGZhbHNlLFxuXHRcdFx0XHRuZXh0OiAnL2FwaS9nYWxsZXJ5LnBocCdcblx0XHRcdH0sXG5cdFx0XHRtZXRob2RzOiB7XG5cdFx0XHRcdGxvYWRNb3JlKCkge1xuXHRcdFx0XHRcdHRoaXMuYnVzeSA9IHRydWVcblxuXHRcdFx0XHRcdCQuZ2V0SlNPTih0aGlzLm5leHQsIChyZXMpID0+IHtcblxuXHRcdFx0XHRcdFx0dGhpcy5uZXh0ID0gcmVzLm5leHRcblxuXHRcdFx0XHRcdFx0cmVzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pXG5cdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5idXN5ID0gZmFsc2Vcblx0XHRcdFx0XHRcdH0sIDEwMClcblxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0bG9hZE1hcChlLCBpdGVtKSB7XG5cdFx0XHRcdFx0c3RhdGUubG9hZE1hcChpdGVtKVxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9KVxuXHRcdFxuXHR9XG5cbn1cblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZ2FsbGVyeS5qc1xuICoqLyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgKGZhY3RvcnkoKGdsb2JhbC5pbmZpbml0ZVNjcm9sbCA9IGdsb2JhbC5pbmZpbml0ZVNjcm9sbCB8fCB7fSkpKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uIHRocm90dGxlKGZuLCBkZWxheSkge1xuICAgIHZhciBub3csIGxhc3RFeGVjLCB0aW1lciwgY29udGV4dCwgYXJnczsgLy9lc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICB2YXIgZXhlY3V0ZSA9IGZ1bmN0aW9uIGV4ZWN1dGUoKSB7XG4gICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGxhc3RFeGVjID0gbm93O1xuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFzdEV4ZWMpIHtcbiAgICAgICAgdmFyIGRpZmYgPSBkZWxheSAtIChub3cgLSBsYXN0RXhlYyk7XG4gICAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICAgIGV4ZWN1dGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhlY3V0ZSgpO1xuICAgICAgICAgIH0sIGRpZmYpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleGVjdXRlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICB2YXIgZ2V0U2Nyb2xsVG9wID0gZnVuY3Rpb24gZ2V0U2Nyb2xsVG9wKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gd2luZG93KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgod2luZG93LnBhZ2VZT2Zmc2V0IHx8IDAsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50LnNjcm9sbFRvcDtcbiAgfTtcblxuICB2YXIgZ2V0Q29tcHV0ZWRTdHlsZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGU7XG5cbiAgdmFyIGdldFNjcm9sbEV2ZW50VGFyZ2V0ID0gZnVuY3Rpb24gZ2V0U2Nyb2xsRXZlbnRUYXJnZXQoZWxlbWVudCkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGVsZW1lbnQ7XG4gICAgd2hpbGUgKGN1cnJlbnROb2RlICYmIGN1cnJlbnROb2RlLnRhZ05hbWUgIT09ICdIVE1MJyAmJiBjdXJyZW50Tm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgdmFyIG92ZXJmbG93WSA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudE5vZGUpLm92ZXJmbG93WTtcbiAgICAgIGlmIChvdmVyZmxvd1kgPT09ICdzY3JvbGwnIHx8IG92ZXJmbG93WSA9PT0gJ2F1dG8nKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfTtcblxuICB2YXIgZ2V0VmlzaWJsZUhlaWdodCA9IGZ1bmN0aW9uIGdldFZpc2libGVIZWlnaHQoZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50ID09PSB3aW5kb3cpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgfTtcblxuICB2YXIgZ2V0RWxlbWVudFRvcCA9IGZ1bmN0aW9uIGdldEVsZW1lbnRUb3AoZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50ID09PSB3aW5kb3cpIHtcbiAgICAgIHJldHVybiBnZXRTY3JvbGxUb3Aod2luZG93KTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZ2V0U2Nyb2xsVG9wKHdpbmRvdyk7XG4gIH07XG5cbiAgdmFyIGlzQXR0YWNoZWQgPSBmdW5jdGlvbiBpc0F0dGFjaGVkKGVsZW1lbnQpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUudGFnTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlID09PSAxMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICB2YXIgaW5maW5pdGVTY3JvbGwgPSB7XG4gICAgZG9CaW5kOiBmdW5jdGlvbiBkb0JpbmQoKSB7XG4gICAgICBpZiAodGhpcy5iaW5kZWQpIHJldHVybjsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgdGhpcy5iaW5kZWQgPSB0cnVlO1xuXG4gICAgICB2YXIgZGlyZWN0aXZlID0gdGhpcztcbiAgICAgIHZhciBlbGVtZW50ID0gZGlyZWN0aXZlLmVsO1xuXG4gICAgICBkaXJlY3RpdmUuc2Nyb2xsRXZlbnRUYXJnZXQgPSBnZXRTY3JvbGxFdmVudFRhcmdldChlbGVtZW50KTtcbiAgICAgIGRpcmVjdGl2ZS5zY3JvbGxMaXN0ZW5lciA9IHRocm90dGxlKGRpcmVjdGl2ZS5kb0NoZWNrLmJpbmQoZGlyZWN0aXZlKSwgMjAwKTtcbiAgICAgIGRpcmVjdGl2ZS5zY3JvbGxFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkaXJlY3RpdmUuc2Nyb2xsTGlzdGVuZXIpO1xuXG4gICAgICB2YXIgZGlzYWJsZWRFeHByID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2luZmluaXRlLXNjcm9sbC1kaXNhYmxlZCcpO1xuICAgICAgdmFyIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChkaXNhYmxlZEV4cHIpIHtcbiAgICAgICAgdGhpcy52bS4kd2F0Y2goZGlzYWJsZWRFeHByLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICBkaXJlY3RpdmUuZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICBpZiAoIXZhbHVlICYmIGRpcmVjdGl2ZS5pbW1lZGlhdGVDaGVjaykge1xuICAgICAgICAgICAgZGlyZWN0aXZlLmRvQ2hlY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaXNhYmxlZCA9IEJvb2xlYW4oZGlyZWN0aXZlLnZtLiRnZXQoZGlzYWJsZWRFeHByKSk7XG4gICAgICB9XG4gICAgICBkaXJlY3RpdmUuZGlzYWJsZWQgPSBkaXNhYmxlZDtcblxuICAgICAgdmFyIGRpc3RhbmNlRXhwciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpbmZpbml0ZS1zY3JvbGwtZGlzdGFuY2UnKTtcbiAgICAgIHZhciBkaXN0YW5jZSA9IDA7XG4gICAgICBpZiAoZGlzdGFuY2VFeHByKSB7XG4gICAgICAgIGRpc3RhbmNlID0gTnVtYmVyKGRpcmVjdGl2ZS52bS4kZ2V0KGRpc3RhbmNlRXhwcikpO1xuICAgICAgICBpZiAoaXNOYU4oZGlzdGFuY2UpKSB7XG4gICAgICAgICAgZGlzdGFuY2UgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkaXJlY3RpdmUuZGlzdGFuY2UgPSBkaXN0YW5jZTtcblxuICAgICAgdmFyIGltbWVkaWF0ZUNoZWNrRXhwciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpbmZpbml0ZS1zY3JvbGwtaW1tZWRpYXRlLWNoZWNrJyk7XG4gICAgICB2YXIgaW1tZWRpYXRlQ2hlY2sgPSB0cnVlO1xuICAgICAgaWYgKGltbWVkaWF0ZUNoZWNrRXhwcikge1xuICAgICAgICBpbW1lZGlhdGVDaGVjayA9IEJvb2xlYW4oZGlyZWN0aXZlLnZtLiRnZXQoaW1tZWRpYXRlQ2hlY2tFeHByKSk7XG4gICAgICB9XG4gICAgICBkaXJlY3RpdmUuaW1tZWRpYXRlQ2hlY2sgPSBpbW1lZGlhdGVDaGVjaztcblxuICAgICAgaWYgKGltbWVkaWF0ZUNoZWNrKSB7XG4gICAgICAgIGRpcmVjdGl2ZS5kb0NoZWNrKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBldmVudE5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaW5maW5pdGUtc2Nyb2xsLWxpc3Rlbi1mb3ItZXZlbnQnKTtcbiAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgZGlyZWN0aXZlLnZtLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkaXJlY3RpdmUuZG9DaGVjaygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9DaGVjazogZnVuY3Rpb24gZG9DaGVjayhmb3JjZSkge1xuICAgICAgdmFyIHNjcm9sbEV2ZW50VGFyZ2V0ID0gdGhpcy5zY3JvbGxFdmVudFRhcmdldDtcbiAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbDtcbiAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuZGlzdGFuY2U7XG5cbiAgICAgIGlmIChmb3JjZSAhPT0gdHJ1ZSAmJiB0aGlzLmRpc2FibGVkKSByZXR1cm47IC8vZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgdmFyIHZpZXdwb3J0U2Nyb2xsVG9wID0gZ2V0U2Nyb2xsVG9wKHNjcm9sbEV2ZW50VGFyZ2V0KTtcbiAgICAgIHZhciB2aWV3cG9ydEJvdHRvbSA9IHZpZXdwb3J0U2Nyb2xsVG9wICsgZ2V0VmlzaWJsZUhlaWdodChzY3JvbGxFdmVudFRhcmdldCk7XG5cbiAgICAgIHZhciBzaG91bGRUcmlnZ2VyID0gZmFsc2U7XG5cbiAgICAgIGlmIChzY3JvbGxFdmVudFRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgICBzaG91bGRUcmlnZ2VyID0gc2Nyb2xsRXZlbnRUYXJnZXQuc2Nyb2xsSGVpZ2h0IC0gdmlld3BvcnRCb3R0b20gPD0gZGlzdGFuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZWxlbWVudEJvdHRvbSA9IGdldEVsZW1lbnRUb3AoZWxlbWVudCkgLSBnZXRFbGVtZW50VG9wKHNjcm9sbEV2ZW50VGFyZ2V0KSArIGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgdmlld3BvcnRTY3JvbGxUb3A7XG5cbiAgICAgICAgc2hvdWxkVHJpZ2dlciA9IHZpZXdwb3J0Qm90dG9tICsgZGlzdGFuY2UgPj0gZWxlbWVudEJvdHRvbTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3VsZFRyaWdnZXIgJiYgdGhpcy5leHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudm0uJGdldCh0aGlzLmV4cHJlc3Npb24pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgICAgdmFyIGRpcmVjdGl2ZSA9IHRoaXM7XG4gICAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWw7XG5cbiAgICAgIGRpcmVjdGl2ZS52bS4kb24oJ2hvb2s6cmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc0F0dGFjaGVkKGVsZW1lbnQpKSB7XG4gICAgICAgICAgZGlyZWN0aXZlLmRvQmluZCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5iaW5kVHJ5Q291bnQgPSAwO1xuXG4gICAgICB2YXIgdHJ5QmluZCA9IGZ1bmN0aW9uIHRyeUJpbmQoKSB7XG4gICAgICAgIGlmIChkaXJlY3RpdmUuYmluZFRyeUNvdW50ID4gMTApIHJldHVybjsgLy9lc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIGRpcmVjdGl2ZS5iaW5kVHJ5Q291bnQrKztcbiAgICAgICAgaWYgKGlzQXR0YWNoZWQoZWxlbWVudCkpIHtcbiAgICAgICAgICBkaXJlY3RpdmUuZG9CaW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0VGltZW91dCh0cnlCaW5kLCA1MCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRyeUJpbmQoKTtcbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgICB0aGlzLnNjcm9sbEV2ZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICBpZiAod2luZG93LlZ1ZSkge1xuICAgIHdpbmRvdy5pbmZpbml0ZVNjcm9sbCA9IGluZmluaXRlU2Nyb2xsO1xuICAgIFZ1ZS51c2UoaW5zdGFsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnN0YWxsKFZ1ZSkge1xuICAgIFZ1ZS5kaXJlY3RpdmUoJ2luZmluaXRlU2Nyb2xsJywgaW5maW5pdGVTY3JvbGwpO1xuICB9XG5cbiAgZXhwb3J0cy5pbnN0YWxsID0gaW5zdGFsbDtcbiAgZXhwb3J0cy5pbmZpbml0ZVNjcm9sbCA9IGluZmluaXRlU2Nyb2xsO1xuXG59KSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWluZmluaXRlLXNjcm9sbC92dWUtaW5maW5pdGUtc2Nyb2xsLmpzXG4gKiogbW9kdWxlIGlkID0gNTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsImltcG9ydCAnanF1ZXJ5LnRocm90dGxlZHJlc2l6ZS5qcydcblxuaW1wb3J0ICcuL2dsb2JhbC1yZW5kZXJlci5qcydcblxuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZy5qcydcbmltcG9ydCBCYXNlUGFzcyBmcm9tICcuL2Jhc2UtcGFzcy5qcydcbmltcG9ydCBQaW5ncG9uZ1JlbmRlclRhcmdldCBmcm9tICcuL3Bpbmdwb25nLXJlbmRlci10YXJnZXQuanMnXG5pbXBvcnQgQ0FSZW5kZXJUYXJnZXQgZnJvbSAnLi9jYS1yZW5kZXItdGFyZ2V0LmpzJ1xuaW1wb3J0IEJydXNoIGZyb20gJy4vYnJ1c2guanMnXG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4vY3Vyc29yLmpzJ1xuaW1wb3J0IFNoYXJlIGZyb20gJy4vc2hhcmUuanMnXG5pbXBvcnQgQmFzZTY0VXRpbCBmcm9tICcuL2Jhc2U2NC11dGlsLmpzJ1xuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZS5qcydcbmltcG9ydCBTeXN0ZW1zIGZyb20gJy4vc3lzdGVtcy5qcydcblxuaW1wb3J0IEhlbHAgZnJvbSAnLi9oZWxwLmpzJ1xuXG5jb25zdCByZW5kZXJlciA9IHdpbmRvdy5yZW5kZXJlclxuY29uc3Qgc3RhdGUgPSB3aW5kb3cuc3RhdGVcbmNvbnN0IHJvdXRlciA9IHdpbmRvdy5yb3V0ZXJcblxuY29uc3QgcmVLZXlOdW1lcmljYWwgPSAvWzEtOV0vXG5jb25zdCBpc0tleU51bWVyaWNhbCA9IGZ1bmN0aW9uKGtleSkge1xuXHRyZXR1cm4gcmVLZXlOdW1lcmljYWwuZXhlYyhrZXkpICE9IG51bGxcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIHtcblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0dGhpcy4kY2FudmFzV3JhcHBlciA9ICQoJy5jYW52YXMnKVxuXHRcdHRoaXMuJGNhbnZhcyA9ICQoJyNjYW52YXMnKVxuXG5cdFx0dGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jayh0cnVlKVxuXG5cdFx0dGhpcy5jdXJzb3IgPSBuZXcgQ3Vyc29yKHRoaXMuJGNhbnZhc1dyYXBwZXIpXG5cdFx0dGhpcy4kYnJ1c2ggPSBuZXcgQnJ1c2goKVxuXHRcdHRoaXMucGluZ3BvbmcgPSBuZXcgUGluZ3BvbmdSZW5kZXJUYXJnZXQoKVxuXHRcdFxuXHRcdHRoaXMuc2hhcmUgPSBuZXcgU2hhcmUoKVxuXG5cdFx0dGhpcy4kaGVscCA9IG5ldyBIZWxwKClcblxuXHRcdHRoaXMucmVuZGVyUGFzcyA9IG5ldyBCYXNlUGFzcyh7XG5cdFx0XHRmcmFnbWVudFNoYWRlcjogcmVxdWlyZSgnLi9zaGFkZXJzL3Bhc3N0aHJ1LmZyYWcnKSxcblx0XHRcdHVuaWZvcm1zOiB7XG5cdFx0XHRcdGJ1ZmZlcjoge3R5cGU6ICd0JywgdmFsdWU6IG51bGx9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdCQoJy5jYW52YXNfX3BhdXNlZCcpLm9uKHtcblx0XHRcdGNsaWNrOiAoKSA9PiB7XG5cdFx0XHRcdHN0YXRlLnJlc3VtZSgpXG5cdFx0XHR9LFxuXHRcdFx0bW91c2Vkb3duOiAoZSkgPT4ge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC8vIHVuaWZvcm1zXG5cdFx0dGhpcy51bmlmb3JtcyA9IHtcblx0XHRcdHJlc29sdXRpb246IHt0eXBlOiAndjInLCB2YWx1ZTogbmV3IFRIUkVFLlZlY3RvcjIoKX0sXG5cdFx0XHR0aW1lOiBcdFx0XHR7dHlwZTogJ2YnLFx0IHZhbHVlOiB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCl9LFxuXHRcdFx0c2VlZDogXHRcdFx0e3R5cGU6ICdmJywgIHZhbHVlOiAwfSxcblx0XHRcdGR4OiBcdFx0XHRcdHt0eXBlOiAnZicsXHQgdmFsdWU6IG51bGx9LFxuXHRcdFx0ZHk6IFx0XHRcdFx0e3R5cGU6ICdmJyxcdCB2YWx1ZTogbnVsbH0sXG5cblx0XHRcdGJ1ZmZlcjogXHRcdHt0eXBlOiAndCcsICB2YWx1ZTogbnVsbH0sXG5cdFx0XHRwcmV2UG9zOiAgXHR7dHlwZTogJ3YyJywgdmFsdWU6IHRoaXMuY3Vyc29yLnByZXZQb3N9LFxuXHRcdFx0Y3VydFBvczogXHRcdHt0eXBlOiAndjInLCB2YWx1ZTogdGhpcy5jdXJzb3IuY3VydFBvc30sXG5cdFx0XHRjdXJzb3JNb2RlOlx0eyB0eXBlOiAnaScsXHR2YWx1ZTogMH0sXG5cblx0XHRcdGJydXNoVHlwZTogXHRcdHsgdHlwZTogJ2knLCB2YWx1ZTogbnVsbH0sXG5cdFx0XHRicnVzaFNpemUyOiBcdHsgdHlwZTogJ2YnLCB2YWx1ZTogbnVsbH0sXG5cdFx0XHRpc1VwZGF0ZUNBOiBcdHsgdHlwZTogJ2knLCB2YWx1ZTogc3RhdGUuY3VycmVudCA9PSAnZHJhdycgPyAxIDogMH1cblx0XHR9XG5cblx0XHR0aGlzLmZpbHRlclVuaWZvcm1zID0ge1xuXHRcdFx0YnVmZmVyOiBcdFx0e3R5cGU6ICd0JyxcdFx0dmFsdWU6IG51bGx9LFxuXHRcdFx0Y3VydFBvczogXHRcdHt0eXBlOiAndjInLFx0dmFsdWU6IHRoaXMuY3Vyc29yLmN1cnRQb3N9LFxuXHRcdFx0YnJ1c2hTaXplMjpcdHsgdHlwZTogJ2YnLFx0dmFsdWU6IG51bGx9LFxuXHRcdFx0c2hhcmVSZWN0Olx0e3R5cGU6ICd2NCcsXHR2YWx1ZTogbmV3IFRIUkVFLlZlY3RvcjQoKX0sXG5cdFx0XHRvdXRlck9wYWNpdHk6XHR7IHR5cGU6ICdmJyxcdHZhbHVlOiBudWxsfVxuXHRcdH1cblxuXHRcdC8vIGV2ZW50XG5cdFx0JCh3aW5kb3cpLm9uKHtcblx0XHRcdCd0aHJvdHRsZWRyZXNpemUnOiB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyksXG5cdFx0XHQna2V5dXAnOiB0aGlzLm9uS2V5dXAuYmluZCh0aGlzKVxuXHRcdH0pXG5cblx0XHR0aGlzLmN1cnNvci5vbignc2l6ZS1jaGFuZ2VkJywgKHNpemUpID0+IHtcblx0XHRcdHRoaXMuJGJydXNoLmNoYW5nZVNpemUoc2l6ZSlcblx0XHR9KVxuXG5cdFx0dGhpcy5jbGVhciA9IHRoaXMuY2xlYXIuYmluZCh0aGlzKVxuXG5cdFx0c3RhdGUub25jbGVhciA9IHRoaXMuY2xlYXIuYmluZCh0aGlzKVxuXHRcdHN0YXRlLm9ucG9zdE1hcCA9IHRoaXMucG9zdE1hcC5iaW5kKHRoaXMpXG5cblx0XHRzdGF0ZS5vbmNoYW5nZVR5cGUgPSAoZXZ0LCBmcm9tLCB0bywgdHlwZSkgPT4ge1xuXHRcdFx0dGhpcy5jaGFuZ2VUeXBlKHR5cGUpXG5cdFx0fVxuXG5cdFx0c3RhdGUub25sZWF2ZWxvYWRpbmcgPSAoKSA9PiB7dGhpcy4kY2FudmFzLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKX1cblx0XHRzdGF0ZS5vbmxvYWRNYXAgPSAoZXZlbnQsIGZyb20sIHRvLCBpdGVtKSA9PiB7XG5cdFx0XHR0aGlzLmxvYWRNYXAoaXRlbSlcblx0XHR9XG5cdFx0XG5cdFx0c3RhdGUub25lbnRlcmRyYXcgPSAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy51bmlmb3JtcykgdGhpcy51bmlmb3Jtcy5pc1VwZGF0ZUNBLnZhbHVlID0gMVxuXHRcdH1cblx0XHRzdGF0ZS5vbmxlYXZlZHJhdyA9ICgpID0+IHtcblx0XHRcdGlmICh0aGlzLnVuaWZvcm1zKSB0aGlzLnVuaWZvcm1zLmlzVXBkYXRlQ0EudmFsdWUgPSAwXG5cdFx0fVxuXHR9XG5cblx0Y2hhbmdlVHlwZSh0eXBlKSB7XG5cdFx0bGV0IHN5c3RlbSA9IFN5c3RlbXNbdHlwZV1cblxuXHRcdHRoaXMuc3lzdGVtID0gc3lzdGVtXG5cblx0XHQvLyB0aGlzLiRicnVzaC5pbml0KHN5c3RlbSlcblx0XHR0aGlzLiRicnVzaC4kc2V0KCdicnVzaGVzJywgc3lzdGVtLmJydXNoZXMpXG5cdFx0dGhpcy4kaGVscC4kc2V0KCdzeXN0ZW0nLCBzeXN0ZW0pXG5cblx0XHR0aGlzLmNhUGFzcyA9IG5ldyBCYXNlUGFzcyh7XG5cdFx0XHRmcmFnbWVudFNoYWRlcjogc3lzdGVtLmNhU2hhZGVyLFxuXHRcdFx0dW5pZm9ybXM6IHRoaXMudW5pZm9ybXNcblx0XHR9KVxuXG5cdFx0bGV0IGZpbHRlclVuaWZvcm1zID0gT2JqZWN0LmFzc2lnbih0aGlzLmZpbHRlclVuaWZvcm1zLCB0aGlzLnN5c3RlbS5maWx0ZXJVbmlmb3JtcylcblxuXHRcdHRoaXMuZmlsdGVyUGFzcyA9IG5ldyBCYXNlUGFzcyh7XG5cdFx0XHRmcmFnbWVudFNoYWRlcjogc3lzdGVtLmZpbHRlclNoYWRlcixcblx0XHRcdHVuaWZvcm1zOiBmaWx0ZXJVbmlmb3Jtc1xuXHRcdH0pXG5cdFx0dGhpcy5zaGFyZS51cGRhdGVVbmlmb3Jtcyh0aGlzLmZpbHRlclBhc3MudW5pZm9ybXMpXG5cblx0XHR0aGlzLm9uUmVzaXplKClcblx0fVxuXG5cdG9uS2V5dXAoZSkge1xuXG5cdFx0Y29uc3Qga2V5ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpIFxuXG5cdFx0c3dpdGNoIChrZXkpIHtcblx0XHRcdGNhc2UgJyAnOiAvLyBTcGFjZVxuXHRcdFx0XHRzdGF0ZS50b2dnbGVQYXVzZSgpXG5cdFx0XHRcdGJyZWFrXHRcblx0XHRcdGNhc2UgJ1MnOlxuXHRcdFx0XHRzdGF0ZS5wb3N0TWFwKClcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgJ0cnOlxuXHRcdFx0XHRzdGF0ZS5zaG93R2FsbGVyeSgpXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlICdDJzpcblx0XHRcdFx0c3RhdGUuY2xlYXIoKVxuXHRcdFx0XHRicmVha1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOCkge1xuXHRcdFx0XHRcdHRoaXMuJGJydXNoLmNoYW5nZVNpemUodGhpcy4kYnJ1c2guc2l6ZSArIDEpXG5cdFx0XHRcdH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDQwKSB7XG5cdFx0XHRcdFx0dGhpcy4kYnJ1c2guY2hhbmdlU2l6ZSh0aGlzLiRicnVzaC5zaXplIC0gMSlcblx0XHRcdFx0fSBlbHNlIGlmIChpc0tleU51bWVyaWNhbChrZXkpKSB7XG5cdFx0XHRcdFx0dGhpcy4kYnJ1c2guY2hhbmdlUGFsZXR0ZUluZGV4KHBhcnNlSW50KGtleSktMSlcblx0XHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5waW5ncG9uZy5jbGVhcigpXG5cdH1cblxuXHRvblJlc2l6ZSgpIHtcblx0XHRsZXQgd3cgPSB3aW5kb3cuaW5uZXJXaWR0aFxuXHRcdGxldCB3aCA9IHdpbmRvdy5pbm5lckhlaWdodFxuXHRcdGxldCBEUFIgPSAod2luZG93LmRldmljZVBpeGVsUmF0aW8pID8gd2luZG93LmRldmljZVBpeGVsUmF0aW8gOiAxXG5cblx0XHRcblx0XHRpZiAoTW9iaWxlLmdldE9yaWVudGF0aW9uKCkgPT0gJ3BvcnRyYWl0Jykge1xuXHRcdFx0W3d3LCB3aF0gPSBbd2gsIHd3XVxuXHRcdH1cblxuXHRcdHJlbmRlcmVyLnNldFNpemUod3csIHdoKVxuXHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8gPyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA6IDEpXG5cblx0XHR0aGlzLnVwZGF0ZVJlc29sdXRpb24oXG5cdFx0XHRNYXRoLmNlaWwod3cgLyBDb25maWcuQ0VMTF9XSURUSCksXG5cdFx0XHRNYXRoLmNlaWwod2ggLyBDb25maWcuQ0VMTF9XSURUSCkpXG5cdH1cblxuXHR1cGRhdGVSZXNvbHV0aW9uKHcsIGgpIHtcblxuXHRcdHRoaXMud2lkdGggPSB3XG5cdFx0dGhpcy5oZWlnaHQgPSBoXG5cblx0XHR0aGlzLnVuaWZvcm1zLnJlc29sdXRpb24udmFsdWUuc2V0KHcsIGgpXG5cdFx0dGhpcy51bmlmb3Jtcy5keC52YWx1ZSA9IDEuMCAvIHdcblx0XHR0aGlzLnVuaWZvcm1zLmR5LnZhbHVlID0gMS4wIC8gaFxuXG5cdFx0dGhpcy5waW5ncG9uZy5zZXRTaXplKHcsIGgpXG5cblx0XHRpZiAodGhpcy5maWx0ZXJlZFRleCkgdGhpcy5maWx0ZXJlZFRleC5kaXNwb3NlKClcblx0XHR0aGlzLmZpbHRlcmVkVGV4ID0gbmV3IENBUmVuZGVyVGFyZ2V0KHcsIGgpXG5cdFx0dGhpcy5yZW5kZXJQYXNzLnVuaWZvcm1zLmJ1ZmZlci52YWx1ZSA9IHRoaXMuZmlsdGVyZWRUZXhcblxuXHRcdHRoaXMuc2hhcmUudXBkYXRlUmVzb2x1dGlvbih3LCBoKVxuXG5cdFx0dGhpcy5yZW5kZXIoZmFsc2UpXG5cdH1cblxuXHRsb2FkTWFwKGl0ZW0pIHtcblxuXHRcdGlmICghdGhpcy5zeXN0ZW0gfHwgdGhpcy5zeXN0ZW0udHlwZSAhPSBpdGVtLnR5cGUpIHtcblx0XHRcdHRoaXMuY2hhbmdlVHlwZShpdGVtLnR5cGUpXG5cdFx0fVxuXG5cdFx0bGV0IG1hcCA9IG5ldyBJbWFnZSgpXG5cblx0XHRtYXAub25sb2FkID0gKCkgPT4ge1xuXG5cdFx0XHRsZXQgJGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG5cdFx0XHRsZXQgY3R4ID0gJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cdFx0XHRsZXQgc2hhcmVSZWN0ID0gdGhpcy5maWx0ZXJQYXNzLnVuaWZvcm1zLnNoYXJlUmVjdC52YWx1ZVxuXG5cdFx0XHQkY2FudmFzLndpZHRoID0gdGhpcy53aWR0aFxuXHRcdFx0JGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXHRcdFx0Y3R4LmRyYXdJbWFnZShtYXAsIHNoYXJlUmVjdC54LCBzaGFyZVJlY3QueSwgQ29uZmlnLlNIQVJFX1dJRFRILCBDb25maWcuU0hBUkVfSEVJR0hUKVxuXG5cdFx0XHRsZXQgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCRjYW52YXMpXG5cdFx0XHR0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXJcblx0XHRcdHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlclxuXHRcdFx0dGhpcy5waW5ncG9uZy5yZXNldEJ5VGV4dHVyZSh0ZXh0dXJlKVxuXG5cdFx0XHR0aGlzLnJlbmRlcigpXG5cblx0XHRcdHN0YXRlLnByZXZpZXdNYXAoKVxuXHRcdH1cblxuXHRcdG1hcC5vbmVycm9yID0gKCkgPT4ge1xuXHRcdFx0c3RhdGUucmVzdW1lKClcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NhbnZhc01hbmFnZXI6IGNhbm5vdCBsb2FkIG1hcCcpXG5cdFx0fVxuXG5cdFx0bWFwLnNyYyA9IGl0ZW0ubWFwXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cblx0XHRpZiAoIXRoaXMuc3lzdGVtKVxuXHRcdFx0cmV0dXJuXG5cblx0XHQvLyAxLiB1cGRhdGUgQ0Fcblx0XHR0aGlzLnVuaWZvcm1zLmJ1ZmZlci52YWx1ZSA9IHRoaXMucGluZ3Bvbmcuc3JjXG5cdFx0dGhpcy5jdXJzb3IudXBkYXRlKClcblxuXHRcdHRoaXMudW5pZm9ybXMudGltZS52YWx1ZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKVxuXHRcdHRoaXMudW5pZm9ybXMuc2VlZC52YWx1ZSA9IE1hdGgucmFuZG9tKClcblx0XHR0aGlzLnVuaWZvcm1zLmN1cnNvck1vZGUudmFsdWUgPSB0aGlzLmN1cnNvci5tb2RlXG5cdFx0dGhpcy51bmlmb3Jtcy5icnVzaFR5cGUudmFsdWUgPSB0aGlzLiRicnVzaC5pbmRleFxuXHRcdHRoaXMudW5pZm9ybXMuYnJ1c2hTaXplMi52YWx1ZSA9IHRoaXMuJGJydXNoLnNpemUyXG5cdFx0dGhpcy5jYVBhc3MucmVuZGVyKHRoaXMucGluZ3BvbmcuZHN0KVxuXG5cdFx0dGhpcy5waW5ncG9uZy5zd2FwKClcblxuXHRcdC8vLyAyLiBmaWx0ZXJcblx0XHR0aGlzLmZpbHRlclBhc3MudW5pZm9ybXMuYnVmZmVyLnZhbHVlID0gdGhpcy5waW5ncG9uZy5kc3Rcblx0XHR0aGlzLmZpbHRlclBhc3MudW5pZm9ybXMuYnJ1c2hTaXplMi52YWx1ZSA9IHRoaXMuJGJydXNoLnNpemUyXG5cdFx0dGhpcy5maWx0ZXJQYXNzLnJlbmRlcih0aGlzLmZpbHRlcmVkVGV4KVxuXG5cdFx0Ly8gMy4gcmVuZGVyIHRvIG1haW4gY2FudmFzXG5cdFx0dGhpcy5yZW5kZXJQYXNzLnJlbmRlcigpXG5cdH1cblxuXHRwb3N0TWFwKCkge1xuXG5cdFx0bGV0IHJlY3QgPSB0aGlzLnNoYXJlLnJlY3RcblxuXHRcdGxldCB4ID0gcmVjdC54XG5cdFx0bGV0IHkgPSByZWN0Lnlcblx0XHRsZXQgdyA9IENvbmZpZy5TSEFSRV9XSURUSFxuXHRcdGxldCBoID0gQ29uZmlnLlNIQVJFX0hFSUdIVFxuXG5cdFx0bGV0IHBpeGVscyA9IG5ldyBVaW50OEFycmF5KHcgKiBoICogNClcblx0XHR0aGlzLnBpbmdwb25nLnJlYWRQaXhlbHMoeCwgeSwgdywgaCwgcGl4ZWxzKVxuXG5cdFx0Ly8gMS4gY2hlY2tcblx0XHRsZXQgZmlsbGVkID0gZmFsc2VcblxuXHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSB3ICogaDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAocGl4ZWxzW2kqNF0gfHwgcGl4ZWxzW2kqNCsxXSB8fCBwaXhlbHNbaSo0KzJdKSB7XG5cdFx0XHRcdGZpbGxlZCA9IHRydWVcblx0XHRcdFx0YnJlYWtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIWZpbGxlZCkge1xuXHRcdFx0c3RhdGUuc2hvd1NoYXJlKCdmYWlsZWQnLCB7bWVzc2FnZTogJ1BsZWFzZSBkcmF3IHNvbWV0aGluZy4nfSlcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdC8vIDIuIGVuY29kZSBjYW52YXMgdG8gYmFzZTY0XG5cdFx0bGV0IG1hcDY0ID0gQmFzZTY0VXRpbC5jb252ZXJ0QXJyYXkocGl4ZWxzLCB3LCBoKVxuXG5cdFx0Ly8gcmUtZHJhdyB3aXRob3V0IGN1cnNvciBoaWdobGlnaHRcblx0XHR0aGlzLmZpbHRlclBhc3MudW5pZm9ybXMuYnJ1c2hTaXplMi52YWx1ZSA9IC0xXG5cdFx0dGhpcy5maWx0ZXJQYXNzLnJlbmRlcih0aGlzLmZpbHRlcmVkVGV4KVxuXHRcdHRoaXMuZmlsdGVyZWRUZXgucmVhZFBpeGVscyh4LCB5LCB3LCBoLCBwaXhlbHMpXG5cblx0XHRsZXQgdGh1bWI2NCA9IEJhc2U2NFV0aWwuY29udmVydEFycmF5KHBpeGVscywgdywgaClcblxuXHRcdC8vIDMuIGNyZWF0ZSBkYXRhXG5cdFx0JC5hamF4KHtcblx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdHVybDogJy9hcGkvcG9zdC5waHAnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0eXBlOiB0aGlzLnN5c3RlbS50eXBlLFxuXHRcdFx0XHRtYXA6IG1hcDY0LFxuXHRcdFx0XHR0aHVtYjogdGh1bWI2NCxcblx0XHRcdFx0cGFyZW50X2lkOiBzdGF0ZS5pZCxcblx0XHRcdFx0YmFzZV9jb2xvcjogdGhpcy5zeXN0ZW0uYmFzZUNvbG9yXG5cdFx0XHR9LFxuXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKVxuXHRcdFx0XHRsZXQganNvbiA9IG51bGxcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRqc29uID0gSlNPTi5wYXJzZShkYXRhKVxuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdDYW52YXNNYW5hZ2VyOiBKU09OIHBhcnNlIGVycm9yJylcblx0XHRcdFx0XHRqc29uID0ge1xuXHRcdFx0XHRcdFx0c3RhdHVzOiAnZmFpbGVkJyxcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IHtcblx0XHRcdFx0XHRcdFx0bWVzc2FnZTogJ1Vua25vd24gZXJyb3Igb2NjdXJlZC4nXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHN0YXRlLnNob3dTaGFyZShqc29uKVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHR9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY2FudmFzLmpzXG4gKiovIiwiLypcbiAqIHRocm90dGxlZHJlc2l6ZTogc3BlY2lhbCBqUXVlcnkgZXZlbnQgdGhhdCBoYXBwZW5zIGF0IGEgcmVkdWNlZCByYXRlIGNvbXBhcmVkIHRvIFwicmVzaXplXCJcbiAqXG4gKiBsYXRlc3QgdmVyc2lvbiBhbmQgY29tcGxldGUgUkVBRE1FIGF2YWlsYWJsZSBvbiBHaXRodWI6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbG91aXNyZW1pL2pxdWVyeS1zbWFydHJlc2l6ZVxuICpcbiAqIENvcHlyaWdodCAyMDEyIEBsb3Vpc19yZW1pXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogVGhpcyBzYXZlZCB5b3UgYW4gaG91ciBvZiB3b3JrPyBcbiAqIFNlbmQgbWUgbXVzaWMgaHR0cDovL3d3dy5hbWF6b24uY28udWsvd2lzaGxpc3QvSE5UVTA0NjhMUU9OXG4gKi9cbihmdW5jdGlvbigkKSB7XG5cbnZhciAkZXZlbnQgPSAkLmV2ZW50LFxuXHQkc3BlY2lhbCxcblx0ZHVtbXkgPSB7XzowfSxcblx0ZnJhbWUgPSAwLFxuXHR3YXNSZXNpemVkLCBhbmltUnVubmluZztcblxuJHNwZWNpYWwgPSAkZXZlbnQuc3BlY2lhbC50aHJvdHRsZWRyZXNpemUgPSB7XG5cdHNldHVwOiBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkub24oIFwicmVzaXplXCIsICRzcGVjaWFsLmhhbmRsZXIgKTtcblx0fSxcblx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5vZmYoIFwicmVzaXplXCIsICRzcGVjaWFsLmhhbmRsZXIgKTtcblx0fSxcblx0aGFuZGxlcjogZnVuY3Rpb24oIGV2ZW50LCBleGVjQXNhcCApIHtcblx0XHQvLyBTYXZlIHRoZSBjb250ZXh0XG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLFxuXHRcdFx0YXJncyA9IGFyZ3VtZW50cztcblxuXHRcdHdhc1Jlc2l6ZWQgPSB0cnVlO1xuXG5cdFx0aWYgKCAhYW5pbVJ1bm5pbmcgKSB7XG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0XHRmcmFtZSsrO1xuXG5cdFx0XHRcdGlmICggZnJhbWUgPiAkc3BlY2lhbC50aHJlc2hvbGQgJiYgd2FzUmVzaXplZCB8fCBleGVjQXNhcCApIHtcblx0XHRcdFx0XHQvLyBzZXQgY29ycmVjdCBldmVudCB0eXBlXG5cdFx0XHRcdFx0ZXZlbnQudHlwZSA9IFwidGhyb3R0bGVkcmVzaXplXCI7XG5cdFx0XHRcdFx0JGV2ZW50LmRpc3BhdGNoLmFwcGx5KCBjb250ZXh0LCBhcmdzICk7XG5cdFx0XHRcdFx0d2FzUmVzaXplZCA9IGZhbHNlO1xuXHRcdFx0XHRcdGZyYW1lID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIGZyYW1lID4gOSApIHtcblx0XHRcdFx0XHQkKGR1bW15KS5zdG9wKCk7XG5cdFx0XHRcdFx0YW5pbVJ1bm5pbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRmcmFtZSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDMwKTtcblx0XHRcdGFuaW1SdW5uaW5nID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cdHRocmVzaG9sZDogMFxufTtcblxufSkoalF1ZXJ5KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vd2ViX21vZHVsZXMvanF1ZXJ5LnRocm90dGxlZHJlc2l6ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDYxXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJ3aW5kb3cucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG5cdGNhbnZhczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLFxuXHRhbnRpYWxpYXM6IGZhbHNlLFxuXHRhbHBoYTogZmFsc2UsXG5cdHByZWNpc2lvbjogJ21lZGl1bXAnLFxuXHRzdGVuY2lsOiBmYWxzZSxcblx0ZGVwdGg6IGZhbHNlLFxuXHRwcmVtdWx0aXBsZWRBbHBoYTogZmFsc2UsXG5cdHNvZnRPYmplY3Q6IGZhbHNlXG59KVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2dsb2JhbC1yZW5kZXJlci5qc1xuICoqLyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VQYXNzIHtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb24pIHtcblxuXHRcdHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXHRcdHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMSwgMSwgMSwgLTEsIDEsIDEwKVxuXG5cdFx0dGhpcy51bmlmb3JtcyA9IG9wdGlvbi51bmlmb3JtcyB8fCB7fVxuXG5cdFx0bGV0IG1hdCA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCh7XG5cdFx0XHR1bmlmb3JtczogdGhpcy51bmlmb3Jtcyxcblx0XHRcdHZlcnRleFNoYWRlcjogb3B0aW9uLnZlcnRleFNoYWRlciB8fCByZXF1aXJlKCcuL3NoYWRlcnMvYmFzZS1wYXNzLnZlcnQnKSxcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBvcHRpb24uZnJhZ21lbnRTaGFkZXJcblx0XHR9KVxuXG5cdFx0bGV0IGdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgyLCAyKVxuXG5cdFx0Ly8gbGV0IGdlb20gPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKVxuXG5cdFx0Ly8gIHlcblx0XHQvLyAgQVxuXHRcdC8vICB8XG5cdFx0Ly9cblx0XHQvLyBbMF0tLS1bMV1cblx0XHQvLyAgfCAgIC8gfFxuXHRcdC8vICB8ICAvICB8XG5cdFx0Ly8gIHwgLyAgIHxcblx0XHQvLyBbMl0tLS1bM10gIC0tPiB4XG5cblx0XHQvLyBsZXQgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShbXG5cdFx0Ly8gXHQtMSwgKzEsIDAsXG5cdFx0Ly8gXHQrMSwgKzEsIDAsXG5cdFx0Ly8gXHQtMSwgLTEsIDAsXG5cdFx0Ly8gXHQrMSwgLTEsIDBcblx0XHQvLyBdKVxuXG5cdFx0Ly8gbGV0IHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuXHRcdC8vIFx0MCwgMSxcblx0XHQvLyBcdDEsIDEsXG5cdFx0Ly8gXHQwLCAwLFxuXHRcdC8vIFx0MSwgMFxuXHRcdC8vIF0pXG5cblx0XHQvLyBsZXQgYUluZGljZXMgPSBuZXcgVWludDE2QXJyYXkoW1xuXHRcdC8vIFx0MCwgMiwgMSxcblx0XHQvLyBcdDIsIDMsIDFcblx0XHQvLyBdKVxuXG5cdFx0Ly8gZ2VvbS5hZGRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKVxuXHRcdC8vIGdlb20uYWRkQXR0cmlidXRlKCd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUodXZzLCAyKSlcblx0XHQvLyBnZW9tLnNldEluZGV4KG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoYUluZGljZXMpKVxuXG5cdFx0bGV0IHBsYW5lID0gbmV3IFRIUkVFLk1lc2goZ2VvbSwgbWF0KVxuXHRcdHRoaXMuc2NlbmUuYWRkKHBsYW5lKVxuXHR9XG5cblx0cmVuZGVyKHRhcmdldFJlbmRlcmVyKSB7XG5cdFx0d2luZG93LnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSwgdGFyZ2V0UmVuZGVyZXIpXG5cdH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9iYXNlLXBhc3MuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxucHJlY2lzaW9uIG1lZGl1bXAgaW50O1xcbiNkZWZpbmUgR0xTTElGWSAxXFxuXFxuYXR0cmlidXRlIHZlYzIgdXY7XFxuYXR0cmlidXRlIHZlYzMgcG9zaXRpb247XFxuXFxudmFyeWluZyB2ZWMyIHZVdjtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcdHZVdiA9IHZlYzIodXYueCwgdXYueSk7XFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAxLjApO1xcbn1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvc2hhZGVycy9iYXNlLXBhc3MudmVydFxuICoqIG1vZHVsZSBpZCA9IDY0XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJpbXBvcnQgQ0FSZW5kZXJUYXJnZXQgZnJvbSAnLi9jYS1yZW5kZXItdGFyZ2V0LmpzJ1xuXG5sZXQgcmVuZGVyZXIgPSB3aW5kb3cucmVuZGVyZXJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGluZ3BvbmdSZW5kZXJUYXJnZXQge1xuXG5cdGNvbnN0cnVjdG9yKHcsIGgpIHtcblx0XHRpZiAodyAmJiBoKSB7XG5cdFx0XHR0aGlzLnNldFNpemUodywgaClcblx0XHR9XG5cdFx0XG5cdH1cblxuXHRzZXRTaXplKHcsIGgpIHtcblxuXHRcdGlmICh0aGlzLndpZHRoID09IHcgJiYgdGhpcy5oZWlnaHQgPT0gaCkgcmV0dXJuXG5cblx0XHRsZXQgY3JvcHBlZFRleCA9IG51bGxcblxuXHRcdGlmICh0aGlzLnNyYykge1xuXHRcdFx0bGV0IG94ID0gTWF0aC5mbG9vciggKHRoaXMud2lkdGggLSB3KSAvIDIgKVxuXHRcdFx0bGV0IG95ID0gTWF0aC5mbG9vciggKHRoaXMuaGVpZ2h0IC0gaCkgLyAyIClcblx0XHRcdGxldCBwaXhlbHMgPSBuZXcgVWludDhBcnJheSh3ICogaCAqIDQpXG5cdFx0XHRyZW5kZXJlci5yZWFkUmVuZGVyVGFyZ2V0UGl4ZWxzKHRoaXMuc3JjLCBveCwgb3ksIHcsIGgsIHBpeGVscylcblx0XHRcdGNyb3BwZWRUZXggPSBuZXcgVEhSRUUuRGF0YVRleHR1cmUocGl4ZWxzLCB3LCBoKVxuXHRcdH1cblxuXG5cdFx0aWYgKCF0aGlzLnNyYykgdGhpcy5zcmMgPSBuZXcgQ0FSZW5kZXJUYXJnZXQodywgaClcblx0XHRpZiAoIXRoaXMuZHN0KSB0aGlzLmRzdCA9IG5ldyBDQVJlbmRlclRhcmdldCh3LCBoKVxuXG5cdFx0dGhpcy5zcmMuc2V0U2l6ZSh3LCBoKVxuXHRcdHRoaXMuZHN0LnNldFNpemUodywgaClcblx0XHR0aGlzLndpZHRoID0gd1xuXHRcdHRoaXMuaGVpZ2h0ID0gaFxuXG5cdFx0aWYgKGNyb3BwZWRUZXgpIHRoaXMuc3JjLnJlc2V0QnlUZXh0dXJlKGNyb3BwZWRUZXgpXG5cdH1cblxuXHRyZWFkUGl4ZWxzKHgsIHksIHcsIGgsIHBpeGVscykge1xuXHRcdHJlbmRlcmVyLnJlYWRSZW5kZXJUYXJnZXRQaXhlbHModGhpcy5kc3QsIHgsIHksIHcsIGgsIHBpeGVscylcblx0fVxuXG5cdHJlc2V0QnlUZXh0dXJlKHRleHR1cmUpIHtcblx0XHR0aGlzLnNyYy5yZXNldEJ5VGV4dHVyZSh0ZXh0dXJlKVxuXHRcdHRoaXMuZHN0LnJlc2V0QnlUZXh0dXJlKHRleHR1cmUpXG5cdH1cblxuXHRzd2FwKCkge1xuXHRcdFt0aGlzLnNyYywgdGhpcy5kc3RdID0gW3RoaXMuZHN0LCB0aGlzLnNyY11cblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHRoaXMuc3JjLmRpc3Bvc2UoKVxuXHRcdHRoaXMuZHN0LmRpc3Bvc2UoKVxuXHRcdHRoaXMuc3JjID0gbmV3IENBUmVuZGVyVGFyZ2V0KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXHRcdHRoaXMuZHN0ID0gbmV3IENBUmVuZGVyVGFyZ2V0KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXHR9XG5cblxuXHQvLyB0cmltXG5cblxuXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcGluZ3BvbmctcmVuZGVyLXRhcmdldC5qc1xuICoqLyIsImltcG9ydCBCYXNlUGFzcyBmcm9tICcuL2Jhc2UtcGFzcy5qcydcblxubGV0IHJlc2V0UGFzcyA9IG5ldyBCYXNlUGFzcyh7XG5cdGZyYWdtZW50U2hhZGVyOiByZXF1aXJlKCcuL3NoYWRlcnMvcGFzc3RocnUuZnJhZycpLFxuXHR1bmlmb3Jtczoge1xuXHRcdGJ1ZmZlcjoge3R5cGU6ICd0JywgdmFsdWU6IG51bGx9XG5cdH1cbn0pXG5cbmxldCByZW5kZXJlciA9IHdpbmRvdy5yZW5kZXJlclxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDQVJlbmRlclRhcmdldCBleHRlbmRzIFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0IHtcblxuXHRjb25zdHJ1Y3Rvcih3LCBoKSB7XG5cdFx0c3VwZXIodywgaCwge1xuXHRcdFx0bWluRmlsdGVyOiBUSFJFRS5OZWFyZXN0RmlsdGVyLFxuXHRcdFx0bWFnRmlsdGVyOiBUSFJFRS5OZWFyZXN0RmlsdGVyLFxuXHRcdFx0Zm9ybWF0OiBUSFJFRS5SR0JBRm9ybWF0XG5cdFx0fSlcblx0fVxuXG5cdHJlYWRQaXhlbHMoeCwgeSwgdywgaCwgcGl4ZWxzKSB7XG5cdFx0cmVuZGVyZXIucmVhZFJlbmRlclRhcmdldFBpeGVscyh0aGlzLCB4LCB5LCB3LCBoLCBwaXhlbHMpXG5cdH1cblxuXHRyZXNldEJ5VGV4dHVyZSh0ZXh0dXJlKSB7XG5cdFx0dGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcblx0XHRyZXNldFBhc3MudW5pZm9ybXMuYnVmZmVyLnZhbHVlID0gdGV4dHVyZVxuXHRcdHJlc2V0UGFzcy5yZW5kZXIodGhpcylcblx0fVxuXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY2EtcmVuZGVyLXRhcmdldC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5wcmVjaXNpb24gbWVkaXVtcCBpbnQ7XFxuI2RlZmluZSBHTFNMSUZZIDFcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCBidWZmZXI7XFxuXFxudmFyeWluZyB2ZWMyIHZVdjtcXG5cXG52b2lkIG1haW4oKSB7XFxuICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQoYnVmZmVyLCB2VXYpO1xcbn1cIlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvc2hhZGVycy9wYXNzdGhydS5mcmFnXG4gKiogbW9kdWxlIGlkID0gNjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsImltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcuanMnXG5cblZ1ZS5jb25maWcuZGVidWcgPSB0cnVlXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJydXNoIGV4dGVuZHMgVnVlIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKHtcblx0XHRcdGVsOiAnLnBhbGV0dGUnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRicnVzaGVzOiB7XG5cdFx0XHRcdFx0bGlzdDoge30sXG5cdFx0XHRcdFx0YWN0aXZlOiBudWxsLFxuXHRcdFx0XHRcdG9yZGVyOiBbXVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRjb21wdXRlZDoge1xuXHRcdFx0XHRpbmRleDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYnJ1c2hlcy5saXN0W3RoaXMuYnJ1c2hlcy5hY3RpdmVdLmluZGV4XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNpemU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmJydXNoZXMubGlzdFt0aGlzLmJydXNoZXMuYWN0aXZlXS5zaXplXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNpemUyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gTWF0aC5wb3codGhpcy5icnVzaGVzLmxpc3RbdGhpcy5icnVzaGVzLmFjdGl2ZV0uc2l6ZSAsIDIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJydXNoTGlzdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bGV0IGxpc3QgPSBbXVxuXHRcdFx0XHRcdHRoaXMuc3lzdGVtLmJydXNoXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdG1ldGhvZHM6IHtcblx0XHRcdFx0Y2hhbmdlVHlwZSh0eXBlKSB7XG5cdFx0XHRcdFx0dGhpcy5icnVzaGVzLmFjdGl2ZSA9IHR5cGVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxuXHRjaGFuZ2VTaXplKHNpemUpIHtcblx0XHR0aGlzLmJydXNoZXMubGlzdFt0aGlzLmJydXNoZXMuYWN0aXZlXS5zaXplID0gTWF0aC5tYXgoMC41LCBzaXplKVxuXHR9XHRcdFxuXG5cdGNoYW5nZVBhbGV0dGVJbmRleChpbmRleCkge1xuXHRcdHRoaXMuYnJ1c2hlcy5hY3RpdmUgPSB0aGlzLmJydXNoZXMub3JkZXJbaW5kZXhdXG5cdH1cblx0XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9icnVzaC5qc1xuICoqLyIsImltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcuanMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlLmpzJ1xuXG5jb25zdCBCVVRUT05fUklHSFQgPSAyXG5cbmNvbnN0IHJvdXRlciA9IHdpbmRvdy5yb3V0ZXJcblxuY29uc3QgTW9kZSA9IHtcblx0Tk9ORTogMCxcblx0RFJBVzogMSxcblx0U0laSU5HOiAyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnNvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXG5cdFx0dGhpcy4kcmVnaW9uID0gJCgnLmNhbnZhcycpXG5cblx0XHQvLyBwdWJsaWNcblx0XHR0aGlzLmN1cnRQb3MgPSBuZXcgVEhSRUUuVmVjdG9yMigpXG5cdFx0dGhpcy5wcmV2UG9zID0gbmV3IFRIUkVFLlZlY3RvcjIoKVxuXG5cdFx0Ly8gcHJpdmF0ZVxuXHRcdHRoaXMuY29vcmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpXG5cdFx0dGhpcy5tb2RlID0gTW9kZS5OT05FXG5cdFx0Ly8gdGhpcy5tb2RlID0gTW9kZS5ub25lXG5cblx0XHR0aGlzLmlzUG9ydHJhaXQgPSBNb2JpbGUuZ2V0T3JpZW50YXRpb24oKSA9PSAncG9ydHJhaXQnXG5cblx0XHRNb2JpbGUub24oJ29yaWVudGF0aW9uY2hhbmdlJywgKG9yaWVudGF0aW9uKSA9PiB7XG5cdFx0XHR0aGlzLmlzUG9ydHJhaXQgPSBvcmllbnRhdGlvbiA9PSAncG9ydHJhaXQnXG5cdFx0fSlcblxuXHRcdHRoaXMuJHJlZ2lvbi5vbih7XG5cblx0XHRcdCdtb3VzZWRvd24nOiAoZSkgPT4ge1xuXHRcdFx0XHRpZiAoZS5idXR0b24gPT0gMikge1xuXHRcdFx0XHRcdHRoaXMubW9kZSA9IE1vZGUuU0laSU5HXG5cdFx0XHRcdFx0dGhpcy5zeCA9IGUuY2xpZW50WCAvIENvbmZpZy5DRUxMX1dJRFRIXG5cdFx0XHRcdFx0dGhpcy5zeSA9IGUuY2xpZW50WSAvIENvbmZpZy5DRUxMX1dJRFRIXG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5tb2RlID0gTW9kZS5EUkFXXG5cdFx0XHRcdFx0dGhpcy51cGRhdGVDb29yZChlLmNsaWVudFgsIGUuY2xpZW50WSwgdHJ1ZSlcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0sXG5cblx0XHRcdCdtb3VzZW1vdmUnOiAoZSkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09IE1vZGUuU0laSU5HKSB7XG5cdFx0XHRcdFx0bGV0IHggPSBlLmNsaWVudFggLyBDb25maWcuQ0VMTF9XSURUSCxcblx0XHRcdFx0XHRcdHkgPSBlLmNsaWVudFkgLyBDb25maWcuQ0VMTF9XSURUSFxuXG5cdFx0XHRcdFx0bGV0IHNpemUgPSBNYXRoLnBvdyh0aGlzLnN4IC0geCwgMikgKyBNYXRoLnBvdyh0aGlzLnN5IC0geSwgMilcblx0XHRcdFx0XHRzaXplID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoc2l6ZSkpXG5cblx0XHRcdFx0XHR0aGlzLmVtaXQoJ3NpemUtY2hhbmdlZCcsIHNpemUpXG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUNvb3JkKGUuY2xpZW50WCwgZS5jbGllbnRZKVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQnbW91c2V1cCBtb3VzZWxlYXZlJzogKGUpID0+IHtcblx0XHRcdFx0dGhpcy5tb2RlID0gTW9kZS5OT05FXG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBtb2JpbGVcblx0XHRcdCd0b3VjaHN0YXJ0JzogKGUpID0+IHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHRoaXMubW9kZSA9IE1vZGUuRFJBV1xuXHRcdFx0XHR0aGlzLnVwZGF0ZUNvb3JkKFxuXHRcdFx0XHRcdGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VYLFxuXHRcdFx0XHRcdGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VZLFxuXHRcdFx0XHRcdHRydWUpXG5cdFx0XHR9LFxuXG5cdFx0XHQndG91Y2htb3ZlJzogKGUpID0+IHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHRoaXMudXBkYXRlQ29vcmQoXG5cdFx0XHRcdFx0ZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0ucGFnZVgsXG5cdFx0XHRcdFx0ZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0ucGFnZVkpXG5cdFx0XHR9LFxuXG5cdFx0XHQndG91Y2hlbmQnOiAoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0dGhpcy5tb2RlID0gTW9kZS5OT05FXG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG5cblx0dXBkYXRlQ29vcmQoeCwgeSwgcmVzZXQpIHtcblx0XHRpZiAodGhpcy5pc1BvcnRyYWl0KSB7XG5cdFx0XHR0aGlzLmNvb3JkLnNldCh5IC8gQ29uZmlnLkNFTExfV0lEVEgsICh3aW5kb3cuaW5uZXJXaWR0aCAtIHgpIC8gQ29uZmlnLkNFTExfV0lEVEgpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29vcmQuc2V0KHggLyBDb25maWcuQ0VMTF9XSURUSCwgeSAvIENvbmZpZy5DRUxMX1dJRFRIKVxuXHRcdH1cblxuXHRcdGlmIChyZXNldCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5jdXJ0UG9zLmNvcHkodGhpcy5jb29yZClcblx0fVxuXG5cdHVwZGF0ZSgpIHtcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnRQb3MueCwgdGhpcy5jdXJ0UG9zLnkpXG5cdFx0dGhpcy5wcmV2UG9zLmNvcHkodGhpcy5jdXJ0UG9zKVxuXHRcdHRoaXMuY3VydFBvcy5jb3B5KHRoaXMuY29vcmQpXG5cdH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jdXJzb3IuanNcbiAqKi8iLCJpbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnLmpzJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJ1xuXG5sZXQgc3RhdGUgPSB3aW5kb3cuc3RhdGVcblxuY2xhc3MgTW9iaWxlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cblxuXHRcdGlmICghQ29uZmlnLlBDKSB7XG5cblx0XHRcdCQod2luZG93KS5vbignb3JpZW50YXRpb25jaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgb3JpZW50YXRpb24gPSB0aGlzLmdldE9yaWVudGF0aW9uKClcblx0XHRcdFx0JCgnYm9keScpLmF0dHIoJ2RhdGEtb3JpZW50YXRpb24nLCBvcmllbnRhdGlvbilcblxuXHRcdFx0XHR0aGlzLmVtaXQoJ29yaWVudGF0aW9uY2hhbmdlJywgb3JpZW50YXRpb24pXG5cdFx0XHRcdFx0XG5cdFx0XHR9KS50cmlnZ2VyKCdvcmllbnRhdGlvbmNoYW5nZScpXG5cblx0XHR9XG5cblx0XHR0aGlzLm1xID0gcmVxdWlyZSgnbWVkaWEtcXVlcnktbGlzdGVuZXInKVxuXHRcdHRoaXMubXEub24oJ2NoYW5nZScsIChicmVha3BvaW50KSA9PiB7XG5cblx0XHRcdGlmIChicmVha3BvaW50ID09ICdwYycgJiYgc3RhdGUuaXMoJ21lbnUnKSkge1xuXHRcdFx0XHRzdGF0ZS5yZXN1bWUoKVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdCQoJy5tZW51X19idG4nKS5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRpZiAoc3RhdGUuY3VycmVudCA9PSAnZHJhdycpIHtcblx0XHRcdFx0c3RhdGUuZXhwYW5kTWVudSgpXG5cdFx0XHR9IGVsc2UgaWYgKHN0YXRlLmN1cnJlbnQgPT0gJ21lbnUnKSB7XG5cdFx0XHRcdHN0YXRlLnJlc3VtZSgpXG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG5cblx0Z2V0T3JpZW50YXRpb24oKSB7XG5cdFx0aWYgKENvbmZpZy5QQykge1xuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCh0eXBlb2Ygd2luZG93Lm9yaWVudGF0aW9uICE9PSAndW5kZWZpbmVkJykgJiYgTWF0aC5hYnMod2luZG93Lm9yaWVudGF0aW9uKSAhPSA5MCkge1xuXHRcdFx0XHRyZXR1cm4gJ3BvcnRyYWl0J1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICdsYW5kc2NhcGUnXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE1vYmlsZSgpXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbW9iaWxlLmpzXG4gKiovIiwiLypnbG9iYWwgcmVxdWlyZSwgbW9kdWxlLCB3aW5kb3csIGRvY3VtZW50ICovXG5cbid1c2Ugc3RyaWN0JztcbnZhciBFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbmlmICh3aW5kb3cgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgdmFyIHN0eWxlLCBsYXN0O1xuXG4gIHZhciBnZXRDdXJyZW50QnJlYWtwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXN0eWxlKSB7XG4gICAgICBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksICc6YWZ0ZXInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpLnJlcGxhY2UoLyd8XCIvZywgJycpO1xuICB9O1xuXG4gIHZhciBwdWJsaXNoQ2hhbmdlID0gZnVuY3Rpb24gKGJyZWFrcG9pbnQpIHtcbiAgICBlbWl0dGVyLmVtaXQoYnJlYWtwb2ludCkuZW1pdCgnY2hhbmdlJywgYnJlYWtwb2ludCk7XG4gIH07XG5cbiAgdmFyIGNoZWNrQnJlYWtwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IGdldEN1cnJlbnRCcmVha3BvaW50KCk7XG5cbiAgICBpZiAoY3VycmVudCAhPT0gbGFzdCkge1xuICAgICAgcHVibGlzaENoYW5nZShjdXJyZW50KTtcbiAgICAgIGxhc3QgPSBjdXJyZW50O1xuICAgIH1cbiAgfTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGNoZWNrQnJlYWtwb2ludCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja0JyZWFrcG9pbnQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVtaXR0ZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tZWRpYS1xdWVyeS1saXN0ZW5lci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDcxXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJmdW5jdGlvbiBFICgpIHtcblx0Ly8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuXHRvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3RpbnktZW1pdHRlci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDcyXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJpbXBvcnQgU3RhdGVNYWNoaW5lIGZyb20gJ2phdmFzY3JpcHQtc3RhdGUtbWFjaGluZSdcbmltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcuanMnXG5cbmNvbnN0IHN0YXRlID0gd2luZG93LnN0YXRlXG5cbmNvbnN0IE9VVEVSX09QQUNJVFkgPSB7XG5cdGRyYXc6IDAuOTMsXG5cdHByZXZpZXc6IDAuNSxcblx0c2hhcmU6IDAsXG5cdGZyYW1lczogMTBcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhcmUge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0JCgnLm1lbnVfX3NoYXJlJykub24oe1xuXHRcdFx0J21vdXNlZW50ZXInOiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2V0T3V0ZXJPcGFjaXR5KE9VVEVSX09QQUNJVFkucHJldmlldylcdFxuXHRcdFx0fSxcblx0XHRcdCdtb3VzZWxlYXZlJzogKCkgPT4ge1xuXHRcdFx0XHRpZiAoc3RhdGUuY3VycmVudCAhPSAnc2hhcmUnKVxuXHRcdFx0XHRcdHRoaXMuc2V0T3V0ZXJPcGFjaXR5KE9VVEVSX09QQUNJVFkuZHJhdylcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy5hbGVydCA9IG5ldyBWdWUoe1xuXHRcdFx0ZWw6ICcuYWxlcnQnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRzaG93OiBmYWxzZSxcblx0XHRcdFx0c3RhdHVzOiAnJyxcblx0XHRcdFx0bWVzc2FnZTogJycsXG5cdFx0XHRcdHVybDogJycsXG5cdFx0XHRcdGlkOiBudWxsXG5cdFx0XHR9LFxuXHRcdFx0bWV0aG9kczoge1xuXHRcdFx0XHRyZXN1bWUoKSB7IHN0YXRlLnJlc3VtZSgpIH0sXG5cdFx0XHRcdHNob3dHYWxsZXJ5KCkgeyBzdGF0ZS5zaG93R2FsbGVyeSgpIH0sXG5cdFx0XHRcdHR3ZWV0KCkge1xuXHRcdFx0XHRcdGxldCB3aW5kb3dPcHRpb25zID0gJ3Njcm9sbGJhcnM9eWVzLHJlc2l6YWJsZT15ZXMsdG9vbGJhcj1ubyxsb2NhdGlvbj15ZXMnLFxuXHRcdFx0XHRcdFx0d2lkdGggPSA1NTAsXG5cdFx0XHRcdFx0XHRoZWlnaHQgPSA0MjAsXG5cdFx0XHRcdFx0XHR3aW5IZWlnaHQgPSBzY3JlZW4uaGVpZ2h0LFxuXHRcdFx0XHRcdFx0d2luV2lkdGggPSBzY3JlZW4ud2lkdGhcblx0XHRcdFxuXHRcdFx0XHRcdGxldCBsZWZ0ID0gTWF0aC5yb3VuZCgod2luV2lkdGggLyAyKSAtICh3aWR0aCAvIDIpKVxuXHRcdFx0XHRcdGxldCB0b3AgPSAwXG5cdFx0XHRcblx0XHRcdFx0XHRpZiAod2luSGVpZ2h0ID4gaGVpZ2h0KVxuXHRcdFx0XHRcdFx0dG9wID0gTWF0aC5yb3VuZCgod2luSGVpZ2h0IC8gMikgLSAoaGVpZ2h0IC8gMikpXG5cdFx0XHRcdFxuXHRcdFx0XHRcdGxldCBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0XHR1cmw6IHRoaXMudXJsLFxuXHRcdFx0XHRcdFx0dGV4dDogYEZ1c2UgIyR7dGhpcy5pZH1gXG5cdFx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcdFx0bGV0IGludGVudFVybCA9IGBodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD8keyQucGFyYW0ocGFyYW1zKX1gXG5cdFx0XHRcdFxuXHRcdFx0XHRcdHdpbmRvdy5vcGVuKGludGVudFVybCwgJ2ludGVudCcsIFxuXHRcdFx0XHRcdFx0YCR7d2luZG93T3B0aW9uc30sd2lkdGg9JHt3aWR0aH0saGVpZ2h0PSR7aGVpZ2h0fSxsZWZ0PSR7bGVmdH0sdG9wPSR7dG9wfWApXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cblx0XHRzdGF0ZS5vbnBvc3RpbmcgPSAocykgPT4ge1xuXHRcdFx0dGhpcy5zZXRPdXRlck9wYWNpdHkoT1VURVJfT1BBQ0lUWS5zaGFyZSlcblx0XHR9XG5cblx0XHRzdGF0ZS5vbnNob3dTaGFyZSA9IHRoaXMub25TaG93U2hhcmUuYmluZCh0aGlzLmFsZXJ0KVxuXG5cdFx0c3RhdGUub25sZWF2ZXNoYXJlID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5hbGVydC4kZGF0YS5zaG93ID0gZmFsc2Vcblx0XHRcdHRoaXMuc2V0T3V0ZXJPcGFjaXR5KE9VVEVSX09QQUNJVFkuZHJhdylcdFxuXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHN0YXRlLnRyYW5zaXRpb24oKSwgNTUwKVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gU3RhdGVNYWNoaW5lLkFTWU5DXG5cdFx0fVxuXHR9XG5cblx0Z2V0IHJlY3QoKSB7XG5cdFx0cmV0dXJuIHRoaXMudW5pZm9ybXMuc2hhcmVSZWN0LnZhbHVlXG5cdH1cblxuXHR1cGRhdGVVbmlmb3Jtcyh1bmlmb3Jtcykge1xuXHRcdHRoaXMudW5pZm9ybXMgPSB1bmlmb3Jtc1xuXHRcdHRoaXMudW5pZm9ybXMub3V0ZXJPcGFjaXR5LnZhbHVlID0gT1VURVJfT1BBQ0lUWS5kcmF3XG5cdH1cblxuXG5cdHVwZGF0ZVJlc29sdXRpb24odywgaCkge1xuXHRcdGxldCB4ID0gTWF0aC5mbG9vcigodyAtIENvbmZpZy5TSEFSRV9XSURUSCkgLyAyKVxuXHRcdGxldCB5ID0gTWF0aC5mbG9vcigoaCAtIENvbmZpZy5TSEFSRV9IRUlHSFQpIC8gMilcblx0XHR0aGlzLnVuaWZvcm1zLnNoYXJlUmVjdC52YWx1ZS5zZXQoeCwgeSwgeCArIENvbmZpZy5TSEFSRV9XSURUSCwgeSArIENvbmZpZy5TSEFSRV9IRUlHSFQpXG5cdH1cblxuXHRzZXRPdXRlck9wYWNpdHkodGFyZ2V0KSB7XG5cblx0XHRsZXQgY3VycmVudCA9IHRoaXMudW5pZm9ybXMub3V0ZXJPcGFjaXR5LnZhbHVlXG5cdFx0bGV0IHN0ZXAgPSBNYXRoLmFicyh0YXJnZXQgLSBjdXJyZW50KSAvIE9VVEVSX09QQUNJVFkuZnJhbWVzXG5cblx0XHRpZiAodGFyZ2V0IDwgY3VycmVudCkge1xuXHRcdFx0c3RlcCAqPSAtMVxuXHRcdH1cblxuXHRcdGxldCBpc0VuZCA9IGN1cnJlbnQgPD0gdGFyZ2V0XG5cdFx0XHQ/IGZ1bmN0aW9uKGN1cnJlbnQsIHRhcmdldCkge3JldHVybiB0YXJnZXQgPD0gY3VycmVudH1cblx0XHRcdDogZnVuY3Rpb24oY3VycmVudCwgdGFyZ2V0KSB7cmV0dXJuIGN1cnJlbnQgPD0gdGFyZ2V0fVxuXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLm91dGVyT3BhY2l0eVRpbWVyKVxuXG5cdFx0dGhpcy5vdXRlck9wYWNpdHlUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcblxuXHRcdFx0bGV0IHZhbHVlID0gdGhpcy51bmlmb3Jtcy5vdXRlck9wYWNpdHkudmFsdWUgKyBzdGVwXG5cdFx0XHRcblx0XHRcdGlmIChpc0VuZCh2YWx1ZSwgdGFyZ2V0KSkge1xuXHRcdFx0XHR2YWx1ZSA9IHRhcmdldFxuXHRcdFx0XHRjbGVhckludGVydmFsKHRoaXMub3V0ZXJPcGFjaXR5VGltZXIpXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudW5pZm9ybXMub3V0ZXJPcGFjaXR5LnZhbHVlID0gdmFsdWVcblxuXHRcdH0sIDIwKVxuXG5cdH1cblxuXHRvblNob3dTaGFyZShldmVudCwgZnJvbSwgdG8sIHJlcykge1xuXHRcdFxuXHRcdGlmIChyZXMuc3RhdHVzID09ICdmYWlsZWQnKSB7XG5cdFx0XHR0aGlzLm1lc3NhZ2UgPSByZXMuY29udGVudC5tZXNzYWdlXG5cblx0XHR9IGVsc2UgaWYgKHJlcy5zdGF0dXMgPT0gJ3N1Y2NlZWQnKSB7XG5cdFx0XHR0aGlzLnVybCA9IHJlcy5jb250ZW50LnVybFxuXHRcdFx0dGhpcy5pZCA9IHJlcy5jb250ZW50LmlkXG5cblx0XHR9XG5cblx0XHR0aGlzLnN0YXR1cyA9IHJlcy5zdGF0dXNcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdHVzKVxuXHRcdHRoaXMuc2hvdyA9IHRydWVcblx0fVxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NoYXJlLmpzXG4gKiovIiwiXG5jbGFzcyBCYXNlNjRVdGlsIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG5cdFx0dGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cdH1cblxuXHRjb252ZXJ0QXJyYXkocGl4ZWxzLCB3LCBoKSB7XG5cblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IHdcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSBoXG5cblx0XHQvLyBDb3B5IHRoZSBwaXhlbHMgdG8gYSAyRCBjYW52YXNcblx0XHRsZXQgaW1hZ2VEYXRhID0gdGhpcy5jdHguY3JlYXRlSW1hZ2VEYXRhKHcsIGgpXG5cdFx0aW1hZ2VEYXRhLmRhdGEuc2V0KHBpeGVscylcblx0XHR0aGlzLmN0eC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKVxuXG5cdFx0cmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpXG5cdH1cblxuXHQvLyBleHBvcnQgY29udmVydEltYWdlVG9CYXNlNjQoaW1nKSB7XG5cdGNvbnZlcnRJbWFnZShpbWcpIHtcblxuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gaW1nLndpZHRoXG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodFxuXG5cdFx0dGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMClcblxuXHRcdHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYXNlNjRVdGlsKClcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Jhc2U2NC11dGlsLmpzXG4gKiovIiwiaW1wb3J0IGhleFJnYiBmcm9tICdoZXgtcmdiJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWxwIGV4dGVuZHMgVnVlIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcih7XG5cdFx0XHQvLyBlbDogJy5oZWxwJyxcblx0XHRcdGRhdGE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHN5c3RlbToge1xuXHRcdFx0XHRcdFx0YnJ1c2hlczoge1xuXHRcdFx0XHRcdFx0XHRsaXN0OiB7fSxcblx0XHRcdFx0XHRcdFx0b3JkZXI6IFtdXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bmFtZTogJycsXG5cdFx0XHRcdFx0XHRoZWxwOiAnJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNvbXB1dGVkOiB7XG5cdFx0XHRcdGh0bWxIZWxwOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRsZXQgaGVscCA9IHRoaXMuc3lzdGVtLmhlbHBcblxuXHRcdFx0XHRcdHRoaXMuc3lzdGVtLmJydXNoZXMub3JkZXIuZm9yRWFjaCgodHlwZSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGJydXNoID0gdGhpcy5zeXN0ZW0uYnJ1c2hlcy5saXN0W3R5cGVdXG5cdFx0XHRcdFx0XHRsZXQgY29sb3IgPSBicnVzaC5jb2xvclxuXHRcdFx0XHRcdFx0bGV0IHJnYiA9IGhleFJnYihjb2xvcilcblx0XHRcdFx0XHRcdGxldCBicmlnaHRuZXNzID0gKHJnYlswXSArIHJnYlsxXSArIHJnYlsyXSkgLyAzLjBcblx0XHRcdFx0XHRcdGlmIChicmlnaHRuZXNzIDwgNjQpIHtcblx0XHRcdFx0XHRcdFx0Y29sb3IgPSBgcmdiKCR7cmdiWzBdICsgMzJ9LCAke3JnYlsxXSArIDMyfSwgJHtyZ2JbMl0gKyAzMn0pYFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGVscCA9IGhlbHAuc3BsaXQoYnJ1c2gubmFtZSkuam9pbihgPHNwYW4gc3R5bGU9J2NvbG9yOiAke2NvbG9yfTtib3JkZXItY29sb3I6JHtjb2xvcn07Jz4ke2JydXNoLm5hbWV9PC9zcGFuPmApXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdHJldHVybiBoZWxwXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvaGVscC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhleCkge1xuXHRpZiAodHlwZW9mIGhleCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuXHR9XG5cblx0aGV4ID0gaGV4LnJlcGxhY2UoL14jLywgJycpO1xuXG5cdGlmIChoZXgubGVuZ3RoID09PSAzKSB7XG5cdFx0aGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xuXHR9XG5cblx0dmFyIG51bSA9IHBhcnNlSW50KGhleCwgMTYpO1xuXG5cdHJldHVybiBbbnVtID4+IDE2LCBudW0gPj4gOCAmIDI1NSwgbnVtICYgMjU1XTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9oZXgtcmdiL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=
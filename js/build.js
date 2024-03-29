/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	var _tabletop = __webpack_require__(5);

	var _tabletop2 = _interopRequireDefault(_tabletop);

	var _Router = __webpack_require__(33);

	var _Router2 = _interopRequireDefault(_Router);

	var _WorkCollection = __webpack_require__(45);

	var _WorkCollection2 = _interopRequireDefault(_WorkCollection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_tabletop2.default.init({
	    key: '1EIXyPeXI3KtIbD_Cr5ZMgkb2gdRJP1jwb4cPCylRyE0',
	    callback: function callback(data) {
	        var collection = new _WorkCollection2.default(data);
	        new _Router2.default(collection);
	        _exoskeleton2.default.history.start();
	    },
	    simpleSheet: true
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * Exoskeleton.js 0.7.0
	 * (c) 2013 Paul Miller <http://paulmillr.com>
	 * Based on Backbone.js
	 * (c) 2010-2013 Jeremy Ashkenas, DocumentCloud
	 * Exoskeleton may be freely distributed under the MIT license.
	 * For all details and documentation: <http://exosjs.com>
	 */

	(function(root, factory) {
	  // Set up Backbone appropriately for the environment.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(3), exports], __WEBPACK_AMD_DEFINE_RESULT__ = function(_, $, exports) {
	      root.Backbone = root.Exoskeleton = factory(root, exports, _, $);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== 'undefined') {
	    var _, $;
	    try { _ = require('underscore'); } catch(e) { }
	    try { $ = require('jquery'); } catch(e) { }
	    factory(root, exports, _, $);
	  } else {
	    root.Backbone = root.Exoskeleton = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
	  }

	})(this, function(root, Backbone, _, $) {
	  'use strict';

	  // Initial Setup
	  // -------------

	  // Save the previous value of the `Backbone` variable, so that it can be
	  // restored later on, if `noConflict` is used.
	  var previousBackbone = root.Backbone;
	  var previousExoskeleton = root.Exoskeleton;

	  // Underscore replacement.
	  var utils = Backbone.utils = _ = (_ || {});

	  // Hold onto a local reference to `$`. Can be changed at any point.
	  Backbone.$ = $;

	  // Create local references to array methods we'll want to use later.
	  var array = [];
	  var push = array.push;
	  var slice = array.slice;
	  var toString = ({}).toString;

	  // Current version of the library. Keep in sync with `package.json`.
	  // Backbone.VERSION = '1.0.0';

	  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
	  // to its previous owner. Returns a reference to this Backbone object.
	  Backbone.noConflict = function() {
	    root.Backbone = previousBackbone;
	    root.Exoskeleton = previousExoskeleton;
	    return this;
	  };

	  // Helpers
	  // -------

	  // Helper function to correctly set up the prototype chain, for subclasses.
	  // Similar to `goog.inherits`, but uses a hash of prototype properties and
	  // class properties to be extended.
	  Backbone.extend = function(protoProps, staticProps) {
	    var parent = this;
	    var child;

	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent's constructor.
	    if (protoProps && _.has(protoProps, 'constructor')) {
	      child = protoProps.constructor;
	    } else {
	      child = function(){ return parent.apply(this, arguments); };
	    }

	    // Add static properties to the constructor function, if supplied.
	    _.extend(child, parent, staticProps);

	    // Set the prototype chain to inherit from `parent`, without calling
	    // `parent`'s constructor function.
	    var Surrogate = function(){ this.constructor = child; };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;

	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps) _.extend(child.prototype, protoProps);

	    // Set a convenience property in case the parent's prototype is needed
	    // later.
	    child.__super__ = parent.prototype;

	    return child;
	  };

	  // Throw an error when a URL is needed, and none is supplied.
	  var urlError = function() {
	    throw new Error('A "url" property or function must be specified');
	  };

	  // Wrap an optional error callback with a fallback error event.
	  var wrapError = function(model, options) {
	    var error = options.error;
	    options.error = function(resp) {
	      if (error) error(model, resp, options);
	      model.trigger('error', model, resp, options);
	    };
	  };

	  // Checker for utility methods. Useful for custom builds.
	  var utilExists = function(method) {
	    return typeof _[method] === 'function';
	  };
	utils.result = function result(object, property) {
	  var value = object ? object[property] : undefined;
	  return typeof value === 'function' ? object[property]() : value;
	};

	utils.defaults = function defaults(obj) {
	  slice.call(arguments, 1).forEach(function(item) {
	    for (var key in item) if (obj[key] === undefined)
	      obj[key] = item[key];
	  });
	  return obj;
	};

	utils.extend = function extend(obj) {
	  slice.call(arguments, 1).forEach(function(item) {
	    for (var key in item) obj[key] = item[key];
	  });
	  return obj;
	};

	var htmlEscapes = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;'
	};

	utils.escape = function escape(string) {
	  return string == null ? '' : String(string).replace(/[&<>"']/g, function(match) {
	    return htmlEscapes[match];
	  });
	};

	utils.sortBy = function(obj, value, context) {
	  var iterator = typeof value === 'function' ? value : function(obj){ return obj[value]; };
	  return obj
	    .map(function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iterator.call(context, value, index, list)
	      };
	    })
	    .sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    })
	    .map(function(item) {
	      return item.value;
	    });
	};

	/** Used to generate unique IDs */
	var idCounter = 0;

	utils.uniqueId = function uniqueId(prefix) {
	  var id = ++idCounter + '';
	  return prefix ? prefix + id : id;
	};

	utils.has = function(obj, key) {
	  return Object.hasOwnProperty.call(obj, key);
	};

	var eq = function(a, b, aStack, bStack) {
	  // Identical objects are equal. `0 === -0`, but they aren't identical.
	  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	  if (a === b) return a !== 0 || 1 / a == 1 / b;
	  // A strict comparison is necessary because `null == undefined`.
	  if (a == null || b == null) return a === b;
	  // Unwrap any wrapped objects.
	  //if (a instanceof _) a = a._wrapped;
	  //if (b instanceof _) b = b._wrapped;
	  // Compare `[[Class]]` names.
	  var className = toString.call(a);
	  if (className != toString.call(b)) return false;
	  switch (className) {
	    // Strings, numbers, dates, and booleans are compared by value.
	    case '[object String]':
	      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	      // equivalent to `new String("5")`.
	      return a == String(b);
	    case '[object Number]':
	      // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
	      // other numeric values.
	      return a !== +a ? b !== +b : (a === 0 ? 1 / a === 1 / b : a === +b);
	    case '[object Date]':
	    case '[object Boolean]':
	      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	      // millisecond representations. Note that invalid dates with millisecond representations
	      // of `NaN` are not equivalent.
	      return +a == +b;
	    // RegExps are compared by their source patterns and flags.
	    case '[object RegExp]':
	      return a.source == b.source &&
	             a.global == b.global &&
	             a.multiline == b.multiline &&
	             a.ignoreCase == b.ignoreCase;
	  }
	  if (typeof a != 'object' || typeof b != 'object') return false;
	  // Assume equality for cyclic structures. The algorithm for detecting cyclic
	  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	  var length = aStack.length;
	  while (length--) {
	    // Linear search. Performance is inversely proportional to the number of
	    // unique nested structures.
	    if (aStack[length] == a) return bStack[length] == b;
	  }
	  // Objects with different constructors are not equivalent, but `Object`s
	  // from different frames are.
	  var aCtor = a.constructor, bCtor = b.constructor;
	  if (aCtor !== bCtor && !(typeof aCtor === 'function' && (aCtor instanceof aCtor) &&
	                           typeof bCtor === 'function' && (bCtor instanceof bCtor))) {
	    return false;
	  }
	  // Add the first object to the stack of traversed objects.
	  aStack.push(a);
	  bStack.push(b);
	  var size = 0, result = true;
	  // Recursively compare objects and arrays.
	  if (className === '[object Array]') {
	    // Compare array lengths to determine if a deep comparison is necessary.
	    size = a.length;
	    result = size === b.length;
	    if (result) {
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (size--) {
	        if (!(result = eq(a[size], b[size], aStack, bStack))) break;
	      }
	    }
	  } else {
	    // Deep compare objects.
	    for (var key in a) {
	      if (_.has(a, key)) {
	        // Count the expected number of properties.
	        size++;
	        // Deep compare each member.
	        if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
	      }
	    }
	    // Ensure that both objects contain the same number of properties.
	    if (result) {
	      for (key in b) {
	        if (_.has(b, key) && !(size--)) break;
	      }
	      result = !size;
	    }
	  }
	  // Remove the first object from the stack of traversed objects.
	  aStack.pop();
	  bStack.pop();
	  return result;
	};

	// Perform a deep comparison to check if two objects are equal.
	utils.isEqual = function(a, b) {
	  return eq(a, b, [], []);
	};
	// Backbone.Events
	// ---------------

	// A module that can be mixed in to *any object* in order to provide it with
	// custom events. You may bind with `on` or remove with `off` callback
	// functions to an event; `trigger`-ing an event fires all callbacks in
	// succession.
	//
	//     var object = {};
	//     _.extend(object, Backbone.Events);
	//     object.on('expand', function(){ alert('expanded'); });
	//     object.trigger('expand');
	//
	var Events = Backbone.Events = {

	  // Bind an event to a `callback` function. Passing `"all"` will bind
	  // the callback to all events fired.
	  on: function(name, callback, context) {
	    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
	    this._events || (this._events = {});
	    var events = this._events[name] || (this._events[name] = []);
	    events.push({callback: callback, context: context, ctx: context || this});
	    return this;
	  },

	  // Bind an event to only be triggered a single time. After the first time
	  // the callback is invoked, it will be removed.
	  once: function(name, callback, context) {
	    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
	    var self = this;
	    var ran;
	    var once = function() {
	      if (ran) return;
	      ran = true;
	      self.off(name, once);
	      callback.apply(this, arguments);
	    };
	    once._callback = callback;
	    return this.on(name, once, context);
	  },

	  // Remove one or many callbacks. If `context` is null, removes all
	  // callbacks with that function. If `callback` is null, removes all
	  // callbacks for the event. If `name` is null, removes all bound
	  // callbacks for all events.
	  off: function(name, callback, context) {
	    var retain, ev, events, names, i, l, j, k;
	    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
	    if (!name && !callback && !context) {
	      this._events = void 0;
	      return this;
	    }
	    names = name ? [name] : Object.keys(this._events);
	    for (i = 0, l = names.length; i < l; i++) {
	      name = names[i];
	      if (events = this._events[name]) {
	        this._events[name] = retain = [];
	        if (callback || context) {
	          for (j = 0, k = events.length; j < k; j++) {
	            ev = events[j];
	            if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
	                (context && context !== ev.context)) {
	              retain.push(ev);
	            }
	          }
	        }
	        if (!retain.length) delete this._events[name];
	      }
	    }

	    return this;
	  },

	  // Trigger one or many events, firing all bound callbacks. Callbacks are
	  // passed the same arguments as `trigger` is, apart from the event name
	  // (unless you're listening on `"all"`, which will cause your callback to
	  // receive the true name of the event as the first argument).
	  trigger: function(name) {
	    if (!this._events) return this;
	    var args = slice.call(arguments, 1);
	    if (!eventsApi(this, 'trigger', name, args)) return this;
	    var events = this._events[name];
	    var allEvents = this._events.all;
	    if (events) triggerEvents(events, args);
	    if (allEvents) triggerEvents(allEvents, arguments);
	    return this;
	  },

	  // Tell this object to stop listening to either specific events ... or
	  // to every object it's currently listening to.
	  stopListening: function(obj, name, callback) {
	    var listeningTo = this._listeningTo;
	    if (!listeningTo) return this;
	    var remove = !name && !callback;
	    if (!callback && typeof name === 'object') callback = this;
	    if (obj) (listeningTo = {})[obj._listenId] = obj;
	    for (var id in listeningTo) {
	      obj = listeningTo[id];
	      obj.off(name, callback, this);
	      if (remove || !Object.keys(obj._events).length) delete this._listeningTo[id];
	    }
	    return this;
	  }

	};

	// Regular expression used to split event strings.
	var eventSplitter = /\s+/;

	// Implement fancy features of the Events API such as multiple event
	// names `"change blur"` and jQuery-style event maps `{change: action}`
	// in terms of the existing API.
	var eventsApi = function(obj, action, name, rest) {
	  if (!name) return true;

	  // Handle event maps.
	  if (typeof name === 'object') {
	    for (var key in name) {
	      obj[action].apply(obj, [key, name[key]].concat(rest));
	    }
	    return false;
	  }

	  // Handle space separated event names.
	  if (eventSplitter.test(name)) {
	    var names = name.split(eventSplitter);
	    for (var i = 0, l = names.length; i < l; i++) {
	      obj[action].apply(obj, [names[i]].concat(rest));
	    }
	    return false;
	  }

	  return true;
	};

	// A difficult-to-believe, but optimized internal dispatch function for
	// triggering events. Tries to keep the usual cases speedy (most internal
	// Backbone events have 3 arguments).
	var triggerEvents = function(events, args) {
	  var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	  switch (args.length) {
	    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
	    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
	    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
	    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
	    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
	  }
	};

	var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

	// Inversion-of-control versions of `on` and `once`. Tell *this* object to
	// listen to an event in another object ... keeping track of what it's
	// listening to.
	Object.keys(listenMethods).forEach(function(method) {
	  var implementation = listenMethods[method];
	  Events[method] = function(obj, name, callback) {
	    var listeningTo = this._listeningTo || (this._listeningTo = {});
	    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
	    listeningTo[id] = obj;
	    if (!callback && typeof name === 'object') callback = this;
	    obj[implementation](name, callback, this);
	    return this;
	  };
	});

	// Aliases for backwards compatibility.
	Events.bind   = Events.on;
	Events.unbind = Events.off;

	// Allow the `Backbone` object to serve as a global event bus, for folks who
	// want global "pubsub" in a convenient place.
	_.extend(Backbone, Events);
	// Backbone.Model
	// --------------

	// Backbone **Models** are the basic data object in the framework --
	// frequently representing a row in a table in a database on your server.
	// A discrete chunk of data and a bunch of useful, related methods for
	// performing computations and transformations on that data.

	// Create a new model with the specified attributes. A client id (`cid`)
	// is automatically generated and assigned for you.
	var Model = Backbone.Model = function(attributes, options) {
	  var attrs = attributes || {};
	  options || (options = {});
	  this.cid = _.uniqueId('c');
	  this.attributes = Object.create(null);
	  if (options.collection) this.collection = options.collection;
	  if (options.parse) attrs = this.parse(attrs, options) || {};
	  attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
	  this.set(attrs, options);
	  this.changed = Object.create(null);
	  this.initialize.apply(this, arguments);
	};

	// Attach all inheritable methods to the Model prototype.
	_.extend(Model.prototype, Events, {

	  // A hash of attributes whose current and previous value differ.
	  changed: null,

	  // The value returned during the last failed validation.
	  validationError: null,

	  // The default name for the JSON `id` attribute is `"id"`. MongoDB and
	  // CouchDB users may want to set this to `"_id"`.
	  idAttribute: 'id',

	  // Initialize is an empty function by default. Override it with your own
	  // initialization logic.
	  initialize: function(){},

	  // Return a copy of the model's `attributes` object.
	  toJSON: function(options) {
	    return _.extend({}, this.attributes);
	  },

	  // Proxy `Backbone.sync` by default -- but override this if you need
	  // custom syncing semantics for *this* particular model.
	  sync: function() {
	    return Backbone.sync.apply(this, arguments);
	  },

	  // Get the value of an attribute.
	  get: function(attr) {
	    return this.attributes[attr];
	  },

	  // Get the HTML-escaped value of an attribute.
	  escape: function(attr) {
	    return _.escape(this.get(attr));
	  },

	  // Returns `true` if the attribute contains a value that is not null
	  // or undefined.
	  has: function(attr) {
	    return this.get(attr) != null;
	  },

	  // Set a hash of model attributes on the object, firing `"change"`. This is
	  // the core primitive operation of a model, updating the data and notifying
	  // anyone who needs to know about the change in state. The heart of the beast.
	  set: function(key, val, options) {
	    var attr, attrs, unset, changes, silent, changing, prev, current;
	    if (key == null) return this;

	    // Handle both `"key", value` and `{key: value}` -style arguments.
	    if (typeof key === 'object') {
	      attrs = key;
	      options = val;
	    } else {
	      (attrs = {})[key] = val;
	    }

	    options || (options = {});

	    // Run validation.
	    if (!this._validate(attrs, options)) return false;

	    // Extract attributes and options.
	    unset           = options.unset;
	    silent          = options.silent;
	    changes         = [];
	    changing        = this._changing;
	    this._changing  = true;

	    if (!changing) {
	      this._previousAttributes = _.extend(Object.create(null), this.attributes);
	      this.changed = {};
	    }
	    current = this.attributes, prev = this._previousAttributes;

	    // Check for changes of `id`.
	    if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

	    // For each `set` attribute, update or delete the current value.
	    for (attr in attrs) {
	      val = attrs[attr];
	      if (!_.isEqual(current[attr], val)) changes.push(attr);
	      if (!_.isEqual(prev[attr], val)) {
	        this.changed[attr] = val;
	      } else {
	        delete this.changed[attr];
	      }
	      unset ? delete current[attr] : current[attr] = val;
	    }

	    // Trigger all relevant attribute changes.
	    if (!silent) {
	      if (changes.length) this._pending = options;
	      for (var i = 0, l = changes.length; i < l; i++) {
	        this.trigger('change:' + changes[i], this, current[changes[i]], options);
	      }
	    }

	    // You might be wondering why there's a `while` loop here. Changes can
	    // be recursively nested within `"change"` events.
	    if (changing) return this;
	    if (!silent) {
	      while (this._pending) {
	        options = this._pending;
	        this._pending = false;
	        this.trigger('change', this, options);
	      }
	    }
	    this._pending = false;
	    this._changing = false;
	    return this;
	  },

	  // Remove an attribute from the model, firing `"change"`. `unset` is a noop
	  // if the attribute doesn't exist.
	  unset: function(attr, options) {
	    return this.set(attr, void 0, _.extend({}, options, {unset: true}));
	  },

	  // Clear all attributes on the model, firing `"change"`.
	  clear: function(options) {
	    var attrs = {};
	    for (var key in this.attributes) attrs[key] = void 0;
	    return this.set(attrs, _.extend({}, options, {unset: true}));
	  },

	  // Determine if the model has changed since the last `"change"` event.
	  // If you specify an attribute name, determine if that attribute has changed.
	  hasChanged: function(attr) {
	    if (attr == null) return !!Object.keys(this.changed).length;
	    return _.has(this.changed, attr);
	  },

	  // Return an object containing all the attributes that have changed, or
	  // false if there are no changed attributes. Useful for determining what
	  // parts of a view need to be updated and/or what attributes need to be
	  // persisted to the server. Unset attributes will be set to undefined.
	  // You can also pass an attributes object to diff against the model,
	  // determining if there *would be* a change.
	  changedAttributes: function(diff) {
	    if (!diff) return this.hasChanged() ? _.extend(Object.create(null), this.changed) : false;
	    var val, changed = false;
	    var old = this._changing ? this._previousAttributes : this.attributes;
	    for (var attr in diff) {
	      if (_.isEqual(old[attr], (val = diff[attr]))) continue;
	      (changed || (changed = {}))[attr] = val;
	    }
	    return changed;
	  },

	  // Get the previous value of an attribute, recorded at the time the last
	  // `"change"` event was fired.
	  previous: function(attr) {
	    if (attr == null || !this._previousAttributes) return null;
	    return this._previousAttributes[attr];
	  },

	  // Get all of the attributes of the model at the time of the previous
	  // `"change"` event.
	  previousAttributes: function() {
	    return _.extend(Object.create(null), this._previousAttributes);
	  },

	  // Fetch the model from the server. If the server's representation of the
	  // model differs from its current attributes, they will be overridden,
	  // triggering a `"change"` event.
	  fetch: function(options) {
	    options = options ? _.extend({}, options) : {};
	    if (options.parse === void 0) options.parse = true;
	    var model = this;
	    var success = options.success;
	    options.success = function(resp) {
	      if (!model.set(model.parse(resp, options), options)) return false;
	      if (success) success(model, resp, options);
	      model.trigger('sync', model, resp, options);
	    };
	    wrapError(this, options);
	    return this.sync('read', this, options);
	  },

	  // Set a hash of model attributes, and sync the model to the server.
	  // If the server returns an attributes hash that differs, the model's
	  // state will be `set` again.
	  save: function(key, val, options) {
	    var attrs, method, xhr, attributes = this.attributes;

	    // Handle both `"key", value` and `{key: value}` -style arguments.
	    if (key == null || typeof key === 'object') {
	      attrs = key;
	      options = val;
	    } else {
	      (attrs = {})[key] = val;
	    }

	    options = _.extend({validate: true}, options);

	    // If we're not waiting and attributes exist, save acts as
	    // `set(attr).save(null, opts)` with validation. Otherwise, check if
	    // the model will be valid when the attributes, if any, are set.
	    if (attrs && !options.wait) {
	      if (!this.set(attrs, options)) return false;
	    } else {
	      if (!this._validate(attrs, options)) return false;
	    }

	    // Set temporary attributes if `{wait: true}`.
	    if (attrs && options.wait) {
	      this.attributes = _.extend(Object.create(null), attributes, attrs);
	    }

	    // After a successful server-side save, the client is (optionally)
	    // updated with the server-side state.
	    if (options.parse === void 0) options.parse = true;
	    var model = this;
	    var success = options.success;
	    options.success = function(resp) {
	      // Ensure attributes are restored during synchronous saves.
	      model.attributes = attributes;
	      var serverAttrs = model.parse(resp, options);
	      if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
	      if (serverAttrs && typeof serverAttrs === 'object' && !model.set(serverAttrs, options)) {
	        return false;
	      }
	      if (success) success(model, resp, options);
	      model.trigger('sync', model, resp, options);
	    };
	    wrapError(this, options);

	    method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
	    if (method === 'patch') options.attrs = attrs;
	    xhr = this.sync(method, this, options);

	    // Restore attributes.
	    if (attrs && options.wait) this.attributes = attributes;

	    return xhr;
	  },

	  // Destroy this model on the server if it was already persisted.
	  // Optimistically removes the model from its collection, if it has one.
	  // If `wait: true` is passed, waits for the server to respond before removal.
	  destroy: function(options) {
	    options = options ? _.extend({}, options) : {};
	    var model = this;
	    var success = options.success;

	    var destroy = function() {
	      model.trigger('destroy', model, model.collection, options);
	    };

	    options.success = function(resp) {
	      if (options.wait || model.isNew()) destroy();
	      if (success) success(model, resp, options);
	      if (!model.isNew()) model.trigger('sync', model, resp, options);
	    };

	    if (this.isNew()) {
	      options.success();
	      return false;
	    }
	    wrapError(this, options);

	    var xhr = this.sync('delete', this, options);
	    if (!options.wait) destroy();
	    return xhr;
	  },

	  // Default URL for the model's representation on the server -- if you're
	  // using Backbone's restful methods, override this to change the endpoint
	  // that will be called.
	  url: function() {
	    var base =
	      _.result(this, 'urlRoot') ||
	      _.result(this.collection, 'url') ||
	      urlError();
	    if (this.isNew()) return base;
	    return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
	  },

	  // **parse** converts a response into the hash of attributes to be `set` on
	  // the model. The default implementation is just to pass the response along.
	  parse: function(resp, options) {
	    return resp;
	  },

	  // Create a new model with identical attributes to this one.
	  clone: function() {
	    return new this.constructor(this.attributes);
	  },

	  // A model is new if it has never been saved to the server, and lacks an id.
	  isNew: function() {
	    return !this.has(this.idAttribute);
	  },

	  // Check if the model is currently in a valid state.
	  isValid: function(options) {
	    return this._validate({}, _.extend(options || {}, { validate: true }));
	  },

	  // Run validation against the next complete set of model attributes,
	  // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
	  _validate: function(attrs, options) {
	    if (!options.validate || !this.validate) return true;
	    attrs = _.extend(Object.create(null), this.attributes, attrs);
	    var error = this.validationError = this.validate(attrs, options) || null;
	    if (!error) return true;
	    this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
	    return false;
	  }

	});

	if (_.keys) {
	  // Underscore methods that we want to implement on the Model.
	  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

	  // Mix in each Underscore method as a proxy to `Model#attributes`.
	  modelMethods.filter(utilExists).forEach(function(method) {
	    Model.prototype[method] = function() {
	      var args = slice.call(arguments);
	      args.unshift(this.attributes);
	      return _[method].apply(_, args);
	    };
	  });
	}
	// Backbone.Collection
	// -------------------

	// If models tend to represent a single row of data, a Backbone Collection is
	// more analagous to a table full of data ... or a small slice or page of that
	// table, or a collection of rows that belong together for a particular reason
	// -- all of the messages in this particular folder, all of the documents
	// belonging to this particular author, and so on. Collections maintain
	// indexes of their models, both in order, and for lookup by `id`.

	// Create a new **Collection**, perhaps to contain a specific type of `model`.
	// If a `comparator` is specified, the Collection will maintain
	// its models in sort order, as they're added and removed.
	var Collection = Backbone.Collection = function(models, options) {
	  options || (options = {});
	  if (options.model) this.model = options.model;
	  if (options.comparator !== void 0) this.comparator = options.comparator;
	  this._reset();
	  this.initialize.apply(this, arguments);
	  if (models) this.reset(models, _.extend({silent: true}, options));
	};

	// Default options for `Collection#set`.
	var setOptions = {add: true, remove: true, merge: true};
	var addOptions = {add: true, remove: false};

	// Define the Collection's inheritable methods.
	_.extend(Collection.prototype, Events, {

	  // The default model for a collection is just a **Backbone.Model**.
	  // This should be overridden in most cases.
	  model: typeof Model === 'undefined' ? null : Model,

	  // Initialize is an empty function by default. Override it with your own
	  // initialization logic.
	  initialize: function(){},

	  // The JSON representation of a Collection is an array of the
	  // models' attributes.
	  toJSON: function(options) {
	    return this.map(function(model){ return model.toJSON(options); });
	  },

	  // Proxy `Backbone.sync` by default.
	  sync: function() {
	    return Backbone.sync.apply(this, arguments);
	  },

	  // Add a model, or list of models to the set.
	  add: function(models, options) {
	    return this.set(models, _.extend({merge: false}, options, addOptions));
	  },

	  // Remove a model, or a list of models from the set.
	  remove: function(models, options) {
	    var singular = !Array.isArray(models);
	    models = singular ? [models] : models.slice();
	    options || (options = {});
	    var i, l, index, model;
	    for (i = 0, l = models.length; i < l; i++) {
	      model = models[i] = this.get(models[i]);
	      if (!model) continue;
	      delete this._byId[model.id];
	      delete this._byId[model.cid];
	      index = this.indexOf(model);
	      this.models.splice(index, 1);
	      this.length--;
	      if (!options.silent) {
	        options.index = index;
	        model.trigger('remove', model, this, options);
	      }
	      this._removeReference(model, options);
	    }
	    return singular ? models[0] : models;
	  },

	  // Update a collection by `set`-ing a new list of models, adding new ones,
	  // removing models that are no longer present, and merging models that
	  // already exist in the collection, as necessary. Similar to **Model#set**,
	  // the core operation for updating the data contained by the collection.
	  set: function(models, options) {
	    options = _.defaults({}, options, setOptions);
	    if (options.parse) models = this.parse(models, options);
	    var singular = !Array.isArray(models);
	    models = singular ? (models ? [models] : []) : models.slice();
	    var i, l, id, model, attrs, existing, sort;
	    var at = options.at;
	    var targetModel = this.model;
	    var sortable = this.comparator && (at == null) && options.sort !== false;
	    var sortAttr = typeof this.comparator === 'string' ? this.comparator : null;
	    var toAdd = [], toRemove = [], modelMap = {};
	    var add = options.add, merge = options.merge, remove = options.remove;
	    var order = !sortable && add && remove ? [] : false;

	    // Turn bare objects into model references, and prevent invalid models
	    // from being added.
	    for (i = 0, l = models.length; i < l; i++) {
	      attrs = models[i] || {};
	      if (attrs instanceof Model) {
	        id = model = attrs;
	      } else {
	        id = attrs[targetModel.prototype.idAttribute || 'id'];
	      }

	      // If a duplicate is found, prevent it from being added and
	      // optionally merge it into the existing model.
	      if (existing = this.get(id)) {
	        if (remove) modelMap[existing.cid] = true;
	        if (merge) {
	          attrs = attrs === model ? model.attributes : attrs;
	          if (options.parse) attrs = existing.parse(attrs, options);
	          existing.set(attrs, options);
	          if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
	        }
	        models[i] = existing;

	      // If this is a new, valid model, push it to the `toAdd` list.
	      } else if (add) {
	        model = models[i] = this._prepareModel(attrs, options);
	        if (!model) continue;
	        toAdd.push(model);
	        this._addReference(model, options);
	      }

	      // Do not add multiple models with the same `id`.
	      model = existing || model;
	      if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
	      modelMap[model.id] = true;
	    }

	    // Remove nonexistent models if appropriate.
	    if (remove) {
	      for (i = 0, l = this.length; i < l; ++i) {
	        if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
	      }
	      if (toRemove.length) this.remove(toRemove, options);
	    }

	    // See if sorting is needed, update `length` and splice in new models.
	    if (toAdd.length || (order && order.length)) {
	      if (sortable) sort = true;
	      this.length += toAdd.length;
	      if (at != null) {
	        for (i = 0, l = toAdd.length; i < l; i++) {
	          this.models.splice(at + i, 0, toAdd[i]);
	        }
	      } else {
	        if (order) this.models.length = 0;
	        var orderedModels = order || toAdd;
	        for (i = 0, l = orderedModels.length; i < l; i++) {
	          this.models.push(orderedModels[i]);
	        }
	      }
	    }

	    // Silently sort the collection if appropriate.
	    if (sort) this.sort({silent: true});

	    // Unless silenced, it's time to fire all appropriate add/sort events.
	    if (!options.silent) {
	      for (i = 0, l = toAdd.length; i < l; i++) {
	        (model = toAdd[i]).trigger('add', model, this, options);
	      }
	      if (sort || (order && order.length)) this.trigger('sort', this, options);
	    }

	    // Return the added (or merged) model (or models).
	    return singular ? models[0] : models;
	  },

	  // When you have more items than you want to add or remove individually,
	  // you can reset the entire set with a new list of models, without firing
	  // any granular `add` or `remove` events. Fires `reset` when finished.
	  // Useful for bulk operations and optimizations.
	  reset: function(models, options) {
	    options || (options = {});
	    for (var i = 0, l = this.models.length; i < l; i++) {
	      this._removeReference(this.models[i], options);
	    }
	    options.previousModels = this.models;
	    this._reset();
	    models = this.add(models, _.extend({silent: true}, options));
	    if (!options.silent) this.trigger('reset', this, options);
	    return models;
	  },

	  // Add a model to the end of the collection.
	  push: function(model, options) {
	    return this.add(model, _.extend({at: this.length}, options));
	  },

	  // Remove a model from the end of the collection.
	  pop: function(options) {
	    var model = this.at(this.length - 1);
	    this.remove(model, options);
	    return model;
	  },

	  // Add a model to the beginning of the collection.
	  unshift: function(model, options) {
	    return this.add(model, _.extend({at: 0}, options));
	  },

	  // Remove a model from the beginning of the collection.
	  shift: function(options) {
	    var model = this.at(0);
	    this.remove(model, options);
	    return model;
	  },

	  // Slice out a sub-array of models from the collection.
	  slice: function() {
	    return slice.apply(this.models, arguments);
	  },

	  // Get a model from the set by id.
	  get: function(obj) {
	    if (obj == null) return void 0;
	    return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
	  },

	  // Get the model at the given index.
	  at: function(index) {
	    return this.models[index];
	  },

	  // Return models with matching attributes. Useful for simple cases of
	  // `filter`.
	  where: function(attrs, first) {
	    if (!attrs || !Object.keys(attrs).length) return first ? void 0 : [];
	    return this[first ? 'find' : 'filter'](function(model) {
	      for (var key in attrs) {
	        if (attrs[key] !== model.get(key)) return false;
	      }
	      return true;
	    });
	  },

	  // Return the first model with matching attributes. Useful for simple cases
	  // of `find`.
	  findWhere: function(attrs) {
	    return this.where(attrs, true);
	  },

	  // Force the collection to re-sort itself. You don't need to call this under
	  // normal circumstances, as the set will maintain sort order as each item
	  // is added.
	  sort: function(options) {
	    if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
	    options || (options = {});

	    // Run sort based on type of `comparator`.
	    if (typeof this.comparator === 'string' || this.comparator.length === 1) {
	      this.models = this.sortBy(this.comparator, this);
	    } else {
	      this.models.sort(this.comparator.bind(this));
	    }

	    if (!options.silent) this.trigger('sort', this, options);
	    return this;
	  },

	  // Pluck an attribute from each model in the collection.
	  pluck: function(attr) {
	    return this.models.map(function(model) {
	      return model.get(attr);
	    });
	  },

	  // Fetch the default set of models for this collection, resetting the
	  // collection when they arrive. If `reset: true` is passed, the response
	  // data will be passed through the `reset` method instead of `set`.
	  fetch: function(options) {
	    options = options ? _.extend({}, options) : {};
	    if (options.parse === void 0) options.parse = true;
	    var success = options.success;
	    var collection = this;
	    options.success = function(resp) {
	      var method = options.reset ? 'reset' : 'set';
	      collection[method](resp, options);
	      if (success) success(collection, resp, options);
	      collection.trigger('sync', collection, resp, options);
	    };
	    wrapError(this, options);
	    return this.sync('read', this, options);
	  },

	  // Create a new instance of a model in this collection. Add the model to the
	  // collection immediately, unless `wait: true` is passed, in which case we
	  // wait for the server to agree.
	  create: function(model, options) {
	    options = options ? _.extend({}, options) : {};
	    if (!(model = this._prepareModel(model, options))) return false;
	    if (!options.wait) this.add(model, options);
	    var collection = this;
	    var success = options.success;
	    options.success = function(model, resp) {
	      if (options.wait) collection.add(model, options);
	      if (success) success(model, resp, options);
	    };
	    model.save(null, options);
	    return model;
	  },

	  // **parse** converts a response into a list of models to be added to the
	  // collection. The default implementation is just to pass it through.
	  parse: function(resp, options) {
	    return resp;
	  },

	  // Create a new collection with an identical list of models as this one.
	  clone: function() {
	    return new this.constructor(this.models);
	  },

	  // Private method to reset all internal state. Called when the collection
	  // is first initialized or reset.
	  _reset: function() {
	    this.length = 0;
	    this.models = [];
	    this._byId  = Object.create(null);
	  },

	  // Prepare a hash of attributes (or other model) to be added to this
	  // collection.
	  _prepareModel: function(attrs, options) {
	    if (attrs instanceof Model) return attrs;
	    options = _.extend({}, options);
	    options.collection = this;
	    var model = new this.model(attrs, options);
	    if (!model.validationError) return model;
	    this.trigger('invalid', this, model.validationError, options);
	    return false;
	  },

	  // Internal method to create a model's ties to a collection.
	  _addReference: function(model, options) {
	    this._byId[model.cid] = model;
	    if (model.id != null) this._byId[model.id] = model;
	    if (!model.collection) model.collection = this;
	    model.on('all', this._onModelEvent, this);
	  },

	  // Internal method to sever a model's ties to a collection.
	  _removeReference: function(model, options) {
	    if (this === model.collection) delete model.collection;
	    model.off('all', this._onModelEvent, this);
	  },

	  // Internal method called every time a model in the set fires an event.
	  // Sets need to update their indexes when models change ids. All other
	  // events simply proxy through. "add" and "remove" events that originate
	  // in other collections are ignored.
	  _onModelEvent: function(event, model, collection, options) {
	    if ((event === 'add' || event === 'remove') && collection !== this) return;
	    if (event === 'destroy') this.remove(model, options);
	    if (model && event === 'change:' + model.idAttribute) {
	      delete this._byId[model.previous(model.idAttribute)];
	      if (model.id != null) this._byId[model.id] = model;
	    }
	    this.trigger.apply(this, arguments);
	  }

	});

	if (utilExists('each')) {
	  // Underscore methods that we want to implement on the Collection.
	  // 90% of the core usefulness of Backbone Collections is actually implemented
	  // right here:
	  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
	    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
	    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
	    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
	    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
	    'lastIndexOf', 'isEmpty', 'chain'];

	  // Mix in each Underscore method as a proxy to `Collection#models`.
	  methods.filter(utilExists).forEach(function(method) {
	    Collection.prototype[method] = function() {
	      var args = slice.call(arguments);
	      args.unshift(this.models);
	      return _[method].apply(_, args);
	    };
	  });

	  // Underscore methods that take a property name as an argument.
	  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

	  // Use attributes instead of properties.
	  attributeMethods.filter(utilExists).forEach(function(method) {
	    Collection.prototype[method] = function(value, context) {
	      var iterator = typeof value === 'function' ? value : function(model) {
	        return model.get(value);
	      };
	      return _[method](this.models, iterator, context);
	    };
	  });
	} else {
	  ['forEach', 'map', 'filter', 'some', 'every', 'reduce', 'reduceRight',
	    'indexOf', 'lastIndexOf'].forEach(function(method) {
	    Collection.prototype[method] = function(arg, context) {
	      return this.models[method](arg, context);
	    };
	  });

	  // Exoskeleton-specific:
	  Collection.prototype.find = function(iterator, context) {
	    var result;
	    this.some(function(value, index, list) {
	      if (iterator.call(context, value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Underscore methods that take a property name as an argument.
	  ['sortBy'].forEach(function(method) {
	    Collection.prototype[method] = function(value, context) {
	      var iterator = typeof value === 'function' ? value : function(model) {
	        return model.get(value);
	      };
	      return _[method](this.models, iterator, context);
	    };
	  });
	}
	// Backbone.View
	// -------------

	// Backbone Views are almost more convention than they are actual code. A View
	// is simply a JavaScript object that represents a logical chunk of UI in the
	// DOM. This might be a single item, an entire list, a sidebar or panel, or
	// even the surrounding frame which wraps your whole app. Defining a chunk of
	// UI as a **View** allows you to define your DOM events declaratively, without
	// having to worry about render order ... and makes it easy for the view to
	// react to specific changes in the state of your models.

	// Creating a Backbone.View creates its initial element outside of the DOM,
	// if an existing element is not provided...
	var View = Backbone.View = function(options) {
	  this.cid = _.uniqueId('view');

	  if (options) Object.keys(options).forEach(function(key) {
	    if (viewOptions.indexOf(key) !== -1) this[key] = options[key];
	  }, this);

	  this._ensureElement();
	  this.initialize.apply(this, arguments);
	};

	// Cached regex to split keys for `delegate`.
	var delegateEventSplitter = /^(\S+)\s*(.*)$/;

	// List of view options to be merged as properties.
	var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

	// Set up all inheritable **Backbone.View** properties and methods.
	_.extend(View.prototype, Events, {

	  // The default `tagName` of a View's element is `"div"`.
	  tagName: 'div',

	  // jQuery delegate for element lookup, scoped to DOM elements within the
	  // current view. This should be preferred to global lookups where possible.
	  $: function(selector) {
	    return this.$el.find(selector);
	  },

	  // Initialize is an empty function by default. Override it with your own
	  // initialization logic.
	  initialize: function(){},

	  // **render** is the core function that your view should override, in order
	  // to populate its element (`this.el`), with the appropriate HTML. The
	  // convention is for **render** to always return `this`.
	  render: function() {
	    return this;
	  },

	  // Remove this view by taking the element out of the DOM, and removing any
	  // applicable Backbone.Events listeners.
	  remove: function() {
	    this._removeElement();
	    this.stopListening();
	    return this;
	  },

	  // Remove this view's element from the document and all event listeners
	  // attached to it. Exposed for subclasses using an alternative DOM
	  // manipulation API.
	  _removeElement: function() {
	    this.$el.remove();
	  },

	  // Change the view's element (`this.el` property) and re-delegate the
	  // view's events on the new element.
	  setElement: function(element) {
	    this.undelegateEvents();
	    this._setElement(element);
	    this.delegateEvents();
	    return this;
	  },

	  // Creates the `this.el` and `this.$el` references for this view using the
	  // given `el` and a hash of `attributes`. `el` can be a CSS selector or an
	  // HTML string, a jQuery context or an element. Subclasses can override
	  // this to utilize an alternative DOM manipulation API and are only required
	  // to set the `this.el` property.
	  _setElement: function(el) {
	    this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
	    this.el = this.$el[0];
	  },

	  // Set callbacks, where `this.events` is a hash of
	  //
	  // *{"event selector": "callback"}*
	  //
	  //     {
	  //       'mousedown .title':  'edit',
	  //       'click .button':     'save',
	  //       'click .open':       function(e) { ... }
	  //     }
	  //
	  // pairs. Callbacks will be bound to the view, with `this` set properly.
	  // Uses event delegation for efficiency.
	  // Omitting the selector binds the event to `this.el`.
	  delegateEvents: function(events) {
	    if (!(events || (events = _.result(this, 'events')))) return this;
	    this.undelegateEvents();
	    for (var key in events) {
	      var method = events[key];
	      if (typeof method !== 'function') method = this[events[key]];
	      // if (!method) continue;
	      var match = key.match(delegateEventSplitter);
	      this.delegate(match[1], match[2], method.bind(this));
	    }
	    return this;
	  },

	  // Add a single event listener to the view's element (or a child element
	  // using `selector`). This only works for delegate-able events: not `focus`,
	  // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
	  delegate: function(eventName, selector, listener) {
	    this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
	  },

	  // Clears all callbacks previously bound to the view by `delegateEvents`.
	  // You usually don't need to use this, but may wish to if you have multiple
	  // Backbone views attached to the same DOM element.
	  undelegateEvents: function() {
	    if (this.$el) this.$el.off('.delegateEvents' + this.cid);
	    return this;
	  },

	  // A finer-grained `undelegateEvents` for removing a single delegated event.
	  // `selector` and `listener` are both optional.
	  undelegate: function(eventName, selector, listener) {
	    this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
	  },

	  // Produces a DOM element to be assigned to your view. Exposed for
	  // subclasses using an alternative DOM manipulation API.
	  _createElement: function(tagName) {
	    return document.createElement(tagName);
	  },

	  // Ensure that the View has a DOM element to render into.
	  // If `this.el` is a string, pass it through `$()`, take the first
	  // matching element, and re-assign it to `el`. Otherwise, create
	  // an element from the `id`, `className` and `tagName` properties.
	  _ensureElement: function() {
	    if (!this.el) {
	      var attrs = _.extend({}, _.result(this, 'attributes'));
	      if (this.id) attrs.id = _.result(this, 'id');
	      if (this.className) attrs['class'] = _.result(this, 'className');
	      this.setElement(this._createElement(_.result(this, 'tagName')));
	      this._setAttributes(attrs);
	    } else {
	      this.setElement(_.result(this, 'el'));
	    }
	  },

	  // Set attributes from a hash on this view's element.  Exposed for
	  // subclasses using an alternative DOM manipulation API.
	  _setAttributes: function(attributes) {
	    this.$el.attr(attributes);
	  }

	});
	// Backbone.sync
	// -------------

	// Override this function to change the manner in which Backbone persists
	// models to the server. You will be passed the type of request, and the
	// model in question. By default, makes a RESTful Ajax request
	// to the model's `url()`. Some possible customizations could be:
	//
	// * Use `setTimeout` to batch rapid-fire updates into a single request.
	// * Send up the models as XML instead of JSON.
	// * Persist models via WebSockets instead of Ajax.
	Backbone.sync = function(method, model, options) {
	  options || (options = {})

	  var type = methodMap[method];

	  // Default JSON-request options.
	  var params = {type: type, dataType: 'json'};

	  // Ensure that we have a URL.
	  if (!options.url) {
	    params.url = _.result(model, 'url') || urlError();
	  }

	  // Ensure that we have the appropriate request data.
	  if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
	    params.contentType = 'application/json';
	    params.data = JSON.stringify(options.attrs || model.toJSON(options));
	  }

	  // Don't process data on a non-GET request.
	  if (params.type !== 'GET') {
	    params.processData = false;
	  }

	  // Make the request, allowing the user to override any Ajax options.
	  var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
	  model.trigger('request', model, xhr, options);
	  return xhr;
	};

	// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
	var methodMap = {
	  'create': 'POST',
	  'update': 'PUT',
	  'patch':  'PATCH',
	  'delete': 'DELETE',
	  'read':   'GET'
	};

	// Set the default implementation of `Backbone.ajax` to proxy through to `$`.
	// Override this if you'd like to use a different library.
	Backbone.ajax = function() {
	  return Backbone.$.ajax.apply(Backbone.$, arguments);
	};
	// Backbone.Router
	// ---------------

	// Routers map faux-URLs to actions, and fire events when routes are
	// matched. Creating a new one sets its `routes` hash, if not set statically.
	var Router = Backbone.Router = function(options) {
	  options || (options = {});
	  if (options.routes) this.routes = options.routes;
	  this._bindRoutes();
	  this.initialize.apply(this, arguments);
	};

	// Cached regular expressions for matching named param parts and splatted
	// parts of route strings.
	var optionalParam = /\((.*?)\)/g;
	var namedParam    = /(\(\?)?:\w+/g;
	var splatParam    = /\*\w+/g;
	var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

	var isRegExp = function(value) {
	  return value ? (typeof value === 'object' && toString.call(value) === '[object RegExp]') : false;
	};

	// Set up all inheritable **Backbone.Router** properties and methods.
	_.extend(Router.prototype, Events, {

	  // Initialize is an empty function by default. Override it with your own
	  // initialization logic.
	  initialize: function(){},

	  // Manually bind a single named route to a callback. For example:
	  //
	  //     this.route('search/:query/p:num', 'search', function(query, num) {
	  //       ...
	  //     });
	  //
	  route: function(route, name, callback) {
	    if (!isRegExp(route)) route = this._routeToRegExp(route);
	    if (typeof name === 'function') {
	      callback = name;
	      name = '';
	    }
	    if (!callback) callback = this[name];
	    var router = this;
	    Backbone.history.route(route, function(fragment) {
	      var args = router._extractParameters(route, fragment);
	      router.execute(callback, args);
	      router.trigger.apply(router, ['route:' + name].concat(args));
	      router.trigger('route', name, args);
	      Backbone.history.trigger('route', router, name, args);
	    });
	    return this;
	  },

	  // Execute a route handler with the provided parameters.  This is an
	  // excellent place to do pre-route setup or post-route cleanup.
	  execute: function(callback, args) {
	    if (callback) callback.apply(this, args);
	  },

	  // Simple proxy to `Backbone.history` to save a fragment into the history.
	  navigate: function(fragment, options) {
	    Backbone.history.navigate(fragment, options);
	    return this;
	  },

	  // Bind all defined routes to `Backbone.history`. We have to reverse the
	  // order of the routes here to support behavior where the most general
	  // routes can be defined at the bottom of the route map.
	  _bindRoutes: function() {
	    if (!this.routes) return;
	    this.routes = _.result(this, 'routes');
	    var route, routes = Object.keys(this.routes);
	    while ((route = routes.pop()) != null) {
	      this.route(route, this.routes[route]);
	    }
	  },

	  // Convert a route string into a regular expression, suitable for matching
	  // against the current location hash.
	  _routeToRegExp: function(route) {
	    route = route.replace(escapeRegExp, '\\$&')
	                 .replace(optionalParam, '(?:$1)?')
	                 .replace(namedParam, function(match, optional) {
	                   return optional ? match : '([^/?]+)';
	                 })
	                 .replace(splatParam, '([^?]*?)');
	    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	  },

	  // Given a route, and a URL fragment that it matches, return the array of
	  // extracted decoded parameters. Empty or unmatched parameters will be
	  // treated as `null` to normalize cross-browser behavior.
	  _extractParameters: function(route, fragment) {
	    var params = route.exec(fragment).slice(1);
	    return params.map(function(param, i) {
	      // Don't decode the search params.
	      if (i === params.length - 1) return param || null;
	      return param ? decodeURIComponent(param) : null;
	    });
	  }

	});
	// Backbone.History
	// ----------------

	// Handles cross-browser history management, based on either
	// [pushState](http://diveintohtml5.info/history.html) and real URLs, or
	// [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
	// and URL fragments.
	var History = Backbone.History = function() {
	  this.handlers = [];
	  this.checkUrl = this.checkUrl.bind(this);

	  // Ensure that `History` can be used outside of the browser.
	  if (typeof window !== 'undefined') {
	    this.location = window.location;
	    this.history = window.history;
	  }
	};

	// Cached regex for stripping a leading hash/slash and trailing space.
	var routeStripper = /^[#\/]|\s+$/g;

	// Cached regex for stripping leading and trailing slashes.
	var rootStripper = /^\/+|\/+$/g;

	// Cached regex for removing a trailing slash.
	var trailingSlash = /\/$/;

	// Cached regex for stripping urls of hash and query.
	var pathStripper = /[#].*$/;

	// Has the history handling already been started?
	History.started = false;

	// Set up all inheritable **Backbone.History** properties and methods.
	_.extend(History.prototype, Events, {

	  // Are we at the app root?
	  atRoot: function() {
	    return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
	  },

	  // Gets the true hash value. Cannot use location.hash directly due to bug
	  // in Firefox where location.hash will always be decoded.
	  getHash: function(window) {
	    var match = (window || this).location.href.match(/#(.*)$/);
	    return match ? match[1] : '';
	  },

	  // Get the cross-browser normalized URL fragment, either from the URL,
	  // the hash, or the override.
	  getFragment: function(fragment, forcePushState) {
	    if (fragment == null) {
	      if (this._wantsPushState || !this._wantsHashChange) {
	        fragment = decodeURI(this.location.pathname + this.location.search);
	        var root = this.root.replace(trailingSlash, '');
	        if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
	      } else {
	        fragment = this.getHash();
	      }
	    }
	    return fragment.replace(routeStripper, '');
	  },

	  // Start the hash change handling, returning `true` if the current URL matches
	  // an existing route, and `false` otherwise.
	  start: function(options) {
	    if (History.started) throw new Error("Backbone.history has already been started");
	    History.started = true;

	    // Figure out the initial configuration.
	    // Is pushState desired or should we use hashchange only?
	    this.options          = _.extend({root: '/'}, this.options, options);
	    this.root             = this.options.root;
	    this._wantsHashChange = this.options.hashChange !== false;
	    this._wantsPushState  = !!this.options.pushState;
	    var fragment          = this.getFragment();

	    // Normalize root to always include a leading and trailing slash.
	    this.root = ('/' + this.root + '/').replace(rootStripper, '/');

	    // Depending on whether we're using pushState or hashes, determine how we
	    // check the URL state.
	    if (this._wantsPushState) {
	      window.addEventListener('popstate', this.checkUrl, false);
	    } else if (this._wantsHashChange) {
	      window.addEventListener('hashchange', this.checkUrl, false);
	    }

	    // Determine if we need to change the base url, for a pushState link
	    // opened by a non-pushState browser.
	    this.fragment = fragment;
	    var loc = this.location;

	    // Transition from hashChange to pushState or vice versa if both are
	    // requested.
	    if (this._wantsHashChange && this._wantsPushState) {

	      // If we've started out with a hash-based route, but we're currently
	      // in a browser where it could be `pushState`-based instead...
	      if (this.atRoot() && loc.hash) {
	        this.fragment = this.getHash().replace(routeStripper, '');
	        this.history.replaceState({}, document.title, this.root + this.fragment);
	      }

	    }

	    if (!this.options.silent) return this.loadUrl();
	  },

	  // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
	  // but possibly useful for unit testing Routers.
	  stop: function() {
	    window.removeEventListener('popstate', this.checkUrl);
	    window.removeEventListener('hashchange', this.checkUrl);
	    History.started = false;
	  },

	  // Add a route to be tested when the fragment changes. Routes added later
	  // may override previous routes.
	  route: function(route, callback) {
	    this.handlers.unshift({route: route, callback: callback});
	  },

	  // Checks the current URL to see if it has changed, and if it has,
	  // calls `loadUrl`.
	  checkUrl: function() {
	    var current = this.getFragment();
	    if (current === this.fragment) return false;
	    this.loadUrl();
	  },

	  // Attempt to load the current URL fragment. If a route succeeds with a
	  // match, returns `true`. If no defined routes matches the fragment,
	  // returns `false`.
	  loadUrl: function(fragment) {
	    fragment = this.fragment = this.getFragment(fragment);
	    return this.handlers.some(function(handler) {
	      if (handler.route.test(fragment)) {
	        handler.callback(fragment);
	        return true;
	      }
	    });
	  },

	  // Save a fragment into the hash history, or replace the URL state if the
	  // 'replace' option is passed. You are responsible for properly URL-encoding
	  // the fragment in advance.
	  //
	  // The options object can contain `trigger: true` if you wish to have the
	  // route callback be fired (not usually desirable), or `replace: true`, if
	  // you wish to modify the current URL without adding an entry to the history.
	  navigate: function(fragment, options) {
	    if (!History.started) return false;
	    if (!options || options === true) options = {trigger: !!options};

	    var url = this.root + (fragment = this.getFragment(fragment || ''));

	    // Strip the hash for matching.
	    fragment = fragment.replace(pathStripper, '');

	    if (this.fragment === fragment) return;
	    this.fragment = fragment;

	    // Don't include a trailing slash on the root.
	    if (fragment === '' && url !== '/') url = url.slice(0, -1);

	    // If we're using pushState we use it to set the fragment as a real URL.
	    if (this._wantsPushState) {
	      this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

	    // If hash changes haven't been explicitly disabled, update the hash
	    // fragment to store history.
	    } else if (this._wantsHashChange) {
	      this._updateHash(this.location, fragment, options.replace);
	    // If you've told us that you explicitly don't want fallback hashchange-
	    // based history, then `navigate` becomes a page refresh.
	    } else {
	      return this.location.assign(url);
	    }
	    if (options.trigger) return this.loadUrl(fragment);
	  },

	  // Update the hash location, either replacing the current entry, or adding
	  // a new one to the browser history.
	  _updateHash: function(location, fragment, replace) {
	    if (replace) {
	      var href = location.href.replace(/(javascript:|#).*$/, '');
	      location.replace(href + '#' + fragment);
	    } else {
	      // Some browsers require that `hash` contains a leading #.
	      location.hash = '#' + fragment;
	    }
	  }

	});
	  // !!!
	  // Init.
	  ['Model', 'Collection', 'Router', 'View', 'History'].forEach(function(name) {
	    var item = Backbone[name];
	    if (item) item.extend = Backbone.extend;
	  });

	  // Allow the `Backbone` object to serve as a global event bus, for folks who
	  // want global "pubsub" in a convenient place.
	  _.extend(Backbone, Events);

	  // Create the default Backbone.history if the History module is included.
	  if (History) Backbone.history = new History();
	  return Backbone;
	});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define('underscore', factory) :
	  (function() {
	  	var current = global._;
	  	var exports = factory();
	  	global._ = exports;
	  	exports.noConflict = function() { global._ = current; return exports; };
	  })();
	}(this, (function () {

	  //     Underscore.js 1.10.2
	  //     https://underscorejs.org
	  //     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	  //     Underscore may be freely distributed under the MIT license.

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` (`self`) in the browser, `global`
	  // on the server, or `this` in some virtual machines. We use `self`
	  // instead of `window` for `WebWorker` support.
	  var root = typeof self == 'object' && self.self === self && self ||
	            typeof global == 'object' && global.global === global && global ||
	            Function('return this')() ||
	            {};

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
	  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

	  // Create quick reference variables for speed access to core prototypes.
	  var push = ArrayProto.push,
	      slice = ArrayProto.slice,
	      toString = ObjProto.toString,
	      hasOwnProperty = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var nativeIsArray = Array.isArray,
	      nativeKeys = Object.keys,
	      nativeCreate = Object.create;

	  // Create references to these builtin functions because we override them.
	  var _isNaN = root.isNaN,
	      _isFinite = root.isFinite;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // The Underscore object. All exported functions below are added to it in the
	  // modules/index-all.js using the mixin function.
	  function _(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  }

	  // Current version.
	  var VERSION = _.VERSION = '1.10.2';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  function optimizeCb(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      // The 2-argument case is omitted because we’re not using it.
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  }

	  // An internal function to generate callbacks that can be applied to each
	  // element in a collection, returning the desired result — either `identity`,
	  // an arbitrary callback, a property matcher, or a property accessor.
	  function baseIteratee(value, context, argCount) {
	    if (value == null) return identity;
	    if (isFunction(value)) return optimizeCb(value, context, argCount);
	    if (isObject(value) && !isArray(value)) return matcher(value);
	    return property(value);
	  }

	  // External wrapper for our callback generator. Users may customize
	  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
	  // This abstraction hides the internal-only argCount argument.
	  _.iteratee = iteratee;
	  function iteratee(value, context) {
	    return baseIteratee(value, context, Infinity);
	  }

	  // The function we actually call internally. It invokes _.iteratee if
	  // overridden, otherwise baseIteratee.
	  function cb(value, context, argCount) {
	    if (_.iteratee !== iteratee) return _.iteratee(value, context);
	    return baseIteratee(value, context, argCount);
	  }

	  // Some functions take a variable number of arguments, or a few expected
	  // arguments at the beginning and then a variable number of values to operate
	  // on. This helper accumulates all remaining arguments past the function’s
	  // argument length (or an explicit `startIndex`), into an array that becomes
	  // the last argument. Similar to ES6’s "rest parameter".
	  function restArguments(func, startIndex) {
	    startIndex = startIndex == null ? func.length - 1 : +startIndex;
	    return function() {
	      var length = Math.max(arguments.length - startIndex, 0),
	          rest = Array(length),
	          index = 0;
	      for (; index < length; index++) {
	        rest[index] = arguments[index + startIndex];
	      }
	      switch (startIndex) {
	        case 0: return func.call(this, rest);
	        case 1: return func.call(this, arguments[0], rest);
	        case 2: return func.call(this, arguments[0], arguments[1], rest);
	      }
	      var args = Array(startIndex + 1);
	      for (index = 0; index < startIndex; index++) {
	        args[index] = arguments[index];
	      }
	      args[startIndex] = rest;
	      return func.apply(this, args);
	    };
	  }

	  // An internal function for creating a new object that inherits from another.
	  function baseCreate(prototype) {
	    if (!isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  }

	  function shallowProperty(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  }

	  function _has(obj, path) {
	    return obj != null && hasOwnProperty.call(obj, path);
	  }

	  function deepGet(obj, path) {
	    var length = path.length;
	    for (var i = 0; i < length; i++) {
	      if (obj == null) return void 0;
	      obj = obj[path[i]];
	    }
	    return length ? obj : void 0;
	  }

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object.
	  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = shallowProperty('length');
	  function isArrayLike(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  }

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  function each(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var _keys = keys(obj);
	      for (i = 0, length = _keys.length; i < length; i++) {
	        iteratee(obj[_keys[i]], _keys[i], obj);
	      }
	    }
	    return obj;
	  }

	  // Return the results of applying the iteratee to each element.
	  function map(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys ? _keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  }

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Wrap code that reassigns argument variables in a separate function than
	    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	    var reducer = function(obj, iteratee, memo, initial) {
	      var _keys = !isArrayLike(obj) && keys(obj),
	          length = (_keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      if (!initial) {
	        memo = obj[_keys ? _keys[index] : index];
	        index += dir;
	      }
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = _keys ? _keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    };

	    return function(obj, iteratee, memo, context) {
	      var initial = arguments.length >= 3;
	      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  var reduce = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  var reduceRight = createReduce(-1);

	  // Return the first value which passes a truth test.
	  function find(obj, predicate, context) {
	    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
	    var key = keyFinder(obj, predicate, context);
	    if (key !== void 0 && key !== -1) return obj[key];
	  }

	  // Return all the elements that pass a truth test.
	  function filter(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  }

	  // Return all the elements for which a truth test fails.
	  function reject(obj, predicate, context) {
	    return filter(obj, negate(cb(predicate)), context);
	  }

	  // Determine whether all of the elements match a truth test.
	  function every(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys ? _keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  }

	  // Determine if at least one element in the object matches a truth test.
	  function some(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys ? _keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  }

	  // Determine if the array or object contains a given item (using `===`).
	  function contains(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return indexOf(obj, item, fromIndex) >= 0;
	  }

	  // Invoke a method (with arguments) on every item in a collection.
	  var invoke = restArguments(function(obj, path, args) {
	    var contextPath, func;
	    if (isFunction(path)) {
	      func = path;
	    } else if (isArray(path)) {
	      contextPath = path.slice(0, -1);
	      path = path[path.length - 1];
	    }
	    return map(obj, function(context) {
	      var method = func;
	      if (!method) {
	        if (contextPath && contextPath.length) {
	          context = deepGet(context, contextPath);
	        }
	        if (context == null) return void 0;
	        method = context[path];
	      }
	      return method == null ? method : method.apply(context, args);
	    });
	  });

	  // Convenience version of a common use case of `map`: fetching a property.
	  function pluck(obj, key) {
	    return map(obj, property(key));
	  }

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  function where(obj, attrs) {
	    return filter(obj, matcher(attrs));
	  }

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  function findWhere(obj, attrs) {
	    return find(obj, matcher(attrs));
	  }

	  // Return the maximum element (or element-based computation).
	  function max(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	      obj = isArrayLike(obj) ? obj : values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value != null && value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      each(obj, function(v, index, list) {
	        computed = iteratee(v, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = v;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  }

	  // Return the minimum element (or element-based computation).
	  function min(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	      obj = isArrayLike(obj) ? obj : values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value != null && value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      each(obj, function(v, index, list) {
	        computed = iteratee(v, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = v;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  }

	  // Shuffle a collection.
	  function shuffle(obj) {
	    return sample(obj, Infinity);
	  }

	  // Sample **n** random values from a collection using the modern version of the
	  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  function sample(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = values(obj);
	      return obj[random(obj.length - 1)];
	    }
	    var sample = isArrayLike(obj) ? clone(obj) : values(obj);
	    var length = getLength(sample);
	    n = Math.max(Math.min(n, length), 0);
	    var last = length - 1;
	    for (var index = 0; index < n; index++) {
	      var rand = random(index, last);
	      var temp = sample[index];
	      sample[index] = sample[rand];
	      sample[rand] = temp;
	    }
	    return sample.slice(0, n);
	  }

	  // Sort the object's values by a criterion produced by an iteratee.
	  function sortBy(obj, iteratee, context) {
	    var index = 0;
	    iteratee = cb(iteratee, context);
	    return pluck(map(obj, function(value, key, list) {
	      return {
	        value: value,
	        index: index++,
	        criteria: iteratee(value, key, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  }

	  // An internal function used for aggregate "group by" operations.
	  function group(behavior, partition) {
	    return function(obj, iteratee, context) {
	      var result = partition ? [[], []] : {};
	      iteratee = cb(iteratee, context);
	      each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  }

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  var groupBy = group(function(result, value, key) {
	    if (_has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  var indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  var countBy = group(function(result, value, key) {
	    if (_has(result, key)) result[key]++; else result[key] = 1;
	  });

	  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
	  // Safely create a real, live array from anything iterable.
	  function toArray(obj) {
	    if (!obj) return [];
	    if (isArray(obj)) return slice.call(obj);
	    if (isString(obj)) {
	      // Keep surrogate pair characters together
	      return obj.match(reStrSymbol);
	    }
	    if (isArrayLike(obj)) return map(obj, identity);
	    return values(obj);
	  }

	  // Return the number of elements in an object.
	  function size(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : keys(obj).length;
	  }

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  var partition = group(function(result, value, pass) {
	    result[pass ? 0 : 1].push(value);
	  }, true);

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. The **guard** check allows it to work with `map`.
	  function first(array, n, guard) {
	    if (array == null || array.length < 1) return n == null ? void 0 : [];
	    if (n == null || guard) return array[0];
	    return initial(array, array.length - n);
	  }

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  function initial(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  }

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  function last(array, n, guard) {
	    if (array == null || array.length < 1) return n == null ? void 0 : [];
	    if (n == null || guard) return array[array.length - 1];
	    return rest(array, Math.max(0, array.length - n));
	  }

	  // Returns everything but the first entry of the array. Especially useful on
	  // the arguments object. Passing an **n** will return the rest N values in the
	  // array.
	  function rest(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  }

	  // Trim out all falsy values from an array.
	  function compact(array) {
	    return filter(array, Boolean);
	  }

	  // Internal implementation of a recursive `flatten` function.
	  function _flatten(input, shallow, strict, output) {
	    output = output || [];
	    var idx = output.length;
	    for (var i = 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
	        // Flatten current level of array or arguments object.
	        if (shallow) {
	          var j = 0, len = value.length;
	          while (j < len) output[idx++] = value[j++];
	        } else {
	          _flatten(value, shallow, strict, output);
	          idx = output.length;
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  }

	  // Flatten out an array, either recursively (by default), or just one level.
	  function flatten(array, shallow) {
	    return _flatten(array, shallow, false);
	  }

	  // Return a version of the array that does not contain the specified value(s).
	  var without = restArguments(function(array, otherArrays) {
	    return difference(array, otherArrays);
	  });

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // The faster algorithm will not work with an iteratee if the iteratee
	  // is not a one-to-one function, so providing an iteratee will disable
	  // the faster algorithm.
	  function uniq(array, isSorted, iteratee, context) {
	    if (!isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted && !iteratee) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  }

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  var union = restArguments(function(arrays) {
	    return uniq(_flatten(arrays, true, true));
	  });

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  function intersection(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (contains(result, item)) continue;
	      var j;
	      for (j = 1; j < argsLength; j++) {
	        if (!contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  }

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  var difference = restArguments(function(array, rest) {
	    rest = _flatten(rest, true, true);
	    return filter(array, function(value){
	      return !contains(rest, value);
	    });
	  });

	  // Complement of zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices.
	  function unzip(array) {
	    var length = array && max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = pluck(array, index);
	    }
	    return result;
	  }

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  var zip = restArguments(unzip);

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values. Passing by pairs is the reverse of pairs.
	  function object(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  }

	  // Generator function to create the findIndex and findLastIndex functions.
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test.
	  var findIndex = createPredicateIndexFinder(1);
	  var findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  function sortedIndex(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  }

	  // Generator function to create the indexOf and lastIndexOf functions.
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	          i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  var indexOf = createIndexFinder(1, findIndex, sortedIndex);
	  var lastIndexOf = createIndexFinder(-1, findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](https://docs.python.org/library/functions.html#range).
	  function range(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    if (!step) {
	      step = stop < start ? -1 : 1;
	    }

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  }

	  // Chunk a single array into multiple arrays, each containing `count` or fewer
	  // items.
	  function chunk(array, count) {
	    if (count == null || count < 1) return [];
	    var result = [];
	    var i = 0, length = array.length;
	    while (i < length) {
	      result.push(slice.call(array, i, i += count));
	    }
	    return result;
	  }

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments.
	  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (isObject(result)) return result;
	    return self;
	  }

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  var bind = restArguments(function(func, context, args) {
	    if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var bound = restArguments(function(callArgs) {
	      return executeBound(func, bound, context, this, args.concat(callArgs));
	    });
	    return bound;
	  });

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder by default, allowing any combination of arguments to be
	  // pre-filled. Set `partial.placeholder` for a custom placeholder argument.
	  var partial = restArguments(function(func, boundArgs) {
	    var placeholder = partial.placeholder;
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  });

	  partial.placeholder = _;

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  var bindAll = restArguments(function(obj, _keys) {
	    _keys = _flatten(_keys, false, false);
	    var index = _keys.length;
	    if (index < 1) throw new Error('bindAll must be passed function names');
	    while (index--) {
	      var key = _keys[index];
	      obj[key] = bind(obj[key], obj);
	    }
	  });

	  // Memoize an expensive function by storing its results.
	  function memoize(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  }

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  var delay = restArguments(function(func, wait, args) {
	    return setTimeout(function() {
	      return func.apply(null, args);
	    }, wait);
	  });

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  var defer = partial(delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  function throttle(func, wait, options) {
	    var timeout, context, args, result;
	    var previous = 0;
	    if (!options) options = {};

	    var later = function() {
	      previous = options.leading === false ? 0 : now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };

	    var throttled = function() {
	      var _now = now();
	      if (!previous && options.leading === false) previous = _now;
	      var remaining = wait - (_now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = _now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };

	    throttled.cancel = function() {
	      clearTimeout(timeout);
	      previous = 0;
	      timeout = context = args = null;
	    };

	    return throttled;
	  }

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  function debounce(func, wait, immediate) {
	    var timeout, result;

	    var later = function(context, args) {
	      timeout = null;
	      if (args) result = func.apply(context, args);
	    };

	    var debounced = restArguments(function(args) {
	      if (timeout) clearTimeout(timeout);
	      if (immediate) {
	        var callNow = !timeout;
	        timeout = setTimeout(later, wait);
	        if (callNow) result = func.apply(this, args);
	      } else {
	        timeout = delay(later, wait, this, args);
	      }

	      return result;
	    });

	    debounced.cancel = function() {
	      clearTimeout(timeout);
	      timeout = null;
	    };

	    return debounced;
	  }

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  function wrap(func, wrapper) {
	    return partial(wrapper, func);
	  }

	  // Returns a negated version of the passed-in predicate.
	  function negate(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  }

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  function compose() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  }

	  // Returns a function that will only be executed on and after the Nth call.
	  function after(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  }

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  function before(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  }

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  var once = partial(before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, _keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = isFunction(constructor) && constructor.prototype || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_has(obj, prop) && !contains(_keys, prop)) _keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !contains(_keys, prop)) {
	        _keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`.
	  function keys(obj) {
	    if (!isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var _keys = [];
	    for (var key in obj) if (_has(obj, key)) _keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, _keys);
	    return _keys;
	  }

	  // Retrieve all the property names of an object.
	  function allKeys(obj) {
	    if (!isObject(obj)) return [];
	    var _keys = [];
	    for (var key in obj) _keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, _keys);
	    return _keys;
	  }

	  // Retrieve the values of an object's properties.
	  function values(obj) {
	    var _keys = keys(obj);
	    var length = _keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[_keys[i]];
	    }
	    return values;
	  }

	  // Returns the results of applying the iteratee to each element of the object.
	  // In contrast to map it returns an object.
	  function mapObject(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var _keys = keys(obj),
	        length = _keys.length,
	        results = {};
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys[index];
	      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  }

	  // Convert an object into a list of `[key, value]` pairs.
	  // The opposite of object.
	  function pairs(obj) {
	    var _keys = keys(obj);
	    var length = _keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [_keys[i], obj[_keys[i]]];
	    }
	    return pairs;
	  }

	  // Invert the keys and values of an object. The values must be serializable.
	  function invert(obj) {
	    var result = {};
	    var _keys = keys(obj);
	    for (var i = 0, length = _keys.length; i < length; i++) {
	      result[obj[_keys[i]]] = _keys[i];
	    }
	    return result;
	  }

	  // Return a sorted list of the function names available on the object.
	  function functions(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  }

	  // An internal function for creating assigner functions.
	  function createAssigner(keysFunc, defaults) {
	    return function(obj) {
	      var length = arguments.length;
	      if (defaults) obj = Object(obj);
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            _keys = keysFunc(source),
	            l = _keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = _keys[i];
	          if (!defaults || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  }

	  // Extend a given object with all the properties in passed-in object(s).
	  var extend = createAssigner(allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s).
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  var extendOwn = createAssigner(keys);

	  // Returns the first key on an object that passes a predicate test.
	  function findKey(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var _keys = keys(obj), key;
	    for (var i = 0, length = _keys.length; i < length; i++) {
	      key = _keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  }

	  // Internal pick helper function to determine if `obj` has key `key`.
	  function keyInObj(value, key, obj) {
	    return key in obj;
	  }

	  // Return a copy of the object only containing the whitelisted properties.
	  var pick = restArguments(function(obj, _keys) {
	    var result = {}, iteratee = _keys[0];
	    if (obj == null) return result;
	    if (isFunction(iteratee)) {
	      if (_keys.length > 1) iteratee = optimizeCb(iteratee, _keys[1]);
	      _keys = allKeys(obj);
	    } else {
	      iteratee = keyInObj;
	      _keys = _flatten(_keys, false, false);
	      obj = Object(obj);
	    }
	    for (var i = 0, length = _keys.length; i < length; i++) {
	      var key = _keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  });

	  // Return a copy of the object without the blacklisted properties.
	  var omit = restArguments(function(obj, _keys) {
	    var iteratee = _keys[0], context;
	    if (isFunction(iteratee)) {
	      iteratee = negate(iteratee);
	      if (_keys.length > 1) context = _keys[1];
	    } else {
	      _keys = map(_flatten(_keys, false, false), String);
	      iteratee = function(value, key) {
	        return !contains(_keys, key);
	      };
	    }
	    return pick(obj, iteratee, context);
	  });

	  // Fill in a given object with default properties.
	  var defaults = createAssigner(allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  function create(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) extendOwn(result, props);
	    return result;
	  }

	  // Create a (shallow-cloned) duplicate of an object.
	  function clone(obj) {
	    if (!isObject(obj)) return obj;
	    return isArray(obj) ? obj.slice() : extend({}, obj);
	  }

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  function tap(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  }

	  // Returns whether an object has a given set of `key:value` pairs.
	  function isMatch(object, attrs) {
	    var _keys = keys(attrs), length = _keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = _keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  }


	  // Internal recursive comparison function for `isEqual`.
	  function eq(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // `null` or `undefined` only equal to itself (strict comparison).
	    if (a == null || b == null) return false;
	    // `NaN`s are equivalent, but non-reflexive.
	    if (a !== a) return b !== b;
	    // Exhaust primitive checks
	    var type = typeof a;
	    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	    return deepEq(a, b, aStack, bStack);
	  }

	  // Internal recursive comparison function for `isEqual`.
	  function deepEq(a, b, aStack, bStack) {
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN.
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	      case '[object Symbol]':
	        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
	                               isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var _keys = keys(a), key;
	      length = _keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = _keys[length];
	        if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  }

	  // Perform a deep comparison to check if two objects are equal.
	  function isEqual(a, b) {
	    return eq(a, b);
	  }

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  function isEmpty(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
	    return keys(obj).length === 0;
	  }

	  // Is a given value a DOM element?
	  function isElement(obj) {
	    return !!(obj && obj.nodeType === 1);
	  }

	  // Internal function for creating a toString-based type tester.
	  function tagTester(name) {
	    return function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  }

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  var isArray = nativeIsArray || tagTester('Array');

	  // Is a given variable an object?
	  function isObject(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  }

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
	  var isArguments = tagTester('Arguments');
	  var isFunction = tagTester('Function');
	  var isString = tagTester('String');
	  var isNumber = tagTester('Number');
	  var isDate = tagTester('Date');
	  var isRegExp = tagTester('RegExp');
	  var isError = tagTester('Error');
	  var isSymbol = tagTester('Symbol');
	  var isMap = tagTester('Map');
	  var isWeakMap = tagTester('WeakMap');
	  var isSet = tagTester('Set');
	  var isWeakSet = tagTester('WeakSet');

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  (function() {
	    if (!isArguments(arguments)) {
	      isArguments = function(obj) {
	        return _has(obj, 'callee');
	      };
	    }
	  }());

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
	  var nodelist = root.document && root.document.childNodes;
	  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	    isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  function isFinite(obj) {
	    return !isSymbol(obj) && _isFinite(obj) && !_isNaN(parseFloat(obj));
	  }

	  // Is the given value `NaN`?
	  function isNaN(obj) {
	    return isNumber(obj) && _isNaN(obj);
	  }

	  // Is a given value a boolean?
	  function isBoolean(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  }

	  // Is a given value equal to null?
	  function isNull(obj) {
	    return obj === null;
	  }

	  // Is a given variable undefined?
	  function isUndefined(obj) {
	    return obj === void 0;
	  }

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  function has(obj, path) {
	    if (!isArray(path)) {
	      return _has(obj, path);
	    }
	    var length = path.length;
	    for (var i = 0; i < length; i++) {
	      var key = path[i];
	      if (obj == null || !hasOwnProperty.call(obj, key)) {
	        return false;
	      }
	      obj = obj[key];
	    }
	    return !!length;
	  }

	  // Utility Functions
	  // -----------------

	  // Keep the identity function around for default iteratees.
	  function identity(value) {
	    return value;
	  }

	  // Predicate-generating functions. Often useful outside of Underscore.
	  function constant(value) {
	    return function() {
	      return value;
	    };
	  }

	  function noop(){}

	  // Creates a function that, when passed an object, will traverse that object’s
	  // properties down the given `path`, specified as an array of keys or indexes.
	  function property(path) {
	    if (!isArray(path)) {
	      return shallowProperty(path);
	    }
	    return function(obj) {
	      return deepGet(obj, path);
	    };
	  }

	  // Generates a function for a given object that returns a given property.
	  function propertyOf(obj) {
	    if (obj == null) {
	      return function(){};
	    }
	    return function(path) {
	      return !isArray(path) ? obj[path] : deepGet(obj, path);
	    };
	  }

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  function matcher(attrs) {
	    attrs = extendOwn({}, attrs);
	    return function(obj) {
	      return isMatch(obj, attrs);
	    };
	  }

	  // Run a function **n** times.
	  function times(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  }

	  // Return a random integer between min and max (inclusive).
	  function random(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  }

	  // A (possibly faster) way to get the current timestamp as an integer.
	  var now = Date.now || function() {
	    return new Date().getTime();
	  };

	  // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  function createEscaper(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped.
	    var source = '(?:' + keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  }
	  var escape = createEscaper(escapeMap);
	  var unescape = createEscaper(unescapeMap);

	  // Traverses the children of `obj` along `path`. If a child is a function, it
	  // is invoked with its parent as context. Returns the value of the final
	  // child, or `fallback` if any child is undefined.
	  function result(obj, path, fallback) {
	    if (!isArray(path)) path = [path];
	    var length = path.length;
	    if (!length) {
	      return isFunction(fallback) ? fallback.call(obj) : fallback;
	    }
	    for (var i = 0; i < length; i++) {
	      var prop = obj == null ? void 0 : obj[path[i]];
	      if (prop === void 0) {
	        prop = fallback;
	        i = length; // Ensure we don't continue iterating.
	      }
	      obj = isFunction(prop) ? prop.call(obj) : prop;
	    }
	    return obj;
	  }

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  function uniqueId(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  }

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  var templateSettings = _.templateSettings = {
	    evaluate: /<%([\s\S]+?)%>/g,
	    interpolate: /<%=([\s\S]+?)%>/g,
	    escape: /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'": "'",
	    '\\': '\\',
	    '\r': 'r',
	    '\n': 'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  function template(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offset.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    var render;
	    try {
	      render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  }

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  function chain(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  }

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  function chainResult(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  }

	  // Add your own custom functions to the Underscore object.
	  function mixin(obj) {
	    each(functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return chainResult(this, func.apply(_, args));
	      };
	    });
	    return _;
	  }

	  // Add all mutator Array functions to the wrapper.
	  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return chainResult(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return chainResult(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return String(this._wrapped);
	  };

	  var allExports = ({
	    'default': _,
	    VERSION: VERSION,
	    iteratee: iteratee,
	    restArguments: restArguments,
	    each: each,
	    forEach: each,
	    map: map,
	    collect: map,
	    reduce: reduce,
	    foldl: reduce,
	    inject: reduce,
	    reduceRight: reduceRight,
	    foldr: reduceRight,
	    find: find,
	    detect: find,
	    filter: filter,
	    select: filter,
	    reject: reject,
	    every: every,
	    all: every,
	    some: some,
	    any: some,
	    contains: contains,
	    includes: contains,
	    include: contains,
	    invoke: invoke,
	    pluck: pluck,
	    where: where,
	    findWhere: findWhere,
	    max: max,
	    min: min,
	    shuffle: shuffle,
	    sample: sample,
	    sortBy: sortBy,
	    groupBy: groupBy,
	    indexBy: indexBy,
	    countBy: countBy,
	    toArray: toArray,
	    size: size,
	    partition: partition,
	    first: first,
	    head: first,
	    take: first,
	    initial: initial,
	    last: last,
	    rest: rest,
	    tail: rest,
	    drop: rest,
	    compact: compact,
	    flatten: flatten,
	    without: without,
	    uniq: uniq,
	    unique: uniq,
	    union: union,
	    intersection: intersection,
	    difference: difference,
	    unzip: unzip,
	    zip: zip,
	    object: object,
	    findIndex: findIndex,
	    findLastIndex: findLastIndex,
	    sortedIndex: sortedIndex,
	    indexOf: indexOf,
	    lastIndexOf: lastIndexOf,
	    range: range,
	    chunk: chunk,
	    bind: bind,
	    partial: partial,
	    bindAll: bindAll,
	    memoize: memoize,
	    delay: delay,
	    defer: defer,
	    throttle: throttle,
	    debounce: debounce,
	    wrap: wrap,
	    negate: negate,
	    compose: compose,
	    after: after,
	    before: before,
	    once: once,
	    keys: keys,
	    allKeys: allKeys,
	    values: values,
	    mapObject: mapObject,
	    pairs: pairs,
	    invert: invert,
	    functions: functions,
	    methods: functions,
	    extend: extend,
	    extendOwn: extendOwn,
	    assign: extendOwn,
	    findKey: findKey,
	    pick: pick,
	    omit: omit,
	    defaults: defaults,
	    create: create,
	    clone: clone,
	    tap: tap,
	    isMatch: isMatch,
	    isEqual: isEqual,
	    isEmpty: isEmpty,
	    isElement: isElement,
	    isArray: isArray,
	    isObject: isObject,
	    isArguments: isArguments,
	    isFunction: isFunction,
	    isString: isString,
	    isNumber: isNumber,
	    isDate: isDate,
	    isRegExp: isRegExp,
	    isError: isError,
	    isSymbol: isSymbol,
	    isMap: isMap,
	    isWeakMap: isWeakMap,
	    isSet: isSet,
	    isWeakSet: isWeakSet,
	    isFinite: isFinite,
	    isNaN: isNaN,
	    isBoolean: isBoolean,
	    isNull: isNull,
	    isUndefined: isUndefined,
	    has: has,
	    identity: identity,
	    constant: constant,
	    noop: noop,
	    property: property,
	    propertyOf: propertyOf,
	    matcher: matcher,
	    matches: matcher,
	    times: times,
	    random: random,
	    now: now,
	    escape: escape,
	    unescape: unescape,
	    result: result,
	    uniqueId: uniqueId,
	    templateSettings: templateSettings,
	    template: template,
	    chain: chain,
	    mixin: mixin
	  });

	  // Add all of the Underscore functions to the wrapper object.
	  var _$1 = mixin(allExports);
	  // Legacy Node.js API
	  _$1._ = _$1;

	  return _$1;

	})));
	//# sourceMappingURL=underscore.js.map

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * jBone v1.2.1 - 2017-09-19 - Library for DOM manipulation
	 *
	 * http://jbone.js.org
	 *
	 * Copyright 2017 Alexey Kupriyanenko
	 * Released under the MIT license.
	 */

	(function (win) {

	var
	// cache previous versions
	_$ = win.$,
	_jBone = win.jBone,

	// Quick match a standalone tag
	rquickSingleTag = /^<(\w+)\s*\/?>$/,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Alias for function
	slice = [].slice,
	splice = [].splice,
	keys = Object.keys,

	// Alias for global variables
	doc = win.document,

	isString = function(el) {
	    return typeof el === "string";
	},
	isObject = function(el) {
	    return el instanceof Object;
	},
	isFunction = function(el) {
	    return ({}).toString.call(el) === "[object Function]";
	},
	isArray = function(el) {
	    return Array.isArray(el);
	},
	jBone = function(element, data) {
	    return new fn.init(element, data);
	},
	fn;

	// set previous values and return the instance upon calling the no-conflict mode
	jBone.noConflict = function() {
	    win.$ = _$;
	    win.jBone = _jBone;

	    return jBone;
	};

	fn = jBone.fn = jBone.prototype = {
	    init: function(element, data) {
	        var elements, tag, wraper, fragment;

	        if (!element) {
	            return this;
	        }
	        if (isString(element)) {
	            // Create single DOM element
	            if (tag = rquickSingleTag.exec(element)) {
	                this[0] = doc.createElement(tag[1]);
	                this.length = 1;

	                if (isObject(data)) {
	                    this.attr(data);
	                }

	                return this;
	            }
	            // Create DOM collection
	            if ((tag = rquickExpr.exec(element)) && tag[1]) {
	                fragment = doc.createDocumentFragment();
	                wraper = doc.createElement("div");
	                wraper.innerHTML = element;
	                while (wraper.lastChild) {
	                    fragment.appendChild(wraper.firstChild);
	                }
	                elements = slice.call(fragment.childNodes);

	                return jBone.merge(this, elements);
	            }
	            // Find DOM elements with querySelectorAll
	            if (jBone.isElement(data)) {
	                return jBone(data).find(element);
	            }

	            try {
	                elements = doc.querySelectorAll(element);

	                return jBone.merge(this, elements);
	            } catch (e) {
	                return this;
	            }
	        }
	        // Wrap DOMElement
	        if (element.nodeType) {
	            this[0] = element;
	            this.length = 1;

	            return this;
	        }
	        // Run function
	        if (isFunction(element)) {
	            return element();
	        }
	        // Return jBone element as is
	        if (element instanceof jBone) {
	            return element;
	        }

	        // Return element wrapped by jBone
	        return jBone.makeArray(element, this);
	    },

	    pop: [].pop,
	    push: [].push,
	    reverse: [].reverse,
	    shift: [].shift,
	    sort: [].sort,
	    splice: [].splice,
	    slice: [].slice,
	    indexOf: [].indexOf,
	    forEach: [].forEach,
	    unshift: [].unshift,
	    concat: [].concat,
	    join: [].join,
	    every: [].every,
	    some: [].some,
	    filter: [].filter,
	    map: [].map,
	    reduce: [].reduce,
	    reduceRight: [].reduceRight,
	    length: 0
	};

	fn.constructor = jBone;

	fn.init.prototype = fn;

	jBone.setId = function(el) {
	    var jid = el.jid;

	    if (el === win) {
	        jid = "window";
	    } else if (el.jid === undefined) {
	        el.jid = jid = ++jBone._cache.jid;
	    }

	    if (!jBone._cache.events[jid]) {
	        jBone._cache.events[jid] = {};
	    }
	};

	jBone.getData = function(el) {
	    el = el instanceof jBone ? el[0] : el;

	    var jid = el === win ? "window" : el.jid;

	    return {
	        jid: jid,
	        events: jBone._cache.events[jid]
	    };
	};

	jBone.isElement = function(el) {
	    return el && el instanceof jBone || el instanceof HTMLElement || isString(el);
	};

	jBone._cache = {
	    events: {},
	    jid: 0
	};

	function isArraylike(obj) {
	    var length = obj.length,
	        type = typeof obj;

	    if (isFunction(type) || obj === win) {
	        return false;
	    }

	    if (obj.nodeType === 1 && length) {
	        return true;
	    }

	    return isArray(type) || length === 0 ||
	        typeof length === "number" && length > 0 && (length - 1) in obj;
	}

	fn.pushStack = function(elems) {
	    var ret = jBone.merge(this.constructor(), elems);

	    return ret;
	};

	jBone.merge = function(first, second) {
	    var l = second.length,
	        i = first.length,
	        j = 0;

	    while (j < l) {
	        first[i++] = second[j++];
	    }

	    first.length = i;

	    return first;
	};

	jBone.contains = function(container, contained) {
	    return container.contains(contained);
	};

	jBone.extend = function(target) {
	    var tg;

	    splice.call(arguments, 1).forEach(function(source) {
	        tg = target; //caching target for perf improvement

	        if (source) {
	            for (var prop in source) {
	                tg[prop] = source[prop];
	            }
	        }
	    });

	    return target;
	};

	jBone.makeArray = function(arr, results) {
	    var ret = results || [];

	    if (arr !== null) {
	        if (isArraylike(arr)) {
	            jBone.merge(ret, isString(arr) ? [arr] : arr);
	        } else {
	            ret.push(arr);
	        }
	    }

	    return ret;
	};

	jBone.unique = function(array) {
	    if (array == null) {
	        return [];
	    }

	    var result = [];

	    for (var i = 0, length = array.length; i < length; i++) {
	        var value = array[i];
	        if (result.indexOf(value) < 0) {
	            result.push(value);
	        }
	    }
	    return result;
	};

	function BoneEvent(e, data) {
	    var key, setter;

	    this.originalEvent = e;

	    setter = function(key, e) {
	        if (key === "preventDefault") {
	            this[key] = function() {
	                this.defaultPrevented = true;
	                return e[key]();
	            };
	        } else if (key === "stopImmediatePropagation") {
	            this[key] = function() {
	                this.immediatePropagationStopped = true;
	                return e[key]();
	            };
	        } else if (isFunction(e[key])) {
	            this[key] = function() {
	                return e[key]();
	            };
	        } else {
	            this[key] = e[key];
	        }
	    };

	    for (key in e) {
	        if (e[key] || typeof e[key] === "function") {
	            setter.call(this, key, e);
	        }
	    }

	    jBone.extend(this, data, {
	        isImmediatePropagationStopped: function() {
	            return !!this.immediatePropagationStopped;
	        }
	    });
	}

	jBone.Event = function(event, data) {
	    var namespace, eventType;

	    if (event.type && !data) {
	        data = event;
	        event = event.type;
	    }

	    namespace = event.split(".").splice(1).join(".");
	    eventType = event.split(".")[0];

	    event = doc.createEvent("Event");
	    event.initEvent(eventType, true, true);

	    return jBone.extend(event, {
	        namespace: namespace,
	        isDefaultPrevented: function() {
	            return event.defaultPrevented;
	        }
	    }, data);
	};

	jBone.event = {

	    /**
	     * Attach a handler to an event for the elements
	     * @param {Node}        el         - Events will be attached to this DOM Node
	     * @param {String}      types      - One or more space-separated event types and optional namespaces
	     * @param {Function}    handler    - A function to execute when the event is triggered
	     * @param {Object}      [data]     - Data to be passed to the handler in event.data
	     * @param {String}      [selector] - A selector string to filter the descendants of the selected elements
	     */
	    add: function(el, types, handler, data, selector) {
	        jBone.setId(el);

	        var eventHandler = function(e) {
	                jBone.event.dispatch.call(el, e);
	            },
	            events = jBone.getData(el).events,
	            eventType, t, event;

	        types = types.split(" ");
	        t = types.length;
	        while (t--) {
	            event = types[t];

	            eventType = event.split(".")[0];
	            events[eventType] = events[eventType] || [];

	            if (events[eventType].length) {
	                // override with previous event handler
	                eventHandler = events[eventType][0].fn;
	            } else {
	                el.addEventListener && el.addEventListener(eventType, eventHandler, false);
	            }

	            events[eventType].push({
	                namespace: event.split(".").splice(1).join("."),
	                fn: eventHandler,
	                selector: selector,
	                data: data,
	                originfn: handler
	            });
	        }
	    },

	    /**
	     * Remove an event handler
	     * @param  {Node}       el        - Events will be deattached from this DOM Node
	     * @param  {String}     types     - One or more space-separated event types and optional namespaces
	     * @param  {Function}   handler   - A handler function previously attached for the event(s)
	     * @param  {String}     [selector] - A selector string to filter the descendants of the selected elements
	     */
	    remove: function(el, types, handler, selector) {
	        var removeListener = function(events, eventType, index, el, e) {
	                var callback;

	                // get callback
	                if ((handler && e.originfn === handler) || !handler) {
	                    callback = e.fn;
	                }

	                if (events[eventType][index].fn === callback) {
	                    // remove handler from cache
	                    events[eventType].splice(index, 1);

	                    if (!events[eventType].length) {
	                        el.removeEventListener(eventType, callback);
	                    }
	                }
	            },
	            events = jBone.getData(el).events,
	            l,
	            eventsByType;

	        if (!events) {
	            return;
	        }

	        // remove all events
	        if (!types && events) {
	            return keys(events).forEach(function(eventType) {
	                eventsByType = events[eventType];
	                l = eventsByType.length;

	                while(l--) {
	                    removeListener(events, eventType, l, el, eventsByType[l]);
	                }
	            });
	        }

	        types.split(" ").forEach(function(eventName) {
	            var eventType = eventName.split(".")[0],
	                namespace = eventName.split(".").splice(1).join("."),
	                e;

	            // remove named events
	            if (events[eventType]) {
	                eventsByType = events[eventType];
	                l = eventsByType.length;

	                while(l--) {
	                    e = eventsByType[l];
	                    if ((!namespace || (namespace && e.namespace === namespace)) &&
	                        (!selector  || (selector  && e.selector === selector))) {
	                        removeListener(events, eventType, l, el, e);
	                    }
	                }
	            }
	            // remove all namespaced events
	            else if (namespace) {
	                keys(events).forEach(function(eventType) {
	                    eventsByType = events[eventType];
	                    l = eventsByType.length;

	                    while(l--) {
	                        e = eventsByType[l];
	                        if (e.namespace.split(".")[0] === namespace.split(".")[0]) {
	                            removeListener(events, eventType, l, el, e);
	                        }
	                    }
	                });
	            }
	        });
	    },

	    /**
	     * Execute all handlers and behaviors attached to the matched elements for the given event type.
	     * @param  {Node}       el       - Events will be triggered for thie DOM Node
	     * @param  {String}     event    - One or more space-separated event types and optional namespaces
	     */
	    trigger: function(el, event) {
	        var events = [];

	        if (isString(event)) {
	            events = event.split(" ").map(function(event) {
	                return jBone.Event(event);
	            });
	        } else {
	            event = event instanceof Event ? event : jBone.Event(event);
	            events = [event];
	        }

	        events.forEach(function(event) {
	            if (!event.type) {
	                return;
	            }

	            el.dispatchEvent && el.dispatchEvent(event);
	        });
	    },

	    dispatch: function(e) {
	        var i = 0,
	            j = 0,
	            el = this,
	            handlers = jBone.getData(el).events[e.type],
	            length = handlers.length,
	            handlerQueue = [],
	            targets = [],
	            l,
	            expectedTarget,
	            handler,
	            event,
	            eventOptions;

	        // cache all events handlers, fix issue with multiple handlers (issue #45)
	        for (; i < length; i++) {
	            handlerQueue.push(handlers[i]);
	        }

	        i = 0;
	        length = handlerQueue.length;

	        for (;
	            // if event exists
	            i < length &&
	            // if handler is not removed from stack
	            ~handlers.indexOf(handlerQueue[i]) &&
	            // if propagation is not stopped
	            !(event && event.isImmediatePropagationStopped());
	        i++) {
	            expectedTarget = null;
	            eventOptions = {};
	            handler = handlerQueue[i];
	            handler.data && (eventOptions.data = handler.data);

	            // event handler without selector
	            if (!handler.selector) {
	                event = new BoneEvent(e, eventOptions);

	                if (!(e.namespace && e.namespace !== handler.namespace)) {
	                    handler.originfn.call(el, event);
	                }
	            }
	            // event handler with selector
	            else if (
	                // if target and selected element the same
	                ~(targets = jBone(el).find(handler.selector)).indexOf(e.target) && (expectedTarget = e.target) ||
	                // if one of element matched with selector contains target
	                (el !== e.target && el.contains(e.target))
	            ) {
	                // get element matched with selector
	                if (!expectedTarget) {
	                    l = targets.length;
	                    j = 0;

	                    for (; j < l; j++) {
	                        if (targets[j] && targets[j].contains(e.target)) {
	                            expectedTarget = targets[j];
	                        }
	                    }
	                }

	                if (!expectedTarget) {
	                    continue;
	                }

	                eventOptions.currentTarget = expectedTarget;
	                event = new BoneEvent(e, eventOptions);

	                if (!(e.namespace && e.namespace !== handler.namespace)) {
	                    handler.originfn.call(expectedTarget, event);
	                }
	            }
	        }
	    }
	};

	fn.on = function(types, selector, data, fn) {
	    var length = this.length,
	        i = 0;

	    if (data == null && fn == null) {
	        // (types, fn)
	        fn = selector;
	        data = selector = undefined;
	    } else if (fn == null) {
	        if (typeof selector === "string") {
	            // (types, selector, fn)
	            fn = data;
	            data = undefined;
	        } else {
	            // (types, data, fn)
	            fn = data;
	            data = selector;
	            selector = undefined;
	        }
	    }

	    if (!fn) {
	        return this;
	    }

	    for (; i < length; i++) {
	        jBone.event.add(this[i], types, fn, data, selector);
	    }

	    return this;
	};

	fn.one = function(event) {
	    var args = arguments,
	        i = 0,
	        length = this.length,
	        oneArgs = slice.call(args, 1, args.length - 1),
	        callback = slice.call(args, -1)[0],
	        addListener;

	    addListener = function(el) {
	        var $el = jBone(el);

	        event.split(" ").forEach(function(event) {
	            var fn = function(e) {
	                $el.off(event, fn);
	                callback.call(el, e);
	            };

	            $el.on.apply($el, [event].concat(oneArgs, fn));
	        });
	    };

	    for (; i < length; i++) {
	        addListener(this[i]);
	    }

	    return this;
	};

	fn.trigger = function(event) {
	    var i = 0,
	        length = this.length;

	    if (!event) {
	        return this;
	    }

	    for (; i < length; i++) {
	        jBone.event.trigger(this[i], event);
	    }

	    return this;
	};

	fn.off = function(types, selector, handler) {
	    var i = 0,
	        length = this.length;

	    if (isFunction(selector)) {
	        handler = selector;
	        selector = undefined;
	    }

	    for (; i < length; i++) {
	        jBone.event.remove(this[i], types, handler, selector);
	    }

	    return this;
	};

	fn.find = function(selector) {
	    var results = [],
	        i = 0,
	        length = this.length,
	        finder = function(el) {
	            if (isFunction(el.querySelectorAll)) {
	                [].forEach.call(el.querySelectorAll(selector), function(found) {
	                    results.push(found);
	                });
	            }
	        };

	    for (; i < length; i++) {
	        finder(this[i]);
	    }

	    return jBone(results);
	};

	fn.get = function(index) {
	    return index != null ?

	        // Return just one element from the set
	        (index < 0 ? this[index + this.length] : this[index]) :

	        // Return all the elements in a clean array
	        slice.call(this);
	};

	fn.eq = function(index) {
	    return jBone(this[index]);
	};

	fn.parent = function() {
	    var results = [],
	        parent,
	        i = 0,
	        length = this.length;

	    for (; i < length; i++) {
	        if (!~results.indexOf(parent = this[i].parentElement) && parent) {
	            results.push(parent);
	        }
	    }

	    return jBone(results);
	};

	fn.toArray = function() {
	    return slice.call(this);
	};

	fn.is = function() {
	    var args = arguments;

	    return this.some(function(el) {
	        return el.tagName.toLowerCase() === args[0];
	    });
	};

	fn.has = function() {
	    var args = arguments;

	    return this.some(function(el) {
	        return el.querySelectorAll(args[0]).length;
	    });
	};

	fn.add = function(selector, context) {
	    return this.pushStack(
	        jBone.unique(
	            jBone.merge(this.get(), jBone(selector, context))
	        )
	    );
	};

	fn.attr = function(key, value) {
	    var args = arguments,
	        i = 0,
	        length = this.length,
	        setter;

	    if (isString(key) && args.length === 1) {
	        return this[0] && this[0].getAttribute(key);
	    }

	    if (args.length === 2) {
	        setter = function(el) {
	            el.setAttribute(key, value);
	        };
	    } else if (isObject(key)) {
	        setter = function(el) {
	            keys(key).forEach(function(name) {
	                el.setAttribute(name, key[name]);
	            });
	        };
	    }

	    for (; i < length; i++) {
	        setter(this[i]);
	    }

	    return this;
	};

	fn.removeAttr = function(key) {
	    var i = 0,
	        length = this.length;

	    for (; i < length; i++) {
	        this[i].removeAttribute(key);
	    }

	    return this;
	};

	fn.val = function(value) {
	    var i = 0,
	        length = this.length;

	    if (arguments.length === 0) {
	        return this[0] && this[0].value;
	    }

	    for (; i < length; i++) {
	        this[i].value = value;
	    }

	    return this;
	};

	fn.css = function(key, value) {
	    var args = arguments,
	        i = 0,
	        length = this.length,
	        setter;

	    // Get attribute
	    if (isString(key) && args.length === 1) {
	        return this[0] && win.getComputedStyle(this[0])[key];
	    }

	    // Set attributes
	    if (args.length === 2) {
	        setter = function(el) {
	            el.style[key] = value;
	        };
	    } else if (isObject(key)) {
	        setter = function(el) {
	            keys(key).forEach(function(name) {
	                el.style[name] = key[name];
	            });
	        };
	    }

	    for (; i < length; i++) {
	        setter(this[i]);
	    }

	    return this;
	};

	fn.data = function(key, value) {
	    var args = arguments, data = {},
	        i = 0,
	        length = this.length,
	        setter,
	        setValue = function(el, key, value) {
	            if (isObject(value)) {
	                el.jdata = el.jdata || {};
	                el.jdata[key] = value;
	            } else {
	                el.dataset[key] = value;
	            }
	        },
	        getValue = function(value) {
	            if (value === "true") {
	                return true;
	            } else if (value === "false") {
	                return false;
	            } else {
	                return value;
	            }
	        };

	    // Get all data
	    if (args.length === 0) {
	        this[0].jdata && (data = this[0].jdata);

	        keys(this[0].dataset).forEach(function(key) {
	            data[key] = getValue(this[0].dataset[key]);
	        }, this);

	        return data;
	    }
	    // Get data by name
	    if (args.length === 1 && isString(key)) {
	        return this[0] && getValue(this[0].dataset[key] || this[0].jdata && this[0].jdata[key]);
	    }

	    // Set data
	    if (args.length === 1 && isObject(key)) {
	        setter = function(el) {
	            keys(key).forEach(function(name) {
	                setValue(el, name, key[name]);
	            });
	        };
	    } else if (args.length === 2) {
	        setter = function(el) {
	            setValue(el, key, value);
	        };
	    }

	    for (; i < length; i++) {
	        setter(this[i]);
	    }

	    return this;
	};

	fn.removeData = function(key) {
	    var i = 0,
	        length = this.length,
	        jdata, dataset;

	    for (; i < length; i++) {
	        jdata = this[i].jdata;
	        dataset = this[i].dataset;

	        if (key) {
	            jdata && jdata[key] && delete jdata[key];
	            delete dataset[key];
	        } else {
	            for (key in jdata) {
	                delete jdata[key];
	            }

	            for (key in dataset) {
	                delete dataset[key];
	            }
	        }
	    }

	    return this;
	};

	fn.addClass = function(className) {
	    var i = 0,
	        j = 0,
	        length = this.length,
	        classes = className ? className.trim().split(/\s+/) : [];

	    for (; i < length; i++) {
	        j = 0;

	        for (j = 0; j < classes.length; j++) {
	            this[i].classList.add(classes[j]);
	        }
	    }

	    return this;
	};

	fn.removeClass = function(className) {
	    var i = 0,
	        j = 0,
	        length = this.length,
	        classes = className ? className.trim().split(/\s+/) : [];

	    for (; i < length; i++) {
	        j = 0;

	        for (j = 0; j < classes.length; j++) {
	            this[i].classList.remove(classes[j]);
	        }
	    }

	    return this;
	};

	fn.toggleClass = function(className, force) {
	    var i = 0,
	        length = this.length,
	        method = "toggle";

	    force === true && (method = "add") || force === false && (method = "remove");

	    if (className) {
	        for (; i < length; i++) {
	            this[i].classList[method](className);
	        }
	    }

	    return this;
	};

	fn.hasClass = function(className) {
	    var i = 0, length = this.length;

	    if (className) {
	        for (; i < length; i++) {
	            if (this[i].classList.contains(className)) {
	                return true;
	            }
	        }
	    }

	    return false;
	};

	fn.html = function(value) {
	    var args = arguments,
	        el;

	    // add HTML into elements
	    if (args.length === 1 && value !== undefined) {
	        return this.empty().append(value);
	    }
	    // get HTML from element
	    else if (args.length === 0 && (el = this[0])) {
	        return el.innerHTML;
	    }

	    return this;
	};

	fn.append = function(appended) {
	    var i = 0,
	        length = this.length,
	        setter;

	    // create jBone object and then append
	    if (isString(appended) && rquickExpr.exec(appended)) {
	        appended = jBone(appended);
	    }
	    // create text node for insertion
	    else if (!isObject(appended)) {
	        appended = document.createTextNode(appended);
	    }

	    appended = appended instanceof jBone ? appended : jBone(appended);

	    setter = function(el, i) {
	        appended.forEach(function(node) {
	            if (i) {
	                el.appendChild(node.cloneNode(true));
	            } else {
	                el.appendChild(node);
	            }
	        });
	    };

	    for (; i < length; i++) {
	        setter(this[i], i);
	    }

	    return this;
	};

	fn.appendTo = function(to) {
	    jBone(to).append(this);

	    return this;
	};

	fn.empty = function() {
	    var i = 0,
	        length = this.length,
	        el;

	    for (; i < length; i++) {
	        el = this[i];

	        while (el.lastChild) {
	            el.removeChild(el.lastChild);
	        }
	    }

	    return this;
	};

	fn.remove = function() {
	    var i = 0,
	        length = this.length,
	        el;

	    // remove all listeners
	    this.off();

	    for (; i < length; i++) {
	        el = this[i];

	        // remove data and nodes
	        delete el.jdata;
	        el.parentNode && el.parentNode.removeChild(el);
	    }

	    return this;
	};

	if (typeof module === "object" && module && typeof module.exports === "object") {
	    // Expose jBone as module.exports in loaders that implement the Node
	    // module pattern (including browserify). Do not create the global, since
	    // the user will be storing it themselves locally, and globals are frowned
	    // upon in the Node module world.
	    module.exports = jBone;
	}
	// Register as a AMD module
	else if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return jBone;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	    win.jBone = win.$ = jBone;
	} else if (typeof win === "object" && typeof win.document === "object") {
	    win.jBone = win.$ = jBone;
	}

	}(typeof window !== "undefined" ? window : this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  'use strict';

	  var inNodeJS = typeof process !== 'undefined' && !process.browser;

	  var request = function requestNotProvided() {
	    throw new Error("The 'request' module is only available while running in Node.");
	  };
	  if(inNodeJS) { // This will get stripped out by Uglify, and Webpack will not include it
	    var axios = __webpack_require__(7);
	  }

	  var supportsCORS = false;
	  var inLegacyIE = false;
	  try {
	    var testXHR = new XMLHttpRequest();
	    if (typeof testXHR.withCredentials !== 'undefined') {
	      supportsCORS = true;
	    } else {
	      if ('XDomainRequest' in window) {
	        supportsCORS = true;
	        inLegacyIE = true;
	      }
	    }
	  } catch (e) { }

	  // Create a simple indexOf function for support
	  // of older browsers.  Uses native indexOf if
	  // available.  Code similar to underscores.
	  // By making a separate function, instead of adding
	  // to the prototype, we will not break bad for loops
	  // in older browsers
	  var indexOfProto = Array.prototype.indexOf;
	  var ttIndexOf = function(array, item) {
	    var i = 0, l = array.length;

	    if (indexOfProto && array.indexOf === indexOfProto) {
	      return array.indexOf(item);
	    }

	    for (; i < l; i++) {
	      if (array[i] === item) {
	        return i;
	      }
	    }
	    return -1;
	  };

	  /*
	    Initialize with Tabletop.init( { key: '0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc' } )
	      OR!
	    Initialize with Tabletop.init( { key: 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc&output=html&widget=true' } )
	      OR!
	    Initialize with Tabletop.init('0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc')
	  */

	  var Tabletop = function(options) {
	    // Make sure Tabletop is being used as a constructor no matter what.
	    if(!this || !(this instanceof Tabletop)) {
	      return new Tabletop(options);
	    }

	    if(typeof(options) === 'string') {
	      options = { key : options };
	    }

	    this.callback = options.callback;
	    this.error = options.error;
	    this.wanted = options.wanted || [];
	    this.key = options.key;
	    this.simpleSheet = !!options.simpleSheet;
	    this.parseNumbers = !!options.parseNumbers;
	    this.wait = !!options.wait;
	    this.reverse = !!options.reverse;
	    this.postProcess = options.postProcess;
	    this.debug = !!options.debug;
	    this.query = options.query || '';
	    this.orderby = options.orderby;
	    this.endpoint = options.endpoint || 'https://spreadsheets.google.com';
	    this.singleton = !!options.singleton;
	    this.simpleUrl = !!(options.simpleUrl || options.simple_url); //jshint ignore:line
	    this.authkey = options.authkey;
	    this.sheetPrivacy = this.authkey ? 'private' : 'public';

	    this.callbackContext = options.callbackContext;
	    // Default to on, unless there's a proxy, in which case it's default off
	    this.prettyColumnNames = typeof(options.prettyColumnNames) === 'undefined' ? !options.proxy : options.prettyColumnNames;

	    if(typeof(options.proxy) !== 'undefined') {
	      // Remove trailing slash, it will break the app
	      this.endpoint = options.proxy.replace(/\/$/,'');
	      this.simpleUrl = true;
	      this.singleton = true;
	      // Let's only use CORS (straight JSON request) when
	      // fetching straight from Google
	      supportsCORS = false;
	    }

	    this.parameterize = options.parameterize || false;

	    if (this.singleton) {
	      if (typeof(Tabletop.singleton) !== 'undefined') {
	        this.log('WARNING! Tabletop singleton already defined');
	      }
	      Tabletop.singleton = this;
	    }

	    /* Be friendly about what you accept */
	    if (/key=/.test(this.key)) {
	      this.log('You passed an old Google Docs url as the key! Attempting to parse.');
	      this.key = this.key.match('key=(.*?)(&|#|$)')[1];
	    }

	    if (/pubhtml/.test(this.key)) {
	      this.log('You passed a new Google Spreadsheets url as the key! Attempting to parse.');
	      this.key = this.key.match('d\\/(.*?)\\/pubhtml')[1];
	    }

	    if(/spreadsheets\/d/.test(this.key)) {
	      this.log('You passed the most recent version of Google Spreadsheets url as the key! Attempting to parse.');
	      this.key = this.key.match('d\\/(.*?)\/')[1];
	    }

	    if (!this.key) {
	      this.log('You need to pass Tabletop a key!');
	      return;
	    }

	    this.log('Initializing with key ' + this.key);

	    this.models = {};
	    this.modelNames = [];
	    this.model_names = this.modelNames; //jshint ignore:line

	    this.baseJsonPath = '/feeds/worksheets/' + this.key + '/' + this.sheetPrivacy +'/basic?alt=';

	    if (inNodeJS || supportsCORS) {
	      this.baseJsonPath += 'json';
	    } else {
	      this.baseJsonPath += 'json-in-script';
	    }

	    if (this.authkey) {
	      this.baseJsonPath += '&oauth_token=' + this.authkey;
	    }
	  
	    if(!this.wait) {
	      return this.fetch();
	    }
	  };

	  // A global storage for callbacks.
	  Tabletop.callbacks = {};

	  // Backwards compatibility.
	  Tabletop.init = function(options) {
	    return new Tabletop(options);
	  };

	  Tabletop.sheets = function() {
	    this.log('Times have changed! You\'ll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)');
	  };

	  Tabletop.prototype = {

	    fetch: function(callback) {
	      var self = this;
	      return new Promise(function(resolve, reject) {
	        if (typeof(callback) !== 'undefined') {
	          self.callback = callback;
	        }
	        if (!self.callback) {
	          self.callback = resolve;
	        }
	        if (!self.error) {
	          self.error = reject;
	        }
	        self.requestData(self.baseJsonPath, self.loadSheets);
	      });
	    },

	    /*
	      This will call the environment appropriate request method.

	      In browser it will use JSON-P, in node it will use axios.get()
	    */
	    requestData: function(path, callback) {
	      this.log('Requesting', path);
	      this.encounteredError = false;
	      if (inNodeJS) {
	        this.serverSideFetch(path, callback);
	      } else {
	        //CORS only works in IE8/9 across the same protocol
	        //You must have your server on HTTPS to talk to Google, or it'll fall back on injection
	        var protocol = this.endpoint.split('//').shift() || 'http';
	        if (supportsCORS && (!inLegacyIE || protocol === location.protocol)) {
	          this.xhrFetch(path, callback);
	        } else {
	          this.injectScript(path, callback);
	        }
	      }
	    },

	    /*
	      Use Cross-Origin XMLHttpRequest to get the data in browsers that support it.
	    */
	    xhrFetch: function(path, callback) {
	      //support IE8's separate cross-domain object
	      var xhr = inLegacyIE ? new XDomainRequest() : new XMLHttpRequest();
	      xhr.open('GET', this.endpoint + path);
	      var self = this;
	      xhr.onload = function() {
	        var json;
	        try {
	          json = JSON.parse(xhr.responseText);
	        } catch (e) {
	          console.error(e);
	        }
	        callback.call(self, json);
	      };
	      if(this.error) {
	        xhr.addEventListener('error', this.error);
	      }
	      xhr.send();
	    },

	    /*
	      Insert the URL into the page as a script tag. Once it's loaded the spreadsheet data
	      it triggers the callback. This helps you avoid cross-domain errors
	      http://code.google.com/apis/gdata/samples/spreadsheet_sample.html

	      Let's be plain-Jane and not use jQuery or anything.
	    */
	    injectScript: function(path, callback) {
	      var script = document.createElement('script');
	      var callbackName;

	      if (this.singleton) {
	        if (callback === this.loadSheets) {
	          callbackName = 'Tabletop.singleton.loadSheets';
	        } else if (callback === this.loadSheet) {
	          callbackName = 'Tabletop.singleton.loadSheet';
	        }
	      } else {
	        var self = this;
	        callbackName = 'tt' + (+new Date()) + (Math.floor(Math.random()*100000));
	        // Create a temp callback which will get removed once it has executed,
	        // this allows multiple instances of Tabletop to coexist.
	        Tabletop.callbacks[ callbackName ] = function () {
	          var args = Array.prototype.slice.call( arguments, 0 );
	          callback.apply(self, args);
	          script.parentNode.removeChild(script);
	          delete Tabletop.callbacks[callbackName];
	        };
	        callbackName = 'Tabletop.callbacks.' + callbackName;
	      }

	      var url = path + '&callback=' + callbackName;

	      if (this.simpleUrl) {
	        // We've gone down a rabbit hole of passing injectScript the path, so let's
	        // just pull the sheet_id out of the path like the least efficient worker bees
	        if(path.indexOf('/list/') !== -1) {
	          script.src = this.endpoint + '/' + this.key + '-' + path.split('/')[4];
	        } else {
	          script.src = this.endpoint + '/' + this.key;
	        }
	      } else {
	        script.src = this.endpoint + url;
	      }

	      if (this.parameterize) {
	        script.src = this.parameterize + encodeURIComponent(script.src);
	      }

	      this.log('Injecting', script.src);

	      document.getElementsByTagName('script')[0].parentNode.appendChild(script);
	    },

	    /*
	      This will only run if tabletop is being run in node.js
	    */
	    serverSideFetch: function(path, callback) {
	      var self = this;

	      axios.get(this.endpoint + path)
	        .then(function(response) {
	          callback.call(self, response.data);
	        })
	        .catch(function(err) {
	          if (err) {
	            return console.error(err);
	          }
	        });
	    },

	    /*
	      Is this a sheet you want to pull?
	      If { wanted: ["Sheet1"] } has been specified, only Sheet1 is imported
	      Pulls all sheets if none are specified
	    */
	    isWanted: function(sheetName) {
	      if (this.wanted.length === 0) {
	        return true;
	      } else {
	        return (ttIndexOf(this.wanted, sheetName) !== -1);
	      }
	    },

	    /*
	      What gets send to the callback
	      if simpleSheet === true, then don't return an array of Tabletop.this.models,
	      only return the first one's elements
	    */
	    data: function() {
	      // If the instance is being queried before the data's been fetched
	      // then return undefined.
	      if (this.modelNames.length === 0) {
	        return undefined;
	      }
	      if (this.simpleSheet) {
	        if (this.modelNames.length > 1 && this.debug) {
	          this.log('WARNING You have more than one sheet but are using simple sheet mode! Don\'t blame me when something goes wrong.');
	        }
	        return this.models[this.modelNames[0]].all();
	      } else {
	        return this.models;
	      }
	    },

	    /*
	      Add another sheet to the wanted list
	    */
	    addWanted: function(sheet) {
	      if(ttIndexOf(this.wanted, sheet) === -1) {
	        this.wanted.push(sheet);
	      }
	    },

	    /*
	      Load all worksheets of the spreadsheet, turning each into a Tabletop Model.
	      Need to use injectScript because the worksheet view that you're working from
	      doesn't actually include the data. The list-based feed (/feeds/list/key..) does, though.
	      Calls back to loadSheet in order to get the real work done.

	      Used as a callback for the worksheet-based JSON
	    */
	    loadSheets: function(data) {
	      var i, ilen;
	      var toLoad = [];
	      try {
	        this.googleSheetName = data.feed.title.$t;
	      } catch(err) {
	        this.error(err);
	        return;
	      }
	      this.foundSheetNames = [];

	      for (i = 0, ilen = data.feed.entry.length; i < ilen ; i++) {
	        this.foundSheetNames.push(data.feed.entry[i].title.$t);
	        // Only pull in desired sheets to reduce loading
	        if (this.isWanted(data.feed.entry[i].content.$t)) {
	          var linkIdx = data.feed.entry[i].link.length-1;
	          var sheetId = data.feed.entry[i].link[linkIdx].href.split('/').pop();
	          var jsonPath = '/feeds/list/' + this.key + '/' + sheetId + '/' + this.sheetPrivacy + '/values?alt=';
	          if (inNodeJS || supportsCORS) {
	            jsonPath += 'json';
	          } else {
	            jsonPath += 'json-in-script';
	          }
	          if (this.query) {
	            // Query Language Reference (0.7)
	            jsonPath += '&tq=' + this.query;
	          }
	          if (this.orderby) {
	            jsonPath += '&orderby=column:' + this.orderby.toLowerCase();
	          }
	          if (this.reverse) {
	            jsonPath += '&reverse=true';
	          }
	          if (this.authkey) {
	            jsonPath += '&oauth_token=' + this.authkey;
	          }
	          toLoad.push(jsonPath);
	        }
	      }

	      this.sheetsToLoad = toLoad.length;
	      for(i = 0, ilen = toLoad.length; i < ilen; i++) {
	        this.requestData(toLoad[i], this.loadSheet);
	      }
	    },

	    /*
	      Access layer for the this.models
	      .sheets() gets you all of the sheets
	      .sheets('Sheet1') gets you the sheet named Sheet1
	    */
	    sheets: function(sheetName) {
	      if (typeof sheetName === 'undefined') {
	        return this.models;
	      } else {
	        if (typeof(this.models[sheetName]) === 'undefined') {
	          // alert( "Can't find " + sheetName );
	          return;
	        } else {
	          return this.models[sheetName];
	        }
	      }
	    },

	    sheetReady: function(model) {
	      this.models[model.name] = model;
	      if (ttIndexOf(this.modelNames, model.name) === -1) {
	        this.modelNames.push(model.name);
	      }

	      this.sheetsToLoad--;
	      if (this.sheetsToLoad === 0) {
	        this.doCallback();
	      }
	    },

	    /*
	      Parse a single list-based worksheet, turning it into a Tabletop Model

	      Used as a callback for the list-based JSON
	    */
	    loadSheet: function(data) {
	      var that = this;
	      new Tabletop.Model({
	        data: data,
	        parseNumbers: this.parseNumbers,
	        postProcess: this.postProcess,
	        tabletop: this,
	        prettyColumnNames: this.prettyColumnNames,
	        onReady: function() {
	          that.sheetReady(this);
	        }
	      });
	    },

	    /*
	      Execute the callback upon loading! Rely on this.data() because you might
	        only request certain pieces of data (i.e. simpleSheet mode)
	      Tests this.sheetsToLoad just in case a race condition happens to show up
	    */
	    doCallback: function() {
	      if(this.sheetsToLoad === 0) {
	        this.callback.apply(this.callbackContext || this, [this.data(), this]);
	      }
	    },

	    log: function() {
	      if(this.debug) {
	        if(typeof console !== 'undefined' && typeof console.log !== 'undefined') {
	          Function.prototype.apply.apply(console.log, [console, arguments]);
	        }
	      }
	    }

	  };

	  /*
	    Tabletop.Model stores the attribute names and parses the worksheet data
	      to turn it into something worthwhile

	    Options should be in the format { data: XXX }, with XXX being the list-based worksheet
	  */
	  Tabletop.Model = function(options) {
	    var i, j, ilen, jlen;
	    this.columnNames = [];
	    this.column_names = this.columnNames; // jshint ignore:line
	    this.name = options.data.feed.title.$t;
	    this.tabletop = options.tabletop;
	    this.elements = [];
	    this.onReady = options.onReady;
	    this.raw = options.data; // A copy of the sheet's raw data, for accessing minutiae

	    if (typeof(options.data.feed.entry) === 'undefined') {
	      options.tabletop.log('Missing data for ' + this.name + ', make sure you didn\'t forget column headers');
	      this.originalColumns = [];
	      this.elements = [];
	      this.ready();
	      return;
	    }

	    for (var key in options.data.feed.entry[0]){
	      if (/^gsx/.test(key)) {
	        this.columnNames.push(key.replace('gsx$',''));
	      }
	    }

	    this.originalColumns = this.columnNames;
	    this.original_columns = this.originalColumns; // jshint ignore:line

	    for (i = 0, ilen =  options.data.feed.entry.length ; i < ilen; i++) {
	      var source = options.data.feed.entry[i];
	      var element = {};
	      for (j = 0, jlen = this.columnNames.length; j < jlen ; j++) {
	        var cell = source['gsx$' + this.columnNames[j]];
	        if (typeof(cell) !== 'undefined') {
	          if (options.parseNumbers && cell.$t !== '' && !isNaN(cell.$t)) {
	            element[this.columnNames[j]] = +cell.$t;
	          } else {
	            element[this.columnNames[j]] = cell.$t;
	          }
	        } else {
	          element[this.columnNames[j]] = '';
	        }
	      }
	      if (element.rowNumber === undefined) {
	        element.rowNumber = i + 1;
	      }

	      this.elements.push(element);
	    }

	    if (options.prettyColumnNames) {
	      this.fetchPrettyColumns();
	    } else {
	      this.ready();
	    }
	  };

	  Tabletop.Model.prototype = {
	    /*
	      Returns all of the elements (rows) of the worksheet as objects
	    */
	    all: function() {
	      return this.elements;
	    },

	    fetchPrettyColumns: function() {
	      if (!this.raw.feed.link[3]) {
	        return this.ready();
	      }

	      var cellurl = this.raw.feed.link[3].href.replace('/feeds/list/', '/feeds/cells/').replace('https://spreadsheets.google.com', '');
	      var that = this;
	      this.tabletop.requestData(cellurl, function(data) {
	        that.loadPrettyColumns(data);
	      });
	    },

	    beforeReady: function() {
	      if(this.tabletop.postProcess) {
	        for (var i = 0, ilen = this.elements.length; i < ilen; i++) {
	          this.tabletop.postProcess(this.elements[i]);
	        }
	      }
	    },

	    ready: function() {
	      this.beforeReady();
	      this.onReady.call(this);
	    },

	    /*
	     * Store column names as an object
	     * with keys of Google-formatted "columnName"
	     * and values of human-readable "Column name"
	     */
	    loadPrettyColumns: function(data) {
	      var prettyColumns = {};

	      var columnNames = this.columnNames;

	      var i = 0;
	      var l = columnNames.length;

	      for (; i < l; i++) {
	        if (typeof data.feed.entry[i].content.$t !== 'undefined') {
	          prettyColumns[columnNames[i]] = data.feed.entry[i].content.$t;
	        } else {
	          prettyColumns[columnNames[i]] = columnNames[i];
	        }
	      }

	      this.prettyColumns = prettyColumns;
	      this.pretty_columns = this.prettyColumns; // jshint ignore:line
	      this.prettifyElements();
	      this.ready();
	    },

	    /*
	     * Go through each row, substitutiting
	     * Google-formatted "columnName"
	     * with human-readable "Column name"
	     */
	    prettifyElements: function() {
	      var prettyElements = [],
	          orderedPrettyNames = [],
	          i, j, ilen, jlen;

	      for (j = 0, jlen = this.columnNames.length; j < jlen ; j++) {
	        orderedPrettyNames.push(this.prettyColumns[this.columnNames[j]]);
	      }

	      for (i = 0, ilen = this.elements.length; i < ilen; i++) {
	        var newElement = {};
	        for (j = 0, jlen = this.columnNames.length; j < jlen ; j++) {
	          var newColumnName = this.prettyColumns[this.columnNames[j]];
	          newElement[newColumnName] = this.elements[i][this.columnNames[j]];
	        }
	        prettyElements.push(newElement);
	      }
	      this.elements = prettyElements;
	      this.columnNames = orderedPrettyNames;
	    },

	    /*
	      Return the elements as an array of arrays, instead of an array of objects
	    */
	    toArray: function() {
	      var array = [],
	          i, j, ilen, jlen;
	      for (i = 0, ilen = this.elements.length; i < ilen; i++) {
	        var row = [];
	        for (j = 0, jlen = this.columnNames.length; j < jlen ; j++) {
	          row.push(this.elements[i][ this.columnNames[j]]);
	        }
	        array.push(row);
	      }

	      return array;
	    }
	  };

	  if(typeof module !== 'undefined' && module.exports) { //don't just use inNodeJS, we may be in Browserify
	    module.exports = Tabletop;
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return Tabletop;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else {
	    window.Tabletop = Tabletop;
	  }

	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);
	var bind = __webpack_require__(10);
	var Axios = __webpack_require__(11);
	var mergeConfig = __webpack_require__(29);
	var defaults = __webpack_require__(17);

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  return instance;
	}

	// Create the default instance to be exported
	var axios = createInstance(defaults);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;

	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(mergeConfig(axios.defaults, instanceConfig));
	};

	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(30);
	axios.CancelToken = __webpack_require__(31);
	axios.isCancel = __webpack_require__(16);

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(32);

	module.exports = axios;

	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var bind = __webpack_require__(10);

	/*global toString:true*/

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
	                                           navigator.product === 'NativeScript' ||
	                                           navigator.product === 'NS')) {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Function equal to merge with the difference being that no reference
	 * to original objects is kept.
	 *
	 * @see merge
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function deepMerge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = deepMerge(result[key], val);
	    } else if (typeof val === 'object') {
	      result[key] = deepMerge({}, val);
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}

	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  deepMerge: deepMerge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);
	var buildURL = __webpack_require__(12);
	var InterceptorManager = __webpack_require__(13);
	var dispatchRequest = __webpack_require__(14);
	var mergeConfig = __webpack_require__(29);

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}

	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = arguments[1] || {};
	    config.url = arguments[0];
	  } else {
	    config = config || {};
	  }

	  config = mergeConfig(this.defaults, config);

	  // Set config.method
	  if (config.method) {
	    config.method = config.method.toLowerCase();
	  } else if (this.defaults.method) {
	    config.method = this.defaults.method.toLowerCase();
	  } else {
	    config.method = 'get';
	  }

	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);

	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }

	  return promise;
	};

	Axios.prototype.getUri = function getUri(config) {
	  config = mergeConfig(this.defaults, config);
	  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
	};

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});

	module.exports = Axios;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils.isArray(val)) {
	        key = key + '[]';
	      } else {
	        val = [val];
	      }

	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    var hashmarkIndex = url.indexOf('#');
	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }

	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	function InterceptorManager() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	module.exports = InterceptorManager;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);
	var transformData = __webpack_require__(15);
	var isCancel = __webpack_require__(16);
	var defaults = __webpack_require__(17);

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Ensure headers exist
	  config.headers = config.headers || {};

	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers
	  );

	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  var adapter = config.adapter || defaults.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }

	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(9);
	var normalizeHeaderName = __webpack_require__(18);

	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}

	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(19);
	  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(19);
	  }
	  return adapter;
	}

	var defaults = {
	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Accept');
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};

	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	module.exports = defaults;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);
	var settle = __webpack_require__(20);
	var buildURL = __webpack_require__(12);
	var buildFullPath = __webpack_require__(23);
	var parseHeaders = __webpack_require__(26);
	var isURLSameOrigin = __webpack_require__(27);
	var createError = __webpack_require__(21);

	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;

	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }

	    var request = new XMLHttpRequest();

	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }

	    var fullPath = buildFullPath(config.baseURL, config.url);
	    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    // Listen for ready state
	    request.onreadystatechange = function handleLoad() {
	      if (!request || request.readyState !== 4) {
	        return;
	      }

	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }

	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };

	      settle(resolve, reject, response);

	      // Clean up request
	      request = null;
	    };

	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }

	      reject(createError('Request aborted', config, 'ECONNABORTED', request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
	      if (config.timeoutErrorMessage) {
	        timeoutErrorMessage = config.timeoutErrorMessage;
	      }
	      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(28);

	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
	        cookies.read(config.xsrfCookieName) :
	        undefined;

	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }

	    // Add withCredentials to request if needed
	    if (!utils.isUndefined(config.withCredentials)) {
	      request.withCredentials = !!config.withCredentials;
	    }

	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }

	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }

	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }

	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }

	    if (requestData === undefined) {
	      requestData = null;
	    }

	    // Send the request
	    request.send(requestData);
	  });
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var createError = __webpack_require__(21);

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  if (!validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var enhanceError = __webpack_require__(22);

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }

	  error.request = request;
	  error.response = response;
	  error.isAxiosError = true;

	  error.toJSON = function() {
	    return {
	      // Standard
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: this.config,
	      code: this.code
	    };
	  };
	  return error;
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var isAbsoluteURL = __webpack_require__(24);
	var combineURLs = __webpack_require__(25);

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 * @returns {string} The combined full path
	 */
	module.exports = function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	// Headers whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	var ignoreDuplicateOf = [
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	];

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;

	  if (!headers) { return parsed; }

	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
	        return;
	      }
	      if (key === 'set-cookie') {
	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
	      } else {
	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	      }
	    }
	  });

	  return parsed;
	};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	    (function standardBrowserEnv() {
	      var msie = /(msie|trident)/i.test(navigator.userAgent);
	      var urlParsingNode = document.createElement('a');
	      var originURL;

	      /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	      function resolveURL(url) {
	        var href = url;

	        if (msie) {
	        // IE needs attribute set twice to normalize properties
	          urlParsingNode.setAttribute('href', href);
	          href = urlParsingNode.href;
	        }

	        urlParsingNode.setAttribute('href', href);

	        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	        return {
	          href: urlParsingNode.href,
	          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	          host: urlParsingNode.host,
	          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	          hostname: urlParsingNode.hostname,
	          port: urlParsingNode.port,
	          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	            urlParsingNode.pathname :
	            '/' + urlParsingNode.pathname
	        };
	      }

	      originURL = resolveURL(window.location.href);

	      /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	      return function isURLSameOrigin(requestURL) {
	        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	        return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	      };
	    })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	    (function nonStandardBrowserEnv() {
	      return function isURLSameOrigin() {
	        return true;
	      };
	    })()
	);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs support document.cookie
	    (function standardBrowserEnv() {
	      return {
	        write: function write(name, value, expires, path, domain, secure) {
	          var cookie = [];
	          cookie.push(name + '=' + encodeURIComponent(value));

	          if (utils.isNumber(expires)) {
	            cookie.push('expires=' + new Date(expires).toGMTString());
	          }

	          if (utils.isString(path)) {
	            cookie.push('path=' + path);
	          }

	          if (utils.isString(domain)) {
	            cookie.push('domain=' + domain);
	          }

	          if (secure === true) {
	            cookie.push('secure');
	          }

	          document.cookie = cookie.join('; ');
	        },

	        read: function read(name) {
	          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	          return (match ? decodeURIComponent(match[3]) : null);
	        },

	        remove: function remove(name) {
	          this.write(name, '', Date.now() - 86400000);
	        }
	      };
	    })() :

	  // Non standard browser env (web workers, react-native) lack needed support.
	    (function nonStandardBrowserEnv() {
	      return {
	        write: function write() {},
	        read: function read() { return null; },
	        remove: function remove() {}
	      };
	    })()
	);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(9);

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	module.exports = function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  var config = {};

	  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
	  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
	  var defaultToConfig2Keys = [
	    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
	    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
	    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
	    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
	    'httpsAgent', 'cancelToken', 'socketPath'
	  ];

	  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
	    if (typeof config2[prop] !== 'undefined') {
	      config[prop] = config2[prop];
	    }
	  });

	  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
	    if (utils.isObject(config2[prop])) {
	      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
	    } else if (typeof config2[prop] !== 'undefined') {
	      config[prop] = config2[prop];
	    } else if (utils.isObject(config1[prop])) {
	      config[prop] = utils.deepMerge(config1[prop]);
	    } else if (typeof config1[prop] !== 'undefined') {
	      config[prop] = config1[prop];
	    }
	  });

	  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
	    if (typeof config2[prop] !== 'undefined') {
	      config[prop] = config2[prop];
	    } else if (typeof config1[prop] !== 'undefined') {
	      config[prop] = config1[prop];
	    }
	  });

	  var axiosKeys = valueFromConfig2Keys
	    .concat(mergeDeepPropertiesKeys)
	    .concat(defaultToConfig2Keys);

	  var otherKeys = Object
	    .keys(config2)
	    .filter(function filterAxiosKeys(key) {
	      return axiosKeys.indexOf(key) === -1;
	    });

	  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
	    if (typeof config2[prop] !== 'undefined') {
	      config[prop] = config2[prop];
	    } else if (typeof config1[prop] !== 'undefined') {
	      config[prop] = config1[prop];
	    }
	  });

	  return config;
	};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}

	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};

	Cancel.prototype.__CANCEL__ = true;

	module.exports = Cancel;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Cancel = __webpack_require__(30);

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }

	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });

	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }

	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};

	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};

	module.exports = CancelToken;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	var _Layout = __webpack_require__(34);

	var _Layout2 = _interopRequireDefault(_Layout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Router = _exoskeleton2.default.Router.extend({

	    layout: null,

	    singleOpen: false,
	    initialLoad: false,

	    initialize: function initialize(collection) {
	        this.layout = new _Layout2.default(collection);
	    },


	    routes: {
	        '': 'showIndex',
	        'sketch/:key': 'showSingle'
	    },

	    showIndex: function showIndex() {
	        if (this.singleOpen === true) {
	            this.layout.closeSingle();
	            this.singleOpen = false;
	        }
	        if (this.initialLoad === false) {
	            this.layout.showLoading();
	        } else {
	            this.layout.showQuickLoad();
	        }
	        this.initialLoad = true;
	    },
	    showSingle: function showSingle(key) {
	        this.singleOpen = true;
	        this.initialLoad = true;
	        this.layout.openSingle(key);
	    }
	});

	exports.default = Router;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jbone = __webpack_require__(3);

	var _jbone2 = _interopRequireDefault(_jbone);

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	var _gsap = __webpack_require__(35);

	var _gsap2 = _interopRequireDefault(_gsap);

	var _Home = __webpack_require__(36);

	var _Home2 = _interopRequireDefault(_Home);

	var _Single = __webpack_require__(40);

	var _Single2 = _interopRequireDefault(_Single);

	var _imports = __webpack_require__(41);

	var _imports2 = _interopRequireDefault(_imports);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Layout = _exoskeleton2.default.View.extend({

	    collection: null,
	    home: null,
	    single: null,
	    ref_id: null,

	    el: (0, _jbone2.default)('#app'),
	    tween: new TimelineMax(),

	    initialize: function initialize(collection) {

	        console.log('%c ໒(•න꒶̭න•)७ https://www.youtube.com/watch?v=5pMCmu6Ov1k', 'background: #17293a; color: #fff; padding: 12px;');

	        (0, _jbone2.default)('#app').css('display', 'block');
	        this.collection = collection;
	        this.home = new _Home2.default(collection);
	        this.single = new _Single2.default();

	        this.updateAnimationFrame();

	        window.onresize = this.onresize.bind(this);
	    },
	    openSingle: function openSingle(key) {
	        this.stopAnimationFrame();
	        this.single.open(key, this.tween);
	        this.tween.add(function () {
	            (0, _jbone2.default)('.homepage').css('pointer-events', 'none');
	        });
	    },
	    closeSingle: function closeSingle() {
	        this.single.close(this.tween);
	        this.updateAnimationFrame();
	        this.tween.add(function () {
	            (0, _jbone2.default)('.homepage').css('pointer-events', 'initial');
	        });
	    },
	    updateAnimationFrame: function updateAnimationFrame() {
	        this.ref_id = window.requestAnimationFrame(this.updateAnimationFrame.bind(this));
	        this.home.updateAnimationFrame();
	    },
	    stopAnimationFrame: function stopAnimationFrame() {
	        window.cancelAnimationFrame(this.ref_id);
	    },
	    showLoading: function showLoading() {
	        this.home.showLoading(this.tween);
	    },
	    showQuickLoad: function showQuickLoad() {
	        this.home.showLoadingQuick(this.tween);
	    },
	    onresize: function onresize() {
	        var _window = window,
	            width = _window.innerWidth,
	            height = _window.innerHeight;

	        this.home.onresize(width, height);
	        this.single.onresize(width, height);
	    }
	});

	exports.default = Layout;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * VERSION: 1.20.5
	 * DATE: 2018-05-21
	 * UPDATES AND DOCS AT: http://greensock.com
	 * 
	 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
	 *
	 * @license Copyright (c) 2008-2018, GreenSock. All rights reserved.
	 * This work is subject to the terms at http://greensock.com/standard-license or for
	 * Club GreenSock members, the software agreement that was issued with your membership.
	 * 
	 * @author: Jack Doyle, jack@greensock.com
	 **/
	var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
	(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

		"use strict";

		_gsScope._gsDefine("TweenMax", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

			var _slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					var b = [],
						l = a.length,
						i;
					for (i = 0; i !== l; b.push(a[i++]));
					return b;
				},
				_applyCycle = function(vars, targets, i) {
					var alt = vars.cycle,
						p, val;
					for (p in alt) {
						val = alt[p];
						vars[p] = (typeof(val) === "function") ? val(i, targets[i]) : val[i % val.length];
					}
					delete vars.cycle;
				},
				TweenMax = function(target, duration, vars) {
					TweenLite.call(this, target, duration, vars);
					this._cycle = 0;
					this._yoyo = (this.vars.yoyo === true || !!this.vars.yoyoEase);
					this._repeat = this.vars.repeat || 0;
					this._repeatDelay = this.vars.repeatDelay || 0;
					if (this._repeat) {
						this._uncache(true); //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
					}
					this.render = TweenMax.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
				},
				_tinyNum = 0.0000000001,
				TweenLiteInternals = TweenLite._internals,
				_isSelector = TweenLiteInternals.isSelector,
				_isArray = TweenLiteInternals.isArray,
				p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
				_blankArray = [];

			TweenMax.version = "1.20.5";
			p.constructor = TweenMax;
			p.kill()._gc = false;
			TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
			TweenMax.getTweensOf = TweenLite.getTweensOf;
			TweenMax.lagSmoothing = TweenLite.lagSmoothing;
			TweenMax.ticker = TweenLite.ticker;
			TweenMax.render = TweenLite.render;

			p.invalidate = function() {
				this._yoyo = (this.vars.yoyo === true || !!this.vars.yoyoEase);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._yoyoEase = null;
				this._uncache(true);
				return TweenLite.prototype.invalidate.call(this);
			};
			
			p.updateTo = function(vars, resetDuration) {
				var curRatio = this.ratio,
					immediate = this.vars.immediateRender || vars.immediateRender,
					p;
				if (resetDuration && this._startTime < this._timeline._time) {
					this._startTime = this._timeline._time;
					this._uncache(false);
					if (this._gc) {
						this._enabled(true, false);
					} else {
						this._timeline.insert(this, this._startTime - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
					}
				}
				for (p in vars) {
					this.vars[p] = vars[p];
				}
				if (this._initted || immediate) {
					if (resetDuration) {
						this._initted = false;
						if (immediate) {
							this.render(0, true, true);
						}
					} else {
						if (this._gc) {
							this._enabled(true, false);
						}
						if (this._notifyPluginsOfEnabled && this._firstPT) {
							TweenLite._onPluginEvent("_onDisable", this); //in case a plugin like MotionBlur must perform some cleanup tasks
						}
						if (this._time / this._duration > 0.998) { //if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards. 
							var prevTime = this._totalTime;
							this.render(0, true, false);
							this._initted = false;
							this.render(prevTime, true, false);
						} else {
							this._initted = false;
							this._init();
							if (this._time > 0 || immediate) {
								var inv = 1 / (1 - curRatio),
									pt = this._firstPT, endValue;
								while (pt) {
									endValue = pt.s + pt.c;
									pt.c *= inv;
									pt.s = endValue - pt.c;
									pt = pt._next;
								}
							}
						}
					}
				}
				return this;
			};
					
			p.render = function(time, suppressEvents, force) {
				if (!this._initted) if (this._duration === 0 && this.vars.repeat) { //zero duration tweens that render immediately have render() called from TweenLite's constructor, before TweenMax's constructor has finished setting _repeat, _repeatDelay, and _yoyo which are critical in determining totalDuration() so we need to call invalidate() which is a low-kb way to get those set properly.
					this.invalidate();
				}
				var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
					prevTime = this._time,
					prevTotalTime = this._totalTime, 
					prevCycle = this._cycle,
					duration = this._duration,
					prevRawPrevTime = this._rawPrevTime,
					isComplete, callback, pt, cycleDuration, r, type, pow, rawPrevTime, yoyoEase;
				if (time >= totalDur - 0.0000001 && time >= 0) { //to work around occasional floating point math artifacts.
					this._totalTime = totalDur;
					this._cycle = this._repeat;
					if (this._yoyo && (this._cycle & 1) !== 0) {
						this._time = 0;
						this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
					} else {
						this._time = duration;
						this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
					}
					if (!this._reversed) {
						isComplete = true;
						callback = "onComplete";
						force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					}
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
							time = 0;
						}
						if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
							force = true;
							if (prevRawPrevTime > _tinyNum) {
								callback = "onReverseComplete";
							}
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
					
				} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
					this._totalTime = this._time = this._cycle = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
					if (prevTotalTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
						callback = "onReverseComplete";
						isComplete = this._reversed;
					}
					if (time < 0) {
						this._active = false;
						if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
							if (prevRawPrevTime >= 0) {
								force = true;
							}
							this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
						}
					}
					if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
						force = true;
					}
				} else {
					this._totalTime = this._time = time;
					if (this._repeat !== 0) {
						cycleDuration = duration + this._repeatDelay;
						this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
						if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
							this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
						}
						this._time = this._totalTime - (this._cycle * cycleDuration);
						if (this._yoyo) if ((this._cycle & 1) !== 0) {
							this._time = duration - this._time;
							yoyoEase = this._yoyoEase || this.vars.yoyoEase; //note: we don't set this._yoyoEase in _init() like we do other properties because it's TweenMax-specific and doing it here allows us to optimize performance (most tweens don't have a yoyoEase). Note that we also must skip the this.ratio calculation further down right after we _init() in this function, because we're doing it here.
							if (yoyoEase) {
								if (!this._yoyoEase) {
									if (yoyoEase === true && !this._initted) { //if it's not initted and yoyoEase is true, this._ease won't have been populated yet so we must discern it here.
										yoyoEase = this.vars.ease;
										this._yoyoEase = yoyoEase = !yoyoEase ? TweenLite.defaultEase : (yoyoEase instanceof Ease) ? yoyoEase : (typeof(yoyoEase) === "function") ? new Ease(yoyoEase, this.vars.easeParams) : Ease.map[yoyoEase] || TweenLite.defaultEase;
									} else {
										this._yoyoEase = yoyoEase = (yoyoEase === true) ? this._ease : (yoyoEase instanceof Ease) ? yoyoEase : Ease.map[yoyoEase];
									}
								}
								this.ratio = yoyoEase ? 1 - yoyoEase.getRatio((duration - this._time) / duration) : 0;
							}
						}
						if (this._time > duration) {
							this._time = duration;
						} else if (this._time < 0) {
							this._time = 0;
						}
					}
					if (this._easeType && !yoyoEase) {
						r = this._time / duration;
						type = this._easeType;
						pow = this._easePower;
						if (type === 1 || (type === 3 && r >= 0.5)) {
							r = 1 - r;
						}
						if (type === 3) {
							r *= 2;
						}
						if (pow === 1) {
							r *= r;
						} else if (pow === 2) {
							r *= r * r;
						} else if (pow === 3) {
							r *= r * r * r;
						} else if (pow === 4) {
							r *= r * r * r * r;
						}

						if (type === 1) {
							this.ratio = 1 - r;
						} else if (type === 2) {
							this.ratio = r;
						} else if (this._time / duration < 0.5) {
							this.ratio = r / 2;
						} else {
							this.ratio = 1 - (r / 2);
						}

					} else if (!yoyoEase) {
						this.ratio = this._ease.getRatio(this._time / duration);
					}
					
				}
					
				if (prevTime === this._time && !force && prevCycle === this._cycle) {
					if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
						this._callback("onUpdate");
					}
					return;
				} else if (!this._initted) {
					this._init();
					if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
						return;
					} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) { //we stick it in the queue for rendering at the very end of the tick - this is a performance optimization because browsers invalidate styles and force a recalculation if you read, write, and then read style data (so it's better to read/read/read/write/write/write than read/write/read/write/read/write). The down side, of course, is that usually you WANT things to render immediately because you may have code running right after that which depends on the change. Like imagine running TweenLite.set(...) and then immediately after that, creating a nother tween that animates the same property to another value; the starting values of that 2nd tween wouldn't be accurate if lazy is true.
						this._time = prevTime;
						this._totalTime = prevTotalTime;
						this._rawPrevTime = prevRawPrevTime;
						this._cycle = prevCycle;
						TweenLiteInternals.lazyTweens.push(this);
						this._lazy = [time, suppressEvents];
						return;
					}
					//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
					if (this._time && !isComplete && !yoyoEase) {
						this.ratio = this._ease.getRatio(this._time / duration);
					} else if (isComplete && this._ease._calcEnd && !yoyoEase) {
						this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
					}
				}
				if (this._lazy !== false) {
					this._lazy = false;
				}

				if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
					this._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
				}
				if (prevTotalTime === 0) {
					if (this._initted === 2 && time > 0) {
						//this.invalidate();
						this._init(); //will just apply overwriting since _initted of (2) means it was a from() tween that had immediateRender:true
					}
					if (this._startAt) {
						if (time >= 0) {
							this._startAt.render(time, true, force);
						} else if (!callback) {
							callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
						}
					}
					if (this.vars.onStart) if (this._totalTime !== 0 || duration === 0) if (!suppressEvents) {
						this._callback("onStart");
					}
				}
				
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](pt.c * this.ratio + pt.s);
					} else {
						pt.t[pt.p] = pt.c * this.ratio + pt.s;
					}
					pt = pt._next;
				}
				
				if (this._onUpdate) {
					if (time < 0) if (this._startAt && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
						this._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
					}
					if (!suppressEvents) if (this._totalTime !== prevTotalTime || callback) {
						this._callback("onUpdate");
					}
				}
				if (this._cycle !== prevCycle) if (!suppressEvents) if (!this._gc) if (this.vars.onRepeat) {
					this._callback("onRepeat");
				}
				if (callback) if (!this._gc || force) { //check gc because there's a chance that kill() could be called in an onUpdate
					if (time < 0 && this._startAt && !this._onUpdate && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
						this._startAt.render(time, true, force);
					}
					if (isComplete) {
						if (this._timeline.autoRemoveChildren) {
							this._enabled(false, false);
						}
						this._active = false;
					}
					if (!suppressEvents && this.vars[callback]) {
						this._callback(callback);
					}
					if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
						this._rawPrevTime = 0;
					}
				}
			};
			
	//---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------
			
			TweenMax.to = function(target, duration, vars) {
				return new TweenMax(target, duration, vars);
			};
			
			TweenMax.from = function(target, duration, vars) {
				vars.runBackwards = true;
				vars.immediateRender = (vars.immediateRender != false);
				return new TweenMax(target, duration, vars);
			};
			
			TweenMax.fromTo = function(target, duration, fromVars, toVars) {
				toVars.startAt = fromVars;
				toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
				return new TweenMax(target, duration, toVars);
			};
			
			TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
				stagger = stagger || 0;
				var delay = 0,
					a = [],
					finalComplete = function() {
						if (vars.onComplete) {
							vars.onComplete.apply(vars.onCompleteScope || this, arguments);
						}
						onCompleteAll.apply(onCompleteAllScope || vars.callbackScope || this, onCompleteAllParams || _blankArray);
					},
					cycle = vars.cycle,
					fromCycle = (vars.startAt && vars.startAt.cycle),
					l, copy, i, p;
				if (!_isArray(targets)) {
					if (typeof(targets) === "string") {
						targets = TweenLite.selector(targets) || targets;
					}
					if (_isSelector(targets)) {
						targets = _slice(targets);
					}
				}
				targets = targets || [];
				if (stagger < 0) {
					targets = _slice(targets);
					targets.reverse();
					stagger *= -1;
				}
				l = targets.length - 1;
				for (i = 0; i <= l; i++) {
					copy = {};
					for (p in vars) {
						copy[p] = vars[p];
					}
					if (cycle) {
						_applyCycle(copy, targets, i);
						if (copy.duration != null) {
							duration = copy.duration;
							delete copy.duration;
						}
					}
					if (fromCycle) {
						fromCycle = copy.startAt = {};
						for (p in vars.startAt) {
							fromCycle[p] = vars.startAt[p];
						}
						_applyCycle(copy.startAt, targets, i);
					}
					copy.delay = delay + (copy.delay || 0);
					if (i === l && onCompleteAll) {
						copy.onComplete = finalComplete;
					}
					a[i] = new TweenMax(targets[i], duration, copy);
					delay += stagger;
				}
				return a;
			};
			
			TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
				vars.runBackwards = true;
				vars.immediateRender = (vars.immediateRender != false);
				return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
			};
			
			TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
				toVars.startAt = fromVars;
				toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
				return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
			};
					
			TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
				return new TweenMax(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, useFrames:useFrames, overwrite:0});
			};
			
			TweenMax.set = function(target, vars) {
				return new TweenMax(target, 0, vars);
			};
			
			TweenMax.isTweening = function(target) {
				return (TweenLite.getTweensOf(target, true).length > 0);
			};
			
			var _getChildrenOf = function(timeline, includeTimelines) {
					var a = [],
						cnt = 0,
						tween = timeline._first;
					while (tween) {
						if (tween instanceof TweenLite) {
							a[cnt++] = tween;
						} else {
							if (includeTimelines) {
								a[cnt++] = tween;
							}
							a = a.concat(_getChildrenOf(tween, includeTimelines));
							cnt = a.length;
						}
						tween = tween._next;
					}
					return a;
				}, 
				getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
					return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat( _getChildrenOf(Animation._rootFramesTimeline, includeTimelines) );
				};
			
			TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
				if (tweens == null) {
					tweens = true;
				}
				if (delayedCalls == null) {
					delayedCalls = true;
				}
				var a = getAllTweens((timelines != false)),
					l = a.length,
					allTrue = (tweens && delayedCalls && timelines),
					isDC, tween, i;
				for (i = 0; i < l; i++) {
					tween = a[i];
					if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
						if (complete) {
							tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
						} else {
							tween._enabled(false, false);
						}
					}
				}
			};
			
			TweenMax.killChildTweensOf = function(parent, complete) {
				if (parent == null) {
					return;
				}
				var tl = TweenLiteInternals.tweenLookup,
					a, curParent, p, i, l;
				if (typeof(parent) === "string") {
					parent = TweenLite.selector(parent) || parent;
				}
				if (_isSelector(parent)) {
					parent = _slice(parent);
				}
				if (_isArray(parent)) {
					i = parent.length;
					while (--i > -1) {
						TweenMax.killChildTweensOf(parent[i], complete);
					}
					return;
				}
				a = [];
				for (p in tl) {
					curParent = tl[p].target.parentNode;
					while (curParent) {
						if (curParent === parent) {
							a = a.concat(tl[p].tweens);
						}
						curParent = curParent.parentNode;
					}
				}
				l = a.length;
				for (i = 0; i < l; i++) {
					if (complete) {
						a[i].totalTime(a[i].totalDuration());
					}
					a[i]._enabled(false, false);
				}
			};

			var _changePause = function(pause, tweens, delayedCalls, timelines) {
				tweens = (tweens !== false);
				delayedCalls = (delayedCalls !== false);
				timelines = (timelines !== false);
				var a = getAllTweens(timelines),
					allTrue = (tweens && delayedCalls && timelines),
					i = a.length,
					isDC, tween;
				while (--i > -1) {
					tween = a[i];
					if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
						tween.paused(pause);
					}
				}
			};
			
			TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
				_changePause(true, tweens, delayedCalls, timelines);
			};
			
			TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
				_changePause(false, tweens, delayedCalls, timelines);
			};

			TweenMax.globalTimeScale = function(value) {
				var tl = Animation._rootTimeline,
					t = TweenLite.ticker.time;
				if (!arguments.length) {
					return tl._timeScale;
				}
				value = value || _tinyNum; //can't allow zero because it'll throw the math off
				tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
				tl = Animation._rootFramesTimeline;
				t = TweenLite.ticker.frame;
				tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
				tl._timeScale = Animation._rootTimeline._timeScale = value;
				return value;
			};
			
		
	//---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------
			
			p.progress = function(value, suppressEvents) {
				return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
			};
			
			p.totalProgress = function(value, suppressEvents) {
				return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
			};
			
			p.time = function(value, suppressEvents) {
				if (!arguments.length) {
					return this._time;
				}
				if (this._dirty) {
					this.totalDuration();
				}
				if (value > this._duration) {
					value = this._duration;
				}
				if (this._yoyo && (this._cycle & 1) !== 0) {
					value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
				} else if (this._repeat !== 0) {
					value += this._cycle * (this._duration + this._repeatDelay);
				}
				return this.totalTime(value, suppressEvents);
			};

			p.duration = function(value) {
				if (!arguments.length) {
					return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
				}
				return Animation.prototype.duration.call(this, value);
			};

			p.totalDuration = function(value) {
				if (!arguments.length) {
					if (this._dirty) {
						//instead of Infinity, we use 999999999999 so that we can accommodate reverses
						this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
						this._dirty = false;
					}
					return this._totalDuration;
				}
				return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
			};
			
			p.repeat = function(value) {
				if (!arguments.length) {
					return this._repeat;
				}
				this._repeat = value;
				return this._uncache(true);
			};
			
			p.repeatDelay = function(value) {
				if (!arguments.length) {
					return this._repeatDelay;
				}
				this._repeatDelay = value;
				return this._uncache(true);
			};
			
			p.yoyo = function(value) {
				if (!arguments.length) {
					return this._yoyo;
				}
				this._yoyo = value;
				return this;
			};
			
			
			return TweenMax;
			
		}, true);








	/*
	 * ----------------------------------------------------------------
	 * TimelineLite
	 * ----------------------------------------------------------------
	 */
		_gsScope._gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

			var TimelineLite = function(vars) {
					SimpleTimeline.call(this, vars);
					this._labels = {};
					this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
					this.smoothChildTiming = (this.vars.smoothChildTiming === true);
					this._sortChildren = true;
					this._onUpdate = this.vars.onUpdate;
					var v = this.vars,
						val, p;
					for (p in v) {
						val = v[p];
						if (_isArray(val)) if (val.join("").indexOf("{self}") !== -1) {
							v[p] = this._swapSelfInParams(val);
						}
					}
					if (_isArray(v.tweens)) {
						this.add(v.tweens, 0, v.align, v.stagger);
					}
				},
				_tinyNum = 0.0000000001,
				TweenLiteInternals = TweenLite._internals,
				_internals = TimelineLite._internals = {},
				_isSelector = TweenLiteInternals.isSelector,
				_isArray = TweenLiteInternals.isArray,
				_lazyTweens = TweenLiteInternals.lazyTweens,
				_lazyRender = TweenLiteInternals.lazyRender,
				_globals = _gsScope._gsDefine.globals,
				_copy = function(vars) {
					var copy = {}, p;
					for (p in vars) {
						copy[p] = vars[p];
					}
					return copy;
				},
				_applyCycle = function(vars, targets, i) {
					var alt = vars.cycle,
						p, val;
					for (p in alt) {
						val = alt[p];
						vars[p] = (typeof(val) === "function") ? val(i, targets[i]) : val[i % val.length];
					}
					delete vars.cycle;
				},
				_pauseCallback = _internals.pauseCallback = function() {},
				_slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					var b = [],
						l = a.length,
						i;
					for (i = 0; i !== l; b.push(a[i++]));
					return b;
				},
				p = TimelineLite.prototype = new SimpleTimeline();

			TimelineLite.version = "1.20.4";
			p.constructor = TimelineLite;
			p.kill()._gc = p._forcingPlayhead = p._hasPause = false;

			/* might use later...
			//translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
			function localToGlobal(time, animation) {
				while (animation) {
					time = (time / animation._timeScale) + animation._startTime;
					animation = animation.timeline;
				}
				return time;
			}

			//translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
			function globalToLocal(time, animation) {
				var scale = 1;
				time -= localToGlobal(0, animation);
				while (animation) {
					scale *= animation._timeScale;
					animation = animation.timeline;
				}
				return time * scale;
			}
			*/

			p.to = function(target, duration, vars, position) {
				var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
				return duration ? this.add( new Engine(target, duration, vars), position) : this.set(target, vars, position);
			};

			p.from = function(target, duration, vars, position) {
				return this.add( ((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
			};

			p.fromTo = function(target, duration, fromVars, toVars, position) {
				var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
				return duration ? this.add( Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
			};

			p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
				var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, callbackScope:onCompleteAllScope, smoothChildTiming:this.smoothChildTiming}),
					cycle = vars.cycle,
					copy, i;
				if (typeof(targets) === "string") {
					targets = TweenLite.selector(targets) || targets;
				}
				targets = targets || [];
				if (_isSelector(targets)) { //senses if the targets object is a selector. If it is, we should translate it into an array.
					targets = _slice(targets);
				}
				stagger = stagger || 0;
				if (stagger < 0) {
					targets = _slice(targets);
					targets.reverse();
					stagger *= -1;
				}
				for (i = 0; i < targets.length; i++) {
					copy = _copy(vars);
					if (copy.startAt) {
						copy.startAt = _copy(copy.startAt);
						if (copy.startAt.cycle) {
							_applyCycle(copy.startAt, targets, i);
						}
					}
					if (cycle) {
						_applyCycle(copy, targets, i);
						if (copy.duration != null) {
							duration = copy.duration;
							delete copy.duration;
						}
					}
					tl.to(targets[i], duration, copy, i * stagger);
				}
				return this.add(tl, position);
			};

			p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
				vars.immediateRender = (vars.immediateRender != false);
				vars.runBackwards = true;
				return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
			};

			p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
				toVars.startAt = fromVars;
				toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
				return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
			};

			p.call = function(callback, params, scope, position) {
				return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
			};

			p.set = function(target, vars, position) {
				position = this._parseTimeOrLabel(position, 0, true);
				if (vars.immediateRender == null) {
					vars.immediateRender = (position === this._time && !this._paused);
				}
				return this.add( new TweenLite(target, 0, vars), position);
			};

			TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
				vars = vars || {};
				if (vars.smoothChildTiming == null) {
					vars.smoothChildTiming = true;
				}
				var tl = new TimelineLite(vars),
					root = tl._timeline,
					hasNegativeStart, time,	tween, next;
				if (ignoreDelayedCalls == null) {
					ignoreDelayedCalls = true;
				}
				root._remove(tl, true);
				tl._startTime = 0;
				tl._rawPrevTime = tl._time = tl._totalTime = root._time;
				tween = root._first;
				while (tween) {
					next = tween._next;
					if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
						time = tween._startTime - tween._delay;
						if (time < 0) {
							hasNegativeStart = 1;
						}
						tl.add(tween, time);
					}
					tween = next;
				}
				root.add(tl, 0);
				if (hasNegativeStart) { //calling totalDuration() will force the adjustment necessary to shift the children forward so none of them start before zero, and moves the timeline backwards the same amount, so the playhead is still aligned where it should be globally, but the timeline doesn't have illegal children that start before zero.
					tl.totalDuration();
				}
				return tl;
			};

			p.add = function(value, position, align, stagger) {
				var curTime, l, i, child, tl, beforeRawTime;
				if (typeof(position) !== "number") {
					position = this._parseTimeOrLabel(position, 0, true, value);
				}
				if (!(value instanceof Animation)) {
					if ((value instanceof Array) || (value && value.push && _isArray(value))) {
						align = align || "normal";
						stagger = stagger || 0;
						curTime = position;
						l = value.length;
						for (i = 0; i < l; i++) {
							if (_isArray(child = value[i])) {
								child = new TimelineLite({tweens:child});
							}
							this.add(child, curTime);
							if (typeof(child) !== "string" && typeof(child) !== "function") {
								if (align === "sequence") {
									curTime = child._startTime + (child.totalDuration() / child._timeScale);
								} else if (align === "start") {
									child._startTime -= child.delay();
								}
							}
							curTime += stagger;
						}
						return this._uncache(true);
					} else if (typeof(value) === "string") {
						return this.addLabel(value, position);
					} else if (typeof(value) === "function") {
						value = TweenLite.delayedCall(0, value);
					} else {
						throw("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
					}
				}

				SimpleTimeline.prototype.add.call(this, value, position);

				if (value._time) { //in case, for example, the _startTime is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
					value.render((this.rawTime() - value._startTime) * value._timeScale, false, false);
				}

				//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
				if (this._gc || this._time === this._duration) if (!this._paused) if (this._duration < this.duration()) {
					//in case any of the ancestors had completed but should now be enabled...
					tl = this;
					beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
					while (tl._timeline) {
						if (beforeRawTime && tl._timeline.smoothChildTiming) {
							tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
						} else if (tl._gc) {
							tl._enabled(true, false);
						}
						tl = tl._timeline;
					}
				}

				return this;
			};

			p.remove = function(value) {
				if (value instanceof Animation) {
					this._remove(value, false);
					var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
					value._startTime = (value._paused ? value._pauseTime : tl._time) - ((!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale); //ensure that if it gets played again, the timing is correct.
					return this;
				} else if (value instanceof Array || (value && value.push && _isArray(value))) {
					var i = value.length;
					while (--i > -1) {
						this.remove(value[i]);
					}
					return this;
				} else if (typeof(value) === "string") {
					return this.removeLabel(value);
				}
				return this.kill(null, value);
			};

			p._remove = function(tween, skipDisable) {
				SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
				var last = this._last;
				if (!last) {
					this._time = this._totalTime = this._duration = this._totalDuration = 0;
				} else if (this._time > this.duration()) {
					this._time = this._duration;
					this._totalTime = this._totalDuration;
				}
				return this;
			};

			p.append = function(value, offsetOrLabel) {
				return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
			};

			p.insert = p.insertMultiple = function(value, position, align, stagger) {
				return this.add(value, position || 0, align, stagger);
			};

			p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
				return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
			};

			p.addLabel = function(label, position) {
				this._labels[label] = this._parseTimeOrLabel(position);
				return this;
			};

			p.addPause = function(position, callback, params, scope) {
				var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
				t.vars.onComplete = t.vars.onReverseComplete = callback;
				t.data = "isPause";
				this._hasPause = true;
				return this.add(t, position);
			};

			p.removeLabel = function(label) {
				delete this._labels[label];
				return this;
			};

			p.getLabelTime = function(label) {
				return (this._labels[label] != null) ? this._labels[label] : -1;
			};

			p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
				var clippedDuration, i;
				//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
				if (ignore instanceof Animation && ignore.timeline === this) {
					this.remove(ignore);
				} else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
					i = ignore.length;
					while (--i > -1) {
						if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
							this.remove(ignore[i]);
						}
					}
				}
				clippedDuration = (typeof(timeOrLabel) === "number" && !offsetOrLabel) ? 0 : (this.duration() > 99999999999) ? this.recent().endTime(false) : this._duration; //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
				if (typeof(offsetOrLabel) === "string") {
					return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - clippedDuration : 0, appendIfAbsent);
				}
				offsetOrLabel = offsetOrLabel || 0;
				if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
					i = timeOrLabel.indexOf("=");
					if (i === -1) {
						if (this._labels[timeOrLabel] == null) {
							return appendIfAbsent ? (this._labels[timeOrLabel] = clippedDuration + offsetOrLabel) : offsetOrLabel;
						}
						return this._labels[timeOrLabel] + offsetOrLabel;
					}
					offsetOrLabel = parseInt(timeOrLabel.charAt(i-1) + "1", 10) * Number(timeOrLabel.substr(i+1));
					timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i-1), 0, appendIfAbsent) : clippedDuration;
				} else if (timeOrLabel == null) {
					timeOrLabel = clippedDuration;
				}
				return Number(timeOrLabel) + offsetOrLabel;
			};

			p.seek = function(position, suppressEvents) {
				return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
			};

			p.stop = function() {
				return this.paused(true);
			};

			p.gotoAndPlay = function(position, suppressEvents) {
				return this.play(position, suppressEvents);
			};

			p.gotoAndStop = function(position, suppressEvents) {
				return this.pause(position, suppressEvents);
			};

			p.render = function(time, suppressEvents, force) {
				if (this._gc) {
					this._enabled(true, false);
				}
				var prevTime = this._time,
					totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
					prevStart = this._startTime,
					prevTimeScale = this._timeScale,
					prevPaused = this._paused,
					tween, isComplete, next, callback, internalForce, pauseTween, curTime;
				if (prevTime !== this._time) { //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
					time += this._time - prevTime;
				}
				if (time >= totalDur - 0.0000001 && time >= 0) { //to work around occasional floating point math artifacts.
					this._totalTime = this._time = totalDur;
					if (!this._reversed) if (!this._hasPausedChild()) {
						isComplete = true;
						callback = "onComplete";
						internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
						if (this._duration === 0) if ((time <= 0 && time >= -0.0000001) || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum) if (this._rawPrevTime !== time && this._first) {
							internalForce = true;
							if (this._rawPrevTime > _tinyNum) {
								callback = "onReverseComplete";
							}
						}
					}
					this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.

				} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
					this._totalTime = this._time = 0;
					if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
						callback = "onReverseComplete";
						isComplete = this._reversed;
					}
					if (time < 0) {
						this._active = false;
						if (this._timeline.autoRemoveChildren && this._reversed) { //ensures proper GC if a timeline is resumed after it's finished reversing.
							internalForce = isComplete = true;
							callback = "onReverseComplete";
						} else if (this._rawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
							internalForce = true;
						}
						this._rawPrevTime = time;
					} else {
						this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
						if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
							tween = this._first;
							while (tween && tween._startTime === 0) {
								if (!tween._duration) {
									isComplete = false;
								}
								tween = tween._next;
							}
						}
						time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
						if (!this._initted) {
							internalForce = true;
						}
					}

				} else {

					if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
						if (time >= prevTime) {
							tween = this._first;
							while (tween && tween._startTime <= time && !pauseTween) {
								if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
									pauseTween = tween;
								}
								tween = tween._next;
							}
						} else {
							tween = this._last;
							while (tween && tween._startTime >= time && !pauseTween) {
								if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
									pauseTween = tween;
								}
								tween = tween._prev;
							}
						}
						if (pauseTween) {
							this._time = time = pauseTween._startTime;
							this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
						}
					}

					this._totalTime = this._time = this._rawPrevTime = time;
				}
				if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
					return;
				} else if (!this._initted) {
					this._initted = true;
				}

				if (!this._active) if (!this._paused && this._time !== prevTime && time > 0) {
					this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
				}

				if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0 || !this._duration) if (!suppressEvents) {
					this._callback("onStart");
				}

				curTime = this._time;
				if (curTime >= prevTime) {
					tween = this._first;
					while (tween) {
						next = tween._next; //record it here because the value could change after rendering...
						if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
							break;
						} else if (tween._active || (tween._startTime <= curTime && !tween._paused && !tween._gc)) {
							if (pauseTween === tween) {
								this.pause();
							}
							if (!tween._reversed) {
								tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
							} else {
								tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
							}
						}
						tween = next;
					}
				} else {
					tween = this._last;
					while (tween) {
						next = tween._prev; //record it here because the value could change after rendering...
						if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
							break;
						} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
							if (pauseTween === tween) {
								pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
								while (pauseTween && pauseTween.endTime() > this._time) {
									pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
									pauseTween = pauseTween._prev;
								}
								pauseTween = null;
								this.pause();
							}
							if (!tween._reversed) {
								tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
							} else {
								tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
							}
						}
						tween = next;
					}
				}

				if (this._onUpdate) if (!suppressEvents) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					this._callback("onUpdate");
				}

				if (callback) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
					if (isComplete) {
						if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
							_lazyRender();
						}
						if (this._timeline.autoRemoveChildren) {
							this._enabled(false, false);
						}
						this._active = false;
					}
					if (!suppressEvents && this.vars[callback]) {
						this._callback(callback);
					}
				}
			};

			p._hasPausedChild = function() {
				var tween = this._first;
				while (tween) {
					if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
						return true;
					}
					tween = tween._next;
				}
				return false;
			};

			p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
				ignoreBeforeTime = ignoreBeforeTime || -9999999999;
				var a = [],
					tween = this._first,
					cnt = 0;
				while (tween) {
					if (tween._startTime < ignoreBeforeTime) {
						//do nothing
					} else if (tween instanceof TweenLite) {
						if (tweens !== false) {
							a[cnt++] = tween;
						}
					} else {
						if (timelines !== false) {
							a[cnt++] = tween;
						}
						if (nested !== false) {
							a = a.concat(tween.getChildren(true, tweens, timelines));
							cnt = a.length;
						}
					}
					tween = tween._next;
				}
				return a;
			};

			p.getTweensOf = function(target, nested) {
				var disabled = this._gc,
					a = [],
					cnt = 0,
					tweens, i;
				if (disabled) {
					this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
				}
				tweens = TweenLite.getTweensOf(target);
				i = tweens.length;
				while (--i > -1) {
					if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
						a[cnt++] = tweens[i];
					}
				}
				if (disabled) {
					this._enabled(false, true);
				}
				return a;
			};

			p.recent = function() {
				return this._recent;
			};

			p._contains = function(tween) {
				var tl = tween.timeline;
				while (tl) {
					if (tl === this) {
						return true;
					}
					tl = tl.timeline;
				}
				return false;
			};

			p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
				ignoreBeforeTime = ignoreBeforeTime || 0;
				var tween = this._first,
					labels = this._labels,
					p;
				while (tween) {
					if (tween._startTime >= ignoreBeforeTime) {
						tween._startTime += amount;
					}
					tween = tween._next;
				}
				if (adjustLabels) {
					for (p in labels) {
						if (labels[p] >= ignoreBeforeTime) {
							labels[p] += amount;
						}
					}
				}
				return this._uncache(true);
			};

			p._kill = function(vars, target) {
				if (!vars && !target) {
					return this._enabled(false, false);
				}
				var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
					i = tweens.length,
					changed = false;
				while (--i > -1) {
					if (tweens[i]._kill(vars, target)) {
						changed = true;
					}
				}
				return changed;
			};

			p.clear = function(labels) {
				var tweens = this.getChildren(false, true, true),
					i = tweens.length;
				this._time = this._totalTime = 0;
				while (--i > -1) {
					tweens[i]._enabled(false, false);
				}
				if (labels !== false) {
					this._labels = {};
				}
				return this._uncache(true);
			};

			p.invalidate = function() {
				var tween = this._first;
				while (tween) {
					tween.invalidate();
					tween = tween._next;
				}
				return Animation.prototype.invalidate.call(this);;
			};

			p._enabled = function(enabled, ignoreTimeline) {
				if (enabled === this._gc) {
					var tween = this._first;
					while (tween) {
						tween._enabled(enabled, true);
						tween = tween._next;
					}
				}
				return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
			};

			p.totalTime = function(time, suppressEvents, uncapped) {
				this._forcingPlayhead = true;
				var val = Animation.prototype.totalTime.apply(this, arguments);
				this._forcingPlayhead = false;
				return val;
			};

			p.duration = function(value) {
				if (!arguments.length) {
					if (this._dirty) {
						this.totalDuration(); //just triggers recalculation
					}
					return this._duration;
				}
				if (this.duration() !== 0 && value !== 0) {
					this.timeScale(this._duration / value);
				}
				return this;
			};

			p.totalDuration = function(value) {
				if (!arguments.length) {
					if (this._dirty) {
						var max = 0,
							tween = this._last,
							prevStart = 999999999999,
							prev, end;
						while (tween) {
							prev = tween._prev; //record it here in case the tween changes position in the sequence...
							if (tween._dirty) {
								tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
							}
							if (tween._startTime > prevStart && this._sortChildren && !tween._paused && !this._calculatingDuration) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
								this._calculatingDuration = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add(), like _parseTimeOrLabel().
								this.add(tween, tween._startTime - tween._delay);
								this._calculatingDuration = 0;
							} else {
								prevStart = tween._startTime;
							}
							if (tween._startTime < 0 && !tween._paused) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
								max -= tween._startTime;
								if (this._timeline.smoothChildTiming) {
									this._startTime += tween._startTime / this._timeScale;
									this._time -= tween._startTime;
									this._totalTime -= tween._startTime;
									this._rawPrevTime -= tween._startTime;
								}
								this.shiftChildren(-tween._startTime, false, -9999999999);
								prevStart = 0;
							}
							end = tween._startTime + (tween._totalDuration / tween._timeScale);
							if (end > max) {
								max = end;
							}
							tween = prev;
						}
						this._duration = this._totalDuration = max;
						this._dirty = false;
					}
					return this._totalDuration;
				}
				return (value && this.totalDuration()) ? this.timeScale(this._totalDuration / value) : this;
			};

			p.paused = function(value) {
				if (!value) { //if there's a pause directly at the spot from where we're unpausing, skip it.
					var tween = this._first,
						time = this._time;
					while (tween) {
						if (tween._startTime === time && tween.data === "isPause") {
							tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
						}
						tween = tween._next;
					}
				}
				return Animation.prototype.paused.apply(this, arguments);
			};

			p.usesFrames = function() {
				var tl = this._timeline;
				while (tl._timeline) {
					tl = tl._timeline;
				}
				return (tl === Animation._rootFramesTimeline);
			};

			p.rawTime = function(wrapRepeats) {
				return (wrapRepeats && (this._paused || (this._repeat && this.time() > 0 && this.totalProgress() < 1))) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(wrapRepeats) - this._startTime) * this._timeScale;
			};

			return TimelineLite;

		}, true);








		
		
		
		
		
	/*
	 * ----------------------------------------------------------------
	 * TimelineMax
	 * ----------------------------------------------------------------
	 */
		_gsScope._gsDefine("TimelineMax", ["TimelineLite","TweenLite","easing.Ease"], function(TimelineLite, TweenLite, Ease) {

			var TimelineMax = function(vars) {
					TimelineLite.call(this, vars);
					this._repeat = this.vars.repeat || 0;
					this._repeatDelay = this.vars.repeatDelay || 0;
					this._cycle = 0;
					this._yoyo = (this.vars.yoyo === true);
					this._dirty = true;
				},
				_tinyNum = 0.0000000001,
				TweenLiteInternals = TweenLite._internals,
				_lazyTweens = TweenLiteInternals.lazyTweens,
				_lazyRender = TweenLiteInternals.lazyRender,
				_globals = _gsScope._gsDefine.globals,
				_easeNone = new Ease(null, null, 1, 0),
				p = TimelineMax.prototype = new TimelineLite();

			p.constructor = TimelineMax;
			p.kill()._gc = false;
			TimelineMax.version = "1.20.4";

			p.invalidate = function() {
				this._yoyo = (this.vars.yoyo === true);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._uncache(true);
				return TimelineLite.prototype.invalidate.call(this);
			};

			p.addCallback = function(callback, position, params, scope) {
				return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
			};

			p.removeCallback = function(callback, position) {
				if (callback) {
					if (position == null) {
						this._kill(null, callback);
					} else {
						var a = this.getTweensOf(callback, false),
							i = a.length,
							time = this._parseTimeOrLabel(position);
						while (--i > -1) {
							if (a[i]._startTime === time) {
								a[i]._enabled(false, false);
							}
						}
					}
				}
				return this;
			};

			p.removePause = function(position) {
				return this.removeCallback(TimelineLite._internals.pauseCallback, position);
			};

			p.tweenTo = function(position, vars) {
				vars = vars || {};
				var copy = {ease:_easeNone, useFrames:this.usesFrames(), immediateRender:false, lazy:false},
					Engine = (vars.repeat && _globals.TweenMax) || TweenLite,
					duration, p, t;
				for (p in vars) {
					copy[p] = vars[p];
				}
				copy.time = this._parseTimeOrLabel(position);
				duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
				t = new Engine(this, duration, copy);
				copy.onStart = function() {
					t.target.paused(true);
					if (t.vars.time !== t.target.time() && duration === t.duration() && !t.isFromTo) { //don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
						t.duration( Math.abs( t.vars.time - t.target.time()) / t.target._timeScale ).render(t.time(), true, true); //render() right away to ensure that things look right, especially in the case of .tweenTo(0).
					}
					if (vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
						vars.onStart.apply(vars.onStartScope || vars.callbackScope || t, vars.onStartParams || []); //don't use t._callback("onStart") or it'll point to the copy.onStart and we'll get a recursion error.
					}
				};
				return t;
			};

			p.tweenFromTo = function(fromPosition, toPosition, vars) {
				vars = vars || {};
				fromPosition = this._parseTimeOrLabel(fromPosition);
				vars.startAt = {onComplete:this.seek, onCompleteParams:[fromPosition], callbackScope:this};
				vars.immediateRender = (vars.immediateRender !== false);
				var t = this.tweenTo(toPosition, vars);
				t.isFromTo = 1; //to ensure we don't mess with the duration in the onStart (we've got the start and end values here, so lock it in)
				return t.duration((Math.abs( t.vars.time - fromPosition) / this._timeScale) || 0.001);
			};

			p.render = function(time, suppressEvents, force) {
				if (this._gc) {
					this._enabled(true, false);
				}
				var prevTime = this._time,
					totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
					dur = this._duration,
					prevTotalTime = this._totalTime,
					prevStart = this._startTime,
					prevTimeScale = this._timeScale,
					prevRawPrevTime = this._rawPrevTime,
					prevPaused = this._paused,
					prevCycle = this._cycle,
					tween, isComplete, next, callback, internalForce, cycleDuration, pauseTween, curTime;
				if (prevTime !== this._time) { //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
					time += this._time - prevTime;
				}
				if (time >= totalDur - 0.0000001 && time >= 0) { //to work around occasional floating point math artifacts.
					if (!this._locked) {
						this._totalTime = totalDur;
						this._cycle = this._repeat;
					}
					if (!this._reversed) if (!this._hasPausedChild()) {
						isComplete = true;
						callback = "onComplete";
						internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
						if (this._duration === 0) if ((time <= 0 && time >= -0.0000001) || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time && this._first) {
							internalForce = true;
							if (prevRawPrevTime > _tinyNum) {
								callback = "onReverseComplete";
							}
						}
					}
					this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (this._yoyo && (this._cycle & 1) !== 0) {
						this._time = time = 0;
					} else {
						this._time = dur;
						time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
					}

				} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
					if (!this._locked) {
						this._totalTime = this._cycle = 0;
					}
					this._time = 0;
					if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !this._locked)) { //edge case for checking time < 0 && prevRawPrevTime >= 0: a zero-duration fromTo() tween inside a zero-duration timeline (yeah, very rare)
						callback = "onReverseComplete";
						isComplete = this._reversed;
					}
					if (time < 0) {
						this._active = false;
						if (this._timeline.autoRemoveChildren && this._reversed) {
							internalForce = isComplete = true;
							callback = "onReverseComplete";
						} else if (prevRawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
							internalForce = true;
						}
						this._rawPrevTime = time;
					} else {
						this._rawPrevTime = (dur || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
						if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
							tween = this._first;
							while (tween && tween._startTime === 0) {
								if (!tween._duration) {
									isComplete = false;
								}
								tween = tween._next;
							}
						}
						time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
						if (!this._initted) {
							internalForce = true;
						}
					}

				} else {
					if (dur === 0 && prevRawPrevTime < 0) { //without this, zero-duration repeating timelines (like with a simple callback nested at the very beginning and a repeatDelay) wouldn't render the first time through.
						internalForce = true;
					}
					this._time = this._rawPrevTime = time;
					if (!this._locked) {
						this._totalTime = time;
						if (this._repeat !== 0) {
							cycleDuration = dur + this._repeatDelay;
							this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
							if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
								this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
							}
							this._time = this._totalTime - (this._cycle * cycleDuration);
							if (this._yoyo) if ((this._cycle & 1) !== 0) {
								this._time = dur - this._time;
							}
							if (this._time > dur) {
								this._time = dur;
								time = dur + 0.0001; //to avoid occasional floating point rounding error
							} else if (this._time < 0) {
								this._time = time = 0;
							} else {
								time = this._time;
							}
						}
					}

					if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
						time = this._time;
						if (time >= prevTime || (this._repeat && prevCycle !== this._cycle)) {
							tween = this._first;
							while (tween && tween._startTime <= time && !pauseTween) {
								if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
									pauseTween = tween;
								}
								tween = tween._next;
							}
						} else {
							tween = this._last;
							while (tween && tween._startTime >= time && !pauseTween) {
								if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
									pauseTween = tween;
								}
								tween = tween._prev;
							}
						}
						if (pauseTween && pauseTween._startTime < dur) {
							this._time = time = pauseTween._startTime;
							this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
						}
					}

				}

				if (this._cycle !== prevCycle) if (!this._locked) {
					/*
					make sure children at the end/beginning of the timeline are rendered properly. If, for example,
					a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
					would get transated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
					could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
					we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
					ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
					*/
					var backwards = (this._yoyo && (prevCycle & 1) !== 0),
						wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)),
						recTotalTime = this._totalTime,
						recCycle = this._cycle,
						recRawPrevTime = this._rawPrevTime,
						recTime = this._time;

					this._totalTime = prevCycle * dur;
					if (this._cycle < prevCycle) {
						backwards = !backwards;
					} else {
						this._totalTime += dur;
					}
					this._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

					this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
					this._cycle = prevCycle;
					this._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
					prevTime = (backwards) ? 0 : dur;
					this.render(prevTime, suppressEvents, (dur === 0));
					if (!suppressEvents) if (!this._gc) {
						if (this.vars.onRepeat) {
							this._cycle = recCycle; //in case the onRepeat alters the playhead or invalidates(), we shouldn't stay locked or use the previous cycle.
							this._locked = false;
							this._callback("onRepeat");
						}
					}
					if (prevTime !== this._time) { //in case there's a callback like onComplete in a nested tween/timeline that changes the playhead position, like via seek(), we should just abort.
						return;
					}
					if (wrap) {
						this._cycle = prevCycle; //if there's an onRepeat, we reverted this above, so make sure it's set properly again. We also unlocked in that scenario, so reset that too.
						this._locked = true;
						prevTime = (backwards) ? dur + 0.0001 : -0.0001;
						this.render(prevTime, true, false);
					}
					this._locked = false;
					if (this._paused && !prevPaused) { //if the render() triggered callback that paused this timeline, we should abort (very rare, but possible)
						return;
					}
					this._time = recTime;
					this._totalTime = recTotalTime;
					this._cycle = recCycle;
					this._rawPrevTime = recRawPrevTime;
				}

				if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
					if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
						this._callback("onUpdate");
					}
					return;
				} else if (!this._initted) {
					this._initted = true;
				}

				if (!this._active) if (!this._paused && this._totalTime !== prevTotalTime && time > 0) {
					this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
				}

				if (prevTotalTime === 0) if (this.vars.onStart) if (this._totalTime !== 0 || !this._totalDuration) if (!suppressEvents) {
					this._callback("onStart");
				}

				curTime = this._time;
				if (curTime >= prevTime) {
					tween = this._first;
					while (tween) {
						next = tween._next; //record it here because the value could change after rendering...
						if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
							break;
						} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
							if (pauseTween === tween) {
								this.pause();
							}
							if (!tween._reversed) {
								tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
							} else {
								tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
							}
						}
						tween = next;
					}
				} else {
					tween = this._last;
					while (tween) {
						next = tween._prev; //record it here because the value could change after rendering...
						if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
							break;
						} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
							if (pauseTween === tween) {
								pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
								while (pauseTween && pauseTween.endTime() > this._time) {
									pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
									pauseTween = pauseTween._prev;
								}
								pauseTween = null;
								this.pause();
							}
							if (!tween._reversed) {
								tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
							} else {
								tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
							}
						}
						tween = next;
					}
				}

				if (this._onUpdate) if (!suppressEvents) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					this._callback("onUpdate");
				}
				if (callback) if (!this._locked) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
					if (isComplete) {
						if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
							_lazyRender();
						}
						if (this._timeline.autoRemoveChildren) {
							this._enabled(false, false);
						}
						this._active = false;
					}
					if (!suppressEvents && this.vars[callback]) {
						this._callback(callback);
					}
				}
			};

			p.getActive = function(nested, tweens, timelines) {
				if (nested == null) {
					nested = true;
				}
				if (tweens == null) {
					tweens = true;
				}
				if (timelines == null) {
					timelines = false;
				}
				var a = [],
					all = this.getChildren(nested, tweens, timelines),
					cnt = 0,
					l = all.length,
					i, tween;
				for (i = 0; i < l; i++) {
					tween = all[i];
					if (tween.isActive()) {
						a[cnt++] = tween;
					}
				}
				return a;
			};


			p.getLabelAfter = function(time) {
				if (!time) if (time !== 0) { //faster than isNan()
					time = this._time;
				}
				var labels = this.getLabelsArray(),
					l = labels.length,
					i;
				for (i = 0; i < l; i++) {
					if (labels[i].time > time) {
						return labels[i].name;
					}
				}
				return null;
			};

			p.getLabelBefore = function(time) {
				if (time == null) {
					time = this._time;
				}
				var labels = this.getLabelsArray(),
					i = labels.length;
				while (--i > -1) {
					if (labels[i].time < time) {
						return labels[i].name;
					}
				}
				return null;
			};

			p.getLabelsArray = function() {
				var a = [],
					cnt = 0,
					p;
				for (p in this._labels) {
					a[cnt++] = {time:this._labels[p], name:p};
				}
				a.sort(function(a,b) {
					return a.time - b.time;
				});
				return a;
			};

			p.invalidate = function() {
				this._locked = false; //unlock and set cycle in case invalidate() is called from inside an onRepeat
				return TimelineLite.prototype.invalidate.call(this);
			};


	//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

			p.progress = function(value, suppressEvents) {
				return (!arguments.length) ? (this._time / this.duration()) || 0 : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
			};

			p.totalProgress = function(value, suppressEvents) {
				return (!arguments.length) ? (this._totalTime / this.totalDuration()) || 0 : this.totalTime( this.totalDuration() * value, suppressEvents);
			};

			p.totalDuration = function(value) {
				if (!arguments.length) {
					if (this._dirty) {
						TimelineLite.prototype.totalDuration.call(this); //just forces refresh
						//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
						this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
					}
					return this._totalDuration;
				}
				return (this._repeat === -1 || !value) ? this : this.timeScale( this.totalDuration() / value );
			};

			p.time = function(value, suppressEvents) {
				if (!arguments.length) {
					return this._time;
				}
				if (this._dirty) {
					this.totalDuration();
				}
				if (value > this._duration) {
					value = this._duration;
				}
				if (this._yoyo && (this._cycle & 1) !== 0) {
					value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
				} else if (this._repeat !== 0) {
					value += this._cycle * (this._duration + this._repeatDelay);
				}
				return this.totalTime(value, suppressEvents);
			};

			p.repeat = function(value) {
				if (!arguments.length) {
					return this._repeat;
				}
				this._repeat = value;
				return this._uncache(true);
			};

			p.repeatDelay = function(value) {
				if (!arguments.length) {
					return this._repeatDelay;
				}
				this._repeatDelay = value;
				return this._uncache(true);
			};

			p.yoyo = function(value) {
				if (!arguments.length) {
					return this._yoyo;
				}
				this._yoyo = value;
				return this;
			};

			p.currentLabel = function(value) {
				if (!arguments.length) {
					return this.getLabelBefore(this._time + 0.00000001);
				}
				return this.seek(value, true);
			};

			return TimelineMax;

		}, true);
		




		
		
		
		
		

		
	/*
	 * ----------------------------------------------------------------
	 * BezierPlugin
	 * ----------------------------------------------------------------
	 */
		(function() {

			var _RAD2DEG = 180 / Math.PI,
				_r1 = [],
				_r2 = [],
				_r3 = [],
				_corProps = {},
				_globals = _gsScope._gsDefine.globals,
				Segment = function(a, b, c, d) {
					if (c === d) { //if c and d match, the final autoRotate value could lock at -90 degrees, so differentiate them slightly.
						c = d - (d - b) / 1000000;
					}
					if (a === b) { //if a and b match, the starting autoRotate value could lock at -90 degrees, so differentiate them slightly.
						b = a + (c - a) / 1000000;
					}
					this.a = a;
					this.b = b;
					this.c = c;
					this.d = d;
					this.da = d - a;
					this.ca = c - a;
					this.ba = b - a;
				},
				_correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
				cubicToQuadratic = function(a, b, c, d) {
					var q1 = {a:a},
						q2 = {},
						q3 = {},
						q4 = {c:d},
						mab = (a + b) / 2,
						mbc = (b + c) / 2,
						mcd = (c + d) / 2,
						mabc = (mab + mbc) / 2,
						mbcd = (mbc + mcd) / 2,
						m8 = (mbcd - mabc) / 8;
					q1.b = mab + (a - mab) / 4;
					q2.b = mabc + m8;
					q1.c = q2.a = (q1.b + q2.b) / 2;
					q2.c = q3.a = (mabc + mbcd) / 2;
					q3.b = mbcd - m8;
					q4.b = mcd + (d - mcd) / 4;
					q3.c = q4.a = (q3.b + q4.b) / 2;
					return [q1, q2, q3, q4];
				},
				_calculateControlPoints = function(a, curviness, quad, basic, correlate) {
					var l = a.length - 1,
						ii = 0,
						cp1 = a[0].a,
						i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
					for (i = 0; i < l; i++) {
						seg = a[ii];
						p1 = seg.a;
						p2 = seg.d;
						p3 = a[ii+1].d;

						if (correlate) {
							r1 = _r1[i];
							r2 = _r2[i];
							tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
							m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
							m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
							mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
						} else {
							m1 = p2 - (p2 - p1) * curviness * 0.5;
							m2 = p2 + (p3 - p2) * curviness * 0.5;
							mm = p2 - (m1 + m2) / 2;
						}
						m1 += mm;
						m2 += mm;

						seg.c = cp2 = m1;
						if (i !== 0) {
							seg.b = cp1;
						} else {
							seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
						}

						seg.da = p2 - p1;
						seg.ca = cp2 - p1;
						seg.ba = cp1 - p1;

						if (quad) {
							qb = cubicToQuadratic(p1, cp1, cp2, p2);
							a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
							ii += 4;
						} else {
							ii++;
						}

						cp1 = m2;
					}
					seg = a[ii];
					seg.b = cp1;
					seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
					seg.da = seg.d - seg.a;
					seg.ca = seg.c - seg.a;
					seg.ba = cp1 - seg.a;
					if (quad) {
						qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
						a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
					}
				},
				_parseAnchors = function(values, p, correlate, prepend) {
					var a = [],
						l, i, p1, p2, p3, tmp;
					if (prepend) {
						values = [prepend].concat(values);
						i = values.length;
						while (--i > -1) {
							if (typeof( (tmp = values[i][p]) ) === "string") if (tmp.charAt(1) === "=") {
								values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
							}
						}
					}
					l = values.length - 2;
					if (l < 0) {
						a[0] = new Segment(values[0][p], 0, 0, values[0][p]);
						return a;
					}
					for (i = 0; i < l; i++) {
						p1 = values[i][p];
						p2 = values[i+1][p];
						a[i] = new Segment(p1, 0, 0, p2);
						if (correlate) {
							p3 = values[i+2][p];
							_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
							_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
						}
					}
					a[i] = new Segment(values[i][p], 0, 0, values[i+1][p]);
					return a;
				},
				bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
					var obj = {},
						props = [],
						first = prepend || values[0],
						i, p, a, j, r, l, seamless, last;
					correlate = (typeof(correlate) === "string") ? ","+correlate+"," : _correlate;
					if (curviness == null) {
						curviness = 1;
					}
					for (p in values[0]) {
						props.push(p);
					}
					//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
					if (values.length > 1) {
						last = values[values.length - 1];
						seamless = true;
						i = props.length;
						while (--i > -1) {
							p = props[i];
							if (Math.abs(first[p] - last[p]) > 0.05) { //build in a tolerance of +/-0.05 to accommodate rounding errors.
								seamless = false;
								break;
							}
						}
						if (seamless) {
							values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
							if (prepend) {
								values.unshift(prepend);
							}
							values.push(values[1]);
							prepend = values[values.length - 3];
						}
					}
					_r1.length = _r2.length = _r3.length = 0;
					i = props.length;
					while (--i > -1) {
						p = props[i];
						_corProps[p] = (correlate.indexOf(","+p+",") !== -1);
						obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
					}
					i = _r1.length;
					while (--i > -1) {
						_r1[i] = Math.sqrt(_r1[i]);
						_r2[i] = Math.sqrt(_r2[i]);
					}
					if (!basic) {
						i = props.length;
						while (--i > -1) {
							if (_corProps[p]) {
								a = obj[props[i]];
								l = a.length - 1;
								for (j = 0; j < l; j++) {
									r = (a[j+1].da / _r2[j] + a[j].da / _r1[j]) || 0;
									_r3[j] = (_r3[j] || 0) + r * r;
								}
							}
						}
						i = _r3.length;
						while (--i > -1) {
							_r3[i] = Math.sqrt(_r3[i]);
						}
					}
					i = props.length;
					j = quadratic ? 4 : 1;
					while (--i > -1) {
						p = props[i];
						a = obj[p];
						_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
						if (seamless) {
							a.splice(0, j);
							a.splice(a.length - j, j);
						}
					}
					return obj;
				},
				_parseBezierData = function(values, type, prepend) {
					type = type || "soft";
					var obj = {},
						inc = (type === "cubic") ? 3 : 2,
						soft = (type === "soft"),
						props = [],
						a, b, c, d, cur, i, j, l, p, cnt, tmp;
					if (soft && prepend) {
						values = [prepend].concat(values);
					}
					if (values == null || values.length < inc + 1) { throw "invalid Bezier data"; }
					for (p in values[0]) {
						props.push(p);
					}
					i = props.length;
					while (--i > -1) {
						p = props[i];
						obj[p] = cur = [];
						cnt = 0;
						l = values.length;
						for (j = 0; j < l; j++) {
							a = (prepend == null) ? values[j][p] : (typeof( (tmp = values[j][p]) ) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
							if (soft) if (j > 1) if (j < l - 1) {
								cur[cnt++] = (a + cur[cnt-2]) / 2;
							}
							cur[cnt++] = a;
						}
						l = cnt - inc + 1;
						cnt = 0;
						for (j = 0; j < l; j += inc) {
							a = cur[j];
							b = cur[j+1];
							c = cur[j+2];
							d = (inc === 2) ? 0 : cur[j+3];
							cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
						}
						cur.length = cnt;
					}
					return obj;
				},
				_addCubicLengths = function(a, steps, resolution) {
					var inc = 1 / resolution,
						j = a.length,
						d, d1, s, da, ca, ba, p, i, inv, bez, index;
					while (--j > -1) {
						bez = a[j];
						s = bez.a;
						da = bez.d - s;
						ca = bez.c - s;
						ba = bez.b - s;
						d = d1 = 0;
						for (i = 1; i <= resolution; i++) {
							p = inc * i;
							inv = 1 - p;
							d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
							index = j * resolution + i - 1;
							steps[index] = (steps[index] || 0) + d * d;
						}
					}
				},
				_parseLengthData = function(obj, resolution) {
					resolution = resolution >> 0 || 6;
					var a = [],
						lengths = [],
						d = 0,
						total = 0,
						threshold = resolution - 1,
						segments = [],
						curLS = [], //current length segments array
						p, i, l, index;
					for (p in obj) {
						_addCubicLengths(obj[p], a, resolution);
					}
					l = a.length;
					for (i = 0; i < l; i++) {
						d += Math.sqrt(a[i]);
						index = i % resolution;
						curLS[index] = d;
						if (index === threshold) {
							total += d;
							index = (i / resolution) >> 0;
							segments[index] = curLS;
							lengths[index] = total;
							d = 0;
							curLS = [];
						}
					}
					return {length:total, lengths:lengths, segments:segments};
				},



				BezierPlugin = _gsScope._gsDefine.plugin({
						propName: "bezier",
						priority: -1,
						version: "1.3.8",
						API: 2,
						global:true,

						//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
						init: function(target, vars, tween) {
							this._target = target;
							if (vars instanceof Array) {
								vars = {values:vars};
							}
							this._func = {};
							this._mod = {};
							this._props = [];
							this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
							var values = vars.values || [],
								first = {},
								second = values[0],
								autoRotate = vars.autoRotate || tween.vars.orientToBezier,
								p, isFunc, i, j, prepend;

							this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [["x","y","rotation",((autoRotate === true) ? 0 : Number(autoRotate) || 0)]] : null;
							for (p in second) {
								this._props.push(p);
							}

							i = this._props.length;
							while (--i > -1) {
								p = this._props[i];

								this._overwriteProps.push(p);
								isFunc = this._func[p] = (typeof(target[p]) === "function");
								first[p] = (!isFunc) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
								if (!prepend) if (first[p] !== values[0][p]) {
									prepend = first;
								}
							}
							this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
							this._segCount = this._beziers[p].length;

							if (this._timeRes) {
								var ld = _parseLengthData(this._beziers, this._timeRes);
								this._length = ld.length;
								this._lengths = ld.lengths;
								this._segments = ld.segments;
								this._l1 = this._li = this._s1 = this._si = 0;
								this._l2 = this._lengths[0];
								this._curSeg = this._segments[0];
								this._s2 = this._curSeg[0];
								this._prec = 1 / this._curSeg.length;
							}

							if ((autoRotate = this._autoRotate)) {
								this._initialRotations = [];
								if (!(autoRotate[0] instanceof Array)) {
									this._autoRotate = autoRotate = [autoRotate];
								}
								i = autoRotate.length;
								while (--i > -1) {
									for (j = 0; j < 3; j++) {
										p = autoRotate[i][j];
										this._func[p] = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ] : false;
									}
									p = autoRotate[i][2];
									this._initialRotations[i] = (this._func[p] ? this._func[p].call(this._target) : this._target[p]) || 0;
									this._overwriteProps.push(p);
								}
							}
							this._startRatio = tween.vars.runBackwards ? 1 : 0; //we determine the starting ratio when the tween inits which is always 0 unless the tween has runBackwards:true (indicating it's a from() tween) in which case it's 1.
							return true;
						},

						//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
						set: function(v) {
							var segments = this._segCount,
								func = this._func,
								target = this._target,
								notStart = (v !== this._startRatio),
								curIndex, inv, i, p, b, t, val, l, lengths, curSeg;
							if (!this._timeRes) {
								curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
								t = (v - (curIndex * (1 / segments))) * segments;
							} else {
								lengths = this._lengths;
								curSeg = this._curSeg;
								v *= this._length;
								i = this._li;
								//find the appropriate segment (if the currently cached one isn't correct)
								if (v > this._l2 && i < segments - 1) {
									l = segments - 1;
									while (i < l && (this._l2 = lengths[++i]) <= v) {	}
									this._l1 = lengths[i-1];
									this._li = i;
									this._curSeg = curSeg = this._segments[i];
									this._s2 = curSeg[(this._s1 = this._si = 0)];
								} else if (v < this._l1 && i > 0) {
									while (i > 0 && (this._l1 = lengths[--i]) >= v) { }
									if (i === 0 && v < this._l1) {
										this._l1 = 0;
									} else {
										i++;
									}
									this._l2 = lengths[i];
									this._li = i;
									this._curSeg = curSeg = this._segments[i];
									this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
									this._s2 = curSeg[this._si];
								}
								curIndex = i;
								//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
								v -= this._l1;
								i = this._si;
								if (v > this._s2 && i < curSeg.length - 1) {
									l = curSeg.length - 1;
									while (i < l && (this._s2 = curSeg[++i]) <= v) {	}
									this._s1 = curSeg[i-1];
									this._si = i;
								} else if (v < this._s1 && i > 0) {
									while (i > 0 && (this._s1 = curSeg[--i]) >= v) {	}
									if (i === 0 && v < this._s1) {
										this._s1 = 0;
									} else {
										i++;
									}
									this._s2 = curSeg[i];
									this._si = i;
								}
								t = ((i + (v - this._s1) / (this._s2 - this._s1)) * this._prec) || 0;
							}
							inv = 1 - t;

							i = this._props.length;
							while (--i > -1) {
								p = this._props[i];
								b = this._beziers[p][curIndex];
								val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
								if (this._mod[p]) {
									val = this._mod[p](val, target);
								}
								if (func[p]) {
									target[p](val);
								} else {
									target[p] = val;
								}
							}

							if (this._autoRotate) {
								var ar = this._autoRotate,
									b2, x1, y1, x2, y2, add, conv;
								i = ar.length;
								while (--i > -1) {
									p = ar[i][2];
									add = ar[i][3] || 0;
									conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
									b = this._beziers[ar[i][0]];
									b2 = this._beziers[ar[i][1]];

									if (b && b2) { //in case one of the properties got overwritten.
										b = b[curIndex];
										b2 = b2[curIndex];

										x1 = b.a + (b.b - b.a) * t;
										x2 = b.b + (b.c - b.b) * t;
										x1 += (x2 - x1) * t;
										x2 += ((b.c + (b.d - b.c) * t) - x2) * t;

										y1 = b2.a + (b2.b - b2.a) * t;
										y2 = b2.b + (b2.c - b2.b) * t;
										y1 += (y2 - y1) * t;
										y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;

										val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];

										if (this._mod[p]) {
											val = this._mod[p](val, target); //for modProps
										}

										if (func[p]) {
											target[p](val);
										} else {
											target[p] = val;
										}
									}
								}
							}
						}
				}),
				p = BezierPlugin.prototype;


			BezierPlugin.bezierThrough = bezierThrough;
			BezierPlugin.cubicToQuadratic = cubicToQuadratic;
			BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
			BezierPlugin.quadraticToCubic = function(a, b, c) {
				return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
			};

			BezierPlugin._cssRegister = function() {
				var CSSPlugin = _globals.CSSPlugin;
				if (!CSSPlugin) {
					return;
				}
				var _internals = CSSPlugin._internals,
					_parseToProxy = _internals._parseToProxy,
					_setPluginRatio = _internals._setPluginRatio,
					CSSPropTween = _internals.CSSPropTween;
				_internals._registerComplexSpecialProp("bezier", {parser:function(t, e, prop, cssp, pt, plugin) {
					if (e instanceof Array) {
						e = {values:e};
					}
					plugin = new BezierPlugin();
					var values = e.values,
						l = values.length - 1,
						pluginValues = [],
						v = {},
						i, p, data;
					if (l < 0) {
						return pt;
					}
					for (i = 0; i <= l; i++) {
						data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
						pluginValues[i] = data.end;
					}
					for (p in e) {
						v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
					}
					v.values = pluginValues;
					pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
					pt.data = data;
					pt.plugin = plugin;
					pt.setRatio = _setPluginRatio;
					if (v.autoRotate === 0) {
						v.autoRotate = true;
					}
					if (v.autoRotate && !(v.autoRotate instanceof Array)) {
						i = (v.autoRotate === true) ? 0 : Number(v.autoRotate);
						v.autoRotate = (data.end.left != null) ? [["left","top","rotation",i,false]] : (data.end.x != null) ? [["x","y","rotation",i,false]] : false;
					}
					if (v.autoRotate) {
						if (!cssp._transform) {
							cssp._enableTransforms(false);
						}
						data.autoRotate = cssp._target._gsTransform;
						data.proxy.rotation = data.autoRotate.rotation || 0;
						cssp._overwriteProps.push("rotation");
					}
					plugin._onInitTween(data.proxy, v, cssp._tween);
					return pt;
				}});
			};

			p._mod = function(lookup) {
				var op = this._overwriteProps,
					i = op.length,
					val;
				while (--i > -1) {
					val = lookup[op[i]];
					if (val && typeof(val) === "function") {
						this._mod[op[i]] = val;
					}
				}
			};

			p._kill = function(lookup) {
				var a = this._props,
					p, i;
				for (p in this._beziers) {
					if (p in lookup) {
						delete this._beziers[p];
						delete this._func[p];
						i = a.length;
						while (--i > -1) {
							if (a[i] === p) {
								a.splice(i, 1);
							}
						}
					}
				}
				a = this._autoRotate;
				if (a) {
					i = a.length;
					while (--i > -1) {
						if (lookup[a[i][2]]) {
							a.splice(i, 1);
						}
					}
				}
				return this._super._kill.call(this, lookup);
			};

		}());






		
		
		
		
		
		
		
		
	/*
	 * ----------------------------------------------------------------
	 * CSSPlugin
	 * ----------------------------------------------------------------
	 */
		_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function(TweenPlugin, TweenLite) {

			/** @constructor **/
			var CSSPlugin = function() {
					TweenPlugin.call(this, "css");
					this._overwriteProps.length = 0;
					this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
				},
				_globals = _gsScope._gsDefine.globals,
				_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
				_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
				_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
				_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
				_specialProps = {},
				p = CSSPlugin.prototype = new TweenPlugin("css");

			p.constructor = CSSPlugin;
			CSSPlugin.version = "1.20.5";
			CSSPlugin.API = 2;
			CSSPlugin.defaultTransformPerspective = 0;
			CSSPlugin.defaultSkewType = "compensated";
			CSSPlugin.defaultSmoothOrigin = true;
			p = "px"; //we'll reuse the "p" variable to keep file size down
			CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p, lineHeight:""};


			var _numExp = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
				_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
				_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
				_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
				_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
				_opacityExp = /opacity *= *([^)]*)/i,
				_opacityValExp = /opacity:([^;]*)/i,
				_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
				_rgbhslExp = /^(rgb|hsl)/,
				_capsExp = /([A-Z])/g,
				_camelExp = /-([a-z])/gi,
				_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
				_camelFunc = function(s, g) { return g.toUpperCase(); },
				_horizExp = /(?:Left|Right|Width)/i,
				_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
				_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
				_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
				_complexExp = /[\s,\(]/i, //for testing a string to find if it has a space, comma, or open parenthesis (clues that it's a complex value)
				_DEG2RAD = Math.PI / 180,
				_RAD2DEG = 180 / Math.PI,
				_forcePT = {},
				_dummyElement = {style:{}},
				_doc = _gsScope.document || {createElement: function() {return _dummyElement;}},
				_createElement = function(type, ns) {
					return _doc.createElementNS ? _doc.createElementNS(ns || "http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
				},
				_tempDiv = _createElement("div"),
				_tempImg = _createElement("img"),
				_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
				_agent = (_gsScope.navigator || {}).userAgent || "",
				_autoRound,
				_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

				_isSafari,
				_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
				_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
				_ieVers,
				_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
					var i = _agent.indexOf("Android"),
						a = _createElement("a");
					_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || parseFloat(_agent.substr(i+8, 2)) > 3));
					_isSafariLT6 = (_isSafari && (parseFloat(_agent.substr(_agent.indexOf("Version/")+8, 2)) < 6));
					_isFirefox = (_agent.indexOf("Firefox") !== -1);
					if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent) || (/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
						_ieVers = parseFloat( RegExp.$1 );
					}
					if (!a) {
						return false;
					}
					a.style.cssText = "top:1px;opacity:.55;";
					return /^0.55/.test(a.style.opacity);
				}()),
				_getIEOpacity = function(v) {
					return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
				},
				_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
					if (_gsScope.console) {
						console.log(s);
					}
				},
				_target, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params
				_index, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params

				_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
				_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

				// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
				_checkPropPrefix = function(p, e) {
					e = e || _tempDiv;
					var s = e.style,
						a, i;
					if (s[p] !== undefined) {
						return p;
					}
					p = p.charAt(0).toUpperCase() + p.substr(1);
					a = ["O","Moz","ms","Ms","Webkit"];
					i = 5;
					while (--i > -1 && s[a[i]+p] === undefined) { }
					if (i >= 0) {
						_prefix = (i === 3) ? "ms" : a[i];
						_prefixCSS = "-" + _prefix.toLowerCase() + "-";
						return _prefix + p;
					}
					return null;
				},

				_getComputedStyle = (typeof(window) !== "undefined" ? window : _doc.defaultView || {getComputedStyle:function() {}}).getComputedStyle,

				/**
				 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
				 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
				 *
				 * @param {!Object} t Target element whose style property you want to query
				 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
				 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
				 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
				 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
				 * @return {?string} The current property value
				 */
				_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
					var rv;
					if (!_supportsOpacity) if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
						return _getIEOpacity(t);
					}
					if (!calc && t.style[p]) {
						rv = t.style[p];
					} else if ((cs = cs || _getComputedStyle(t))) {
						rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
					} else if (t.currentStyle) {
						rv = t.currentStyle[p];
					}
					return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
				},

				/**
				 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
				 * @param {!Object} t Target element
				 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
				 * @param {!number} v Value
				 * @param {string=} sfx Suffix (like "px" or "%" or "em")
				 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
				 * @return {number} value in pixels
				 */
				_convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
					if (sfx === "px" || (!sfx && p !== "lineHeight")) { return v; }
					if (sfx === "auto" || !v) { return 0; }
					var horiz = _horizExp.test(p),
						node = t,
						style = _tempDiv.style,
						neg = (v < 0),
						precise = (v === 1),
						pix, cache, time;
					if (neg) {
						v = -v;
					}
					if (precise) {
						v *= 100;
					}
					if (p === "lineHeight" && !sfx) { //special case of when a simple lineHeight (without a unit) is used. Set it to the value, read back the computed value, and then revert.
						cache = _getComputedStyle(t).lineHeight;
						t.style.lineHeight = v;
						pix = parseFloat(_getComputedStyle(t).lineHeight);
						t.style.lineHeight = cache;
					} else if (sfx === "%" && p.indexOf("border") !== -1) {
						pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
					} else {
						style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
						if (sfx === "%" || !node.appendChild || sfx.charAt(0) === "v" || sfx === "rem") {
							node = t.parentNode || _doc.body;
							if (_getStyle(node, "display").indexOf("flex") !== -1) { //Edge and IE11 have a bug that causes offsetWidth to report as 0 if the container has display:flex and the child is position:relative. Switching to position: absolute solves it.
								style.position = "absolute";
							}
							cache = node._gsCache;
							time = TweenLite.ticker.frame;
							if (cache && horiz && cache.time === time) { //performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
								return cache.width * v / 100;
							}
							style[(horiz ? "width" : "height")] = v + sfx;
						} else {
							style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
						}
						node.appendChild(_tempDiv);
						pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
						node.removeChild(_tempDiv);
						if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
							cache = node._gsCache = node._gsCache || {};
							cache.time = time;
							cache.width = pix / v * 100;
						}
						if (pix === 0 && !recurse) {
							pix = _convertToPixels(t, p, v, sfx, true);
						}
					}
					if (precise) {
						pix /= 100;
					}
					return neg ? -pix : pix;
				},
				_calculateOffset = _internals.calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
					if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
					var dim = ((p === "left") ? "Left" : "Top"),
						v = _getStyle(t, "margin" + dim, cs);
					return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
				},

				// @private returns at object containing ALL of the style properties in camelCase and their associated values.
				_getAllStyles = function(t, cs) {
					var s = {},
						i, tr, p;
					if ((cs = cs || _getComputedStyle(t, null))) {
						if ((i = cs.length)) {
							while (--i > -1) {
								p = cs[i];
								if (p.indexOf("-transform") === -1 || _transformPropCSS === p) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
									s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
								}
							}
						} else { //some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
							for (i in cs) {
								if (i.indexOf("Transform") === -1 || _transformProp === i) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
									s[i] = cs[i];
								}
							}
						}
					} else if ((cs = t.currentStyle || t.style)) {
						for (i in cs) {
							if (typeof(i) === "string" && s[i] === undefined) {
								s[i.replace(_camelExp, _camelFunc)] = cs[i];
							}
						}
					}
					if (!_supportsOpacity) {
						s.opacity = _getIEOpacity(t);
					}
					tr = _getTransform(t, cs, false);
					s.rotation = tr.rotation;
					s.skewX = tr.skewX;
					s.scaleX = tr.scaleX;
					s.scaleY = tr.scaleY;
					s.x = tr.x;
					s.y = tr.y;
					if (_supports3D) {
						s.z = tr.z;
						s.rotationX = tr.rotationX;
						s.rotationY = tr.rotationY;
						s.scaleZ = tr.scaleZ;
					}
					if (s.filters) {
						delete s.filters;
					}
					return s;
				},

				// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
				_cssDif = function(t, s1, s2, vars, forceLookup) {
					var difs = {},
						style = t.style,
						val, p, mpt;
					for (p in s2) {
						if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) if (p.indexOf("Origin") === -1) if (typeof(val) === "number" || typeof(val) === "string") {
							difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
							if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
								mpt = new MiniPropTween(style, p, style[p], mpt);
							}
						}
					}
					if (vars) {
						for (p in vars) { //copy properties (except className)
							if (p !== "className") {
								difs[p] = vars[p];
							}
						}
					}
					return {difs:difs, firstMPT:mpt};
				},
				_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
				_margins = ["marginLeft","marginRight","marginTop","marginBottom"],

				/**
				 * @private Gets the width or height of an element
				 * @param {!Object} t Target element
				 * @param {!string} p Property name ("width" or "height")
				 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
				 * @return {number} Dimension (in pixels)
				 */
				_getDimension = function(t, p, cs) {
					if ((t.nodeName + "").toLowerCase() === "svg") { //Chrome no longer supports offsetWidth/offsetHeight on SVG elements.
						return (cs || _getComputedStyle(t))[p] || 0;
					} else if (t.getCTM && _isSVG(t)) {
						return t.getBBox()[p] || 0;
					}
					var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
						a = _dimensions[p],
						i = a.length;
					cs = cs || _getComputedStyle(t, null);
					while (--i > -1) {
						v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
						v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
					}
					return v;
				},

				// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
				_parsePosition = function(v, recObj) {
					if (v === "contain" || v === "auto" || v === "auto auto") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
						return v + " ";
					}
					if (v == null || v === "") {
						v = "0 0";
					}
					var a = v.split(" "),
						x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
						y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1],
						i;
					if (a.length > 3 && !recObj) { //multiple positions
						a = v.split(", ").join(",").split(",");
						v = [];
						for (i = 0; i < a.length; i++) {
							v.push(_parsePosition(a[i]));
						}
						return v.join(",");
					}
					if (y == null) {
						y = (x === "center") ? "50%" : "0";
					} else if (y === "center") {
						y = "50%";
					}
					if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
						x = "50%";
					}
					v = x + " " + y + ((a.length > 2) ? " " + a[2] : "");
					if (recObj) {
						recObj.oxp = (x.indexOf("%") !== -1);
						recObj.oyp = (y.indexOf("%") !== -1);
						recObj.oxr = (x.charAt(1) === "=");
						recObj.oyr = (y.charAt(1) === "=");
						recObj.ox = parseFloat(x.replace(_NaNExp, ""));
						recObj.oy = parseFloat(y.replace(_NaNExp, ""));
						recObj.v = v;
					}
					return recObj || v;
				},

				/**
				 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
				 * @param {(number|string)} e End value which is typically a string, but could be a number
				 * @param {(number|string)} b Beginning value which is typically a string but could be a number
				 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
				 */
				_parseChange = function(e, b) {
					if (typeof(e) === "function") {
						e = e(_index, _target);
					}
					return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : (parseFloat(e) - parseFloat(b)) || 0;
				},

				/**
				 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
				 * @param {Object} v Value to be parsed
				 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
				 * @return {number} Parsed value
				 */
				_parseVal = function(v, d) {
					if (typeof(v) === "function") {
						v = v(_index, _target);
					}
					return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v) || 0;
				},

				/**
				 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
				 * @param {Object} v Value to be parsed
				 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
				 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
				 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
				 * @return {number} parsed angle in radians
				 */
				_parseAngle = function(v, d, p, directionalEnd) {
					var min = 0.000001,
						cap, split, dif, result, isRelative;
					if (typeof(v) === "function") {
						v = v(_index, _target);
					}
					if (v == null) {
						result = d;
					} else if (typeof(v) === "number") {
						result = v;
					} else {
						cap = 360;
						split = v.split("_");
						isRelative = (v.charAt(1) === "=");
						dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
						if (split.length) {
							if (directionalEnd) {
								directionalEnd[p] = d + dif;
							}
							if (v.indexOf("short") !== -1) {
								dif = dif % cap;
								if (dif !== dif % (cap / 2)) {
									dif = (dif < 0) ? dif + cap : dif - cap;
								}
							}
							if (v.indexOf("_cw") !== -1 && dif < 0) {
								dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
							} else if (v.indexOf("ccw") !== -1 && dif > 0) {
								dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
							}
						}
						result = d + dif;
					}
					if (result < min && result > -min) {
						result = 0;
					}
					return result;
				},

				_colorLookup = {aqua:[0,255,255],
					lime:[0,255,0],
					silver:[192,192,192],
					black:[0,0,0],
					maroon:[128,0,0],
					teal:[0,128,128],
					blue:[0,0,255],
					navy:[0,0,128],
					white:[255,255,255],
					fuchsia:[255,0,255],
					olive:[128,128,0],
					yellow:[255,255,0],
					orange:[255,165,0],
					gray:[128,128,128],
					purple:[128,0,128],
					green:[0,128,0],
					red:[255,0,0],
					pink:[255,192,203],
					cyan:[0,255,255],
					transparent:[255,255,255,0]},

				_hue = function(h, m1, m2) {
					h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
					return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
				},

				/**
				 * @private Parses a color (like #9F0, #FF9900, rgb(255,51,153) or hsl(108, 50%, 10%)) into an array with 3 elements for red, green, and blue or if toHSL parameter is true, it will populate the array with hue, saturation, and lightness values. If a relative value is found in an hsl() or hsla() string, it will preserve those relative prefixes and all the values in the array will be strings instead of numbers (in all other cases it will be populated with numbers).
				 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
				 * @param {(boolean)} toHSL If true, an hsl() or hsla() value will be returned instead of rgb() or rgba()
				 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order, or if the toHSL parameter was true, the array will contain hue, saturation and lightness (and optionally alpha) in that order. Always numbers unless there's a relative prefix found in an hsl() or hsla() string and toHSL is true.
				 */
				_parseColor = CSSPlugin.parseColor = function(v, toHSL) {
					var a, r, g, b, h, s, l, max, min, d, wasHSL;
					if (!v) {
						a = _colorLookup.black;
					} else if (typeof(v) === "number") {
						a = [v >> 16, (v >> 8) & 255, v & 255];
					} else {
						if (v.charAt(v.length - 1) === ",") { //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
							v = v.substr(0, v.length - 1);
						}
						if (_colorLookup[v]) {
							a = _colorLookup[v];
						} else if (v.charAt(0) === "#") {
							if (v.length === 4) { //for shorthand like #9F0
								r = v.charAt(1);
								g = v.charAt(2);
								b = v.charAt(3);
								v = "#" + r + r + g + g + b + b;
							}
							v = parseInt(v.substr(1), 16);
							a = [v >> 16, (v >> 8) & 255, v & 255];
						} else if (v.substr(0, 3) === "hsl") {
							a = wasHSL = v.match(_numExp);
							if (!toHSL) {
								h = (Number(a[0]) % 360) / 360;
								s = Number(a[1]) / 100;
								l = Number(a[2]) / 100;
								g = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
								r = l * 2 - g;
								if (a.length > 3) {
									a[3] = Number(a[3]);
								}
								a[0] = _hue(h + 1 / 3, r, g);
								a[1] = _hue(h, r, g);
								a[2] = _hue(h - 1 / 3, r, g);
							} else if (v.indexOf("=") !== -1) { //if relative values are found, just return the raw strings with the relative prefixes in place.
								return v.match(_relNumExp);
							}
						} else {
							a = v.match(_numExp) || _colorLookup.transparent;
						}
						a[0] = Number(a[0]);
						a[1] = Number(a[1]);
						a[2] = Number(a[2]);
						if (a.length > 3) {
							a[3] = Number(a[3]);
						}
					}
					if (toHSL && !wasHSL) {
						r = a[0] / 255;
						g = a[1] / 255;
						b = a[2] / 255;
						max = Math.max(r, g, b);
						min = Math.min(r, g, b);
						l = (max + min) / 2;
						if (max === min) {
							h = s = 0;
						} else {
							d = max - min;
							s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
							h = (max === r) ? (g - b) / d + (g < b ? 6 : 0) : (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
							h *= 60;
						}
						a[0] = (h + 0.5) | 0;
						a[1] = (s * 100 + 0.5) | 0;
						a[2] = (l * 100 + 0.5) | 0;
					}
					return a;
				},
				_formatColors = function(s, toHSL) {
					var colors = s.match(_colorExp) || [],
						charIndex = 0,
						parsed = "",
						i, color, temp;
					if (!colors.length) {
						return s;
					}
					for (i = 0; i < colors.length; i++) {
						color = colors[i];
						temp = s.substr(charIndex, s.indexOf(color, charIndex)-charIndex);
						charIndex += temp.length + color.length;
						color = _parseColor(color, toHSL);
						if (color.length === 3) {
							color.push(1);
						}
						parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
					}
					return parsed + s.substr(charIndex);
				},
				_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

			for (p in _colorLookup) {
				_colorExp += "|" + p + "\\b";
			}
			_colorExp = new RegExp(_colorExp+")", "gi");

			CSSPlugin.colorStringFilter = function(a) {
				var combined = a[0] + " " + a[1],
					toHSL;
				if (_colorExp.test(combined)) {
					toHSL = (combined.indexOf("hsl(") !== -1 || combined.indexOf("hsla(") !== -1);
					a[0] = _formatColors(a[0], toHSL);
					a[1] = _formatColors(a[1], toHSL);
				}
				_colorExp.lastIndex = 0;
			};

			if (!TweenLite.defaultStringFilter) {
				TweenLite.defaultStringFilter = CSSPlugin.colorStringFilter;
			}

			/**
			 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
			 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
			 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
			 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
			 * @return {Function} formatter function
			 */
			var _getFormatter = function(dflt, clr, collapsible, multi) {
					if (dflt == null) {
						return function(v) {return v;};
					}
					var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
						dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
						pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
						sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
						delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
						numVals = dVals.length,
						dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
						formatter;
					if (!numVals) {
						return function(v) {return v;};
					}
					if (clr) {
						formatter = function(v) {
							var color, vals, i, a;
							if (typeof(v) === "number") {
								v += dSfx;
							} else if (multi && _commasOutsideParenExp.test(v)) {
								a = v.replace(_commasOutsideParenExp, "|").split("|");
								for (i = 0; i < a.length; i++) {
									a[i] = formatter(a[i]);
								}
								return a.join(",");
							}
							color = (v.match(_colorExp) || [dColor])[0];
							vals = v.split(color).join("").match(_valuesExp) || [];
							i = vals.length;
							if (numVals > i--) {
								while (++i < numVals) {
									vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
								}
							}
							return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
						};
						return formatter;

					}
					formatter = function(v) {
						var vals, a, i;
						if (typeof(v) === "number") {
							v += dSfx;
						} else if (multi && _commasOutsideParenExp.test(v)) {
							a = v.replace(_commasOutsideParenExp, "|").split("|");
							for (i = 0; i < a.length; i++) {
								a[i] = formatter(a[i]);
							}
							return a.join(",");
						}
						vals = v.match(_valuesExp) || [];
						i = vals.length;
						if (numVals > i--) {
							while (++i < numVals) {
								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
							}
						}
						return pfx + vals.join(delim) + sfx;
					};
					return formatter;
				},

				/**
				 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
				 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
				 * @return {Function} a formatter function
				 */
				_getEdgeParser = function(props) {
					props = props.split(",");
					return function(t, e, p, cssp, pt, plugin, vars) {
						var a = (e + "").split(" "),
							i;
						vars = {};
						for (i = 0; i < 4; i++) {
							vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
						}
						return cssp.parse(t, vars, pt, plugin);
					};
				},

				// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
				_setPluginRatio = _internals._setPluginRatio = function(v) {
					this.plugin.setRatio(v);
					var d = this.data,
						proxy = d.proxy,
						mpt = d.firstMPT,
						min = 0.000001,
						val, pt, i, str, p;
					while (mpt) {
						val = proxy[mpt.v];
						if (mpt.r) {
							val = mpt.r(val);
						} else if (val < min && val > -min) {
							val = 0;
						}
						mpt.t[mpt.p] = val;
						mpt = mpt._next;
					}
					if (d.autoRotate) {
						d.autoRotate.rotation = d.mod ? d.mod.call(this._tween, proxy.rotation, this.t, this._tween) : proxy.rotation; //special case for ModifyPlugin to hook into an auto-rotating bezier
					}
					//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method. Same for "b" at the beginning.
					if (v === 1 || v === 0) {
						mpt = d.firstMPT;
						p = (v === 1) ? "e" : "b";
						while (mpt) {
							pt = mpt.t;
							if (!pt.type) {
								pt[p] = pt.s + pt.xs0;
							} else if (pt.type === 1) {
								str = pt.xs0 + pt.s + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt[p] = str;
							}
							mpt = mpt._next;
						}
					}
				},

				/**
				 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
				 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
				 * @param {!string} p property name
				 * @param {(number|string|object)} v value
				 * @param {MiniPropTween=} next next MiniPropTween in the linked list
				 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
				 */
				MiniPropTween = function(t, p, v, next, r) {
					this.t = t;
					this.p = p;
					this.v = v;
					this.r = r;
					if (next) {
						next._prev = this;
						this._next = next;
					}
				},

				/**
				 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
				 * This method returns an object that has the following properties:
				 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
				 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
				 *  - firstMPT: the first MiniPropTween in the linked list
				 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
				 * @param {!Object} t target object to be tweened
				 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
				 * @param {!CSSPlugin} cssp The CSSPlugin instance
				 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
				 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
				 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
				 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
				 */
				_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
					var bpt = pt,
						start = {},
						end = {},
						transform = cssp._transform,
						oldForce = _forcePT,
						i, p, xp, mpt, firstPT;
					cssp._transform = null;
					_forcePT = vars;
					pt = firstPT = cssp.parse(t, vars, pt, plugin);
					_forcePT = oldForce;
					//break off from the linked list so the new ones are isolated.
					if (shallow) {
						cssp._transform = transform;
						if (bpt) {
							bpt._prev = null;
							if (bpt._prev) {
								bpt._prev._next = null;
							}
						}
					}
					while (pt && pt !== bpt) {
						if (pt.type <= 1) {
							p = pt.p;
							end[p] = pt.s + pt.c;
							start[p] = pt.s;
							if (!shallow) {
								mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
								pt.c = 0;
							}
							if (pt.type === 1) {
								i = pt.l;
								while (--i > 0) {
									xp = "xn" + i;
									p = pt.p + "_" + xp;
									end[p] = pt.data[xp];
									start[p] = pt[xp];
									if (!shallow) {
										mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
									}
								}
							}
						}
						pt = pt._next;
					}
					return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
				},



				/**
				 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
				 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
				 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
				 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
				 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
				 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
				 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
				 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
				 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
				 * @param {number} s Starting numeric value
				 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
				 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
				 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
				 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
				 * @param {boolean=} r If true, the value(s) should be rounded
				 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
				 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
				 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
				 */
				CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
					this.t = t; //target
					this.p = p; //property
					this.s = s; //starting value
					this.c = c; //change value
					this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
					if (!(t instanceof CSSPropTween)) {
						_overwriteProps.push(this.n);
					}
					this.r = !r ? r : (typeof(r) === "function") ? r : Math.round; //round (boolean)
					this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
					if (pr) {
						this.pr = pr;
						_hasPriority = true;
					}
					this.b = (b === undefined) ? s : b;
					this.e = (e === undefined) ? s + c : e;
					if (next) {
						this._next = next;
						next._prev = this;
					}
				},

				_addNonTweeningNumericPT = function(target, prop, start, end, next, overwriteProp) { //cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
					var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
					pt.b = start;
					pt.e = pt.xs0 = end;
					return pt;
				},

				/**
				 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
				 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
				 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
				 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
				 *
				 * @param {!Object} t Target whose property will be tweened
				 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
				 * @param {string} b Beginning value
				 * @param {string} e Ending value
				 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
				 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
				 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
				 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
				 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
				 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
				 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
				 */
				_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
					//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
					b = b || dflt || "";
					if (typeof(e) === "function") {
						e = e(_index, _target);
					}
					pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
					e += ""; //ensures it's a string
					if (clrs && _colorExp.test(e + b)) { //if colors are found, normalize the formatting to rgba() or hsla().
						e = [b, e];
						CSSPlugin.colorStringFilter(e);
						b = e[0];
						e = e[1];
					}
					var ba = b.split(", ").join(",").split(" "), //beginning array
						ea = e.split(", ").join(",").split(" "), //ending array
						l = ba.length,
						autoRound = (_autoRound !== false),
						i, xi, ni, bv, ev, bnums, enums, bn, hasAlpha, temp, cv, str, useHSL;
					if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
						if ((e + b).indexOf("rgb") !== -1 || (e + b).indexOf("hsl") !== -1) { //keep rgb(), rgba(), hsl(), and hsla() values together! (remember, we're splitting on spaces)
							ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
							ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
						} else {
							ba = ba.join(" ").split(",").join(", ").split(" ");
							ea = ea.join(" ").split(",").join(", ").split(" ");
						}
						l = ba.length;
					}
					if (l !== ea.length) {
						//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
						ba = (dflt || "").split(" ");
						l = ba.length;
					}
					pt.plugin = plugin;
					pt.setRatio = setRatio;
					_colorExp.lastIndex = 0;
					for (i = 0; i < l; i++) {
						bv = ba[i];
						ev = ea[i] + "";
						bn = parseFloat(bv);
						//if the value begins with a number (most common). It's fine if it has a suffix like px
						if (bn || bn === 0) {
							pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1) ? Math.round : false, true);

						//if the value is a color
						} else if (clrs && _colorExp.test(bv)) {
							str = ev.indexOf(")") + 1;
							str = ")" + (str ? ev.substr(str) : ""); //if there's a comma or ) at the end, retain it.
							useHSL = (ev.indexOf("hsl") !== -1 && _supportsOpacity);
							temp = ev; //original string value so we can look for any prefix later.
							bv = _parseColor(bv, useHSL);
							ev = _parseColor(ev, useHSL);
							hasAlpha = (bv.length + ev.length > 6);
							if (hasAlpha && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
								pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
								pt.e = pt.e.split(ea[i]).join("transparent");
							} else {
								if (!_supportsOpacity) { //old versions of IE don't support rgba().
									hasAlpha = false;
								}
								if (useHSL) {
									pt.appendXtra(temp.substr(0, temp.indexOf("hsl")) + (hasAlpha ? "hsla(" : "hsl("), bv[0], _parseChange(ev[0], bv[0]), ",", false, true)
										.appendXtra("", bv[1], _parseChange(ev[1], bv[1]), "%,", false)
										.appendXtra("", bv[2], _parseChange(ev[2], bv[2]), (hasAlpha ? "%," : "%" + str), false);
								} else {
									pt.appendXtra(temp.substr(0, temp.indexOf("rgb")) + (hasAlpha ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", Math.round, true)
										.appendXtra("", bv[1], ev[1] - bv[1], ",", Math.round)
										.appendXtra("", bv[2], ev[2] - bv[2], (hasAlpha ? "," : str), Math.round);
								}

								if (hasAlpha) {
									bv = (bv.length < 4) ? 1 : bv[3];
									pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
								}
							}
							_colorExp.lastIndex = 0; //otherwise the test() on the RegExp could move the lastIndex and taint future results.

						} else {
							bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

							//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
							if (!bnums) {
								pt["xs" + pt.l] += (pt.l || pt["xs" + pt.l]) ? " " + ev : ev;

							//loop through all the numbers that are found and construct the extra values on the pt.
							} else {
								enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
								if (!enums || enums.length !== bnums.length) {
									//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
									return pt;
								}
								ni = 0;
								for (xi = 0; xi < bnums.length; xi++) {
									cv = bnums[xi];
									temp = bv.indexOf(cv, ni);
									pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px") ? Math.round : false, (xi === 0));
									ni = temp + cv.length;
								}
								pt["xs" + pt.l] += bv.substr(ni);
							}
						}
					}
					//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
					if (e.indexOf("=") !== -1) if (pt.data) {
						str = pt.xs0 + pt.data.s;
						for (i = 1; i < pt.l; i++) {
							str += pt["xs" + i] + pt.data["xn" + i];
						}
						pt.e = str + pt["xs" + i];
					}
					if (!pt.l) {
						pt.type = -1;
						pt.xs0 = pt.e;
					}
					return pt.xfirst || pt;
				},
				i = 9;


			p = CSSPropTween.prototype;
			p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
			while (--i > 0) {
				p["xn" + i] = 0;
				p["xs" + i] = "";
			}
			p.xs0 = "";
			p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;


			/**
			 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
			 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
			 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
			 * @param {string=} pfx Prefix (if any)
			 * @param {!number} s Starting value
			 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
			 * @param {string=} sfx Suffix (if any)
			 * @param {boolean=} r Round (if true).
			 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
			 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
			 */
			p.appendXtra = function(pfx, s, c, sfx, r, pad) {
				var pt = this,
					l = pt.l;
				pt["xs" + l] += (pad && (l || pt["xs" + l])) ? " " + pfx : pfx || "";
				if (!c) if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
					pt["xs" + l] += s + (sfx || "");
					return pt;
				}
				pt.l++;
				pt.type = pt.setRatio ? 2 : 1;
				pt["xs" + pt.l] = sfx || "";
				if (l > 0) {
					pt.data["xn" + l] = s + c;
					pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
					pt["xn" + l] = s;
					if (!pt.plugin) {
						pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
						pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
					}
					return pt;
				}
				pt.data = {s:s + c};
				pt.rxp = {};
				pt.s = s;
				pt.c = c;
				pt.r = r;
				return pt;
			};

			/**
			 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
			 * @param {!string} p Property name (like "boxShadow" or "throwProps")
			 * @param {Object=} options An object containing any of the following configuration options:
			 *                      - defaultValue: the default value
			 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
			 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
			 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
			 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
			 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
			 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
			 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
			 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
			 */
			var SpecialProp = function(p, options) {
					options = options || {};
					this.p = options.prefix ? _checkPropPrefix(p) || p : p;
					_specialProps[p] = _specialProps[this.p] = this;
					this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
					if (options.parser) {
						this.parse = options.parser;
					}
					this.clrs = options.color;
					this.multi = options.multi;
					this.keyword = options.keyword;
					this.dflt = options.defaultValue;
					this.pr = options.priority || 0;
				},

				//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
				_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
					if (typeof(options) !== "object") {
						options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
					}
					var a = p.split(","),
						d = options.defaultValue,
						i, temp;
					defaults = defaults || [d];
					for (i = 0; i < a.length; i++) {
						options.prefix = (i === 0 && options.prefix);
						options.defaultValue = defaults[i] || d;
						temp = new SpecialProp(a[i], options);
					}
				},

				//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
				_registerPluginProp = _internals._registerPluginProp = function(p) {
					if (!_specialProps[p]) {
						var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
						_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
							var pluginClass = _globals.com.greensock.plugins[pluginName];
							if (!pluginClass) {
								_log("Error: " + pluginName + " js file not loaded.");
								return pt;
							}
							pluginClass._cssRegister();
							return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
						}});
					}
				};


			p = SpecialProp.prototype;

			/**
			 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
			 * @param {!Object} t target element
			 * @param {(string|number|object)} b beginning value
			 * @param {(string|number|object)} e ending (destination) value
			 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
			 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
			 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
			 * @return {CSSPropTween=} First CSSPropTween in the linked list
			 */
			p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
				var kwd = this.keyword,
					i, ba, ea, l, bi, ei;
				//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
				if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
					ba = b.replace(_commasOutsideParenExp, "|").split("|");
					ea = e.replace(_commasOutsideParenExp, "|").split("|");
				} else if (kwd) {
					ba = [b];
					ea = [e];
				}
				if (ea) {
					l = (ea.length > ba.length) ? ea.length : ba.length;
					for (i = 0; i < l; i++) {
						b = ba[i] = ba[i] || this.dflt;
						e = ea[i] = ea[i] || this.dflt;
						if (kwd) {
							bi = b.indexOf(kwd);
							ei = e.indexOf(kwd);
							if (bi !== ei) {
								if (ei === -1) { //if the keyword isn't in the end value, remove it from the beginning one.
									ba[i] = ba[i].split(kwd).join("");
								} else if (bi === -1) { //if the keyword isn't in the beginning, add it.
									ba[i] += " " + kwd;
								}
							}
						}
					}
					b = ba.join(", ");
					e = ea.join(", ");
				}
				return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
			};

			/**
			 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
			 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
			 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
			 * @param {!Object} t Target object whose property is being tweened
			 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
			 * @param {!string} p Property name
			 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
			 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
			 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
			 * @param {Object=} vars Original vars object that contains the data for parsing.
			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
			 */
			p.parse = function(t, e, p, cssp, pt, plugin, vars) {
				return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
			};

			/**
			 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
			 *  1) Target object whose property should be tweened (typically a DOM element)
			 *  2) The end/destination value (could be a string, number, object, or whatever you want)
			 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
			 *
			 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
			 *
			 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
			 *      var start = target.style.width;
			 *      return function(ratio) {
			 *              target.style.width = (start + value * ratio) + "px";
			 *              console.log("set width to " + target.style.width);
			 *          }
			 * }, 0);
			 *
			 * Then, when I do this tween, it will trigger my special property:
			 *
			 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
			 *
			 * In the example, of course, we're just changing the width, but you can do anything you want.
			 *
			 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
			 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
			 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
			 */
			CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
				_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
					var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
					rv.plugin = plugin;
					rv.setRatio = onInitTween(t, e, cssp._tween, p);
					return rv;
				}, priority:priority});
			};






			//transform-related methods and properties
			CSSPlugin.useSVGTransformAttr = true; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
			var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent").split(","),
				_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
				_transformPropCSS = _prefixCSS + "transform",
				_transformOriginProp = _checkPropPrefix("transformOrigin"),
				_supports3D = (_checkPropPrefix("perspective") !== null),
				Transform = _internals.Transform = function() {
					this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
					this.force3D = (CSSPlugin.defaultForce3D === false || !_supports3D) ? false : CSSPlugin.defaultForce3D || "auto";
				},
				_SVGElement = _gsScope.SVGElement,
				_useSVGTransformAttr,
				//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.

				_createSVG = function(type, container, attributes) {
					var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
						reg = /([a-z])([A-Z])/g,
						p;
					for (p in attributes) {
						element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
					}
					container.appendChild(element);
					return element;
				},
				_docElement = _doc.documentElement || {},
				_forceSVGTransformAttr = (function() {
					//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
					var force = _ieVers || (/Android/i.test(_agent) && !_gsScope.chrome),
						svg, rect, width;
					if (_doc.createElementNS && !force) { //IE8 and earlier doesn't support SVG anyway
						svg = _createSVG("svg", _docElement);
						rect = _createSVG("rect", svg, {width:100, height:50, x:100});
						width = rect.getBoundingClientRect().width;
						rect.style[_transformOriginProp] = "50% 50%";
						rect.style[_transformProp] = "scaleX(0.5)";
						force = (width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D)); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
						_docElement.removeChild(svg);
					}
					return force;
				})(),
				_parseSVGOrigin = function(e, local, decoratee, absolute, smoothOrigin, skipRecord) {
					var tm = e._gsTransform,
						m = _getMatrix(e, true),
						v, x, y, xOrigin, yOrigin, a, b, c, d, tx, ty, determinant, xOriginOld, yOriginOld;
					if (tm) {
						xOriginOld = tm.xOrigin; //record the original values before we alter them.
						yOriginOld = tm.yOrigin;
					}
					if (!absolute || (v = absolute.split(" ")).length < 2) {
						b = e.getBBox();
						if (b.x === 0 && b.y === 0 && b.width + b.height === 0) { //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.
							b = {x: parseFloat(e.hasAttribute("x") ? e.getAttribute("x") : e.hasAttribute("cx") ? e.getAttribute("cx") : 0) || 0, y: parseFloat(e.hasAttribute("y") ? e.getAttribute("y") : e.hasAttribute("cy") ? e.getAttribute("cy") : 0) || 0, width:0, height:0};
						}
						local = _parsePosition(local).split(" ");
						v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x,
							 (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
					}
					decoratee.xOrigin = xOrigin = parseFloat(v[0]);
					decoratee.yOrigin = yOrigin = parseFloat(v[1]);
					if (absolute && m !== _identity2DMatrix) { //if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
						a = m[0];
						b = m[1];
						c = m[2];
						d = m[3];
						tx = m[4];
						ty = m[5];
						determinant = (a * d - b * c);
						if (determinant) { //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
							x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
							y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
							xOrigin = decoratee.xOrigin = v[0] = x;
							yOrigin = decoratee.yOrigin = v[1] = y;
						}
					}
					if (tm) { //avoid jump when transformOrigin is changed - adjust the x/y values accordingly
						if (skipRecord) {
							decoratee.xOffset = tm.xOffset;
							decoratee.yOffset = tm.yOffset;
							tm = decoratee;
						}
						if (smoothOrigin || (smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false)) {
							x = xOrigin - xOriginOld;
							y = yOrigin - yOriginOld;
							//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
							//tm.x -= x - (x * m[0] + y * m[2]);
							//tm.y -= y - (x * m[1] + y * m[3]);
							tm.xOffset += (x * m[0] + y * m[2]) - x;
							tm.yOffset += (x * m[1] + y * m[3]) - y;
						} else {
							tm.xOffset = tm.yOffset = 0;
						}
					}
					if (!skipRecord) {
						e.setAttribute("data-svg-origin", v.join(" "));
					}
				},
				_getBBoxHack = function(swapIfPossible) { //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
					var svg = _createElement("svg", (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) || "http://www.w3.org/2000/svg"),
						oldParent = this.parentNode,
						oldSibling = this.nextSibling,
						oldCSS = this.style.cssText,
						bbox;
					_docElement.appendChild(svg);
					svg.appendChild(this);
					this.style.display = "block";
					if (swapIfPossible) {
						try {
							bbox = this.getBBox();
							this._originalGetBBox = this.getBBox;
							this.getBBox = _getBBoxHack;
						} catch (e) { }
					} else if (this._originalGetBBox) {
						bbox = this._originalGetBBox();
					}
					if (oldSibling) {
						oldParent.insertBefore(this, oldSibling);
					} else {
						oldParent.appendChild(this);
					}
					_docElement.removeChild(svg);
					this.style.cssText = oldCSS;
					return bbox;
				},
				_getBBox = function(e) {
					try {
						return e.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
					} catch (error) {
						return _getBBoxHack.call(e, true);
					}
				},
				_isSVG = function(e) { //reports if the element is an SVG on which getBBox() actually works
					return !!(_SVGElement && e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
				},
				_identity2DMatrix = [1,0,0,1,0,0],
				_getMatrix = function(e, force2D) {
					var tm = e._gsTransform || new Transform(),
						rnd = 100000,
						style = e.style,
						isDefault, s, m, n, dec, none;
					if (_transformProp) {
						s = _getStyle(e, _transformPropCSS, null, true);
					} else if (e.currentStyle) {
						//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
						s = e.currentStyle.filter.match(_ieGetMatrixExp);
						s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
					}
					isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
					if (_transformProp && ((none = (!_getComputedStyle(e) || _getComputedStyle(e).display === "none")) || !e.parentNode)) { //note: Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
						if (none) { //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
							n = style.display;
							style.display = "block";
						}
						if (!e.parentNode) {
							dec = 1; //flag
							_docElement.appendChild(e);
						}
						s = _getStyle(e, _transformPropCSS, null, true);
						isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
						if (n) {
							style.display = n;
						} else if (none) {
							_removeProp(style, "display");
						}
						if (dec) {
							_docElement.removeChild(e);
						}
					}
					if (tm.svg || (e.getCTM && _isSVG(e))) {
						if (isDefault && (style[_transformProp] + "").indexOf("matrix") !== -1) { //some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
							s = style[_transformProp];
							isDefault = 0;
						}
						m = e.getAttribute("transform");
						if (isDefault && m) {
							m = e.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.
							s = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")";
							isDefault = 0;
						}
					}
					if (isDefault) {
						return _identity2DMatrix;
					}
					//split the matrix values out into an array (m for matrix)
					m = (s || "").match(_numExp) || [];
					i = m.length;
					while (--i > -1) {
						n = Number(m[i]);
						m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
					}
					return (force2D && m.length > 6) ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
				},

				/**
				 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
				 * @param {!Object} t target element
				 * @param {Object=} cs computed style object (optional)
				 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
				 * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
				 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
				 */
				_getTransform = _internals.getTransform = function(t, cs, rec, parse) {
					if (t._gsTransform && rec && !parse) {
						return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
					}
					var tm = rec ? t._gsTransform || new Transform() : new Transform(),
						invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
						min = 0.00002,
						rnd = 100000,
						zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
						defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
						m, i, scaleX, scaleY, rotation, skewX;

					tm.svg = !!(t.getCTM && _isSVG(t));
					if (tm.svg) {
						_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
						_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
					}
					m = _getMatrix(t);
					if (m !== _identity2DMatrix) {

						if (m.length === 16) {
							//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
							var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
								a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
								a13 = m[8], a23 = m[9], a33 = m[10],
								a14 = m[12], a24 = m[13], a34 = m[14],
								a43 = m[11],
								angle = Math.atan2(a32, a33),
								t1, t2, t3, t4, cos, sin;
							//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
							if (tm.zOrigin) {
								a34 = -tm.zOrigin;
								a14 = a13*a34-m[12];
								a24 = a23*a34-m[13];
								a34 = a33*a34+tm.zOrigin-m[14];
							}
							//note for possible future consolidation: rotationX: Math.atan2(a32, a33), rotationY: Math.atan2(-a31, Math.sqrt(a33 * a33 + a32 * a32)), rotation: Math.atan2(a21, a11), skew: Math.atan2(a12, a22). However, it doesn't seem to be quite as reliable as the full-on backwards rotation procedure.
							tm.rotationX = angle * _RAD2DEG;
							//rotationX
							if (angle) {
								cos = Math.cos(-angle);
								sin = Math.sin(-angle);
								t1 = a12*cos+a13*sin;
								t2 = a22*cos+a23*sin;
								t3 = a32*cos+a33*sin;
								a13 = a12*-sin+a13*cos;
								a23 = a22*-sin+a23*cos;
								a33 = a32*-sin+a33*cos;
								a43 = a42*-sin+a43*cos;
								a12 = t1;
								a22 = t2;
								a32 = t3;
							}
							//rotationY
							angle = Math.atan2(-a31, a33);
							tm.rotationY = angle * _RAD2DEG;
							if (angle) {
								cos = Math.cos(-angle);
								sin = Math.sin(-angle);
								t1 = a11*cos-a13*sin;
								t2 = a21*cos-a23*sin;
								t3 = a31*cos-a33*sin;
								a23 = a21*sin+a23*cos;
								a33 = a31*sin+a33*cos;
								a43 = a41*sin+a43*cos;
								a11 = t1;
								a21 = t2;
								a31 = t3;
							}
							//rotationZ
							angle = Math.atan2(a21, a11);
							tm.rotation = angle * _RAD2DEG;
							if (angle) {
								cos = Math.cos(angle);
								sin = Math.sin(angle);
								t1 = a11*cos+a21*sin;
								t2 = a12*cos+a22*sin;
								t3 = a13*cos+a23*sin;
								a21 = a21*cos-a11*sin;
								a22 = a22*cos-a12*sin;
								a23 = a23*cos-a13*sin;
								a11 = t1;
								a12 = t2;
								a13 = t3;
							}

							if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
								tm.rotationX = tm.rotation = 0;
								tm.rotationY = 180 - tm.rotationY;
							}

							//skewX
							angle = Math.atan2(a12, a22);

							//scales
							tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21 + a31 * a31) * rnd + 0.5) | 0) / rnd;
							tm.scaleY = ((Math.sqrt(a22 * a22 + a32 * a32) * rnd + 0.5) | 0) / rnd;
							tm.scaleZ = ((Math.sqrt(a13 * a13 + a23 * a23 + a33 * a33) * rnd + 0.5) | 0) / rnd;
							a11 /= tm.scaleX;
							a12 /= tm.scaleY;
							a21 /= tm.scaleX;
							a22 /= tm.scaleY;
							if (Math.abs(angle) > min) {
								tm.skewX = angle * _RAD2DEG;
								a12 = 0; //unskews
								if (tm.skewType !== "simple") {
									tm.scaleY *= 1 / Math.cos(angle); //by default, we compensate the scale based on the skew so that the element maintains a similar proportion when skewed, so we have to alter the scaleY here accordingly to match the default (non-adjusted) skewing that CSS does (stretching more and more as it skews).
								}

							} else {
								tm.skewX = 0;
							}

							/* //for testing purposes
							var transform = "matrix3d(",
								comma = ",",
								zero = "0";
							a13 /= tm.scaleZ;
							a23 /= tm.scaleZ;
							a31 /= tm.scaleX;
							a32 /= tm.scaleY;
							a33 /= tm.scaleZ;
							transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
							transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
							transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
							transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
							transform += a14 + comma + a24 + comma + a34 + comma + (tm.perspective ? (1 + (-a34 / tm.perspective)) : 1) + ")";
							console.log(transform);
							document.querySelector(".test").style[_transformProp] = transform;
							*/

							tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
							tm.x = a14;
							tm.y = a24;
							tm.z = a34;
							if (tm.svg) {
								tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
								tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
							}

						} else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY))) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
							var k = (m.length >= 6),
								a = k ? m[0] : 1,
								b = m[1] || 0,
								c = m[2] || 0,
								d = k ? m[3] : 1;
							tm.x = m[4] || 0;
							tm.y = m[5] || 0;
							scaleX = Math.sqrt(a * a + b * b);
							scaleY = Math.sqrt(d * d + c * c);
							rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
							skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
							tm.scaleX = scaleX;
							tm.scaleY = scaleY;
							tm.rotation = rotation;
							tm.skewX = skewX;
							if (_supports3D) {
								tm.rotationX = tm.rotationY = tm.z = 0;
								tm.perspective = defaultTransformPerspective;
								tm.scaleZ = 1;
							}
							if (tm.svg) {
								tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
								tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
							}
						}
						if (Math.abs(tm.skewX) > 90 && Math.abs(tm.skewX) < 270) {
							if (invX) {
								tm.scaleX *= -1;
								tm.skewX += (tm.rotation <= 0) ? 180 : -180;
								tm.rotation += (tm.rotation <= 0) ? 180 : -180;
							} else {
								tm.scaleY *= -1;
								tm.skewX += (tm.skewX <= 0) ? 180 : -180;
							}
						}
						tm.zOrigin = zOrigin;
						//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
						for (i in tm) {
							if (tm[i] < min) if (tm[i] > -min) {
								tm[i] = 0;
							}
						}
					}
					//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
					if (rec) {
						t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
						if (tm.svg) { //if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
							if (_useSVGTransformAttr && t.style[_transformProp]) {
								TweenLite.delayedCall(0.001, function(){ //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
									_removeProp(t.style, _transformProp);
								});
							} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
								TweenLite.delayedCall(0.001, function(){
									t.removeAttribute("transform");
								});
							}
						}
					}
					return tm;
				},

				//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
				_setIETransformRatio = function(v) {
					var t = this.data, //refers to the element's _gsTransform object
						ang = -t.rotation * _DEG2RAD,
						skew = ang + t.skewX * _DEG2RAD,
						rnd = 100000,
						a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
						b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
						c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
						d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
						style = this.t.style,
						cs = this.t.currentStyle,
						filters, val;
					if (!cs) {
						return;
					}
					val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
					b = -c;
					c = -val;
					filters = cs.filter;
					style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
					var w = this.t.offsetWidth,
						h = this.t.offsetHeight,
						clip = (cs.position !== "absolute"),
						m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
						ox = t.x + (w * t.xPercent / 100),
						oy = t.y + (h * t.yPercent / 100),
						dx, dy;

					//if transformOrigin is being used, adjust the offset x and y
					if (t.ox != null) {
						dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
						dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
						ox += dx - (dx * a + dy * b);
						oy += dy - (dx * c + dy * d);
					}

					if (!clip) {
						m += ", sizingMethod='auto expand')";
					} else {
						dx = (w / 2);
						dy = (h / 2);
						//translate to ensure that transformations occur around the correct origin (default is center).
						m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
					}
					if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
						style.filter = filters.replace(_ieSetMatrixExp, m);
					} else {
						style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
					}

					//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
					if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
						style.removeAttribute("filter");
					}

					//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
					if (!clip) {
						var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
							marg, prop, dif;
						dx = t.ieOffsetX || 0;
						dy = t.ieOffsetY || 0;
						t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
						t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
						for (i = 0; i < 4; i++) {
							prop = _margins[i];
							marg = cs[prop];
							//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
							val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
							if (val !== t[prop]) {
								dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
							} else {
								dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
							}
							style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
						}
					}
				},

				/* translates a super small decimal to a string WITHOUT scientific notation
				_safeDecimal = function(n) {
					var s = (n < 0 ? -n : n) + "",
						a = s.split("e-");
					return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
				},
				*/

				_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function(v) {
					var t = this.data, //refers to the element's _gsTransform object
						style = this.t.style,
						angle = t.rotation,
						rotationX = t.rotationX,
						rotationY = t.rotationY,
						sx = t.scaleX,
						sy = t.scaleY,
						sz = t.scaleZ,
						x = t.x,
						y = t.y,
						z = t.z,
						isSVG = t.svg,
						perspective = t.perspective,
						force3D = t.force3D,
						skewY = t.skewY,
						skewX = t.skewX,
						t1,	a11, a12, a13, a21, a22, a23, a31, a32, a33, a41, a42, a43,
						zOrigin, min, cos, sin, t2, transform, comma, zero, skew, rnd;
					if (skewY) { //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
						skewX += skewY;
						angle += skewY;
					}

					//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
					if (((((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !force3D) && !z && !perspective && !rotationY && !rotationX && sz === 1) || (_useSVGTransformAttr && isSVG) || !_supports3D) { //on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.

						//2D
						if (angle || skewX || isSVG) {
							angle *= _DEG2RAD;
							skew = skewX * _DEG2RAD;
							rnd = 100000;
							a11 = Math.cos(angle) * sx;
							a21 = Math.sin(angle) * sx;
							a12 = Math.sin(angle - skew) * -sy;
							a22 = Math.cos(angle - skew) * sy;
							if (skew && t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
								t1 = Math.tan(skew - skewY * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								a12 *= t1;
								a22 *= t1;
								if (skewY) {
									t1 = Math.tan(skewY * _DEG2RAD);
									t1 = Math.sqrt(1 + t1 * t1);
									a11 *= t1;
									a21 *= t1;
								}
							}
							if (isSVG) {
								x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
								y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
								if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) { //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
									min = this.t.getBBox();
									x += t.xPercent * 0.01 * min.width;
									y += t.yPercent * 0.01 * min.height;
								}
								min = 0.000001;
								if (x < min) if (x > -min) {
									x = 0;
								}
								if (y < min) if (y > -min) {
									y = 0;
								}
							}
							transform = (((a11 * rnd) | 0) / rnd) + "," + (((a21 * rnd) | 0) / rnd) + "," + (((a12 * rnd) | 0) / rnd) + "," + (((a22 * rnd) | 0) / rnd) + "," + x + "," + y + ")";
							if (isSVG && _useSVGTransformAttr) {
								this.t.setAttribute("transform", "matrix(" + transform);
							} else {
								//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
								style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
							}
						} else {
							style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
						}
						return;

					}
					if (_isFirefox) { //Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
						min = 0.0001;
						if (sx < min && sx > -min) {
							sx = sz = 0.00002;
						}
						if (sy < min && sy > -min) {
							sy = sz = 0.00002;
						}
						if (perspective && !t.z && !t.rotationX && !t.rotationY) { //Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
							perspective = 0;
						}
					}
					if (angle || skewX) {
						angle *= _DEG2RAD;
						cos = a11 = Math.cos(angle);
						sin = a21 = Math.sin(angle);
						if (skewX) {
							angle -= skewX * _DEG2RAD;
							cos = Math.cos(angle);
							sin = Math.sin(angle);
							if (t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
								t1 = Math.tan((skewX - skewY) * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								cos *= t1;
								sin *= t1;
								if (t.skewY) {
									t1 = Math.tan(skewY * _DEG2RAD);
									t1 = Math.sqrt(1 + t1 * t1);
									a11 *= t1;
									a21 *= t1;
								}
							}
						}
						a12 = -sin;
						a22 = cos;

					} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) { //if we're only translating and/or 2D scaling, this is faster...
						style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z +"px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
						return;
					} else {
						a11 = a22 = 1;
						a12 = a21 = 0;
					}
					// KEY  INDEX   AFFECTS a[row][column]
					// a11  0       rotation, rotationY, scaleX
					// a21  1       rotation, rotationY, scaleX
					// a31  2       rotationY, scaleX
					// a41  3       rotationY, scaleX
					// a12  4       rotation, skewX, rotationX, scaleY
					// a22  5       rotation, skewX, rotationX, scaleY
					// a32  6       rotationX, scaleY
					// a42  7       rotationX, scaleY
					// a13  8       rotationY, rotationX, scaleZ
					// a23  9       rotationY, rotationX, scaleZ
					// a33  10      rotationY, rotationX, scaleZ
					// a43  11      rotationY, rotationX, perspective, scaleZ
					// a14  12      x, zOrigin, svgOrigin
					// a24  13      y, zOrigin, svgOrigin
					// a34  14      z, zOrigin
					// a44  15
					// rotation: Math.atan2(a21, a11)
					// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
					// rotationX: Math.atan2(a32, a33)
					a33 = 1;
					a13 = a23 = a31 = a32 = a41 = a42 = 0;
					a43 = (perspective) ? -1 / perspective : 0;
					zOrigin = t.zOrigin;
					min = 0.000001; //threshold below which browsers use scientific notation which won't work.
					comma = ",";
					zero = "0";
					angle = rotationY * _DEG2RAD;
					if (angle) {
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						a31 = -sin;
						a41 = a43*-sin;
						a13 = a11*sin;
						a23 = a21*sin;
						a33 = cos;
						a43 *= cos;
						a11 *= cos;
						a21 *= cos;
					}
					angle = rotationX * _DEG2RAD;
					if (angle) {
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						t1 = a12*cos+a13*sin;
						t2 = a22*cos+a23*sin;
						a32 = a33*sin;
						a42 = a43*sin;
						a13 = a12*-sin+a13*cos;
						a23 = a22*-sin+a23*cos;
						a33 = a33*cos;
						a43 = a43*cos;
						a12 = t1;
						a22 = t2;
					}
					if (sz !== 1) {
						a13*=sz;
						a23*=sz;
						a33*=sz;
						a43*=sz;
					}
					if (sy !== 1) {
						a12*=sy;
						a22*=sy;
						a32*=sy;
						a42*=sy;
					}
					if (sx !== 1) {
						a11*=sx;
						a21*=sx;
						a31*=sx;
						a41*=sx;
					}

					if (zOrigin || isSVG) {
						if (zOrigin) {
							x += a13*-zOrigin;
							y += a23*-zOrigin;
							z += a33*-zOrigin+zOrigin;
						}
						if (isSVG) { //due to bugs in some browsers, we need to manage the transform-origin of SVG manually
							x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
							y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
						}
						if (x < min && x > -min) {
							x = zero;
						}
						if (y < min && y > -min) {
							y = zero;
						}
						if (z < min && z > -min) {
							z = 0; //don't use string because we calculate perspective later and need the number.
						}
					}

					//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
					transform = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(");
					transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
					transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
					if (rotationX || rotationY || sz !== 1) { //performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
						transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
						transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
					} else {
						transform += ",0,0,0,0,1,0,";
					}
					transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";

					style[_transformProp] = transform;
				};

			p = Transform.prototype;
			p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
			p.scaleX = p.scaleY = p.scaleZ = 1;

			_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {parser:function(t, e, parsingProp, cssp, pt, plugin, vars) {
				if (cssp._lastParsedTransform === vars) { return pt; } //only need to parse the transform once, and only if the browser supports it.
				cssp._lastParsedTransform = vars;
				var scaleFunc = (vars.scale && typeof(vars.scale) === "function") ? vars.scale : 0, //if there's a function-based "scale" value, swap in the resulting numeric value temporarily. Otherwise, if it's called for both scaleX and scaleY independently, they may not match (like if the function uses Math.random()).
					swapFunc;
				if (typeof(vars[parsingProp]) === "function") { //whatever property triggers the initial parsing might be a function-based value in which case it already got called in parse(), thus we don't want to call it again in here. The most efficient way to avoid this is to temporarily swap the value directly into the vars object, and then after we do all our parsing in this function, we'll swap it back again.
					swapFunc = vars[parsingProp];
					vars[parsingProp] = e;
				}
				if (scaleFunc) {
					vars.scale = scaleFunc(_index, t);
				}
				var originalGSTransform = t._gsTransform,
					style = t.style,
					min = 0.000001,
					i = _transformProps.length,
					v = vars,
					endRotations = {},
					transformOriginString = "transformOrigin",
					m1 = _getTransform(t, _cs, true, v.parseTransform),
					orig = v.transform && ((typeof(v.transform) === "function") ? v.transform(_index, _target) : v.transform),
					m2, copy, has3D, hasChange, dr, x, y, matrix, p;
				m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;
				cssp._transform = m1;
				if (orig && typeof(orig) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
					copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
					copy[_transformProp] = orig;
					copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
					copy.position = "absolute";
					if (orig.indexOf("%") !== -1) { //%-based translations will fail unless we set the width/height to match the original target...
						copy.width = _getStyle(t, "width");
						copy.height = _getStyle(t, "height");
					}
					_doc.body.appendChild(_tempDiv);
					m2 = _getTransform(_tempDiv, null, false);
					if (m1.skewType === "simple") { //the default _getTransform() reports the skewX/scaleY as if skewType is "compensated", thus we need to adjust that here if skewType is "simple".
						m2.scaleY *= Math.cos(m2.skewX * _DEG2RAD);
					}
					if (m1.svg) { //if it's an SVG element, x/y part of the matrix will be affected by whatever we use as the origin and the offsets, so compensate here...
						x = m1.xOrigin;
						y = m1.yOrigin;
						m2.x -= m1.xOffset;
						m2.y -= m1.yOffset;
						if (v.transformOrigin || v.svgOrigin) { //if this tween is altering the origin, we must factor that in here. The actual work of recording the transformOrigin values and setting up the PropTween is done later (still inside this function) so we cannot leave the changes intact here - we only want to update the x/y accordingly.
							orig = {};
							_parseSVGOrigin(t, _parsePosition(v.transformOrigin), orig, v.svgOrigin, v.smoothOrigin, true);
							x = orig.xOrigin;
							y = orig.yOrigin;
							m2.x -= orig.xOffset - m1.xOffset;
							m2.y -= orig.yOffset - m1.yOffset;
						}
						if (x || y) {
							matrix = _getMatrix(_tempDiv, true);
							m2.x -= x - (x * matrix[0] + y * matrix[2]);
							m2.y -= y - (x * matrix[1] + y * matrix[3]);
						}
					}
					_doc.body.removeChild(_tempDiv);
					if (!m2.perspective) {
						m2.perspective = m1.perspective; //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
					}
					if (v.xPercent != null) {
						m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
					}
					if (v.yPercent != null) {
						m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
					}
				} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
					m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
						scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
						scaleZ:_parseVal(v.scaleZ, m1.scaleZ),
						x:_parseVal(v.x, m1.x),
						y:_parseVal(v.y, m1.y),
						z:_parseVal(v.z, m1.z),
						xPercent:_parseVal(v.xPercent, m1.xPercent),
						yPercent:_parseVal(v.yPercent, m1.yPercent),
						perspective:_parseVal(v.transformPerspective, m1.perspective)};
					dr = v.directionalRotation;
					if (dr != null) {
						if (typeof(dr) === "object") {
							for (copy in dr) {
								v[copy] = dr[copy];
							}
						} else {
							v.rotation = dr;
						}
					}
					if (typeof(v.x) === "string" && v.x.indexOf("%") !== -1) {
						m2.x = 0;
						m2.xPercent = _parseVal(v.x, m1.xPercent);
					}
					if (typeof(v.y) === "string" && v.y.indexOf("%") !== -1) {
						m2.y = 0;
						m2.yPercent = _parseVal(v.y, m1.yPercent);
					}

					m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : m1.rotation, m1.rotation, "rotation", endRotations);
					if (_supports3D) {
						m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
						m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
					}
					m2.skewX = _parseAngle(v.skewX, m1.skewX);
					m2.skewY = _parseAngle(v.skewY, m1.skewY);
				}
				if (_supports3D && v.force3D != null) {
					m1.force3D = v.force3D;
					hasChange = true;
				}

				has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
				if (!has3D && v.scale != null) {
					m2.scaleZ = 1; //no need to tween scaleZ.
				}

				while (--i > -1) {
					p = _transformProps[i];
					orig = m2[p] - m1[p];
					if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
						hasChange = true;
						pt = new CSSPropTween(m1, p, m1[p], orig, pt);
						if (p in endRotations) {
							pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
						}
						pt.xs0 = 0; //ensures the value stays numeric in setRatio()
						pt.plugin = plugin;
						cssp._overwriteProps.push(pt.n);
					}
				}

				orig = v.transformOrigin;
				if (m1.svg && (orig || v.svgOrigin)) {
					x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
					y = m1.yOffset;
					_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
					pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
					pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
					if (x !== m1.xOffset || y !== m1.yOffset) {
						pt = _addNonTweeningNumericPT(m1, "xOffset", (originalGSTransform ? x : m1.xOffset), m1.xOffset, pt, transformOriginString);
						pt = _addNonTweeningNumericPT(m1, "yOffset", (originalGSTransform ? y : m1.yOffset), m1.yOffset, pt, transformOriginString);
					}
					orig = "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
				}
				if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
					if (_transformProp) {
						hasChange = true;
						p = _transformOriginProp;
						orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + ""; //cast as string to avoid errors
						pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
						pt.b = style[p];
						pt.plugin = plugin;
						if (_supports3D) {
							copy = m1.zOrigin;
							orig = orig.split(" ");
							m1.zOrigin = ((orig.length > 2 && !(copy !== 0 && orig[2] === "0px")) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
							pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
							pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
							pt.b = copy;
							pt.xs0 = pt.e = m1.zOrigin;
						} else {
							pt.xs0 = pt.e = orig;
						}

						//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
					} else {
						_parsePosition(orig + "", m1);
					}
				}
				if (hasChange) {
					cssp._transformType = (!(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3)) ? 3 : 2; //quicker than calling cssp._enableTransforms();
				}
				if (swapFunc) {
					vars[parsingProp] = swapFunc;
				}
				if (scaleFunc) {
					vars.scale = scaleFunc;
				}
				return pt;
			}, prefix:true});

			_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});

			_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
				e = this.format(e);
				var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
					style = t.style,
					ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
				w = parseFloat(t.offsetWidth);
				h = parseFloat(t.offsetHeight);
				ea1 = e.split(" ");
				for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
					if (this.p.indexOf("border")) { //older browsers used a prefix
						props[i] = _checkPropPrefix(props[i]);
					}
					bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
					if (bs.indexOf(" ") !== -1) {
						bs2 = bs.split(" ");
						bs = bs2[0];
						bs2 = bs2[1];
					}
					es = es2 = ea1[i];
					bn = parseFloat(bs);
					bsfx = bs.substr((bn + "").length);
					rel = (es.charAt(1) === "=");
					if (rel) {
						en = parseInt(es.charAt(0)+"1", 10);
						es = es.substr(2);
						en *= parseFloat(es);
						esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
					} else {
						en = parseFloat(es);
						esfx = es.substr((en + "").length);
					}
					if (esfx === "") {
						esfx = _suffixMap[p] || bsfx;
					}
					if (esfx !== bsfx) {
						hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
						vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
						if (esfx === "%") {
							bs = (hn / w * 100) + "%";
							bs2 = (vn / h * 100) + "%";
						} else if (esfx === "em") {
							em = _convertToPixels(t, "borderLeft", 1, "em");
							bs = (hn / em) + "em";
							bs2 = (vn / em) + "em";
						} else {
							bs = hn + "px";
							bs2 = vn + "px";
						}
						if (rel) {
							es = (parseFloat(bs) + en) + esfx;
							es2 = (parseFloat(bs2) + en) + esfx;
						}
					}
					pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
				}
				return pt;
			}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
			_registerComplexSpecialProp("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
				return _parseComplex(t.style, p, this.format(_getStyle(t, p, _cs, false, "0px 0px")), this.format(e), false, "0px", pt);
			}, prefix:true, formatter:_getFormatter("0px 0px", false, true)});
			_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
				var bp = "background-position",
					cs = (_cs || _getComputedStyle(t, null)),
					bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
					es = this.format(e),
					ba, ea, i, pct, overlap, src;
				if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1) && es.split(",").length < 2) {
					src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
					if (src && src !== "none") {
						ba = bs.split(" ");
						ea = es.split(" ");
						_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
						i = 2;
						while (--i > -1) {
							bs = ba[i];
							pct = (bs.indexOf("%") !== -1);
							if (pct !== (ea[i].indexOf("%") !== -1)) {
								overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
								ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
							}
						}
						bs = ba.join(" ");
					}
				}
				return this.parseComplex(t.style, bs, es, pt, plugin);
			}, formatter:_parsePosition});
			_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:function(v) {
				v += ""; //ensure it's a string
				return (v.substr(0,2) === "co") ? v : _parsePosition(v.indexOf(" ") === -1 ? v + " " + v : v); //if set to something like "100% 100%", Safari typically reports the computed style as just "100%" (no 2nd value), but we should ensure that there are two values, so copy the first one. Otherwise, it'd be interpreted as "100% 0" (wrong). Also remember that it could be "cover" or "contain" which we can't tween but should be able to set.
			}});
			_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
			_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
			_registerComplexSpecialProp("transformStyle", {prefix:true});
			_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
			_registerComplexSpecialProp("userSelect", {prefix:true});
			_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
			_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
			_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
				var b, cs, delim;
				if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
					cs = t.currentStyle;
					delim = _ieVers < 8 ? " " : ",";
					b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
					e = this.format(e).split(",").join(delim);
				} else {
					b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
					e = this.format(e);
				}
				return this.parseComplex(t.style, b, e, pt, plugin);
			}});
			_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
			_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
			_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
				var bw = _getStyle(t, "borderTopWidth", _cs, false, "0px"),
					end = this.format(e).split(" "),
					esfx = end[0].replace(_suffixExp, "");
				if (esfx !== "px") { //if we're animating to a non-px value, we need to convert the beginning width to that unit.
					bw = (parseFloat(bw) / _convertToPixels(t, "borderTopWidth", 1, esfx)) + esfx;
				}
				return this.parseComplex(t.style, this.format(bw + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), end.join(" "), pt, plugin);
				}, color:true, formatter:function(v) {
					var a = v.split(" ");
					return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
				}});
			_registerComplexSpecialProp("borderWidth", {parser:_getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
			_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
				var s = t.style,
					prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
				return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
			}});

			//opacity-related
			var _setIEOpacityRatio = function(v) {
					var t = this.t, //refers to the element's style property
						filters = t.filter || _getStyle(this.data, "filter") || "",
						val = (this.s + this.c * v) | 0,
						skip;
					if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
						if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
							t.removeAttribute("filter");
							skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
						} else {
							t.filter = filters.replace(_alphaFilterExp, "");
							skip = true;
						}
					}
					if (!skip) {
						if (this.xn1) {
							t.filter = filters = filters || ("alpha(opacity=" + val + ")"); //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
						}
						if (filters.indexOf("pacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
							if (val !== 0 || !this.xn1) { //bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
								t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
							}
						} else {
							t.filter = filters.replace(_opacityExp, "opacity=" + val);
						}
					}
				};
			_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
				var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
					style = t.style,
					isAutoAlpha = (p === "autoAlpha");
				if (typeof(e) === "string" && e.charAt(1) === "=") {
					e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
				}
				if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
					b = 0;
				}
				if (_supportsOpacity) {
					pt = new CSSPropTween(style, "opacity", b, e - b, pt);
				} else {
					pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
					pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
					style.zoom = 1; //helps correct an IE issue.
					pt.type = 2;
					pt.b = "alpha(opacity=" + pt.s + ")";
					pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
					pt.data = t;
					pt.plugin = plugin;
					pt.setRatio = _setIEOpacityRatio;
				}
				if (isAutoAlpha) { //we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
					pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
					pt.xs0 = "inherit";
					cssp._overwriteProps.push(pt.n);
					cssp._overwriteProps.push(p);
				}
				return pt;
			}});


			var _removeProp = function(s, p) {
					if (p) {
						if (s.removeProperty) {
							if (p.substr(0,2) === "ms" || p.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
								p = "-" + p;
							}
							s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
						} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
							s.removeAttribute(p);
						}
					}
				},
				_setClassNameRatio = function(v) {
					this.t._gsClassPT = this;
					if (v === 1 || v === 0) {
						this.t.setAttribute("class", (v === 0) ? this.b : this.e);
						var mpt = this.data, //first MiniPropTween
							s = this.t.style;
						while (mpt) {
							if (!mpt.v) {
								_removeProp(s, mpt.p);
							} else {
								s[mpt.p] = mpt.v;
							}
							mpt = mpt._next;
						}
						if (v === 1 && this.t._gsClassPT === this) {
							this.t._gsClassPT = null;
						}
					} else if (this.t.getAttribute("class") !== this.e) {
						this.t.setAttribute("class", this.e);
					}
				};
			_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
				var b = t.getAttribute("class") || "", //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
					cssText = t.style.cssText,
					difData, bs, cnpt, cnptLookup, mpt;
				pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
				pt.setRatio = _setClassNameRatio;
				pt.pr = -11;
				_hasPriority = true;
				pt.b = b;
				bs = _getAllStyles(t, _cs);
				//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
				cnpt = t._gsClassPT;
				if (cnpt) {
					cnptLookup = {};
					mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
					while (mpt) {
						cnptLookup[mpt.p] = 1;
						mpt = mpt._next;
					}
					cnpt.setRatio(1);
				}
				t._gsClassPT = pt;
				pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
				t.setAttribute("class", pt.e);
				difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
				t.setAttribute("class", b);
				pt.data = difData.firstMPT;
				t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
				pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
				return pt;
			}});


			var _setClearPropsRatio = function(v) {
				if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
					var s = this.t.style,
						transformParse = _specialProps.transform.parse,
						a, p, i, clearTransform, transform;
					if (this.e === "all") {
						s.cssText = "";
						clearTransform = true;
					} else {
						a = this.e.split(" ").join("").split(",");
						i = a.length;
						while (--i > -1) {
							p = a[i];
							if (_specialProps[p]) {
								if (_specialProps[p].parse === transformParse) {
									clearTransform = true;
								} else {
									p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
								}
							}
							_removeProp(s, p);
						}
					}
					if (clearTransform) {
						_removeProp(s, _transformProp);
						transform = this.t._gsTransform;
						if (transform) {
							if (transform.svg) {
								this.t.removeAttribute("data-svg-origin");
								this.t.removeAttribute("transform");
							}
							delete this.t._gsTransform;
						}
					}

				}
			};
			_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
				pt = new CSSPropTween(t, p, 0, 0, pt, 2);
				pt.setRatio = _setClearPropsRatio;
				pt.e = e;
				pt.pr = -10;
				pt.data = cssp._tween;
				_hasPriority = true;
				return pt;
			}});

			p = "bezier,throwProps,physicsProps,physics2D".split(",");
			i = p.length;
			while (i--) {
				_registerPluginProp(p[i]);
			}








			p = CSSPlugin.prototype;
			p._firstPT = p._lastParsedTransform = p._transform = null;

			//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
			p._onInitTween = function(target, vars, tween, index) {
				if (!target.nodeType) { //css is only for dom elements
					return false;
				}
				this._target = _target = target;
				this._tween = tween;
				this._vars = vars;
				_index = index;
				_autoRound = vars.autoRound;
				_hasPriority = false;
				_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
				_cs = _getComputedStyle(target, "");
				_overwriteProps = this._overwriteProps;
				var style = target.style,
					v, pt, pt2, first, last, next, zIndex, tpt, threeD;
				if (_reqSafariFix) if (style.zIndex === "") {
					v = _getStyle(target, "zIndex", _cs);
					if (v === "auto" || v === "") {
						//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
						this._addLazySet(style, "zIndex", 0);
					}
				}

				if (typeof(vars) === "string") {
					first = style.cssText;
					v = _getAllStyles(target, _cs);
					style.cssText = first + ";" + vars;
					v = _cssDif(target, v, _getAllStyles(target)).difs;
					if (!_supportsOpacity && _opacityValExp.test(vars)) {
						v.opacity = parseFloat( RegExp.$1 );
					}
					vars = v;
					style.cssText = first;
				}

				if (vars.className) { //className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
					this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
				} else {
					this._firstPT = pt = this.parse(target, vars, null);
				}

				if (this._transformType) {
					threeD = (this._transformType === 3);
					if (!_transformProp) {
						style.zoom = 1; //helps correct an IE issue.
					} else if (_isSafari) {
						_reqSafariFix = true;
						//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
						if (style.zIndex === "") {
							zIndex = _getStyle(target, "zIndex", _cs);
							if (zIndex === "auto" || zIndex === "") {
								this._addLazySet(style, "zIndex", 0);
							}
						}
						//Setting WebkitBackfaceVisibility corrects 3 bugs:
						// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
						// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
						// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
						//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
						if (_isSafariLT6) {
							this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
						}
					}
					pt2 = pt;
					while (pt2 && pt2._next) {
						pt2 = pt2._next;
					}
					tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
					this._linkCSSP(tpt, null, pt2);
					tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
					tpt.data = this._transform || _getTransform(target, _cs, true);
					tpt.tween = tween;
					tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
					_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
				}

				if (_hasPriority) {
					//reorders the linked list in order of pr (priority)
					while (pt) {
						next = pt._next;
						pt2 = first;
						while (pt2 && pt2.pr > pt.pr) {
							pt2 = pt2._next;
						}
						if ((pt._prev = pt2 ? pt2._prev : last)) {
							pt._prev._next = pt;
						} else {
							first = pt;
						}
						if ((pt._next = pt2)) {
							pt2._prev = pt;
						} else {
							last = pt;
						}
						pt = next;
					}
					this._firstPT = first;
				}
				return true;
			};


			p.parse = function(target, vars, pt, plugin) {
				var style = target.style,
					p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
				for (p in vars) {
					es = vars[p]; //ending value string
					if (typeof(es) === "function") {
						es = es(_index, _target);
					}
					sp = _specialProps[p]; //SpecialProp lookup.
					if (sp) {
						pt = sp.parse(target, es, p, this, pt, plugin, vars);
					} else if (p.substr(0,2) === "--") { //for tweening CSS variables (which always start with "--"). To maximize performance and simplicity, we bypass CSSPlugin altogether and just add a normal property tween to the tween instance itself.
						this._tween._propLookup[p] = this._addTween.call(this._tween, target.style, "setProperty", _getComputedStyle(target).getPropertyValue(p) + "", es + "", p, false, p);
						continue;
					} else {
						bs = _getStyle(target, p, _cs) + "";
						isStr = (typeof(es) === "string");
						if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
							if (!isStr) {
								es = _parseColor(es);
								es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
							}
							pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);

						} else if (isStr && _complexExp.test(es)) {
							pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);

						} else {
							bn = parseFloat(bs);
							bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

							if (bs === "" || bs === "auto") {
								if (p === "width" || p === "height") {
									bn = _getDimension(target, p, _cs);
									bsfx = "px";
								} else if (p === "left" || p === "top") {
									bn = _calculateOffset(target, p, _cs);
									bsfx = "px";
								} else {
									bn = (p !== "opacity") ? 0 : 1;
									bsfx = "";
								}
							}

							rel = (isStr && es.charAt(1) === "=");
							if (rel) {
								en = parseInt(es.charAt(0) + "1", 10);
								es = es.substr(2);
								en *= parseFloat(es);
								esfx = es.replace(_suffixExp, "");
							} else {
								en = parseFloat(es);
								esfx = isStr ? es.replace(_suffixExp, "") : "";
							}

							if (esfx === "") {
								esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
							}

							es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.
							//if the beginning/ending suffixes don't match, normalize them...
							if (bsfx !== esfx) if (esfx !== "" || p === "lineHeight") if (en || en === 0) if (bn) { //note: if the beginning value (bn) is 0, we don't need to convert units!
								bn = _convertToPixels(target, p, bn, bsfx);
								if (esfx === "%") {
									bn /= _convertToPixels(target, p, 100, "%") / 100;
									if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
										bs = bn + "%";
									}

								} else if (esfx === "em" || esfx === "rem" || esfx === "vw" || esfx === "vh") {
									bn /= _convertToPixels(target, p, 1, esfx);

								//otherwise convert to pixels.
								} else if (esfx !== "px") {
									en = _convertToPixels(target, p, en, esfx);
									esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
								}
								if (rel) if (en || en === 0) {
									es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
								}
							}

							if (rel) {
								en += bn;
							}

							if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
								pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
								pt.xs0 = esfx;
								//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
							} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
								_log("invalid " + p + " tween value: " + vars[p]);
							} else {
								pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
								pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
								//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
							}
						}
					}
					if (plugin) if (pt && !pt.plugin) {
						pt.plugin = plugin;
					}
				}
				return pt;
			};


			//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
			p.setRatio = function(v) {
				var pt = this._firstPT,
					min = 0.000001,
					val, str, i;
				//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
				if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
					while (pt) {
						if (pt.type !== 2) {
							if (pt.r && pt.type !== -1) {
								val = pt.r(pt.s + pt.c);
								if (!pt.type) {
									pt.t[pt.p] = val + pt.xs0;
								} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
									i = pt.l;
									str = pt.xs0 + val + pt.xs1;
									for (i = 1; i < pt.l; i++) {
										str += pt["xn"+i] + pt["xs"+(i+1)];
									}
									pt.t[pt.p] = str;
								}
							} else {
								pt.t[pt.p] = pt.e;
							}
						} else {
							pt.setRatio(v);
						}
						pt = pt._next;
					}

				} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
					while (pt) {
						val = pt.c * v + pt.s;
						if (pt.r) {
							val = pt.r(val);
						} else if (val < min) if (val > -min) {
							val = 0;
						}
						if (!pt.type) {
							pt.t[pt.p] = val + pt.xs0;
						} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
							i = pt.l;
							if (i === 2) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
							} else if (i === 3) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
							} else if (i === 4) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
							} else if (i === 5) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
							} else {
								str = pt.xs0 + val + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt.t[pt.p] = str;
							}

						} else if (pt.type === -1) { //non-tweening value
							pt.t[pt.p] = pt.xs0;

						} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
							pt.setRatio(v);
						}
						pt = pt._next;
					}

				//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
				} else {
					while (pt) {
						if (pt.type !== 2) {
							pt.t[pt.p] = pt.b;
						} else {
							pt.setRatio(v);
						}
						pt = pt._next;
					}
				}
			};

			/**
			 * @private
			 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
			 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
			 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
			 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
			 * doesn't have any transform-related properties of its own. You can call this method as many times as you
			 * want and it won't create duplicate CSSPropTweens.
			 *
			 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
			 */
			p._enableTransforms = function(threeD) {
				this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
				this._transformType = (!(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3)) ? 3 : 2;
			};

			var lazySet = function(v) {
				this.t[this.p] = this.e;
				this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
			};
			/** @private Gives us a way to set a value on the first render (and only the first render). **/
			p._addLazySet = function(t, p, v) {
				var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
				pt.e = v;
				pt.setRatio = lazySet;
				pt.data = this;
			};

			/** @private **/
			p._linkCSSP = function(pt, next, prev, remove) {
				if (pt) {
					if (next) {
						next._prev = pt;
					}
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
						remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
					}
					if (prev) {
						prev._next = pt;
					} else if (!remove && this._firstPT === null) {
						this._firstPT = pt;
					}
					pt._next = next;
					pt._prev = prev;
				}
				return pt;
			};

			p._mod = function(lookup) {
				var pt = this._firstPT;
				while (pt) {
					if (typeof(lookup[pt.p]) === "function") { //only gets called by RoundPropsPlugin (ModifyPlugin manages all the rendering internally for CSSPlugin properties that need modification). Remember, we handle rounding a bit differently in this plugin for performance reasons, leveraging "r" as an indicator that the value should be rounded internally.
						pt.r = lookup[pt.p];
					}
					pt = pt._next;
				}
			};

			//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
			p._kill = function(lookup) {
				var copy = lookup,
					pt, p, xfirst;
				if (lookup.autoAlpha || lookup.alpha) {
					copy = {};
					for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
						copy[p] = lookup[p];
					}
					copy.opacity = 1;
					if (copy.autoAlpha) {
						copy.visibility = 1;
					}
				}
				if (lookup.className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
					xfirst = pt.xfirst;
					if (xfirst && xfirst._prev) {
						this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
					} else if (xfirst === this._firstPT) {
						this._firstPT = pt._next;
					}
					if (pt._next) {
						this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
					}
					this._classNamePT = null;
				}
				pt = this._firstPT;
				while (pt) {
					if (pt.plugin && pt.plugin !== p && pt.plugin._kill) { //for plugins that are registered with CSSPlugin, we should notify them of the kill.
						pt.plugin._kill(lookup);
						p = pt.plugin;
					}
					pt = pt._next;
				}
				return TweenPlugin.prototype._kill.call(this, copy);
			};



			//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
			var _getChildStyles = function(e, props, targets) {
					var children, i, child, type;
					if (e.slice) {
						i = e.length;
						while (--i > -1) {
							_getChildStyles(e[i], props, targets);
						}
						return;
					}
					children = e.childNodes;
					i = children.length;
					while (--i > -1) {
						child = children[i];
						type = child.type;
						if (child.style) {
							props.push(_getAllStyles(child));
							if (targets) {
								targets.push(child);
							}
						}
						if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
							_getChildStyles(child, props, targets);
						}
					}
				};

			/**
			 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
			 * and then compares the style properties of all the target's child elements at the tween's start and end, and
			 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
			 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
			 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
			 * is because it creates entirely new tweens that may have completely different targets than the original tween,
			 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
			 * and it would create other problems. For example:
			 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
			 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
			 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
			 *
			 * @param {Object} target object to be tweened
			 * @param {number} Duration in seconds (or frames for frames-based tweens)
			 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
			 * @return {Array} An array of TweenLite instances
			 */
			CSSPlugin.cascadeTo = function(target, duration, vars) {
				var tween = TweenLite.to(target, duration, vars),
					results = [tween],
					b = [],
					e = [],
					targets = [],
					_reservedProps = TweenLite._internals.reservedProps,
					i, difs, p, from;
				target = tween._targets || tween.target;
				_getChildStyles(target, b, targets);
				tween.render(duration, true, true);
				_getChildStyles(target, e);
				tween.render(0, true, true);
				tween._enabled(true);
				i = targets.length;
				while (--i > -1) {
					difs = _cssDif(targets[i], b[i], e[i]);
					if (difs.firstMPT) {
						difs = difs.difs;
						for (p in vars) {
							if (_reservedProps[p]) {
								difs[p] = vars[p];
							}
						}
						from = {};
						for (p in difs) {
							from[p] = b[i][p];
						}
						results.push(TweenLite.fromTo(targets[i], duration, from, difs));
					}
				}
				return results;
			};

			TweenPlugin.activate([CSSPlugin]);
			return CSSPlugin;

		}, true);

		
		
		
		
		
		
		
		
		
		
	/*
	 * ----------------------------------------------------------------
	 * RoundPropsPlugin
	 * ----------------------------------------------------------------
	 */
		(function() {

			var RoundPropsPlugin = _gsScope._gsDefine.plugin({
					propName: "roundProps",
					version: "1.7.0",
					priority: -1,
					API: 2,

					//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
					init: function(target, value, tween) {
						this._tween = tween;
						return true;
					}

				}),
				_getRoundFunc = function(v) { //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
					var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()
					return function(n) {
						return ((Math.round(n / v) * v * p) | 0) / p;
					};
				},
				_roundLinkedList = function(node, mod) {
					while (node) {
						if (!node.f && !node.blob) {
							node.m = mod || Math.round;
						}
						node = node._next;
					}
				},
				p = RoundPropsPlugin.prototype;

			p._onInitAllProps = function() {
				var tween = this._tween,
					rp = tween.vars.roundProps,
					lookup = {},
					rpt = tween._propLookup.roundProps,
					pt, next, i, p;
				if (typeof(rp) === "object" && !rp.push) {
					for (p in rp) {
						lookup[p] = _getRoundFunc(rp[p]);
					}
				} else {
					if (typeof(rp) === "string") {
						rp = rp.split(",");
					}
					i = rp.length;
					while (--i > -1) {
						lookup[rp[i]] = Math.round;
					}
				}

				for (p in lookup) {
					pt = tween._firstPT;
					while (pt) {
						next = pt._next; //record here, because it may get removed
						if (pt.pg) {
							pt.t._mod(lookup);
						} else if (pt.n === p) {
							if (pt.f === 2 && pt.t) { //a blob (text containing multiple numeric values)
								_roundLinkedList(pt.t._firstPT, lookup[p]);
							} else {
								this._add(pt.t, p, pt.s, pt.c, lookup[p]);
								//remove from linked list
								if (next) {
									next._prev = pt._prev;
								}
								if (pt._prev) {
									pt._prev._next = next;
								} else if (tween._firstPT === pt) {
									tween._firstPT = next;
								}
								pt._next = pt._prev = null;
								tween._propLookup[p] = rpt;
							}
						}
						pt = next;
					}
				}
				return false;
			};

			p._add = function(target, p, s, c, mod) {
				this._addTween(target, p, s, s + c, p, mod || Math.round);
				this._overwriteProps.push(p);
			};

		}());










	/*
	 * ----------------------------------------------------------------
	 * AttrPlugin
	 * ----------------------------------------------------------------
	 */

		(function() {

			_gsScope._gsDefine.plugin({
				propName: "attr",
				API: 2,
				version: "0.6.1",

				//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
				init: function(target, value, tween, index) {
					var p, end;
					if (typeof(target.setAttribute) !== "function") {
						return false;
					}
					for (p in value) {
						end = value[p];
						if (typeof(end) === "function") {
							end = end(index, target);
						}
						this._addTween(target, "setAttribute", target.getAttribute(p) + "", end + "", p, false, p);
						this._overwriteProps.push(p);
					}
					return true;
				}

			});

		}());










	/*
	 * ----------------------------------------------------------------
	 * DirectionalRotationPlugin
	 * ----------------------------------------------------------------
	 */
		_gsScope._gsDefine.plugin({
			propName: "directionalRotation",
			version: "0.3.1",
			API: 2,

			//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
			init: function(target, value, tween, index) {
				if (typeof(value) !== "object") {
					value = {rotation:value};
				}
				this.finals = {};
				var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
					min = 0.000001,
					p, v, start, end, dif, split;
				for (p in value) {
					if (p !== "useRadians") {
						end = value[p];
						if (typeof(end) === "function") {
							end = end(index, target);
						}
						split = (end + "").split("_");
						v = split[0];
						start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
						end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
						dif = end - start;
						if (split.length) {
							v = split.join("_");
							if (v.indexOf("short") !== -1) {
								dif = dif % cap;
								if (dif !== dif % (cap / 2)) {
									dif = (dif < 0) ? dif + cap : dif - cap;
								}
							}
							if (v.indexOf("_cw") !== -1 && dif < 0) {
								dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
							} else if (v.indexOf("ccw") !== -1 && dif > 0) {
								dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
							}
						}
						if (dif > min || dif < -min) {
							this._addTween(target, p, start, start + dif, p);
							this._overwriteProps.push(p);
						}
					}
				}
				return true;
			},

			//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
			set: function(ratio) {
				var pt;
				if (ratio !== 1) {
					this._super.setRatio.call(this, ratio);
				} else {
					pt = this._firstPT;
					while (pt) {
						if (pt.f) {
							pt.t[pt.p](this.finals[pt.p]);
						} else {
							pt.t[pt.p] = this.finals[pt.p];
						}
						pt = pt._next;
					}
				}
			}

		})._autoCSS = true;







		
		
		
		
	/*
	 * ----------------------------------------------------------------
	 * EasePack
	 * ----------------------------------------------------------------
	 */
		_gsScope._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
			
			var w = (_gsScope.GreenSockGlobals || _gsScope),
				gs = w.com.greensock,
				_2PI = Math.PI * 2,
				_HALF_PI = Math.PI / 2,
				_class = gs._class,
				_create = function(n, f) {
					var C = _class("easing." + n, function(){}, true),
						p = C.prototype = new Ease();
					p.constructor = C;
					p.getRatio = f;
					return C;
				},
				_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
				_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
					var C = _class("easing."+name, {
						easeOut:new EaseOut(),
						easeIn:new EaseIn(),
						easeInOut:new EaseInOut()
					}, true);
					_easeReg(C, name);
					return C;
				},
				EasePoint = function(time, value, next) {
					this.t = time;
					this.v = value;
					if (next) {
						this.next = next;
						next.prev = this;
						this.c = next.v - value;
						this.gap = next.t - time;
					}
				},

				//Back
				_createBack = function(n, f) {
					var C = _class("easing." + n, function(overshoot) {
							this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
							this._p2 = this._p1 * 1.525;
						}, true),
						p = C.prototype = new Ease();
					p.constructor = C;
					p.getRatio = f;
					p.config = function(overshoot) {
						return new C(overshoot);
					};
					return C;
				},

				Back = _wrap("Back",
					_createBack("BackOut", function(p) {
						return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
					}),
					_createBack("BackIn", function(p) {
						return p * p * ((this._p1 + 1) * p - this._p1);
					}),
					_createBack("BackInOut", function(p) {
						return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
					})
				),


				//SlowMo
				SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
					power = (power || power === 0) ? power : 0.7;
					if (linearRatio == null) {
						linearRatio = 0.7;
					} else if (linearRatio > 1) {
						linearRatio = 1;
					}
					this._p = (linearRatio !== 1) ? power : 0;
					this._p1 = (1 - linearRatio) / 2;
					this._p2 = linearRatio;
					this._p3 = this._p1 + this._p2;
					this._calcEnd = (yoyoMode === true);
				}, true),
				p = SlowMo.prototype = new Ease(),
				SteppedEase, ExpoScaleEase, RoughEase, _createElastic;

			p.constructor = SlowMo;
			p.getRatio = function(p) {
				var r = p + (0.5 - p) * this._p;
				if (p < this._p1) {
					return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
				} else if (p > this._p3) {
					return this._calcEnd ? (p === 1 ? 0 : 1 - (p = (p - this._p3) / this._p1) * p) : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p); //added p === 1 ? 0 to avoid floating point rounding errors from affecting the final value, like 1 - 0.7 = 0.30000000000000004 instead of 0.3
				}
				return this._calcEnd ? 1 : r;
			};
			SlowMo.ease = new SlowMo(0.7, 0.7);

			p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
				return new SlowMo(linearRatio, power, yoyoMode);
			};


			//SteppedEase
			SteppedEase = _class("easing.SteppedEase", function(steps, immediateStart) {
					steps = steps || 1;
					this._p1 = 1 / steps;
					this._p2 = steps + (immediateStart ? 0 : 1);
					this._p3 = immediateStart ? 1 : 0;
				}, true);
			p = SteppedEase.prototype = new Ease();
			p.constructor = SteppedEase;
			p.getRatio = function(p) {
				if (p < 0) {
					p = 0;
				} else if (p >= 1) {
					p = 0.999999999;
				}
				return (((this._p2 * p) | 0) + this._p3) * this._p1;
			};
			p.config = SteppedEase.config = function(steps, immediateStart) {
				return new SteppedEase(steps, immediateStart);
			};

			//ExpoScaleEase
			ExpoScaleEase = _class("easing.ExpoScaleEase", function(start, end, ease) {
				this._p1 = Math.log(end / start);
				this._p2 = end - start;
				this._p3 = start;
				this._ease = ease;
			}, true);
			p = ExpoScaleEase.prototype = new Ease();
			p.constructor = ExpoScaleEase;
			p.getRatio = function(p) {
				if (this._ease) {
					p = this._ease.getRatio(p);
				}
				return (this._p3 * Math.exp(this._p1 * p) - this._p3) / this._p2;
			};
			p.config = ExpoScaleEase.config = function(start, end, ease) {
				return new ExpoScaleEase(start, end, ease);
			};


			//RoughEase
			RoughEase = _class("easing.RoughEase", function(vars) {
				vars = vars || {};
				var taper = vars.taper || "none",
					a = [],
					cnt = 0,
					points = (vars.points || 20) | 0,
					i = points,
					randomize = (vars.randomize !== false),
					clamp = (vars.clamp === true),
					template = (vars.template instanceof Ease) ? vars.template : null,
					strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
					x, y, bump, invX, obj, pnt;
				while (--i > -1) {
					x = randomize ? Math.random() : (1 / points) * i;
					y = template ? template.getRatio(x) : x;
					if (taper === "none") {
						bump = strength;
					} else if (taper === "out") {
						invX = 1 - x;
						bump = invX * invX * strength;
					} else if (taper === "in") {
						bump = x * x * strength;
					} else if (x < 0.5) {  //"both" (start)
						invX = x * 2;
						bump = invX * invX * 0.5 * strength;
					} else {				//"both" (end)
						invX = (1 - x) * 2;
						bump = invX * invX * 0.5 * strength;
					}
					if (randomize) {
						y += (Math.random() * bump) - (bump * 0.5);
					} else if (i % 2) {
						y += bump * 0.5;
					} else {
						y -= bump * 0.5;
					}
					if (clamp) {
						if (y > 1) {
							y = 1;
						} else if (y < 0) {
							y = 0;
						}
					}
					a[cnt++] = {x:x, y:y};
				}
				a.sort(function(a, b) {
					return a.x - b.x;
				});

				pnt = new EasePoint(1, 1, null);
				i = points;
				while (--i > -1) {
					obj = a[i];
					pnt = new EasePoint(obj.x, obj.y, pnt);
				}

				this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
			}, true);
			p = RoughEase.prototype = new Ease();
			p.constructor = RoughEase;
			p.getRatio = function(p) {
				var pnt = this._prev;
				if (p > pnt.t) {
					while (pnt.next && p >= pnt.t) {
						pnt = pnt.next;
					}
					pnt = pnt.prev;
				} else {
					while (pnt.prev && p <= pnt.t) {
						pnt = pnt.prev;
					}
				}
				this._prev = pnt;
				return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
			};
			p.config = function(vars) {
				return new RoughEase(vars);
			};
			RoughEase.ease = new RoughEase();


			//Bounce
			_wrap("Bounce",
				_create("BounceOut", function(p) {
					if (p < 1 / 2.75) {
						return 7.5625 * p * p;
					} else if (p < 2 / 2.75) {
						return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
					} else if (p < 2.5 / 2.75) {
						return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
					}
					return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
				}),
				_create("BounceIn", function(p) {
					if ((p = 1 - p) < 1 / 2.75) {
						return 1 - (7.5625 * p * p);
					} else if (p < 2 / 2.75) {
						return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
					} else if (p < 2.5 / 2.75) {
						return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
					}
					return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
				}),
				_create("BounceInOut", function(p) {
					var invert = (p < 0.5);
					if (invert) {
						p = 1 - (p * 2);
					} else {
						p = (p * 2) - 1;
					}
					if (p < 1 / 2.75) {
						p = 7.5625 * p * p;
					} else if (p < 2 / 2.75) {
						p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
					} else if (p < 2.5 / 2.75) {
						p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
					} else {
						p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
					}
					return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
				})
			);


			//CIRC
			_wrap("Circ",
				_create("CircOut", function(p) {
					return Math.sqrt(1 - (p = p - 1) * p);
				}),
				_create("CircIn", function(p) {
					return -(Math.sqrt(1 - (p * p)) - 1);
				}),
				_create("CircInOut", function(p) {
					return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
				})
			);


			//Elastic
			_createElastic = function(n, f, def) {
				var C = _class("easing." + n, function(amplitude, period) {
						this._p1 = (amplitude >= 1) ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
						this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
						this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
						this._p2 = _2PI / this._p2; //precalculate to optimize
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function(amplitude, period) {
					return new C(amplitude, period);
				};
				return C;
			};
			_wrap("Elastic",
				_createElastic("ElasticOut", function(p) {
					return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * this._p2 ) + 1;
				}, 0.3),
				_createElastic("ElasticIn", function(p) {
					return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2 ));
				}, 0.3),
				_createElastic("ElasticInOut", function(p) {
					return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * this._p2 ) * 0.5 + 1;
				}, 0.45)
			);


			//Expo
			_wrap("Expo",
				_create("ExpoOut", function(p) {
					return 1 - Math.pow(2, -10 * p);
				}),
				_create("ExpoIn", function(p) {
					return Math.pow(2, 10 * (p - 1)) - 0.001;
				}),
				_create("ExpoInOut", function(p) {
					return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
				})
			);


			//Sine
			_wrap("Sine",
				_create("SineOut", function(p) {
					return Math.sin(p * _HALF_PI);
				}),
				_create("SineIn", function(p) {
					return -Math.cos(p * _HALF_PI) + 1;
				}),
				_create("SineInOut", function(p) {
					return -0.5 * (Math.cos(Math.PI * p) - 1);
				})
			);

			_class("easing.EaseLookup", {
					find:function(s) {
						return Ease.map[s];
					}
				}, true);

			//register the non-standard eases
			_easeReg(w.SlowMo, "SlowMo", "ease,");
			_easeReg(RoughEase, "RoughEase", "ease,");
			_easeReg(SteppedEase, "SteppedEase", "ease,");

			return Back;
			
		}, true);


	});

	if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); } //necessary in case TweenLite was already loaded separately.











	/*
	 * ----------------------------------------------------------------
	 * Base classes like TweenLite, SimpleTimeline, Ease, Ticker, etc.
	 * ----------------------------------------------------------------
	 */
	(function(window, moduleName) {

			"use strict";
			var _exports = {},
				_doc = window.document,
				_globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
			if (_globals.TweenLite) {
				return _globals.TweenLite; //in case the core set of classes is already loaded, don't instantiate twice.
			}
			var _namespace = function(ns) {
					var a = ns.split("."),
						p = _globals, i;
					for (i = 0; i < a.length; i++) {
						p[a[i]] = p = p[a[i]] || {};
					}
					return p;
				},
				gs = _namespace("com.greensock"),
				_tinyNum = 0.0000000001,
				_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					var b = [],
						l = a.length,
						i;
					for (i = 0; i !== l; b.push(a[i++])) {}
					return b;
				},
				_emptyFunc = function() {},
				_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
					var toString = Object.prototype.toString,
						array = toString.call([]);
					return function(obj) {
						return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
					};
				}()),
				a, i, p, _ticker, _tickerActive,
				_defLookup = {},

				/**
				 * @constructor
				 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
				 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
				 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
				 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
				 *
				 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
				 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
				 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
				 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
				 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
				 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
				 * sandbox the banner one like:
				 *
				 * <script>
				 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
				 * </script>
				 * <script src="js/greensock/v1.7/TweenMax.js"></script>
				 * <script>
				 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
				 * </script>
				 * <script src="js/greensock/v1.6/TweenMax.js"></script>
				 * <script>
				 *     gs.TweenLite.to(...); //would use v1.7
				 *     TweenLite.to(...); //would use v1.6
				 * </script>
				 *
				 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
				 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
				 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
				 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
				 */
				Definition = function(ns, dependencies, func, global) {
					this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
					_defLookup[ns] = this;
					this.gsClass = null;
					this.func = func;
					var _classes = [];
					this.check = function(init) {
						var i = dependencies.length,
							missing = i,
							cur, a, n, cl;
						while (--i > -1) {
							if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
								_classes[i] = cur.gsClass;
								missing--;
							} else if (init) {
								cur.sc.push(this);
							}
						}
						if (missing === 0 && func) {
							a = ("com.greensock." + ns).split(".");
							n = a.pop();
							cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

							//exports to multiple environments
							if (global) {
								_globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
								if (typeof(module) !== "undefined" && module.exports) { //node
									if (ns === moduleName) {
										module.exports = _exports[moduleName] = cl;
										for (i in _exports) {
											cl[i] = _exports[i];
										}
									} else if (_exports[moduleName]) {
										_exports[moduleName][n] = cl;
									}
								} else if (true){ //AMD
									!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() { return cl; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
								}
							}
							for (i = 0; i < this.sc.length; i++) {
								this.sc[i].check();
							}
						}
					};
					this.check(true);
				},

				//used to create Definition instances (which basically registers a class that has dependencies).
				_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
					return new Definition(ns, dependencies, func, global);
				},

				//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
				_class = gs._class = function(ns, func, global) {
					func = func || function() {};
					_gsDefine(ns, [], function(){ return func; }, global);
					return func;
				};

			_gsDefine.globals = _globals;



	/*
	 * ----------------------------------------------------------------
	 * Ease
	 * ----------------------------------------------------------------
	 */
			var _baseParams = [0, 0, 1, 1],
				Ease = _class("easing.Ease", function(func, extraParams, type, power) {
					this._func = func;
					this._type = type || 0;
					this._power = power || 0;
					this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
				}, true),
				_easeMap = Ease.map = {},
				_easeReg = Ease.register = function(ease, names, types, create) {
					var na = names.split(","),
						i = na.length,
						ta = (types || "easeIn,easeOut,easeInOut").split(","),
						e, name, j, type;
					while (--i > -1) {
						name = na[i];
						e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
						j = ta.length;
						while (--j > -1) {
							type = ta[j];
							_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
						}
					}
				};

			p = Ease.prototype;
			p._calcEnd = false;
			p.getRatio = function(p) {
				if (this._func) {
					this._params[0] = p;
					return this._func.apply(null, this._params);
				}
				var t = this._type,
					pw = this._power,
					r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
				if (pw === 1) {
					r *= r;
				} else if (pw === 2) {
					r *= r * r;
				} else if (pw === 3) {
					r *= r * r * r;
				} else if (pw === 4) {
					r *= r * r * r * r;
				}
				return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
			};

			//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
			a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
			i = a.length;
			while (--i > -1) {
				p = a[i]+",Power"+i;
				_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
				_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
				_easeReg(new Ease(null,null,3,i), p, "easeInOut");
			}
			_easeMap.linear = gs.easing.Linear.easeIn;
			_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


	/*
	 * ----------------------------------------------------------------
	 * EventDispatcher
	 * ----------------------------------------------------------------
	 */
			var EventDispatcher = _class("events.EventDispatcher", function(target) {
				this._listeners = {};
				this._eventTarget = target || this;
			});
			p = EventDispatcher.prototype;

			p.addEventListener = function(type, callback, scope, useParam, priority) {
				priority = priority || 0;
				var list = this._listeners[type],
					index = 0,
					listener, i;
				if (this === _ticker && !_tickerActive) {
					_ticker.wake();
				}
				if (list == null) {
					this._listeners[type] = list = [];
				}
				i = list.length;
				while (--i > -1) {
					listener = list[i];
					if (listener.c === callback && listener.s === scope) {
						list.splice(i, 1);
					} else if (index === 0 && listener.pr < priority) {
						index = i + 1;
					}
				}
				list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
			};

			p.removeEventListener = function(type, callback) {
				var list = this._listeners[type], i;
				if (list) {
					i = list.length;
					while (--i > -1) {
						if (list[i].c === callback) {
							list.splice(i, 1);
							return;
						}
					}
				}
			};

			p.dispatchEvent = function(type) {
				var list = this._listeners[type],
					i, t, listener;
				if (list) {
					i = list.length;
					if (i > 1) {
						list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
					}
					t = this._eventTarget;
					while (--i > -1) {
						listener = list[i];
						if (listener) {
							if (listener.up) {
								listener.c.call(listener.s || t, {type:type, target:t});
							} else {
								listener.c.call(listener.s || t);
							}
						}
					}
				}
			};


	/*
	 * ----------------------------------------------------------------
	 * Ticker
	 * ----------------------------------------------------------------
	 */
	 		var _reqAnimFrame = window.requestAnimationFrame,
				_cancelAnimFrame = window.cancelAnimationFrame,
				_getTime = Date.now || function() {return new Date().getTime();},
				_lastUpdate = _getTime();

			//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
			a = ["ms","moz","webkit","o"];
			i = a.length;
			while (--i > -1 && !_reqAnimFrame) {
				_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
				_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
			}

			_class("Ticker", function(fps, useRAF) {
				var _self = this,
					_startTime = _getTime(),
					_useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false,
					_lagThreshold = 500,
					_adjustedLag = 33,
					_tickWord = "tick", //helps reduce gc burden
					_fps, _req, _id, _gap, _nextTime,
					_tick = function(manual) {
						var elapsed = _getTime() - _lastUpdate,
							overlap, dispatch;
						if (elapsed > _lagThreshold) {
							_startTime += elapsed - _adjustedLag;
						}
						_lastUpdate += elapsed;
						_self.time = (_lastUpdate - _startTime) / 1000;
						overlap = _self.time - _nextTime;
						if (!_fps || overlap > 0 || manual === true) {
							_self.frame++;
							_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
							dispatch = true;
						}
						if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
							_id = _req(_tick);
						}
						if (dispatch) {
							_self.dispatchEvent(_tickWord);
						}
					};

				EventDispatcher.call(_self);
				_self.time = _self.frame = 0;
				_self.tick = function() {
					_tick(true);
				};

				_self.lagSmoothing = function(threshold, adjustedLag) {
					if (!arguments.length) { //if lagSmoothing() is called with no arguments, treat it like a getter that returns a boolean indicating if it's enabled or not. This is purposely undocumented and is for internal use.
						return (_lagThreshold < 1 / _tinyNum);
					}
					_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
					_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
				};

				_self.sleep = function() {
					if (_id == null) {
						return;
					}
					if (!_useRAF || !_cancelAnimFrame) {
						clearTimeout(_id);
					} else {
						_cancelAnimFrame(_id);
					}
					_req = _emptyFunc;
					_id = null;
					if (_self === _ticker) {
						_tickerActive = false;
					}
				};

				_self.wake = function(seamless) {
					if (_id !== null) {
						_self.sleep();
					} else if (seamless) {
						_startTime += -_lastUpdate + (_lastUpdate = _getTime());
					} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
						_lastUpdate = _getTime() - _lagThreshold + 5;
					}
					_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
					if (_self === _ticker) {
						_tickerActive = true;
					}
					_tick(2);
				};

				_self.fps = function(value) {
					if (!arguments.length) {
						return _fps;
					}
					_fps = value;
					_gap = 1 / (_fps || 60);
					_nextTime = this.time + _gap;
					_self.wake();
				};

				_self.useRAF = function(value) {
					if (!arguments.length) {
						return _useRAF;
					}
					_self.sleep();
					_useRAF = value;
					_self.fps(_fps);
				};
				_self.fps(fps);

				//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
				setTimeout(function() {
					if (_useRAF === "auto" && _self.frame < 5 && (_doc || {}).visibilityState !== "hidden") {
						_self.useRAF(false);
					}
				}, 1500);
			});

			p = gs.Ticker.prototype = new gs.events.EventDispatcher();
			p.constructor = gs.Ticker;


	/*
	 * ----------------------------------------------------------------
	 * Animation
	 * ----------------------------------------------------------------
	 */
			var Animation = _class("core.Animation", function(duration, vars) {
					this.vars = vars = vars || {};
					this._duration = this._totalDuration = duration || 0;
					this._delay = Number(vars.delay) || 0;
					this._timeScale = 1;
					this._active = (vars.immediateRender === true);
					this.data = vars.data;
					this._reversed = (vars.reversed === true);

					if (!_rootTimeline) {
						return;
					}
					if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
						_ticker.wake();
					}

					var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
					tl.add(this, tl._time);

					if (this.vars.paused) {
						this.paused(true);
					}
				});

			_ticker = Animation.ticker = new gs.Ticker();
			p = Animation.prototype;
			p._dirty = p._gc = p._initted = p._paused = false;
			p._totalTime = p._time = 0;
			p._rawPrevTime = -1;
			p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
			p._paused = false;


			//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
			var _checkTimeout = function() {
					if (_tickerActive && _getTime() - _lastUpdate > 2000 && ((_doc || {}).visibilityState !== "hidden" || !_ticker.lagSmoothing())) { //note: if the tab is hidden, we should still wake if lagSmoothing has been disabled.
						_ticker.wake();
					}
					var t = setTimeout(_checkTimeout, 2000);
					if (t.unref) {
						// allows a node process to exit even if the timeout’s callback hasn't been invoked. Without it, the node process could hang as this function is called every two seconds.
						t.unref();
					}
				};
			_checkTimeout();


			p.play = function(from, suppressEvents) {
				if (from != null) {
					this.seek(from, suppressEvents);
				}
				return this.reversed(false).paused(false);
			};

			p.pause = function(atTime, suppressEvents) {
				if (atTime != null) {
					this.seek(atTime, suppressEvents);
				}
				return this.paused(true);
			};

			p.resume = function(from, suppressEvents) {
				if (from != null) {
					this.seek(from, suppressEvents);
				}
				return this.paused(false);
			};

			p.seek = function(time, suppressEvents) {
				return this.totalTime(Number(time), suppressEvents !== false);
			};

			p.restart = function(includeDelay, suppressEvents) {
				return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
			};

			p.reverse = function(from, suppressEvents) {
				if (from != null) {
					this.seek((from || this.totalDuration()), suppressEvents);
				}
				return this.reversed(true).paused(false);
			};

			p.render = function(time, suppressEvents, force) {
				//stub - we override this method in subclasses.
			};

			p.invalidate = function() {
				this._time = this._totalTime = 0;
				this._initted = this._gc = false;
				this._rawPrevTime = -1;
				if (this._gc || !this.timeline) {
					this._enabled(true);
				}
				return this;
			};

			p.isActive = function() {
				var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
					startTime = this._startTime,
					rawTime;
				return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime(true)) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale - 0.0000001));
			};

			p._enabled = function (enabled, ignoreTimeline) {
				if (!_tickerActive) {
					_ticker.wake();
				}
				this._gc = !enabled;
				this._active = this.isActive();
				if (ignoreTimeline !== true) {
					if (enabled && !this.timeline) {
						this._timeline.add(this, this._startTime - this._delay);
					} else if (!enabled && this.timeline) {
						this._timeline._remove(this, true);
					}
				}
				return false;
			};


			p._kill = function(vars, target) {
				return this._enabled(false, false);
			};

			p.kill = function(vars, target) {
				this._kill(vars, target);
				return this;
			};

			p._uncache = function(includeSelf) {
				var tween = includeSelf ? this : this.timeline;
				while (tween) {
					tween._dirty = true;
					tween = tween.timeline;
				}
				return this;
			};

			p._swapSelfInParams = function(params) {
				var i = params.length,
					copy = params.concat();
				while (--i > -1) {
					if (params[i] === "{self}") {
						copy[i] = this;
					}
				}
				return copy;
			};

			p._callback = function(type) {
				var v = this.vars,
					callback = v[type],
					params = v[type + "Params"],
					scope = v[type + "Scope"] || v.callbackScope || this,
					l = params ? params.length : 0;
				switch (l) { //speed optimization; call() is faster than apply() so use it when there are only a few parameters (which is by far most common). Previously we simply did var v = this.vars; v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
					case 0: callback.call(scope); break;
					case 1: callback.call(scope, params[0]); break;
					case 2: callback.call(scope, params[0], params[1]); break;
					default: callback.apply(scope, params);
				}
			};

	//----Animation getters/setters --------------------------------------------------------

			p.eventCallback = function(type, callback, params, scope) {
				if ((type || "").substr(0,2) === "on") {
					var v = this.vars;
					if (arguments.length === 1) {
						return v[type];
					}
					if (callback == null) {
						delete v[type];
					} else {
						v[type] = callback;
						v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
						v[type + "Scope"] = scope;
					}
					if (type === "onUpdate") {
						this._onUpdate = callback;
					}
				}
				return this;
			};

			p.delay = function(value) {
				if (!arguments.length) {
					return this._delay;
				}
				if (this._timeline.smoothChildTiming) {
					this.startTime( this._startTime + value - this._delay );
				}
				this._delay = value;
				return this;
			};

			p.duration = function(value) {
				if (!arguments.length) {
					this._dirty = false;
					return this._duration;
				}
				this._duration = this._totalDuration = value;
				this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
				if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
					this.totalTime(this._totalTime * (value / this._duration), true);
				}
				return this;
			};

			p.totalDuration = function(value) {
				this._dirty = false;
				return (!arguments.length) ? this._totalDuration : this.duration(value);
			};

			p.time = function(value, suppressEvents) {
				if (!arguments.length) {
					return this._time;
				}
				if (this._dirty) {
					this.totalDuration();
				}
				return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
			};

			p.totalTime = function(time, suppressEvents, uncapped) {
				if (!_tickerActive) {
					_ticker.wake();
				}
				if (!arguments.length) {
					return this._totalTime;
				}
				if (this._timeline) {
					if (time < 0 && !uncapped) {
						time += this.totalDuration();
					}
					if (this._timeline.smoothChildTiming) {
						if (this._dirty) {
							this.totalDuration();
						}
						var totalDuration = this._totalDuration,
							tl = this._timeline;
						if (time > totalDuration && !uncapped) {
							time = totalDuration;
						}
						this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
						if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
							this._uncache(false);
						}
						//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
						if (tl._timeline) {
							while (tl._timeline) {
								if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
									tl.totalTime(tl._totalTime, true);
								}
								tl = tl._timeline;
							}
						}
					}
					if (this._gc) {
						this._enabled(true, false);
					}
					if (this._totalTime !== time || this._duration === 0) {
						if (_lazyTweens.length) {
							_lazyRender();
						}
						this.render(time, suppressEvents, false);
						if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
							_lazyRender();
						}
					}
				}
				return this;
			};

			p.progress = p.totalProgress = function(value, suppressEvents) {
				var duration = this.duration();
				return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
			};

			p.startTime = function(value) {
				if (!arguments.length) {
					return this._startTime;
				}
				if (value !== this._startTime) {
					this._startTime = value;
					if (this.timeline) if (this.timeline._sortChildren) {
						this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
					}
				}
				return this;
			};

			p.endTime = function(includeRepeats) {
				return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
			};

			p.timeScale = function(value) {
				if (!arguments.length) {
					return this._timeScale;
				}
				var pauseTime, t;
				value = value || _tinyNum; //can't allow zero because it'll throw the math off
				if (this._timeline && this._timeline.smoothChildTiming) {
					pauseTime = this._pauseTime;
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
					this._startTime = t - ((t - this._startTime) * this._timeScale / value);
				}
				this._timeScale = value;
				t = this.timeline;
				while (t && t.timeline) { //must update the duration/totalDuration of all ancestor timelines immediately in case in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
					t._dirty = true;
					t.totalDuration();
					t = t.timeline;
				}
				return this;
			};

			p.reversed = function(value) {
				if (!arguments.length) {
					return this._reversed;
				}
				if (value != this._reversed) {
					this._reversed = value;
					this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
				}
				return this;
			};

			p.paused = function(value) {
				if (!arguments.length) {
					return this._paused;
				}
				var tl = this._timeline,
					raw, elapsed;
				if (value != this._paused) if (tl) {
					if (!_tickerActive && !value) {
						_ticker.wake();
					}
					raw = tl.rawTime();
					elapsed = raw - this._pauseTime;
					if (!value && tl.smoothChildTiming) {
						this._startTime += elapsed;
						this._uncache(false);
					}
					this._pauseTime = value ? raw : null;
					this._paused = value;
					this._active = this.isActive();
					if (!value && elapsed !== 0 && this._initted && this.duration()) {
						raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
						this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
					}
				}
				if (this._gc && !value) {
					this._enabled(true, false);
				}
				return this;
			};


	/*
	 * ----------------------------------------------------------------
	 * SimpleTimeline
	 * ----------------------------------------------------------------
	 */
			var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
				Animation.call(this, 0, vars);
				this.autoRemoveChildren = this.smoothChildTiming = true;
			});

			p = SimpleTimeline.prototype = new Animation();
			p.constructor = SimpleTimeline;
			p.kill()._gc = false;
			p._first = p._last = p._recent = null;
			p._sortChildren = false;

			p.add = p.insert = function(child, position, align, stagger) {
				var prevTween, st;
				child._startTime = Number(position || 0) + child._delay;
				if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
					child._pauseTime = this.rawTime() - (child._timeline.rawTime() - child._pauseTime);
				}
				if (child.timeline) {
					child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
				}
				child.timeline = child._timeline = this;
				if (child._gc) {
					child._enabled(true, true);
				}
				prevTween = this._last;
				if (this._sortChildren) {
					st = child._startTime;
					while (prevTween && prevTween._startTime > st) {
						prevTween = prevTween._prev;
					}
				}
				if (prevTween) {
					child._next = prevTween._next;
					prevTween._next = child;
				} else {
					child._next = this._first;
					this._first = child;
				}
				if (child._next) {
					child._next._prev = child;
				} else {
					this._last = child;
				}
				child._prev = prevTween;
				this._recent = child;
				if (this._timeline) {
					this._uncache(true);
				}
				return this;
			};

			p._remove = function(tween, skipDisable) {
				if (tween.timeline === this) {
					if (!skipDisable) {
						tween._enabled(false, true);
					}

					if (tween._prev) {
						tween._prev._next = tween._next;
					} else if (this._first === tween) {
						this._first = tween._next;
					}
					if (tween._next) {
						tween._next._prev = tween._prev;
					} else if (this._last === tween) {
						this._last = tween._prev;
					}
					tween._next = tween._prev = tween.timeline = null;
					if (tween === this._recent) {
						this._recent = this._last;
					}

					if (this._timeline) {
						this._uncache(true);
					}
				}
				return this;
			};

			p.render = function(time, suppressEvents, force) {
				var tween = this._first,
					next;
				this._totalTime = this._time = this._rawPrevTime = time;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (tween._active || (time >= tween._startTime && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			};

			p.rawTime = function() {
				if (!_tickerActive) {
					_ticker.wake();
				}
				return this._totalTime;
			};

	/*
	 * ----------------------------------------------------------------
	 * TweenLite
	 * ----------------------------------------------------------------
	 */
			var TweenLite = _class("TweenLite", function(target, duration, vars) {
					Animation.call(this, duration, vars);
					this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

					if (target == null) {
						throw "Cannot tween a null target.";
					}

					this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

					var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
						overwrite = this.vars.overwrite,
						i, targ, targets;

					this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

					if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
						this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
						this._propLookup = [];
						this._siblings = [];
						for (i = 0; i < targets.length; i++) {
							targ = targets[i];
							if (!targ) {
								targets.splice(i--, 1);
								continue;
							} else if (typeof(targ) === "string") {
								targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
								if (typeof(targ) === "string") {
									targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
								}
								continue;
							} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
								targets.splice(i--, 1);
								this._targets = targets = targets.concat(_slice(targ));
								continue;
							}
							this._siblings[i] = _register(targ, this, false);
							if (overwrite === 1) if (this._siblings[i].length > 1) {
								_applyOverwrite(targ, this, null, 1, this._siblings[i]);
							}
						}

					} else {
						this._propLookup = {};
						this._siblings = _register(target, this, false);
						if (overwrite === 1) if (this._siblings.length > 1) {
							_applyOverwrite(target, this, null, 1, this._siblings);
						}
					}
					if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
						this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
						this.render(Math.min(0, -this._delay)); //in case delay is negative
					}
				}, true),
				_isSelector = function(v) {
					return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
				},
				_autoCSS = function(vars, target) {
					var css = {},
						p;
					for (p in vars) {
						if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
							css[p] = vars[p];
							delete vars[p];
						}
					}
					vars.css = css;
				};

			p = TweenLite.prototype = new Animation();
			p.constructor = TweenLite;
			p.kill()._gc = false;

	//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

			p.ratio = 0;
			p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
			p._notifyPluginsOfEnabled = p._lazy = false;

			TweenLite.version = "1.20.5";
			TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
			TweenLite.defaultOverwrite = "auto";
			TweenLite.ticker = _ticker;
			TweenLite.autoSleep = 120;
			TweenLite.lagSmoothing = function(threshold, adjustedLag) {
				_ticker.lagSmoothing(threshold, adjustedLag);
			};

			TweenLite.selector = window.$ || window.jQuery || function(e) {
				var selector = window.$ || window.jQuery;
				if (selector) {
					TweenLite.selector = selector;
					return selector(e);
				}
				if (!_doc) { //in some dev environments (like Angular 6), GSAP gets loaded before the document is defined! So re-query it here if/when necessary.
					_doc = window.document;
				}
				return (!_doc) ? e : (_doc.querySelectorAll ? _doc.querySelectorAll(e) : _doc.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
			};

			var _lazyTweens = [],
				_lazyLookup = {},
				_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
				_relExp = /[\+-]=-?[\.\d]/,
				//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
				_setRatio = function(v) {
					var pt = this._firstPT,
						min = 0.000001,
						val;
					while (pt) {
						val = !pt.blob ? pt.c * v + pt.s : (v === 1 && this.end != null) ? this.end : v ? this.join("") : this.start;
						if (pt.m) {
							val = pt.m.call(this._tween, val, this._target || pt.t, this._tween);
						} else if (val < min) if (val > -min && !pt.blob) { //prevents issues with converting very small numbers to strings in the browser
							val = 0;
						}
						if (!pt.f) {
							pt.t[pt.p] = val;
						} else if (pt.fp) {
							pt.t[pt.p](pt.fp, val);
						} else {
							pt.t[pt.p](val);
						}
						pt = pt._next;
					}
				},
				//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
				_blobDif = function(start, end, filter, pt) {
					var a = [],
						charIndex = 0,
						s = "",
						color = 0,
						startNums, endNums, num, i, l, nonNumbers, currentNum;
					a.start = start;
					a.end = end;
					start = a[0] = start + ""; //ensure values are strings
					end = a[1] = end + "";
					if (filter) {
						filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
						start = a[0];
						end = a[1];
					}
					a.length = 0;
					startNums = start.match(_numbersExp) || [];
					endNums = end.match(_numbersExp) || [];
					if (pt) {
						pt._next = null;
						pt.blob = 1;
						a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
					}
					l = endNums.length;
					for (i = 0; i < l; i++) {
						currentNum = endNums[i];
						nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex)-charIndex);
						s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
						charIndex += nonNumbers.length;
						if (color) { //sense rgba() values and round them.
							color = (color + 1) % 5;
						} else if (nonNumbers.substr(-5) === "rgba(") {
							color = 1;
						}
						if (currentNum === startNums[i] || startNums.length <= i) {
							s += currentNum;
						} else {
							if (s) {
								a.push(s);
								s = "";
							}
							num = parseFloat(startNums[i]);
							a.push(num);
							a._firstPT = {_next: a._firstPT, t:a, p: a.length-1, s:num, c:((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f:0, m:(color && color < 4) ? Math.round : 0};
							//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
						}
						charIndex += currentNum.length;
					}
					s += end.substr(charIndex);
					if (s) {
						a.push(s);
					}
					a.setRatio = _setRatio;
					if (_relExp.test(end)) { //if the end string contains relative values, delete it so that on the final render (in _setRatio()), we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
						a.end = null;
					}
					return a;
				},
				//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
				_addPropTween = function(target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
					if (typeof(end) === "function") {
						end = end(index || 0, target);
					}
					var type = typeof(target[prop]),
						getterName = (type !== "function") ? "" : ((prop.indexOf("set") || typeof(target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3)),
						s = (start !== "get") ? start : !getterName ? target[prop] : funcParam ? target[getterName](funcParam) : target[getterName](),
						isRelative = (typeof(end) === "string" && end.charAt(1) === "="),
						pt = {t:target, p:prop, s:s, f:(type === "function"), pg:0, n:overwriteProp || prop, m:(!mod ? 0 : (typeof(mod) === "function") ? mod : Math.round), pr:0, c:isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0},
						blob;

					if (typeof(s) !== "number" || (typeof(end) !== "number" && !isRelative)) {
						if (funcParam || isNaN(s) || (!isRelative && isNaN(end)) || typeof(s) === "boolean" || typeof(end) === "boolean") {
							//a blob (string that has multiple numbers in it)
							pt.fp = funcParam;
							blob = _blobDif(s, (isRelative ? (parseFloat(pt.s) + pt.c) + (pt.s + "").replace(/[0-9\-\.]/g, "") : end), stringFilter || TweenLite.defaultStringFilter, pt);
							pt = {t: blob, p: "setRatio", s: 0, c: 1, f: 2, pg: 0, n: overwriteProp || prop, pr: 0, m: 0}; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
						} else {
							pt.s = parseFloat(s);
							if (!isRelative) {
								pt.c = (parseFloat(end) - pt.s) || 0;
							}
						}
					}
					if (pt.c) { //only add it to the linked list if there's a change.
						if ((pt._next = this._firstPT)) {
							pt._next._prev = pt;
						}
						this._firstPT = pt;
						return pt;
					}
				},
				_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens, blobDif:_blobDif}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
				_plugins = TweenLite._plugins = {},
				_tweenLookup = _internals.tweenLookup = {},
				_tweenLookupNum = 0,
				_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1, stringFilter:1, id:1, yoyoEase:1},
				_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
				_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
				_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
				_nextGCFrame = 30,
				_lazyRender = _internals.lazyRender = function() {
					var i = _lazyTweens.length,
						tween;
					_lazyLookup = {};
					while (--i > -1) {
						tween = _lazyTweens[i];
						if (tween && tween._lazy !== false) {
							tween.render(tween._lazy[0], tween._lazy[1], true);
							tween._lazy = false;
						}
					}
					_lazyTweens.length = 0;
				};

			_rootTimeline._startTime = _ticker.time;
			_rootFramesTimeline._startTime = _ticker.frame;
			_rootTimeline._active = _rootFramesTimeline._active = true;
			setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

			Animation._updateRoot = TweenLite.render = function() {
					var i, a, p;
					if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
						_lazyRender();
					}
					_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
					_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
					if (_lazyTweens.length) {
						_lazyRender();
					}
					if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
						_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
						for (p in _tweenLookup) {
							a = _tweenLookup[p].tweens;
							i = a.length;
							while (--i > -1) {
								if (a[i]._gc) {
									a.splice(i, 1);
								}
							}
							if (a.length === 0) {
								delete _tweenLookup[p];
							}
						}
						//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
						p = _rootTimeline._first;
						if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
							while (p && p._paused) {
								p = p._next;
							}
							if (!p) {
								_ticker.sleep();
							}
						}
					}
				};

			_ticker.addEventListener("tick", Animation._updateRoot);

			var _register = function(target, tween, scrub) {
					var id = target._gsTweenID, a, i;
					if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
						_tweenLookup[id] = {target:target, tweens:[]};
					}
					if (tween) {
						a = _tweenLookup[id].tweens;
						a[(i = a.length)] = tween;
						if (scrub) {
							while (--i > -1) {
								if (a[i] === tween) {
									a.splice(i, 1);
								}
							}
						}
					}
					return _tweenLookup[id].tweens;
				},
				_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
					var func = overwrittenTween.vars.onOverwrite, r1, r2;
					if (func) {
						r1 = func(overwrittenTween, overwritingTween, target, killedProps);
					}
					func = TweenLite.onOverwrite;
					if (func) {
						r2 = func(overwrittenTween, overwritingTween, target, killedProps);
					}
					return (r1 !== false && r2 !== false);
				},
				_applyOverwrite = function(target, tween, props, mode, siblings) {
					var i, changed, curTween, l;
					if (mode === 1 || mode >= 4) {
						l = siblings.length;
						for (i = 0; i < l; i++) {
							if ((curTween = siblings[i]) !== tween) {
								if (!curTween._gc) {
									if (curTween._kill(null, target, tween)) {
										changed = true;
									}
								}
							} else if (mode === 5) {
								break;
							}
						}
						return changed;
					}
					//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
					var startTime = tween._startTime + _tinyNum,
						overlaps = [],
						oCount = 0,
						zeroDur = (tween._duration === 0),
						globalStart;
					i = siblings.length;
					while (--i > -1) {
						if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
							//ignore
						} else if (curTween._timeline !== tween._timeline) {
							globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
							if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
								overlaps[oCount++] = curTween;
							}
						} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
							overlaps[oCount++] = curTween;
						}
					}

					i = oCount;
					while (--i > -1) {
						curTween = overlaps[i];
						if (mode === 2) if (curTween._kill(props, target, tween)) {
							changed = true;
						}
						if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
							if (mode !== 2 && !_onOverwrite(curTween, tween)) {
								continue;
							}
							if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
								changed = true;
							}
						}
					}
					return changed;
				},
				_checkOverlap = function(tween, reference, zeroDur) {
					var tl = tween._timeline,
						ts = tl._timeScale,
						t = tween._startTime;
					while (tl._timeline) {
						t += tl._startTime;
						ts *= tl._timeScale;
						if (tl._paused) {
							return -100;
						}
						tl = tl._timeline;
					}
					t /= ts;
					return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
				};


	//---- TweenLite instance methods -----------------------------------------------------------------------------

			p._init = function() {
				var v = this.vars,
					op = this._overwrittenProps,
					dur = this._duration,
					immediate = !!v.immediateRender,
					ease = v.ease,
					i, initPlugins, pt, p, startVars, l;
				if (v.startAt) {
					if (this._startAt) {
						this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
						this._startAt.kill();
					}
					startVars = {};
					for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
						startVars[p] = v.startAt[p];
					}
					startVars.data = "isStart";
					startVars.overwrite = false;
					startVars.immediateRender = true;
					startVars.lazy = (immediate && v.lazy !== false);
					startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
					startVars.onUpdate = v.onUpdate;
					startVars.onUpdateParams = v.onUpdateParams;
					startVars.onUpdateScope = v.onUpdateScope || v.callbackScope || this;
					this._startAt = TweenLite.to(this.target || {}, 0, startVars);
					if (immediate) {
						if (this._time > 0) {
							this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
						} else if (dur !== 0) {
							return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
						}
					}
				} else if (v.runBackwards && dur !== 0) {
					//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
					if (this._startAt) {
						this._startAt.render(-1, true);
						this._startAt.kill();
						this._startAt = null;
					} else {
						if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
							immediate = false;
						}
						pt = {};
						for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
							if (!_reservedProps[p] || p === "autoCSS") {
								pt[p] = v[p];
							}
						}
						pt.overwrite = 0;
						pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
						pt.lazy = (immediate && v.lazy !== false);
						pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
						this._startAt = TweenLite.to(this.target, 0, pt);
						if (!immediate) {
							this._startAt._init(); //ensures that the initial values are recorded
							this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
							if (this.vars.immediateRender) {
								this._startAt = null;
							}
						} else if (this._time === 0) {
							return;
						}
					}
				}
				this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
				if (v.easeParams instanceof Array && ease.config) {
					this._ease = ease.config.apply(ease, v.easeParams);
				}
				this._easeType = this._ease._type;
				this._easePower = this._ease._power;
				this._firstPT = null;

				if (this._targets) {
					l = this._targets.length;
					for (i = 0; i < l; i++) {
						if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null), i) ) {
							initPlugins = true;
						}
					}
				} else {
					initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
				}

				if (initPlugins) {
					TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
				}
				if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
					this._enabled(false, false);
				}
				if (v.runBackwards) {
					pt = this._firstPT;
					while (pt) {
						pt.s += pt.c;
						pt.c = -pt.c;
						pt = pt._next;
					}
				}
				this._onUpdate = v.onUpdate;
				this._initted = true;
			};

			p._initProps = function(target, propLookup, siblings, overwrittenProps, index) {
				var p, i, initPlugins, plugin, pt, v;
				if (target == null) {
					return false;
				}

				if (_lazyLookup[target._gsTweenID]) {
					_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
				}

				if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
					_autoCSS(this.vars, target);
				}
				for (p in this.vars) {
					v = this.vars[p];
					if (_reservedProps[p]) {
						if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
							this.vars[p] = v = this._swapSelfInParams(v, this);
						}

					} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {

						//t - target 		[object]
						//p - property 		[string]
						//s - start			[number]
						//c - change		[number]
						//f - isFunction	[boolean]
						//n - name			[string]
						//pg - isPlugin 	[boolean]
						//pr - priority		[number]
						//m - mod           [function | 0]
						this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:1, n:p, pg:1, pr:plugin._priority, m:0};
						i = plugin._overwriteProps.length;
						while (--i > -1) {
							propLookup[plugin._overwriteProps[i]] = this._firstPT;
						}
						if (plugin._priority || plugin._onInitAllProps) {
							initPlugins = true;
						}
						if (plugin._onDisable || plugin._onEnable) {
							this._notifyPluginsOfEnabled = true;
						}
						if (pt._next) {
							pt._next._prev = pt;
						}

					} else {
						propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
					}
				}

				if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
					return this._initProps(target, propLookup, siblings, overwrittenProps, index);
				}
				if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
					this._kill(propLookup, target);
					return this._initProps(target, propLookup, siblings, overwrittenProps, index);
				}
				if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
					_lazyLookup[target._gsTweenID] = true;
				}
				return initPlugins;
			};

			p.render = function(time, suppressEvents, force) {
				var prevTime = this._time,
					duration = this._duration,
					prevRawPrevTime = this._rawPrevTime,
					isComplete, callback, pt, rawPrevTime;
				if (time >= duration - 0.0000001 && time >= 0) { //to work around occasional floating point math artifacts.
					this._totalTime = this._time = duration;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
					if (!this._reversed ) {
						isComplete = true;
						callback = "onComplete";
						force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					}
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
							time = 0;
						}
						if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
							force = true;
							if (prevRawPrevTime > _tinyNum) {
								callback = "onReverseComplete";
							}
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}

				} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
					this._totalTime = this._time = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
					if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
						callback = "onReverseComplete";
						isComplete = this._reversed;
					}
					if (time < 0) {
						this._active = false;
						if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
							if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
								force = true;
							}
							this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
						}
					}
					if (!this._initted || (this._startAt && this._startAt.progress())) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately. Also, we check progress() because if startAt has already rendered at its end, we should force a render at its beginning. Otherwise, if you put the playhead directly on top of where a fromTo({immediateRender:false}) starts, and then move it backwards, the from() won't revert its values.
						force = true;
					}
				} else {
					this._totalTime = this._time = time;

					if (this._easeType) {
						var r = time / duration, type = this._easeType, pow = this._easePower;
						if (type === 1 || (type === 3 && r >= 0.5)) {
							r = 1 - r;
						}
						if (type === 3) {
							r *= 2;
						}
						if (pow === 1) {
							r *= r;
						} else if (pow === 2) {
							r *= r * r;
						} else if (pow === 3) {
							r *= r * r * r;
						} else if (pow === 4) {
							r *= r * r * r * r;
						}

						if (type === 1) {
							this.ratio = 1 - r;
						} else if (type === 2) {
							this.ratio = r;
						} else if (time / duration < 0.5) {
							this.ratio = r / 2;
						} else {
							this.ratio = 1 - (r / 2);
						}

					} else {
						this.ratio = this._ease.getRatio(time / duration);
					}
				}

				if (this._time === prevTime && !force) {
					return;
				} else if (!this._initted) {
					this._init();
					if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
						return;
					} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
						this._time = this._totalTime = prevTime;
						this._rawPrevTime = prevRawPrevTime;
						_lazyTweens.push(this);
						this._lazy = [time, suppressEvents];
						return;
					}
					//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
					if (this._time && !isComplete) {
						this.ratio = this._ease.getRatio(this._time / duration);
					} else if (isComplete && this._ease._calcEnd) {
						this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
					}
				}
				if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
					this._lazy = false;
				}
				if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
					this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
				}
				if (prevTime === 0) {
					if (this._startAt) {
						if (time >= 0) {
							this._startAt.render(time, true, force);
						} else if (!callback) {
							callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
						}
					}
					if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
						this._callback("onStart");
					}
				}
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](pt.c * this.ratio + pt.s);
					} else {
						pt.t[pt.p] = pt.c * this.ratio + pt.s;
					}
					pt = pt._next;
				}

				if (this._onUpdate) {
					if (time < 0) if (this._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
						this._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
					}
					if (!suppressEvents) if (this._time !== prevTime || isComplete || force) {
						this._callback("onUpdate");
					}
				}
				if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
					if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
						this._startAt.render(time, true, force);
					}
					if (isComplete) {
						if (this._timeline.autoRemoveChildren) {
							this._enabled(false, false);
						}
						this._active = false;
					}
					if (!suppressEvents && this.vars[callback]) {
						this._callback(callback);
					}
					if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
						this._rawPrevTime = 0;
					}
				}
			};

			p._kill = function(vars, target, overwritingTween) {
				if (vars === "all") {
					vars = null;
				}
				if (vars == null) if (target == null || target === this.target) {
					this._lazy = false;
					return this._enabled(false, false);
				}
				target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
				var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
					i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
				if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
					i = target.length;
					while (--i > -1) {
						if (this._kill(vars, target[i], overwritingTween)) {
							changed = true;
						}
					}
				} else {
					if (this._targets) {
						i = this._targets.length;
						while (--i > -1) {
							if (target === this._targets[i]) {
								propLookup = this._propLookup[i] || {};
								this._overwrittenProps = this._overwrittenProps || [];
								overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
								break;
							}
						}
					} else if (target !== this.target) {
						return false;
					} else {
						propLookup = this._propLookup;
						overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
					}

					if (propLookup) {
						killProps = vars || propLookup;
						record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
						if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
							for (p in killProps) {
								if (propLookup[p]) {
									if (!killed) {
										killed = [];
									}
									killed.push(p);
								}
							}
							if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
								return false;
							}
						}

						for (p in killProps) {
							if ((pt = propLookup[p])) {
								if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
									if (pt.f) {
										pt.t[pt.p](pt.s);
									} else {
										pt.t[pt.p] = pt.s;
									}
									changed = true;
								}
								if (pt.pg && pt.t._kill(killProps)) {
									changed = true; //some plugins need to be notified so they can perform cleanup tasks first
								}
								if (!pt.pg || pt.t._overwriteProps.length === 0) {
									if (pt._prev) {
										pt._prev._next = pt._next;
									} else if (pt === this._firstPT) {
										this._firstPT = pt._next;
									}
									if (pt._next) {
										pt._next._prev = pt._prev;
									}
									pt._next = pt._prev = null;
								}
								delete propLookup[p];
							}
							if (record) {
								overwrittenProps[p] = 1;
							}
						}
						if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
							this._enabled(false, false);
						}
					}
				}
				return changed;
			};

			p.invalidate = function() {
				if (this._notifyPluginsOfEnabled) {
					TweenLite._onPluginEvent("_onDisable", this);
				}
				this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
				this._notifyPluginsOfEnabled = this._active = this._lazy = false;
				this._propLookup = (this._targets) ? {} : [];
				Animation.prototype.invalidate.call(this);
				if (this.vars.immediateRender) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(Math.min(0, -this._delay)); //in case delay is negative.
				}
				return this;
			};

			p._enabled = function(enabled, ignoreTimeline) {
				if (!_tickerActive) {
					_ticker.wake();
				}
				if (enabled && this._gc) {
					var targets = this._targets,
						i;
					if (targets) {
						i = targets.length;
						while (--i > -1) {
							this._siblings[i] = _register(targets[i], this, true);
						}
					} else {
						this._siblings = _register(this.target, this, true);
					}
				}
				Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
				if (this._notifyPluginsOfEnabled) if (this._firstPT) {
					return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
				}
				return false;
			};


	//----TweenLite static methods -----------------------------------------------------

			TweenLite.to = function(target, duration, vars) {
				return new TweenLite(target, duration, vars);
			};

			TweenLite.from = function(target, duration, vars) {
				vars.runBackwards = true;
				vars.immediateRender = (vars.immediateRender != false);
				return new TweenLite(target, duration, vars);
			};

			TweenLite.fromTo = function(target, duration, fromVars, toVars) {
				toVars.startAt = fromVars;
				toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
				return new TweenLite(target, duration, toVars);
			};

			TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
				return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
			};

			TweenLite.set = function(target, vars) {
				return new TweenLite(target, 0, vars);
			};

			TweenLite.getTweensOf = function(target, onlyActive) {
				if (target == null) { return []; }
				target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
				var i, a, j, t;
				if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
					i = target.length;
					a = [];
					while (--i > -1) {
						a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
					}
					i = a.length;
					//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
					while (--i > -1) {
						t = a[i];
						j = i;
						while (--j > -1) {
							if (t === a[j]) {
								a.splice(i, 1);
							}
						}
					}
				} else if (target._gsTweenID) {
					a = _register(target).concat();
					i = a.length;
					while (--i > -1) {
						if (a[i]._gc || (onlyActive && !a[i].isActive())) {
							a.splice(i, 1);
						}
					}
				}
				return a || [];
			};

			TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
				if (typeof(onlyActive) === "object") {
					vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
					onlyActive = false;
				}
				var a = TweenLite.getTweensOf(target, onlyActive),
					i = a.length;
				while (--i > -1) {
					a[i]._kill(vars, target);
				}
			};



	/*
	 * ----------------------------------------------------------------
	 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
	 * ----------------------------------------------------------------
	 */
			var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
						this._overwriteProps = (props || "").split(",");
						this._propName = this._overwriteProps[0];
						this._priority = priority || 0;
						this._super = TweenPlugin.prototype;
					}, true);

			p = TweenPlugin.prototype;
			TweenPlugin.version = "1.19.0";
			TweenPlugin.API = 2;
			p._firstPT = null;
			p._addTween = _addPropTween;
			p.setRatio = _setRatio;

			p._kill = function(lookup) {
				var a = this._overwriteProps,
					pt = this._firstPT,
					i;
				if (lookup[this._propName] != null) {
					this._overwriteProps = [];
				} else {
					i = a.length;
					while (--i > -1) {
						if (lookup[a[i]] != null) {
							a.splice(i, 1);
						}
					}
				}
				while (pt) {
					if (lookup[pt.n] != null) {
						if (pt._next) {
							pt._next._prev = pt._prev;
						}
						if (pt._prev) {
							pt._prev._next = pt._next;
							pt._prev = null;
						} else if (this._firstPT === pt) {
							this._firstPT = pt._next;
						}
					}
					pt = pt._next;
				}
				return false;
			};

			p._mod = p._roundProps = function(lookup) {
				var pt = this._firstPT,
					val;
				while (pt) {
					val = lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ]);
					if (val && typeof(val) === "function") { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
						if (pt.f === 2) {
							pt.t._applyPT.m = val;
						} else {
							pt.m = val;
						}
					}
					pt = pt._next;
				}
			};

			TweenLite._onPluginEvent = function(type, tween) {
				var pt = tween._firstPT,
					changed, pt2, first, last, next;
				if (type === "_onInitAllProps") {
					//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
					while (pt) {
						next = pt._next;
						pt2 = first;
						while (pt2 && pt2.pr > pt.pr) {
							pt2 = pt2._next;
						}
						if ((pt._prev = pt2 ? pt2._prev : last)) {
							pt._prev._next = pt;
						} else {
							first = pt;
						}
						if ((pt._next = pt2)) {
							pt2._prev = pt;
						} else {
							last = pt;
						}
						pt = next;
					}
					pt = tween._firstPT = first;
				}
				while (pt) {
					if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
						changed = true;
					}
					pt = pt._next;
				}
				return changed;
			};

			TweenPlugin.activate = function(plugins) {
				var i = plugins.length;
				while (--i > -1) {
					if (plugins[i].API === TweenPlugin.API) {
						_plugins[(new plugins[i]())._propName] = plugins[i];
					}
				}
				return true;
			};

			//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
			_gsDefine.plugin = function(config) {
				if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
				var propName = config.propName,
					priority = config.priority || 0,
					overwriteProps = config.overwriteProps,
					map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_mod", mod:"_mod", initAll:"_onInitAllProps"},
					Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
						function() {
							TweenPlugin.call(this, propName, priority);
							this._overwriteProps = overwriteProps || [];
						}, (config.global === true)),
					p = Plugin.prototype = new TweenPlugin(propName),
					prop;
				p.constructor = Plugin;
				Plugin.API = config.API;
				for (prop in map) {
					if (typeof(config[prop]) === "function") {
						p[map[prop]] = config[prop];
					}
				}
				Plugin.version = config.version;
				TweenPlugin.activate([Plugin]);
				return Plugin;
			};


			//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
			a = window._gsQueue;
			if (a) {
				for (i = 0; i < a.length; i++) {
					a[i]();
				}
				for (p in _defLookup) {
					if (!_defLookup[p].func) {
						window.console.log("GSAP encountered missing dependency: " + p);
					}
				}
			}

			_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

	})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenMax");
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jbone = __webpack_require__(3);

	var _jbone2 = _interopRequireDefault(_jbone);

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	var _CameraModel = __webpack_require__(37);

	var _CameraModel2 = _interopRequireDefault(_CameraModel);

	var _BackgroundModel = __webpack_require__(38);

	var _BackgroundModel2 = _interopRequireDefault(_BackgroundModel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Home = _exoskeleton2.default.View.extend({

	    collection: null,
	    cameraModel: null,
	    backgroundModel: null,

	    startScrollX: 0,
	    velocity: 0,
	    speed: 0.075,
	    friction: 0.95,

	    el: (0, _jbone2.default)('.homepage'),
	    template: _underscore2.default.template((0, _jbone2.default)('#homepage-template').html()),

	    initialize: function initialize(collection) {

	        this.collection = collection;
	        this.render();

	        this.cameraModel = new _CameraModel2.default(collection.length, this.$el.find('.sketches-list li'));
	        this.backgroundModel = new _BackgroundModel2.default((0, _jbone2.default)('.background-canvas'), collection.length);

	        this.touchStart = this.touchStart.bind(this);
	        this.touchMove = this.touchMove.bind(this);
	        this.touchEnd = this.touchEnd.bind(this);

	        this.mouseDown = this.mouseDown.bind(this);
	        this.mouseMove = this.mouseMove.bind(this);
	        this.mouseUp = this.mouseUp.bind(this);

	        this.setHandlers();
	    },
	    setHandlers: function setHandlers() {
	        this.$el.on('mousedown', this.mouseDown);
	        this.$el.on('touchstart', this.touchStart);
	    },
	    touchStart: function touchStart(e) {
	        e.stopImmediatePropagation();
	        e.stopPropagation();
	        if (e.target.nodeName !== 'IMG') {
	            e.preventDefault();
	        }
	        this.$el.on('touchmove', this.touchMove);
	        this.$el.on('touchend', this.touchEnd);
	        this.startScrollX = e.touches[0].pageX;
	    },
	    touchMove: function touchMove(e) {
	        e.stopImmediatePropagation();
	        e.stopPropagation();
	        e.preventDefault();
	        e.stopImmediatePropagation();
	        if (e.touches[0].pageX !== undefined) {
	            this.velocity = -(e.touches[0].pageX - this.startScrollX) / 7;
	        }
	        if (this.velocity < 0) this.speed = -0.075;
	        if (this.velocity > 0) this.speed = 0.075;
	    },
	    touchEnd: function touchEnd() {
	        this.$el.off('touchmove', this.touchMove);
	        this.$el.off('touchend', this.touchEnd);
	    },
	    mouseDown: function mouseDown(e) {
	        this.$el.on('mousemove', this.mouseMove);
	        this.$el.on('mouseup', this.mouseUp);
	        this.startScrollX = e.pageX;
	        this.$el.css('cursor', '-webkit-grabbing');
	    },
	    mouseMove: function mouseMove(e) {
	        if (e.pageX !== undefined) {
	            this.velocity = -(e.pageX - this.startScrollX) / 10;
	        }
	        if (this.velocity < 0) this.speed = -0.075;
	        if (this.velocity > 0) this.speed = 0.075;
	        this.$el.css('cursor', '-webkit-grabbing');
	    },
	    mouseUp: function mouseUp() {
	        this.$el.off('mousemove', this.mouseMove);
	        this.$el.off('mouseup', this.mouseUp);
	        this.$el.css('cursor', '-webkit-grab');
	    },
	    updateAnimationFrame: function updateAnimationFrame() {
	        this.velocity *= this.friction;
	        this.velocity += this.speed;
	        this.cameraModel.update(this.velocity);
	        this.backgroundModel.update(this.cameraModel.getDistance(), this.cameraModel.totalWidth);
	    },
	    render: function render() {
	        this.$el.find('.sketches-list').html(this.template({ works: this.collection.models }));
	        return this;
	    },
	    showLoading: function showLoading(tween) {
	        this.backgroundModel.showLoading(tween);
	        var cursor = (0, _jbone2.default)('#cursor');
	        tween.fromTo(cursor, 0.35, {
	            x: '-300px',
	            y: '' + (window.innerHeight + 24)
	        }, {
	            x: '0px',
	            y: window.innerHeight / 2 + 'px'
	        });
	        tween.add(function () {
	            return cursor.addClass('active');
	        });
	        tween.to(cursor, 0.3, { x: '-800px', opacity: 0 }, '+=0.4');
	        tween.add(function () {
	            return cursor.remove();
	        });
	        tween.fromTo(this.$el, 0.6, { x: '200%' }, { x: '0%' });
	        tween.to((0, _jbone2.default)('.app-header'), 0.2, { opacity: 1, ease: Power3.easeOut }, '+=0.15');
	    },
	    showLoadingQuick: function showLoadingQuick(tween) {
	        this.backgroundModel.showLoading(tween);
	        tween.to((0, _jbone2.default)('.app-header'), 0.2, { opacity: 1, ease: Power3.easeOut });
	    },
	    onresize: function onresize(width, height) {
	        this.cameraModel.onresize(width, height);
	        this.backgroundModel.onresize(width, height);
	    }
	});

	exports.default = Home;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jbone = __webpack_require__(3);

	var _jbone2 = _interopRequireDefault(_jbone);

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CameraModel = _exoskeleton2.default.Model.extend({

	    domCollection: null,

	    points: [],
	    totalWidth: 0,
	    spacing: 0,

	    width: 0,
	    height: 0,

	    initialize: function initialize(num, domCollection) {

	        this.spacing = domCollection[0].getBoundingClientRect().width;

	        this.makePoints(num);
	        this.domCollection = domCollection;

	        this.width = window.innerWidth;
	        this.height = window.innerHeight;
	    },
	    makePoints: function makePoints(num) {
	        for (var i = 0; i < num; i += 1) {
	            this.points.push({
	                x: i * this.spacing,
	                y: window.innerHeight / 2 + Math.sin(i * this.spacing) * 100 - 80,
	                scale: 0.5 + Math.random() * 0.5
	            });
	            this.totalWidth += this.spacing;
	        }
	    },
	    update: function update(speed) {
	        var _this = this;

	        this.points.forEach(function (p, i) {
	            var li = _this.domCollection[i];

	            if (p.x > -_this.spacing && p.x < _this.width) {
	                (0, _jbone2.default)(li).css({
	                    transform: '\n                        translate3d(' + p.x + 'px, ' + p.y + 'px, 0) \n                        scale(' + p.scale + ', ' + p.scale + ')\n                    ',
	                    display: 'block'
	                });
	            } else {
	                (0, _jbone2.default)(li).css({
	                    display: 'none'
	                });
	            }

	            p.x += -speed;

	            if (p.x <= -_this.width) {
	                p.x += _this.totalWidth;
	            } else if (p.x >= _this.totalWidth - _this.width) {
	                p.x -= _this.totalWidth;
	            }
	        });
	    },
	    onresize: function onresize(width, height) {
	        this.width = width;
	        this.height = height;
	    },
	    getDistance: function getDistance() {
	        return this.points[0].x;
	    }
	});

	exports.default = CameraModel;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jbone = __webpack_require__(3);

	var _jbone2 = _interopRequireDefault(_jbone);

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	var _Pointer = __webpack_require__(39);

	var _Pointer2 = _interopRequireDefault(_Pointer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BackgroundModel = _exoskeleton2.default.Model.extend({

	    ctx: null,
	    width: null,
	    height: null,
	    points: null,
	    radius: null,

	    el: (0, _jbone2.default)('<canvas></canvas>'),
	    loaded: false,

	    angle: 0,
	    number: 0,
	    progress: {
	        circle: 0,
	        indicatorOpacity: 0
	    },
	    flags: [],

	    initialize: function initialize(parent, num) {
	        this.number = num;
	        console.log(num);
	        this.width = this.el[0].width = window.innerWidth;
	        this.height = this.el[0].height = window.innerHeight;
	        this.radius = 200;
	        this.ctx = this.el[0].getContext('2d');

	        this.ctx.imageSmoothingEnabled = false;

	        parent.append(this.el);

	        this.points = [{ startX: this.width / 2 - 80, startY: this.height / 2 - 30, x: 0, y: 0 }, { startX: this.width / 2 - 80, startY: this.height / 2 - 30, x: this.width, y: 0 }, { startX: this.width / 2 - 80, startY: this.height / 2 + 30, x: this.width, y: this.height }, { startX: this.width / 2 - 80, startY: this.height / 2 + 30, x: -this.width, y: this.height }];

	        for (var i = Math.PI, step = Math.floor(num / 18); i > -Math.PI; i -= Math.PI * 2 / step) {

	            this.flags.push({
	                x: this.width / 2 + Math.sin(i) * this.radius,
	                y: this.height / 2 + Math.cos(i) * this.radius,
	                opacity: 0
	            });
	        }
	    },
	    update: function update(dist, max) {
	        var _this = this;

	        this.ctx.save();
	        this.ctx.clearRect(0, 0, this.width, this.height);

	        this.drawShape();

	        this.ctx.translate(this.width / 2, this.height / 2);
	        this.ctx.rotate(180 * Math.PI / 180);

	        this.ctx.fillStyle = '#eee';
	        this.ctx.beginPath();
	        this.ctx.arc(0, 0, this.radius - 12, 0, this.progress.circle, true);
	        this.ctx.fill();

	        this.ctx.strokeStyle = '#ddd';
	        this.ctx.lineWidth = 1;
	        this.ctx.beginPath();
	        this.ctx.arc(0, 0, this.radius, 0, this.progress.circle, true);
	        this.ctx.stroke();

	        var dv = Math.PI * 2 / max;
	        this.angle = dist * dv;

	        this.ctx.rotate(-180 * Math.PI / 180);
	        this.ctx.translate(-this.width / 2, -this.height / 2);
	        this.flags.forEach(function (v, i) {
	            _this.ctx.globalAlpha = v.opacity;
	            _this.ctx.beginPath();
	            _this.ctx.fillStyle = 'whitesmoke';
	            _this.ctx.arc(v.x, v.y, 9, 0, Math.PI * 2, true);
	            _this.ctx.fill();
	            _this.ctx.beginPath();
	            _this.ctx.fillStyle = '#aaa';
	            _this.ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2, true);
	            _this.ctx.fill();
	        });

	        this.ctx.translate(this.width / 2, this.height / 2);
	        this.ctx.rotate(-180 * Math.PI / 180);
	        this.ctx.globalAlpha = this.indicatorOpacity;
	        _Pointer2.default.update(this.ctx, this.angle, Math.sin(this.angle) * this.radius, Math.cos(this.angle) * this.radius);

	        this.ctx.restore();
	    },
	    drawShape: function drawShape() {
	        this.ctx.fillStyle = 'whitesmoke';
	        this.ctx.beginPath();
	        this.ctx.moveTo(this.points[0].startX, this.points[0].startY);
	        this.ctx.lineTo(this.points[1].startX, this.points[1].startY);
	        this.ctx.lineTo(this.points[2].startX, this.points[2].startY);
	        this.ctx.lineTo(this.points[3].startX, this.points[3].startY);
	        this.ctx.closePath();
	        this.ctx.fill();
	    },
	    showLoading: function showLoading(tween) {
	        if (!this.loaded) {
	            tween.to(this.points[1], 2, { startX: this.width / 2 + 80 });
	            tween.to(this.points[2], 2, { startX: this.width / 2 + 80 }, '-=2');

	            tween.to(this.points[0], 0.25, { startX: this.points[0].x, startY: this.points[0].y, ease: Power3.easeIn }, '-=0.175');
	            tween.to(this.points[1], 0.25, { startX: this.points[1].x, startY: this.points[1].y, ease: Power3.easeIn }, '-=0.175');
	            tween.to(this.points[2], 0.25, { startX: this.points[2].x, startY: this.points[2].y, ease: Power3.easeIn }, '-=0.175');
	            tween.to(this.points[3], 0.25, { startX: this.points[3].x, startY: this.points[3].y, ease: Power3.easeIn }, '-=0.175');
	        }
	        this.loaded = true;
	        tween.to(this.progress, 0.7, { circle: -Math.PI * 2, ease: Power3.easeOut });
	        tween.to(this.progress, 0.2, { indicatorOpacity: 1 });

	        this.flags.forEach(function (v, i) {
	            tween.to(v, 0.1, { opacity: 1 });
	        });
	    },
	    onresize: function onresize(width, height) {
	        this.width = this.el[0].width = width;
	        this.height = this.el[0].height = height;
	    }
	});

	exports.default = BackgroundModel;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Cursor = function () {

	    var radius = 5;

	    var update = function update(ctx, dv, x, y) {
	        ctx.fillStyle = '#00f';
	        ctx.beginPath();
	        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
	        ctx.closePath();
	        ctx.fill();
	    };

	    return {
	        update: update
	    };
	}();

	exports.default = Cursor;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jbone = __webpack_require__(3);

	var _jbone2 = _interopRequireDefault(_jbone);

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Single = _exoskeleton2.default.View.extend({

	    iframeContainer: null,
	    iframe: null,
	    visibleLis: null,
	    activeLi: null,
	    backBtn: null,

	    width: 0,
	    height: 0,

	    el: (0, _jbone2.default)('.singlepage'),
	    loading: (0, _jbone2.default)('.page-switcher'),

	    initialize: function initialize() {
	        this.width = window.innerWidth;
	        this.height = window.innerHeight;
	        this.iframeContainer = this.$el.find('.iframe-container');
	        this.backBtn = this.$el.find('.back-link');
	    },
	    open: function open(key, tween) {
	        var _this = this;

	        this.visibleLis = (0, _jbone2.default)('.sketches li[style*="display: block"]');
	        if (this.visibleLis) {
	            this.visibleLis.forEach(function (li, index) {
	                li = (0, _jbone2.default)(li);
	                if (li.attr('id') === key) {
	                    _this.activeLi = li;
	                    tween.to(li, 0.2, {
	                        x: _this.width / 2 - parseInt(li.css('width')) / 2 + 'px',
	                        y: _this.height / 2 - 80 + 'px',
	                        scaleX: 1,
	                        scaleY: 1
	                    });
	                } else {
	                    tween.to(li, 0.1, { opacity: 0 });
	                }
	            });
	        }
	        tween.add(function () {
	            return _this.appendIframe(key, tween);
	        });
	        if (this.activeLi) tween.to(this.activeLi.find('.sketch-title-panel'), 0.2, { x: '0%' });
	        tween.to(this.loading, 0.2, { scaleX: 1, transformOrigin: '0 0 0', ease: Power3.easeOut });
	    },
	    close: function close(tween) {
	        var _this2 = this;

	        tween.to(this.loading, 0.3, { opacity: 1 });
	        tween.add(function () {
	            return _this2.iframe.remove();
	        });
	        tween.to(this.loading, 0.4, { scaleX: 0, transformOrigin: '100% 0 0', ease: Power3.easeIn });
	        if (this.visibleLis) {
	            this.visibleLis.forEach(function (li, index) {
	                tween.to(li, 0.1, { opacity: 1 });
	            });
	        }
	        if (this.activeLi) tween.to(this.activeLi.find('.sketch-title-panel'), 0.2, { x: '-100%' });
	    },
	    iframeLoaded: function iframeLoaded(tween) {
	        if (this.activeLi) tween.to(this.activeLi, .4, { x: '-300px', opacity: 0 });
	        tween.to(this.loading, 0.25, { opacity: 0 });
	        tween.fromTo(this.backBtn, 0.2, { y: '-120px', ease: Power3.easeOut }, { y: '0px' });
	    },
	    appendIframe: function appendIframe(key, tween) {
	        this.iframe = (0, _jbone2.default)('<iframe></iframe');
	        this.iframe.attr('width', this.width);
	        this.iframe.attr('height', this.height);
	        this.iframeContainer.append(this.iframe);
	        this.iframe.on('load', this.iframeLoaded.bind(this, tween));
	        this.iframe.attr('src', 'https://codepen.io/gbnikolov/full/' + key);
	    },
	    onresize: function onresize(width, height) {
	        this.width = width;
	        this.height = height;
	    }
	});

	exports.default = Single;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(42);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(44)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./imports.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./imports.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(43)();
	// imports


	// module
	exports.push([module.id, "* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0; }\n\ncanvas {\n  display: block; }\n\nbody {\n  overflow: hidden;\n  font-family: 'Inconsolata', monospace;\n  background: #aaa;\n  letter-spacing: 0.08rem;\n  overflow: hidden; }\n\n.noselect {\n  -webkit-touch-callout: none;\n  /* iOS Safari */\n  -webkit-user-select: none;\n  /* Chrome/Safari/Opera */\n  -khtml-user-select: none;\n  /* Konqueror */\n  -moz-user-select: none;\n  /* Firefox */\n  -ms-user-select: none;\n  /* Internet Explorer/Edge */\n  user-select: none;\n  /* Non-prefixed version, currently\n                                  not supported by any browser */ }\n\n#cursor {\n  position: absolute;\n  top: -16px;\n  left: 50%;\n  width: 16px;\n  height: 16px;\n  background-repeat: no-repeat;\n  background-position: 0 0; }\n  #cursor.active {\n    background-position: -16px 0; }\n\n.background-canvas {\n  z-index: -2; }\n\n#unsupport {\n  z-index: 1000;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #fff;\n  padding: 3em; }\n\nhtml.canvas.canvastext.webgl.hashchange.history.rgba.opacity.cssanimations.csstransforms3d.csstransitions #unsupport {\n  display: none; }\n\n.page-switcher {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #111;\n  pointer-events: none;\n  z-index: 1;\n  transform: scale3d(0, 1, 1); }\n\n.app-header {\n  position: absolute;\n  bottom: 0;\n  padding: 0 2rem 2rem 2rem;\n  opacity: 0;\n  cursor: initial;\n  color: #111;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  width: 100%;\n  letter-spacing: 0.03rem;\n  z-index: 999; }\n  .app-header .logo-container h1 {\n    margin-bottom: 0.25rem; }\n  .app-header .logo-container p a {\n    color: #111; }\n\n.homepage {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 4;\n  cursor: -webkit-grab; }\n  .homepage .sketches-list {\n    position: relative; }\n    .homepage .sketches-list .single-sketch {\n      padding: 1rem;\n      position: absolute;\n      top: 0;\n      left: 0;\n      overflow: hidden;\n      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n      transition: box-shadow 0.2s ease-in;\n      background-position: 50%;\n      background-repeat: no-repeat; }\n      .homepage .sketches-list .single-sketch:hover {\n        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n      @media (min-width: 300px) {\n        .homepage .sketches-list .single-sketch {\n          width: 200px;\n          height: 113px; } }\n      @media (min-width: 900px) {\n        .homepage .sketches-list .single-sketch {\n          width: 250px;\n          height: 140px; } }\n      @media (min-width: 1366px) {\n        .homepage .sketches-list .single-sketch {\n          width: 300px;\n          height: 170px; } }\n      .homepage .sketches-list .single-sketch .sketch-title-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: #222;\n        color: #fff;\n        z-index: 2;\n        display: flex;\n        text-align: center;\n        align-items: center;\n        justify-content: center;\n        transform: translate3d(-100%, 0, 0); }\n        .homepage .sketches-list .single-sketch .sketch-title-panel h2 {\n          text-align: center;\n          transform: translate3d(0, 0, 0); }\n      .homepage .sketches-list .single-sketch .sketch-image {\n        position: absolute;\n        top: 0;\n        left: 0; }\n        .homepage .sketches-list .single-sketch .sketch-image img {\n          max-width: 100%;\n          display: block; }\n        .homepage .sketches-list .single-sketch .sketch-image .sketch-number {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 24px;\n          height: 24px;\n          line-height: 24px;\n          text-align: center;\n          color: #111;\n          z-index: 1; }\n          .homepage .sketches-list .single-sketch .sketch-image .sketch-number:before {\n            z-index: -1;\n            content: '';\n            position: inherit;\n            top: 0;\n            left: 0;\n            width: 0;\n            height: 0;\n            border-style: solid;\n            border-width: 42px 42px 0 0;\n            border-color: #fff transparent transparent transparent; }\n\n.singlepage {\n  position: fixed;\n  top: 0;\n  left: 0; }\n  .singlepage .back-link {\n    width: 32px;\n    height: 32px;\n    position: absolute;\n    top: 1rem;\n    right: 2rem; }\n    @media (min-width: 800px) {\n      .singlepage .back-link {\n        left: 50%;\n        right: initial;\n        margin-left: -32px; } }\n    .singlepage .back-link path {\n      fill: #fff; }\n  .singlepage .iframe-container iframe {\n    border: none; }\n", ""]);

	// exports


/***/ }),
/* 43 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	var _WorkModel = __webpack_require__(46);

	var _WorkModel2 = _interopRequireDefault(_WorkModel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var WorkCollection = _exoskeleton2.default.Collection.extend({
	    model: _WorkModel2.default
	});

	exports.default = WorkCollection;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _exoskeleton = __webpack_require__(1);

	var _exoskeleton2 = _interopRequireDefault(_exoskeleton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var WorkModel = _exoskeleton2.default.Model.extend({
	    defaults: {}
	});

	exports.default = WorkModel;

/***/ })
/******/ ]);
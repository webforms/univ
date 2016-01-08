/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(23);
	module.exports = __webpack_require__(24);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, global) {"use strict";
	
	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	
	// linked list of tasks (single, with head node)
	var head = {task: void 0, next: null};
	var tail = head;
	var flushing = false;
	var requestFlush = void 0;
	var hasSetImmediate = typeof setImmediate === "function";
	var domain;
	
	if (typeof global != 'undefined') {
		// Avoid shims from browserify.
		// The existence of `global` in browsers is guaranteed by browserify.
		var process = global.process;
	}
	
	// Note that some fake-Node environments,
	// like the Mocha test runner, introduce a `process` global.
	var isNodeJS = !!process && ({}).toString.call(process) === "[object process]";
	
	function flush() {
	    /* jshint loopfunc: true */
	
	    while (head.next) {
	        head = head.next;
	        var task = head.task;
	        head.task = void 0;
	
	        try {
	            task();
	
	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them to interrupt flushing!
	
	                // Ensure continuation if an uncaught exception is suppressed
	                // listening process.on("uncaughtException") or domain("error").
	                requestFlush();
	
	                throw e;
	
	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }
	    }
	
	    flushing = false;
	}
	
	if (isNodeJS) {
	    // Node.js
	    requestFlush = function () {
	        // Ensure flushing is not bound to any domain.
	        var currentDomain = process.domain;
	        if (currentDomain) {
	            domain = domain || (1,__webpack_require__(13))("domain");
	            domain.active = process.domain = null;
	        }
	
	        // Avoid tick recursion - use setImmediate if it exists.
	        if (flushing && hasSetImmediate) {
	            setImmediate(flush);
	        } else {
	            process.nextTick(flush);
	        }
	
	        if (currentDomain) {
	            domain.active = process.domain = currentDomain;
	        }
	    };
	
	} else if (hasSetImmediate) {
	    // In IE10, or https://github.com/NobleJS/setImmediate
	    requestFlush = function () {
	        setImmediate(flush);
	    };
	
	} else if (typeof MessageChannel !== "undefined") {
	    // modern browsers
	    // http://www.nonblocking.io/2011/06/windownexttick.html
	    var channel = new MessageChannel();
	    // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	    // working message ports the first time a page loads.
	    channel.port1.onmessage = function () {
	        requestFlush = requestPortFlush;
	        channel.port1.onmessage = flush;
	        flush();
	    };
	    var requestPortFlush = function () {
	        // Opera requires us to provide a message payload, regardless of
	        // whether we use it.
	        channel.port2.postMessage(0);
	    };
	    requestFlush = function () {
	        setTimeout(flush, 0);
	        requestPortFlush();
	    };
	
	} else {
	    // old browsers
	    requestFlush = function () {
	        setTimeout(flush, 0);
	    };
	}
	
	function asap(task) {
	    if (isNodeJS && process.domain) {
	        task = process.domain.bind(task);
	    }
	
	    tail = tail.next = {task: task, next: null};
	
	    if (!flushing) {
	        requestFlush();
	        flushing = true;
	    }
	};
	
	module.exports = asap;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).setImmediate, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var originalAsap = __webpack_require__(1);
	
	var onError;
	
	function asap(task) {
	    if (onError) {
	        return originalAsap(function () {
	            try {
	                task();
	            } catch (e) {
	                onError(e);
	            }
	        });
	    } else {
	        return originalAsap(task);
	    }
	}
	
	asap.setOnError = function (newOnError) {
	    if (onError) {
	        throw new Error("Can only set onError once.");
	    }
	
	    if (typeof newOnError !== "function") {
	        throw new TypeError("onError must be a function.");
	    }
	
	    onError = newOnError;
	};
	
	for (var key in originalAsap) {
	    asap[key] = originalAsap[key];
	}
	
	module.exports = asap;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var EventEmitter = __webpack_require__(29).EventEmitter;
	var asap = __webpack_require__(2);
	
	// This is a very rudimentary domain shim meant only to work with asap and with asap's tests. Unlike the real domain
	// module, it requires manual teardown. It uses `asap.setOnError` since `window.onerror` does not work very well.
	
	var activeDomain = null;
	
	exports.create = function () {
	    if (activeDomain) {
	        throw new Error("A domain is already active! You need to tear it down first!");
	    }
	
	    activeDomain = new EventEmitter();
	    activeDomain.run = function (f) {
	        f();
	    };
	
	    return activeDomain;
	};
	
	exports.teardown = function () {
	    activeDomain = null;
	};
	
	asap.setOnError(function (error) {
	    if (activeDomain) {
	        activeDomain.emit("error", error);
	    } else {
	        throw error;
	    }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	var asap = __webpack_require__(2);
	var _ = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	// This is a reliable test for true Node.js, avoiding false positives for e.g. Browserify's emulation environment.
	var isNodeJS = typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";
	
	if (isNodeJS) {
	    // The `(1,require)(...)` syntax bypasses Browserify's auto-detection of `require`s.
	    module.exports = (1,__webpack_require__(14))("domain");
	
	    var nodeVersionPieces = process.versions.node.split(".");
	    if (Number(nodeVersionPieces[0]) < 1 && Number(nodeVersionPieces[1]) < 10) {
	        // Fix for https://github.com/joyent/node/issues/4375:
	        // "domain.on('error') should suppress other uncaughtException handlers"
	
	        var errorsToIgnore = [];
	        process.on = _.wrap(process.on, function (originalOn, eventName, listener) {
	            if (eventName === "uncaughtException") {
	                listener = wrap(listener);
	            }
	
	            originalOn.call(process, eventName, listener);
	        });
	
	        process.removeListener = _.wrap(process.removeListener, function (originalRemove, eventName, listener) {
	            originalRemove.call(process, eventName, listener._asap_wrapper_ || listener);
	        });
	
	        asap.setOnError(function (error) {
	            errorsToIgnore.push(error);
	            throw error;
	        });
	
	        afterEach(function () {
	            errorsToIgnore = [];
	        });
	    }
	} else {
	    module.exports = __webpack_require__(3);
	    afterEach(module.exports.teardown);
	}
	
	function wrap(uncaughtExceptionListener) {
	    uncaughtExceptionListener._asap_wrapper_ = function (error) {
	        if (!_.contains(errorsToIgnore, error)) {
	            uncaughtExceptionListener(error);
	        }
	    };
	
	    return uncaughtExceptionListener._asap_wrapper_;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var asap = __webpack_require__(2);
	var domain = __webpack_require__(4);
	var assert = __webpack_require__(25);
	var _ = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var MAX_RECURSION = 4000;
	var WAIT_FOR_NORMAL_CASE = 100;
	var WAIT_FOR_ERRORS = 1000;
	
	describe("When no tasks throw", function () {
	    specify("A single task should run after `asap` returns", function (done) {
	        var ran = false;
	
	        asap(function () {
	            ran = true;
	        });
	
	        assert.strictEqual(ran, false);
	        setTimeout(function () {
	            assert.strictEqual(ran, true);
	            done();
	        }, WAIT_FOR_NORMAL_CASE);
	    });
	
	    specify("Multiple tasks should run in order", function (done) {
	        var calls = [];
	
	        asap(function () {
	            calls.push(0);
	        });
	        asap(function () {
	            calls.push(1);
	        });
	        asap(function () {
	            calls.push(2);
	        });
	
	        assert.deepEqual(calls, []);
	        setTimeout(function () {
	            assert.deepEqual(calls, [0, 1, 2]);
	            done();
	        }, WAIT_FOR_NORMAL_CASE);
	    });
	
	    specify("A tree of tasks should execute in breadth-first order", function (done) {
	        var calls = [];
	
	        asap(function () {
	            calls.push(0);
	
	            asap(function () {
	                calls.push(2);
	
	                asap(function () {
	                    calls.push(5);
	                });
	
	                asap(function () {
	                    calls.push(6);
	                });
	            });
	
	            asap(function () {
	                calls.push(3);
	            });
	        });
	
	        asap(function () {
	            calls.push(1);
	
	            asap(function () {
	                calls.push(4);
	            });
	        });
	
	        assert.deepEqual(calls, []);
	        setTimeout(function () {
	            assert.deepEqual(calls, [0, 1, 2, 3, 4, 5, 6]);
	            done();
	        }, WAIT_FOR_NORMAL_CASE);
	    });
	});
	
	describe("When tasks throw", function () {
	    specify("Multiple all-throwing tasks should run and re-throw in order", function (done) {
	        var calls = [];
	        var errors = [];
	
	        var d = domain.create();
	        d.on("error", function (error) {
	            errors.push(error);
	        });
	
	        d.run(function () {
	            asap(function () {
	                calls.push(0);
	                throw 0;
	            });
	            asap(function () {
	                calls.push(1);
	                throw 1;
	            });
	            asap(function () {
	                calls.push(2);
	                throw 2;
	            });
	        });
	
	        assert.deepEqual(calls, []);
	        assert.deepEqual(errors, []);
	        setTimeout(function () {
	            assert.deepEqual(calls, [0, 1, 2]);
	            assert.deepEqual(errors, [0, 1, 2]);
	            done();
	        }, WAIT_FOR_ERRORS);
	    });
	
	    specify("Multiple mixed throwing/non-throwing tasks should run and re-throw in order", function (done) {
	        var calls = [];
	        var errors = [];
	
	        var d = domain.create();
	        d.on("error", function (error) {
	            errors.push(error);
	        });
	
	        d.run(function () {
	            asap(function () {
	                calls.push(0);
	            });
	            asap(function () {
	                calls.push(1);
	                throw 1;
	            });
	            asap(function () {
	                calls.push(2);
	            });
	            asap(function () {
	                calls.push(3);
	                throw 3;
	            });
	            asap(function () {
	                calls.push(4);
	                throw 4;
	            });
	            asap(function () {
	                calls.push(5);
	            });
	        });
	
	        assert.deepEqual(calls, []);
	        assert.deepEqual(errors, []);
	        setTimeout(function () {
	            assert.deepEqual(calls, [0, 1, 2, 3, 4, 5]);
	            assert.deepEqual(errors, [1, 3, 4]);
	            done();
	        }, WAIT_FOR_ERRORS);
	    });
	
	    specify("Queueing tasks before throwing errors should re-throw errors in order", function (done) {
	        var errors = [];
	
	        var d = domain.create();
	        d.on("error", function (error) {
	            errors.push(error);
	        });
	
	        d.run(function () {
	            asap(function () {
	                asap(function () {
	                    throw 1;
	                });
	
	                throw 0;
	            });
	        });
	
	        assert.deepEqual(errors, []);
	        setTimeout(function () {
	            assert.deepEqual(errors, [0, 1]);
	            done();
	        }, WAIT_FOR_ERRORS);
	    });
	
	    specify("A tree of tasks should execute and re-throw in breadth-first order", function (done) {
	        var calls = [];
	        var errors = [];
	
	        var d = domain.create();
	        d.on("error", function (error) {
	            errors.push(error);
	        });
	
	        d.run(function () {
	            asap(function () {
	                calls.push(0);
	
	                asap(function () {
	                    calls.push(2);
	
	                    asap(function () {
	                        calls.push(5);
	                        throw 5;
	                    });
	
	                    asap(function () {
	                        calls.push(6);
	                    });
	                });
	
	                asap(function () {
	                    calls.push(3);
	                });
	
	                throw 0;
	            });
	
	            asap(function () {
	                calls.push(1);
	
	                asap(function () {
	                    calls.push(4);
	                    throw 4;
	                });
	            });
	        });
	
	        assert.deepEqual(calls, []);
	        assert.deepEqual(errors, []);
	        setTimeout(function () {
	            assert.deepEqual(calls, [0, 1, 2, 3, 4, 5, 6]);
	            assert.deepEqual(errors, [0, 4, 5]);
	            done();
	        }, WAIT_FOR_ERRORS);
	    });
	});
	
	describe("When recursing", function () {
	    specify("Simple recursion ordering test", function (done) {
	        var steps = [];
	
	        asap(function () {
	            steps.push(0);
	            asap(function () {
	                steps.push(2);
	                asap(function () {
	                    steps.push(4);
	                });
	                steps.push(3);
	            });
	            steps.push(1);
	        });
	
	        setTimeout(function () {
	            assert.deepEqual(steps, [0, 1, 2, 3, 4]);
	            done();
	        }, WAIT_FOR_NORMAL_CASE);
	    });
	
	    specify("Can recurse " + MAX_RECURSION + " tasks deep", function (done) {
	        var timesRecursed = 0;
	        function go() {
	            if (++timesRecursed < MAX_RECURSION) {
	                asap(go);
	            }
	        }
	
	        asap(go);
	
	        setTimeout(function () {
	            assert.strictEqual(timesRecursed, MAX_RECURSION);
	            done();
	        }, WAIT_FOR_NORMAL_CASE);
	    });
	
	    specify("Two deep recursions execute in breadth-first order", function (done) {
	        var timesRecursed1 = 0;
	        var timesRecursed2 = 0;
	        var calls = [];
	
	        function go1() {
	            calls.push(timesRecursed1 * 2);
	            if (++timesRecursed1 < MAX_RECURSION) {
	                asap(go1);
	            }
	        }
	
	        function go2() {
	            calls.push(timesRecursed2 * 2 + 1);
	            if (++timesRecursed2 < MAX_RECURSION) {
	                asap(go2);
	            }
	        }
	
	        asap(go1);
	        asap(go2);
	
	        setTimeout(function () {
	            assert.deepEqual(calls, _.range(MAX_RECURSION * 2));
	            done();
	        }, WAIT_FOR_NORMAL_CASE);
	    });
	
	    describe("and tasks throw", function () {
	        specify("Thrown errors are re-thrown in order and do not prevent recursion", function (done) {
	            var timesRecursed = 0;
	            var errors = [];
	
	            function go() {
	                if (++timesRecursed < MAX_RECURSION) {
	                    asap(go);
	                    throw timesRecursed - 1;
	                }
	            }
	
	            var d = domain.create();
	            d.on("error", function (error) {
	                errors.push(error);
	            });
	
	            d.run(function () {
	                asap(go);
	            });
	
	            setTimeout(function () {
	                assert.strictEqual(timesRecursed, MAX_RECURSION);
	                assert.deepEqual(errors, _.range(MAX_RECURSION - 1));
	                done();
	            }, WAIT_FOR_ERRORS);
	        });
	
	        specify("Three deep recursions, one of which throws, executes and re-throws in order", function (done) {
	            var timesRecursed1 = 0;
	            var timesRecursed2 = 0;
	            var timesRecursed3 = 0;
	            var calls = [];
	            var errors = [];
	
	            function go1() {
	                calls.push(timesRecursed1 * 3);
	                if (++timesRecursed1 < MAX_RECURSION) {
	                    asap(go1);
	                }
	            }
	
	            function go2() {
	                calls.push(timesRecursed2 * 3 + 1);
	                if (++timesRecursed2 < MAX_RECURSION) {
	                    asap(go2);
	                }
	            }
	
	            function go3() {
	                calls.push(timesRecursed3 * 3 + 2);
	                if (++timesRecursed3 < MAX_RECURSION) {
	                    asap(go3);
	                    throw timesRecursed3 - 1;
	                }
	            }
	
	            var d = domain.create();
	            d.on("error", function (error) {
	                errors.push(error);
	            });
	
	            d.run(function () {
	                asap(go1);
	                asap(go2);
	                asap(go3);
	            });
	
	            setTimeout(function () {
	                assert.deepEqual(calls, _.range(MAX_RECURSION * 3));
	                assert.deepEqual(errors, _.range(MAX_RECURSION - 1));
	                done();
	            }, WAIT_FOR_ERRORS);
	        });
	    });
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var asap = __webpack_require__(1)
	
	module.exports = Promise;
	function Promise(fn) {
	  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
	  if (typeof fn !== 'function') throw new TypeError('not a function')
	  var state = null
	  var value = null
	  var deferreds = []
	  var self = this
	
	  this.then = function(onFulfilled, onRejected) {
	    return new self.constructor(function(resolve, reject) {
	      handle(new Handler(onFulfilled, onRejected, resolve, reject))
	    })
	  }
	
	  function handle(deferred) {
	    if (state === null) {
	      deferreds.push(deferred)
	      return
	    }
	    asap(function() {
	      var cb = state ? deferred.onFulfilled : deferred.onRejected
	      if (cb === null) {
	        (state ? deferred.resolve : deferred.reject)(value)
	        return
	      }
	      var ret
	      try {
	        ret = cb(value)
	      }
	      catch (e) {
	        deferred.reject(e)
	        return
	      }
	      deferred.resolve(ret)
	    })
	  }
	
	  function resolve(newValue) {
	    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
	      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
	        var then = newValue.then
	        if (typeof then === 'function') {
	          doResolve(then.bind(newValue), resolve, reject)
	          return
	        }
	      }
	      state = true
	      value = newValue
	      finale()
	    } catch (e) { reject(e) }
	  }
	
	  function reject(newValue) {
	    state = false
	    value = newValue
	    finale()
	  }
	
	  function finale() {
	    for (var i = 0, len = deferreds.length; i < len; i++)
	      handle(deferreds[i])
	    deferreds = null
	  }
	
	  doResolve(fn, resolve, reject)
	}
	
	
	function Handler(onFulfilled, onRejected, resolve, reject){
	  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
	  this.onRejected = typeof onRejected === 'function' ? onRejected : null
	  this.resolve = resolve
	  this.reject = reject
	}
	
	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, onFulfilled, onRejected) {
	  var done = false;
	  try {
	    fn(function (value) {
	      if (done) return
	      done = true
	      onFulfilled(value)
	    }, function (reason) {
	      if (done) return
	      done = true
	      onRejected(reason)
	    })
	  } catch (ex) {
	    if (done) return
	    done = true
	    onRejected(ex)
	  }
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(7).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).setImmediate, __webpack_require__(8).clearImmediate))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, Buffer) {(function (global, module) {
	
	  var exports = module.exports;
	
	  /**
	   * Exports.
	   */
	
	  module.exports = expect;
	  expect.Assertion = Assertion;
	
	  /**
	   * Exports version.
	   */
	
	  expect.version = '0.3.1';
	
	  /**
	   * Possible assertion flags.
	   */
	
	  var flags = {
	      not: ['to', 'be', 'have', 'include', 'only']
	    , to: ['be', 'have', 'include', 'only', 'not']
	    , only: ['have']
	    , have: ['own']
	    , be: ['an']
	  };
	
	  function expect (obj) {
	    return new Assertion(obj);
	  }
	
	  /**
	   * Constructor
	   *
	   * @api private
	   */
	
	  function Assertion (obj, flag, parent) {
	    this.obj = obj;
	    this.flags = {};
	
	    if (undefined != parent) {
	      this.flags[flag] = true;
	
	      for (var i in parent.flags) {
	        if (parent.flags.hasOwnProperty(i)) {
	          this.flags[i] = true;
	        }
	      }
	    }
	
	    var $flags = flag ? flags[flag] : keys(flags)
	      , self = this;
	
	    if ($flags) {
	      for (var i = 0, l = $flags.length; i < l; i++) {
	        // avoid recursion
	        if (this.flags[$flags[i]]) continue;
	
	        var name = $flags[i]
	          , assertion = new Assertion(this.obj, name, this)
	
	        if ('function' == typeof Assertion.prototype[name]) {
	          // clone the function, make sure we dont touch the prot reference
	          var old = this[name];
	          this[name] = function () {
	            return old.apply(self, arguments);
	          };
	
	          for (var fn in Assertion.prototype) {
	            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
	              this[name][fn] = bind(assertion[fn], assertion);
	            }
	          }
	        } else {
	          this[name] = assertion;
	        }
	      }
	    }
	  }
	
	  /**
	   * Performs an assertion
	   *
	   * @api private
	   */
	
	  Assertion.prototype.assert = function (truth, msg, error, expected) {
	    var msg = this.flags.not ? error : msg
	      , ok = this.flags.not ? !truth : truth
	      , err;
	
	    if (!ok) {
	      err = new Error(msg.call(this));
	      if (arguments.length > 3) {
	        err.actual = this.obj;
	        err.expected = expected;
	        err.showDiff = true;
	      }
	      throw err;
	    }
	
	    this.and = new Assertion(this.obj);
	  };
	
	  /**
	   * Check if the value is truthy
	   *
	   * @api public
	   */
	
	  Assertion.prototype.ok = function () {
	    this.assert(
	        !!this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
	      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
	  };
	
	  /**
	   * Creates an anonymous function which calls fn with arguments.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.withArgs = function() {
	    expect(this.obj).to.be.a('function');
	    var fn = this.obj;
	    var args = Array.prototype.slice.call(arguments);
	    return expect(function() { fn.apply(null, args); });
	  };
	
	  /**
	   * Assert that the function throws.
	   *
	   * @param {Function|RegExp} callback, or regexp to match error string against
	   * @api public
	   */
	
	  Assertion.prototype.throwError =
	  Assertion.prototype.throwException = function (fn) {
	    expect(this.obj).to.be.a('function');
	
	    var thrown = false
	      , not = this.flags.not;
	
	    try {
	      this.obj();
	    } catch (e) {
	      if (isRegExp(fn)) {
	        var subject = 'string' == typeof e ? e : e.message;
	        if (not) {
	          expect(subject).to.not.match(fn);
	        } else {
	          expect(subject).to.match(fn);
	        }
	      } else if ('function' == typeof fn) {
	        fn(e);
	      }
	      thrown = true;
	    }
	
	    if (isRegExp(fn) && not) {
	      // in the presence of a matcher, ensure the `not` only applies to
	      // the matching.
	      this.flags.not = false;
	    }
	
	    var name = this.obj.name || 'fn';
	    this.assert(
	        thrown
	      , function(){ return 'expected ' + name + ' to throw an exception' }
	      , function(){ return 'expected ' + name + ' not to throw an exception' });
	  };
	
	  /**
	   * Checks if the array is empty.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.empty = function () {
	    var expectation;
	
	    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
	      if ('number' == typeof this.obj.length) {
	        expectation = !this.obj.length;
	      } else {
	        expectation = !keys(this.obj).length;
	      }
	    } else {
	      if ('string' != typeof this.obj) {
	        expect(this.obj).to.be.an('object');
	      }
	
	      expect(this.obj).to.have.property('length');
	      expectation = !this.obj.length;
	    }
	
	    this.assert(
	        expectation
	      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
	    return this;
	  };
	
	  /**
	   * Checks if the obj exactly equals another.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.be =
	  Assertion.prototype.equal = function (obj) {
	    this.assert(
	        obj === this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
	    return this;
	  };
	
	  /**
	   * Checks if the obj sortof equals another.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.eql = function (obj) {
	    this.assert(
	        expect.eql(this.obj, obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
	      , obj);
	    return this;
	  };
	
	  /**
	   * Assert within start to finish (inclusive).
	   *
	   * @param {Number} start
	   * @param {Number} finish
	   * @api public
	   */
	
	  Assertion.prototype.within = function (start, finish) {
	    var range = start + '..' + finish;
	    this.assert(
	        this.obj >= start && this.obj <= finish
	      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
	    return this;
	  };
	
	  /**
	   * Assert typeof / instance of
	   *
	   * @api public
	   */
	
	  Assertion.prototype.a =
	  Assertion.prototype.an = function (type) {
	    if ('string' == typeof type) {
	      // proper english in error msg
	      var n = /^[aeiou]/.test(type) ? 'n' : '';
	
	      // typeof with support for 'array'
	      this.assert(
	          'array' == type ? isArray(this.obj) :
	            'regexp' == type ? isRegExp(this.obj) :
	              'object' == type
	                ? 'object' == typeof this.obj && null !== this.obj
	                : type == typeof this.obj
	        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
	    } else {
	      // instanceof
	      var name = type.name || 'supplied constructor';
	      this.assert(
	          this.obj instanceof type
	        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
	    }
	
	    return this;
	  };
	
	  /**
	   * Assert numeric value above _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.greaterThan =
	  Assertion.prototype.above = function (n) {
	    this.assert(
	        this.obj > n
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
	    return this;
	  };
	
	  /**
	   * Assert numeric value below _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.lessThan =
	  Assertion.prototype.below = function (n) {
	    this.assert(
	        this.obj < n
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
	    return this;
	  };
	
	  /**
	   * Assert string value matches _regexp_.
	   *
	   * @param {RegExp} regexp
	   * @api public
	   */
	
	  Assertion.prototype.match = function (regexp) {
	    this.assert(
	        regexp.exec(this.obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
	      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
	    return this;
	  };
	
	  /**
	   * Assert property "length" exists and has value of _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.length = function (n) {
	    expect(this.obj).to.have.property('length');
	    var len = this.obj.length;
	    this.assert(
	        n == len
	      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
	      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
	    return this;
	  };
	
	  /**
	   * Assert property _name_ exists, with optional _val_.
	   *
	   * @param {String} name
	   * @param {Mixed} val
	   * @api public
	   */
	
	  Assertion.prototype.property = function (name, val) {
	    if (this.flags.own) {
	      this.assert(
	          Object.prototype.hasOwnProperty.call(this.obj, name)
	        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
	      return this;
	    }
	
	    if (this.flags.not && undefined !== val) {
	      if (undefined === this.obj[name]) {
	        throw new Error(i(this.obj) + ' has no property ' + i(name));
	      }
	    } else {
	      var hasProp;
	      try {
	        hasProp = name in this.obj
	      } catch (e) {
	        hasProp = undefined !== this.obj[name]
	      }
	
	      this.assert(
	          hasProp
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
	    }
	
	    if (undefined !== val) {
	      this.assert(
	          val === this.obj[name]
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
	          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
	          + ' of ' + i(val) });
	    }
	
	    this.obj = this.obj[name];
	    return this;
	  };
	
	  /**
	   * Assert that the array contains _obj_ or string contains _obj_.
	   *
	   * @param {Mixed} obj|string
	   * @api public
	   */
	
	  Assertion.prototype.string =
	  Assertion.prototype.contain = function (obj) {
	    if ('string' == typeof this.obj) {
	      this.assert(
	          ~this.obj.indexOf(obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    } else {
	      this.assert(
	          ~indexOf(this.obj, obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    }
	    return this;
	  };
	
	  /**
	   * Assert exact keys or inclusion of keys by using
	   * the `.own` modifier.
	   *
	   * @param {Array|String ...} keys
	   * @api public
	   */
	
	  Assertion.prototype.key =
	  Assertion.prototype.keys = function ($keys) {
	    var str
	      , ok = true;
	
	    $keys = isArray($keys)
	      ? $keys
	      : Array.prototype.slice.call(arguments);
	
	    if (!$keys.length) throw new Error('keys required');
	
	    var actual = keys(this.obj)
	      , len = $keys.length;
	
	    // Inclusion
	    ok = every($keys, function (key) {
	      return ~indexOf(actual, key);
	    });
	
	    // Strict
	    if (!this.flags.not && this.flags.only) {
	      ok = ok && $keys.length == actual.length;
	    }
	
	    // Key string
	    if (len > 1) {
	      $keys = map($keys, function (key) {
	        return i(key);
	      });
	      var last = $keys.pop();
	      str = $keys.join(', ') + ', and ' + last;
	    } else {
	      str = i($keys[0]);
	    }
	
	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;
	
	    // Have / include
	    str = (!this.flags.only ? 'include ' : 'only have ') + str;
	
	    // Assertion
	    this.assert(
	        ok
	      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
	      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });
	
	    return this;
	  };
	
	  /**
	   * Assert a failure.
	   *
	   * @param {String ...} custom message
	   * @api public
	   */
	  Assertion.prototype.fail = function (msg) {
	    var error = function() { return msg || "explicit failure"; }
	    this.assert(false, error, error);
	    return this;
	  };
	
	  /**
	   * Function bind implementation.
	   */
	
	  function bind (fn, scope) {
	    return function () {
	      return fn.apply(scope, arguments);
	    }
	  }
	
	  /**
	   * Array every compatibility
	   *
	   * @see bit.ly/5Fq1N2
	   * @api public
	   */
	
	  function every (arr, fn, thisObj) {
	    var scope = thisObj || global;
	    for (var i = 0, j = arr.length; i < j; ++i) {
	      if (!fn.call(scope, arr[i], i, arr)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * Array indexOf compatibility.
	   *
	   * @see bit.ly/a5Dxa2
	   * @api public
	   */
	
	  function indexOf (arr, o, i) {
	    if (Array.prototype.indexOf) {
	      return Array.prototype.indexOf.call(arr, o, i);
	    }
	
	    if (arr.length === undefined) {
	      return -1;
	    }
	
	    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
	        ; i < j && arr[i] !== o; i++);
	
	    return j <= i ? -1 : i;
	  }
	
	  // https://gist.github.com/1044128/
	  var getOuterHTML = function(element) {
	    if ('outerHTML' in element) return element.outerHTML;
	    var ns = "http://www.w3.org/1999/xhtml";
	    var container = document.createElementNS(ns, '_');
	    var xmlSerializer = new XMLSerializer();
	    var html;
	    if (document.xmlVersion) {
	      return xmlSerializer.serializeToString(element);
	    } else {
	      container.appendChild(element.cloneNode(false));
	      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
	      container.innerHTML = '';
	      return html;
	    }
	  };
	
	  // Returns true if object is a DOM element.
	  var isDOMElement = function (object) {
	    if (typeof HTMLElement === 'object') {
	      return object instanceof HTMLElement;
	    } else {
	      return object &&
	        typeof object === 'object' &&
	        object.nodeType === 1 &&
	        typeof object.nodeName === 'string';
	    }
	  };
	
	  /**
	   * Inspects an object.
	   *
	   * @see taken from node.js `util` module (copyright Joyent, MIT license)
	   * @api private
	   */
	
	  function i (obj, showHidden, depth) {
	    var seen = [];
	
	    function stylize (str) {
	      return str;
	    }
	
	    function format (value, recurseTimes) {
	      // Provide a hook for user-specified inspect functions.
	      // Check that value is an object with an inspect function on it
	      if (value && typeof value.inspect === 'function' &&
	          // Filter out the util module, it's inspect function is special
	          value !== exports &&
	          // Also filter out any prototype objects using the circular check.
	          !(value.constructor && value.constructor.prototype === value)) {
	        return value.inspect(recurseTimes);
	      }
	
	      // Primitive types cannot have properties
	      switch (typeof value) {
	        case 'undefined':
	          return stylize('undefined', 'undefined');
	
	        case 'string':
	          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
	                                                   .replace(/'/g, "\\'")
	                                                   .replace(/\\"/g, '"') + '\'';
	          return stylize(simple, 'string');
	
	        case 'number':
	          return stylize('' + value, 'number');
	
	        case 'boolean':
	          return stylize('' + value, 'boolean');
	      }
	      // For some reason typeof null is "object", so special case here.
	      if (value === null) {
	        return stylize('null', 'null');
	      }
	
	      if (isDOMElement(value)) {
	        return getOuterHTML(value);
	      }
	
	      // Look up the keys of the object.
	      var visible_keys = keys(value);
	      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;
	
	      // Functions without properties can be shortcutted.
	      if (typeof value === 'function' && $keys.length === 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          var name = value.name ? ': ' + value.name : '';
	          return stylize('[Function' + name + ']', 'special');
	        }
	      }
	
	      // Dates without properties can be shortcutted
	      if (isDate(value) && $keys.length === 0) {
	        return stylize(value.toUTCString(), 'date');
	      }
	      
	      // Error objects can be shortcutted
	      if (value instanceof Error) {
	        return stylize("["+value.toString()+"]", 'Error');
	      }
	
	      var base, type, braces;
	      // Determine the object type
	      if (isArray(value)) {
	        type = 'Array';
	        braces = ['[', ']'];
	      } else {
	        type = 'Object';
	        braces = ['{', '}'];
	      }
	
	      // Make functions say that they are functions
	      if (typeof value === 'function') {
	        var n = value.name ? ': ' + value.name : '';
	        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
	      } else {
	        base = '';
	      }
	
	      // Make dates with properties first say the date
	      if (isDate(value)) {
	        base = ' ' + value.toUTCString();
	      }
	
	      if ($keys.length === 0) {
	        return braces[0] + base + braces[1];
	      }
	
	      if (recurseTimes < 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          return stylize('[Object]', 'special');
	        }
	      }
	
	      seen.push(value);
	
	      var output = map($keys, function (key) {
	        var name, str;
	        if (value.__lookupGetter__) {
	          if (value.__lookupGetter__(key)) {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Getter/Setter]', 'special');
	            } else {
	              str = stylize('[Getter]', 'special');
	            }
	          } else {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Setter]', 'special');
	            }
	          }
	        }
	        if (indexOf(visible_keys, key) < 0) {
	          name = '[' + key + ']';
	        }
	        if (!str) {
	          if (indexOf(seen, value[key]) < 0) {
	            if (recurseTimes === null) {
	              str = format(value[key]);
	            } else {
	              str = format(value[key], recurseTimes - 1);
	            }
	            if (str.indexOf('\n') > -1) {
	              if (isArray(value)) {
	                str = map(str.split('\n'), function (line) {
	                  return '  ' + line;
	                }).join('\n').substr(2);
	              } else {
	                str = '\n' + map(str.split('\n'), function (line) {
	                  return '   ' + line;
	                }).join('\n');
	              }
	            }
	          } else {
	            str = stylize('[Circular]', 'special');
	          }
	        }
	        if (typeof name === 'undefined') {
	          if (type === 'Array' && key.match(/^\d+$/)) {
	            return str;
	          }
	          name = json.stringify('' + key);
	          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	            name = name.substr(1, name.length - 2);
	            name = stylize(name, 'name');
	          } else {
	            name = name.replace(/'/g, "\\'")
	                       .replace(/\\"/g, '"')
	                       .replace(/(^"|"$)/g, "'");
	            name = stylize(name, 'string');
	          }
	        }
	
	        return name + ': ' + str;
	      });
	
	      seen.pop();
	
	      var numLinesEst = 0;
	      var length = reduce(output, function (prev, cur) {
	        numLinesEst++;
	        if (indexOf(cur, '\n') >= 0) numLinesEst++;
	        return prev + cur.length + 1;
	      }, 0);
	
	      if (length > 50) {
	        output = braces[0] +
	                 (base === '' ? '' : base + '\n ') +
	                 ' ' +
	                 output.join(',\n  ') +
	                 ' ' +
	                 braces[1];
	
	      } else {
	        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	      }
	
	      return output;
	    }
	    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
	  }
	
	  expect.stringify = i;
	
	  function isArray (ar) {
	    return Object.prototype.toString.call(ar) === '[object Array]';
	  }
	
	  function isRegExp(re) {
	    var s;
	    try {
	      s = '' + re;
	    } catch (e) {
	      return false;
	    }
	
	    return re instanceof RegExp || // easy case
	           // duck-type for context-switching evalcx case
	           typeof(re) === 'function' &&
	           re.constructor.name === 'RegExp' &&
	           re.compile &&
	           re.test &&
	           re.exec &&
	           s.match(/^\/.*\/[gim]{0,3}$/);
	  }
	
	  function isDate(d) {
	    return d instanceof Date;
	  }
	
	  function keys (obj) {
	    if (Object.keys) {
	      return Object.keys(obj);
	    }
	
	    var keys = [];
	
	    for (var i in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, i)) {
	        keys.push(i);
	      }
	    }
	
	    return keys;
	  }
	
	  function map (arr, mapper, that) {
	    if (Array.prototype.map) {
	      return Array.prototype.map.call(arr, mapper, that);
	    }
	
	    var other= new Array(arr.length);
	
	    for (var i= 0, n = arr.length; i<n; i++)
	      if (i in arr)
	        other[i] = mapper.call(that, arr[i], i, arr);
	
	    return other;
	  }
	
	  function reduce (arr, fun) {
	    if (Array.prototype.reduce) {
	      return Array.prototype.reduce.apply(
	          arr
	        , Array.prototype.slice.call(arguments, 1)
	      );
	    }
	
	    var len = +this.length;
	
	    if (typeof fun !== "function")
	      throw new TypeError();
	
	    // no value to return if no initial value and an empty array
	    if (len === 0 && arguments.length === 1)
	      throw new TypeError();
	
	    var i = 0;
	    if (arguments.length >= 2) {
	      var rv = arguments[1];
	    } else {
	      do {
	        if (i in this) {
	          rv = this[i++];
	          break;
	        }
	
	        // if array contains no values, no initial value to return
	        if (++i >= len)
	          throw new TypeError();
	      } while (true);
	    }
	
	    for (; i < len; i++) {
	      if (i in this)
	        rv = fun.call(null, rv, this[i], i, this);
	    }
	
	    return rv;
	  }
	
	  /**
	   * Asserts deep equality
	   *
	   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
	   * @api private
	   */
	
	  expect.eql = function eql(actual, expected) {
	    // 7.1. All identical values are equivalent, as determined by ===.
	    if (actual === expected) {
	      return true;
	    } else if ('undefined' != typeof Buffer
	      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
	      if (actual.length != expected.length) return false;
	
	      for (var i = 0; i < actual.length; i++) {
	        if (actual[i] !== expected[i]) return false;
	      }
	
	      return true;
	
	      // 7.2. If the expected value is a Date object, the actual value is
	      // equivalent if it is also a Date object that refers to the same time.
	    } else if (actual instanceof Date && expected instanceof Date) {
	      return actual.getTime() === expected.getTime();
	
	      // 7.3. Other pairs that do not both pass typeof value == "object",
	      // equivalence is determined by ==.
	    } else if (typeof actual != 'object' && typeof expected != 'object') {
	      return actual == expected;
	    // If both are regular expression use the special `regExpEquiv` method
	    // to determine equivalence.
	    } else if (isRegExp(actual) && isRegExp(expected)) {
	      return regExpEquiv(actual, expected);
	    // 7.4. For all other Object pairs, including Array objects, equivalence is
	    // determined by having the same number of owned properties (as verified
	    // with Object.prototype.hasOwnProperty.call), the same set of keys
	    // (although not necessarily the same order), equivalent values for every
	    // corresponding key, and an identical "prototype" property. Note: this
	    // accounts for both named and indexed properties on Arrays.
	    } else {
	      return objEquiv(actual, expected);
	    }
	  };
	
	  function isUndefinedOrNull (value) {
	    return value === null || value === undefined;
	  }
	
	  function isArguments (object) {
	    return Object.prototype.toString.call(object) == '[object Arguments]';
	  }
	
	  function regExpEquiv (a, b) {
	    return a.source === b.source && a.global === b.global &&
	           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
	  }
	
	  function objEquiv (a, b) {
	    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	      return false;
	    // an identical "prototype" property.
	    if (a.prototype !== b.prototype) return false;
	    //~~~I've managed to break Object.keys through screwy arguments passing.
	    //   Converting to array solves the problem.
	    if (isArguments(a)) {
	      if (!isArguments(b)) {
	        return false;
	      }
	      a = pSlice.call(a);
	      b = pSlice.call(b);
	      return expect.eql(a, b);
	    }
	    try{
	      var ka = keys(a),
	        kb = keys(b),
	        key, i;
	    } catch (e) {//happens when one is a string literal and the other isn't
	      return false;
	    }
	    // having the same number of owned properties (keys incorporates hasOwnProperty)
	    if (ka.length != kb.length)
	      return false;
	    //the same set of keys (although not necessarily the same order),
	    ka.sort();
	    kb.sort();
	    //~~~cheap key test
	    for (i = ka.length - 1; i >= 0; i--) {
	      if (ka[i] != kb[i])
	        return false;
	    }
	    //equivalent values for every corresponding key, and
	    //~~~possibly expensive deep test
	    for (i = ka.length - 1; i >= 0; i--) {
	      key = ka[i];
	      if (!expect.eql(a[key], b[key]))
	         return false;
	    }
	    return true;
	  }
	
	  var json = (function () {
	    "use strict";
	
	    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
	      return {
	          parse: nativeJSON.parse
	        , stringify: nativeJSON.stringify
	      }
	    }
	
	    var JSON = {};
	
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	
	    function date(d, key) {
	      return isFinite(d.valueOf()) ?
	          d.getUTCFullYear()     + '-' +
	          f(d.getUTCMonth() + 1) + '-' +
	          f(d.getUTCDate())      + 'T' +
	          f(d.getUTCHours())     + ':' +
	          f(d.getUTCMinutes())   + ':' +
	          f(d.getUTCSeconds())   + 'Z' : null;
	    }
	
	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;
	
	
	    function quote(string) {
	
	  // If the string contains no control characters, no quote characters, and no
	  // backslash characters, then we can safely slap some quotes around it.
	  // Otherwise we must also replace the offending characters with safe escape
	  // sequences.
	
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }
	
	
	    function str(key, holder) {
	
	  // Produce a string from holder[key].
	
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];
	
	  // If the value has a toJSON method, call it to obtain a replacement value.
	
	        if (value instanceof Date) {
	            value = date(key);
	        }
	
	  // If we were called with a replacer function, then call the replacer to
	  // obtain a replacement value.
	
	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	
	  // What happens next depends on the value's type.
	
	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	
	        case 'number':
	
	  // JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value) ? String(value) : 'null';
	
	        case 'boolean':
	        case 'null':
	
	  // If the value is a boolean or null, convert it to a string. Note:
	  // typeof null does not produce 'null'. The case is included here in
	  // the remote chance that this gets fixed someday.
	
	            return String(value);
	
	  // If the type is 'object', we might be dealing with an object or an array or
	  // null.
	
	        case 'object':
	
	  // Due to a specification blunder in ECMAScript, typeof null is 'object',
	  // so watch out for that case.
	
	            if (!value) {
	                return 'null';
	            }
	
	  // Make an array to hold the partial results of stringifying this object value.
	
	            gap += indent;
	            partial = [];
	
	  // Is the value an array?
	
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	
	  // The value is an array. Stringify every element. Use null as a placeholder
	  // for non-JSON values.
	
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	
	  // Join all of the elements together, separated with commas, and wrap them in
	  // brackets.
	
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	
	  // If the replacer is an array, use it to select the members to be stringified.
	
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	
	  // Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	
	  // Join all of the member texts together, separated with commas,
	  // and wrap them in braces.
	
	            v = partial.length === 0 ? '{}' : gap ?
	                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	                '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }
	
	  // If the JSON object does not yet have a stringify method, give it one.
	
	    JSON.stringify = function (value, replacer, space) {
	
	  // The stringify method takes a value and an optional replacer, and an optional
	  // space parameter, and returns a JSON text. The replacer can be a function
	  // that can replace values, or an array of strings that will select the keys.
	  // A default replacer method can be provided. Use of the space parameter can
	  // produce text that is more easily readable.
	
	        var i;
	        gap = '';
	        indent = '';
	
	  // If the space parameter is a number, make an indent string containing that
	  // many spaces.
	
	        if (typeof space === 'number') {
	            for (i = 0; i < space; i += 1) {
	                indent += ' ';
	            }
	
	  // If the space parameter is a string, it will be used as the indent string.
	
	        } else if (typeof space === 'string') {
	            indent = space;
	        }
	
	  // If there is a replacer, it must be a function or an array.
	  // Otherwise, throw an error.
	
	        rep = replacer;
	        if (replacer && typeof replacer !== 'function' &&
	                (typeof replacer !== 'object' ||
	                typeof replacer.length !== 'number')) {
	            throw new Error('JSON.stringify');
	        }
	
	  // Make a fake root object containing our value under the key of ''.
	  // Return the result of stringifying the value.
	
	        return str('', {'': value});
	    };
	
	  // If the JSON object does not yet have a parse method, give it one.
	
	    JSON.parse = function (text, reviver) {
	    // The parse method takes a text and an optional reviver function, and returns
	    // a JavaScript value if the text is a valid JSON text.
	
	        var j;
	
	        function walk(holder, key) {
	
	    // The walk method is used to recursively walk the resulting structure so
	    // that modifications can be made.
	
	            var k, v, value = holder[key];
	            if (value && typeof value === 'object') {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }
	
	
	    // Parsing happens in four stages. In the first stage, we replace certain
	    // Unicode characters with escape sequences. JavaScript handles many characters
	    // incorrectly, either silently deleting them, or treating them as line endings.
	
	        text = String(text);
	        cx.lastIndex = 0;
	        if (cx.test(text)) {
	            text = text.replace(cx, function (a) {
	                return '\\u' +
	                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            });
	        }
	
	    // In the second stage, we run the text against regular expressions that look
	    // for non-JSON patterns. We are especially concerned with '()' and 'new'
	    // because they can cause invocation, and '=' because it can cause mutation.
	    // But just to be safe, we want to reject all unexpected forms.
	
	    // We split the second stage into 4 regexp operations in order to work around
	    // crippling inefficiencies in IE's and Safari's regexp engines. First we
	    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	    // replace all simple value tokens with ']' characters. Third, we delete all
	    // open brackets that follow a colon or comma or that begin the text. Finally,
	    // we look to see that the remaining characters are only whitespace or ']' or
	    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	        if (/^[\],:{}\s]*$/
	                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
	    // In the third stage we use the eval function to compile the text into a
	    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	    // in JavaScript: it can begin a block or an object literal. We wrap the text
	    // in parens to eliminate the ambiguity.
	
	            j = eval('(' + text + ')');
	
	    // In the optional fourth stage, we recursively walk the new structure, passing
	    // each name/value pair to a reviver function for possible transformation.
	
	            return typeof reviver === 'function' ?
	                walk({'': j}, '') : j;
	        }
	
	    // If the text is not JSON parseable, then a SyntaxError is thrown.
	
	        throw new SyntaxError('JSON.parse');
	    };
	
	    return JSON;
	  })();
	
	  if ('undefined' != typeof window) {
	    window.expect = module.exports;
	  }
	
	})(
	    this
	  ,  true ? module : {exports: {}}
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module), __webpack_require__(12).Buffer))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(6)
	__webpack_require__(17)
	__webpack_require__(18)
	__webpack_require__(19)

/***/ },
/* 11 */
/***/ function(module, exports) {

	
	//                     year       month    date
	var RE_DATE = /^([+-]?\d{4,6})\-(\d\d)\-(\d\d)$/
	var RE_MONTH = /^([+-]?\d{4,6})\-(\d\d)$/
	var RE_TIME = /^(\d\d):(\d\d)(?::(\d\d))?$/
	var RE_WEEK = /^([+-]?\d{4,6})-W(\d\d)(?:-?(\d))?$/
	var RE_DATETIME = /^([+-]?\d{4,6})\-(\d\d)\-(\d\d)T(\d\d):(\d\d)(?::(\d\d))?(?:[+-]\d\d:\d\d)?Z?$/;
	
	function toInt(string) {
	  return parseInt(string, 10)
	}
	
	function fixWeekday(weekday){
	  return weekday === 0 ? 7 : weekday
	}
	
	function isLeapYear(year) {
	  return year % 4 === 0 && year % 100 !== 0 && year % 400 === 0;
	}
	
	var MONTH_DATES = [31, 28, 31, 30, 31, 30, 30, 31, 30, 31, 30, 31]
	// 计算指定年份所在月的天数
	function getDaysOfMonth(year, month){
	  return MONTH_DATES[month] + (month === 1 && isLeapYear(year) ? 1 : 0)
	}
	
	// 计算指定年份第 week 周的周一 0 时的时间。
	function getDateOfWeek(year, week, weekday) {
	  var dow = new Date(year, 0, 1).getDay()
	  var dates = 1 + (week - 1) * 7
	  if (1 <= dow && dow <= 4) {
	    dates -= dow - 1
	  } else {
	    dates += 8 - dow
	  }
	  return new Date(year, 0, dates + (weekday || 1) - 1)
	}
	
	// 计算指定年份拥有的周数
	// 第 1 周的周四，第 53 周的周四
	function getWeeksOfYear(year) {
	  var firstWeek = getDateOfWeek(year, 1, 4)
	  var lastWeek = getDateOfWeek(year, 53, 4)
	  return 52 +
	    (firstWeek.getFullYear() !== year ? 1 : 0) +
	    (lastWeek.getFullYear() === year ? 1 : 0)
	}
	
	function parseDate(string) {
	  var match
	  var year = 1900
	  var month = 0
	  var date = 1
	  var hours = 0
	  var minutes = 0
	  var seconds = 0
	  var milliseconds = 0
	
	  if (match = RE_DATE.exec(string)) {
	
	    year = toInt(match[1])
	    month = toInt(match[2]) - 1
	    date = toInt(match[3])
	
	  } else if (match = RE_MONTH.exec(string)) {
	
	    year = toInt(match[1])
	    month = toInt(match[2]) - 1
	
	  } else if (match = RE_TIME.exec(string)) {
	
	    hours = toInt(match[1])
	    minutes = toInt(match[2])
	    seconds = toInt(match[3]) || 0
	
	  } else if (match = RE_WEEK.exec(string)) {
	
	    var y = toInt(match[1])
	    var w = toInt(match[2])
	    // Unset `match[3]`, day is NaN. NaN < 0 && NaN <0
	    // Do'nt set default day by `|| 1`, it will effect weekdayrange [1,7] limit.
	    var day = toInt(match[3])
	    var maxWeeks = getWeeksOfYear(y)
	    if (1 > w || w > maxWeeks || 1 > day || day > 7) {
	      return NaN
	    }
	    var d = getDateOfWeek(y, w, day)
	    year = d.getFullYear()
	    month = d.getMonth()
	    date = d.getDate()
	
	  } else if (match = RE_DATETIME.exec(string)) {
	
	    year = toInt(match[1])
	    month = toInt(match[2]) - 1
	    date = toInt(match[3])
	    hours = toInt(match[4])
	    minutes = toInt(match[5])
	    seconds = toInt(match[6]) || 0
	    milliseconds = toInt(match[7]) || 0
	
	  } else {
	
	    return NaN
	
	  }
	
	  if (0 > month || month > 11 ||
	      1 > date || date > getDaysOfMonth(year, month) ||
	      0 > hours || hours > 23 ||
	      0 > minutes || minutes > 59 ||
	      0 > seconds || seconds > 59 ||
	      0 > milliseconds || milliseconds > 999
	      ) {
	
	    return NaN
	  }
	
	  // Use 1900(or another year) and setFullYear for fix new Date(year, ...) not support [0,99] year.
	  var dt = new Date(1900, month, date, hours, minutes, seconds, milliseconds)
	  dt.setFullYear(year)
	
	  return dt
	}
	
	function distanceDate(stringA, stringB) {
	  var dateA = parseDate(stringA)
	  var dateB = parseDate(stringB)
	  if (isNaN(dateA) || isNaN(dateB)) {throw new Error('Invalid Date'); }
	  return dateA.getTime() - dateB.getTime()
	}
	
	function compareDate(stringA, stringB) {
	  var distance = distanceDate(stringA, stringB)
	  if (distance === 0) {return 0}
	  return distance > 0 ? 1 : -1
	}
	
	function isDate(string) {
	  var match = string.match(RE_DATE)
	  return RE_DATE.test(string) && !isNaN(parseDate(string))
	}
	
	function isDateTime(string){
	  return RE_DATETIME.test(string) && !isNaN(parseDate(string))
	}
	
	function isMonth(string){
	  return RE_MONTH.test(string) && !isNaN(parseDate(string))
	}
	
	function isTime(string){
	  return RE_TIME.test(string) && !isNaN(parseDate(string))
	}
	
	function isWeek(string){
	  return RE_WEEK.test(string) && !isNaN(parseDate(string))
	}
	
	module.exports = {
	  getDateOfWeek: getDateOfWeek,
	  parseDate: parseDate,
	  getWeeksOfYear: getWeeksOfYear,
	  compareDate: compareDate,
	  distanceDate: distanceDate,
	  isDate: isDate,
	  isDateTime: isDateTime,
	  isMonth: isMonth,
	  isTime: isTime,
	  isWeek: isWeek
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	var base64 = __webpack_require__(26)
	var ieee754 = __webpack_require__(27)
	var isArray = __webpack_require__(28)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  this.length = 0
	  this.parent = undefined
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./asap": 1,
		"./asap.js": 1,
		"./component.json": 20,
		"./package.json": 21,
		"./test/asap-implementation": 2,
		"./test/asap-implementation.js": 2,
		"./test/browser-domain": 3,
		"./test/browser-domain.js": 3,
		"./test/domain-implementation": 4,
		"./test/domain-implementation.js": 4,
		"./test/tests": 5,
		"./test/tests.js": 5
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 13;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./asap-implementation": 2,
		"./asap-implementation.js": 2,
		"./browser-domain": 3,
		"./browser-domain.js": 3,
		"./domain-implementation": 4,
		"./domain-implementation.js": 4,
		"./tests": 5,
		"./tests.js": 5
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 14;


/***/ },
/* 15 */,
/* 16 */
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
	      } else {
	        throw TypeError('Uncaught, unspecified "error" event.');
	      }
	      return false;
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
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];
	
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
	    var m;
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
	  } else {
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
	
	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Promise = __webpack_require__(6)
	var asap = __webpack_require__(1)
	
	module.exports = Promise
	Promise.prototype.done = function (onFulfilled, onRejected) {
	  var self = arguments.length ? this.then.apply(this, arguments) : this
	  self.then(null, function (err) {
	    asap(function () {
	      throw err
	    })
	  })
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//This file contains the ES6 extensions to the core Promises/A+ API
	
	var Promise = __webpack_require__(6)
	var asap = __webpack_require__(1)
	
	module.exports = Promise
	
	/* Static Functions */
	
	function ValuePromise(value) {
	  this.then = function (onFulfilled) {
	    if (typeof onFulfilled !== 'function') return this
	    return new Promise(function (resolve, reject) {
	      asap(function () {
	        try {
	          resolve(onFulfilled(value))
	        } catch (ex) {
	          reject(ex);
	        }
	      })
	    })
	  }
	}
	ValuePromise.prototype = Promise.prototype
	
	var TRUE = new ValuePromise(true)
	var FALSE = new ValuePromise(false)
	var NULL = new ValuePromise(null)
	var UNDEFINED = new ValuePromise(undefined)
	var ZERO = new ValuePromise(0)
	var EMPTYSTRING = new ValuePromise('')
	
	Promise.resolve = function (value) {
	  if (value instanceof Promise) return value
	
	  if (value === null) return NULL
	  if (value === undefined) return UNDEFINED
	  if (value === true) return TRUE
	  if (value === false) return FALSE
	  if (value === 0) return ZERO
	  if (value === '') return EMPTYSTRING
	
	  if (typeof value === 'object' || typeof value === 'function') {
	    try {
	      var then = value.then
	      if (typeof then === 'function') {
	        return new Promise(then.bind(value))
	      }
	    } catch (ex) {
	      return new Promise(function (resolve, reject) {
	        reject(ex)
	      })
	    }
	  }
	
	  return new ValuePromise(value)
	}
	
	Promise.all = function (arr) {
	  var args = Array.prototype.slice.call(arr)
	
	  return new Promise(function (resolve, reject) {
	    if (args.length === 0) return resolve([])
	    var remaining = args.length
	    function res(i, val) {
	      try {
	        if (val && (typeof val === 'object' || typeof val === 'function')) {
	          var then = val.then
	          if (typeof then === 'function') {
	            then.call(val, function (val) { res(i, val) }, reject)
	            return
	          }
	        }
	        args[i] = val
	        if (--remaining === 0) {
	          resolve(args);
	        }
	      } catch (ex) {
	        reject(ex)
	      }
	    }
	    for (var i = 0; i < args.length; i++) {
	      res(i, args[i])
	    }
	  })
	}
	
	Promise.reject = function (value) {
	  return new Promise(function (resolve, reject) { 
	    reject(value);
	  });
	}
	
	Promise.race = function (values) {
	  return new Promise(function (resolve, reject) { 
	    values.forEach(function(value){
	      Promise.resolve(value).then(resolve, reject);
	    })
	  });
	}
	
	/* Prototype Methods */
	
	Promise.prototype['catch'] = function (onRejected) {
	  return this.then(null, onRejected);
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//This file contains then/promise specific extensions that are only useful for node.js interop
	
	var Promise = __webpack_require__(6)
	var asap = __webpack_require__(1)
	
	module.exports = Promise
	
	/* Static Functions */
	
	Promise.denodeify = function (fn, argumentCount) {
	  argumentCount = argumentCount || Infinity
	  return function () {
	    var self = this
	    var args = Array.prototype.slice.call(arguments)
	    return new Promise(function (resolve, reject) {
	      while (args.length && args.length > argumentCount) {
	        args.pop()
	      }
	      args.push(function (err, res) {
	        if (err) reject(err)
	        else resolve(res)
	      })
	      fn.apply(self, args)
	    })
	  }
	}
	Promise.nodeify = function (fn) {
	  return function () {
	    var args = Array.prototype.slice.call(arguments)
	    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
	    var ctx = this
	    try {
	      return fn.apply(this, arguments).nodeify(callback, ctx)
	    } catch (ex) {
	      if (callback === null || typeof callback == 'undefined') {
	        return new Promise(function (resolve, reject) { reject(ex) })
	      } else {
	        asap(function () {
	          callback.call(ctx, ex)
	        })
	      }
	    }
	  }
	}
	
	Promise.prototype.nodeify = function (callback, ctx) {
	  if (typeof callback != 'function') return this
	
	  this.then(function (value) {
	    asap(function () {
	      callback.call(ctx, null, value)
	    })
	  }, function (err) {
	    asap(function () {
	      callback.call(ctx, err)
	    })
	  })
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = {
		"name": "asap",
		"repo": "kriskowal/asap",
		"description": "High-priority task queue for Node.js and browsers",
		"version": "1.0.0",
		"keywords": [
			"event",
			"task",
			"queue"
		],
		"dependencies": {},
		"development": {},
		"license": "MIT",
		"main": "asap.js",
		"scripts": [
			"asap.js"
		]
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = {
		"name": "asap",
		"version": "1.0.0",
		"description": "High-priority task queue for Node.js and browsers",
		"keywords": [
			"event",
			"task",
			"queue"
		],
		"license": {
			"type": "MIT",
			"url": "https://github.com/kriskowal/asap/raw/master/LICENSE.md"
		},
		"repository": {
			"type": "git",
			"url": "https://github.com/kriskowal/asap.git"
		},
		"main": "asap",
		"scripts": {
			"node-test": "mocha test/tests.js",
			"phantomjs-test": "zuul test/tests.js",
			"browser-test": "zuul --server 8080 test/tests.js",
			"test": "npm run node-test && npm run phantomjs-test"
		},
		"devDependencies": {
			"zuul": "0.0.8",
			"mocha": "1.12.x",
			"lodash": "1.3.1"
		},
		"testling": {
			"browsers": [
				"ie/6..latest",
				"firefox/3..5",
				"firefox/19..nightly",
				"chrome/4..7",
				"chrome/24..canary",
				"opera/10..next",
				"safari/4..latest",
				"iphone/6",
				"ipad/6"
			],
			"harness": "mocha",
			"files": "test/tests.js"
		},
		"spm": {
			"main": "asap.js",
			"dependencies": {}
		},
		"homepage": "https://github.com/kriskowal/asap",
		"repo": "kriskowal/asap"
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	var Promise = this.Promise || __webpack_require__(10)
	var Events = __webpack_require__(16).EventEmitter;
	var dateUtil = __webpack_require__(11);
	
	var BUILD_IN_RULE = {
	  isEmail: function(email){
	    return verifyIsEmail(email, {});
	  },
	  isUrl: verifyIsUrl,
	  isNumber: verifyIsNumber,
	  isTel: verifyIsTel,
	  isColor: verifyIsColor,
	  isDate: verifyIsDate,
	  isDateTime: verifyIsDateTime,
	  isDateTimeLocal: verifyIsDateTimeLocal,
	  isMonth: verifyIsMonth,
	  isWeek: verifyIsWeek,
	  isTime: verifyIsTime,
	  isMobile: function(mobile){
	    return verifyIsMobile(mobile, {});
	  }
	};
	
	var RULE_TYPES = {
	  "text": "text",
	  "password": "password",
	  "email": "email",
	  "radio": "radio",
	  "checkbox": "checkbox",
	  "select-one": "select-one",
	  "select-multiple": "select-multiple",
	  "hidden": "hidden",
	  "search": "search",
	  "textarea": "textarea",
	  "file": "file",
	  "number": "number",
	  "range": "range",
	  "date": "date",
	  "week": "week",
	  "month": "month",
	  "time": "time",
	  "datetime": "datetime",
	  "datetime-local": "datetime-local",
	  "url": "url",
	  "tel": "tel",
	  "color": "color",
	  "submit": "submit",
	  "button": "button",
	  "reset": "reset",
	  "image": "image",
	  "fieldset": "fieldset",
	  "legend": "legend"
	};
	
	
	// @param {Object} object.
	// @param {String} type, like `Array`, `RegExp`, etc.
	function typeOf(type){
	  return function(object){
	    return Object.prototype.toString.call(object) === "[object " + type + "]";
	  }
	}
	
	var isString = typeOf("String")
	var isBoolean = typeOf("Boolean")
	var isArray = typeOf("Array")
	var isRegExp = typeOf("RegExp")
	var isFunction = typeOf("Function")
	
	var _isNumber = typeOf("Number")
	var _isObject = typeOf("Object")
	
	function isNumber(object){
	  return !isNaN(object) && _isNumber(object);
	}
	function isObject(object){
	  return null !== object && _isObject(object);
	}
	
	function isPromise(object) {
	  return object && isFunction(object.then);
	}
	
	// #12, 同时支持 Promise 和非 Promise。
	// 对于 Promise，等待其兑现。
	// 对于非 Promise，立即执行，提高性能。
	function UniPromise (promise, resolve, reject) {
	  if (isPromise(promise)) {
	    return promise.then(resolve, reject)
	  } else {
	    return resolve(promise)
	  }
	}
	
	function trim(string){
	  return String(string).replace(/^\s+/, "").replace(/\s+$/, "");
	}
	
	// @param {Object} object.
	// @return {Number} return number if object can convert to number,
	//                  else return NaN.
	function toNumber(object){
	  if(isNumber(object)){return object;}
	  object = trim(object);
	  if("" === object){return NaN;}
	  return Number(object);
	}
	
	// @param {Object} rules
	// @param {Function} handler
	// @param {Function} placehandler, optional. When has not item, call placehorder handler.
	function eachRules(rules, handler, placehandler){
	  var hasRule = false;
	  for(var ruleName in rules){
	    if(rules.hasOwnProperty(ruleName)){
	      hasRule = true;
	      handler.call(rules, ruleName, rules[ruleName]);
	    }
	  }
	  if (!hasRule && isFunction(placehandler)) {
	    placehandler()
	  }
	}
	
	function eachValues(handler, values /* ,... */){
	  var certified = true;
	  var args = Array.prototype.slice.call(arguments, 0).slice(1);
	  if(isArray(values)){
	    for(var i=0,l=values.length; i<l; i++){
	      args[0] = values[i];
	      certified = certified && handler.apply(null, args);
	    }
	    return certified;
	  }
	  return handler.apply(null, args);
	}
	
	function merge(/* ... */){
	  var result = {};
	  for(var i=0,object,l=arguments.length; i<l; i++){
	    object = arguments[i];
	    if(!isObject(object)){continue;}
	
	    for(var key in object){
	      if(object.hasOwnProperty(key)){
	        result[key] = object[key]
	      }
	    }
	
	  }
	
	  return result;
	}
	
	function startsWith(string, prefix){
	  return isString(string) && string.indexOf(prefix) === 0;
	}
	function endsWith(string, suffix) {
	  return isString(string) &&
	    string.indexOf(suffix, string.length - suffix.length) !== -1;
	}
	
	
	// 通常情况下的 required 校验。
	// @param {Boolean,Undefined} required, is rule required?
	// @param {String,Object} values, validation data.
	// @return {Boolean,Undefined}
	//        if !values and required, return false;
	//        if !values and not-required, return true;
	//        if values, validate passed, and continue next, return undefined.
	function verifyRequired(required, values){
	  if(isArray(values)){
	    if(!verifyMinLimit(1, values)){
	      return !isBoolean(required) || !required;
	    }
	  }else{
	    if("undefined"===typeof values || null===values || ""===values){
	      return !isBoolean(required) || !required;
	    }
	  }
	  //!return undefined;
	}
	
	
	function verifyIsNumber(value, validity){
	  var certified = /^[+-]?\d+(?:[eE][+-]?\d+)?$/.test(value) ||
	    /^[+-]?(?:\d+)?\.\d+(?:[eE][+-]?\d+)?$/.test(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	function verifyMin(value, min, validity){
	  var certified;
	  value = toNumber(value);
	  min = toNumber(min);
	  if(!isNumber(min)){
	    certified = true;
	  } else if(!isNumber(value)){
	    certified = false;
	  } else {
	    certified = value >= min;
	  }
	
	  validity.rangeUnderflow = !certified;
	
	  return certified;
	
	  //return !isNumber(min) || isNumber(value) && Number(value) >= Number(min);
	}
	
	function verifyMax(value, max, validity){
	  var certified;
	  value = toNumber(value);
	  max = toNumber(max);
	  if(!isNumber(max)){
	    certified = true;
	  } else if(!isNumber(value)){
	    certified = false;
	  } else {
	    certified = value <= max;
	  }
	  // XXX: Non-Effect.
	  validity.rangeOverflow = !certified;
	  return certified;
	
	  //return !isNumber(max) || isNumber(value) && Number(value) <= Number(max);
	}
	
	function verifyMinLimit(minlimit, values, validity){
	  var certified;
	  var length = 0;
	
	  minlimit = toNumber(minlimit);
	
	  if(!isNumber(minlimit)){return true;}
	  if(!isArray(values)){
	    values = [ values ];
	  }
	
	  if(values.length < minlimit){
	    certified = false;
	  } else {
	
	    for(var i=0,l=values.length; i<l; i++){
	      if("undefined"!==typeof values[i] && null!==values[i] && ""!==values[i]){
	        length++;
	      }
	    }
	
	  }
	
	  certified = length >= minlimit;
	  if (validity) {
	    // XXX: tooShort? no. rangeUnderflow? no. is tooFew.
	    validity.customError = !certified;
	  }
	  return certified;
	}
	
	function verifyMaxLimit(maxlimit, values, validity){
	
	  maxlimit = toNumber(maxlimit);
	  if(!isNumber(maxlimit)){return true;}
	  if(!isArray(values)){
	    values = [ values ];
	  }
	
	  var length = 0;
	  for(var i=0,l=values.length; i<l; i++){
	    if("undefined"!==typeof values[i] && null!==values[i] && ""!==values[i]){
	      length++;
	    }
	  }
	
	  var certified = length <= maxlimit;
	  if (validity) {
	    // XXX: tooLong? no. rangeOverflow? no. is tooMuch.
	    validity.customError = !certified;
	  }
	  return certified;
	}
	
	function verifyMinLengthList(minlength, values, validity){
	  minlength = toNumber(minlength);
	  if(!isNumber(minlength)){return true;}
	
	  var certified = true;
	  for(var i=0,l=values.length; i<l; i++){
	    certified = certified && verifyMinLength(minlength, values[i], validity);
	  }
	
	  return certified;
	}
	
	function verifyMaxLengthList(maxlength, values, validity){
	  maxlength = toNumber(maxlength);
	  if(!isNumber(maxlength)){return true;}
	
	  var certified = true;
	  for(var i=0,l=values.length; i<l; i++){
	    certified = certified && verifyMaxLength(maxlength, values[i], validity);
	  }
	
	  return certified;
	}
	
	function verifyMinLength(minlength, value, validity){
	  minlength = toNumber(minlength);
	  var certified = !isNumber(minlength) ||
	         (isString(value) && value.length >= minlength);
	  validity.tooShort = !certified;
	  return certified;
	}
	
	function verifyMaxLength(maxlength, value, validity){
	  maxlength = toNumber(maxlength);
	  var certified = !isNumber(maxlength) ||
	         (isString(value) && value.length <= maxlength);
	  validity.tooLong = !certified;
	  return certified;
	}
	
	function verifyIsMonth(value, validity){
	  var certified = dateUtil.isMonth(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	function verifyMinMonth(value, min, instance_context, validity){
	  if(!min){return true;}
	  if(!verifyIsMonth(min, validity)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=month][min='+min+'] is invalid month.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, min) >= 0;
	  validity.rangeUnderflow = !certified;
	  return certified;
	}
	
	function verifyMaxMonth(value, max, instance_context, validity){
	  if(!max){return true;}
	  if(!verifyIsMonth(max, validity)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=month][max='+max+'] is invalid month.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, max) <= 0;
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	function verifyIsTime(value, validity){
	  var certified = dateUtil.isTime(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	function verifyMinTime(value, min, instance_context, validity){
	  if(!min){return true;}
	  if(!verifyIsTime(min, validity)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=time][min='+min+'] is invalid time.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, min) >= 0;
	  validity.rangeUnderflow = !certified;
	  return certified;
	}
	
	function verifyMaxTime(value, max, instance_context, validity){
	  if(!max){return true;}
	  if(!verifyIsTime(max, validity)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=time][max='+max+'] is invalid time.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, max) <= 0;
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	function verifyIsDate(value, validity){
	  var certified = dateUtil.isDate(value);
	  if (validity){
	    validity.typeMismatch = !certified;
	  }
	  return certified;
	}
	
	function verifyMinDate(value, min, instance_context, validity){
	  if(!min){return true;}
	  // Do't change validity on verify `min` rule.
	  if(!verifyIsDate(min /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=date][min='+min+'] is invalid date.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, min) >= 0;
	  validity.rangeUnderflow = !certified;
	  return certified;
	}
	
	function verifyMaxDate(value, max, instance_context, validity){
	  if(!max){return true;}
	  // Do't change validity on verify `max` rule.
	  if(!verifyIsDate(max/* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=date][max='+max+'] is invalid date.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, max) <= 0;
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	// http://www.w3.org/TR/html-markup/input.datetime.html
	function verifyIsDateTime(value, validity){
	  var certified = dateUtil.isDateTime(value);
	  if (validity) {
	    validity.typeMismatch = !certified;
	  }
	  return certified;
	}
	
	function verifyMinDateTime(value, min, instance_context, validity){
	  if(!min){return true;}
	  // Do't change validity on verify `min` rule.
	  // TODO: test cases.
	  if(!verifyIsDateTime(min /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=datetime][min='+min+'] is invalid datetime.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, min) >= 0;
	  validity.rangeUnderflow = !certified;
	  return certified;
	}
	
	function verifyMaxDateTime(value, max, instance_context, validity){
	  if(!max){return true;}
	  // Do't change validity on verify `max` rule.
	  // TODO: test cases.
	  if(!verifyIsDateTime(max /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=datetime][max='+max+'] is invalid datetime.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, max) <= 0;
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	// [input=type=datetime-local](http://www.w3.org/TR/html-markup/input.datetime-local.html)
	var RE_DATETIME_LOCAL = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;
	function verifyIsDateTimeLocal(value, validity){
	  var certified = dateUtil.isDateTime(value);
	  if (validity) {
	    validity.typeMismatch = !certified;
	  }
	  return certified;
	}
	
	function verifyMinDateTimeLocal(value, min, instance_context, validity){
	  if(!min){return true;}
	  // Do't change validity on verify `min` rule.
	  // TODO: test cases.
	  if(!verifyIsDateTimeLocal(min /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=datetime-local][min='+min+'] is invalid datetime.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, min) >= 0;
	  validity.rangeUnderflow = !certified;
	  return certified;
	}
	
	function verifyMaxDateTimeLocal(value, max, instance_context, validity){
	  if(!max){return true;}
	  // Do't change validity on verify `max` rule.
	  // TODO: test cases.
	  if(!verifyIsDateTimeLocal(max /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=datetime-local][max='+max+'] is invalid datetime.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, max) <= 0;
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	var RE_WEEK = /^\d{4,}-W\d{2}$/;
	function verifyIsWeek(value, validity){
	  var certified = dateUtil.isWeek(value);
	  if (validity) {
	    validity.typeMismatch = !certified;
	  }
	  return certified;
	}
	
	function verifyMinWeek(value, min, instance_context, validity){
	  if(!min){return true;}
	  // Do't change validity on verify `min` rule.
	  // TODO: test cases.
	  if(!verifyIsWeek(min /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=week][min='+min+'] is invalid week.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, min) >= 0;
	  // XXX: Non-Effect.
	  validity.rangeUnderflow = !certified;
	  return certified;
	}
	
	function verifyMaxWeek(value, max, instance_context, validity){
	  if(!max){return true;}
	  // Do't change validity on verify `max` rule.
	  // TODO: test cases.
	  if(!verifyIsWeek(max /* , validity */)){
	    instance_context._evt.emit("error",
	      new TypeError('[type=week][max='+max+'] is invalid week.'));
	    return true;
	  }
	  var certified = dateUtil.distanceDate(value, max) <= 0;
	  // XXX: Non-Effect.
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	// [RFC1738](http://www.faqs.org/rfcs/rfc1738.html)
	var RE_URL = /^https?:\/\/(?:[\w.-]*(?::[^@]+)?@)?(?:[\w-]+\.){1,3}[\w]+(?::\d+)?(?:\/.*)?$/;
	function verifyIsUrl(value, validity){
	  var certified = RE_URL.test(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	
	var RE_EMAIL = /^\w+(?:[+.-]\w+)*@\w+(?:[.-]\w+)*\.\w+(?:[.-]\w+)*$/;
	function verifyIsEmail(value, validity){
	  var certified = RE_EMAIL.test(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	
	var RE_MOBILE = /^(?:13[0-9]|14[57]|15[0-35-9]|17[0678]|18[0-9])\d{8}$/;
	function verifyIsMobile(value, validity){
	  var certified = RE_MOBILE.test(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	
	var RE_TEL = /^(?:\(\+\d{2}\))?\d{3,4}\-\d{7,8}$/;
	function verifyIsTel(value, validity){
	  var certified = RE_TEL.test(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	
	var RE_COLOR = /^#[0-9a-fA-F]{6}$/;
	function verifyIsColor(value, validity){
	  var certified = RE_COLOR.test(value);
	  validity.typeMismatch = !certified;
	  return certified;
	}
	
	function verifyPattern(pattern, value, instance_context, validity){
	  if(!isRegExp(pattern)){
	
	    if(!isString(pattern)){return true;}
	
	    try{
	      pattern = new RegExp(pattern);
	    }catch(ex){
	      instance_context._evt.emit("error", ex);
	      return true;
	    }
	  }
	  var certified = pattern.test(value);
	  validity.patternMismatch = !certified;
	
	  return certified;
	}
	
	function verifyPatternList(pattern, values, instance_context, validity){
	  var certified = true;
	  for(var i=0,l=values.length; i<l; i++){
	    certified = certified && verifyPattern(pattern, values[i], instance_context, validity);
	  }
	  return certified;
	}
	
	function verifyFunction(ruleFunction, value, datas){
	  if(!isFunction(ruleFunction)){return true;}
	
	  var build_in_rule = merge(BUILD_IN_RULE, {
	    data: function(key){
	      return datas[key];
	    }
	  });
	
	  return ruleFunction.call(build_in_rule, value);
	}
	
	var MIME_TYPE = {
	  "txt": "text/plain",
	  "htm": "text/html",
	  "html": "text/html",
	  "js": "application/javascript",
	  "css": "text/css",
	  "csv": "text/csv",
	  "xml": "text/xml",
	  "jpg": "image/jpeg",
	  "jpeg": "image/jpeg",
	  "png": "image/png",
	  "gif": "image/gif",
	  "pdf": "application/pdf",
	  "doc": "application/msword",
	  "docx": "application/msword",
	  "zip": "application/zip",
	  "mp3": "audio/mpeg",
	  "ogg": "audio/ogg"
	};
	function typeByName(fileName){
	  var ext = fileName.split(".").slice(-1);
	  if(MIME_TYPE.hasOwnProperty(ext)){
	    return MIME_TYPE[ext];
	  }
	}
	
	// @param {Array} accept.
	// @param {File} file.
	// @return {Boolean}
	function verifyFileType(file, accept, validity){
	  if(!isArray(accept) || !file || !file.name){return true;}
	  for(var i=0,l=accept.length; i<l; i++){
	    if(!file.type){
	      file.type = typeByName(file.name);
	    }
	    if(accept[i] === file.type){
	      return true;
	    }else if(endsWith(accept[i], "/*") &&
	        startsWith(file.type, accept[i].replace(/\*$/, "")) ){
	      return true;
	    }
	  }
	  validity.typeMismatch = true;
	  return false;
	}
	
	function verifyMinFileSize(file, min, validity){
	  if(!isNumber(min) || !isNumber(file.size)){return true;}
	  var certified = file.size >= min;
	  validity.tooShort = !certified;
	  return certified;
	}
	function verifyMaxFileSize(file, max, validity){
	  if(!isNumber(max) || !isNumber(file.size)){return true;}
	  var certified = file.size <= max;
	  validity.tooLong = !certified;
	  return certified;
	}
	
	var ValidityState = {
	  customError: "customError",
	  patternMismatch: "patternMismatch",
	  rangeOverflow: "rangeOverflow",
	  rangeUnderflow: "rangeUnderflow",
	  stepMismatch: "stepMismatch",
	  tooLong: "tooLong",
	  tooShort: "tooShort",
	  typeMismatch: "typeMismatch",
	  valueMissing: "valueMissing",
	  badInput: "badInput",
	  valid: "valid"
	};
	
	function verify(ruleName, rule, values, datas, instance_context){
	
	    var certified = true;
	    var validity = {
	      customError: false,
	      patternMismatch: false,
	      rangeOverflow: false,
	      rangeUnderflow: false,
	      stepMismatch: false,
	      tooLong: false,
	      tooShort: false,
	      typeMismatch: false,
	      valueMissing: false,
	      badInput: false,
	      valid: true,
	      validationMessage: ValidityState.valid
	    };
	
	    var resultRequired = verifyRequired(rule.required, values);
	    // fast return if required rule not match.
	    if("undefined" !== typeof resultRequired){
	
	      if (resultRequired === false) {
	        validity.valueMissing = true;
	        validity.valid = false;
	        validity.validationMessage = ValidityState.valueMissing;
	      }
	
	      instance_context._evt.emit(resultRequired ? "valid":"invalid", ruleName, values, validity);
	
	      return resultRequired;
	    }
	
	    if(isArray(values)){
	
	      certified = certified &&
	        verifyMinLengthList(rule.minlength, values, validity) &&
	        verifyMaxLengthList(rule.maxlength, values, validity) &&
	        verifyPatternList(rule.pattern, values, instance_context, validity);
	
	    }else{
	
	      certified = certified &&
	        verifyMinLength(rule.minlength, values, validity) &&
	        verifyMaxLength(rule.maxlength, values, validity) &&
	        verifyPattern(rule.pattern, values, instance_context, validity);
	
	    }
	
	    // FIXME: validity.
	    certified = certified &&
	      verifyMinLimit(rule.minlimit, values, validity) &&
	      verifyMaxLimit(rule.maxlimit, values, validity);
	
	
	    // rule: type, min, max.
	    switch(rule.type){
	    case RULE_TYPES.number:
	    case RULE_TYPES.range:
	      certified = certified &&
	        eachValues(verifyIsNumber, values, validity) &&
	        eachValues(verifyMin, values, rule.min, validity) &&
	        eachValues(verifyMax, values, rule.max, validity);
	      break;
	
	    case RULE_TYPES.date:
	      certified = certified &&
	        eachValues(verifyIsDate, values, validity) &&
	        eachValues(verifyMinDate, values, rule.min, instance_context, validity) &&
	        eachValues(verifyMaxDate, values, rule.max, instance_context, validity);
	      break;
	
	    case RULE_TYPES.datetime:
	      certified = certified &&
	        eachValues(verifyIsDateTime, values, validity) &&
	        eachValues(verifyMinDateTime, values, rule.min, instance_context, validity) &&
	        eachValues(verifyMaxDateTime, values, rule.max, instance_context, validity);
	      break;
	
	    case RULE_TYPES["datetime-local"]:
	      certified = certified &&
	        eachValues(verifyIsDateTimeLocal, values, validity) &&
	        eachValues(verifyMinDateTimeLocal, values, rule.min, instance_context, validity) &&
	        eachValues(verifyMaxDateTimeLocal, values, rule.max, instance_context, validity);
	      break;
	
	    case RULE_TYPES.time:
	      certified = certified &&
	        eachValues(verifyIsTime, values, validity) &&
	        eachValues(verifyMinTime, values, rule.min, instance_context, validity) &&
	        eachValues(verifyMaxTime, values, rule.max, instance_context, validity);
	      break;
	
	    case RULE_TYPES.week:
	      certified = certified &&
	        eachValues(verifyIsWeek, values, validity) &&
	        eachValues(verifyMinWeek, values, rule.min, instance_context, validity) &&
	        eachValues(verifyMaxWeek, values, rule.max, instance_context, validity);
	      break;
	
	    case RULE_TYPES.month:
	      certified = certified &&
	        eachValues(verifyIsMonth, values, validity) &&
	        eachValues(verifyMinMonth, values, rule.min, instance_context, validity) &&
	        eachValues(verifyMaxMonth, values, rule.max, instance_context, validity);
	      break;
	
	    case RULE_TYPES.url:
	      certified = certified && eachValues(verifyIsUrl, values, validity);
	      break;
	
	    case RULE_TYPES.email:
	      certified = certified && eachValues(verifyIsEmail, values, validity);
	      break;
	
	    case RULE_TYPES.tel:
	      certified = certified && (
	          eachValues(verifyIsTel, values, validity) ||
	          eachValues(verifyIsMobile, values, validity)
	        );
	      break;
	
	    case RULE_TYPES.color:
	      certified = certified && eachValues(verifyIsColor, values, validity);
	      break;
	
	    case RULE_TYPES.file:
	      certified = certified &&
	        eachValues(verifyFileType, values, rule.accept, validity) &&
	        eachValues(verifyMinFileSize, values, rule.min, validity) &&
	        eachValues(verifyMaxFileSize, values, rule.max, validity);
	      break;
	
	    //case RULE_TYPES.select-one:
	    //case RULE_TYPES.radio:
	    //case RULE_TYPES.text:
	    //case RULE_TYPES.search:
	    //case RULE_TYPES.textarea:
	    //case RULE_TYPES.checkbox:
	    //case RULE_TYPES["select-multiple"]:
	    //case RULE_TYPES.password:
	    //default:
	      //break;
	    }
	
	    return UniPromise(
	        //! NOTE: Do't each loop values by verifyFunction,
	        //        each loop values in user custom function if need.
	        verifyFunction(rule.custom, values, datas),
	        function(result){
	
	          if (!result) {
	            validity.customError = true;
	            validity.valid = false;
	          }
	
	          for(var key in validity){
	            if (validity.hasOwnProperty(key) && key !== "valid" && isBoolean(validity[key]) && validity[key]) {
	              validity.validationMessage = ValidityState[key];
	              validity.valid = false;
	            }
	          }
	
	          certified = certified && result;
	
	          validity.valid = certified;
	
	          instance_context._evt.emit(certified ? "valid":"invalid", ruleName, values, validity);
	          return certified;
	
	        }, function(reason){
	          return (reason);
	        }
	      )
	
	}
	
	
	var Validator = function(rules){
	  this._rules = rules;
	  this._evt = new Events();
	};
	
	Validator.prototype.validate = function(data){
	
	  var ME = this;
	
	  return new Promise(function(resolve, reject) {
	    var certified = true;
	    var pending = 0;
	
	    eachRules(ME._rules, function(ruleName, rule){
	
	      var values = data[ruleName];
	      pending ++;
	
	      UniPromise(
	        verify(ruleName, rule, values, data, ME),
	        function resolved(certify){
	          certified = certified && certify;
	
	          if((--pending) === 0){
	            ME._evt.emit("complete", certified);
	
	            resolve(certified)
	          }
	        },
	        function(){
	          ME._evt.emit("error", ruleName, rule, values, data)
	          pending --;
	        })
	      },
	      function(){
	        ME._evt.emit("complete", true)
	        resolve(true)
	      }
	    );
	
	  });
	};
	
	Validator.prototype.on = function(eventName, handler){
	  this._evt.on(eventName, handler);
	  return this;
	};
	
	Validator.prototype.off = function(eventName, handler){
	  if(isFunction(handler)){
	    this._evt.removeListener(eventName, handler);
	  }else{
	    this._evt.removeAllListeners(eventName);
	  }
	  return this;
	};
	
	Validator.rule = function(ruleName, validation){
	  if(!isString(ruleName)){return false;}
	  if(!isFunction(validation)){return BUILD_IN_RULE[ruleName];}
	
	  BUILD_IN_RULE[ruleName] = validation;
	  return true;
	};
	
	module.exports = Validator;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var expect = __webpack_require__(9);
	var dateUtil = __webpack_require__(11);
	
	function typeOf(type) {
	  return function(object) {
	    return Object.prototype.toString.call(object) === '[object ' + type + ']'
	  }
	}
	var isArray = typeOf("Array")
	var isNumber = typeOf("Number")
	
	function isAbsNaN(object){
	  return isNumber(object) && isNaN(object)
	}
	
	function each(list, handler) {
	  for(var i=0,l=list.length; i<l; i++){
	    handler(list[i], i)
	  }
	}
	
	describe("dateUtil", function(){
	
	  var testcases_getDateOfWeek = [
	   [ [2015, 1, 0], [2014, 11, 29] ],
	   [ [2013, 1, 0], [2012, 11, 31] ],
	   [ [1999, 1, 0], [1999, 0, 4] ]
	  ]
	
	  each(testcases_getDateOfWeek, function(testcase){
	    it('getDateOfWeek(' + testcase[0].join(',') + ') == ' +
	      testcase[1][0] + '-' + (testcase[1][1]+1) + '-' + testcase[1][2], function(){
	
	      var date = dateUtil.getDateOfWeek.apply(dateUtil, testcase[0])
	      expect(date.getFullYear()).to.equal(testcase[1][0])
	      expect(date.getMonth()).to.equal(testcase[1][1])
	      expect(date.getDate()).to.equal(testcase[1][2])
	    })
	  })
	
	  var testcases_parseDate = [
	
	    // DATETIME.
	    [ "2009-01-01T00:00:00", [2009, 0, 1, 0, 0, 0, 0] ],
	    [ "0000-01-01T00:00:00", [0, 0, 1, 0, 0, 0, 0] ],
	    [ "-0001-01-01T00:00:00", [-1, 0, 1, 0, 0, 0, 0] ],
	    // DATETIME: month boundary test.
	    [ "2009-00-01T00:00:00", NaN ],
	    [ "2009-12-01T00:00:00", [2009, 11, 1, 0, 0, 0, 0] ],
	    [ "2009-13-01T00:00:00", NaN ],
	    // DATETIME: date boundary test.
	    [ "2009-01-00T00:00:00", NaN ],
	    [ "2009-01-31T00:00:00", [2009, 0, 31, 0, 0, 0, 0] ],
	    [ "2009-01-32T00:00:00", NaN ],
	    // DATETIME: hours boundary test.
	    [ "2009-01-01T-1:00:00", NaN ],
	    [ "2009-01-01T23:00:00", [2009, 0, 1, 23, 0, 0, 0] ],
	    [ "2009-01-01T24:00:00", NaN ],
	    // DATETIME: minutes boundary test.
	    [ "2009-01-01T00:-1:00", NaN ],
	    [ "2009-01-01T00:59:00", [2009, 0, 1, 0, 59, 0, 0] ],
	    [ "2009-01-01T00:60:00", NaN ],
	    // DATETIME: seconds boundary test.
	    [ "2009-01-01T00:00:-1", NaN ],
	    [ "2009-01-01T00:00:59", [2009, 0, 1, 0, 0, 59, 0] ],
	    [ "2009-01-01T00:00:60", NaN ],
	
	    // DATETIME: space split date and time.
	    //![ "2009-01-01 00:00:00", [2009, 0, 1, 0, 0, 0, 0] ],
	
	    // DATETIME: no seconds.
	    //![ "2009-01-01 00:00", [2009, 0, 1, 0, 0, 0, 0] ],
	    [ "0000-01-01T00:00", [0, 0, 1, 0, 0, 0, 0] ],
	    [ "-0001-01-01T00:00", [-1, 0, 1, 0, 0, 0, 0] ],
	    // DATETIME: month boundary test.
	    [ "2009-00-01T00:00", NaN ],
	    [ "2009-12-01T00:00", [2009, 11, 1, 0, 0, 0, 0] ],
	    [ "2009-13-01T00:00", NaN ],
	    // DATETIME: date boundary test.
	    [ "2009-01-00T00:00", NaN ],
	    [ "2009-01-31T00:00", [2009, 0, 31, 0, 0, 0, 0] ],
	    [ "2009-01-32T00:00", NaN ],
	    // DATETIME: hours boundary test.
	    [ "2009-01-01T-1:00", NaN ],
	    [ "2009-01-01T23:00", [2009, 0, 1, 23, 0, 0, 0] ],
	    [ "2009-01-01T24:00", NaN ],
	    // DATETIME: minutes boundary test.
	    [ "2009-01-01T00:-1", NaN ],
	    [ "2009-01-01T00:59", [2009, 0, 1, 0, 59, 0, 0] ],
	    [ "2009-01-01T00:60", NaN ],
	
	    // DATE.
	    [ "2009-01-00", NaN ],
	    [ "2009-01-01", [2009, 0, 1, 0, 0, 0, 0] ],
	    [ "2009-01-32", NaN ],
	    [ "2009-02-28", [2009, 1, 28, 0, 0, 0, 0] ],
	    [ "2009-02-29", NaN ],
	    [ "2009-12-31", [2009, 11, 31, 0, 0, 0, 0] ],
	    [ "2009-12-32", NaN ],
	    [ "0100-12-31", [100, 11, 31, 0, 0, 0, 0] ],
	    [ "0099-12-31", [99, 11, 31, 0, 0, 0, 0] ],
	    [ "0001-12-31", [1, 11, 31, 0, 0, 0, 0] ],
	    [ "0001-01-01", [1, 0, 1, 0, 0, 0, 0] ],
	    [ "0000-01-01", [0, 0, 1, 0, 0, 0, 0] ],
	    [ "-0000-01-01", [0, 0, 1, 0, 0, 0, 0] ],
	    [ "-0001-01-01", [-1, 0, 1, 0, 0, 0, 0] ],
	
	    [ "2009-00-01", NaN ],
	    [ "2009-13-01", NaN ],
	    [ "2009-100-01", NaN ],
	    [ "2009-001-01", NaN ],
	    [ "2009-01-001", NaN ],
	
	    // MONTH.
	    [ "2009-01", [2009, 0, 1, 0, 0, 0, 0] ],
	    [ "2009-12", [2009, 11, 1, 0, 0, 0, 0] ],
	    [ "0100-12", [100, 11, 1, 0, 0, 0, 0] ],
	    [ "0099-12", [99, 11, 1, 0, 0, 0, 0] ],
	    [ "0001-12", [1, 11, 1, 0, 0, 0, 0] ],
	    [ "0001-01", [1, 0, 1, 0, 0, 0, 0] ],
	    [ "0000-01", [0, 0, 1, 0, 0, 0, 0] ],
	    [ "-0000-01", [0, 0, 1, 0, 0, 0, 0] ],
	    [ "-0001-01", [-1, 0, 1, 0, 0, 0, 0] ],
	
	    [ "2009-00", NaN ],
	    [ "2009-13", NaN ],
	    [ "2009-100", NaN ],
	    [ "2009-001", NaN ],
	
	    // TIME
	    [ "00:00:00", [1900, 0, 1, 0, 0, 0, 0] ],
	    [ "00:00:59", [1900, 0, 1, 0, 0, 59, 0] ],
	    [ "00:00:60", NaN ],
	    [ "00:59:00", [1900, 0, 1, 0, 59, 0, 0] ],
	    [ "00:60:00", NaN ],
	    [ "23:00:00", [1900, 0, 1, 23, 0, 0, 0] ],
	    [ "24:00:00", NaN ],
	
	    [ "00:00", [1900, 0, 1, 0, 0, 0, 0] ],
	    [ "00:59", [1900, 0, 1, 0, 59, 0, 0] ],
	    [ "00:60", NaN ],
	    [ "23:00", [1900, 0, 1, 23, 0, 0, 0] ],
	    [ "24:00", NaN ],
	
	    // WEEK
	    [ "2009-W01-1", [2008, 11, 29, 0, 0, 0, 0] ],
	    [ "2009-W53-7", [2010, 0, 3, 0, 0, 0, 0] ],
	    [ "2009-W54-1", NaN ],
	    [ "2009-W01-0", NaN ],
	    [ "2009-W01-8", NaN ],
	    [ "2009-W541", NaN ],
	    [ "2009-W010", NaN ],
	    [ "2009-W018", NaN ],
	    [ "2015-W01", [2014, 11, 29, 0, 0, 0, 0] ],
	    [ "2015-W011", [2014, 11, 29, 0, 0, 0, 0] ],
	    [ "2015-W01-1", [2014, 11, 29, 0, 0, 0, 0] ],
	
	  ]
	
	  each(testcases_parseDate, function(testcase){
	    var desc = 'parseDate(' + testcase[0] + ') == ' +
	      (isAbsNaN(testcase[1]) ? "NaN" :
	        testcase[1][0] + '-' + (testcase[1][1]+1) + '-' + testcase[1][2] +
	        "T" + testcase[1][3] + ":" + testcase[1][4] + ":" + testcase[1][5])
	
	    it(desc, function(){
	
	      var date = dateUtil.parseDate(testcase[0])
	
	      if (isAbsNaN(testcase[1])) {
	        expect(isAbsNaN(date)).to.equal(true)
	      } else {
	        expect("year:"+date.getFullYear()).to.equal("year:"+testcase[1][0])
	        expect("month:"+date.getMonth()).to.equal("month:"+testcase[1][1])
	        expect("date:"+date.getDate()).to.equal("date:"+testcase[1][2])
	        expect("hours:"+date.getHours()).to.equal("hours:"+testcase[1][3])
	        expect("minutes:"+date.getMinutes()).to.equal("minutes:"+testcase[1][4])
	        expect("seconds:"+date.getSeconds()).to.equal("seconds:"+testcase[1][5])
	      }
	    })
	  })
	
	  var testcases_getWeeksOfYear = [
	    [2015, 53],
	    [2014, 52],
	    [2013, 52],
	    [2012, 52],
	    [2011, 52],
	    [2010, 52],
	    [2009, 53],
	    [2008, 52],
	    [2007, 52],
	    [2006, 52],
	    [2005, 52],
	    [2004, 53],
	    [2003, 52],
	    [2002, 52],
	    [2001, 52],
	    [2000, 52],
	    [1999, 52],
	    [1998, 53],
	    [1997, 52],
	    [1996, 52],
	    [1995, 52],
	    [1994, 52],
	    [1993, 52],
	    [1992, 53],
	    [1991, 52],
	    [1990, 52],
	    [1989, 52],
	    [1988, 52],
	    [1987, 53],
	    [1986, 52],
	    [1985, 52],
	    [1984, 52],
	    [1983, 52],
	    [1982, 52],
	    [1981, 53],
	    [1980, 52],
	    [1979, 52],
	    [1978, 52],
	    [1977, 52],
	    [1976, 53]
	  ]
	
	  each(testcases_getWeeksOfYear, function(testcase){
	    var desc = 'getWeeksOfYear(' + testcase[0] + ') == ' + testcase[1]
	
	    it(desc, function(){
	
	      var weeks = dateUtil.getWeeksOfYear(testcase[0])
	      expect(weeks).to.equal(testcase[1])
	
	    })
	  })
	
	
	  var testcases_compareDate = [
	    // date : date
	    [ "1900-05-05", "1900-05-05", 0 ],
	    [ "1901-05-05", "1900-05-05", 1 ],
	    [ "1900-06-01", "1900-05-05", 1 ],
	    [ "1900-05-06", "1900-05-05", 1 ],
	    [ "1899-05-05", "1900-05-05", -1 ],
	    [ "1900-04-05", "1900-05-05", -1 ],
	    [ "1900-05-04", "1900-05-05", -1 ],
	
	    // datetime : datetime
	    [ "1900-05-05T05:05:05", "1900-05-05T05:05:05", 0 ],
	    [ "1901-05-05T05:05:05", "1900-05-05T05:05:05", 1 ],
	    [ "1900-06-05T05:05:05", "1900-05-05T05:05:05", 1 ],
	    [ "1900-05-06T05:05:05", "1900-05-05T05:05:05", 1 ],
	    [ "1900-05-05T06:05:05", "1900-05-05T05:05:05", 1 ],
	    [ "1900-05-05T05:06:05", "1900-05-05T05:05:05", 1 ],
	    [ "1900-05-05T05:05:06", "1900-05-05T05:05:05", 1 ],
	    [ "1899-05-05T05:05:05", "1900-05-05T05:05:05", -1 ],
	    [ "1900-04-05T05:05:05", "1900-05-05T05:05:05", -1 ],
	    [ "1900-05-04T05:05:05", "1900-05-05T05:05:05", -1 ],
	    [ "1900-05-05T04:05:05", "1900-05-05T05:05:05", -1 ],
	    [ "1900-05-05T05:04:05", "1900-05-05T05:05:05", -1 ],
	    [ "1900-05-05T05:05:04", "1900-05-05T05:05:05", -1 ],
	    [ "1900-05-05T05:05", "1900-05-05T05:05", 0 ],
	    [ "1901-05-05T05:05", "1900-05-05T05:05", 1 ],
	    [ "1900-06-05T05:05", "1900-05-05T05:05", 1 ],
	    [ "1900-05-06T05:05", "1900-05-05T05:05", 1 ],
	    [ "1900-05-05T06:05", "1900-05-05T05:05", 1 ],
	    [ "1900-05-05T05:06", "1900-05-05T05:05", 1 ],
	    [ "1899-05-05T05:05", "1900-05-05T05:05", -1 ],
	    [ "1900-04-05T05:05", "1900-05-05T05:05", -1 ],
	    [ "1900-05-04T05:05", "1900-05-05T05:05", -1 ],
	    [ "1900-05-05T04:05", "1900-05-05T05:05", -1 ],
	    [ "1900-05-05T05:04", "1900-05-05T05:05", -1 ],
	
	    // time : time
	    [ "05:05:05", "05:05:05", 0 ],
	    [ "06:05:05", "05:05:05", 1 ],
	    [ "05:06:05", "05:05:05", 1 ],
	    [ "05:05:06", "05:05:05", 1 ],
	    [ "04:05:05", "05:05:05", -1 ],
	    [ "05:04:05", "05:05:05", -1 ],
	    [ "05:05:04", "05:05:05", -1 ],
	    [ "05:05", "05:05", 0 ],
	    [ "06:05", "05:05", 1 ],
	    [ "05:06", "05:05", 1 ],
	    [ "04:05", "05:05", -1 ],
	    [ "05:04", "05:05", -1 ],
	
	    // week : week
	    [ "1900-W055", "1900-W055", 0],
	    [ "1901-W055", "1900-W055", 1],
	    [ "1900-W065", "1900-W055", 1],
	    [ "1900-W056", "1900-W055", 1],
	    [ "1899-W055", "1900-W055", -1],
	    [ "1900-W045", "1900-W055", -1],
	    [ "1900-W054", "1900-W055", -1],
	
	    // date : *
	    [ "2014-12-29", "2014-12-29T00:00:00", 0 ],
	    [ "2014-12-29", "2014-12-29T00:00", 0 ],
	    [ "1900-01-01", "00:00:00", 0 ],
	    [ "1900-01-01", "00:00", 0 ],
	    [ "2014-12-29", "2015-W011", 0 ],
	    [ "2014-12-29", "2015-W01", 0 ]
	  ]
	  each(testcases_compareDate, function(testcase){
	    it('compareDate(' + testcase[0] + ',' + testcase[1] + ') == ' + testcase[2], function(){
	
	      expect(dateUtil.compareDate(testcase[0], testcase[1])).to.equal(testcase[2])
	
	    })
	  })
	
	  var testcases_isDate = [
	    [ "1900-01-01", true],
	    [ "1900-12-01", true],
	    [ "1900-12-31", true],
	    [ "190a-01-01", false],
	    [ "1900-00-01", false],
	    [ "1900-13-01", false],
	    [ "1900-01-00", false],
	    [ "1900-01-32", false]
	  ]
	  each(testcases_isDate, function(testcase){
	    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){
	
	      expect(dateUtil.isDate(testcase[0])).to.equal(testcase[1])
	
	    })
	  })
	
	  var testcases_isMonth = [
	    [ "1900-01", true],
	    [ "1900-12", true],
	    [ "190a-01-01", false],
	    [ "1900-00", false],
	    [ "1900-13", false]
	  ]
	  each(testcases_isMonth, function(testcase){
	    it('isMonth(' + testcase[0] + ') == ' + testcase[1], function(){
	
	      expect(dateUtil.isMonth(testcase[0])).to.equal(testcase[1])
	
	    })
	  })
	
	  var testcases_isDateTime = [
	    [ "1900-01-01T00:00:00", true],
	    [ "1900-12-01T00:00:00", true],
	    [ "1900-12-31T00:00:00", true],
	    [ "1900-01-01T23:00:00", true],
	    [ "1900-01-01T00:59:00", true],
	    [ "1900-01-01T00:00:59", true],
	    //![ "1900-01-01 00:00:00", true],
	    [ "1900-01-01", false],
	    [ "1900-00-01T00:00:00", false],
	    [ "1900-13-01T00:00:00", false],
	    [ "1900-01-00T00:00:00", false],
	    [ "1900-01-32T00:00:00", false],
	    [ "1900-01-01T24:00:00", false],
	    [ "1900-01-01T00:60:00", false],
	    [ "1900-01-01T00:00:60", false],
	    [ "1900-01-01T00:00", true],
	    [ "1900-12-01T00:00", true],
	    [ "1900-12-31T00:00", true],
	    [ "1900-01-01T23:00", true],
	    [ "1900-01-01T00:59", true],
	    //![ "1900-01-01 00:00", true],
	    [ "1900-00-01T00:00", false],
	    [ "1900-13-01T00:00", false],
	    [ "1900-01-00T00:00", false],
	    [ "1900-01-32T00:00", false],
	    [ "1900-01-01T24:00", false],
	    [ "1900-01-01T00:60", false]
	  ]
	  each(testcases_isDateTime, function(testcase){
	    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){
	
	      expect(dateUtil.isDateTime(testcase[0])).to.equal(testcase[1])
	
	    })
	  })
	
	  var testcases_isTime = [
	    [ "00:00:00", true],
	    [ "00:00:00", true],
	    [ "00:00:00", true],
	    [ "23:00:00", true],
	    [ "00:59:00", true],
	    [ "00:00:59", true],
	    [ "1900-01-01", false],
	    [ "24:00:00", false],
	    [ "00:60:00", false],
	    [ "00:00:60", false],
	    [ "00:00", true],
	    [ "23:00", true],
	    [ "00:59", true],
	    [ "24:00", false],
	    [ "00:60", false]
	  ]
	  each(testcases_isTime, function(testcase){
	    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){
	
	      expect(dateUtil.isTime(testcase[0])).to.equal(testcase[1])
	
	    })
	  })
	
	  var testcases_isWeek = [
	    [ "2015-W01", true],
	    [ "2015-W011", true],
	    [ "2015-W017", true],
	    [ "2015-W00", false],
	    [ "2015-W010", false],
	    [ "2015-W018", false]
	  ]
	  each(testcases_isWeek, function(testcase){
	    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){
	
	      expect(dateUtil.isWeek(testcase[0])).to.equal(testcase[1])
	
	    })
	  })
	
	});


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var expect = __webpack_require__(9);
	var Promise = this.Promise || __webpack_require__(10)
	var Validator = __webpack_require__(22);
	
	// Luhn 算法
	// @see http://en.wikipedia.org/wiki/Luhn_algorithm
	// @param {String} card, 被校验的号码。
	// @return {Boolean} `true` 如果通过校验，否则返回 `false`。
	function luhn(card){
	  var sum = 0;
	  for(var i=card.length-1,c,even; i>=0; i--){
	    c = parseInt(card.charAt(i), 10);
	    even = (i % 2) === (card.length % 2);
	    if(even){
	      c = c * 2;
	      if(c > 9){
	        c = c - 9;
	      }
	    }
	    sum += c;
	  }
	  return sum % 10 === 0;
	}
	
	Validator.rule("isBankCard", function(values){
	
	  if(Object.prototype.toString.call(values) !== '[object Array]'){
	    values = [values.toString()];
	  }
	
	  var certified = true;
	  var re_card = /^[34569][0-9]{12,18}$/;
	
	  for(var i=0,l=values.length; i<l; i++){
	    certified = certified && re_card.test(values[i]) && luhn(values[i]);
	  }
	  return certified;
	});
	
	var rule_required = {
	  text: { type: "text", required: true },
	  password: { type:"password", required: true },
	  search: { type:"search", required: true }
	};
	
	
	function isEmptyObject(object){
	  var isEmpty = true;
	  for(var key in object){
	    if (object.hasOwnProperty(key)){
	      isEmpty = false;
	    }
	  }
	  return isEmpty;
	}
	
	function testInvalid(validator, rule, data, done){
	  var emitInvalidEvent = false;
	  validator.on("invalid", function(name, value, validity){
	    //!expect("invalid").to.equal("invalid");
	    emitInvalidEvent = true;
	
	    expect(validity.valid).to.equal(false);
	    expect(validity.validationMessage).not.to.equal("valid");
	    expect(
	        validity.valid | 0 +
	        validity.customError | 0 +
	        validity.patternMismatch | 0 +
	        validity.rangeOverflow | 0 +
	        validity.rangeUnderflow | 0 +
	        validity.stepMismatch | 0 +
	        validity.tooLong | 0 +
	        validity.tooShort | 0 +
	        validity.typeMismatch | 0 +
	        validity.valueMissing | 0 +
	        validity.badInput | 0
	      ).to.equal(1);
	
	  }).on("valid", function(name, value, validity){
	    expect("valid").to.equal("invalid");
	  }).on("complete", function(certified){
	    expect(certified).to.equal(false);
	    if (!isEmptyObject(rule)){
	      expect(emitInvalidEvent).to.equal(true);
	    }
	    validator.off();
	    done();
	  }).on("error", function(){ });
	}
	
	function testValid(validator, rule, data, done){
	  var emitValidEvent = false;
	  validator.on("invalid", function(name, values, validity){
	    expect("invalid").to.equal("valid");
	  }).on("valid", function(name, values, validity){
	    emitValidEvent = true;
	
	    expect(validity.valid).to.equal(true);
	
	    expect(validity.customError).to.equal(false);
	    expect(validity.patternMismatch).to.equal(false);
	    expect(validity.rangeOverflow).to.equal(false);
	    expect(validity.rangeUnderflow).to.equal(false);
	    expect(validity.stepMismatch).to.equal(false);
	    expect(validity.tooLong).to.equal(false);
	    expect(validity.tooShort).to.equal(false);
	    expect(validity.typeMismatch).to.equal(false);
	    expect(validity.badInput).to.equal(false);
	
	    expect("valid").to.equal("valid");
	  }).on("complete", function(certified){
	    expect(certified).to.equal(true);
	    if (!isEmptyObject(rule)){
	      expect(emitValidEvent).to.equal(true);
	    }
	    done();
	  }).on("error", function(){ });
	}
	
	// TODO: add test case for more than two rule item.
	// TODO: add test case for diff certify rule and data.
	
	var testCases = [
	  // non-rule
	  // --------------------------------------------------------------------
	  {
	    "rule": {},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:0},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:1},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:null},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:undefined},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:""},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:"1"},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:false},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:true},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:new Date()},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:/re/g},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:{}},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:1, b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[undefined], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[null], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[,], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[0], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[1], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:["1"], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[false], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[true], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[/re/g], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[new Date()], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[{}], b:2},
	    "test": testValid
	  },
	  {
	    "rule": {},
	    "data": {a:[1,2], b:2},
	    "test": testValid
	  },
	
	
	  // require:false
	  // --------------------------------------------------------------------
	  {
	    "rule": { a: {required: false} },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:0},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:1},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:null},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:undefined},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:""},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:"1"},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:false},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:true},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:new Date()},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:/re/g},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:{}},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:1, b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[undefined], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[null], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[,], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[0], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[1], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:["1"], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[false], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[true], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[/re/g], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[new Date()], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[{}], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: false} },
	    "data": {a:[1,2], b:2},
	    "test": testValid
	  },
	
	
	  // require:true
	  // --------------------------------------------------------------------
	  {
	    "rule": { a: {required: true} },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:0},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:1},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:null},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:undefined},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:""},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:"1"},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:false},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:true},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:new Date()},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:/re/g},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:{}},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:1, b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[], b:2},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:["", , , undefined, null], b:2},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[0], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[1], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:["1"], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[false], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[true], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[/re/g], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[new Date()], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[{}], b:2},
	    "test": testValid
	  },
	  {
	    "rule": { a: {required: true} },
	    "data": {a:[1,2], b:2},
	    "test": testValid
	  },
	
	
	  // minlength.
	  // FIXME: test for minlength is minlimit now.
	  {
	    "rule": { a: { minlength: NaN } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: NaN } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: "" } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: "" } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: null }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: null }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: undefined }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: undefined }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: 2 }},
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: "1" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: "12" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: "123" },
	    "test": testValid
	  },
	
	  {
	    "rule": { a: { minlength: NaN } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: NaN } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: "" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: "" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: null } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: null } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: undefined }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: undefined }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlength: 2 }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: [0] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: [0,"",null,undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: ["01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: ["012"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { minlength: 2 }},
	    "data": { a: ["01","abc"] },
	    "test": testValid
	  },
	
	
	  // maxlength.
	  {
	    "rule": { a: { maxlength: NaN } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: NaN } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: "" } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: "" } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: null }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: null }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: undefined }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: undefined }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: 2 }},
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: "123" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: "12" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: "1" },
	    "test": testValid
	  },
	
	  {
	    "rule": { a: { maxlength: NaN } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: NaN } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: "" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: "" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: null } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: null } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: undefined }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: undefined }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlength: 2 }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: [null,undefined,,,""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["12"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["123"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["12","23"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["","0","12"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlength: 2 }},
	    "data": { a: ["012","1",""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlength: 1 }},
	    "data": { a: [1,2,"",null,undefined] },
	    "test": testInvalid
	  },
	
	
	  // minlimit.
	  {
	    "rule": { a: { minlimit: NaN } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: NaN } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: "" } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: "" } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: null }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: null }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: undefined }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: undefined }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 2 }},
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: 2 }},
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 2 }},
	    "data": { a: "1" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 1 }},
	    "data": { a: "1" },
	    "test": testValid
	  },
	
	  {
	    "rule": { a: { minlimit: NaN } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: NaN } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: "" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: "" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: null } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: null } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: undefined }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: undefined }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 2 }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, minlimit: 2 }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 2 }},
	    "data": { a: [0] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 2 }},
	    "data": { a: [0,"",null,undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { minlimit: 2 }},
	    "data": { a: ["0","a"] },
	    "test": testValid
	  },
	
	
	  // maxlimit.
	  {
	    "rule": { a: { maxlimit: NaN } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: NaN } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: "" } },
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: "" } },
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: null }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: null }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: undefined }},
	    "data": {},
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: undefined }},
	    "data": {},
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: 2 }},
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: 2 }},
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: 1 }},
	    "data": { a: "1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlimit: 1 }},
	    "data": { a: "1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlimit: 2 }},
	    "data": { a: "1" },
	    "test": testValid
	  },
	
	  {
	    "rule": { a: { maxlimit: NaN } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: NaN } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: "" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: "" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: null } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: null } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: undefined }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: undefined }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: 2 }},
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, maxlimit: 2 }},
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: 1 }},
	    "data": { a: [1,2] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: 2 }},
	    "data": { a: ["1","2"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlimit: 2 }},
	    "data": { a: ["1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlimit: 1 }},
	    "data": { a: ["0","",null,undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { maxlimit: 1 }},
	    "data": { a: [0,1,"",null,undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { maxlimit: 1 }},
	    "data": { a: [1,2,"",null,undefined] },
	    "test": testInvalid
	  },
	
	
	  // rule: pattern.
	  {
	    "rule": { a: { pattern: "" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: "" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: null } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: null } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: undefined } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: undefined } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "a" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: "a" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "a" } },
	    "data": { a: "a" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { pattern: "b" } },
	    "data": { a: "abc" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { pattern: "^b" } },
	    "data": { a: "abc" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "b" } },
	    "data": { a: "a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: "" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "" } },
	    "data": { a: ["",null,undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: "" } },
	    "data": { a: ["",null,undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: null } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: null } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: undefined } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: undefined } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "a" } }, // not-required.
	    "data": { a: [""] }, // no-value.
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, pattern: "a" } }, // required.
	    "data": { a: ["", , , null, undefined] }, // no-value.
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "a" } },
	    "data": { a: ["a"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { pattern: "b" } },
	    "data": { a: ["abc"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { pattern: "^b" } },
	    "data": { a: ["abc"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "b" } },
	    "data": { a: ["a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { pattern: "a" } },
	    "data": { a: ["a", "abc"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { pattern: "a" } },
	    "data": { a: ["a", "abc", "b"] },
	    "test": testInvalid
	  },
	
	
	  // rule: type=number
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "number" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: " " },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: 0 },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: -1 },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: 1 },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "0" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "-1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "0.1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "-0.1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "+0.1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ".1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "-.1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "+.1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "0E0" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "1E0" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "-1E0" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "+1E0" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "-+.1" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: NaN },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: Number.MAX_VALUE },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: Number.MIN_VALUE },
	    "test": testValid
	  },
	  // [Infinity is NOT a number](http://scienceblogs.com/goodmath/2008/10/13/infinity-is-not-a-number/)
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: Number.POSITIVE_INFINITY },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: Number.NEGATIVE_INFINITY },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "number" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [" "] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["", , , null, undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "number" } },
	    "data": { a: ["", , , null, undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [0] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [-1] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [1] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["0"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["-1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: {
	      accept: null,
	      max: null,
	      maxlength: null,
	      min: null,
	      minlength: null,
	      multiple: false,
	      pattern: null,
	      required: false,
	      step: null,
	      type: "number"}
	    },
	    "data": { a: ["1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["0.1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["-0.1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["+0.1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [".1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["-.1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["+.1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["0E0"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["1E0"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["-1E0"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["+1E0"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [Number.MAX_VALUE] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [Number.MIN_VALUE] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [0, -1, 1, +1, 0.1, -0.1, +0.1, .1, -.1, +.1,
	                  "0", "-1", "1", "+1", "0.1", "-0.1", "+0.1", ".1", "-.1", "+.1",
	                  Number.MAX_VALUE, Number.MIN_VALUE] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "-+.1" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: "a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [NaN] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [Number.POSITIVE_INFINITY] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: [Number.NEGATIVE_INFINITY] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number" } },
	    "data": { a: ["-+.1", "a", NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY] },
	    "test": testInvalid
	  },
	  // [type=number][min]
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: 0 },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: 0 },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: "0" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: "0" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: 999 },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: 999 },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: "999" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: "999" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: 1000 },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: 1000 },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: "1000" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: "1000" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: [0] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: [0] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: ["0"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: ["0"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: [999] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: [999] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: ["999"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: ["999"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: [0, "0", 999, "999"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: [0, "0", 999, "999"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: [1000] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: [1000] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: ["1000"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: ["1000"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: "1000" } },
	    "data": { a: [1000, "1000"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "number", min: 1000 } },
	    "data": { a: [1000, "1000"] },
	    "test": testValid
	  },
	
	
	  // rule:type=date
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "2014-06-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "123456-06-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "2014-06-01 00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "2014-06-32" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "2014-13-01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: "a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ['', "", , , null, undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "date" } },
	    "data": { a: ['', "", , , null, undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-06-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["123456-06-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-06-01", "123456-06-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-06-01 00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-06-00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-06-32"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-00-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["2014-13-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ["a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date" } },
	    "data": { a: ['', "", , , null, undefined,
	      "2014-06-01 00:00:00",
	      "2014-06-00", "2014-06-32",
	      "2014-00-01", "2014-13-01", "a"] },
	    "test": testInvalid
	  },
	  // [type=date][min]
	  {
	    "rule": { a: { type: "date", min: "" } },
	    "data": { a: "2014-01-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", min: "2014" } },
	    "data": { a: "2014-01-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", min: "2014-01-01" } },
	    "data": { a: "2014-01-02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", min: "2014-01-02" } },
	    "data": { a: "2014-01-01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date", min: "" } },
	    "data": { a: ["2014-01-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", min: "2014" } },
	    "data": { a: ["2014-01-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", min: "2014-01-01" } },
	    "data": { a: ["2014-01-02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", min: "2014-01-02" } },
	    "data": { a: ["2014-01-01"] },
	    "test": testInvalid
	  },
	  // [type=date][max]
	  {
	    "rule": { a: { type: "date", max: "" } },
	    "data": { a: "2014-01-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", max: "2014" } },
	    "data": { a: "2014-01-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", max: "2014-01-02" } },
	    "data": { a: "2014-01-02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", max: "2014-01-02" } },
	    "data": { a: "2014-01-03" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "date", max: "" } },
	    "data": { a: ["2014-01-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", max: "2014" } },
	    "data": { a: ["2014-01-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", max: "2014-01-02" } },
	    "data": { a: ["2014-01-01", "2014-01-02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "date", max: "2014-01-02" } },
	    "data": { a: ["2014-01-03", "2014-02-01", "2015-01-01"] },
	    "test": testInvalid
	  },
	
	
	  // rule:type=datetime
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-01-31T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T23:59:59" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T23:59:59Z" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T23:59:59-08:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T23:59:59+08:00" },
	    "test": testValid
	  },
	  // FIXME: moment() not support 5 digit year.
	  //{
	    //"rule": { a: { type: "datetime" } },
	    //"data": { a: "123456-06-01T00:00:00" },
	    //"test": testValid
	  //},
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-06-01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-06-01 00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-01-32T00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-13-01T00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T24:59:59" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T23:60:59" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "2014-12-31T23:59:60" },
	    "test": testInvalid
	  },
	  // FIXME: 时区加减范围为 12，共 24个时区
	  //{
	    //"rule": { a: { type: "datetime" } },
	    //"data": { a: "2014-12-31T23:59:59-12:00" },
	    //"test": testInvalid
	  //},
	  //{
	    //"rule": { a: { type: "datetime" } },
	    //"data": { a: "2014-12-31T23:59:59-11:60" },
	    //"test": testInvalid
	  //},
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: "a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["", '', , , null, undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime" } },
	    "data": { a: ["", '', , , null, undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-06-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-31T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-31T00:00:00"] },
	    "test": testValid
	  },
	  // FIXME: moment() not support 5 digit year.
	  //{
	    //"rule": { a: { type: "datetime" } },
	    //"data": { a: ["123456-06-01T00:00:00"] },
	    //"test": testValid
	  //},
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: [
	      "2014-01-01T00:00:00", "2014-01-31T00:00:00", "2014-12-31T23:59:59"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-00-01T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-00T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-01T60:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-01T00:60:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-01T00:00:60"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-32T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-13-01T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-06-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-06-01 00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-32T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-13-01T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime" } },
	    "data": { a: ["2014-01-01T23:59:60", "2014-01-01T23:60:59",
	      "2014-01-01T24:59:59", "2014-01-01T00:59:59",
	      "2014-01-00T23:59:59", "2014-01-32T23:59:59",
	      "2014-00-01T23:59:59", "2014-13-01T23:59:59",
	      "2014-06-00", "a"] },
	    "test": testInvalid
	  },
	  // [type=datetime][min]
	  {
	    "rule": { a: { type: "datetime", min:"" } },
	    "data": { a: "2014-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T00:00:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T00:01:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T01:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-02T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-02-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2015-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:01:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T01:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-01T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-01-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2013-02-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"" } },
	    "data": { a: ["2014-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T00:00:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T00:01:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T01:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-02T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-02-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2015-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
	    "data": { a: [
	      "2014-01-01T00:00:00", "2014-01-01T00:00:01", "2014-01-01T00:01:00",
	      "2014-01-01T01:00:00", "2014-01-02T00:00:00", "2014-02-01T00:00:00",
	      "2015-01-01T00:00:00"
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:01:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T01:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-01T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-01-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2013-02-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
	    "data": { a: [
	      "2014-02-02T02:02:01", "2014-02-02T02:01:02", "2014-02-02T01:02:02",
	      "2014-02-01T02:02:02", "2014-01-02T02:02:02", "2013-02-02T02:02:02"
	    ] },
	    "test": testInvalid
	  },
	  // [type=datetime][max]
	  {
	    "rule": { a: { type: "datetime", max:"" } },
	    "data": { a: "2014-02-02T02:02:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:01:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T01:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-01T03:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-01-03T03:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2013-03-03T03:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"" } },
	    "data": { a: ["2014-02-02T02:02:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:01:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T01:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-01T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-01-03T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2013-03-03T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: [
	      "2014-02-02T02:02:02", "2014-02-02T02:02:01", "2014-02-02T02:01:03",
	      "2014-02-02T01:03:03", "2014-02-01T03:03:03", "2014-01-03T03:03:03",
	      "2013-03-03T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:03" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:03:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T03:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-03T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-03-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2015-02-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:03"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:03:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T03:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-03T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-03-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2015-02-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
	    "data": { a: [
	      "2014-02-02T02:02:03", "2014-02-02T02:03:02", "2014-02-02T03:02:02",
	      "2014-02-03T02:02:02", "2014-03-02T02:02:02", "2015-02-02T02:02:02"
	    ] },
	    "test": testInvalid
	  },
	
	
	  // rule: type=datetime-local
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-01-31T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T23:59:59" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T23:59:59Z" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T23:59:59-08:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T23:59:59+08:00" },
	    "test": testValid
	  },
	  // FIXME: moment() not support 5 digit year.
	  //{
	    //"rule": { a: { type: "datetime-local" } },
	    //"data": { a: "123456-06-01T00:00:00" },
	    //"test": testValid
	  //},
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-06-01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-06-01 00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-01-32T00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-13-01T00:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T24:59:59" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T23:60:59" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "2014-12-31T23:59:60" },
	    "test": testInvalid
	  },
	  // FIXME: 时区加减范围为 12，共 24个时区
	  //{
	    //"rule": { a: { type: "datetime-local" } },
	    //"data": { a: "2014-12-31T23:59:59-12:00" },
	    //"test": testInvalid
	  //},
	  //{
	    //"rule": { a: { type: "datetime-local" } },
	    //"data": { a: "2014-12-31T23:59:59-11:60" },
	    //"test": testInvalid
	  //},
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: "a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: [] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: [] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["", '', , , null, undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "datetime-local" } },
	    "data": { a: ["", '', , , null, undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-06-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-31T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-31T00:00:00"] },
	    "test": testValid
	  },
	  // FIXME: moment() not support 5 digit year.
	  //{
	    //"rule": { a: { type: "datetime-local" } },
	    //"data": { a: ["123456-06-01T00:00:00"] },
	    //"test": testValid
	  //},
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: [
	      "2014-01-01T00:00:00", "2014-01-31T00:00:00", "2014-12-31T23:59:59"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-00-01T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-00T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-01T60:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-01T00:60:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-01T00:00:60"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-32T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-13-01T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-06-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-06-01 00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-32T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-13-01T00:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local" } },
	    "data": { a: ["2014-01-01T23:59:60", "2014-01-01T23:60:59",
	      "2014-01-01T24:59:59", "2014-01-01T00:59:59",
	      "2014-01-00T23:59:59", "2014-01-32T23:59:59",
	      "2014-00-01T23:59:59", "2014-13-01T23:59:59",
	      "2014-06-00", "a"] },
	    "test": testInvalid
	  },
	  // [type=datetime-local][min]
	  {
	    "rule": { a: { type: "datetime-local", min:"" } },
	    "data": { a: "2014-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T00:00:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T00:01:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-01T01:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-01-02T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2014-02-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: "2015-01-01T00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:01:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T01:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-01T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-01-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: "2013-02-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"" } },
	    "data": { a: ["2014-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T00:00:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T00:01:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-01T01:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-01-02T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2014-02-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: ["2015-01-01T00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
	    "data": { a: [
	      "2014-01-01T00:00:00", "2014-01-01T00:00:01", "2014-01-01T00:01:00",
	      "2014-01-01T01:00:00", "2014-01-02T00:00:00", "2014-02-01T00:00:00",
	      "2015-01-01T00:00:00"
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:01:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T01:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-01T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-01-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: ["2013-02-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
	    "data": { a: [
	      "2014-02-02T02:02:01", "2014-02-02T02:01:02", "2014-02-02T01:02:02",
	      "2014-02-01T02:02:02", "2014-01-02T02:02:02", "2013-02-02T02:02:02"
	    ] },
	    "test": testInvalid
	  },
	  // [type=datetime-local][max]
	  {
	    "rule": { a: { type: "datetime-local", max:"" } },
	    "data": { a: "2014-02-02T02:02:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:01:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T01:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-01T03:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-01-03T03:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2013-03-03T03:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"" } },
	    "data": { a: ["2014-02-02T02:02:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:01:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T01:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-01T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-01-03T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2013-03-03T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: [
	      "2014-02-02T02:02:02", "2014-02-02T02:02:01", "2014-02-02T02:01:03",
	      "2014-02-02T01:03:03", "2014-02-01T03:03:03", "2014-01-03T03:03:03",
	      "2013-03-03T03:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:02:03" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T02:03:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-02T03:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-02-03T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2014-03-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: "2015-02-02T02:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:02:03"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T02:03:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-02T03:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-02-03T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2014-03-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: ["2015-02-02T02:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
	    "data": { a: [
	      "2014-02-02T02:02:03", "2014-02-02T02:03:02", "2014-02-02T03:02:02",
	      "2014-02-03T02:02:02", "2014-03-02T02:02:02", "2015-02-02T02:02:02"
	    ] },
	    "test": testInvalid
	  },
	
	
	
	  // rule:type=time
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "time" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "time" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "time" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:00:59" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:59:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "23:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "23:59:59" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:00:60" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:60:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "24:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "0a:00:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:0a:00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: "00:00:0a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "time" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "time" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "time" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:00:59"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:59:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["23:00:00"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["23:59:59"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:00:00", "00:00:59", "00:59:00", "23:00:00", "23:59:59"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:00:60"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:60:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["24:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["0a:00:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:0a:00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:00:0a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time" } },
	    "data": { a: ["00:00:60", "00:60:00", "24:00:00", "00:0a:00", "00:0a:00", "00:00:0a"] },
	    "test": testInvalid
	  },
	  // [type=time][min]
	  {
	    "rule": { a: { type: "time", min:"" } },
	    "data": { a: "00:00:00" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "02:02:02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "02:02:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "02:03:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "03:01:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:02:02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:02:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:03:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["03:01:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:02:02", "02:02:03", "02:03:01", "03:01:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "02:02:01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "02:01:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: "01:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:02:01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:01:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["01:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", min:"02:02:02" } },
	    "data": { a: ["02:02:01", "02:01:02", "01:02:02"] },
	    "test": testInvalid
	  },
	  // [type=time][max]
	  {
	    "rule": { a: { type: "time", max:"" } },
	    "data": { a: "02:02:02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "02:02:02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "02:02:01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "02:01:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "01:03:03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"" } },
	    "data": { a: ["02:02:02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:02:02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:02:01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:01:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["01:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:02:02", "02:02:01", "02:01:03", "01:03:03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "02:02:03" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "02:03:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: "03:02:02" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:02:03"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:03:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["03:02:02"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "time", max:"02:02:02" } },
	    "data": { a: ["02:02:03", "02:03:01", "03:02:02"] },
	    "test": testInvalid
	  },
	
	
	  // rule:type=week
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "week" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "week" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "week" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "2014-W01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "2014-W52" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "2014-W1" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "2014-W53" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "2014-W54" },
	    "test": testInvalid
	  },
	  // FIXME: moment() not support 5 digit year.
	  //{
	    //"rule": { a: { type: "week" } },
	    //"data": { a: "123456-W01" },
	    //"test": testValid
	  //},
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "week" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "week" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "week" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W52"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W01", "2014-W52"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W1"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W53"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W54"] },
	    "test": testInvalid
	  },
	  // FIXME: moment() not support 5 digit year.
	  //{
	    //"rule": { a: { type: "week" } },
	    //"data": { a: "123456-W01" },
	    //"test": testValid
	  //},
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W1", "2014-W54"] },
	    "test": testInvalid
	  },
	  // [type=week][min]
	  {
	    "rule": { a: { type: "week", min:"" } },
	    "data": { a: "2014-W01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: "2014-W02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: "2014-W03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: "2015-W01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: ["2014-W02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: ["2014-W03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: ["2015-W01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", min:"2014-W02" } },
	    "data": { a: ["2014-W02", "2014-W03", "2015-W01"] },
	    "test": testValid
	  },
	  // [type=week][max]
	  {
	    "rule": { a: { type: "week", max:"" } },
	    "data": { a: "2014-W01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: "2014-W02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: "2014-W01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: "2013-W03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: ["2014-W02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: ["2014-W01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: ["2013-W03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week", max:"2014-W02" } },
	    "data": { a: ["2014-W02", "2014-W01", "2013-W03"] },
	    "test": testValid
	  },
	
	
	  // rule:type=month
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "month" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "month" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "month" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: "2014-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: "2014-12" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: "123456-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: "2014-00" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: "2014-13" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "month" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "month" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "month" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-12"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["123456-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-01", "2014-12", "123456-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-1"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["214-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-00"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-13"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month" } },
	    "data": { a: ["2014-1", "214-01", "2014-00", "2014-13"] },
	    "test": testInvalid
	  },
	  // [type=month][min]
	  {
	    "rule": { a: { type: "month", min:"" } },
	    "data": { a: "2014-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: "2014-02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: "2014-03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: "2015-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"" } },
	    "data": { a: ["2014-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2014-02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2014-03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2015-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2014-02", "2014-03", "2015-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: "2014-01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: "2013-03" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2014-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2013-03"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", min:"2014-02" } },
	    "data": { a: ["2014-01", "2013-03"] },
	    "test": testInvalid
	  },
	  // [type=month][max]
	  {
	    "rule": { a: { type: "month", max:"" } },
	    "data": { a: "2014-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: "2014-02" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: "2014-01" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: "2013-03" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"" } },
	    "data": { a: ["2014-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2014-02"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2014-01"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2013-03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2014-02", "2014-01", "2013-03"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: "2014-03" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: "2015-01" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2014-03"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2015-01"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "month", max:"2014-02" } },
	    "data": { a: ["2014-03", "2015-01"] },
	    "test": testInvalid
	  },
	
	
	  // rule:type=url
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "url" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "url" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "url" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com/" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com#" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com/#" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com/####" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com/#flat:path/to/snip-code" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com?" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "https://www.example.com/?" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?a=1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?a=1&b=2" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?a=1&b=%E4%B8%AD%E6%96%87" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?a=1&b=2#flag" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html#flag" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?#flag" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "http://www.example.com/path/to/page.html?#flag" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: "ftp://www.example.com/path/to/page.html?#flag" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "url" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "url" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "url" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com/"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com#"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com/#"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com/####"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com/#flat:path/to/snip-code"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com?"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com/?"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?a=1"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?a=1&b=2"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?a=1&b=%E4%B8%AD%E6%96%87"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?a=1&b=2#flag"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html#flag"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?#flag"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com/path/to/page.html?#flag"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["http://www.example.com", "http://www.example.com/path/to/page.html?#flag"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["ftp://www.example.com/path/to/page.html?#flag"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "url" } },
	    "data": { a: ["https://www.example.com?", "ftp://www.example.com/path/to/page.html?#flag"] },
	    "test": testInvalid
	  },
	
	
	  // rule:type=email
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "email" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "email" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "email" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "a@b.c" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "a@b-inc.c" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "a@inc.com.cn.hk" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "a@192.168.0.1" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@def.ghi" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc.def-ghi_jkl+mn@opq.rst" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: " " },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@def" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@def." },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@def.ghi." },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@.def.ghi" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ".abc@def.ghi" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc.@def.ghi" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "abc@.def" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "@abc" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: "@abc." },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "email" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "email" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "email" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["a@b.c"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@def.ghi"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc.def-ghi_jkl+mn@opq.rst"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["a@b.c", "abc@def.ghi", "abc.def-ghi_jkl+mn@opq.rst"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: [" "] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@def"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@def."] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@def.ghi."] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@.def.ghi"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: [".abc@def.ghi"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc.@def.ghi"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["abc@.def"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["@abc"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: ["@abc."] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "email" } },
	    "data": { a: [" ", "abc", "abc@",
	     "abc@def", "abc@def.", "abc@def.ghi.", "abc@.def.ghi",
	     ".abc@def.ghi", "abc.@def.ghi",
	      "abc@.def", "@abc", "@abc."] },
	    "test": testInvalid
	  },
	
	
	  // rule:type=tel
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "tel" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "tel" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "tel" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: "0571-26888888" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: "(+86)0571-26888888" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: "13900000000" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: "0571-268888889" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: "0571-2688888a" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "tel" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "tel" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "tel" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: ["0571-26888888"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: ["(+86)0571-26888888"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: ["0571-26888888", "(+86)0571-26888888"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: ["0571-268888889"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: ["0571-2688888a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "tel" } },
	    "data": { a: ["0571-268888889", "0571-2688888a"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: {
	      accept: null,
	      max: null,
	      maxlength: null,
	      min: null,
	      minlength: null,
	      multiple: false,
	      pattern: null,
	      required: false,
	      step: null,
	      type: "tel",
	    } },
	    "data": { a: ["13900000000"] },
	    "test": testValid
	  },
	
	
	  // rule:type=color
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "color" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "color" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "color" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#000000" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#ffffff" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#FFFFFF" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#FFFFFG" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#000" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#12345" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#123456" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: "#1234567" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "color" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "color" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "color" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#000000"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#ffffff"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#FFFFFF"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#123456"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#000000", "#ffffff", "#FFFFFF", "#123456"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#000"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#fffffg"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#FFFFFG"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#12345"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#1234567"] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "color" } },
	    "data": { a: ["#000", "#fffffg", "#FFFFFG", "#12345", "#1234567"] },
	    "test": testInvalid
	  },
	
	
	  // rule:type=file
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "file" } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: null },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "file" } },
	    "data": { a: null },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: undefined },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "file" } },
	    "data": { a: undefined },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: {} },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: { name: "a.jpg" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: { name: "a.jpg" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: { name: "a", type:"image/jpeg" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: { name: "a", type:"image/jpeg" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: { name: "a.png" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: { name: "a", type:"image/png" } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: { name: "a.png" } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: { name: "a", type:"audio/mpeg" } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: { name: "a.mp3" } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: [""] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "file" } },
	    "data": { a: [""] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: [null] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "file" } },
	    "data": { a: [null] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: [undefined] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, type: "file" } },
	    "data": { a: [undefined] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: [{}] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" } },
	    "data": { a: [{ name: "a.jpg" }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: [{ name: "a.jpg" }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: [{ name: "a", type:"image/jpeg" }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: [ { name:"b", type:"image/png"} ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: [
	      { name: "a", type:"image/jpeg" },
	      { name:"b", type:"image/png"}
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*", "audio/*"] } },
	    "data": { a: [
	      { name: "a", type:"image/jpeg" },
	      { name:"b", type:"image/png"},
	      { name:"c.gif"},
	      { name:"d", type:"audio/ogg"},
	      { name:"e", type:"audio/mpeg"},
	      { name:"f.mp3"}
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: [
	      {},
	      { name: "a.jpg" },
	      { name: "a.jpg" },
	      { name: "a", type:"image/jpeg" }
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: [{ name: "a", type:"image/png" }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
	    "data": { a: [{ name: "a.png" }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: [{ name: "a", type:"audio/mpeg" }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/*"] } },
	    "data": { a: [{ name: "a.mp3" }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , accept: ["image/jpeg", "audio/*"] } },
	    "data": { a: [
	      { name: "a", type:"image/png" },
	      { name: "b.png" },
	      { name: "c.js" },
	      { name: "d", type: "application/javascript"}
	    ] },
	    "test": testInvalid
	  },
	  // rule:[type=file][min]
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: { name: "a.mp3" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: { name: "a.mp3", size: 1000 } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: { name: "a.mp3", size: 0 } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: { name: "a.mp3", size: 999 } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: [{ name: "a.mp3" }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: [{ name: "a.mp3", size: 1000 }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: [{ name: "a.mp3" }, { name: "a.mp3", size: 1000 }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: [{ name: "a.mp3", size: 0 }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: [{ name: "a.mp3", size: 999 }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , min: 1000 } },
	    "data": { a: [
	      { name: "a.mp3", size: 0 },
	      { name: "a.mp3", size: 999 }
	    ] },
	    "test": testInvalid
	  },
	  // rule:[type=file][max]
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: { name: "a.mp3" } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: { name: "a.mp3", size: 1000 } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: { name: "a.mp3", size: 0 } },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: { name: "a.mp3", size: 1001 } },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: [{ name: "a.mp3" }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: [{ name: "a.mp3", size: 0 }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: [{ name: "a.mp3", size: 1000 }] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: [
	      { name: "a.mp3" },
	      { name: "a.mp3", size: 0 },
	      { name: "a.mp3", size: 1000 }
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: [{ name: "a.mp3", size: 1001 }] },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { type: "file" , max: 1000 } },
	    "data": { a: [
	      { name: "a.mp3", size: 1001 }
	    ] },
	    "test": testInvalid
	  },
	
	
	  // rule:custom function.
	  {
	    "rule": { a: { custom: null } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, custom: null } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: null } },
	    "data": { a: "whatever." },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: undefined } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, custom: undefined } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: undefined } },
	    "data": { a: "whatever." },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(){
	      return true;
	    } } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, custom: function(){
	      return true;
	    } } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(){
	      return true;
	    } } },
	    "data": { a: "whatever." },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(){
	      return false;
	    } } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, custom: function(){
	      return false;
	    } } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(){
	      return false;
	    } } },
	    "data": { a: "whatever." },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return values==="ok";
	    } } },
	    "data": { a: "" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { required: true, custom: function(values){
	      return values==="ok";
	    } } },
	    "data": { a: "" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return values==="ok";
	    } } },
	    "data": { a: "ok" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return values === "ok";
	    } } },
	    "data": { a: "whatever." },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve(true);
	        }, 100);
	      });
	    } } },
	    "data": { a: "whatever." },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve(false);
	        }, 100);
	      });
	    } } },
	    "data": { a: "whatever." },
	    "test": testInvalid
	  },
	  // 2 async function validation.
	  {
	    "rule": { a: { custom: function(values){
	      return new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve(true);
	        }, 100);
	      });
	    } },
	    b: {custom: function(values){
	      return new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve(true);
	        }, 100);
	      });
	    } } },
	    "data": { a: "whatever.", b: "something..." },
	    "test": testValid
	  },
	  // XXX: special, test invalid, rule a can-not valid.
	  //{
	    //"rule": { a: { custom: function(values){
	      //setTimeout(function(){
	        //callback(false);
	      //}, 100);
	    //} },
	    //b: {custom: function(values){
	      //setTimeout(function(){
	        //callback(true);
	      //}, 100);
	    //} } },
	    //"data": { a: "whatever.", b: "something..." },
	    //"test": testInvalid
	  //},
	  //{
	    //"rule": { a: { custom: function(values){
	      //setTimeout(function(){
	        //callback(true);
	      //}, 100);
	    //} },
	    //b: {custom: function(values){
	      //setTimeout(function(){
	        //callback(false);
	      //}, 100);
	    //} } },
	    //"data": { a: "whatever." },
	    //"test": testInvalid
	  //},
	  {
	    "rule": { a: { custom: function(values){
	      return new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve(false);
	        }, 100);
	      });
	    } },
	    b: {custom: function(values){
	      return new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve(false);
	        }, 100);
	      });
	    } } },
	    "data": { a: "whatever.", b: "something..." },
	    "test": testInvalid
	  },
	  // custom function, and multiple rule mixin.
	  {
	    "rule": { a: { custom: function(values){
	      return this.isEmail(values) || this.isMobile(values);
	    } } },
	    "data": { a: "a@b.c" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isEmail(values) || this.isMobile(values);
	    } } },
	    "data": { a: "13900000000" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      var certified = true;
	      for(var i=0,l=values.length; i<l; i++){
	        certified = certified &&
	          (this.isEmail(values[i]) || this.isMobile(values[i]));
	      }
	      return certified;
	    } } },
	    "data": { a: ["a@b.c"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      var certified = true;
	      for(var i=0,l=values.length; i<l; i++){
	        certified = certified &&
	          (this.isEmail(values[i]) || this.isMobile(values[i]));
	      }
	      return certified;
	    } } },
	    "data": { a: ["13900000000"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      var certified = true;
	      for(var i=0,l=values.length; i<l; i++){
	        certified = certified &&
	          (this.isEmail(values[i]) || this.isMobile(values[i]));
	      }
	      return certified;
	    } } },
	    "data": { a: ["a@b.c", "13900000000"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isEmail(values) || this.isMobile(values);
	    } } },
	    "data": { a: "139000000000" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: "6228480323012001315" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: ["6228480323012001315"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: ["6228480323012001315", // 农行
	      "6226095711688726", "6225885860600709", // 招行
	      "603367100131942126", // 杭州银行
	      "6225683428000243950" //广发银行
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: "139000000000" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: "6228480323012001314" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: ["6228480323012001314"] },
	    "test": testInvalid
	  },
	
	  // mobile
	  {
	    "rule": { a: { custom: function(values){
	      return values.every(function(value) {
	        return this.isMobile(value);
	      }.bind(this));
	    } } },
	    "data": { a: [
	      "13000000000", "13100000000", "13200000000", "13300000000", "13400000000",
	      "13500000000", "13600000000", "13700000000", "13800000000", "13900000000",
	      "14500000000", "14700000000",
	      "15000000000", "15100000000", "15200000000", "15300000000",
	      "15500000000", "15600000000", "15700000000", "15800000000", "15900000000",
	      "17000000000",
	      "17600000000", "17700000000", "17800000000",
	      "18000000000", "18100000000", "18200000000", "18300000000", "18400000000",
	      "18500000000", "18600000000", "18700000000", "18800000000", "18900000000",
	    ] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isMobile(values);
	    } } },
	    "data": { a: "10000000000" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values){
	      return this.isMobile(values);
	    } } },
	    "data": { a: "14000000000" },
	    "test": testInvalid
	  },
	
	];
	
	function getFunctionName(func){
	  var m = func.toString().match(/^function\s+([a-zA-Z0-9]+)/);
	  return m ? m[1] : "anonymous";
	}
	
	describe("validator", function(){
	
	  for(var i=0,l=testCases.length; i<l; i++){
	
	    var rule = testCases[i].rule;
	    var data = testCases[i].data;
	    var test = testCases[i].test;
	    var testName = test.name || getFunctionName(test);
	    var certified = testName === "testValid" ? "valid" : "invalid";
	    var desc = 'RULE:' + JSON.stringify(rule) +
	      ' ,DATA:' + JSON.stringify(data) +
	      ' :' + certified;
	
	    (function(desc, rule, data, test){
	
	      it(desc, function(done) {
	
	        var validator = new Validator(rule);
	
	        test(validator, rule, data, done);
	
	        validator.validate(data);
	
	      });
	
	    })(desc, rule, data, test);
	  }
	
	});


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// when used in node, this will actually load the util module we depend on
	// versus loading the builtin util module as happens otherwise
	// this is a bug in node module loading as far as I am concerned
	var util = __webpack_require__(32);
	
	var pSlice = Array.prototype.slice;
	var hasOwn = Object.prototype.hasOwnProperty;
	
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.
	
	var assert = module.exports = ok;
	
	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })
	
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	  else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;
	
	      // try to strip useless frames
	      var fn_name = stackStartFunction.name;
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }
	
	      this.stack = out;
	    }
	  }
	};
	
	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);
	
	function replacer(key, value) {
	  if (util.isUndefined(value)) {
	    return '' + value;
	  }
	  if (util.isNumber(value) && !isFinite(value)) {
	    return value.toString();
	  }
	  if (util.isFunction(value) || util.isRegExp(value)) {
	    return value.toString();
	  }
	  return value;
	}
	
	function truncate(s, n) {
	  if (util.isString(s)) {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	
	function getMessage(self) {
	  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(JSON.stringify(self.expected, replacer), 128);
	}
	
	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.
	
	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.
	
	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}
	
	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;
	
	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.
	
	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;
	
	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);
	
	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};
	
	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);
	
	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};
	
	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);
	
	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};
	
	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	
	  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;
	
	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }
	
	    return true;
	
	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();
	
	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;
	
	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!util.isObject(actual) && !util.isObject(expected)) {
	    return actual == expected;
	
	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}
	
	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}
	
	function objEquiv(a, b) {
	  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b)) {
	    return a === b;
	  }
	  var aIsArgs = isArguments(a),
	      bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  var ka = objectKeys(a),
	      kb = objectKeys(b),
	      key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}
	
	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);
	
	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};
	
	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);
	
	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};
	
	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
	
	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};
	
	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }
	
	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }
	
	  return false;
	}
	
	function _throws(shouldThrow, block, expected, message) {
	  var actual;
	
	  if (util.isString(expected)) {
	    message = expected;
	    expected = null;
	  }
	
	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }
	
	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');
	
	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }
	
	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }
	
	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}
	
	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);
	
	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};
	
	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};
	
	assert.ifError = function(err) { if (err) {throw err;}};
	
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 27 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * toString
	 */
	
	var str = Object.prototype.toString;
	
	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */
	
	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 29 */
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
/* 30 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
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
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(31);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(30);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(7)))

/***/ },
/* 33 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map
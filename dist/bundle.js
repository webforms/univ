this["univ"] =
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

	module.exports = __webpack_require__(20)

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
	            domain = domain || (1,__webpack_require__(9))("domain");
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
	
	var EventEmitter = __webpack_require__(22).EventEmitter;
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
	    module.exports = (1,__webpack_require__(10))("domain");
	
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
	var assert = __webpack_require__(21);
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

	var map = {
		"./asap": 1,
		"./asap.js": 1,
		"./component.json": 17,
		"./package.json": 18,
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
	webpackContext.id = 9;


/***/ },
/* 10 */
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
	webpackContext.id = 10;


/***/ },
/* 11 */,
/* 12 */
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(6)
	__webpack_require__(14)
	__webpack_require__(15)
	__webpack_require__(16)

/***/ },
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	var Promise = this.Promise || __webpack_require__(13)
	var Events = __webpack_require__(12).EventEmitter;
	var dateUtil = __webpack_require__(19);
	
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
/* 21 */
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
	var util = __webpack_require__(25);
	
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
/* 22 */
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
/* 23 */
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
/* 24 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 25 */
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
	
	exports.isBuffer = __webpack_require__(24);
	
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
	exports.inherits = __webpack_require__(23);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
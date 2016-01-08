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

	module.exports = __webpack_require__(79);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, module) {//! moment.js
	//! version : 2.6.0
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com
	
	(function (undefined) {
	
	    /************************************
	        Constants
	    ************************************/
	
	    var moment,
	        VERSION = "2.6.0",
	        // the global-scope this is NOT the global object in Node.js
	        globalScope = typeof global !== 'undefined' ? global : this,
	        oldGlobalMoment,
	        round = Math.round,
	        i,
	
	        YEAR = 0,
	        MONTH = 1,
	        DATE = 2,
	        HOUR = 3,
	        MINUTE = 4,
	        SECOND = 5,
	        MILLISECOND = 6,
	
	        // internal storage for language config files
	        languages = {},
	
	        // moment internal properties
	        momentProperties = {
	            _isAMomentObject: null,
	            _i : null,
	            _f : null,
	            _l : null,
	            _strict : null,
	            _isUTC : null,
	            _offset : null,  // optional. Combine with _isUTC
	            _pf : null,
	            _lang : null  // optional
	        },
	
	        // check for nodeJS
	        hasModule = (typeof module !== 'undefined' && module.exports),
	
	        // ASP.NET json date format regex
	        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
	        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
	
	        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,
	
	        // format tokens
	        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
	        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,
	
	        // parsing token regexes
	        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
	        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
	        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
	        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
	        parseTokenDigits = /\d+/, // nonzero number of digits
	        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
	        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
	        parseTokenT = /T/i, // T (ISO separator)
	        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
	        parseTokenOrdinal = /\d{1,2}/,
	
	        //strict parsing regexes
	        parseTokenOneDigit = /\d/, // 0 - 9
	        parseTokenTwoDigits = /\d\d/, // 00 - 99
	        parseTokenThreeDigits = /\d{3}/, // 000 - 999
	        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
	        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
	        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf
	
	        // iso 8601 regex
	        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
	
	        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',
	
	        isoDates = [
	            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
	            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
	            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
	            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
	            ['YYYY-DDD', /\d{4}-\d{3}/]
	        ],
	
	        // iso time formats and regexes
	        isoTimes = [
	            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
	            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
	            ['HH:mm', /(T| )\d\d:\d\d/],
	            ['HH', /(T| )\d\d/]
	        ],
	
	        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
	        parseTimezoneChunker = /([\+\-]|\d\d)/gi,
	
	        // getter and setter names
	        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
	        unitMillisecondFactors = {
	            'Milliseconds' : 1,
	            'Seconds' : 1e3,
	            'Minutes' : 6e4,
	            'Hours' : 36e5,
	            'Days' : 864e5,
	            'Months' : 2592e6,
	            'Years' : 31536e6
	        },
	
	        unitAliases = {
	            ms : 'millisecond',
	            s : 'second',
	            m : 'minute',
	            h : 'hour',
	            d : 'day',
	            D : 'date',
	            w : 'week',
	            W : 'isoWeek',
	            M : 'month',
	            Q : 'quarter',
	            y : 'year',
	            DDD : 'dayOfYear',
	            e : 'weekday',
	            E : 'isoWeekday',
	            gg: 'weekYear',
	            GG: 'isoWeekYear'
	        },
	
	        camelFunctions = {
	            dayofyear : 'dayOfYear',
	            isoweekday : 'isoWeekday',
	            isoweek : 'isoWeek',
	            weekyear : 'weekYear',
	            isoweekyear : 'isoWeekYear'
	        },
	
	        // format function strings
	        formatFunctions = {},
	
	        // tokens to ordinalize and pad
	        ordinalizeTokens = 'DDD w W M D d'.split(' '),
	        paddedTokens = 'M D H h m s w W'.split(' '),
	
	        formatTokenFunctions = {
	            M    : function () {
	                return this.month() + 1;
	            },
	            MMM  : function (format) {
	                return this.lang().monthsShort(this, format);
	            },
	            MMMM : function (format) {
	                return this.lang().months(this, format);
	            },
	            D    : function () {
	                return this.date();
	            },
	            DDD  : function () {
	                return this.dayOfYear();
	            },
	            d    : function () {
	                return this.day();
	            },
	            dd   : function (format) {
	                return this.lang().weekdaysMin(this, format);
	            },
	            ddd  : function (format) {
	                return this.lang().weekdaysShort(this, format);
	            },
	            dddd : function (format) {
	                return this.lang().weekdays(this, format);
	            },
	            w    : function () {
	                return this.week();
	            },
	            W    : function () {
	                return this.isoWeek();
	            },
	            YY   : function () {
	                return leftZeroFill(this.year() % 100, 2);
	            },
	            YYYY : function () {
	                return leftZeroFill(this.year(), 4);
	            },
	            YYYYY : function () {
	                return leftZeroFill(this.year(), 5);
	            },
	            YYYYYY : function () {
	                var y = this.year(), sign = y >= 0 ? '+' : '-';
	                return sign + leftZeroFill(Math.abs(y), 6);
	            },
	            gg   : function () {
	                return leftZeroFill(this.weekYear() % 100, 2);
	            },
	            gggg : function () {
	                return leftZeroFill(this.weekYear(), 4);
	            },
	            ggggg : function () {
	                return leftZeroFill(this.weekYear(), 5);
	            },
	            GG   : function () {
	                return leftZeroFill(this.isoWeekYear() % 100, 2);
	            },
	            GGGG : function () {
	                return leftZeroFill(this.isoWeekYear(), 4);
	            },
	            GGGGG : function () {
	                return leftZeroFill(this.isoWeekYear(), 5);
	            },
	            e : function () {
	                return this.weekday();
	            },
	            E : function () {
	                return this.isoWeekday();
	            },
	            a    : function () {
	                return this.lang().meridiem(this.hours(), this.minutes(), true);
	            },
	            A    : function () {
	                return this.lang().meridiem(this.hours(), this.minutes(), false);
	            },
	            H    : function () {
	                return this.hours();
	            },
	            h    : function () {
	                return this.hours() % 12 || 12;
	            },
	            m    : function () {
	                return this.minutes();
	            },
	            s    : function () {
	                return this.seconds();
	            },
	            S    : function () {
	                return toInt(this.milliseconds() / 100);
	            },
	            SS   : function () {
	                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
	            },
	            SSS  : function () {
	                return leftZeroFill(this.milliseconds(), 3);
	            },
	            SSSS : function () {
	                return leftZeroFill(this.milliseconds(), 3);
	            },
	            Z    : function () {
	                var a = -this.zone(),
	                    b = "+";
	                if (a < 0) {
	                    a = -a;
	                    b = "-";
	                }
	                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
	            },
	            ZZ   : function () {
	                var a = -this.zone(),
	                    b = "+";
	                if (a < 0) {
	                    a = -a;
	                    b = "-";
	                }
	                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
	            },
	            z : function () {
	                return this.zoneAbbr();
	            },
	            zz : function () {
	                return this.zoneName();
	            },
	            X    : function () {
	                return this.unix();
	            },
	            Q : function () {
	                return this.quarter();
	            }
	        },
	
	        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];
	
	    // Pick the first defined of two or three arguments. dfl comes from
	    // default.
	    function dfl(a, b, c) {
	        switch (arguments.length) {
	            case 2: return a != null ? a : b;
	            case 3: return a != null ? a : b != null ? b : c;
	            default: throw new Error("Implement me");
	        }
	    }
	
	    function defaultParsingFlags() {
	        // We need to deep clone this object, and es5 standard is not very
	        // helpful.
	        return {
	            empty : false,
	            unusedTokens : [],
	            unusedInput : [],
	            overflow : -2,
	            charsLeftOver : 0,
	            nullInput : false,
	            invalidMonth : null,
	            invalidFormat : false,
	            userInvalidated : false,
	            iso: false
	        };
	    }
	
	    function deprecate(msg, fn) {
	        var firstTime = true;
	        function printMsg() {
	            if (moment.suppressDeprecationWarnings === false &&
	                    typeof console !== 'undefined' && console.warn) {
	                console.warn("Deprecation warning: " + msg);
	            }
	        }
	        return extend(function () {
	            if (firstTime) {
	                printMsg();
	                firstTime = false;
	            }
	            return fn.apply(this, arguments);
	        }, fn);
	    }
	
	    function padToken(func, count) {
	        return function (a) {
	            return leftZeroFill(func.call(this, a), count);
	        };
	    }
	    function ordinalizeToken(func, period) {
	        return function (a) {
	            return this.lang().ordinal(func.call(this, a), period);
	        };
	    }
	
	    while (ordinalizeTokens.length) {
	        i = ordinalizeTokens.pop();
	        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
	    }
	    while (paddedTokens.length) {
	        i = paddedTokens.pop();
	        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
	    }
	    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
	
	
	    /************************************
	        Constructors
	    ************************************/
	
	    function Language() {
	
	    }
	
	    // Moment prototype object
	    function Moment(config) {
	        checkOverflow(config);
	        extend(this, config);
	    }
	
	    // Duration Constructor
	    function Duration(duration) {
	        var normalizedInput = normalizeObjectUnits(duration),
	            years = normalizedInput.year || 0,
	            quarters = normalizedInput.quarter || 0,
	            months = normalizedInput.month || 0,
	            weeks = normalizedInput.week || 0,
	            days = normalizedInput.day || 0,
	            hours = normalizedInput.hour || 0,
	            minutes = normalizedInput.minute || 0,
	            seconds = normalizedInput.second || 0,
	            milliseconds = normalizedInput.millisecond || 0;
	
	        // representation for dateAddRemove
	        this._milliseconds = +milliseconds +
	            seconds * 1e3 + // 1000
	            minutes * 6e4 + // 1000 * 60
	            hours * 36e5; // 1000 * 60 * 60
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = +days +
	            weeks * 7;
	        // It is impossible translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = +months +
	            quarters * 3 +
	            years * 12;
	
	        this._data = {};
	
	        this._bubble();
	    }
	
	    /************************************
	        Helpers
	    ************************************/
	
	
	    function extend(a, b) {
	        for (var i in b) {
	            if (b.hasOwnProperty(i)) {
	                a[i] = b[i];
	            }
	        }
	
	        if (b.hasOwnProperty("toString")) {
	            a.toString = b.toString;
	        }
	
	        if (b.hasOwnProperty("valueOf")) {
	            a.valueOf = b.valueOf;
	        }
	
	        return a;
	    }
	
	    function cloneMoment(m) {
	        var result = {}, i;
	        for (i in m) {
	            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
	                result[i] = m[i];
	            }
	        }
	
	        return result;
	    }
	
	    function absRound(number) {
	        if (number < 0) {
	            return Math.ceil(number);
	        } else {
	            return Math.floor(number);
	        }
	    }
	
	    // left zero fill a number
	    // see http://jsperf.com/left-zero-filling for performance comparison
	    function leftZeroFill(number, targetLength, forceSign) {
	        var output = '' + Math.abs(number),
	            sign = number >= 0;
	
	        while (output.length < targetLength) {
	            output = '0' + output;
	        }
	        return (sign ? (forceSign ? '+' : '') : '-') + output;
	    }
	
	    // helper function for _.addTime and _.subtractTime
	    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
	        var milliseconds = duration._milliseconds,
	            days = duration._days,
	            months = duration._months;
	        updateOffset = updateOffset == null ? true : updateOffset;
	
	        if (milliseconds) {
	            mom._d.setTime(+mom._d + milliseconds * isAdding);
	        }
	        if (days) {
	            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
	        }
	        if (months) {
	            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
	        }
	        if (updateOffset) {
	            moment.updateOffset(mom, days || months);
	        }
	    }
	
	    // check if is an array
	    function isArray(input) {
	        return Object.prototype.toString.call(input) === '[object Array]';
	    }
	
	    function isDate(input) {
	        return  Object.prototype.toString.call(input) === '[object Date]' ||
	                input instanceof Date;
	    }
	
	    // compare two arrays, return the number of differences
	    function compareArrays(array1, array2, dontConvert) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if ((dontConvert && array1[i] !== array2[i]) ||
	                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }
	
	    function normalizeUnits(units) {
	        if (units) {
	            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
	            units = unitAliases[units] || camelFunctions[lowered] || lowered;
	        }
	        return units;
	    }
	
	    function normalizeObjectUnits(inputObject) {
	        var normalizedInput = {},
	            normalizedProp,
	            prop;
	
	        for (prop in inputObject) {
	            if (inputObject.hasOwnProperty(prop)) {
	                normalizedProp = normalizeUnits(prop);
	                if (normalizedProp) {
	                    normalizedInput[normalizedProp] = inputObject[prop];
	                }
	            }
	        }
	
	        return normalizedInput;
	    }
	
	    function makeList(field) {
	        var count, setter;
	
	        if (field.indexOf('week') === 0) {
	            count = 7;
	            setter = 'day';
	        }
	        else if (field.indexOf('month') === 0) {
	            count = 12;
	            setter = 'month';
	        }
	        else {
	            return;
	        }
	
	        moment[field] = function (format, index) {
	            var i, getter,
	                method = moment.fn._lang[field],
	                results = [];
	
	            if (typeof format === 'number') {
	                index = format;
	                format = undefined;
	            }
	
	            getter = function (i) {
	                var m = moment().utc().set(setter, i);
	                return method.call(moment.fn._lang, m, format || '');
	            };
	
	            if (index != null) {
	                return getter(index);
	            }
	            else {
	                for (i = 0; i < count; i++) {
	                    results.push(getter(i));
	                }
	                return results;
	            }
	        };
	    }
	
	    function toInt(argumentForCoercion) {
	        var coercedNumber = +argumentForCoercion,
	            value = 0;
	
	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	            if (coercedNumber >= 0) {
	                value = Math.floor(coercedNumber);
	            } else {
	                value = Math.ceil(coercedNumber);
	            }
	        }
	
	        return value;
	    }
	
	    function daysInMonth(year, month) {
	        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	    }
	
	    function weeksInYear(year, dow, doy) {
	        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
	    }
	
	    function daysInYear(year) {
	        return isLeapYear(year) ? 366 : 365;
	    }
	
	    function isLeapYear(year) {
	        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	    }
	
	    function checkOverflow(m) {
	        var overflow;
	        if (m._a && m._pf.overflow === -2) {
	            overflow =
	                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
	                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
	                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
	                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
	                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
	                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
	                -1;
	
	            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	                overflow = DATE;
	            }
	
	            m._pf.overflow = overflow;
	        }
	    }
	
	    function isValid(m) {
	        if (m._isValid == null) {
	            m._isValid = !isNaN(m._d.getTime()) &&
	                m._pf.overflow < 0 &&
	                !m._pf.empty &&
	                !m._pf.invalidMonth &&
	                !m._pf.nullInput &&
	                !m._pf.invalidFormat &&
	                !m._pf.userInvalidated;
	
	            if (m._strict) {
	                m._isValid = m._isValid &&
	                    m._pf.charsLeftOver === 0 &&
	                    m._pf.unusedTokens.length === 0;
	            }
	        }
	        return m._isValid;
	    }
	
	    function normalizeLanguage(key) {
	        return key ? key.toLowerCase().replace('_', '-') : key;
	    }
	
	    // Return a moment from input, that is local/utc/zone equivalent to model.
	    function makeAs(input, model) {
	        return model._isUTC ? moment(input).zone(model._offset || 0) :
	            moment(input).local();
	    }
	
	    /************************************
	        Languages
	    ************************************/
	
	
	    extend(Language.prototype, {
	
	        set : function (config) {
	            var prop, i;
	            for (i in config) {
	                prop = config[i];
	                if (typeof prop === 'function') {
	                    this[i] = prop;
	                } else {
	                    this['_' + i] = prop;
	                }
	            }
	        },
	
	        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	        months : function (m) {
	            return this._months[m.month()];
	        },
	
	        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	        monthsShort : function (m) {
	            return this._monthsShort[m.month()];
	        },
	
	        monthsParse : function (monthName) {
	            var i, mom, regex;
	
	            if (!this._monthsParse) {
	                this._monthsParse = [];
	            }
	
	            for (i = 0; i < 12; i++) {
	                // make the regex if we don't have it already
	                if (!this._monthsParse[i]) {
	                    mom = moment.utc([2000, i]);
	                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	                }
	                // test the regex
	                if (this._monthsParse[i].test(monthName)) {
	                    return i;
	                }
	            }
	        },
	
	        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	        weekdays : function (m) {
	            return this._weekdays[m.day()];
	        },
	
	        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	        weekdaysShort : function (m) {
	            return this._weekdaysShort[m.day()];
	        },
	
	        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	        weekdaysMin : function (m) {
	            return this._weekdaysMin[m.day()];
	        },
	
	        weekdaysParse : function (weekdayName) {
	            var i, mom, regex;
	
	            if (!this._weekdaysParse) {
	                this._weekdaysParse = [];
	            }
	
	            for (i = 0; i < 7; i++) {
	                // make the regex if we don't have it already
	                if (!this._weekdaysParse[i]) {
	                    mom = moment([2000, 1]).day(i);
	                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	                }
	                // test the regex
	                if (this._weekdaysParse[i].test(weekdayName)) {
	                    return i;
	                }
	            }
	        },
	
	        _longDateFormat : {
	            LT : "h:mm A",
	            L : "MM/DD/YYYY",
	            LL : "MMMM D YYYY",
	            LLL : "MMMM D YYYY LT",
	            LLLL : "dddd, MMMM D YYYY LT"
	        },
	        longDateFormat : function (key) {
	            var output = this._longDateFormat[key];
	            if (!output && this._longDateFormat[key.toUpperCase()]) {
	                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
	                    return val.slice(1);
	                });
	                this._longDateFormat[key] = output;
	            }
	            return output;
	        },
	
	        isPM : function (input) {
	            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	            // Using charAt should be more compatible.
	            return ((input + '').toLowerCase().charAt(0) === 'p');
	        },
	
	        _meridiemParse : /[ap]\.?m?\.?/i,
	        meridiem : function (hours, minutes, isLower) {
	            if (hours > 11) {
	                return isLower ? 'pm' : 'PM';
	            } else {
	                return isLower ? 'am' : 'AM';
	            }
	        },
	
	        _calendar : {
	            sameDay : '[Today at] LT',
	            nextDay : '[Tomorrow at] LT',
	            nextWeek : 'dddd [at] LT',
	            lastDay : '[Yesterday at] LT',
	            lastWeek : '[Last] dddd [at] LT',
	            sameElse : 'L'
	        },
	        calendar : function (key, mom) {
	            var output = this._calendar[key];
	            return typeof output === 'function' ? output.apply(mom) : output;
	        },
	
	        _relativeTime : {
	            future : "in %s",
	            past : "%s ago",
	            s : "a few seconds",
	            m : "a minute",
	            mm : "%d minutes",
	            h : "an hour",
	            hh : "%d hours",
	            d : "a day",
	            dd : "%d days",
	            M : "a month",
	            MM : "%d months",
	            y : "a year",
	            yy : "%d years"
	        },
	        relativeTime : function (number, withoutSuffix, string, isFuture) {
	            var output = this._relativeTime[string];
	            return (typeof output === 'function') ?
	                output(number, withoutSuffix, string, isFuture) :
	                output.replace(/%d/i, number);
	        },
	        pastFuture : function (diff, output) {
	            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
	        },
	
	        ordinal : function (number) {
	            return this._ordinal.replace("%d", number);
	        },
	        _ordinal : "%d",
	
	        preparse : function (string) {
	            return string;
	        },
	
	        postformat : function (string) {
	            return string;
	        },
	
	        week : function (mom) {
	            return weekOfYear(mom, this._week.dow, this._week.doy).week;
	        },
	
	        _week : {
	            dow : 0, // Sunday is the first day of the week.
	            doy : 6  // The week that contains Jan 1st is the first week of the year.
	        },
	
	        _invalidDate: 'Invalid date',
	        invalidDate: function () {
	            return this._invalidDate;
	        }
	    });
	
	    // Loads a language definition into the `languages` cache.  The function
	    // takes a key and optionally values.  If not in the browser and no values
	    // are provided, it will load the language file module.  As a convenience,
	    // this function also returns the language values.
	    function loadLang(key, values) {
	        values.abbr = key;
	        if (!languages[key]) {
	            languages[key] = new Language();
	        }
	        languages[key].set(values);
	        return languages[key];
	    }
	
	    // Remove a language from the `languages` cache. Mostly useful in tests.
	    function unloadLang(key) {
	        delete languages[key];
	    }
	
	    // Determines which language definition to use and returns it.
	    //
	    // With no parameters, it will return the global language.  If you
	    // pass in a language key, such as 'en', it will return the
	    // definition for 'en', so long as 'en' has already been loaded using
	    // moment.lang.
	    function getLangDefinition(key) {
	        var i = 0, j, lang, next, split,
	            get = function (k) {
	                if (!languages[k] && hasModule) {
	                    try {
	                        __webpack_require__(77)("./" + k);
	                    } catch (e) { }
	                }
	                return languages[k];
	            };
	
	        if (!key) {
	            return moment.fn._lang;
	        }
	
	        if (!isArray(key)) {
	            //short-circuit everything else
	            lang = get(key);
	            if (lang) {
	                return lang;
	            }
	            key = [key];
	        }
	
	        //pick the language from the array
	        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	        while (i < key.length) {
	            split = normalizeLanguage(key[i]).split('-');
	            j = split.length;
	            next = normalizeLanguage(key[i + 1]);
	            next = next ? next.split('-') : null;
	            while (j > 0) {
	                lang = get(split.slice(0, j).join('-'));
	                if (lang) {
	                    return lang;
	                }
	                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                    //the next array item is better than a shallower substring of this one
	                    break;
	                }
	                j--;
	            }
	            i++;
	        }
	        return moment.fn._lang;
	    }
	
	    /************************************
	        Formatting
	    ************************************/
	
	
	    function removeFormattingTokens(input) {
	        if (input.match(/\[[\s\S]/)) {
	            return input.replace(/^\[|\]$/g, "");
	        }
	        return input.replace(/\\/g, "");
	    }
	
	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens), i, length;
	
	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }
	
	        return function (mom) {
	            var output = "";
	            for (i = 0; i < length; i++) {
	                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
	            }
	            return output;
	        };
	    }
	
	    // format date using native date object
	    function formatMoment(m, format) {
	
	        if (!m.isValid()) {
	            return m.lang().invalidDate();
	        }
	
	        format = expandFormat(format, m.lang());
	
	        if (!formatFunctions[format]) {
	            formatFunctions[format] = makeFormatFunction(format);
	        }
	
	        return formatFunctions[format](m);
	    }
	
	    function expandFormat(format, lang) {
	        var i = 5;
	
	        function replaceLongDateFormatTokens(input) {
	            return lang.longDateFormat(input) || input;
	        }
	
	        localFormattingTokens.lastIndex = 0;
	        while (i >= 0 && localFormattingTokens.test(format)) {
	            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	            localFormattingTokens.lastIndex = 0;
	            i -= 1;
	        }
	
	        return format;
	    }
	
	
	    /************************************
	        Parsing
	    ************************************/
	
	
	    // get the regex to find the next token
	    function getParseRegexForToken(token, config) {
	        var a, strict = config._strict;
	        switch (token) {
	        case 'Q':
	            return parseTokenOneDigit;
	        case 'DDDD':
	            return parseTokenThreeDigits;
	        case 'YYYY':
	        case 'GGGG':
	        case 'gggg':
	            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
	        case 'Y':
	        case 'G':
	        case 'g':
	            return parseTokenSignedNumber;
	        case 'YYYYYY':
	        case 'YYYYY':
	        case 'GGGGG':
	        case 'ggggg':
	            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
	        case 'S':
	            if (strict) { return parseTokenOneDigit; }
	            /* falls through */
	        case 'SS':
	            if (strict) { return parseTokenTwoDigits; }
	            /* falls through */
	        case 'SSS':
	            if (strict) { return parseTokenThreeDigits; }
	            /* falls through */
	        case 'DDD':
	            return parseTokenOneToThreeDigits;
	        case 'MMM':
	        case 'MMMM':
	        case 'dd':
	        case 'ddd':
	        case 'dddd':
	            return parseTokenWord;
	        case 'a':
	        case 'A':
	            return getLangDefinition(config._l)._meridiemParse;
	        case 'X':
	            return parseTokenTimestampMs;
	        case 'Z':
	        case 'ZZ':
	            return parseTokenTimezone;
	        case 'T':
	            return parseTokenT;
	        case 'SSSS':
	            return parseTokenDigits;
	        case 'MM':
	        case 'DD':
	        case 'YY':
	        case 'GG':
	        case 'gg':
	        case 'HH':
	        case 'hh':
	        case 'mm':
	        case 'ss':
	        case 'ww':
	        case 'WW':
	            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
	        case 'M':
	        case 'D':
	        case 'd':
	        case 'H':
	        case 'h':
	        case 'm':
	        case 's':
	        case 'w':
	        case 'W':
	        case 'e':
	        case 'E':
	            return parseTokenOneOrTwoDigits;
	        case 'Do':
	            return parseTokenOrdinal;
	        default :
	            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
	            return a;
	        }
	    }
	
	    function timezoneMinutesFromString(string) {
	        string = string || "";
	        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
	            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
	            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
	            minutes = +(parts[1] * 60) + toInt(parts[2]);
	
	        return parts[0] === '+' ? -minutes : minutes;
	    }
	
	    // function to convert string input to date
	    function addTimeToArrayFromToken(token, input, config) {
	        var a, datePartArray = config._a;
	
	        switch (token) {
	        // QUARTER
	        case 'Q':
	            if (input != null) {
	                datePartArray[MONTH] = (toInt(input) - 1) * 3;
	            }
	            break;
	        // MONTH
	        case 'M' : // fall through to MM
	        case 'MM' :
	            if (input != null) {
	                datePartArray[MONTH] = toInt(input) - 1;
	            }
	            break;
	        case 'MMM' : // fall through to MMMM
	        case 'MMMM' :
	            a = getLangDefinition(config._l).monthsParse(input);
	            // if we didn't find a month name, mark the date as invalid.
	            if (a != null) {
	                datePartArray[MONTH] = a;
	            } else {
	                config._pf.invalidMonth = input;
	            }
	            break;
	        // DAY OF MONTH
	        case 'D' : // fall through to DD
	        case 'DD' :
	            if (input != null) {
	                datePartArray[DATE] = toInt(input);
	            }
	            break;
	        case 'Do' :
	            if (input != null) {
	                datePartArray[DATE] = toInt(parseInt(input, 10));
	            }
	            break;
	        // DAY OF YEAR
	        case 'DDD' : // fall through to DDDD
	        case 'DDDD' :
	            if (input != null) {
	                config._dayOfYear = toInt(input);
	            }
	
	            break;
	        // YEAR
	        case 'YY' :
	            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
	            break;
	        case 'YYYY' :
	        case 'YYYYY' :
	        case 'YYYYYY' :
	            datePartArray[YEAR] = toInt(input);
	            break;
	        // AM / PM
	        case 'a' : // fall through to A
	        case 'A' :
	            config._isPm = getLangDefinition(config._l).isPM(input);
	            break;
	        // 24 HOUR
	        case 'H' : // fall through to hh
	        case 'HH' : // fall through to hh
	        case 'h' : // fall through to hh
	        case 'hh' :
	            datePartArray[HOUR] = toInt(input);
	            break;
	        // MINUTE
	        case 'm' : // fall through to mm
	        case 'mm' :
	            datePartArray[MINUTE] = toInt(input);
	            break;
	        // SECOND
	        case 's' : // fall through to ss
	        case 'ss' :
	            datePartArray[SECOND] = toInt(input);
	            break;
	        // MILLISECOND
	        case 'S' :
	        case 'SS' :
	        case 'SSS' :
	        case 'SSSS' :
	            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
	            break;
	        // UNIX TIMESTAMP WITH MS
	        case 'X':
	            config._d = new Date(parseFloat(input) * 1000);
	            break;
	        // TIMEZONE
	        case 'Z' : // fall through to ZZ
	        case 'ZZ' :
	            config._useUTC = true;
	            config._tzm = timezoneMinutesFromString(input);
	            break;
	        // WEEKDAY - human
	        case 'dd':
	        case 'ddd':
	        case 'dddd':
	            a = getLangDefinition(config._l).weekdaysParse(input);
	            // if we didn't get a weekday name, mark the date as invalid
	            if (a != null) {
	                config._w = config._w || {};
	                config._w['d'] = a;
	            } else {
	                config._pf.invalidWeekday = input;
	            }
	            break;
	        // WEEK, WEEK DAY - numeric
	        case 'w':
	        case 'ww':
	        case 'W':
	        case 'WW':
	        case 'd':
	        case 'e':
	        case 'E':
	            token = token.substr(0, 1);
	            /* falls through */
	        case 'gggg':
	        case 'GGGG':
	        case 'GGGGG':
	            token = token.substr(0, 2);
	            if (input) {
	                config._w = config._w || {};
	                config._w[token] = toInt(input);
	            }
	            break;
	        case 'gg':
	        case 'GG':
	            config._w = config._w || {};
	            config._w[token] = moment.parseTwoDigitYear(input);
	        }
	    }
	
	    function dayOfYearFromWeekInfo(config) {
	        var w, weekYear, week, weekday, dow, doy, temp, lang;
	
	        w = config._w;
	        if (w.GG != null || w.W != null || w.E != null) {
	            dow = 1;
	            doy = 4;
	
	            // TODO: We need to take the current isoWeekYear, but that depends on
	            // how we interpret now (local, utc, fixed offset). So create
	            // a now version of current config (take local/utc/offset flags, and
	            // create now).
	            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
	            week = dfl(w.W, 1);
	            weekday = dfl(w.E, 1);
	        } else {
	            lang = getLangDefinition(config._l);
	            dow = lang._week.dow;
	            doy = lang._week.doy;
	
	            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
	            week = dfl(w.w, 1);
	
	            if (w.d != null) {
	                // weekday -- low day numbers are considered next week
	                weekday = w.d;
	                if (weekday < dow) {
	                    ++week;
	                }
	            } else if (w.e != null) {
	                // local weekday -- counting starts from begining of week
	                weekday = w.e + dow;
	            } else {
	                // default to begining of week
	                weekday = dow;
	            }
	        }
	        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);
	
	        config._a[YEAR] = temp.year;
	        config._dayOfYear = temp.dayOfYear;
	    }
	
	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function dateFromConfig(config) {
	        var i, date, input = [], currentDate, yearToUse;
	
	        if (config._d) {
	            return;
	        }
	
	        currentDate = currentDateArray(config);
	
	        //compute day of the year from weeks and weekdays
	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	            dayOfYearFromWeekInfo(config);
	        }
	
	        //if the day of the year is set, figure out what it is
	        if (config._dayOfYear) {
	            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);
	
	            if (config._dayOfYear > daysInYear(yearToUse)) {
	                config._pf._overflowDayOfYear = true;
	            }
	
	            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
	            config._a[MONTH] = date.getUTCMonth();
	            config._a[DATE] = date.getUTCDate();
	        }
	
	        // Default to current date.
	        // * if no year, month, day of month are given, default to today
	        // * if day of month is given, default month and year
	        // * if month is given, default only year
	        // * if year is given, don't default anything
	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
	            config._a[i] = input[i] = currentDate[i];
	        }
	
	        // Zero out whatever was not defaulted, including time
	        for (; i < 7; i++) {
	            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	        }
	
	        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
	        input[HOUR] += toInt((config._tzm || 0) / 60);
	        input[MINUTE] += toInt((config._tzm || 0) % 60);
	
	        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
	    }
	
	    function dateFromObject(config) {
	        var normalizedInput;
	
	        if (config._d) {
	            return;
	        }
	
	        normalizedInput = normalizeObjectUnits(config._i);
	        config._a = [
	            normalizedInput.year,
	            normalizedInput.month,
	            normalizedInput.day,
	            normalizedInput.hour,
	            normalizedInput.minute,
	            normalizedInput.second,
	            normalizedInput.millisecond
	        ];
	
	        dateFromConfig(config);
	    }
	
	    function currentDateArray(config) {
	        var now = new Date();
	        if (config._useUTC) {
	            return [
	                now.getUTCFullYear(),
	                now.getUTCMonth(),
	                now.getUTCDate()
	            ];
	        } else {
	            return [now.getFullYear(), now.getMonth(), now.getDate()];
	        }
	    }
	
	    // date from string and format string
	    function makeDateFromStringAndFormat(config) {
	
	        config._a = [];
	        config._pf.empty = true;
	
	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var lang = getLangDefinition(config._l),
	            string = '' + config._i,
	            i, parsedInput, tokens, token, skipped,
	            stringLength = string.length,
	            totalParsedInputLength = 0;
	
	        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];
	
	        for (i = 0; i < tokens.length; i++) {
	            token = tokens[i];
	            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	            if (parsedInput) {
	                skipped = string.substr(0, string.indexOf(parsedInput));
	                if (skipped.length > 0) {
	                    config._pf.unusedInput.push(skipped);
	                }
	                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	                totalParsedInputLength += parsedInput.length;
	            }
	            // don't parse if it's not a known token
	            if (formatTokenFunctions[token]) {
	                if (parsedInput) {
	                    config._pf.empty = false;
	                }
	                else {
	                    config._pf.unusedTokens.push(token);
	                }
	                addTimeToArrayFromToken(token, parsedInput, config);
	            }
	            else if (config._strict && !parsedInput) {
	                config._pf.unusedTokens.push(token);
	            }
	        }
	
	        // add remaining unparsed input length to the string
	        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
	        if (string.length > 0) {
	            config._pf.unusedInput.push(string);
	        }
	
	        // handle am pm
	        if (config._isPm && config._a[HOUR] < 12) {
	            config._a[HOUR] += 12;
	        }
	        // if is 12 am, change hours to 0
	        if (config._isPm === false && config._a[HOUR] === 12) {
	            config._a[HOUR] = 0;
	        }
	
	        dateFromConfig(config);
	        checkOverflow(config);
	    }
	
	    function unescapeFormat(s) {
	        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	            return p1 || p2 || p3 || p4;
	        });
	    }
	
	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	    function regexpEscape(s) {
	        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }
	
	    // date from string and array of format strings
	    function makeDateFromStringAndArray(config) {
	        var tempConfig,
	            bestMoment,
	
	            scoreToBeat,
	            i,
	            currentScore;
	
	        if (config._f.length === 0) {
	            config._pf.invalidFormat = true;
	            config._d = new Date(NaN);
	            return;
	        }
	
	        for (i = 0; i < config._f.length; i++) {
	            currentScore = 0;
	            tempConfig = extend({}, config);
	            tempConfig._pf = defaultParsingFlags();
	            tempConfig._f = config._f[i];
	            makeDateFromStringAndFormat(tempConfig);
	
	            if (!isValid(tempConfig)) {
	                continue;
	            }
	
	            // if there is any input that was not parsed add a penalty for that format
	            currentScore += tempConfig._pf.charsLeftOver;
	
	            //or tokens
	            currentScore += tempConfig._pf.unusedTokens.length * 10;
	
	            tempConfig._pf.score = currentScore;
	
	            if (scoreToBeat == null || currentScore < scoreToBeat) {
	                scoreToBeat = currentScore;
	                bestMoment = tempConfig;
	            }
	        }
	
	        extend(config, bestMoment || tempConfig);
	    }
	
	    // date from iso format
	    function makeDateFromString(config) {
	        var i, l,
	            string = config._i,
	            match = isoRegex.exec(string);
	
	        if (match) {
	            config._pf.iso = true;
	            for (i = 0, l = isoDates.length; i < l; i++) {
	                if (isoDates[i][1].exec(string)) {
	                    // match[5] should be "T" or undefined
	                    config._f = isoDates[i][0] + (match[6] || " ");
	                    break;
	                }
	            }
	            for (i = 0, l = isoTimes.length; i < l; i++) {
	                if (isoTimes[i][1].exec(string)) {
	                    config._f += isoTimes[i][0];
	                    break;
	                }
	            }
	            if (string.match(parseTokenTimezone)) {
	                config._f += "Z";
	            }
	            makeDateFromStringAndFormat(config);
	        }
	        else {
	            moment.createFromInputFallback(config);
	        }
	    }
	
	    function makeDateFromInput(config) {
	        var input = config._i,
	            matched = aspNetJsonRegex.exec(input);
	
	        if (input === undefined) {
	            config._d = new Date();
	        } else if (matched) {
	            config._d = new Date(+matched[1]);
	        } else if (typeof input === 'string') {
	            makeDateFromString(config);
	        } else if (isArray(input)) {
	            config._a = input.slice(0);
	            dateFromConfig(config);
	        } else if (isDate(input)) {
	            config._d = new Date(+input);
	        } else if (typeof(input) === 'object') {
	            dateFromObject(config);
	        } else if (typeof(input) === 'number') {
	            // from milliseconds
	            config._d = new Date(input);
	        } else {
	            moment.createFromInputFallback(config);
	        }
	    }
	
	    function makeDate(y, m, d, h, M, s, ms) {
	        //can't just apply() to create a date:
	        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	        var date = new Date(y, m, d, h, M, s, ms);
	
	        //the date constructor doesn't accept years < 1970
	        if (y < 1970) {
	            date.setFullYear(y);
	        }
	        return date;
	    }
	
	    function makeUTCDate(y) {
	        var date = new Date(Date.UTC.apply(null, arguments));
	        if (y < 1970) {
	            date.setUTCFullYear(y);
	        }
	        return date;
	    }
	
	    function parseWeekday(input, language) {
	        if (typeof input === 'string') {
	            if (!isNaN(input)) {
	                input = parseInt(input, 10);
	            }
	            else {
	                input = language.weekdaysParse(input);
	                if (typeof input !== 'number') {
	                    return null;
	                }
	            }
	        }
	        return input;
	    }
	
	    /************************************
	        Relative Time
	    ************************************/
	
	
	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
	        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }
	
	    function relativeTime(milliseconds, withoutSuffix, lang) {
	        var seconds = round(Math.abs(milliseconds) / 1000),
	            minutes = round(seconds / 60),
	            hours = round(minutes / 60),
	            days = round(hours / 24),
	            years = round(days / 365),
	            args = seconds < 45 && ['s', seconds] ||
	                minutes === 1 && ['m'] ||
	                minutes < 45 && ['mm', minutes] ||
	                hours === 1 && ['h'] ||
	                hours < 22 && ['hh', hours] ||
	                days === 1 && ['d'] ||
	                days <= 25 && ['dd', days] ||
	                days <= 45 && ['M'] ||
	                days < 345 && ['MM', round(days / 30)] ||
	                years === 1 && ['y'] || ['yy', years];
	        args[2] = withoutSuffix;
	        args[3] = milliseconds > 0;
	        args[4] = lang;
	        return substituteTimeAgo.apply({}, args);
	    }
	
	
	    /************************************
	        Week of Year
	    ************************************/
	
	
	    // firstDayOfWeek       0 = sun, 6 = sat
	    //                      the day of the week that starts the week
	    //                      (usually sunday or monday)
	    // firstDayOfWeekOfYear 0 = sun, 6 = sat
	    //                      the first week is the week that contains the first
	    //                      of this day of the week
	    //                      (eg. ISO weeks use thursday (4))
	    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
	        var end = firstDayOfWeekOfYear - firstDayOfWeek,
	            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
	            adjustedMoment;
	
	
	        if (daysToDayOfWeek > end) {
	            daysToDayOfWeek -= 7;
	        }
	
	        if (daysToDayOfWeek < end - 7) {
	            daysToDayOfWeek += 7;
	        }
	
	        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
	        return {
	            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
	            year: adjustedMoment.year()
	        };
	    }
	
	    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
	        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;
	
	        d = d === 0 ? 7 : d;
	        weekday = weekday != null ? weekday : firstDayOfWeek;
	        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
	        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;
	
	        return {
	            year: dayOfYear > 0 ? year : year - 1,
	            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
	        };
	    }
	
	    /************************************
	        Top Level Functions
	    ************************************/
	
	    function makeMoment(config) {
	        var input = config._i,
	            format = config._f;
	
	        if (input === null || (format === undefined && input === '')) {
	            return moment.invalid({nullInput: true});
	        }
	
	        if (typeof input === 'string') {
	            config._i = input = getLangDefinition().preparse(input);
	        }
	
	        if (moment.isMoment(input)) {
	            config = cloneMoment(input);
	
	            config._d = new Date(+input._d);
	        } else if (format) {
	            if (isArray(format)) {
	                makeDateFromStringAndArray(config);
	            } else {
	                makeDateFromStringAndFormat(config);
	            }
	        } else {
	            makeDateFromInput(config);
	        }
	
	        return new Moment(config);
	    }
	
	    moment = function (input, format, lang, strict) {
	        var c;
	
	        if (typeof(lang) === "boolean") {
	            strict = lang;
	            lang = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c = {};
	        c._isAMomentObject = true;
	        c._i = input;
	        c._f = format;
	        c._l = lang;
	        c._strict = strict;
	        c._isUTC = false;
	        c._pf = defaultParsingFlags();
	
	        return makeMoment(c);
	    };
	
	    moment.suppressDeprecationWarnings = false;
	
	    moment.createFromInputFallback = deprecate(
	            "moment construction falls back to js Date. This is " +
	            "discouraged and will be removed in upcoming major " +
	            "release. Please refer to " +
	            "https://github.com/moment/moment/issues/1407 for more info.",
	            function (config) {
	        config._d = new Date(config._i);
	    });
	
	    // Pick a moment m from moments so that m[fn](other) is true for all
	    // other. This relies on the function fn to be transitive.
	    //
	    // moments should either be an array of moment objects or an array, whose
	    // first element is an array of moment objects.
	    function pickBy(fn, moments) {
	        var res, i;
	        if (moments.length === 1 && isArray(moments[0])) {
	            moments = moments[0];
	        }
	        if (!moments.length) {
	            return moment();
	        }
	        res = moments[0];
	        for (i = 1; i < moments.length; ++i) {
	            if (moments[i][fn](res)) {
	                res = moments[i];
	            }
	        }
	        return res;
	    }
	
	    moment.min = function () {
	        var args = [].slice.call(arguments, 0);
	
	        return pickBy('isBefore', args);
	    };
	
	    moment.max = function () {
	        var args = [].slice.call(arguments, 0);
	
	        return pickBy('isAfter', args);
	    };
	
	    // creating with utc
	    moment.utc = function (input, format, lang, strict) {
	        var c;
	
	        if (typeof(lang) === "boolean") {
	            strict = lang;
	            lang = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c = {};
	        c._isAMomentObject = true;
	        c._useUTC = true;
	        c._isUTC = true;
	        c._l = lang;
	        c._i = input;
	        c._f = format;
	        c._strict = strict;
	        c._pf = defaultParsingFlags();
	
	        return makeMoment(c).utc();
	    };
	
	    // creating with unix timestamp (in seconds)
	    moment.unix = function (input) {
	        return moment(input * 1000);
	    };
	
	    // duration
	    moment.duration = function (input, key) {
	        var duration = input,
	            // matching against regexp is expensive, do it on demand
	            match = null,
	            sign,
	            ret,
	            parseIso;
	
	        if (moment.isDuration(input)) {
	            duration = {
	                ms: input._milliseconds,
	                d: input._days,
	                M: input._months
	            };
	        } else if (typeof input === 'number') {
	            duration = {};
	            if (key) {
	                duration[key] = input;
	            } else {
	                duration.milliseconds = input;
	            }
	        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
	            sign = (match[1] === "-") ? -1 : 1;
	            duration = {
	                y: 0,
	                d: toInt(match[DATE]) * sign,
	                h: toInt(match[HOUR]) * sign,
	                m: toInt(match[MINUTE]) * sign,
	                s: toInt(match[SECOND]) * sign,
	                ms: toInt(match[MILLISECOND]) * sign
	            };
	        } else if (!!(match = isoDurationRegex.exec(input))) {
	            sign = (match[1] === "-") ? -1 : 1;
	            parseIso = function (inp) {
	                // We'd normally use ~~inp for this, but unfortunately it also
	                // converts floats to ints.
	                // inp may be undefined, so careful calling replace on it.
	                var res = inp && parseFloat(inp.replace(',', '.'));
	                // apply sign while we're at it
	                return (isNaN(res) ? 0 : res) * sign;
	            };
	            duration = {
	                y: parseIso(match[2]),
	                M: parseIso(match[3]),
	                d: parseIso(match[4]),
	                h: parseIso(match[5]),
	                m: parseIso(match[6]),
	                s: parseIso(match[7]),
	                w: parseIso(match[8])
	            };
	        }
	
	        ret = new Duration(duration);
	
	        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
	            ret._lang = input._lang;
	        }
	
	        return ret;
	    };
	
	    // version number
	    moment.version = VERSION;
	
	    // default format
	    moment.defaultFormat = isoFormat;
	
	    // Plugins that add properties should also add the key here (null value),
	    // so we can properly clone ourselves.
	    moment.momentProperties = momentProperties;
	
	    // This function will be called whenever a moment is mutated.
	    // It is intended to keep the offset in sync with the timezone.
	    moment.updateOffset = function () {};
	
	    // This function will load languages and then set the global language.  If
	    // no arguments are passed in, it will simply return the current global
	    // language key.
	    moment.lang = function (key, values) {
	        var r;
	        if (!key) {
	            return moment.fn._lang._abbr;
	        }
	        if (values) {
	            loadLang(normalizeLanguage(key), values);
	        } else if (values === null) {
	            unloadLang(key);
	            key = 'en';
	        } else if (!languages[key]) {
	            getLangDefinition(key);
	        }
	        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
	        return r._abbr;
	    };
	
	    // returns language data
	    moment.langData = function (key) {
	        if (key && key._lang && key._lang._abbr) {
	            key = key._lang._abbr;
	        }
	        return getLangDefinition(key);
	    };
	
	    // compare moment object
	    moment.isMoment = function (obj) {
	        return obj instanceof Moment ||
	            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
	    };
	
	    // for typechecking Duration objects
	    moment.isDuration = function (obj) {
	        return obj instanceof Duration;
	    };
	
	    for (i = lists.length - 1; i >= 0; --i) {
	        makeList(lists[i]);
	    }
	
	    moment.normalizeUnits = function (units) {
	        return normalizeUnits(units);
	    };
	
	    moment.invalid = function (flags) {
	        var m = moment.utc(NaN);
	        if (flags != null) {
	            extend(m._pf, flags);
	        }
	        else {
	            m._pf.userInvalidated = true;
	        }
	
	        return m;
	    };
	
	    moment.parseZone = function () {
	        return moment.apply(null, arguments).parseZone();
	    };
	
	    moment.parseTwoDigitYear = function (input) {
	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	    };
	
	    /************************************
	        Moment Prototype
	    ************************************/
	
	
	    extend(moment.fn = Moment.prototype, {
	
	        clone : function () {
	            return moment(this);
	        },
	
	        valueOf : function () {
	            return +this._d + ((this._offset || 0) * 60000);
	        },
	
	        unix : function () {
	            return Math.floor(+this / 1000);
	        },
	
	        toString : function () {
	            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
	        },
	
	        toDate : function () {
	            return this._offset ? new Date(+this) : this._d;
	        },
	
	        toISOString : function () {
	            var m = moment(this).utc();
	            if (0 < m.year() && m.year() <= 9999) {
	                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	            } else {
	                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	            }
	        },
	
	        toArray : function () {
	            var m = this;
	            return [
	                m.year(),
	                m.month(),
	                m.date(),
	                m.hours(),
	                m.minutes(),
	                m.seconds(),
	                m.milliseconds()
	            ];
	        },
	
	        isValid : function () {
	            return isValid(this);
	        },
	
	        isDSTShifted : function () {
	
	            if (this._a) {
	                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
	            }
	
	            return false;
	        },
	
	        parsingFlags : function () {
	            return extend({}, this._pf);
	        },
	
	        invalidAt: function () {
	            return this._pf.overflow;
	        },
	
	        utc : function () {
	            return this.zone(0);
	        },
	
	        local : function () {
	            this.zone(0);
	            this._isUTC = false;
	            return this;
	        },
	
	        format : function (inputString) {
	            var output = formatMoment(this, inputString || moment.defaultFormat);
	            return this.lang().postformat(output);
	        },
	
	        add : function (input, val) {
	            var dur;
	            // switch args to support add('s', 1) and add(1, 's')
	            if (typeof input === 'string') {
	                dur = moment.duration(+val, input);
	            } else {
	                dur = moment.duration(input, val);
	            }
	            addOrSubtractDurationFromMoment(this, dur, 1);
	            return this;
	        },
	
	        subtract : function (input, val) {
	            var dur;
	            // switch args to support subtract('s', 1) and subtract(1, 's')
	            if (typeof input === 'string') {
	                dur = moment.duration(+val, input);
	            } else {
	                dur = moment.duration(input, val);
	            }
	            addOrSubtractDurationFromMoment(this, dur, -1);
	            return this;
	        },
	
	        diff : function (input, units, asFloat) {
	            var that = makeAs(input, this),
	                zoneDiff = (this.zone() - that.zone()) * 6e4,
	                diff, output;
	
	            units = normalizeUnits(units);
	
	            if (units === 'year' || units === 'month') {
	                // average number of days in the months in the given dates
	                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
	                // difference in months
	                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
	                // adjust by taking difference in days, average number of days
	                // and dst in the given months.
	                output += ((this - moment(this).startOf('month')) -
	                        (that - moment(that).startOf('month'))) / diff;
	                // same as above but with zones, to negate all dst
	                output -= ((this.zone() - moment(this).startOf('month').zone()) -
	                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
	                if (units === 'year') {
	                    output = output / 12;
	                }
	            } else {
	                diff = (this - that);
	                output = units === 'second' ? diff / 1e3 : // 1000
	                    units === 'minute' ? diff / 6e4 : // 1000 * 60
	                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
	                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	                    diff;
	            }
	            return asFloat ? output : absRound(output);
	        },
	
	        from : function (time, withoutSuffix) {
	            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
	        },
	
	        fromNow : function (withoutSuffix) {
	            return this.from(moment(), withoutSuffix);
	        },
	
	        calendar : function () {
	            // We want to compare the start of today, vs this.
	            // Getting start-of-today depends on whether we're zone'd or not.
	            var sod = makeAs(moment(), this).startOf('day'),
	                diff = this.diff(sod, 'days', true),
	                format = diff < -6 ? 'sameElse' :
	                    diff < -1 ? 'lastWeek' :
	                    diff < 0 ? 'lastDay' :
	                    diff < 1 ? 'sameDay' :
	                    diff < 2 ? 'nextDay' :
	                    diff < 7 ? 'nextWeek' : 'sameElse';
	            return this.format(this.lang().calendar(format, this));
	        },
	
	        isLeapYear : function () {
	            return isLeapYear(this.year());
	        },
	
	        isDST : function () {
	            return (this.zone() < this.clone().month(0).zone() ||
	                this.zone() < this.clone().month(5).zone());
	        },
	
	        day : function (input) {
	            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	            if (input != null) {
	                input = parseWeekday(input, this.lang());
	                return this.add({ d : input - day });
	            } else {
	                return day;
	            }
	        },
	
	        month : makeAccessor('Month', true),
	
	        startOf: function (units) {
	            units = normalizeUnits(units);
	            // the following switch intentionally omits break keywords
	            // to utilize falling through the cases.
	            switch (units) {
	            case 'year':
	                this.month(0);
	                /* falls through */
	            case 'quarter':
	            case 'month':
	                this.date(1);
	                /* falls through */
	            case 'week':
	            case 'isoWeek':
	            case 'day':
	                this.hours(0);
	                /* falls through */
	            case 'hour':
	                this.minutes(0);
	                /* falls through */
	            case 'minute':
	                this.seconds(0);
	                /* falls through */
	            case 'second':
	                this.milliseconds(0);
	                /* falls through */
	            }
	
	            // weeks are a special case
	            if (units === 'week') {
	                this.weekday(0);
	            } else if (units === 'isoWeek') {
	                this.isoWeekday(1);
	            }
	
	            // quarters are also special
	            if (units === 'quarter') {
	                this.month(Math.floor(this.month() / 3) * 3);
	            }
	
	            return this;
	        },
	
	        endOf: function (units) {
	            units = normalizeUnits(units);
	            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
	        },
	
	        isAfter: function (input, units) {
	            units = typeof units !== 'undefined' ? units : 'millisecond';
	            return +this.clone().startOf(units) > +moment(input).startOf(units);
	        },
	
	        isBefore: function (input, units) {
	            units = typeof units !== 'undefined' ? units : 'millisecond';
	            return +this.clone().startOf(units) < +moment(input).startOf(units);
	        },
	
	        isSame: function (input, units) {
	            units = units || 'ms';
	            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
	        },
	
	        min: deprecate(
	                 "moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",
	                 function (other) {
	                     other = moment.apply(null, arguments);
	                     return other < this ? this : other;
	                 }
	         ),
	
	        max: deprecate(
	                "moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",
	                function (other) {
	                    other = moment.apply(null, arguments);
	                    return other > this ? this : other;
	                }
	        ),
	
	        // keepTime = true means only change the timezone, without affecting
	        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200
	        // It is possible that 5:31:26 doesn't exist int zone +0200, so we
	        // adjust the time as needed, to be valid.
	        //
	        // Keeping the time actually adds/subtracts (one hour)
	        // from the actual represented time. That is why we call updateOffset
	        // a second time. In case it wants us to change the offset again
	        // _changeInProgress == true case, then we have to adjust, because
	        // there is no such time in the given timezone.
	        zone : function (input, keepTime) {
	            var offset = this._offset || 0;
	            if (input != null) {
	                if (typeof input === "string") {
	                    input = timezoneMinutesFromString(input);
	                }
	                if (Math.abs(input) < 16) {
	                    input = input * 60;
	                }
	                this._offset = input;
	                this._isUTC = true;
	                if (offset !== input) {
	                    if (!keepTime || this._changeInProgress) {
	                        addOrSubtractDurationFromMoment(this,
	                                moment.duration(offset - input, 'm'), 1, false);
	                    } else if (!this._changeInProgress) {
	                        this._changeInProgress = true;
	                        moment.updateOffset(this, true);
	                        this._changeInProgress = null;
	                    }
	                }
	            } else {
	                return this._isUTC ? offset : this._d.getTimezoneOffset();
	            }
	            return this;
	        },
	
	        zoneAbbr : function () {
	            return this._isUTC ? "UTC" : "";
	        },
	
	        zoneName : function () {
	            return this._isUTC ? "Coordinated Universal Time" : "";
	        },
	
	        parseZone : function () {
	            if (this._tzm) {
	                this.zone(this._tzm);
	            } else if (typeof this._i === 'string') {
	                this.zone(this._i);
	            }
	            return this;
	        },
	
	        hasAlignedHourOffset : function (input) {
	            if (!input) {
	                input = 0;
	            }
	            else {
	                input = moment(input).zone();
	            }
	
	            return (this.zone() - input) % 60 === 0;
	        },
	
	        daysInMonth : function () {
	            return daysInMonth(this.year(), this.month());
	        },
	
	        dayOfYear : function (input) {
	            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
	            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
	        },
	
	        quarter : function (input) {
	            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	        },
	
	        weekYear : function (input) {
	            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
	            return input == null ? year : this.add("y", (input - year));
	        },
	
	        isoWeekYear : function (input) {
	            var year = weekOfYear(this, 1, 4).year;
	            return input == null ? year : this.add("y", (input - year));
	        },
	
	        week : function (input) {
	            var week = this.lang().week(this);
	            return input == null ? week : this.add("d", (input - week) * 7);
	        },
	
	        isoWeek : function (input) {
	            var week = weekOfYear(this, 1, 4).week;
	            return input == null ? week : this.add("d", (input - week) * 7);
	        },
	
	        weekday : function (input) {
	            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
	            return input == null ? weekday : this.add("d", input - weekday);
	        },
	
	        isoWeekday : function (input) {
	            // behaves the same as moment#day except
	            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	            // as a setter, sunday should belong to the previous week.
	            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
	        },
	
	        isoWeeksInYear : function () {
	            return weeksInYear(this.year(), 1, 4);
	        },
	
	        weeksInYear : function () {
	            var weekInfo = this._lang._week;
	            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	        },
	
	        get : function (units) {
	            units = normalizeUnits(units);
	            return this[units]();
	        },
	
	        set : function (units, value) {
	            units = normalizeUnits(units);
	            if (typeof this[units] === 'function') {
	                this[units](value);
	            }
	            return this;
	        },
	
	        // If passed a language key, it will set the language for this
	        // instance.  Otherwise, it will return the language configuration
	        // variables for this instance.
	        lang : function (key) {
	            if (key === undefined) {
	                return this._lang;
	            } else {
	                this._lang = getLangDefinition(key);
	                return this;
	            }
	        }
	    });
	
	    function rawMonthSetter(mom, value) {
	        var dayOfMonth;
	
	        // TODO: Move this out of here!
	        if (typeof value === 'string') {
	            value = mom.lang().monthsParse(value);
	            // TODO: Another silent failure?
	            if (typeof value !== 'number') {
	                return mom;
	            }
	        }
	
	        dayOfMonth = Math.min(mom.date(),
	                daysInMonth(mom.year(), value));
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	        return mom;
	    }
	
	    function rawGetter(mom, unit) {
	        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
	    }
	
	    function rawSetter(mom, unit, value) {
	        if (unit === 'Month') {
	            return rawMonthSetter(mom, value);
	        } else {
	            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	        }
	    }
	
	    function makeAccessor(unit, keepTime) {
	        return function (value) {
	            if (value != null) {
	                rawSetter(this, unit, value);
	                moment.updateOffset(this, keepTime);
	                return this;
	            } else {
	                return rawGetter(this, unit);
	            }
	        };
	    }
	
	    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
	    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
	    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
	    // Setting the hour should keep the time, because the user explicitly
	    // specified which hour he wants. So trying to maintain the same hour (in
	    // a new timezone) makes sense. Adding/subtracting hours does not follow
	    // this rule.
	    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
	    // moment.fn.month is defined separately
	    moment.fn.date = makeAccessor('Date', true);
	    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));
	    moment.fn.year = makeAccessor('FullYear', true);
	    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));
	
	    // add plural methods
	    moment.fn.days = moment.fn.day;
	    moment.fn.months = moment.fn.month;
	    moment.fn.weeks = moment.fn.week;
	    moment.fn.isoWeeks = moment.fn.isoWeek;
	    moment.fn.quarters = moment.fn.quarter;
	
	    // add aliased format methods
	    moment.fn.toJSON = moment.fn.toISOString;
	
	    /************************************
	        Duration Prototype
	    ************************************/
	
	
	    extend(moment.duration.fn = Duration.prototype, {
	
	        _bubble : function () {
	            var milliseconds = this._milliseconds,
	                days = this._days,
	                months = this._months,
	                data = this._data,
	                seconds, minutes, hours, years;
	
	            // The following code bubbles up values, see the tests for
	            // examples of what that means.
	            data.milliseconds = milliseconds % 1000;
	
	            seconds = absRound(milliseconds / 1000);
	            data.seconds = seconds % 60;
	
	            minutes = absRound(seconds / 60);
	            data.minutes = minutes % 60;
	
	            hours = absRound(minutes / 60);
	            data.hours = hours % 24;
	
	            days += absRound(hours / 24);
	            data.days = days % 30;
	
	            months += absRound(days / 30);
	            data.months = months % 12;
	
	            years = absRound(months / 12);
	            data.years = years;
	        },
	
	        weeks : function () {
	            return absRound(this.days() / 7);
	        },
	
	        valueOf : function () {
	            return this._milliseconds +
	              this._days * 864e5 +
	              (this._months % 12) * 2592e6 +
	              toInt(this._months / 12) * 31536e6;
	        },
	
	        humanize : function (withSuffix) {
	            var difference = +this,
	                output = relativeTime(difference, !withSuffix, this.lang());
	
	            if (withSuffix) {
	                output = this.lang().pastFuture(difference, output);
	            }
	
	            return this.lang().postformat(output);
	        },
	
	        add : function (input, val) {
	            // supports only 2.0-style add(1, 's') or add(moment)
	            var dur = moment.duration(input, val);
	
	            this._milliseconds += dur._milliseconds;
	            this._days += dur._days;
	            this._months += dur._months;
	
	            this._bubble();
	
	            return this;
	        },
	
	        subtract : function (input, val) {
	            var dur = moment.duration(input, val);
	
	            this._milliseconds -= dur._milliseconds;
	            this._days -= dur._days;
	            this._months -= dur._months;
	
	            this._bubble();
	
	            return this;
	        },
	
	        get : function (units) {
	            units = normalizeUnits(units);
	            return this[units.toLowerCase() + 's']();
	        },
	
	        as : function (units) {
	            units = normalizeUnits(units);
	            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
	        },
	
	        lang : moment.fn.lang,
	
	        toIsoString : function () {
	            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	            var years = Math.abs(this.years()),
	                months = Math.abs(this.months()),
	                days = Math.abs(this.days()),
	                hours = Math.abs(this.hours()),
	                minutes = Math.abs(this.minutes()),
	                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);
	
	            if (!this.asSeconds()) {
	                // this is the same as C#'s (Noda) and python (isodate)...
	                // but not other JS (goog.date)
	                return 'P0D';
	            }
	
	            return (this.asSeconds() < 0 ? '-' : '') +
	                'P' +
	                (years ? years + 'Y' : '') +
	                (months ? months + 'M' : '') +
	                (days ? days + 'D' : '') +
	                ((hours || minutes || seconds) ? 'T' : '') +
	                (hours ? hours + 'H' : '') +
	                (minutes ? minutes + 'M' : '') +
	                (seconds ? seconds + 'S' : '');
	        }
	    });
	
	    function makeDurationGetter(name) {
	        moment.duration.fn[name] = function () {
	            return this._data[name];
	        };
	    }
	
	    function makeDurationAsGetter(name, factor) {
	        moment.duration.fn['as' + name] = function () {
	            return +this / factor;
	        };
	    }
	
	    for (i in unitMillisecondFactors) {
	        if (unitMillisecondFactors.hasOwnProperty(i)) {
	            makeDurationAsGetter(i, unitMillisecondFactors[i]);
	            makeDurationGetter(i.toLowerCase());
	        }
	    }
	
	    makeDurationAsGetter('Weeks', 6048e5);
	    moment.duration.fn.asMonths = function () {
	        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
	    };
	
	
	    /************************************
	        Default Lang
	    ************************************/
	
	
	    // Set default language, other languages will inherit from English.
	    moment.lang('en', {
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (toInt(number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        }
	    });
	
	    /* EMBED_LANGUAGES */
	
	    /************************************
	        Exposing Moment
	    ************************************/
	
	    function makeGlobal(shouldDeprecate) {
	        /*global ender:false */
	        if (typeof ender !== 'undefined') {
	            return;
	        }
	        oldGlobalMoment = globalScope.moment;
	        if (shouldDeprecate) {
	            globalScope.moment = deprecate(
	                    "Accessing Moment through the global scope is " +
	                    "deprecated, and will be removed in an upcoming " +
	                    "release.",
	                    moment);
	        } else {
	            globalScope.moment = moment;
	        }
	    }
	
	    // CommonJS module is defined
	    if (hasModule) {
	        module.exports = moment;
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	            if (module.config && module.config() && module.config().noGlobal === true) {
	                // release the global variable
	                globalScope.moment = oldGlobalMoment;
	            }
	
	            return moment;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	        makeGlobal(true);
	    } else {
	        makeGlobal();
	    }
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(74)(module)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Moroccan Arabic (ar-ma)
	// author : ElFadili Yassine : https://github.com/ElFadiliY
	// author : Abdel Said : https://github.com/abdelsaid
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('ar-ma', {
	        months : "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
	        monthsShort : "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
	        weekdays : "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
	        weekdaysShort : "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
	        weekdaysMin : "ح_ن_ث_ر_خ_ج_س".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[اليوم على الساعة] LT",
	            nextDay: '[غدا على الساعة] LT',
	            nextWeek: 'dddd [على الساعة] LT',
	            lastDay: '[أمس على الساعة] LT',
	            lastWeek: 'dddd [على الساعة] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "في %s",
	            past : "منذ %s",
	            s : "ثوان",
	            m : "دقيقة",
	            mm : "%d دقائق",
	            h : "ساعة",
	            hh : "%d ساعات",
	            d : "يوم",
	            dd : "%d أيام",
	            M : "شهر",
	            MM : "%d أشهر",
	            y : "سنة",
	            yy : "%d سنوات"
	        },
	        week : {
	            dow : 6, // Saturday is the first day of the week.
	            doy : 12  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Arabic (ar)
	// author : Abdel Said : https://github.com/abdelsaid
	// changes in months, weekdays : Ahmed Elkhatib
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var symbolMap = {
	        '1': '١',
	        '2': '٢',
	        '3': '٣',
	        '4': '٤',
	        '5': '٥',
	        '6': '٦',
	        '7': '٧',
	        '8': '٨',
	        '9': '٩',
	        '0': '٠'
	    }, numberMap = {
	        '١': '1',
	        '٢': '2',
	        '٣': '3',
	        '٤': '4',
	        '٥': '5',
	        '٦': '6',
	        '٧': '7',
	        '٨': '8',
	        '٩': '9',
	        '٠': '0'
	    };
	
	    return moment.lang('ar', {
	        months : "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split("_"),
	        monthsShort : "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split("_"),
	        weekdays : "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
	        weekdaysShort : "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
	        weekdaysMin : "ح_ن_ث_ر_خ_ج_س".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 12) {
	                return "ص";
	            } else {
	                return "م";
	            }
	        },
	        calendar : {
	            sameDay: "[اليوم على الساعة] LT",
	            nextDay: '[غدا على الساعة] LT',
	            nextWeek: 'dddd [على الساعة] LT',
	            lastDay: '[أمس على الساعة] LT',
	            lastWeek: 'dddd [على الساعة] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "في %s",
	            past : "منذ %s",
	            s : "ثوان",
	            m : "دقيقة",
	            mm : "%d دقائق",
	            h : "ساعة",
	            hh : "%d ساعات",
	            d : "يوم",
	            dd : "%d أيام",
	            M : "شهر",
	            MM : "%d أشهر",
	            y : "سنة",
	            yy : "%d سنوات"
	        },
	        preparse: function (string) {
	            return string.replace(/[۰-۹]/g, function (match) {
	                return numberMap[match];
	            }).replace(/،/g, ',');
	        },
	        postformat: function (string) {
	            return string.replace(/\d/g, function (match) {
	                return symbolMap[match];
	            }).replace(/,/g, '،');
	        },
	        week : {
	            dow : 6, // Saturday is the first day of the week.
	            doy : 12  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : bulgarian (bg)
	// author : Krasen Borisov : https://github.com/kraz
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('bg', {
	        months : "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
	        monthsShort : "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
	        weekdays : "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
	        weekdaysShort : "нед_пон_вто_сря_чет_пет_съб".split("_"),
	        weekdaysMin : "нд_пн_вт_ср_чт_пт_сб".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "D.MM.YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Днес в] LT',
	            nextDay : '[Утре в] LT',
	            nextWeek : 'dddd [в] LT',
	            lastDay : '[Вчера в] LT',
	            lastWeek : function () {
	                switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[В изминалата] dddd [в] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[В изминалия] dddd [в] LT';
	                }
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "след %s",
	            past : "преди %s",
	            s : "няколко секунди",
	            m : "минута",
	            mm : "%d минути",
	            h : "час",
	            hh : "%d часа",
	            d : "ден",
	            dd : "%d дни",
	            M : "месец",
	            MM : "%d месеца",
	            y : "година",
	            yy : "%d години"
	        },
	        ordinal : function (number) {
	            var lastDigit = number % 10,
	                last2Digits = number % 100;
	            if (number === 0) {
	                return number + '-ев';
	            } else if (last2Digits === 0) {
	                return number + '-ен';
	            } else if (last2Digits > 10 && last2Digits < 20) {
	                return number + '-ти';
	            } else if (lastDigit === 1) {
	                return number + '-ви';
	            } else if (lastDigit === 2) {
	                return number + '-ри';
	            } else if (lastDigit === 7 || lastDigit === 8) {
	                return number + '-ми';
	            } else {
	                return number + '-ти';
	            }
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : breton (br)
	// author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function relativeTimeWithMutation(number, withoutSuffix, key) {
	        var format = {
	            'mm': "munutenn",
	            'MM': "miz",
	            'dd': "devezh"
	        };
	        return number + ' ' + mutation(format[key], number);
	    }
	
	    function specialMutationForYears(number) {
	        switch (lastNumber(number)) {
	        case 1:
	        case 3:
	        case 4:
	        case 5:
	        case 9:
	            return number + ' bloaz';
	        default:
	            return number + ' vloaz';
	        }
	    }
	
	    function lastNumber(number) {
	        if (number > 9) {
	            return lastNumber(number % 10);
	        }
	        return number;
	    }
	
	    function mutation(text, number) {
	        if (number === 2) {
	            return softMutation(text);
	        }
	        return text;
	    }
	
	    function softMutation(text) {
	        var mutationTable = {
	            'm': 'v',
	            'b': 'v',
	            'd': 'z'
	        };
	        if (mutationTable[text.charAt(0)] === undefined) {
	            return text;
	        }
	        return mutationTable[text.charAt(0)] + text.substring(1);
	    }
	
	    return moment.lang('br', {
	        months : "Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),
	        monthsShort : "Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),
	        weekdays : "Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),
	        weekdaysShort : "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),
	        weekdaysMin : "Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),
	        longDateFormat : {
	            LT : "h[e]mm A",
	            L : "DD/MM/YYYY",
	            LL : "D [a viz] MMMM YYYY",
	            LLL : "D [a viz] MMMM YYYY LT",
	            LLLL : "dddd, D [a viz] MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Hiziv da] LT',
	            nextDay : '[Warc\'hoazh da] LT',
	            nextWeek : 'dddd [da] LT',
	            lastDay : '[Dec\'h da] LT',
	            lastWeek : 'dddd [paset da] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "a-benn %s",
	            past : "%s 'zo",
	            s : "un nebeud segondennoù",
	            m : "ur vunutenn",
	            mm : relativeTimeWithMutation,
	            h : "un eur",
	            hh : "%d eur",
	            d : "un devezh",
	            dd : relativeTimeWithMutation,
	            M : "ur miz",
	            MM : relativeTimeWithMutation,
	            y : "ur bloaz",
	            yy : specialMutationForYears
	        },
	        ordinal : function (number) {
	            var output = (number === 1) ? 'añ' : 'vet';
	            return number + output;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : bosnian (bs)
	// author : Nedim Cholich : https://github.com/frontyard
	// based on (hr) translation by Bojan Marković
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    function translate(number, withoutSuffix, key) {
	        var result = number + " ";
	        switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	        }
	    }
	
	    return moment.lang('bs', {
			months : "januar_februar_mart_april_maj_juni_juli_avgust_septembar_oktobar_novembar_decembar".split("_"),
			monthsShort : "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
	        weekdays : "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
	        weekdaysShort : "ned._pon._uto._sri._čet._pet._sub.".split("_"),
	        weekdaysMin : "ne_po_ut_sr_če_pe_su".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD. MM. YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd, D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay  : '[danas u] LT',
	            nextDay  : '[sutra u] LT',
	
	            nextWeek : function () {
	                switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	                }
	            },
	            lastDay  : '[jučer u] LT',
	            lastWeek : function () {
	                switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[prošlu] dddd [u] LT';
	                case 6:
	                    return '[prošle] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prošli] dddd [u] LT';
	                }
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "za %s",
	            past   : "prije %s",
	            s      : "par sekundi",
	            m      : translate,
	            mm     : translate,
	            h      : translate,
	            hh     : translate,
	            d      : "dan",
	            dd     : translate,
	            M      : "mjesec",
	            MM     : translate,
	            y      : "godinu",
	            yy     : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : catalan (ca)
	// author : Juan G. Hurtado : https://github.com/juanghurtado
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('ca', {
	        months : "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),
	        monthsShort : "gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),
	        weekdays : "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),
	        weekdaysShort : "dg._dl._dt._dc._dj._dv._ds.".split("_"),
	        weekdaysMin : "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : function () {
	                return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	            },
	            nextDay : function () {
	                return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	            },
	            nextWeek : function () {
	                return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	            },
	            lastDay : function () {
	                return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	            },
	            lastWeek : function () {
	                return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "en %s",
	            past : "fa %s",
	            s : "uns segons",
	            m : "un minut",
	            mm : "%d minuts",
	            h : "una hora",
	            hh : "%d hores",
	            d : "un dia",
	            dd : "%d dies",
	            M : "un mes",
	            MM : "%d mesos",
	            y : "un any",
	            yy : "%d anys"
	        },
	        ordinal : '%dº',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : czech (cs)
	// author : petrbela : https://github.com/petrbela
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var months = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),
	        monthsShort = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");
	
	    function plural(n) {
	        return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
	    }
	
	    function translate(number, withoutSuffix, key, isFuture) {
	        var result = number + " ";
	        switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minuty' : 'minut');
	            } else {
	                return result + 'minutami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodin');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dny' : 'dní');
	            } else {
	                return result + 'dny';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'měsíce' : 'měsíců');
	            } else {
	                return result + 'měsíci';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'let');
	            } else {
	                return result + 'lety';
	            }
	            break;
	        }
	    }
	
	    return moment.lang('cs', {
	        months : months,
	        monthsShort : monthsShort,
	        monthsParse : (function (months, monthsShort) {
	            var i, _monthsParse = [];
	            for (i = 0; i < 12; i++) {
	                // use custom parser to solve problem with July (červenec)
	                _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
	            }
	            return _monthsParse;
	        }(months, monthsShort)),
	        weekdays : "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
	        weekdaysShort : "ne_po_út_st_čt_pá_so".split("_"),
	        weekdaysMin : "ne_po_út_st_čt_pá_so".split("_"),
	        longDateFormat : {
	            LT: "H.mm",
	            L : "DD. MM. YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[dnes v] LT",
	            nextDay: '[zítra v] LT',
	            nextWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[v neděli v] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [v] LT';
	                case 3:
	                    return '[ve středu v] LT';
	                case 4:
	                    return '[ve čtvrtek v] LT';
	                case 5:
	                    return '[v pátek v] LT';
	                case 6:
	                    return '[v sobotu v] LT';
	                }
	            },
	            lastDay: '[včera v] LT',
	            lastWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[minulou neděli v] LT';
	                case 1:
	                case 2:
	                    return '[minulé] dddd [v] LT';
	                case 3:
	                    return '[minulou středu v] LT';
	                case 4:
	                case 5:
	                    return '[minulý] dddd [v] LT';
	                case 6:
	                    return '[minulou sobotu v] LT';
	                }
	            },
	            sameElse: "L"
	        },
	        relativeTime : {
	            future : "za %s",
	            past : "před %s",
	            s : translate,
	            m : translate,
	            mm : translate,
	            h : translate,
	            hh : translate,
	            d : translate,
	            dd : translate,
	            M : translate,
	            MM : translate,
	            y : translate,
	            yy : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : chuvash (cv)
	// author : Anatoly Mironov : https://github.com/mirontoli
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('cv', {
	        months : "кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),
	        monthsShort : "кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),
	        weekdays : "вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),
	        weekdaysShort : "выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),
	        weekdaysMin : "вр_тн_ыт_юн_кç_эр_шм".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD-MM-YYYY",
	            LL : "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",
	            LLL : "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",
	            LLLL : "dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"
	        },
	        calendar : {
	            sameDay: '[Паян] LT [сехетре]',
	            nextDay: '[Ыран] LT [сехетре]',
	            lastDay: '[Ĕнер] LT [сехетре]',
	            nextWeek: '[Çитес] dddd LT [сехетре]',
	            lastWeek: '[Иртнĕ] dddd LT [сехетре]',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : function (output) {
	                var affix = /сехет$/i.exec(output) ? "рен" : /çул$/i.exec(output) ? "тан" : "ран";
	                return output + affix;
	            },
	            past : "%s каялла",
	            s : "пĕр-ик çеккунт",
	            m : "пĕр минут",
	            mm : "%d минут",
	            h : "пĕр сехет",
	            hh : "%d сехет",
	            d : "пĕр кун",
	            dd : "%d кун",
	            M : "пĕр уйăх",
	            MM : "%d уйăх",
	            y : "пĕр çул",
	            yy : "%d çул"
	        },
	        ordinal : '%d-мĕш',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Welsh (cy)
	// author : Robert Allen
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang("cy", {
	        months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),
	        monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),
	        weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),
	        weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),
	        weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),
	        // time formats are the same as en-gb
	        longDateFormat: {
	            LT: "HH:mm",
	            L: "DD/MM/YYYY",
	            LL: "D MMMM YYYY",
	            LLL: "D MMMM YYYY LT",
	            LLLL: "dddd, D MMMM YYYY LT"
	        },
	        calendar: {
	            sameDay: '[Heddiw am] LT',
	            nextDay: '[Yfory am] LT',
	            nextWeek: 'dddd [am] LT',
	            lastDay: '[Ddoe am] LT',
	            lastWeek: 'dddd [diwethaf am] LT',
	            sameElse: 'L'
	        },
	        relativeTime: {
	            future: "mewn %s",
	            past: "%s yn àl",
	            s: "ychydig eiliadau",
	            m: "munud",
	            mm: "%d munud",
	            h: "awr",
	            hh: "%d awr",
	            d: "diwrnod",
	            dd: "%d diwrnod",
	            M: "mis",
	            MM: "%d mis",
	            y: "blwyddyn",
	            yy: "%d flynedd"
	        },
	        // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
	        ordinal: function (number) {
	            var b = number,
	                output = '',
	                lookup = [
	                    '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
	                    'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
	                ];
	
	            if (b > 20) {
	                if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
	                    output = 'fed'; // not 30ain, 70ain or 90ain
	                } else {
	                    output = 'ain';
	                }
	            } else if (b > 0) {
	                output = lookup[b];
	            }
	
	            return number + output;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : danish (da)
	// author : Ulrik Nielsen : https://github.com/mrbase
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('da', {
	        months : "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
	        monthsShort : "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
	        weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
	        weekdaysShort : "søn_man_tir_ons_tor_fre_lør".split("_"),
	        weekdaysMin : "sø_ma_ti_on_to_fr_lø".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D. MMMM, YYYY LT"
	        },
	        calendar : {
	            sameDay : '[I dag kl.] LT',
	            nextDay : '[I morgen kl.] LT',
	            nextWeek : 'dddd [kl.] LT',
	            lastDay : '[I går kl.] LT',
	            lastWeek : '[sidste] dddd [kl] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "om %s",
	            past : "%s siden",
	            s : "få sekunder",
	            m : "et minut",
	            mm : "%d minutter",
	            h : "en time",
	            hh : "%d timer",
	            d : "en dag",
	            dd : "%d dage",
	            M : "en måned",
	            MM : "%d måneder",
	            y : "et år",
	            yy : "%d år"
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : austrian german (de-at)
	// author : lluchs : https://github.com/lluchs
	// author: Menelion Elensúle: https://github.com/Oire
	// author : Martin Groller : https://github.com/MadMG
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function processRelativeTime(number, withoutSuffix, key, isFuture) {
	        var format = {
	            'm': ['eine Minute', 'einer Minute'],
	            'h': ['eine Stunde', 'einer Stunde'],
	            'd': ['ein Tag', 'einem Tag'],
	            'dd': [number + ' Tage', number + ' Tagen'],
	            'M': ['ein Monat', 'einem Monat'],
	            'MM': [number + ' Monate', number + ' Monaten'],
	            'y': ['ein Jahr', 'einem Jahr'],
	            'yy': [number + ' Jahre', number + ' Jahren']
	        };
	        return withoutSuffix ? format[key][0] : format[key][1];
	    }
	
	    return moment.lang('de-at', {
	        months : "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
	        monthsShort : "Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
	        weekdays : "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
	        weekdaysShort : "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
	        weekdaysMin : "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
	        longDateFormat : {
	            LT: "HH:mm [Uhr]",
	            L : "DD.MM.YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd, D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[Heute um] LT",
	            sameElse: "L",
	            nextDay: '[Morgen um] LT',
	            nextWeek: 'dddd [um] LT',
	            lastDay: '[Gestern um] LT',
	            lastWeek: '[letzten] dddd [um] LT'
	        },
	        relativeTime : {
	            future : "in %s",
	            past : "vor %s",
	            s : "ein paar Sekunden",
	            m : processRelativeTime,
	            mm : "%d Minuten",
	            h : processRelativeTime,
	            hh : "%d Stunden",
	            d : processRelativeTime,
	            dd : processRelativeTime,
	            M : processRelativeTime,
	            MM : processRelativeTime,
	            y : processRelativeTime,
	            yy : processRelativeTime
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : german (de)
	// author : lluchs : https://github.com/lluchs
	// author: Menelion Elensúle: https://github.com/Oire
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function processRelativeTime(number, withoutSuffix, key, isFuture) {
	        var format = {
	            'm': ['eine Minute', 'einer Minute'],
	            'h': ['eine Stunde', 'einer Stunde'],
	            'd': ['ein Tag', 'einem Tag'],
	            'dd': [number + ' Tage', number + ' Tagen'],
	            'M': ['ein Monat', 'einem Monat'],
	            'MM': [number + ' Monate', number + ' Monaten'],
	            'y': ['ein Jahr', 'einem Jahr'],
	            'yy': [number + ' Jahre', number + ' Jahren']
	        };
	        return withoutSuffix ? format[key][0] : format[key][1];
	    }
	
	    return moment.lang('de', {
	        months : "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
	        monthsShort : "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
	        weekdays : "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
	        weekdaysShort : "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
	        weekdaysMin : "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
	        longDateFormat : {
	            LT: "HH:mm [Uhr]",
	            L : "DD.MM.YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd, D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[Heute um] LT",
	            sameElse: "L",
	            nextDay: '[Morgen um] LT',
	            nextWeek: 'dddd [um] LT',
	            lastDay: '[Gestern um] LT',
	            lastWeek: '[letzten] dddd [um] LT'
	        },
	        relativeTime : {
	            future : "in %s",
	            past : "vor %s",
	            s : "ein paar Sekunden",
	            m : processRelativeTime,
	            mm : "%d Minuten",
	            h : processRelativeTime,
	            hh : "%d Stunden",
	            d : processRelativeTime,
	            dd : processRelativeTime,
	            M : processRelativeTime,
	            MM : processRelativeTime,
	            y : processRelativeTime,
	            yy : processRelativeTime
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : modern greek (el)
	// author : Aggelos Karalias : https://github.com/mehiel
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('el', {
	        monthsNominativeEl : "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),
	        monthsGenitiveEl : "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),
	        months : function (momentToFormat, format) {
	            if (/D/.test(format.substring(0, format.indexOf("MMMM")))) { // if there is a day number before 'MMMM'
	                return this._monthsGenitiveEl[momentToFormat.month()];
	            } else {
	                return this._monthsNominativeEl[momentToFormat.month()];
	            }
	        },
	        monthsShort : "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
	        weekdays : "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),
	        weekdaysShort : "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
	        weekdaysMin : "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
	        meridiem : function (hours, minutes, isLower) {
	            if (hours > 11) {
	                return isLower ? 'μμ' : 'ΜΜ';
	            } else {
	                return isLower ? 'πμ' : 'ΠΜ';
	            }
	        },
	        longDateFormat : {
	            LT : "h:mm A",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendarEl : {
	            sameDay : '[Σήμερα {}] LT',
	            nextDay : '[Αύριο {}] LT',
	            nextWeek : 'dddd [{}] LT',
	            lastDay : '[Χθες {}] LT',
	            lastWeek : function() {
	                switch (this.day()) {
	                    case 6:
	                        return '[το προηγούμενο] dddd [{}] LT';
	                    default:
	                        return '[την προηγούμενη] dddd [{}] LT';
	                }
	            },
	            sameElse : 'L'
	        },
	        calendar : function (key, mom) {
	            var output = this._calendarEl[key],
	                hours = mom && mom.hours();
	
	            if (typeof output === 'function') {
	                output = output.apply(mom);
	            }
	
	            return output.replace("{}", (hours % 12 === 1 ? "στη" : "στις"));
	        },
	        relativeTime : {
	            future : "σε %s",
	            past : "%s πριν",
	            s : "δευτερόλεπτα",
	            m : "ένα λεπτό",
	            mm : "%d λεπτά",
	            h : "μία ώρα",
	            hh : "%d ώρες",
	            d : "μία μέρα",
	            dd : "%d μέρες",
	            M : "ένας μήνας",
	            MM : "%d μήνες",
	            y : "ένας χρόνος",
	            yy : "%d χρόνια"
	        },
	        ordinal : function (number) {
	            return number + 'η';
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : australian english (en-au)
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('en-au', {
	        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	        weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	        longDateFormat : {
	            LT : "h:mm A",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Today at] LT',
	            nextDay : '[Tomorrow at] LT',
	            nextWeek : 'dddd [at] LT',
	            lastDay : '[Yesterday at] LT',
	            lastWeek : '[Last] dddd [at] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "in %s",
	            past : "%s ago",
	            s : "a few seconds",
	            m : "a minute",
	            mm : "%d minutes",
	            h : "an hour",
	            hh : "%d hours",
	            d : "a day",
	            dd : "%d days",
	            M : "a month",
	            MM : "%d months",
	            y : "a year",
	            yy : "%d years"
	        },
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (~~ (number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : canadian english (en-ca)
	// author : Jonathan Abourbih : https://github.com/jonbca
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('en-ca', {
	        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	        weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	        longDateFormat : {
	            LT : "h:mm A",
	            L : "YYYY-MM-DD",
	            LL : "D MMMM, YYYY",
	            LLL : "D MMMM, YYYY LT",
	            LLLL : "dddd, D MMMM, YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Today at] LT',
	            nextDay : '[Tomorrow at] LT',
	            nextWeek : 'dddd [at] LT',
	            lastDay : '[Yesterday at] LT',
	            lastWeek : '[Last] dddd [at] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "in %s",
	            past : "%s ago",
	            s : "a few seconds",
	            m : "a minute",
	            mm : "%d minutes",
	            h : "an hour",
	            hh : "%d hours",
	            d : "a day",
	            dd : "%d days",
	            M : "a month",
	            MM : "%d months",
	            y : "a year",
	            yy : "%d years"
	        },
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (~~ (number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        }
	    });
	}));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : great britain english (en-gb)
	// author : Chris Gedrim : https://github.com/chrisgedrim
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('en-gb', {
	        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	        weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Today at] LT',
	            nextDay : '[Tomorrow at] LT',
	            nextWeek : 'dddd [at] LT',
	            lastDay : '[Yesterday at] LT',
	            lastWeek : '[Last] dddd [at] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "in %s",
	            past : "%s ago",
	            s : "a few seconds",
	            m : "a minute",
	            mm : "%d minutes",
	            h : "an hour",
	            hh : "%d hours",
	            d : "a day",
	            dd : "%d days",
	            M : "a month",
	            MM : "%d months",
	            y : "a year",
	            yy : "%d years"
	        },
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (~~ (number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : esperanto (eo)
	// author : Colin Dean : https://github.com/colindean
	// komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
	//          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('eo', {
	        months : "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
	        monthsShort : "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
	        weekdays : "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),
	        weekdaysShort : "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),
	        weekdaysMin : "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "YYYY-MM-DD",
	            LL : "D[-an de] MMMM, YYYY",
	            LLL : "D[-an de] MMMM, YYYY LT",
	            LLLL : "dddd, [la] D[-an de] MMMM, YYYY LT"
	        },
	        meridiem : function (hours, minutes, isLower) {
	            if (hours > 11) {
	                return isLower ? 'p.t.m.' : 'P.T.M.';
	            } else {
	                return isLower ? 'a.t.m.' : 'A.T.M.';
	            }
	        },
	        calendar : {
	            sameDay : '[Hodiaŭ je] LT',
	            nextDay : '[Morgaŭ je] LT',
	            nextWeek : 'dddd [je] LT',
	            lastDay : '[Hieraŭ je] LT',
	            lastWeek : '[pasinta] dddd [je] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "je %s",
	            past : "antaŭ %s",
	            s : "sekundoj",
	            m : "minuto",
	            mm : "%d minutoj",
	            h : "horo",
	            hh : "%d horoj",
	            d : "tago",//ne 'diurno', ĉar estas uzita por proksimumo
	            dd : "%d tagoj",
	            M : "monato",
	            MM : "%d monatoj",
	            y : "jaro",
	            yy : "%d jaroj"
	        },
	        ordinal : "%da",
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : spanish (es)
	// author : Julio Napurí : https://github.com/julionc
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var monthsShortDot = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
	        monthsShort = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");
	
	    return moment.lang('es', {
	        months : "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
	        monthsShort : function (m, format) {
	            if (/-MMM-/.test(format)) {
	                return monthsShort[m.month()];
	            } else {
	                return monthsShortDot[m.month()];
	            }
	        },
	        weekdays : "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
	        weekdaysShort : "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
	        weekdaysMin : "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD/MM/YYYY",
	            LL : "D [de] MMMM [del] YYYY",
	            LLL : "D [de] MMMM [del] YYYY LT",
	            LLLL : "dddd, D [de] MMMM [del] YYYY LT"
	        },
	        calendar : {
	            sameDay : function () {
	                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	            },
	            nextDay : function () {
	                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	            },
	            nextWeek : function () {
	                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	            },
	            lastDay : function () {
	                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	            },
	            lastWeek : function () {
	                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "en %s",
	            past : "hace %s",
	            s : "unos segundos",
	            m : "un minuto",
	            mm : "%d minutos",
	            h : "una hora",
	            hh : "%d horas",
	            d : "un día",
	            dd : "%d días",
	            M : "un mes",
	            MM : "%d meses",
	            y : "un año",
	            yy : "%d años"
	        },
	        ordinal : '%dº',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : estonian (et)
	// author : Henry Kehlmann : https://github.com/madhenry
	// improvements : Illimar Tambek : https://github.com/ragulka
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function processRelativeTime(number, withoutSuffix, key, isFuture) {
	        var format = {
	            's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
	            'm' : ['ühe minuti', 'üks minut'],
	            'mm': [number + ' minuti', number + ' minutit'],
	            'h' : ['ühe tunni', 'tund aega', 'üks tund'],
	            'hh': [number + ' tunni', number + ' tundi'],
	            'd' : ['ühe päeva', 'üks päev'],
	            'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
	            'MM': [number + ' kuu', number + ' kuud'],
	            'y' : ['ühe aasta', 'aasta', 'üks aasta'],
	            'yy': [number + ' aasta', number + ' aastat']
	        };
	        if (withoutSuffix) {
	            return format[key][2] ? format[key][2] : format[key][1];
	        }
	        return isFuture ? format[key][0] : format[key][1];
	    }
	
	    return moment.lang('et', {
	        months        : "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
	        monthsShort   : "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
	        weekdays      : "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
	        weekdaysShort : "P_E_T_K_N_R_L".split("_"),
	        weekdaysMin   : "P_E_T_K_N_R_L".split("_"),
	        longDateFormat : {
	            LT   : "H:mm",
	            L    : "DD.MM.YYYY",
	            LL   : "D. MMMM YYYY",
	            LLL  : "D. MMMM YYYY LT",
	            LLLL : "dddd, D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay  : '[Täna,] LT',
	            nextDay  : '[Homme,] LT',
	            nextWeek : '[Järgmine] dddd LT',
	            lastDay  : '[Eile,] LT',
	            lastWeek : '[Eelmine] dddd LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s pärast",
	            past   : "%s tagasi",
	            s      : processRelativeTime,
	            m      : processRelativeTime,
	            mm     : processRelativeTime,
	            h      : processRelativeTime,
	            hh     : processRelativeTime,
	            d      : processRelativeTime,
	            dd     : '%d päeva',
	            M      : processRelativeTime,
	            MM     : processRelativeTime,
	            y      : processRelativeTime,
	            yy     : processRelativeTime
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : euskara (eu)
	// author : Eneko Illarramendi : https://github.com/eillarra
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('eu', {
	        months : "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
	        monthsShort : "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
	        weekdays : "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
	        weekdaysShort : "ig._al._ar._az._og._ol._lr.".split("_"),
	        weekdaysMin : "ig_al_ar_az_og_ol_lr".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "YYYY-MM-DD",
	            LL : "YYYY[ko] MMMM[ren] D[a]",
	            LLL : "YYYY[ko] MMMM[ren] D[a] LT",
	            LLLL : "dddd, YYYY[ko] MMMM[ren] D[a] LT",
	            l : "YYYY-M-D",
	            ll : "YYYY[ko] MMM D[a]",
	            lll : "YYYY[ko] MMM D[a] LT",
	            llll : "ddd, YYYY[ko] MMM D[a] LT"
	        },
	        calendar : {
	            sameDay : '[gaur] LT[etan]',
	            nextDay : '[bihar] LT[etan]',
	            nextWeek : 'dddd LT[etan]',
	            lastDay : '[atzo] LT[etan]',
	            lastWeek : '[aurreko] dddd LT[etan]',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s barru",
	            past : "duela %s",
	            s : "segundo batzuk",
	            m : "minutu bat",
	            mm : "%d minutu",
	            h : "ordu bat",
	            hh : "%d ordu",
	            d : "egun bat",
	            dd : "%d egun",
	            M : "hilabete bat",
	            MM : "%d hilabete",
	            y : "urte bat",
	            yy : "%d urte"
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Persian Language
	// author : Ebrahim Byagowi : https://github.com/ebraminio
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var symbolMap = {
	        '1': '۱',
	        '2': '۲',
	        '3': '۳',
	        '4': '۴',
	        '5': '۵',
	        '6': '۶',
	        '7': '۷',
	        '8': '۸',
	        '9': '۹',
	        '0': '۰'
	    }, numberMap = {
	        '۱': '1',
	        '۲': '2',
	        '۳': '3',
	        '۴': '4',
	        '۵': '5',
	        '۶': '6',
	        '۷': '7',
	        '۸': '8',
	        '۹': '9',
	        '۰': '0'
	    };
	
	    return moment.lang('fa', {
	        months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
	        monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
	        weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
	        weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
	        weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
	        longDateFormat : {
	            LT : 'HH:mm',
	            L : 'DD/MM/YYYY',
	            LL : 'D MMMM YYYY',
	            LLL : 'D MMMM YYYY LT',
	            LLLL : 'dddd, D MMMM YYYY LT'
	        },
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 12) {
	                return "قبل از ظهر";
	            } else {
	                return "بعد از ظهر";
	            }
	        },
	        calendar : {
	            sameDay : '[امروز ساعت] LT',
	            nextDay : '[فردا ساعت] LT',
	            nextWeek : 'dddd [ساعت] LT',
	            lastDay : '[دیروز ساعت] LT',
	            lastWeek : 'dddd [پیش] [ساعت] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : 'در %s',
	            past : '%s پیش',
	            s : 'چندین ثانیه',
	            m : 'یک دقیقه',
	            mm : '%d دقیقه',
	            h : 'یک ساعت',
	            hh : '%d ساعت',
	            d : 'یک روز',
	            dd : '%d روز',
	            M : 'یک ماه',
	            MM : '%d ماه',
	            y : 'یک سال',
	            yy : '%d سال'
	        },
	        preparse: function (string) {
	            return string.replace(/[۰-۹]/g, function (match) {
	                return numberMap[match];
	            }).replace(/،/g, ',');
	        },
	        postformat: function (string) {
	            return string.replace(/\d/g, function (match) {
	                return symbolMap[match];
	            }).replace(/,/g, '،');
	        },
	        ordinal : '%dم',
	        week : {
	            dow : 6, // Saturday is the first day of the week.
	            doy : 12 // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : finnish (fi)
	// author : Tarmo Aidantausta : https://github.com/bleadof
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
	        numbersFuture = ['nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
	                          numbersPast[7], numbersPast[8], numbersPast[9]];
	
	    function translate(number, withoutSuffix, key, isFuture) {
	        var result = "";
	        switch (key) {
	        case 's':
	            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
	        case 'm':
	            return isFuture ? 'minuutin' : 'minuutti';
	        case 'mm':
	            result = isFuture ? 'minuutin' : 'minuuttia';
	            break;
	        case 'h':
	            return isFuture ? 'tunnin' : 'tunti';
	        case 'hh':
	            result = isFuture ? 'tunnin' : 'tuntia';
	            break;
	        case 'd':
	            return isFuture ? 'päivän' : 'päivä';
	        case 'dd':
	            result = isFuture ? 'päivän' : 'päivää';
	            break;
	        case 'M':
	            return isFuture ? 'kuukauden' : 'kuukausi';
	        case 'MM':
	            result = isFuture ? 'kuukauden' : 'kuukautta';
	            break;
	        case 'y':
	            return isFuture ? 'vuoden' : 'vuosi';
	        case 'yy':
	            result = isFuture ? 'vuoden' : 'vuotta';
	            break;
	        }
	        result = verbalNumber(number, isFuture) + " " + result;
	        return result;
	    }
	
	    function verbalNumber(number, isFuture) {
	        return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
	    }
	
	    return moment.lang('fi', {
	        months : "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
	        monthsShort : "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),
	        weekdays : "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
	        weekdaysShort : "su_ma_ti_ke_to_pe_la".split("_"),
	        weekdaysMin : "su_ma_ti_ke_to_pe_la".split("_"),
	        longDateFormat : {
	            LT : "HH.mm",
	            L : "DD.MM.YYYY",
	            LL : "Do MMMM[ta] YYYY",
	            LLL : "Do MMMM[ta] YYYY, [klo] LT",
	            LLLL : "dddd, Do MMMM[ta] YYYY, [klo] LT",
	            l : "D.M.YYYY",
	            ll : "Do MMM YYYY",
	            lll : "Do MMM YYYY, [klo] LT",
	            llll : "ddd, Do MMM YYYY, [klo] LT"
	        },
	        calendar : {
	            sameDay : '[tänään] [klo] LT',
	            nextDay : '[huomenna] [klo] LT',
	            nextWeek : 'dddd [klo] LT',
	            lastDay : '[eilen] [klo] LT',
	            lastWeek : '[viime] dddd[na] [klo] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s päästä",
	            past : "%s sitten",
	            s : translate,
	            m : translate,
	            mm : translate,
	            h : translate,
	            hh : translate,
	            d : translate,
	            dd : translate,
	            M : translate,
	            MM : translate,
	            y : translate,
	            yy : translate
	        },
	        ordinal : "%d.",
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : faroese (fo)
	// author : Ragnar Johannesen : https://github.com/ragnar123
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('fo', {
	        months : "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),
	        monthsShort : "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
	        weekdays : "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),
	        weekdaysShort : "sun_mán_týs_mik_hós_frí_ley".split("_"),
	        weekdaysMin : "su_má_tý_mi_hó_fr_le".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D. MMMM, YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Í dag kl.] LT',
	            nextDay : '[Í morgin kl.] LT',
	            nextWeek : 'dddd [kl.] LT',
	            lastDay : '[Í gjár kl.] LT',
	            lastWeek : '[síðstu] dddd [kl] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "um %s",
	            past : "%s síðani",
	            s : "fá sekund",
	            m : "ein minutt",
	            mm : "%d minuttir",
	            h : "ein tími",
	            hh : "%d tímar",
	            d : "ein dagur",
	            dd : "%d dagar",
	            M : "ein mánaði",
	            MM : "%d mánaðir",
	            y : "eitt ár",
	            yy : "%d ár"
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : canadian french (fr-ca)
	// author : Jonathan Abourbih : https://github.com/jonbca
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('fr-ca', {
	        months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
	        monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
	        weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
	        weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
	        weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "YYYY-MM-DD",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[Aujourd'hui à] LT",
	            nextDay: '[Demain à] LT',
	            nextWeek: 'dddd [à] LT',
	            lastDay: '[Hier à] LT',
	            lastWeek: 'dddd [dernier à] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "dans %s",
	            past : "il y a %s",
	            s : "quelques secondes",
	            m : "une minute",
	            mm : "%d minutes",
	            h : "une heure",
	            hh : "%d heures",
	            d : "un jour",
	            dd : "%d jours",
	            M : "un mois",
	            MM : "%d mois",
	            y : "un an",
	            yy : "%d ans"
	        },
	        ordinal : function (number) {
	            return number + (number === 1 ? 'er' : '');
	        }
	    });
	}));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : french (fr)
	// author : John Fischer : https://github.com/jfroffice
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('fr', {
	        months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
	        monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
	        weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
	        weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
	        weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[Aujourd'hui à] LT",
	            nextDay: '[Demain à] LT',
	            nextWeek: 'dddd [à] LT',
	            lastDay: '[Hier à] LT',
	            lastWeek: 'dddd [dernier à] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "dans %s",
	            past : "il y a %s",
	            s : "quelques secondes",
	            m : "une minute",
	            mm : "%d minutes",
	            h : "une heure",
	            hh : "%d heures",
	            d : "un jour",
	            dd : "%d jours",
	            M : "un mois",
	            MM : "%d mois",
	            y : "un an",
	            yy : "%d ans"
	        },
	        ordinal : function (number) {
	            return number + (number === 1 ? 'er' : '');
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : galician (gl)
	// author : Juan G. Hurtado : https://github.com/juanghurtado
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('gl', {
	        months : "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),
	        monthsShort : "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
	        weekdays : "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
	        weekdaysShort : "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
	        weekdaysMin : "Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : function () {
	                return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
	            },
	            nextDay : function () {
	                return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
	            },
	            nextWeek : function () {
	                return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	            },
	            lastDay : function () {
	                return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
	            },
	            lastWeek : function () {
	                return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : function (str) {
	                if (str === "uns segundos") {
	                    return "nuns segundos";
	                }
	                return "en " + str;
	            },
	            past : "hai %s",
	            s : "uns segundos",
	            m : "un minuto",
	            mm : "%d minutos",
	            h : "unha hora",
	            hh : "%d horas",
	            d : "un día",
	            dd : "%d días",
	            M : "un mes",
	            MM : "%d meses",
	            y : "un ano",
	            yy : "%d anos"
	        },
	        ordinal : '%dº',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Hebrew (he)
	// author : Tomer Cohen : https://github.com/tomer
	// author : Moshe Simantov : https://github.com/DevelopmentIL
	// author : Tal Ater : https://github.com/TalAter
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('he', {
	        months : "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
	        monthsShort : "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
	        weekdays : "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
	        weekdaysShort : "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
	        weekdaysMin : "א_ב_ג_ד_ה_ו_ש".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D [ב]MMMM YYYY",
	            LLL : "D [ב]MMMM YYYY LT",
	            LLLL : "dddd, D [ב]MMMM YYYY LT",
	            l : "D/M/YYYY",
	            ll : "D MMM YYYY",
	            lll : "D MMM YYYY LT",
	            llll : "ddd, D MMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[היום ב־]LT',
	            nextDay : '[מחר ב־]LT',
	            nextWeek : 'dddd [בשעה] LT',
	            lastDay : '[אתמול ב־]LT',
	            lastWeek : '[ביום] dddd [האחרון בשעה] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "בעוד %s",
	            past : "לפני %s",
	            s : "מספר שניות",
	            m : "דקה",
	            mm : "%d דקות",
	            h : "שעה",
	            hh : function (number) {
	                if (number === 2) {
	                    return "שעתיים";
	                }
	                return number + " שעות";
	            },
	            d : "יום",
	            dd : function (number) {
	                if (number === 2) {
	                    return "יומיים";
	                }
	                return number + " ימים";
	            },
	            M : "חודש",
	            MM : function (number) {
	                if (number === 2) {
	                    return "חודשיים";
	                }
	                return number + " חודשים";
	            },
	            y : "שנה",
	            yy : function (number) {
	                if (number === 2) {
	                    return "שנתיים";
	                }
	                return number + " שנים";
	            }
	        }
	    });
	}));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : hindi (hi)
	// author : Mayank Singhal : https://github.com/mayanksinghal
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var symbolMap = {
	        '1': '१',
	        '2': '२',
	        '3': '३',
	        '4': '४',
	        '5': '५',
	        '6': '६',
	        '7': '७',
	        '8': '८',
	        '9': '९',
	        '0': '०'
	    },
	    numberMap = {
	        '१': '1',
	        '२': '2',
	        '३': '3',
	        '४': '4',
	        '५': '5',
	        '६': '6',
	        '७': '7',
	        '८': '8',
	        '९': '9',
	        '०': '0'
	    };
	
	    return moment.lang('hi', {
	        months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split("_"),
	        monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split("_"),
	        weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split("_"),
	        weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split("_"),
	        weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split("_"),
	        longDateFormat : {
	            LT : "A h:mm बजे",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY, LT",
	            LLLL : "dddd, D MMMM YYYY, LT"
	        },
	        calendar : {
	            sameDay : '[आज] LT',
	            nextDay : '[कल] LT',
	            nextWeek : 'dddd, LT',
	            lastDay : '[कल] LT',
	            lastWeek : '[पिछले] dddd, LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s में",
	            past : "%s पहले",
	            s : "कुछ ही क्षण",
	            m : "एक मिनट",
	            mm : "%d मिनट",
	            h : "एक घंटा",
	            hh : "%d घंटे",
	            d : "एक दिन",
	            dd : "%d दिन",
	            M : "एक महीने",
	            MM : "%d महीने",
	            y : "एक वर्ष",
	            yy : "%d वर्ष"
	        },
	        preparse: function (string) {
	            return string.replace(/[१२३४५६७८९०]/g, function (match) {
	                return numberMap[match];
	            });
	        },
	        postformat: function (string) {
	            return string.replace(/\d/g, function (match) {
	                return symbolMap[match];
	            });
	        },
	        // Hindi notation for meridiems are quite fuzzy in practice. While there exists
	        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 4) {
	                return "रात";
	            } else if (hour < 10) {
	                return "सुबह";
	            } else if (hour < 17) {
	                return "दोपहर";
	            } else if (hour < 20) {
	                return "शाम";
	            } else {
	                return "रात";
	            }
	        },
	        week : {
	            dow : 0, // Sunday is the first day of the week.
	            doy : 6  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : hrvatski (hr)
	// author : Bojan Marković : https://github.com/bmarkovic
	
	// based on (sl) translation by Robert Sedovšek
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    function translate(number, withoutSuffix, key) {
	        var result = number + " ";
	        switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	        }
	    }
	
	    return moment.lang('hr', {
	        months : "sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),
	        monthsShort : "sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),
	        weekdays : "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
	        weekdaysShort : "ned._pon._uto._sri._čet._pet._sub.".split("_"),
	        weekdaysMin : "ne_po_ut_sr_če_pe_su".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD. MM. YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd, D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay  : '[danas u] LT',
	            nextDay  : '[sutra u] LT',
	
	            nextWeek : function () {
	                switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	                }
	            },
	            lastDay  : '[jučer u] LT',
	            lastWeek : function () {
	                switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[prošlu] dddd [u] LT';
	                case 6:
	                    return '[prošle] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prošli] dddd [u] LT';
	                }
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "za %s",
	            past   : "prije %s",
	            s      : "par sekundi",
	            m      : translate,
	            mm     : translate,
	            h      : translate,
	            hh     : translate,
	            d      : "dan",
	            dd     : translate,
	            M      : "mjesec",
	            MM     : translate,
	            y      : "godinu",
	            yy     : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : hungarian (hu)
	// author : Adam Brunner : https://github.com/adambrunner
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
	
	    function translate(number, withoutSuffix, key, isFuture) {
	        var num = number,
	            suffix;
	
	        switch (key) {
	        case 's':
	            return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
	        case 'm':
	            return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'mm':
	            return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'h':
	            return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
	        case 'hh':
	            return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
	        case 'd':
	            return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'dd':
	            return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'M':
	            return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	        case 'MM':
	            return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	        case 'y':
	            return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
	        case 'yy':
	            return num + (isFuture || withoutSuffix ? ' év' : ' éve');
	        }
	
	        return '';
	    }
	
	    function week(isFuture) {
	        return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
	    }
	
	    return moment.lang('hu', {
	        months : "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
	        monthsShort : "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
	        weekdays : "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
	        weekdaysShort : "vas_hét_kedd_sze_csüt_pén_szo".split("_"),
	        weekdaysMin : "v_h_k_sze_cs_p_szo".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "YYYY.MM.DD.",
	            LL : "YYYY. MMMM D.",
	            LLL : "YYYY. MMMM D., LT",
	            LLLL : "YYYY. MMMM D., dddd LT"
	        },
	        meridiem : function (hours, minutes, isLower) {
	            if (hours < 12) {
	                return isLower === true ? 'de' : 'DE';
	            } else {
	                return isLower === true ? 'du' : 'DU';
	            }
	        },
	        calendar : {
	            sameDay : '[ma] LT[-kor]',
	            nextDay : '[holnap] LT[-kor]',
	            nextWeek : function () {
	                return week.call(this, true);
	            },
	            lastDay : '[tegnap] LT[-kor]',
	            lastWeek : function () {
	                return week.call(this, false);
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s múlva",
	            past : "%s",
	            s : translate,
	            m : translate,
	            mm : translate,
	            h : translate,
	            hh : translate,
	            d : translate,
	            dd : translate,
	            M : translate,
	            MM : translate,
	            y : translate,
	            yy : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Armenian (hy-am)
	// author : Armendarabyan : https://github.com/armendarabyan
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    function monthsCaseReplace(m, format) {
	        var months = {
	            'nominative': 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_'),
	            'accusative': 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_')
	        },
	
	        nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return months[nounCase][m.month()];
	    }
	
	    function monthsShortCaseReplace(m, format) {
	        var monthsShort = 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_');
	
	        return monthsShort[m.month()];
	    }
	
	    function weekdaysCaseReplace(m, format) {
	        var weekdays = 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_');
	
	        return weekdays[m.day()];
	    }
	
	    return moment.lang('hy-am', {
	        months : monthsCaseReplace,
	        monthsShort : monthsShortCaseReplace,
	        weekdays : weekdaysCaseReplace,
	        weekdaysShort : "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
	        weekdaysMin : "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY թ.",
	            LLL : "D MMMM YYYY թ., LT",
	            LLLL : "dddd, D MMMM YYYY թ., LT"
	        },
	        calendar : {
	            sameDay: '[այսօր] LT',
	            nextDay: '[վաղը] LT',
	            lastDay: '[երեկ] LT',
	            nextWeek: function () {
	                return 'dddd [օրը ժամը] LT';
	            },
	            lastWeek: function () {
	                return '[անցած] dddd [օրը ժամը] LT';
	            },
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "%s հետո",
	            past : "%s առաջ",
	            s : "մի քանի վայրկյան",
	            m : "րոպե",
	            mm : "%d րոպե",
	            h : "ժամ",
	            hh : "%d ժամ",
	            d : "օր",
	            dd : "%d օր",
	            M : "ամիս",
	            MM : "%d ամիս",
	            y : "տարի",
	            yy : "%d տարի"
	        },
	
	        meridiem : function (hour) {
	            if (hour < 4) {
	                return "գիշերվա";
	            } else if (hour < 12) {
	                return "առավոտվա";
	            } else if (hour < 17) {
	                return "ցերեկվա";
	            } else {
	                return "երեկոյան";
	            }
	        },
	
	        ordinal: function (number, period) {
	            switch (period) {
	            case 'DDD':
	            case 'w':
	            case 'W':
	            case 'DDDo':
	                if (number === 1) {
	                    return number + '-ին';
	                }
	                return number + '-րդ';
	            default:
	                return number;
	            }
	        },
	
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Bahasa Indonesia (id)
	// author : Mohammad Satrio Utomo : https://github.com/tyok
	// reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('id', {
	        months : "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
	        monthsShort : "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
	        weekdays : "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
	        weekdaysShort : "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
	        weekdaysMin : "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
	        longDateFormat : {
	            LT : "HH.mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY [pukul] LT",
	            LLLL : "dddd, D MMMM YYYY [pukul] LT"
	        },
	        meridiem : function (hours, minutes, isLower) {
	            if (hours < 11) {
	                return 'pagi';
	            } else if (hours < 15) {
	                return 'siang';
	            } else if (hours < 19) {
	                return 'sore';
	            } else {
	                return 'malam';
	            }
	        },
	        calendar : {
	            sameDay : '[Hari ini pukul] LT',
	            nextDay : '[Besok pukul] LT',
	            nextWeek : 'dddd [pukul] LT',
	            lastDay : '[Kemarin pukul] LT',
	            lastWeek : 'dddd [lalu pukul] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "dalam %s",
	            past : "%s yang lalu",
	            s : "beberapa detik",
	            m : "semenit",
	            mm : "%d menit",
	            h : "sejam",
	            hh : "%d jam",
	            d : "sehari",
	            dd : "%d hari",
	            M : "sebulan",
	            MM : "%d bulan",
	            y : "setahun",
	            yy : "%d tahun"
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : icelandic (is)
	// author : Hinrik Örn Sigurðsson : https://github.com/hinrik
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function plural(n) {
	        if (n % 100 === 11) {
	            return true;
	        } else if (n % 10 === 1) {
	            return false;
	        }
	        return true;
	    }
	
	    function translate(number, withoutSuffix, key, isFuture) {
	        var result = number + " ";
	        switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
	        case 'm':
	            return withoutSuffix ? 'mínúta' : 'mínútu';
	        case 'mm':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
	            } else if (withoutSuffix) {
	                return result + 'mínúta';
	            }
	            return result + 'mínútu';
	        case 'hh':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
	            }
	            return result + 'klukkustund';
	        case 'd':
	            if (withoutSuffix) {
	                return 'dagur';
	            }
	            return isFuture ? 'dag' : 'degi';
	        case 'dd':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'dagar';
	                }
	                return result + (isFuture ? 'daga' : 'dögum');
	            } else if (withoutSuffix) {
	                return result + 'dagur';
	            }
	            return result + (isFuture ? 'dag' : 'degi');
	        case 'M':
	            if (withoutSuffix) {
	                return 'mánuður';
	            }
	            return isFuture ? 'mánuð' : 'mánuði';
	        case 'MM':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'mánuðir';
	                }
	                return result + (isFuture ? 'mánuði' : 'mánuðum');
	            } else if (withoutSuffix) {
	                return result + 'mánuður';
	            }
	            return result + (isFuture ? 'mánuð' : 'mánuði');
	        case 'y':
	            return withoutSuffix || isFuture ? 'ár' : 'ári';
	        case 'yy':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
	            }
	            return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
	        }
	    }
	
	    return moment.lang('is', {
	        months : "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
	        monthsShort : "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
	        weekdays : "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
	        weekdaysShort : "sun_mán_þri_mið_fim_fös_lau".split("_"),
	        weekdaysMin : "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD/MM/YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY [kl.] LT",
	            LLLL : "dddd, D. MMMM YYYY [kl.] LT"
	        },
	        calendar : {
	            sameDay : '[í dag kl.] LT',
	            nextDay : '[á morgun kl.] LT',
	            nextWeek : 'dddd [kl.] LT',
	            lastDay : '[í gær kl.] LT',
	            lastWeek : '[síðasta] dddd [kl.] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "eftir %s",
	            past : "fyrir %s síðan",
	            s : translate,
	            m : translate,
	            mm : translate,
	            h : "klukkustund",
	            hh : translate,
	            d : translate,
	            dd : translate,
	            M : translate,
	            MM : translate,
	            y : translate,
	            yy : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : italian (it)
	// author : Lorenzo : https://github.com/aliem
	// author: Mattia Larentis: https://github.com/nostalgiaz
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('it', {
	        months : "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre".split("_"),
	        monthsShort : "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),
	        weekdays : "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
	        weekdaysShort : "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
	        weekdaysMin : "D_L_Ma_Me_G_V_S".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: '[Oggi alle] LT',
	            nextDay: '[Domani alle] LT',
	            nextWeek: 'dddd [alle] LT',
	            lastDay: '[Ieri alle] LT',
	            lastWeek: '[lo scorso] dddd [alle] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : function (s) {
	                return ((/^[0-9].+$/).test(s) ? "tra" : "in") + " " + s;
	            },
	            past : "%s fa",
	            s : "alcuni secondi",
	            m : "un minuto",
	            mm : "%d minuti",
	            h : "un'ora",
	            hh : "%d ore",
	            d : "un giorno",
	            dd : "%d giorni",
	            M : "un mese",
	            MM : "%d mesi",
	            y : "un anno",
	            yy : "%d anni"
	        },
	        ordinal: '%dº',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : japanese (ja)
	// author : LI Long : https://github.com/baryon
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('ja', {
	        months : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	        monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	        weekdays : "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
	        weekdaysShort : "日_月_火_水_木_金_土".split("_"),
	        weekdaysMin : "日_月_火_水_木_金_土".split("_"),
	        longDateFormat : {
	            LT : "Ah時m分",
	            L : "YYYY/MM/DD",
	            LL : "YYYY年M月D日",
	            LLL : "YYYY年M月D日LT",
	            LLLL : "YYYY年M月D日LT dddd"
	        },
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 12) {
	                return "午前";
	            } else {
	                return "午後";
	            }
	        },
	        calendar : {
	            sameDay : '[今日] LT',
	            nextDay : '[明日] LT',
	            nextWeek : '[来週]dddd LT',
	            lastDay : '[昨日] LT',
	            lastWeek : '[前週]dddd LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s後",
	            past : "%s前",
	            s : "数秒",
	            m : "1分",
	            mm : "%d分",
	            h : "1時間",
	            hh : "%d時間",
	            d : "1日",
	            dd : "%d日",
	            M : "1ヶ月",
	            MM : "%dヶ月",
	            y : "1年",
	            yy : "%d年"
	        }
	    });
	}));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Georgian (ka)
	// author : Irakli Janiashvili : https://github.com/irakli-janiashvili
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    function monthsCaseReplace(m, format) {
	        var months = {
	            'nominative': 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
	            'accusative': 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
	        },
	
	        nounCase = (/D[oD] *MMMM?/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return months[nounCase][m.month()];
	    }
	
	    function weekdaysCaseReplace(m, format) {
	        var weekdays = {
	            'nominative': 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
	            'accusative': 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_')
	        },
	
	        nounCase = (/(წინა|შემდეგ)/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return weekdays[nounCase][m.day()];
	    }
	
	    return moment.lang('ka', {
	        months : monthsCaseReplace,
	        monthsShort : "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
	        weekdays : weekdaysCaseReplace,
	        weekdaysShort : "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
	        weekdaysMin : "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
	        longDateFormat : {
	            LT : "h:mm A",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[დღეს] LT[-ზე]',
	            nextDay : '[ხვალ] LT[-ზე]',
	            lastDay : '[გუშინ] LT[-ზე]',
	            nextWeek : '[შემდეგ] dddd LT[-ზე]',
	            lastWeek : '[წინა] dddd LT-ზე',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : function (s) {
	                return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
	                    s.replace(/ი$/, "ში") :
	                    s + "ში";
	            },
	            past : function (s) {
	                if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
	                    return s.replace(/(ი|ე)$/, "ის წინ");
	                }
	                if ((/წელი/).test(s)) {
	                    return s.replace(/წელი$/, "წლის წინ");
	                }
	            },
	            s : "რამდენიმე წამი",
	            m : "წუთი",
	            mm : "%d წუთი",
	            h : "საათი",
	            hh : "%d საათი",
	            d : "დღე",
	            dd : "%d დღე",
	            M : "თვე",
	            MM : "%d თვე",
	            y : "წელი",
	            yy : "%d წელი"
	        },
	        ordinal : function (number) {
	            if (number === 0) {
	                return number;
	            }
	
	            if (number === 1) {
	                return number + "-ლი";
	            }
	
	            if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
	                return "მე-" + number;
	            }
	
	            return number + "-ე";
	        },
	        week : {
	            dow : 1,
	            doy : 7
	        }
	    });
	}));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : khmer (km)
	// author : Kruy Vanna : https://github.com/kruyvanna
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('km', {
	        months: "មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
	        monthsShort: "មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
	        weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
	        weekdaysShort: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
	        weekdaysMin: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
	        longDateFormat: {
	            LT: "HH:mm",
	            L: "DD/MM/YYYY",
	            LL: "D MMMM YYYY",
	            LLL: "D MMMM YYYY LT",
	            LLLL: "dddd, D MMMM YYYY LT"
	        },
	        calendar: {
	            sameDay: '[ថ្ងៃនៈ ម៉ោង] LT',
	            nextDay: '[ស្អែក ម៉ោង] LT',
	            nextWeek: 'dddd [ម៉ោង] LT',
	            lastDay: '[ម្សិលមិញ ម៉ោង] LT',
	            lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
	            sameElse: 'L'
	        },
	        relativeTime: {
	            future: "%sទៀត",
	            past: "%sមុន",
	            s: "ប៉ុន្មានវិនាទី",
	            m: "មួយនាទី",
	            mm: "%d នាទី",
	            h: "មួយម៉ោង",
	            hh: "%d ម៉ោង",
	            d: "មួយថ្ងៃ",
	            dd: "%d ថ្ងៃ",
	            M: "មួយខែ",
	            MM: "%d ខែ",
	            y: "មួយឆ្នាំ",
	            yy: "%d ឆ្នាំ"
	        },
	        week: {
	            dow: 1, // Monday is the first day of the week.
	            doy: 4 // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : korean (ko)
	//
	// authors 
	//
	// - Kyungwook, Park : https://github.com/kyungw00k
	// - Jeeeyul Lee <jeeeyul@gmail.com>
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('ko', {
	        months : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
	        monthsShort : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
	        weekdays : "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
	        weekdaysShort : "일_월_화_수_목_금_토".split("_"),
	        weekdaysMin : "일_월_화_수_목_금_토".split("_"),
	        longDateFormat : {
	            LT : "A h시 mm분",
	            L : "YYYY.MM.DD",
	            LL : "YYYY년 MMMM D일",
	            LLL : "YYYY년 MMMM D일 LT",
	            LLLL : "YYYY년 MMMM D일 dddd LT"
	        },
	        meridiem : function (hour, minute, isUpper) {
	            return hour < 12 ? '오전' : '오후';
	        },
	        calendar : {
	            sameDay : '오늘 LT',
	            nextDay : '내일 LT',
	            nextWeek : 'dddd LT',
	            lastDay : '어제 LT',
	            lastWeek : '지난주 dddd LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s 후",
	            past : "%s 전",
	            s : "몇초",
	            ss : "%d초",
	            m : "일분",
	            mm : "%d분",
	            h : "한시간",
	            hh : "%d시간",
	            d : "하루",
	            dd : "%d일",
	            M : "한달",
	            MM : "%d달",
	            y : "일년",
	            yy : "%d년"
	        },
	        ordinal : '%d일',
	        meridiemParse : /(오전|오후)/,
	        isPM : function (token) {
	            return token === "오후";
	        }
	    });
	}));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Luxembourgish (lb)
	// author : mweimerskirch : https://github.com/mweimerskirch
	
	// Note: Luxembourgish has a very particular phonological rule ("Eifeler Regel") that causes the
	// deletion of the final "n" in certain contexts. That's what the "eifelerRegelAppliesToWeekday"
	// and "eifelerRegelAppliesToNumber" methods are meant for
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function processRelativeTime(number, withoutSuffix, key, isFuture) {
	        var format = {
	            'm': ['eng Minutt', 'enger Minutt'],
	            'h': ['eng Stonn', 'enger Stonn'],
	            'd': ['een Dag', 'engem Dag'],
	            'dd': [number + ' Deeg', number + ' Deeg'],
	            'M': ['ee Mount', 'engem Mount'],
	            'MM': [number + ' Méint', number + ' Méint'],
	            'y': ['ee Joer', 'engem Joer'],
	            'yy': [number + ' Joer', number + ' Joer']
	        };
	        return withoutSuffix ? format[key][0] : format[key][1];
	    }
	
	    function processFutureTime(string) {
	        var number = string.substr(0, string.indexOf(' '));
	        if (eifelerRegelAppliesToNumber(number)) {
	            return "a " + string;
	        }
	        return "an " + string;
	    }
	
	    function processPastTime(string) {
	        var number = string.substr(0, string.indexOf(' '));
	        if (eifelerRegelAppliesToNumber(number)) {
	            return "viru " + string;
	        }
	        return "virun " + string;
	    }
	
	    function processLastWeek(string1) {
	        var weekday = this.format('d');
	        if (eifelerRegelAppliesToWeekday(weekday)) {
	            return '[Leschte] dddd [um] LT';
	        }
	        return '[Leschten] dddd [um] LT';
	    }
	
	    /**
	     * Returns true if the word before the given week day loses the "-n" ending.
	     * e.g. "Leschten Dënschdeg" but "Leschte Méindeg"
	     *
	     * @param weekday {integer}
	     * @returns {boolean}
	     */
	    function eifelerRegelAppliesToWeekday(weekday) {
	        weekday = parseInt(weekday, 10);
	        switch (weekday) {
	        case 0: // Sonndeg
	        case 1: // Méindeg
	        case 3: // Mëttwoch
	        case 5: // Freideg
	        case 6: // Samschdeg
	            return true;
	        default: // 2 Dënschdeg, 4 Donneschdeg
	            return false;
	        }
	    }
	
	    /**
	     * Returns true if the word before the given number loses the "-n" ending.
	     * e.g. "an 10 Deeg" but "a 5 Deeg"
	     *
	     * @param number {integer}
	     * @returns {boolean}
	     */
	    function eifelerRegelAppliesToNumber(number) {
	        number = parseInt(number, 10);
	        if (isNaN(number)) {
	            return false;
	        }
	        if (number < 0) {
	            // Negative Number --> always true
	            return true;
	        } else if (number < 10) {
	            // Only 1 digit
	            if (4 <= number && number <= 7) {
	                return true;
	            }
	            return false;
	        } else if (number < 100) {
	            // 2 digits
	            var lastDigit = number % 10, firstDigit = number / 10;
	            if (lastDigit === 0) {
	                return eifelerRegelAppliesToNumber(firstDigit);
	            }
	            return eifelerRegelAppliesToNumber(lastDigit);
	        } else if (number < 10000) {
	            // 3 or 4 digits --> recursively check first digit
	            while (number >= 10) {
	                number = number / 10;
	            }
	            return eifelerRegelAppliesToNumber(number);
	        } else {
	            // Anything larger than 4 digits: recursively check first n-3 digits
	            number = number / 1000;
	            return eifelerRegelAppliesToNumber(number);
	        }
	    }
	
	    return moment.lang('lb', {
	        months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
	        monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
	        weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),
	        weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),
	        weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split("_"),
	        longDateFormat: {
	            LT: "H:mm [Auer]",
	            L: "DD.MM.YYYY",
	            LL: "D. MMMM YYYY",
	            LLL: "D. MMMM YYYY LT",
	            LLLL: "dddd, D. MMMM YYYY LT"
	        },
	        calendar: {
	            sameDay: "[Haut um] LT",
	            sameElse: "L",
	            nextDay: '[Muer um] LT',
	            nextWeek: 'dddd [um] LT',
	            lastDay: '[Gëschter um] LT',
	            lastWeek: processLastWeek
	        },
	        relativeTime: {
	            future: processFutureTime,
	            past: processPastTime,
	            s: "e puer Sekonnen",
	            m: processRelativeTime,
	            mm: "%d Minutten",
	            h: processRelativeTime,
	            hh: "%d Stonnen",
	            d: processRelativeTime,
	            dd: processRelativeTime,
	            M: processRelativeTime,
	            MM: processRelativeTime,
	            y: processRelativeTime,
	            yy: processRelativeTime
	        },
	        ordinal: '%d.',
	        week: {
	            dow: 1, // Monday is the first day of the week.
	            doy: 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Lithuanian (lt)
	// author : Mindaugas Mozūras : https://github.com/mmozuras
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var units = {
	        "m" : "minutė_minutės_minutę",
	        "mm": "minutės_minučių_minutes",
	        "h" : "valanda_valandos_valandą",
	        "hh": "valandos_valandų_valandas",
	        "d" : "diena_dienos_dieną",
	        "dd": "dienos_dienų_dienas",
	        "M" : "mėnuo_mėnesio_mėnesį",
	        "MM": "mėnesiai_mėnesių_mėnesius",
	        "y" : "metai_metų_metus",
	        "yy": "metai_metų_metus"
	    },
	    weekDays = "pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis_sekmadienis".split("_");
	
	    function translateSeconds(number, withoutSuffix, key, isFuture) {
	        if (withoutSuffix) {
	            return "kelios sekundės";
	        } else {
	            return isFuture ? "kelių sekundžių" : "kelias sekundes";
	        }
	    }
	
	    function translateSingular(number, withoutSuffix, key, isFuture) {
	        return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
	    }
	
	    function special(number) {
	        return number % 10 === 0 || (number > 10 && number < 20);
	    }
	
	    function forms(key) {
	        return units[key].split("_");
	    }
	
	    function translate(number, withoutSuffix, key, isFuture) {
	        var result = number + " ";
	        if (number === 1) {
	            return result + translateSingular(number, withoutSuffix, key[0], isFuture);
	        } else if (withoutSuffix) {
	            return result + (special(number) ? forms(key)[1] : forms(key)[0]);
	        } else {
	            if (isFuture) {
	                return result + forms(key)[1];
	            } else {
	                return result + (special(number) ? forms(key)[1] : forms(key)[2]);
	            }
	        }
	    }
	
	    function relativeWeekDay(moment, format) {
	        var nominative = format.indexOf('dddd HH:mm') === -1,
	            weekDay = weekDays[moment.weekday()];
	
	        return nominative ? weekDay : weekDay.substring(0, weekDay.length - 2) + "į";
	    }
	
	    return moment.lang("lt", {
	        months : "sausio_vasario_kovo_balandžio_gegužės_biržėlio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),
	        monthsShort : "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),
	        weekdays : relativeWeekDay,
	        weekdaysShort : "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),
	        weekdaysMin : "S_P_A_T_K_Pn_Š".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "YYYY-MM-DD",
	            LL : "YYYY [m.] MMMM D [d.]",
	            LLL : "YYYY [m.] MMMM D [d.], LT [val.]",
	            LLLL : "YYYY [m.] MMMM D [d.], dddd, LT [val.]",
	            l : "YYYY-MM-DD",
	            ll : "YYYY [m.] MMMM D [d.]",
	            lll : "YYYY [m.] MMMM D [d.], LT [val.]",
	            llll : "YYYY [m.] MMMM D [d.], ddd, LT [val.]"
	        },
	        calendar : {
	            sameDay : "[Šiandien] LT",
	            nextDay : "[Rytoj] LT",
	            nextWeek : "dddd LT",
	            lastDay : "[Vakar] LT",
	            lastWeek : "[Praėjusį] dddd LT",
	            sameElse : "L"
	        },
	        relativeTime : {
	            future : "po %s",
	            past : "prieš %s",
	            s : translateSeconds,
	            m : translateSingular,
	            mm : translate,
	            h : translateSingular,
	            hh : translate,
	            d : translateSingular,
	            dd : translate,
	            M : translateSingular,
	            MM : translate,
	            y : translateSingular,
	            yy : translate
	        },
	        ordinal : function (number) {
	            return number + '-oji';
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : latvian (lv)
	// author : Kristaps Karlsons : https://github.com/skakri
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var units = {
	        'mm': 'minūti_minūtes_minūte_minūtes',
	        'hh': 'stundu_stundas_stunda_stundas',
	        'dd': 'dienu_dienas_diena_dienas',
	        'MM': 'mēnesi_mēnešus_mēnesis_mēneši',
	        'yy': 'gadu_gadus_gads_gadi'
	    };
	
	    function format(word, number, withoutSuffix) {
	        var forms = word.split('_');
	        if (withoutSuffix) {
	            return number % 10 === 1 && number !== 11 ? forms[2] : forms[3];
	        } else {
	            return number % 10 === 1 && number !== 11 ? forms[0] : forms[1];
	        }
	    }
	
	    function relativeTimeWithPlural(number, withoutSuffix, key) {
	        return number + ' ' + format(units[key], number, withoutSuffix);
	    }
	
	    return moment.lang('lv', {
	        months : "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
	        monthsShort : "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
	        weekdays : "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
	        weekdaysShort : "Sv_P_O_T_C_Pk_S".split("_"),
	        weekdaysMin : "Sv_P_O_T_C_Pk_S".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "YYYY. [gada] D. MMMM",
	            LLL : "YYYY. [gada] D. MMMM, LT",
	            LLLL : "YYYY. [gada] D. MMMM, dddd, LT"
	        },
	        calendar : {
	            sameDay : '[Šodien pulksten] LT',
	            nextDay : '[Rīt pulksten] LT',
	            nextWeek : 'dddd [pulksten] LT',
	            lastDay : '[Vakar pulksten] LT',
	            lastWeek : '[Pagājušā] dddd [pulksten] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s vēlāk",
	            past : "%s agrāk",
	            s : "dažas sekundes",
	            m : "minūti",
	            mm : relativeTimeWithPlural,
	            h : "stundu",
	            hh : relativeTimeWithPlural,
	            d : "dienu",
	            dd : relativeTimeWithPlural,
	            M : "mēnesi",
	            MM : relativeTimeWithPlural,
	            y : "gadu",
	            yy : relativeTimeWithPlural
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : macedonian (mk)
	// author : Borislav Mickov : https://github.com/B0k0
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('mk', {
	        months : "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),
	        monthsShort : "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),
	        weekdays : "недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),
	        weekdaysShort : "нед_пон_вто_сре_чет_пет_саб".split("_"),
	        weekdaysMin : "нe_пo_вт_ср_че_пе_сa".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "D.MM.YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Денес во] LT',
	            nextDay : '[Утре во] LT',
	            nextWeek : 'dddd [во] LT',
	            lastDay : '[Вчера во] LT',
	            lastWeek : function () {
	                switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[Во изминатата] dddd [во] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[Во изминатиот] dddd [во] LT';
	                }
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "после %s",
	            past : "пред %s",
	            s : "неколку секунди",
	            m : "минута",
	            mm : "%d минути",
	            h : "час",
	            hh : "%d часа",
	            d : "ден",
	            dd : "%d дена",
	            M : "месец",
	            MM : "%d месеци",
	            y : "година",
	            yy : "%d години"
	        },
	        ordinal : function (number) {
	            var lastDigit = number % 10,
	                last2Digits = number % 100;
	            if (number === 0) {
	                return number + '-ев';
	            } else if (last2Digits === 0) {
	                return number + '-ен';
	            } else if (last2Digits > 10 && last2Digits < 20) {
	                return number + '-ти';
	            } else if (lastDigit === 1) {
	                return number + '-ви';
	            } else if (lastDigit === 2) {
	                return number + '-ри';
	            } else if (lastDigit === 7 || lastDigit === 8) {
	                return number + '-ми';
	            } else {
	                return number + '-ти';
	            }
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : malayalam (ml)
	// author : Floyd Pink : https://github.com/floydpink
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('ml', {
	        months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split("_"),
	        monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split("_"),
	        weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split("_"),
	        weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split("_"),
	        weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split("_"),
	        longDateFormat : {
	            LT : "A h:mm -നു",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY, LT",
	            LLLL : "dddd, D MMMM YYYY, LT"
	        },
	        calendar : {
	            sameDay : '[ഇന്ന്] LT',
	            nextDay : '[നാളെ] LT',
	            nextWeek : 'dddd, LT',
	            lastDay : '[ഇന്നലെ] LT',
	            lastWeek : '[കഴിഞ്ഞ] dddd, LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s കഴിഞ്ഞ്",
	            past : "%s മുൻപ്",
	            s : "അൽപ നിമിഷങ്ങൾ",
	            m : "ഒരു മിനിറ്റ്",
	            mm : "%d മിനിറ്റ്",
	            h : "ഒരു മണിക്കൂർ",
	            hh : "%d മണിക്കൂർ",
	            d : "ഒരു ദിവസം",
	            dd : "%d ദിവസം",
	            M : "ഒരു മാസം",
	            MM : "%d മാസം",
	            y : "ഒരു വർഷം",
	            yy : "%d വർഷം"
	        },
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 4) {
	                return "രാത്രി";
	            } else if (hour < 12) {
	                return "രാവിലെ";
	            } else if (hour < 17) {
	                return "ഉച്ച കഴിഞ്ഞ്";
	            } else if (hour < 20) {
	                return "വൈകുന്നേരം";
	            } else {
	                return "രാത്രി";
	            }
	        }
	    });
	}));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Marathi (mr)
	// author : Harshad Kale : https://github.com/kalehv
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var symbolMap = {
	        '1': '१',
	        '2': '२',
	        '3': '३',
	        '4': '४',
	        '5': '५',
	        '6': '६',
	        '7': '७',
	        '8': '८',
	        '9': '९',
	        '0': '०'
	    },
	    numberMap = {
	        '१': '1',
	        '२': '2',
	        '३': '3',
	        '४': '4',
	        '५': '5',
	        '६': '6',
	        '७': '7',
	        '८': '8',
	        '९': '9',
	        '०': '0'
	    };
	
	    return moment.lang('mr', {
	        months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split("_"),
	        monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split("_"),
	        weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split("_"),
	        weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split("_"),
	        weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split("_"),
	        longDateFormat : {
	            LT : "A h:mm वाजता",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY, LT",
	            LLLL : "dddd, D MMMM YYYY, LT"
	        },
	        calendar : {
	            sameDay : '[आज] LT',
	            nextDay : '[उद्या] LT',
	            nextWeek : 'dddd, LT',
	            lastDay : '[काल] LT',
	            lastWeek: '[मागील] dddd, LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s नंतर",
	            past : "%s पूर्वी",
	            s : "सेकंद",
	            m: "एक मिनिट",
	            mm: "%d मिनिटे",
	            h : "एक तास",
	            hh : "%d तास",
	            d : "एक दिवस",
	            dd : "%d दिवस",
	            M : "एक महिना",
	            MM : "%d महिने",
	            y : "एक वर्ष",
	            yy : "%d वर्षे"
	        },
	        preparse: function (string) {
	            return string.replace(/[१२३४५६७८९०]/g, function (match) {
	                return numberMap[match];
	            });
	        },
	        postformat: function (string) {
	            return string.replace(/\d/g, function (match) {
	                return symbolMap[match];
	            });
	        },
	        meridiem: function (hour, minute, isLower)
	        {
	            if (hour < 4) {
	                return "रात्री";
	            } else if (hour < 10) {
	                return "सकाळी";
	            } else if (hour < 17) {
	                return "दुपारी";
	            } else if (hour < 20) {
	                return "सायंकाळी";
	            } else {
	                return "रात्री";
	            }
	        },
	        week : {
	            dow : 0, // Sunday is the first day of the week.
	            doy : 6  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Bahasa Malaysia (ms-MY)
	// author : Weldan Jamili : https://github.com/weldan
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('ms-my', {
	        months : "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
	        monthsShort : "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
	        weekdays : "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
	        weekdaysShort : "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
	        weekdaysMin : "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
	        longDateFormat : {
	            LT : "HH.mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY [pukul] LT",
	            LLLL : "dddd, D MMMM YYYY [pukul] LT"
	        },
	        meridiem : function (hours, minutes, isLower) {
	            if (hours < 11) {
	                return 'pagi';
	            } else if (hours < 15) {
	                return 'tengahari';
	            } else if (hours < 19) {
	                return 'petang';
	            } else {
	                return 'malam';
	            }
	        },
	        calendar : {
	            sameDay : '[Hari ini pukul] LT',
	            nextDay : '[Esok pukul] LT',
	            nextWeek : 'dddd [pukul] LT',
	            lastDay : '[Kelmarin pukul] LT',
	            lastWeek : 'dddd [lepas pukul] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "dalam %s",
	            past : "%s yang lepas",
	            s : "beberapa saat",
	            m : "seminit",
	            mm : "%d minit",
	            h : "sejam",
	            hh : "%d jam",
	            d : "sehari",
	            dd : "%d hari",
	            M : "sebulan",
	            MM : "%d bulan",
	            y : "setahun",
	            yy : "%d tahun"
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : norwegian bokmål (nb)
	// authors : Espen Hovlandsdal : https://github.com/rexxars
	//           Sigurd Gartmann : https://github.com/sigurdga
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('nb', {
	        months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
	        monthsShort : "jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),
	        weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
	        weekdaysShort : "sø._ma._ti._on._to._fr._lø.".split("_"),
	        weekdaysMin : "sø_ma_ti_on_to_fr_lø".split("_"),
	        longDateFormat : {
	            LT : "H.mm",
	            L : "DD.MM.YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY [kl.] LT",
	            LLLL : "dddd D. MMMM YYYY [kl.] LT"
	        },
	        calendar : {
	            sameDay: '[i dag kl.] LT',
	            nextDay: '[i morgen kl.] LT',
	            nextWeek: 'dddd [kl.] LT',
	            lastDay: '[i går kl.] LT',
	            lastWeek: '[forrige] dddd [kl.] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "om %s",
	            past : "for %s siden",
	            s : "noen sekunder",
	            m : "ett minutt",
	            mm : "%d minutter",
	            h : "en time",
	            hh : "%d timer",
	            d : "en dag",
	            dd : "%d dager",
	            M : "en måned",
	            MM : "%d måneder",
	            y : "ett år",
	            yy : "%d år"
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : nepali/nepalese
	// author : suvash : https://github.com/suvash
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var symbolMap = {
	        '1': '१',
	        '2': '२',
	        '3': '३',
	        '4': '४',
	        '5': '५',
	        '6': '६',
	        '7': '७',
	        '8': '८',
	        '9': '९',
	        '0': '०'
	    },
	    numberMap = {
	        '१': '1',
	        '२': '2',
	        '३': '3',
	        '४': '4',
	        '५': '5',
	        '६': '6',
	        '७': '7',
	        '८': '8',
	        '९': '9',
	        '०': '0'
	    };
	
	    return moment.lang('ne', {
	        months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split("_"),
	        monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split("_"),
	        weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split("_"),
	        weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split("_"),
	        weekdaysMin : 'आइ._सो._मङ्_बु._बि._शु._श.'.split("_"),
	        longDateFormat : {
	            LT : "Aको h:mm बजे",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY, LT",
	            LLLL : "dddd, D MMMM YYYY, LT"
	        },
	        preparse: function (string) {
	            return string.replace(/[१२३४५६७८९०]/g, function (match) {
	                return numberMap[match];
	            });
	        },
	        postformat: function (string) {
	            return string.replace(/\d/g, function (match) {
	                return symbolMap[match];
	            });
	        },
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 3) {
	                return "राती";
	            } else if (hour < 10) {
	                return "बिहान";
	            } else if (hour < 15) {
	                return "दिउँसो";
	            } else if (hour < 18) {
	                return "बेलुका";
	            } else if (hour < 20) {
	                return "साँझ";
	            } else {
	                return "राती";
	            }
	        },
	        calendar : {
	            sameDay : '[आज] LT',
	            nextDay : '[भोली] LT',
	            nextWeek : '[आउँदो] dddd[,] LT',
	            lastDay : '[हिजो] LT',
	            lastWeek : '[गएको] dddd[,] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%sमा",
	            past : "%s अगाडी",
	            s : "केही समय",
	            m : "एक मिनेट",
	            mm : "%d मिनेट",
	            h : "एक घण्टा",
	            hh : "%d घण्टा",
	            d : "एक दिन",
	            dd : "%d दिन",
	            M : "एक महिना",
	            MM : "%d महिना",
	            y : "एक बर्ष",
	            yy : "%d बर्ष"
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : dutch (nl)
	// author : Joris Röling : https://github.com/jjupiter
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var monthsShortWithDots = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
	        monthsShortWithoutDots = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");
	
	    return moment.lang('nl', {
	        months : "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
	        monthsShort : function (m, format) {
	            if (/-MMM-/.test(format)) {
	                return monthsShortWithoutDots[m.month()];
	            } else {
	                return monthsShortWithDots[m.month()];
	            }
	        },
	        weekdays : "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
	        weekdaysShort : "zo._ma._di._wo._do._vr._za.".split("_"),
	        weekdaysMin : "Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD-MM-YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: '[vandaag om] LT',
	            nextDay: '[morgen om] LT',
	            nextWeek: 'dddd [om] LT',
	            lastDay: '[gisteren om] LT',
	            lastWeek: '[afgelopen] dddd [om] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "over %s",
	            past : "%s geleden",
	            s : "een paar seconden",
	            m : "één minuut",
	            mm : "%d minuten",
	            h : "één uur",
	            hh : "%d uur",
	            d : "één dag",
	            dd : "%d dagen",
	            M : "één maand",
	            MM : "%d maanden",
	            y : "één jaar",
	            yy : "%d jaar"
	        },
	        ordinal : function (number) {
	            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : norwegian nynorsk (nn)
	// author : https://github.com/mechuwind
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('nn', {
	        months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
	        monthsShort : "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
	        weekdays : "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
	        weekdaysShort : "sun_mån_tys_ons_tor_fre_lau".split("_"),
	        weekdaysMin : "su_må_ty_on_to_fr_lø".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: '[I dag klokka] LT',
	            nextDay: '[I morgon klokka] LT',
	            nextWeek: 'dddd [klokka] LT',
	            lastDay: '[I går klokka] LT',
	            lastWeek: '[Føregåande] dddd [klokka] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "om %s",
	            past : "for %s sidan",
	            s : "nokre sekund",
	            m : "eit minutt",
	            mm : "%d minutt",
	            h : "ein time",
	            hh : "%d timar",
	            d : "ein dag",
	            dd : "%d dagar",
	            M : "ein månad",
	            MM : "%d månader",
	            y : "eit år",
	            yy : "%d år"
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : polish (pl)
	// author : Rafal Hirsz : https://github.com/evoL
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var monthsNominative = "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),
	        monthsSubjective = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");
	
	    function plural(n) {
	        return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
	    }
	
	    function translate(number, withoutSuffix, key) {
	        var result = number + " ";
	        switch (key) {
	        case 'm':
	            return withoutSuffix ? 'minuta' : 'minutę';
	        case 'mm':
	            return result + (plural(number) ? 'minuty' : 'minut');
	        case 'h':
	            return withoutSuffix  ? 'godzina'  : 'godzinę';
	        case 'hh':
	            return result + (plural(number) ? 'godziny' : 'godzin');
	        case 'MM':
	            return result + (plural(number) ? 'miesiące' : 'miesięcy');
	        case 'yy':
	            return result + (plural(number) ? 'lata' : 'lat');
	        }
	    }
	
	    return moment.lang('pl', {
	        months : function (momentToFormat, format) {
	            if (/D MMMM/.test(format)) {
	                return monthsSubjective[momentToFormat.month()];
	            } else {
	                return monthsNominative[momentToFormat.month()];
	            }
	        },
	        monthsShort : "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
	        weekdays : "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
	        weekdaysShort : "nie_pon_wt_śr_czw_pt_sb".split("_"),
	        weekdaysMin : "N_Pn_Wt_Śr_Cz_Pt_So".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: '[Dziś o] LT',
	            nextDay: '[Jutro o] LT',
	            nextWeek: '[W] dddd [o] LT',
	            lastDay: '[Wczoraj o] LT',
	            lastWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[W zeszłą niedzielę o] LT';
	                case 3:
	                    return '[W zeszłą środę o] LT';
	                case 6:
	                    return '[W zeszłą sobotę o] LT';
	                default:
	                    return '[W zeszły] dddd [o] LT';
	                }
	            },
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "za %s",
	            past : "%s temu",
	            s : "kilka sekund",
	            m : translate,
	            mm : translate,
	            h : translate,
	            hh : translate,
	            d : "1 dzień",
	            dd : '%d dni',
	            M : "miesiąc",
	            MM : translate,
	            y : "rok",
	            yy : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : brazilian portuguese (pt-br)
	// author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('pt-br', {
	        months : "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
	        monthsShort : "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
	        weekdays : "domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),
	        weekdaysShort : "dom_seg_ter_qua_qui_sex_sáb".split("_"),
	        weekdaysMin : "dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D [de] MMMM [de] YYYY",
	            LLL : "D [de] MMMM [de] YYYY [às] LT",
	            LLLL : "dddd, D [de] MMMM [de] YYYY [às] LT"
	        },
	        calendar : {
	            sameDay: '[Hoje às] LT',
	            nextDay: '[Amanhã às] LT',
	            nextWeek: 'dddd [às] LT',
	            lastDay: '[Ontem às] LT',
	            lastWeek: function () {
	                return (this.day() === 0 || this.day() === 6) ?
	                    '[Último] dddd [às] LT' : // Saturday + Sunday
	                    '[Última] dddd [às] LT'; // Monday - Friday
	            },
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "em %s",
	            past : "%s atrás",
	            s : "segundos",
	            m : "um minuto",
	            mm : "%d minutos",
	            h : "uma hora",
	            hh : "%d horas",
	            d : "um dia",
	            dd : "%d dias",
	            M : "um mês",
	            MM : "%d meses",
	            y : "um ano",
	            yy : "%d anos"
	        },
	        ordinal : '%dº'
	    });
	}));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : portuguese (pt)
	// author : Jefferson : https://github.com/jalex79
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('pt', {
	        months : "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
	        monthsShort : "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
	        weekdays : "domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),
	        weekdaysShort : "dom_seg_ter_qua_qui_sex_sáb".split("_"),
	        weekdaysMin : "dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D [de] MMMM [de] YYYY",
	            LLL : "D [de] MMMM [de] YYYY LT",
	            LLLL : "dddd, D [de] MMMM [de] YYYY LT"
	        },
	        calendar : {
	            sameDay: '[Hoje às] LT',
	            nextDay: '[Amanhã às] LT',
	            nextWeek: 'dddd [às] LT',
	            lastDay: '[Ontem às] LT',
	            lastWeek: function () {
	                return (this.day() === 0 || this.day() === 6) ?
	                    '[Último] dddd [às] LT' : // Saturday + Sunday
	                    '[Última] dddd [às] LT'; // Monday - Friday
	            },
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "em %s",
	            past : "%s atrás",
	            s : "segundos",
	            m : "um minuto",
	            mm : "%d minutos",
	            h : "uma hora",
	            hh : "%d horas",
	            d : "um dia",
	            dd : "%d dias",
	            M : "um mês",
	            MM : "%d meses",
	            y : "um ano",
	            yy : "%d anos"
	        },
	        ordinal : '%dº',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : romanian (ro)
	// author : Vlad Gurdiga : https://github.com/gurdiga
	// author : Valentin Agachi : https://github.com/avaly
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function relativeTimeWithPlural(number, withoutSuffix, key) {
	        var format = {
	            'mm': 'minute',
	            'hh': 'ore',
	            'dd': 'zile',
	            'MM': 'luni',
	            'yy': 'ani'
	        },
	            separator = ' ';
	        if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
	            separator = ' de ';
	        }
	
	        return number + separator + format[key];
	    }
	
	    return moment.lang('ro', {
	        months : "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),
	        monthsShort : "ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),
	        weekdays : "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),
	        weekdaysShort : "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
	        weekdaysMin : "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY H:mm",
	            LLLL : "dddd, D MMMM YYYY H:mm"
	        },
	        calendar : {
	            sameDay: "[azi la] LT",
	            nextDay: '[mâine la] LT',
	            nextWeek: 'dddd [la] LT',
	            lastDay: '[ieri la] LT',
	            lastWeek: '[fosta] dddd [la] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "peste %s",
	            past : "%s în urmă",
	            s : "câteva secunde",
	            m : "un minut",
	            mm : relativeTimeWithPlural,
	            h : "o oră",
	            hh : relativeTimeWithPlural,
	            d : "o zi",
	            dd : relativeTimeWithPlural,
	            M : "o lună",
	            MM : relativeTimeWithPlural,
	            y : "un an",
	            yy : relativeTimeWithPlural
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : russian (ru)
	// author : Viktorminator : https://github.com/Viktorminator
	// Author : Menelion Elensúle : https://github.com/Oire
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function plural(word, num) {
	        var forms = word.split('_');
	        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	    }
	
	    function relativeTimeWithPlural(number, withoutSuffix, key) {
	        var format = {
	            'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
	            'hh': 'час_часа_часов',
	            'dd': 'день_дня_дней',
	            'MM': 'месяц_месяца_месяцев',
	            'yy': 'год_года_лет'
	        };
	        if (key === 'm') {
	            return withoutSuffix ? 'минута' : 'минуту';
	        }
	        else {
	            return number + ' ' + plural(format[key], +number);
	        }
	    }
	
	    function monthsCaseReplace(m, format) {
	        var months = {
	            'nominative': 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
	            'accusative': 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_')
	        },
	
	        nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return months[nounCase][m.month()];
	    }
	
	    function monthsShortCaseReplace(m, format) {
	        var monthsShort = {
	            'nominative': 'янв_фев_мар_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
	            'accusative': 'янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек'.split('_')
	        },
	
	        nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return monthsShort[nounCase][m.month()];
	    }
	
	    function weekdaysCaseReplace(m, format) {
	        var weekdays = {
	            'nominative': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
	            'accusative': 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_')
	        },
	
	        nounCase = (/\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return weekdays[nounCase][m.day()];
	    }
	
	    return moment.lang('ru', {
	        months : monthsCaseReplace,
	        monthsShort : monthsShortCaseReplace,
	        weekdays : weekdaysCaseReplace,
	        weekdaysShort : "вс_пн_вт_ср_чт_пт_сб".split("_"),
	        weekdaysMin : "вс_пн_вт_ср_чт_пт_сб".split("_"),
	        monthsParse : [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i],
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY г.",
	            LLL : "D MMMM YYYY г., LT",
	            LLLL : "dddd, D MMMM YYYY г., LT"
	        },
	        calendar : {
	            sameDay: '[Сегодня в] LT',
	            nextDay: '[Завтра в] LT',
	            lastDay: '[Вчера в] LT',
	            nextWeek: function () {
	                return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
	            },
	            lastWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[В прошлое] dddd [в] LT';
	                case 1:
	                case 2:
	                case 4:
	                    return '[В прошлый] dddd [в] LT';
	                case 3:
	                case 5:
	                case 6:
	                    return '[В прошлую] dddd [в] LT';
	                }
	            },
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "через %s",
	            past : "%s назад",
	            s : "несколько секунд",
	            m : relativeTimeWithPlural,
	            mm : relativeTimeWithPlural,
	            h : "час",
	            hh : relativeTimeWithPlural,
	            d : "день",
	            dd : relativeTimeWithPlural,
	            M : "месяц",
	            MM : relativeTimeWithPlural,
	            y : "год",
	            yy : relativeTimeWithPlural
	        },
	
	        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
	
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 4) {
	                return "ночи";
	            } else if (hour < 12) {
	                return "утра";
	            } else if (hour < 17) {
	                return "дня";
	            } else {
	                return "вечера";
	            }
	        },
	
	        ordinal: function (number, period) {
	            switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	                return number + '-й';
	            case 'D':
	                return number + '-го';
	            case 'w':
	            case 'W':
	                return number + '-я';
	            default:
	                return number;
	            }
	        },
	
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : slovak (sk)
	// author : Martin Minka : https://github.com/k2s
	// based on work of petrbela : https://github.com/petrbela
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    var months = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),
	        monthsShort = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");
	
	    function plural(n) {
	        return (n > 1) && (n < 5);
	    }
	
	    function translate(number, withoutSuffix, key, isFuture) {
	        var result = number + " ";
	        switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minúty' : 'minút');
	            } else {
	                return result + 'minútami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodín');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dni' : 'dní');
	            } else {
	                return result + 'dňami';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'mesiace' : 'mesiacov');
	            } else {
	                return result + 'mesiacmi';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'rokov');
	            } else {
	                return result + 'rokmi';
	            }
	            break;
	        }
	    }
	
	    return moment.lang('sk', {
	        months : months,
	        monthsShort : monthsShort,
	        monthsParse : (function (months, monthsShort) {
	            var i, _monthsParse = [];
	            for (i = 0; i < 12; i++) {
	                // use custom parser to solve problem with July (červenec)
	                _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
	            }
	            return _monthsParse;
	        }(months, monthsShort)),
	        weekdays : "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
	        weekdaysShort : "ne_po_ut_st_št_pi_so".split("_"),
	        weekdaysMin : "ne_po_ut_st_št_pi_so".split("_"),
	        longDateFormat : {
	            LT: "H:mm",
	            L : "DD.MM.YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[dnes o] LT",
	            nextDay: '[zajtra o] LT',
	            nextWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[v nedeľu o] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [o] LT';
	                case 3:
	                    return '[v stredu o] LT';
	                case 4:
	                    return '[vo štvrtok o] LT';
	                case 5:
	                    return '[v piatok o] LT';
	                case 6:
	                    return '[v sobotu o] LT';
	                }
	            },
	            lastDay: '[včera o] LT',
	            lastWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[minulú nedeľu o] LT';
	                case 1:
	                case 2:
	                    return '[minulý] dddd [o] LT';
	                case 3:
	                    return '[minulú stredu o] LT';
	                case 4:
	                case 5:
	                    return '[minulý] dddd [o] LT';
	                case 6:
	                    return '[minulú sobotu o] LT';
	                }
	            },
	            sameElse: "L"
	        },
	        relativeTime : {
	            future : "za %s",
	            past : "pred %s",
	            s : translate,
	            m : translate,
	            mm : translate,
	            h : translate,
	            hh : translate,
	            d : translate,
	            dd : translate,
	            M : translate,
	            MM : translate,
	            y : translate,
	            yy : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : slovenian (sl)
	// author : Robert Sedovšek : https://github.com/sedovsek
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function translate(number, withoutSuffix, key) {
	        var result = number + " ";
	        switch (key) {
	        case 'm':
	            return withoutSuffix ? 'ena minuta' : 'eno minuto';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2) {
	                result += 'minuti';
	            } else if (number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minut';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'ena ura' : 'eno uro';
	        case 'hh':
	            if (number === 1) {
	                result += 'ura';
	            } else if (number === 2) {
	                result += 'uri';
	            } else if (number === 3 || number === 4) {
	                result += 'ure';
	            } else {
	                result += 'ur';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dni';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mesec';
	            } else if (number === 2) {
	                result += 'meseca';
	            } else if (number === 3 || number === 4) {
	                result += 'mesece';
	            } else {
	                result += 'mesecev';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'leto';
	            } else if (number === 2) {
	                result += 'leti';
	            } else if (number === 3 || number === 4) {
	                result += 'leta';
	            } else {
	                result += 'let';
	            }
	            return result;
	        }
	    }
	
	    return moment.lang('sl', {
	        months : "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
	        monthsShort : "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
	        weekdays : "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
	        weekdaysShort : "ned._pon._tor._sre._čet._pet._sob.".split("_"),
	        weekdaysMin : "ne_po_to_sr_če_pe_so".split("_"),
	        longDateFormat : {
	            LT : "H:mm",
	            L : "DD. MM. YYYY",
	            LL : "D. MMMM YYYY",
	            LLL : "D. MMMM YYYY LT",
	            LLLL : "dddd, D. MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay  : '[danes ob] LT',
	            nextDay  : '[jutri ob] LT',
	
	            nextWeek : function () {
	                switch (this.day()) {
	                case 0:
	                    return '[v] [nedeljo] [ob] LT';
	                case 3:
	                    return '[v] [sredo] [ob] LT';
	                case 6:
	                    return '[v] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[v] dddd [ob] LT';
	                }
	            },
	            lastDay  : '[včeraj ob] LT',
	            lastWeek : function () {
	                switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[prejšnja] dddd [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prejšnji] dddd [ob] LT';
	                }
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "čez %s",
	            past   : "%s nazaj",
	            s      : "nekaj sekund",
	            m      : translate,
	            mm     : translate,
	            h      : translate,
	            hh     : translate,
	            d      : "en dan",
	            dd     : translate,
	            M      : "en mesec",
	            MM     : translate,
	            y      : "eno leto",
	            yy     : translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Albanian (sq)
	// author : Flakërim Ismani : https://github.com/flakerimi
	// author: Menelion Elensúle: https://github.com/Oire (tests)
	// author : Oerd Cukalla : https://github.com/oerd (fixes)
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('sq', {
	        months : "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),
	        monthsShort : "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),
	        weekdays : "E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),
	        weekdaysShort : "Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),
	        weekdaysMin : "D_H_Ma_Më_E_P_Sh".split("_"),
	        meridiem : function (hours, minutes, isLower) {
	            return hours < 12 ? 'PD' : 'MD';
	        },
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[Sot në] LT',
	            nextDay : '[Nesër në] LT',
	            nextWeek : 'dddd [në] LT',
	            lastDay : '[Dje në] LT',
	            lastWeek : 'dddd [e kaluar në] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "në %s",
	            past : "%s më parë",
	            s : "disa sekonda",
	            m : "një minutë",
	            mm : "%d minuta",
	            h : "një orë",
	            hh : "%d orë",
	            d : "një ditë",
	            dd : "%d ditë",
	            M : "një muaj",
	            MM : "%d muaj",
	            y : "një vit",
	            yy : "%d vite"
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Serbian-cyrillic (sr-cyrl)
	// author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    var translator = {
	        words: { //Different grammatical cases
	            m: ['један минут', 'једне минуте'],
	            mm: ['минут', 'минуте', 'минута'],
	            h: ['један сат', 'једног сата'],
	            hh: ['сат', 'сата', 'сати'],
	            dd: ['дан', 'дана', 'дана'],
	            MM: ['месец', 'месеца', 'месеци'],
	            yy: ['година', 'године', 'година']
	        },
	        correctGrammaticalCase: function (number, wordKey) {
	            return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	        },
	        translate: function (number, withoutSuffix, key) {
	            var wordKey = translator.words[key];
	            if (key.length === 1) {
	                return withoutSuffix ? wordKey[0] : wordKey[1];
	            } else {
	                return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	            }
	        }
	    };
	
	    return moment.lang('sr-cyrl', {
	        months: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
	        monthsShort: ['јан.', 'феб.', 'мар.', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'сеп.', 'окт.', 'нов.', 'дец.'],
	        weekdays: ['недеља', 'понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота'],
	        weekdaysShort: ['нед.', 'пон.', 'уто.', 'сре.', 'чет.', 'пет.', 'суб.'],
	        weekdaysMin: ['не', 'по', 'ут', 'ср', 'че', 'пе', 'су'],
	        longDateFormat: {
	            LT: "H:mm",
	            L: "DD. MM. YYYY",
	            LL: "D. MMMM YYYY",
	            LLL: "D. MMMM YYYY LT",
	            LLLL: "dddd, D. MMMM YYYY LT"
	        },
	        calendar: {
	            sameDay: '[данас у] LT',
	            nextDay: '[сутра у] LT',
	
	            nextWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[у] [недељу] [у] LT';
	                case 3:
	                    return '[у] [среду] [у] LT';
	                case 6:
	                    return '[у] [суботу] [у] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[у] dddd [у] LT';
	                }
	            },
	            lastDay  : '[јуче у] LT',
	            lastWeek : function () {
	                var lastWeekDays = [
	                    '[прошле] [недеље] [у] LT',
	                    '[прошлог] [понедељка] [у] LT',
	                    '[прошлог] [уторка] [у] LT',
	                    '[прошле] [среде] [у] LT',
	                    '[прошлог] [четвртка] [у] LT',
	                    '[прошлог] [петка] [у] LT',
	                    '[прошле] [суботе] [у] LT'
	                ];
	                return lastWeekDays[this.day()];
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "за %s",
	            past   : "пре %s",
	            s      : "неколико секунди",
	            m      : translator.translate,
	            mm     : translator.translate,
	            h      : translator.translate,
	            hh     : translator.translate,
	            d      : "дан",
	            dd     : translator.translate,
	            M      : "месец",
	            MM     : translator.translate,
	            y      : "годину",
	            yy     : translator.translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Serbian-latin (sr)
	// author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    var translator = {
	        words: { //Different grammatical cases
	            m: ['jedan minut', 'jedne minute'],
	            mm: ['minut', 'minute', 'minuta'],
	            h: ['jedan sat', 'jednog sata'],
	            hh: ['sat', 'sata', 'sati'],
	            dd: ['dan', 'dana', 'dana'],
	            MM: ['mesec', 'meseca', 'meseci'],
	            yy: ['godina', 'godine', 'godina']
	        },
	        correctGrammaticalCase: function (number, wordKey) {
	            return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	        },
	        translate: function (number, withoutSuffix, key) {
	            var wordKey = translator.words[key];
	            if (key.length === 1) {
	                return withoutSuffix ? wordKey[0] : wordKey[1];
	            } else {
	                return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	            }
	        }
	    };
	
	    return moment.lang('sr', {
	        months: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
	        monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sep.', 'okt.', 'nov.', 'dec.'],
	        weekdays: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
	        weekdaysShort: ['ned.', 'pon.', 'uto.', 'sre.', 'čet.', 'pet.', 'sub.'],
	        weekdaysMin: ['ne', 'po', 'ut', 'sr', 'če', 'pe', 'su'],
	        longDateFormat: {
	            LT: "H:mm",
	            L: "DD. MM. YYYY",
	            LL: "D. MMMM YYYY",
	            LLL: "D. MMMM YYYY LT",
	            LLLL: "dddd, D. MMMM YYYY LT"
	        },
	        calendar: {
	            sameDay: '[danas u] LT',
	            nextDay: '[sutra u] LT',
	
	            nextWeek: function () {
	                switch (this.day()) {
	                case 0:
	                    return '[u] [nedelju] [u] LT';
	                case 3:
	                    return '[u] [sredu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	                }
	            },
	            lastDay  : '[juče u] LT',
	            lastWeek : function () {
	                var lastWeekDays = [
	                    '[prošle] [nedelje] [u] LT',
	                    '[prošlog] [ponedeljka] [u] LT',
	                    '[prošlog] [utorka] [u] LT',
	                    '[prošle] [srede] [u] LT',
	                    '[prošlog] [četvrtka] [u] LT',
	                    '[prošlog] [petka] [u] LT',
	                    '[prošle] [subote] [u] LT'
	                ];
	                return lastWeekDays[this.day()];
	            },
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "za %s",
	            past   : "pre %s",
	            s      : "nekoliko sekundi",
	            m      : translator.translate,
	            mm     : translator.translate,
	            h      : translator.translate,
	            hh     : translator.translate,
	            d      : "dan",
	            dd     : translator.translate,
	            M      : "mesec",
	            MM     : translator.translate,
	            y      : "godinu",
	            yy     : translator.translate
	        },
	        ordinal : '%d.',
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : swedish (sv)
	// author : Jens Alm : https://github.com/ulmus
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('sv', {
	        months : "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
	        monthsShort : "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
	        weekdays : "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
	        weekdaysShort : "sön_mån_tis_ons_tor_fre_lör".split("_"),
	        weekdaysMin : "sö_må_ti_on_to_fr_lö".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "YYYY-MM-DD",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: '[Idag] LT',
	            nextDay: '[Imorgon] LT',
	            lastDay: '[Igår] LT',
	            nextWeek: 'dddd LT',
	            lastWeek: '[Förra] dddd[en] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "om %s",
	            past : "för %s sedan",
	            s : "några sekunder",
	            m : "en minut",
	            mm : "%d minuter",
	            h : "en timme",
	            hh : "%d timmar",
	            d : "en dag",
	            dd : "%d dagar",
	            M : "en månad",
	            MM : "%d månader",
	            y : "ett år",
	            yy : "%d år"
	        },
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (~~ (number % 100 / 10) === 1) ? 'e' :
	                (b === 1) ? 'a' :
	                (b === 2) ? 'a' :
	                (b === 3) ? 'e' : 'e';
	            return number + output;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : tamil (ta)
	// author : Arjunkumar Krishnamoorthy : https://github.com/tk120404
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    /*var symbolMap = {
	            '1': '௧',
	            '2': '௨',
	            '3': '௩',
	            '4': '௪',
	            '5': '௫',
	            '6': '௬',
	            '7': '௭',
	            '8': '௮',
	            '9': '௯',
	            '0': '௦'
	        },
	        numberMap = {
	            '௧': '1',
	            '௨': '2',
	            '௩': '3',
	            '௪': '4',
	            '௫': '5',
	            '௬': '6',
	            '௭': '7',
	            '௮': '8',
	            '௯': '9',
	            '௦': '0'
	        }; */
	
	    return moment.lang('ta', {
	        months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split("_"),
	        monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split("_"),
	        weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split("_"),
	        weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split("_"),
	        weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY, LT",
	            LLLL : "dddd, D MMMM YYYY, LT"
	        },
	        calendar : {
	            sameDay : '[இன்று] LT',
	            nextDay : '[நாளை] LT',
	            nextWeek : 'dddd, LT',
	            lastDay : '[நேற்று] LT',
	            lastWeek : '[கடந்த வாரம்] dddd, LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s இல்",
	            past : "%s முன்",
	            s : "ஒரு சில விநாடிகள்",
	            m : "ஒரு நிமிடம்",
	            mm : "%d நிமிடங்கள்",
	            h : "ஒரு மணி நேரம்",
	            hh : "%d மணி நேரம்",
	            d : "ஒரு நாள்",
	            dd : "%d நாட்கள்",
	            M : "ஒரு மாதம்",
	            MM : "%d மாதங்கள்",
	            y : "ஒரு வருடம்",
	            yy : "%d ஆண்டுகள்"
	        },
	/*        preparse: function (string) {
	            return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
	                return numberMap[match];
	            });
	        },
	        postformat: function (string) {
	            return string.replace(/\d/g, function (match) {
	                return symbolMap[match];
	            });
	        },*/
	        ordinal : function (number) {
	            return number + 'வது';
	        },
	
	
	// refer http://ta.wikipedia.org/s/1er1      
	
	        meridiem : function (hour, minute, isLower) {
	            if (hour >= 6 && hour <= 10) {
	                return " காலை";
	            } else   if (hour >= 10 && hour <= 14) {
	                return " நண்பகல்";
	            } else    if (hour >= 14 && hour <= 18) {
	                return " எற்பாடு";
	            } else   if (hour >= 18 && hour <= 20) {
	                return " மாலை";
	            } else  if (hour >= 20 && hour <= 24) {
	                return " இரவு";
	            } else  if (hour >= 0 && hour <= 6) {
	                return " வைகறை";
	            }
	        },
	        week : {
	            dow : 0, // Sunday is the first day of the week.
	            doy : 6  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : thai (th)
	// author : Kridsada Thanabulpong : https://github.com/sirn
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('th', {
	        months : "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
	        monthsShort : "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),
	        weekdays : "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
	        weekdaysShort : "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"), // yes, three characters difference
	        weekdaysMin : "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
	        longDateFormat : {
	            LT : "H นาฬิกา m นาที",
	            L : "YYYY/MM/DD",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY เวลา LT",
	            LLLL : "วันddddที่ D MMMM YYYY เวลา LT"
	        },
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 12) {
	                return "ก่อนเที่ยง";
	            } else {
	                return "หลังเที่ยง";
	            }
	        },
	        calendar : {
	            sameDay : '[วันนี้ เวลา] LT',
	            nextDay : '[พรุ่งนี้ เวลา] LT',
	            nextWeek : 'dddd[หน้า เวลา] LT',
	            lastDay : '[เมื่อวานนี้ เวลา] LT',
	            lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "อีก %s",
	            past : "%sที่แล้ว",
	            s : "ไม่กี่วินาที",
	            m : "1 นาที",
	            mm : "%d นาที",
	            h : "1 ชั่วโมง",
	            hh : "%d ชั่วโมง",
	            d : "1 วัน",
	            dd : "%d วัน",
	            M : "1 เดือน",
	            MM : "%d เดือน",
	            y : "1 ปี",
	            yy : "%d ปี"
	        }
	    });
	}));


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Tagalog/Filipino (tl-ph)
	// author : Dan Hagman
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('tl-ph', {
	        months : "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),
	        monthsShort : "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
	        weekdays : "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),
	        weekdaysShort : "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
	        weekdaysMin : "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "MM/D/YYYY",
	            LL : "MMMM D, YYYY",
	            LLL : "MMMM D, YYYY LT",
	            LLLL : "dddd, MMMM DD, YYYY LT"
	        },
	        calendar : {
	            sameDay: "[Ngayon sa] LT",
	            nextDay: '[Bukas sa] LT',
	            nextWeek: 'dddd [sa] LT',
	            lastDay: '[Kahapon sa] LT',
	            lastWeek: 'dddd [huling linggo] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "sa loob ng %s",
	            past : "%s ang nakalipas",
	            s : "ilang segundo",
	            m : "isang minuto",
	            mm : "%d minuto",
	            h : "isang oras",
	            hh : "%d oras",
	            d : "isang araw",
	            dd : "%d araw",
	            M : "isang buwan",
	            MM : "%d buwan",
	            y : "isang taon",
	            yy : "%d taon"
	        },
	        ordinal : function (number) {
	            return number;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : turkish (tr)
	// authors : Erhan Gundogan : https://github.com/erhangundogan,
	//           Burak Yiğit Kaya: https://github.com/BYK
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	
	    var suffixes = {
	        1: "'inci",
	        5: "'inci",
	        8: "'inci",
	        70: "'inci",
	        80: "'inci",
	
	        2: "'nci",
	        7: "'nci",
	        20: "'nci",
	        50: "'nci",
	
	        3: "'üncü",
	        4: "'üncü",
	        100: "'üncü",
	
	        6: "'ncı",
	
	        9: "'uncu",
	        10: "'uncu",
	        30: "'uncu",
	
	        60: "'ıncı",
	        90: "'ıncı"
	    };
	
	    return moment.lang('tr', {
	        months : "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
	        monthsShort : "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
	        weekdays : "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
	        weekdaysShort : "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
	        weekdaysMin : "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd, D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay : '[bugün saat] LT',
	            nextDay : '[yarın saat] LT',
	            nextWeek : '[haftaya] dddd [saat] LT',
	            lastDay : '[dün] LT',
	            lastWeek : '[geçen hafta] dddd [saat] LT',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "%s sonra",
	            past : "%s önce",
	            s : "birkaç saniye",
	            m : "bir dakika",
	            mm : "%d dakika",
	            h : "bir saat",
	            hh : "%d saat",
	            d : "bir gün",
	            dd : "%d gün",
	            M : "bir ay",
	            MM : "%d ay",
	            y : "bir yıl",
	            yy : "%d yıl"
	        },
	        ordinal : function (number) {
	            if (number === 0) {  // special case for zero
	                return number + "'ıncı";
	            }
	            var a = number % 10,
	                b = number % 100 - a,
	                c = number >= 100 ? 100 : null;
	
	            return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Morocco Central Atlas Tamaziɣt in Latin (tzm-latn)
	// author : Abdel Said : https://github.com/abdelsaid
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('tzm-latn', {
	        months : "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
	        monthsShort : "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
	        weekdays : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
	        weekdaysShort : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
	        weekdaysMin : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[asdkh g] LT",
	            nextDay: '[aska g] LT',
	            nextWeek: 'dddd [g] LT',
	            lastDay: '[assant g] LT',
	            lastWeek: 'dddd [g] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "dadkh s yan %s",
	            past : "yan %s",
	            s : "imik",
	            m : "minuḍ",
	            mm : "%d minuḍ",
	            h : "saɛa",
	            hh : "%d tassaɛin",
	            d : "ass",
	            dd : "%d ossan",
	            M : "ayowr",
	            MM : "%d iyyirn",
	            y : "asgas",
	            yy : "%d isgasn"
	        },
	        week : {
	            dow : 6, // Saturday is the first day of the week.
	            doy : 12  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : Morocco Central Atlas Tamaziɣt (tzm)
	// author : Abdel Said : https://github.com/abdelsaid
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('tzm', {
	        months : "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
	        monthsShort : "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
	        weekdays : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
	        weekdaysShort : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
	        weekdaysMin : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "dddd D MMMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
	            nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
	            nextWeek: 'dddd [ⴴ] LT',
	            lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
	            lastWeek: 'dddd [ⴴ] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
	            past : "ⵢⴰⵏ %s",
	            s : "ⵉⵎⵉⴽ",
	            m : "ⵎⵉⵏⵓⴺ",
	            mm : "%d ⵎⵉⵏⵓⴺ",
	            h : "ⵙⴰⵄⴰ",
	            hh : "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
	            d : "ⴰⵙⵙ",
	            dd : "%d oⵙⵙⴰⵏ",
	            M : "ⴰⵢoⵓⵔ",
	            MM : "%d ⵉⵢⵢⵉⵔⵏ",
	            y : "ⴰⵙⴳⴰⵙ",
	            yy : "%d ⵉⵙⴳⴰⵙⵏ"
	        },
	        week : {
	            dow : 6, // Saturday is the first day of the week.
	            doy : 12  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : ukrainian (uk)
	// author : zemlanin : https://github.com/zemlanin
	// Author : Menelion Elensúle : https://github.com/Oire
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    function plural(word, num) {
	        var forms = word.split('_');
	        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	    }
	
	    function relativeTimeWithPlural(number, withoutSuffix, key) {
	        var format = {
	            'mm': 'хвилина_хвилини_хвилин',
	            'hh': 'година_години_годин',
	            'dd': 'день_дні_днів',
	            'MM': 'місяць_місяці_місяців',
	            'yy': 'рік_роки_років'
	        };
	        if (key === 'm') {
	            return withoutSuffix ? 'хвилина' : 'хвилину';
	        }
	        else if (key === 'h') {
	            return withoutSuffix ? 'година' : 'годину';
	        }
	        else {
	            return number + ' ' + plural(format[key], +number);
	        }
	    }
	
	    function monthsCaseReplace(m, format) {
	        var months = {
	            'nominative': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
	            'accusative': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_')
	        },
	
	        nounCase = (/D[oD]? *MMMM?/).test(format) ?
	            'accusative' :
	            'nominative';
	
	        return months[nounCase][m.month()];
	    }
	
	    function weekdaysCaseReplace(m, format) {
	        var weekdays = {
	            'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
	            'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
	            'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
	        },
	
	        nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
	            'accusative' :
	            ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
	                'genitive' :
	                'nominative');
	
	        return weekdays[nounCase][m.day()];
	    }
	
	    function processHoursFunction(str) {
	        return function () {
	            return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
	        };
	    }
	
	    return moment.lang('uk', {
	        months : monthsCaseReplace,
	        monthsShort : "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),
	        weekdays : weekdaysCaseReplace,
	        weekdaysShort : "нд_пн_вт_ср_чт_пт_сб".split("_"),
	        weekdaysMin : "нд_пн_вт_ср_чт_пт_сб".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD.MM.YYYY",
	            LL : "D MMMM YYYY р.",
	            LLL : "D MMMM YYYY р., LT",
	            LLLL : "dddd, D MMMM YYYY р., LT"
	        },
	        calendar : {
	            sameDay: processHoursFunction('[Сьогодні '),
	            nextDay: processHoursFunction('[Завтра '),
	            lastDay: processHoursFunction('[Вчора '),
	            nextWeek: processHoursFunction('[У] dddd ['),
	            lastWeek: function () {
	                switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return processHoursFunction('[Минулої] dddd [').call(this);
	                case 1:
	                case 2:
	                case 4:
	                    return processHoursFunction('[Минулого] dddd [').call(this);
	                }
	            },
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "за %s",
	            past : "%s тому",
	            s : "декілька секунд",
	            m : relativeTimeWithPlural,
	            mm : relativeTimeWithPlural,
	            h : "годину",
	            hh : relativeTimeWithPlural,
	            d : "день",
	            dd : relativeTimeWithPlural,
	            M : "місяць",
	            MM : relativeTimeWithPlural,
	            y : "рік",
	            yy : relativeTimeWithPlural
	        },
	
	        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
	
	        meridiem : function (hour, minute, isLower) {
	            if (hour < 4) {
	                return "ночі";
	            } else if (hour < 12) {
	                return "ранку";
	            } else if (hour < 17) {
	                return "дня";
	            } else {
	                return "вечора";
	            }
	        },
	
	        ordinal: function (number, period) {
	            switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return number + '-й';
	            case 'D':
	                return number + '-го';
	            default:
	                return number;
	            }
	        },
	
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 1st is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : uzbek
	// author : Sardor Muminov : https://github.com/muminoff
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('uz', {
	        months : "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
	        monthsShort : "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
	        weekdays : "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),
	        weekdaysShort : "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),
	        weekdaysMin : "Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM YYYY",
	            LLL : "D MMMM YYYY LT",
	            LLLL : "D MMMM YYYY, dddd LT"
	        },
	        calendar : {
	            sameDay : '[Бугун соат] LT [да]',
	            nextDay : '[Эртага] LT [да]',
	            nextWeek : 'dddd [куни соат] LT [да]',
	            lastDay : '[Кеча соат] LT [да]',
	            lastWeek : '[Утган] dddd [куни соат] LT [да]',
	            sameElse : 'L'
	        },
	        relativeTime : {
	            future : "Якин %s ичида",
	            past : "Бир неча %s олдин",
	            s : "фурсат",
	            m : "бир дакика",
	            mm : "%d дакика",
	            h : "бир соат",
	            hh : "%d соат",
	            d : "бир кун",
	            dd : "%d кун",
	            M : "бир ой",
	            MM : "%d ой",
	            y : "бир йил",
	            yy : "%d йил"
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 7  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : vietnamese (vi)
	// author : Bang Nguyen : https://github.com/bangnk
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('vi', {
	        months : "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),
	        monthsShort : "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
	        weekdays : "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),
	        weekdaysShort : "CN_T2_T3_T4_T5_T6_T7".split("_"),
	        weekdaysMin : "CN_T2_T3_T4_T5_T6_T7".split("_"),
	        longDateFormat : {
	            LT : "HH:mm",
	            L : "DD/MM/YYYY",
	            LL : "D MMMM [năm] YYYY",
	            LLL : "D MMMM [năm] YYYY LT",
	            LLLL : "dddd, D MMMM [năm] YYYY LT",
	            l : "DD/M/YYYY",
	            ll : "D MMM YYYY",
	            lll : "D MMM YYYY LT",
	            llll : "ddd, D MMM YYYY LT"
	        },
	        calendar : {
	            sameDay: "[Hôm nay lúc] LT",
	            nextDay: '[Ngày mai lúc] LT',
	            nextWeek: 'dddd [tuần tới lúc] LT',
	            lastDay: '[Hôm qua lúc] LT',
	            lastWeek: 'dddd [tuần rồi lúc] LT',
	            sameElse: 'L'
	        },
	        relativeTime : {
	            future : "%s tới",
	            past : "%s trước",
	            s : "vài giây",
	            m : "một phút",
	            mm : "%d phút",
	            h : "một giờ",
	            hh : "%d giờ",
	            d : "một ngày",
	            dd : "%d ngày",
	            M : "một tháng",
	            MM : "%d tháng",
	            y : "một năm",
	            yy : "%d năm"
	        },
	        ordinal : function (number) {
	            return number;
	        },
	        week : {
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : chinese
	// author : suupic : https://github.com/suupic
	// author : Zeno Zeng : https://github.com/zenozeng
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('zh-cn', {
	        months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
	        monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	        weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
	        weekdaysShort : "周日_周一_周二_周三_周四_周五_周六".split("_"),
	        weekdaysMin : "日_一_二_三_四_五_六".split("_"),
	        longDateFormat : {
	            LT : "Ah点mm",
	            L : "YYYY-MM-DD",
	            LL : "YYYY年MMMD日",
	            LLL : "YYYY年MMMD日LT",
	            LLLL : "YYYY年MMMD日ddddLT",
	            l : "YYYY-MM-DD",
	            ll : "YYYY年MMMD日",
	            lll : "YYYY年MMMD日LT",
	            llll : "YYYY年MMMD日ddddLT"
	        },
	        meridiem : function (hour, minute, isLower) {
	            var hm = hour * 100 + minute;
	            if (hm < 600) {
	                return "凌晨";
	            } else if (hm < 900) {
	                return "早上";
	            } else if (hm < 1130) {
	                return "上午";
	            } else if (hm < 1230) {
	                return "中午";
	            } else if (hm < 1800) {
	                return "下午";
	            } else {
	                return "晚上";
	            }
	        },
	        calendar : {
	            sameDay : function () {
	                return this.minutes() === 0 ? "[今天]Ah[点整]" : "[今天]LT";
	            },
	            nextDay : function () {
	                return this.minutes() === 0 ? "[明天]Ah[点整]" : "[明天]LT";
	            },
	            lastDay : function () {
	                return this.minutes() === 0 ? "[昨天]Ah[点整]" : "[昨天]LT";
	            },
	            nextWeek : function () {
	                var startOfWeek, prefix;
	                startOfWeek = moment().startOf('week');
	                prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
	                return this.minutes() === 0 ? prefix + "dddAh点整" : prefix + "dddAh点mm";
	            },
	            lastWeek : function () {
	                var startOfWeek, prefix;
	                startOfWeek = moment().startOf('week');
	                prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
	                return this.minutes() === 0 ? prefix + "dddAh点整" : prefix + "dddAh点mm";
	            },
	            sameElse : 'LL'
	        },
	        ordinal : function (number, period) {
	            switch (period) {
	            case "d":
	            case "D":
	            case "DDD":
	                return number + "日";
	            case "M":
	                return number + "月";
	            case "w":
	            case "W":
	                return number + "周";
	            default:
	                return number;
	            }
	        },
	        relativeTime : {
	            future : "%s内",
	            past : "%s前",
	            s : "几秒",
	            m : "1分钟",
	            mm : "%d分钟",
	            h : "1小时",
	            hh : "%d小时",
	            d : "1天",
	            dd : "%d天",
	            M : "1个月",
	            MM : "%d个月",
	            y : "1年",
	            yy : "%d年"
	        },
	        week : {
	            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
	            dow : 1, // Monday is the first day of the week.
	            doy : 4  // The week that contains Jan 4th is the first week of the year.
	        }
	    });
	}));


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js language configuration
	// language : traditional chinese (zh-tw)
	// author : Ben : https://github.com/ben-lin
	
	(function (factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('../moment')); // Node
	    } else {
	        factory(window.moment); // Browser global
	    }
	}(function (moment) {
	    return moment.lang('zh-tw', {
	        months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
	        monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	        weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
	        weekdaysShort : "週日_週一_週二_週三_週四_週五_週六".split("_"),
	        weekdaysMin : "日_一_二_三_四_五_六".split("_"),
	        longDateFormat : {
	            LT : "Ah點mm",
	            L : "YYYY年MMMD日",
	            LL : "YYYY年MMMD日",
	            LLL : "YYYY年MMMD日LT",
	            LLLL : "YYYY年MMMD日ddddLT",
	            l : "YYYY年MMMD日",
	            ll : "YYYY年MMMD日",
	            lll : "YYYY年MMMD日LT",
	            llll : "YYYY年MMMD日ddddLT"
	        },
	        meridiem : function (hour, minute, isLower) {
	            var hm = hour * 100 + minute;
	            if (hm < 900) {
	                return "早上";
	            } else if (hm < 1130) {
	                return "上午";
	            } else if (hm < 1230) {
	                return "中午";
	            } else if (hm < 1800) {
	                return "下午";
	            } else {
	                return "晚上";
	            }
	        },
	        calendar : {
	            sameDay : '[今天]LT',
	            nextDay : '[明天]LT',
	            nextWeek : '[下]ddddLT',
	            lastDay : '[昨天]LT',
	            lastWeek : '[上]ddddLT',
	            sameElse : 'L'
	        },
	        ordinal : function (number, period) {
	            switch (period) {
	            case "d" :
	            case "D" :
	            case "DDD" :
	                return number + "日";
	            case "M" :
	                return number + "月";
	            case "w" :
	            case "W" :
	                return number + "週";
	            default :
	                return number;
	            }
	        },
	        relativeTime : {
	            future : "%s內",
	            past : "%s前",
	            s : "幾秒",
	            m : "一分鐘",
	            mm : "%d分鐘",
	            h : "一小時",
	            hh : "%d小時",
	            d : "一天",
	            dd : "%d天",
	            M : "一個月",
	            MM : "%d個月",
	            y : "一年",
	            yy : "%d年"
	        }
	    });
	}));


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	var base64 = __webpack_require__(80)
	var ieee754 = __webpack_require__(81)
	var isArray = __webpack_require__(82)
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(73).Buffer, (function() { return this; }())))

/***/ },
/* 74 */
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


/***/ },
/* 75 */
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
/* 76 */
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(74)(module), __webpack_require__(73).Buffer))

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./ar": 3,
		"./ar-ma": 2,
		"./ar-ma.js": 2,
		"./ar.js": 3,
		"./bg": 4,
		"./bg.js": 4,
		"./br": 5,
		"./br.js": 5,
		"./bs": 6,
		"./bs.js": 6,
		"./ca": 7,
		"./ca.js": 7,
		"./cs": 8,
		"./cs.js": 8,
		"./cv": 9,
		"./cv.js": 9,
		"./cy": 10,
		"./cy.js": 10,
		"./da": 11,
		"./da.js": 11,
		"./de": 13,
		"./de-at": 12,
		"./de-at.js": 12,
		"./de.js": 13,
		"./el": 14,
		"./el.js": 14,
		"./en-au": 15,
		"./en-au.js": 15,
		"./en-ca": 16,
		"./en-ca.js": 16,
		"./en-gb": 17,
		"./en-gb.js": 17,
		"./eo": 18,
		"./eo.js": 18,
		"./es": 19,
		"./es.js": 19,
		"./et": 20,
		"./et.js": 20,
		"./eu": 21,
		"./eu.js": 21,
		"./fa": 22,
		"./fa.js": 22,
		"./fi": 23,
		"./fi.js": 23,
		"./fo": 24,
		"./fo.js": 24,
		"./fr": 26,
		"./fr-ca": 25,
		"./fr-ca.js": 25,
		"./fr.js": 26,
		"./gl": 27,
		"./gl.js": 27,
		"./he": 28,
		"./he.js": 28,
		"./hi": 29,
		"./hi.js": 29,
		"./hr": 30,
		"./hr.js": 30,
		"./hu": 31,
		"./hu.js": 31,
		"./hy-am": 32,
		"./hy-am.js": 32,
		"./id": 33,
		"./id.js": 33,
		"./is": 34,
		"./is.js": 34,
		"./it": 35,
		"./it.js": 35,
		"./ja": 36,
		"./ja.js": 36,
		"./ka": 37,
		"./ka.js": 37,
		"./km": 38,
		"./km.js": 38,
		"./ko": 39,
		"./ko.js": 39,
		"./lb": 40,
		"./lb.js": 40,
		"./lt": 41,
		"./lt.js": 41,
		"./lv": 42,
		"./lv.js": 42,
		"./mk": 43,
		"./mk.js": 43,
		"./ml": 44,
		"./ml.js": 44,
		"./mr": 45,
		"./mr.js": 45,
		"./ms-my": 46,
		"./ms-my.js": 46,
		"./nb": 47,
		"./nb.js": 47,
		"./ne": 48,
		"./ne.js": 48,
		"./nl": 49,
		"./nl.js": 49,
		"./nn": 50,
		"./nn.js": 50,
		"./pl": 51,
		"./pl.js": 51,
		"./pt": 53,
		"./pt-br": 52,
		"./pt-br.js": 52,
		"./pt.js": 53,
		"./ro": 54,
		"./ro.js": 54,
		"./ru": 55,
		"./ru.js": 55,
		"./sk": 56,
		"./sk.js": 56,
		"./sl": 57,
		"./sl.js": 57,
		"./sq": 58,
		"./sq.js": 58,
		"./sr": 60,
		"./sr-cyrl": 59,
		"./sr-cyrl.js": 59,
		"./sr.js": 60,
		"./sv": 61,
		"./sv.js": 61,
		"./ta": 62,
		"./ta.js": 62,
		"./th": 63,
		"./th.js": 63,
		"./tl-ph": 64,
		"./tl-ph.js": 64,
		"./tr": 65,
		"./tr.js": 65,
		"./tzm": 67,
		"./tzm-latn": 66,
		"./tzm-latn.js": 66,
		"./tzm.js": 67,
		"./uk": 68,
		"./uk.js": 68,
		"./uz": 69,
		"./uz.js": 69,
		"./vi": 70,
		"./vi.js": 70,
		"./zh-cn": 71,
		"./zh-cn.js": 71,
		"./zh-tw": 72,
		"./zh-tw.js": 72
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
	webpackContext.id = 77;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	
	var moment = __webpack_require__(1);
	var events = __webpack_require__(75).EventEmitter;
	
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
	function typeOf(object, type){
	  return Object.prototype.toString.call(object) === "[object " + type + "]";
	}
	
	function isString(object){
	  return typeOf(object, "String");
	}
	
	function isBoolean(object){
	  return typeOf(object, "Boolean");
	}
	
	function isArray(object){
	  return typeOf(object, "Array");
	}
	
	function isNumber(object){
	  return !isNaN(object) && typeOf(object, "Number");
	}
	
	function isRegExp(object){
	  return typeOf(object, "RegExp");
	}
	
	function isFunction(object){
	  return typeOf(object, "Function");
	}
	function isObject(object){
	  return null!==object && typeOf(object, "Object");
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
	function eachRules(rules, handler){
	  for(var ruleName in rules){
	    if(rules.hasOwnProperty(ruleName)){
	      handler.call(rules, ruleName, rules[ruleName]);
	    }
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
	
	var RE_MONTH = /^\d{4,}\-\d{2}$/;
	function verifyIsMonth(value, validity){
	  var certified = RE_MONTH.test(value) && moment(value).isValid();
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
	  var certified = moment(value) >= moment(min);
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
	  var certified = moment(value) <= moment(max);
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	// TODO: #4, remove moment.
	var RE_TIME = /^\d{2}:\d{2}:\d{2}$/;
	function verifyIsTime(value, validity){
	  var certified = RE_TIME.test(value) && moment("2014-01-01 " + value).isValid();
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
	  var date = '2014-01-01T';
	  var certified = moment(date+value) >= moment(date+min);
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
	  var date = '2014-01-01T';
	  var certified = moment(date+value) <= moment(date+max);
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	var RE_DATE = /^\d{4,}\-\d{2}\-\d{2}$/;
	function verifyIsDate(value, validity){
	  var certified = RE_DATE.test(value) && moment(value).isValid();
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
	  var certified = moment(value) >= moment(min);
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
	  var certified = moment(value) <= moment(max);
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	// http://www.w3.org/TR/html-markup/input.datetime.html
	var RE_DATETIME = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;
	function verifyIsDateTime(value, validity){
	  var certified = RE_DATETIME.test(value) && moment(value).isValid();
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
	  var certified = moment(value) >= moment(min);
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
	  var certified = moment(value) <= moment(max);
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	// [input=type=datetime-local](http://www.w3.org/TR/html-markup/input.datetime-local.html)
	var RE_DATETIME_LOCAL = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;
	function verifyIsDateTimeLocal(value, validity){
	  var certified = RE_DATETIME_LOCAL.test(value) && moment(value).isValid();
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
	  var certified = moment(value) >= moment(min);
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
	  var certified = moment(value) <= moment(max);
	  validity.rangeOverflow = !certified;
	  return certified;
	}
	
	
	var RE_WEEK = /^\d{4,}-W\d{2}$/;
	function verifyIsWeek(value, validity){
	  var certified = RE_WEEK.test(value) && moment(value).isValid();
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
	  var certified = moment(value) >= moment(min);
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
	  var certified = moment(value) <= moment(max);
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
	
	
	var RE_EMAIL = /^\w+(?:[\._+\-]\w+)*@[\w_-]+(?:\.[\w_-]+)+$/;
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
	
	function verifyFunction(ruleFunction, value, datas, certifiedCallback){
	  if(!isFunction(ruleFunction)){return true;}
	
	  var build_in_rule = merge(BUILD_IN_RULE, {
	    data: function(key){
	      return datas[key];
	    }
	  });
	
	  var result = ruleFunction.call(build_in_rule, value, certifiedCallback);
	  if("undefined" !== typeof result){
	    return result;
	  }
	
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
	
	  //! NOTE: Do't each loop values by verifyFunction,
	  //        each loop values in user custom function if need.
	  var result = verifyFunction(rule.custom, values, datas, function(certified){
	
	    if (!certified) {
	      validity.customError = true;
	      validity.valid = false;
	      validity.validationMessage = ValidityState.customError;
	    }
	
	    instance_context._evt.emit(certified ? "valid":"invalid", ruleName, values, validity);
	
	    if(--instance_context._pending === 0){
	      instance_context._evt.emit("complete", instance_context._certified && certified);
	      instance_context._certified = true;
	    }
	  });
	
	  instance_context._certified = certified;
	
	  if(typeof result !== "undefined"){
	
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
	  }else{
	    instance_context._pending++;
	  }
	
	}
	
	
	var Validator = function(rules){
	  this._rules = rules;
	  this._evt = new events();
	  this._pending = 0;
	  this._certified = true;
	};
	
	Validator.prototype.validate = function(data){
	
	  var certified = true;
	  var ME = this;
	
	  eachRules(this._rules, function(ruleName, rule){
	
	    var values = data[ruleName];
	    var result = verify(ruleName, rule, values, data, ME);
	    certified = certified && result;
	
	  });
	
	  if(this._pending === 0){
	    ME._evt.emit("complete", certified);
	    ME._certified = true;
	  }
	
	  return this;
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var expect = __webpack_require__(76);
	var Validator = __webpack_require__(78);
	
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
	    "data": { a: "2014-W53" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: "2014-W1" },
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
	    "data": { a: ["2014-W53"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W01", "2014-W53"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { type: "week" } },
	    "data": { a: ["2014-W1"] },
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
	    "rule": { a: { custom: function(values, callback){
	      setTimeout(function(){
	        callback(true);
	      }, 100);
	    } } },
	    "data": { a: "whatever." },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
	      setTimeout(function(){
	        callback(false);
	      }, 100);
	    } } },
	    "data": { a: "whatever." },
	    "test": testInvalid
	  },
	  // 2 async function validation.
	  {
	    "rule": { a: { custom: function(values, callback){
	      setTimeout(function(){
	        callback(true);
	      }, 100);
	    } },
	    b: {custom: function(values, callback){
	      setTimeout(function(){
	        callback(true);
	      }, 100);
	    } } },
	    "data": { a: "whatever.", b: "something..." },
	    "test": testValid
	  },
	  // XXX: special, test invalid, rule a can-not valid.
	  //{
	    //"rule": { a: { custom: function(values, callback){
	      //setTimeout(function(){
	        //callback(false);
	      //}, 100);
	    //} },
	    //b: {custom: function(values, callback){
	      //setTimeout(function(){
	        //callback(true);
	      //}, 100);
	    //} } },
	    //"data": { a: "whatever.", b: "something..." },
	    //"test": testInvalid
	  //},
	  //{
	    //"rule": { a: { custom: function(values, callback){
	      //setTimeout(function(){
	        //callback(true);
	      //}, 100);
	    //} },
	    //b: {custom: function(values, callback){
	      //setTimeout(function(){
	        //callback(false);
	      //}, 100);
	    //} } },
	    //"data": { a: "whatever." },
	    //"test": testInvalid
	  //},
	  {
	    "rule": { a: { custom: function(values, callback){
	      setTimeout(function(){
	        callback(false);
	      }, 100);
	    } },
	    b: {custom: function(values, callback){
	      setTimeout(function(){
	        callback(false);
	      }, 100);
	    } } },
	    "data": { a: "whatever.", b: "something..." },
	    "test": testInvalid
	  },
	  // custom function, and multiple rule mixin.
	  {
	    "rule": { a: { custom: function(values, callback){
	      return this.isEmail(values) || this.isMobile(values);
	    } } },
	    "data": { a: "a@b.c" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
	      return this.isEmail(values) || this.isMobile(values);
	    } } },
	    "data": { a: "13900000000" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
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
	    "rule": { a: { custom: function(values, callback){
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
	    "rule": { a: { custom: function(values, callback){
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
	    "rule": { a: { custom: function(values, callback){
	      return this.isEmail(values) || this.isMobile(values);
	    } } },
	    "data": { a: "139000000000" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: "6228480323012001315" },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: ["6228480323012001315"] },
	    "test": testValid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
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
	    "rule": { a: { custom: function(values, callback){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: "139000000000" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
	      return this.isBankCard(values);
	    } } },
	    "data": { a: "6228480323012001314" },
	    "test": testInvalid
	  },
	  {
	    "rule": { a: { custom: function(values, callback){
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
/* 80 */
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
/* 81 */
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
/* 82 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map
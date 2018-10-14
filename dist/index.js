(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dyna-runbox", [], factory);
	else if(typeof exports === 'object')
		exports["dyna-runbox"] = factory();
	else
		root["dyna-runbox"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var runBox_1 = __webpack_require__(2);
exports.runBox = runBox_1.runBox;
var asyncRunBox_1 = __webpack_require__(1);
exports.asyncRunBox = asyncRunBox_1.asyncRunBox;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncRunBox = function (params_) {
    var params = __assign({ errorMessage: 'general error' }, params_);
    var output = params.defaultReturn;
    var hasError = false;
    var createErrorObject = function (code, message, error, additionalData) {
        if (additionalData === void 0) { additionalData = {}; }
        return ({
            code: code || params.errorCode,
            section: params.section,
            message: message || params.errorMessage,
            data: __assign({}, (params.errorData || {}), additionalData),
            error: error
        });
    };
    var createWarnObject = function (code, message, additionalData) {
        if (additionalData === void 0) { additionalData = {}; }
        return ({
            code: code,
            section: params.section,
            message: message || params.errorMessage,
            data: __assign({}, (params.errorData || {}), additionalData),
        });
    };
    return new Promise(function (resolve, reject) {
        try {
            return params.run(function (code, message, data) {
                params.errors && params.errors.push(createErrorObject(code, message, null, data));
                params.localErrors && params.localErrors.push(createErrorObject(code, message, null, data));
                hasError = true;
            }, function (code, message, data) {
                params.warns && params.warns.push(createWarnObject(code, message, data));
                params.localWarns && params.localWarns.push(createWarnObject(code, message, data));
            });
        }
        catch (error) {
            var additionalData = { error: error, message: error.message, uncautchedError: true };
            if (params.exceptionsAsWarns) {
                params.warns && params.warns.push(createWarnObject(null, null, additionalData));
                params.localWarns && params.localWarns.push(createWarnObject(null, null, additionalData));
            }
            else {
                params.errors && params.errors.push(createErrorObject(null, null, error, additionalData));
                params.localErrors && params.localErrors.push(createErrorObject(null, null, error, additionalData));
                hasError = true;
            }
        }
        if (hasError && params.defaultReturn) {
            resolve(params.defaultReturn);
        }
    });
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBox = function (params_) {
    var params = __assign({ errorMessage: 'general error' }, params_);
    var output = params.defaultReturn;
    var hasError = false;
    var createErrorObject = function (code, message, error, additionalData) {
        if (additionalData === void 0) { additionalData = {}; }
        return ({
            code: code || params.errorCode,
            section: params.section,
            message: message || params.errorMessage,
            data: __assign({}, (params.errorData || {}), additionalData),
            error: error,
        });
    };
    var createWarnObject = function (code, message, additionalData) {
        if (additionalData === void 0) { additionalData = {}; }
        return ({
            code: code,
            section: params.section,
            message: message || params.errorMessage,
            data: __assign({}, (params.errorData || {}), additionalData),
        });
    };
    try {
        output = params.run(function (code, message, data) {
            params.errors && params.errors.push(createErrorObject(code, message, null, data));
            params.localErrors && params.localErrors.push(createErrorObject(code, message, null, data));
            hasError = true;
        }, function (code, message, data) {
            params.warns && params.warns.push(createWarnObject(code, message, data));
            params.localWarns && params.localWarns.push(createWarnObject(code, message, data));
        });
    }
    catch (error) {
        var additionalData = { error: error, message: error.message, uncautchedError: true };
        if (params.exceptionsAsWarns) {
            params.warns && params.warns.push(createWarnObject(null, null, additionalData));
            params.localWarns && params.localWarns.push(createWarnObject(null, null, additionalData));
        }
        else {
            params.errors && params.errors.push(createErrorObject(null, null, error, additionalData));
            params.localErrors && params.localErrors.push(createErrorObject(null, null, error, additionalData));
            hasError = true;
        }
    }
    if (hasError && params.defaultReturn) {
        return params.defaultReturn;
    }
    return output;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var runBox = function (params_) {
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
            params.warns && params.warns.push(createWarnObject(undefined, undefined, additionalData));
            params.localWarns && params.localWarns.push(createWarnObject(undefined, undefined, additionalData));
        }
        else {
            params.errors && params.errors.push(createErrorObject(undefined, undefined, error, additionalData));
            params.localErrors && params.localErrors.push(createErrorObject(undefined, undefined, error, additionalData));
            hasError = true;
        }
    }
    if (hasError && params.defaultReturn) {
        return params.defaultReturn;
    }
    return output;
};
//# sourceMappingURL=runBox.js.map
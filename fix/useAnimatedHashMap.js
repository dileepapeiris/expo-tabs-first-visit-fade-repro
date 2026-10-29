'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useAnimatedHashMap", {
    enumerable: true,
    get: function() {
        return useAnimatedHashMap;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function useAnimatedHashMap({ routes, index }) {
    const refs = _react().useRef({});
    const focusedKeyRef = _react().useRef(undefined);
    const previous = refs.current;
    const previousFocusedKey = focusedKeyRef.current;
    focusedKeyRef.current = routes[index]?.key;
    const routeKeys = Object.keys(previous);
    if (routes.length === routeKeys.length && routes.every((route)=>routeKeys.includes(route.key))) {
        return previous;
    }
    refs.current = {};
    const previousIndex = routes.findIndex((route)=>route.key === previousFocusedKey);
    routes.forEach(({ key }, i)=>{
        if (previous[key]) {
            refs.current[key] = previous[key];
            return;
        }
        const entersFrom = i === index && previousIndex !== -1 && previousIndex !== i;
        const position = entersFrom ? (i > previousIndex ? 1 : -1) : i === index ? 0 : i >= index ? 1 : -1;
        refs.current[key] = new (0, _reactnative().Animated).Value(position);
    });
    return refs.current;
}

//# sourceMappingURL=useAnimatedHashMap.js.map

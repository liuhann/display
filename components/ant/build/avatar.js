/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 953:
/***/ ((module) => {

module.exports = (function() { return this["antd"]; }());

/***/ }),

/***/ 6216:
/***/ ((module) => {

module.exports = (function() { return this["antd_css"]; }());

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ index_d)
});

// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__(953);
// EXTERNAL MODULE: external "antd_css"
var external_antd_css_ = __webpack_require__(6216);
;// CONCATENATED MODULE: ./src/avatar/Avatar.jsx


/* harmony default export */ const Avatar = (({
  shape = 'circle',
  icon,
  src,
  alt,
  badgeDot,
  badgeCount,
  width = 48,
  height
}) => {
  const InnerAvatar = () => {
    return /*#__PURE__*/React.createElement(external_antd_.Avatar, {
      size: width,
      shape: shape,
      src: src,
      alt: alt
    }, alt);
  };

  const Badged = () => {
    if (badgeDot) {
      return /*#__PURE__*/React.createElement(external_antd_.Badge, {
        dot: true
      }, /*#__PURE__*/React.createElement(InnerAvatar, null));
    } else if (badgeCount) {
      return /*#__PURE__*/React.createElement(external_antd_.Badge, {
        count: badgeCount
      }, /*#__PURE__*/React.createElement(InnerAvatar, null));
    } else {
      return /*#__PURE__*/React.createElement(InnerAvatar, null);
    }
  };

  return /*#__PURE__*/React.createElement(Badged, null);
});
;// CONCATENATED MODULE: ./src/avatar/index.d.js
 // StoryBook CSF格式，同时也是UI组件的描述格式

/* harmony default export */ const index_d = ({
  title: '头像',
  name: 'Avatar',
  component: Avatar,
  // 可配置属性列表，具体规则看样例
  props: [{
    name: 'shape',
    type: 'enum',
    options: ['square', 'circle']
  }, {
    name: 'alt',
    type: 'string'
  }, {
    name: 'src',
    type: 'string',
    control: 'file'
  }, {
    name: 'badgeDot',
    type: 'boolean',
    value: false
  }, {
    name: 'badgeCount',
    type: 'number'
  }]
});
})();

this["display-ant/build/avatar.js.js"] = __webpack_exports__;
/******/ })()
;
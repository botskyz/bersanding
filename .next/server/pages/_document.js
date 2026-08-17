"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "(pages-dir-node)/./src/pages/_document.tsx":
/*!*********************************!*\
  !*** ./src/pages/_document.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Document)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst isPlayground = \"false\" === 'true';\n// The playground preview is a `next dev` server behind a proxy that cannot carry a\n// WebSocket upgrade, so Next's HMR client never connects. Left alone it does not\n// just fail quietly: it counts reconnects, and on the 26th it calls\n// window.location.reload() (next/dist/client/dev/hot-reloader/pages/websocket.js).\n// At 5 tries a second apart then 20 at five seconds, that reloads the preview the\n// user is looking at every ~105 seconds, forever — wiping scroll position and form\n// state, and refreshing the platform's idle timer so an abandoned tab holds a\n// container open. Handing the client an inert socket that never opens means\n// onerror/onclose never fire, so the reconnect counter never advances.\n// Nothing is lost: Fast Refresh could not work through this proxy anyway, and the\n// platform reloads the preview itself once an agent turn finishes.\n// Matched on the HMR endpoint so the app's own WebSockets are untouched, and gated\n// on the playground flag so it is inert in a deployed build.\nconst inertHmrSocket = `(function () {\n  var Native = window.WebSocket\n  if (!Native) return\n  function Stub(url, protocols) {\n    if (typeof url === 'string' && url.indexOf('/_next/webpack-hmr') !== -1) {\n      return {\n        readyState: 0,\n        close: function () {},\n        send: function () {},\n        addEventListener: function () {},\n        removeEventListener: function () {}\n      }\n    }\n    return new Native(url, protocols)\n  }\n  Stub.prototype = Native.prototype\n  Stub.CONNECTING = 0\n  Stub.OPEN = 1\n  Stub.CLOSING = 2\n  Stub.CLOSED = 3\n  window.WebSocket = Stub\n})()`;\nfunction Document() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Html, {\n        lang: \"id\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Head, {\n                children: isPlayground && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"script\", {\n                    dangerouslySetInnerHTML: {\n                        __html: inertHmrSocket\n                    }\n                }, void 0, false, {\n                    fileName: \"/Users/andi/Bersanding/src/pages/_document.tsx\",\n                    lineNumber: 45,\n                    columnNumber: 26\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/andi/Bersanding/src/pages/_document.tsx\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Main, {}, void 0, false, {\n                        fileName: \"/Users/andi/Bersanding/src/pages/_document.tsx\",\n                        lineNumber: 48,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript, {}, void 0, false, {\n                        fileName: \"/Users/andi/Bersanding/src/pages/_document.tsx\",\n                        lineNumber: 49,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/andi/Bersanding/src/pages/_document.tsx\",\n                lineNumber: 47,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/andi/Bersanding/src/pages/_document.tsx\",\n        lineNumber: 43,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fZG9jdW1lbnQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE0RDtBQUU1RCxNQUFNSSxlQUFlQyxPQUFxQyxLQUFLO0FBRS9ELG1GQUFtRjtBQUNuRixpRkFBaUY7QUFDakYsb0VBQW9FO0FBQ3BFLG1GQUFtRjtBQUNuRixrRkFBa0Y7QUFDbEYsbUZBQW1GO0FBQ25GLDhFQUE4RTtBQUM5RSw0RUFBNEU7QUFDNUUsdUVBQXVFO0FBQ3ZFLGtGQUFrRjtBQUNsRixtRUFBbUU7QUFDbkUsbUZBQW1GO0FBQ25GLDZEQUE2RDtBQUM3RCxNQUFNRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJwQixDQUFDO0FBRVUsU0FBU0M7SUFDdEIscUJBQ0UsOERBQUNULCtDQUFJQTtRQUFDVSxNQUFLOzswQkFDVCw4REFBQ1QsK0NBQUlBOzBCQUNGRyw4QkFBZ0IsOERBQUNPO29CQUFPQyx5QkFBeUI7d0JBQUVDLFFBQVFMO29CQUFlOzs7Ozs7Ozs7OzswQkFFN0UsOERBQUNNOztrQ0FDQyw4REFBQ1osK0NBQUlBOzs7OztrQ0FDTCw4REFBQ0MscURBQVVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUluQiIsInNvdXJjZXMiOlsiL1VzZXJzL2FuZGkvQmVyc2FuZGluZy9zcmMvcGFnZXMvX2RvY3VtZW50LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdG1sLCBIZWFkLCBNYWluLCBOZXh0U2NyaXB0IH0gZnJvbSAnbmV4dC9kb2N1bWVudCdcblxuY29uc3QgaXNQbGF5Z3JvdW5kID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfSVNfUExBWUdST1VORCA9PT0gJ3RydWUnXG5cbi8vIFRoZSBwbGF5Z3JvdW5kIHByZXZpZXcgaXMgYSBgbmV4dCBkZXZgIHNlcnZlciBiZWhpbmQgYSBwcm94eSB0aGF0IGNhbm5vdCBjYXJyeSBhXG4vLyBXZWJTb2NrZXQgdXBncmFkZSwgc28gTmV4dCdzIEhNUiBjbGllbnQgbmV2ZXIgY29ubmVjdHMuIExlZnQgYWxvbmUgaXQgZG9lcyBub3Rcbi8vIGp1c3QgZmFpbCBxdWlldGx5OiBpdCBjb3VudHMgcmVjb25uZWN0cywgYW5kIG9uIHRoZSAyNnRoIGl0IGNhbGxzXG4vLyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkgKG5leHQvZGlzdC9jbGllbnQvZGV2L2hvdC1yZWxvYWRlci9wYWdlcy93ZWJzb2NrZXQuanMpLlxuLy8gQXQgNSB0cmllcyBhIHNlY29uZCBhcGFydCB0aGVuIDIwIGF0IGZpdmUgc2Vjb25kcywgdGhhdCByZWxvYWRzIHRoZSBwcmV2aWV3IHRoZVxuLy8gdXNlciBpcyBsb29raW5nIGF0IGV2ZXJ5IH4xMDUgc2Vjb25kcywgZm9yZXZlciDigJQgd2lwaW5nIHNjcm9sbCBwb3NpdGlvbiBhbmQgZm9ybVxuLy8gc3RhdGUsIGFuZCByZWZyZXNoaW5nIHRoZSBwbGF0Zm9ybSdzIGlkbGUgdGltZXIgc28gYW4gYWJhbmRvbmVkIHRhYiBob2xkcyBhXG4vLyBjb250YWluZXIgb3Blbi4gSGFuZGluZyB0aGUgY2xpZW50IGFuIGluZXJ0IHNvY2tldCB0aGF0IG5ldmVyIG9wZW5zIG1lYW5zXG4vLyBvbmVycm9yL29uY2xvc2UgbmV2ZXIgZmlyZSwgc28gdGhlIHJlY29ubmVjdCBjb3VudGVyIG5ldmVyIGFkdmFuY2VzLlxuLy8gTm90aGluZyBpcyBsb3N0OiBGYXN0IFJlZnJlc2ggY291bGQgbm90IHdvcmsgdGhyb3VnaCB0aGlzIHByb3h5IGFueXdheSwgYW5kIHRoZVxuLy8gcGxhdGZvcm0gcmVsb2FkcyB0aGUgcHJldmlldyBpdHNlbGYgb25jZSBhbiBhZ2VudCB0dXJuIGZpbmlzaGVzLlxuLy8gTWF0Y2hlZCBvbiB0aGUgSE1SIGVuZHBvaW50IHNvIHRoZSBhcHAncyBvd24gV2ViU29ja2V0cyBhcmUgdW50b3VjaGVkLCBhbmQgZ2F0ZWRcbi8vIG9uIHRoZSBwbGF5Z3JvdW5kIGZsYWcgc28gaXQgaXMgaW5lcnQgaW4gYSBkZXBsb3llZCBidWlsZC5cbmNvbnN0IGluZXJ0SG1yU29ja2V0ID0gYChmdW5jdGlvbiAoKSB7XG4gIHZhciBOYXRpdmUgPSB3aW5kb3cuV2ViU29ja2V0XG4gIGlmICghTmF0aXZlKSByZXR1cm5cbiAgZnVuY3Rpb24gU3R1Yih1cmwsIHByb3RvY29scykge1xuICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJyAmJiB1cmwuaW5kZXhPZignL19uZXh0L3dlYnBhY2staG1yJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWFkeVN0YXRlOiAwLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge30sXG4gICAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKCkge31cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOYXRpdmUodXJsLCBwcm90b2NvbHMpXG4gIH1cbiAgU3R1Yi5wcm90b3R5cGUgPSBOYXRpdmUucHJvdG90eXBlXG4gIFN0dWIuQ09OTkVDVElORyA9IDBcbiAgU3R1Yi5PUEVOID0gMVxuICBTdHViLkNMT1NJTkcgPSAyXG4gIFN0dWIuQ0xPU0VEID0gM1xuICB3aW5kb3cuV2ViU29ja2V0ID0gU3R1YlxufSkoKWBcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRG9jdW1lbnQoKSB7XG4gIHJldHVybiAoXG4gICAgPEh0bWwgbGFuZz1cImlkXCI+XG4gICAgICA8SGVhZD5cbiAgICAgICAge2lzUGxheWdyb3VuZCAmJiA8c2NyaXB0IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogaW5lcnRIbXJTb2NrZXQgfX0gLz59XG4gICAgICA8L0hlYWQ+XG4gICAgICA8Ym9keT5cbiAgICAgICAgPE1haW4gLz5cbiAgICAgICAgPE5leHRTY3JpcHQgLz5cbiAgICAgIDwvYm9keT5cbiAgICA8L0h0bWw+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJIdG1sIiwiSGVhZCIsIk1haW4iLCJOZXh0U2NyaXB0IiwiaXNQbGF5Z3JvdW5kIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0lTX1BMQVlHUk9VTkQiLCJpbmVydEhtclNvY2tldCIsIkRvY3VtZW50IiwibGFuZyIsInNjcmlwdCIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiYm9keSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_document.tsx\n");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./src/pages/_document.tsx")));
module.exports = __webpack_exports__;

})();
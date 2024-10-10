/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./chats.js":
/*!******************!*\
  !*** ./chats.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _chats_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chats.css */ \"./chats.css\");\n\nvar importAll = function importAll(r) {\n  return r.keys().map(r);\n};\nvar avatars = importAll(__webpack_require__(\"./assets/avatars sync \\\\.(png%7Cjpe?g%7Csvg)$\"));\nvar avatarDefault = avatars.find(function (src) {\n  return src.includes('avatarDefault');\n});\nvar filteredAvatars = avatars.filter(function (src) {\n  return src !== avatarDefault;\n});\ndocument.addEventListener('DOMContentLoaded', function () {\n  var chatList = document.querySelector('.chat-list');\n  var createChatButton = document.querySelector('.floating-create-button');\n  var burgerButton = document.querySelector('.burger-button');\n  var searchButton = document.querySelector('.search-button');\n  var headerTitle = document.querySelector('.header-title');\n  var chats = JSON.parse(localStorage.getItem('chats')) || [];\n  function getAvatarForChat(index) {\n    return filteredAvatars[index] || avatarDefault;\n  }\n  function renderChats() {\n    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';\n    chatList.innerHTML = '';\n    var filteredChats = chats.filter(function (chat) {\n      return chat.name.toLowerCase().includes(filter.toLowerCase());\n    });\n    filteredChats.forEach(function (chat, index) {\n      var messages = JSON.parse(localStorage.getItem(\"messages_\".concat(chat.id))) || [];\n      var lastMessageObj = messages.length > 0 ? messages[messages.length - 1] : null;\n      var lastMessage = lastMessageObj ? lastMessageObj.text : 'Нет сообщений';\n      var lastMessageTime = lastMessageObj ? lastMessageObj.time : '';\n      var li = document.createElement('li');\n      li.classList.add('chat-item');\n      li.onclick = function () {\n        window.location.href = \"index.html?chatId=\".concat(chat.id);\n      };\n      var avatar = document.createElement('div');\n      avatar.classList.add('chat-avatar');\n      avatar.style.backgroundImage = \"url(\".concat(getAvatarForChat(index), \")\");\n      var info = document.createElement('div');\n      info.classList.add('chat-info');\n      var name = document.createElement('div');\n      name.classList.add('chat-name');\n      name.textContent = chat.name;\n      var lastMsgContainer = document.createElement('div');\n      lastMsgContainer.classList.add('chat-last-message-container');\n      var lastMsg = document.createElement('div');\n      lastMsg.classList.add('chat-last-message');\n      lastMsg.textContent = lastMessage;\n      var lastMsgInfo = document.createElement('div');\n      lastMsgInfo.classList.add('chat-last-message-info');\n      var timeSpan = document.createElement('span');\n      timeSpan.classList.add('message-time');\n      timeSpan.textContent = lastMessageTime;\n      var checkIcon = document.createElement('span');\n      checkIcon.classList.add('material-icons', 'message-check');\n      checkIcon.textContent = 'check';\n      lastMsgInfo.appendChild(timeSpan);\n      lastMsgInfo.appendChild(checkIcon);\n      lastMsgContainer.appendChild(lastMsg);\n      lastMsgContainer.appendChild(lastMsgInfo);\n      info.appendChild(name);\n      info.appendChild(lastMsgContainer);\n      li.appendChild(avatar);\n      li.appendChild(info);\n      chatList.appendChild(li);\n    });\n  }\n  renderChats();\n  createChatButton.addEventListener('click', function () {\n    var chatName = prompt('Введите имя нового чата:');\n    if (chatName) {\n      var newChatId = chats.length + 1;\n      var newAvatar = avatarDefault;\n      var newChat = {\n        id: newChatId,\n        name: chatName,\n        avatar: newAvatar\n      };\n      chats.push(newChat);\n      localStorage.setItem('chats', JSON.stringify(chats));\n      var initialMessage = {\n        text: 'Чат создан',\n        time: new Date().toLocaleTimeString([], {\n          hour: '2-digit',\n          minute: '2-digit'\n        }),\n        nickname: 'Система'\n      };\n      var messages = [initialMessage];\n      localStorage.setItem(\"messages_\".concat(newChat.id), JSON.stringify(messages));\n      renderChats();\n    }\n  });\n  burgerButton.addEventListener('click', function () {\n    alert('Бургер-кнопка нажата');\n  });\n  searchButton.addEventListener('click', function () {\n    var searchTerm = prompt('Поиск:');\n    if (searchTerm !== null) {\n      renderChats(searchTerm);\n    }\n  });\n});\n\n//# sourceURL=webpack:///./chats.js?");

/***/ }),

/***/ "./chats.css":
/*!*******************!*\
  !*** ./chats.css ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./chats.css?");

/***/ }),

/***/ "./assets/avatars sync \\.(png%7Cjpe?g%7Csvg)$":
/*!******************************************************************!*\
  !*** ./assets/avatars/ sync nonrecursive \.(png%7Cjpe?g%7Csvg)$ ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./avatar1.png\": \"./assets/avatars/avatar1.png\",\n\t\"./avatar2.png\": \"./assets/avatars/avatar2.png\",\n\t\"./avatar3.png\": \"./assets/avatars/avatar3.png\",\n\t\"./avatar4.png\": \"./assets/avatars/avatar4.png\",\n\t\"./avatar5.png\": \"./assets/avatars/avatar5.png\",\n\t\"./avatar6.png\": \"./assets/avatars/avatar6.png\",\n\t\"./avatar7.png\": \"./assets/avatars/avatar7.png\",\n\t\"./avatarDefault.png\": \"./assets/avatars/avatarDefault.png\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./assets/avatars sync \\\\.(png%7Cjpe?g%7Csvg)$\";\n\n//# sourceURL=webpack:///./assets/avatars/_sync_nonrecursive_\\.(png%257Cjpe?");

/***/ }),

/***/ "./assets/avatars/avatar1.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar1.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"e1b287976a0447479cd9.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar1.png?");

/***/ }),

/***/ "./assets/avatars/avatar2.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar2.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"cce270bbb225a2043e48.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar2.png?");

/***/ }),

/***/ "./assets/avatars/avatar3.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar3.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"7d81fac6b5a9806dce7e.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar3.png?");

/***/ }),

/***/ "./assets/avatars/avatar4.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar4.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"47eaeda66031fd297708.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar4.png?");

/***/ }),

/***/ "./assets/avatars/avatar5.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar5.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"d27e67326f4f4551e7f6.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar5.png?");

/***/ }),

/***/ "./assets/avatars/avatar6.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar6.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"8eec523f08bc1bc2093e.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar6.png?");

/***/ }),

/***/ "./assets/avatars/avatar7.png":
/*!************************************!*\
  !*** ./assets/avatars/avatar7.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"a91be7c58ed9e66fed0b.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatar7.png?");

/***/ }),

/***/ "./assets/avatars/avatarDefault.png":
/*!******************************************!*\
  !*** ./assets/avatars/avatarDefault.png ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"f5c9bf8a40dd33824de1.png\";\n\n//# sourceURL=webpack:///./assets/avatars/avatarDefault.png?");

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./chats.js");
/******/ 	
/******/ })()
;
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ \"./index.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var form = document.querySelector('form');\n  var input = document.querySelector('.form-input');\n  var messageList = document.querySelector('.message-list');\n  var nicknameInput = document.getElementById('nickname');\n  function loadMessages() {\n    var messages = JSON.parse(localStorage.getItem('messages')) || [];\n    messageList.innerHTML = '';\n    messages.forEach(function (msg) {\n      addMessage(msg.text, msg.time, msg.nickname);\n    });\n    updateMessageClasses();\n    scrollToBottom();\n  }\n  function addMessage(text, time, nickname) {\n    var li = document.createElement('li');\n    li.classList.add('message');\n    var currentNickname = nicknameInput.value.trim();\n    if (nickname === currentNickname) {\n      li.classList.add('my');\n    }\n    var messageText = document.createElement('span');\n    messageText.textContent = text;\n    var messageInfo = document.createElement('div');\n    messageInfo.classList.add('message-info');\n    messageInfo.textContent = \"\".concat(nickname, \" \").concat(time, \" \");\n    var checkIcon = document.createElement('span');\n    checkIcon.classList.add('material-icons');\n    checkIcon.textContent = 'check';\n    messageInfo.appendChild(checkIcon);\n    li.appendChild(messageText);\n    li.appendChild(messageInfo);\n    messageList.appendChild(li);\n  }\n  function scrollToBottom() {\n    messageList.scrollTop = messageList.scrollHeight;\n  }\n  function handleSubmit(event) {\n    event.preventDefault();\n    var text = input.value.trim();\n    var nickname = nicknameInput.value.trim() || 'Anonymous';\n    if (text !== '') {\n      var now = new Date();\n      var time = now.toLocaleTimeString([], {\n        hour: '2-digit',\n        minute: '2-digit'\n      });\n      var newMessage = {\n        text: text,\n        time: time,\n        nickname: nickname\n      };\n      var messages = JSON.parse(localStorage.getItem('messages')) || [];\n      messages.push(newMessage);\n      localStorage.setItem('messages', JSON.stringify(messages));\n      addMessage(text, time, nickname);\n      updateMessageClasses();\n      scrollToBottom();\n      input.value = '';\n    }\n  }\n  function updateMessageClasses() {\n    var currentNickname = nicknameInput.value.trim();\n    var messages = JSON.parse(localStorage.getItem('messages')) || [];\n    var messageElements = messageList.querySelectorAll('.message');\n    messageElements.forEach(function (msgElement, index) {\n      var message = messages[index];\n      if (message.nickname === currentNickname) {\n        msgElement.classList.add('my');\n      } else {\n        msgElement.classList.remove('my');\n      }\n    });\n  }\n  nicknameInput.addEventListener('input', function () {\n    updateMessageClasses();\n  });\n  form.addEventListener('submit', handleSubmit);\n  loadMessages();\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./index.css":
/*!*******************!*\
  !*** ./index.css ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./index.css?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;
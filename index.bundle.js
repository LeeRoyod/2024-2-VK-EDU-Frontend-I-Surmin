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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ \"./index.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var form = document.querySelector('.chat-form');\n  var input = document.querySelector('.form-input');\n  var messageList = document.querySelector('.message-list');\n  var chatTitle = document.getElementById('chat-title');\n  var urlParams = new URLSearchParams(window.location.search);\n  var chatId = urlParams.get('chatId');\n  var chats = JSON.parse(localStorage.getItem('chats')) || [];\n  var userNickname = 'Илья';\n  if (chatId) {\n    var currentChat = chats.find(function (chat) {\n      return chat.id === parseInt(chatId);\n    });\n    if (currentChat) {\n      chatTitle.textContent = currentChat.name;\n    } else {\n      chatTitle.textContent = 'Чат';\n    }\n  } else {\n    chatTitle.textContent = 'Чат';\n  }\n  function loadMessages() {\n    var messages = JSON.parse(localStorage.getItem(\"messages_\".concat(chatId))) || [];\n    messageList.innerHTML = '';\n    messages.forEach(function (msg) {\n      addMessage(msg.text, msg.time, msg.nickname, msg.read);\n    });\n    updateMessageClasses();\n    scrollToBottom();\n  }\n  function addMessage(text, time, nickname, read) {\n    var li = document.createElement('li');\n    li.classList.add('message');\n    if (nickname === userNickname) {\n      li.classList.add('my');\n    }\n    var messageText = document.createElement('span');\n    messageText.textContent = text;\n    var messageInfo = document.createElement('div');\n    messageInfo.classList.add('message-info');\n    messageInfo.textContent = \"\".concat(nickname, \" \").concat(time, \" \");\n    var checkIcon = document.createElement('span');\n    checkIcon.classList.add('material-icons');\n    if (read) {\n      checkIcon.textContent = 'done_all';\n      checkIcon.classList.add('message-check');\n    } else {\n      checkIcon.textContent = 'done';\n    }\n    messageInfo.appendChild(checkIcon);\n    li.appendChild(messageText);\n    li.appendChild(messageInfo);\n    messageList.appendChild(li);\n  }\n  function scrollToBottom() {\n    messageList.scrollTop = messageList.scrollHeight;\n  }\n  function handleSubmit(event) {\n    event.preventDefault();\n    var text = input.value.trim();\n    var nickname;\n    var filterValue = document.querySelector('input[name=\"message-filter\"]:checked').value;\n    if (filterValue === 'my') {\n      nickname = userNickname;\n    } else {\n      nickname = chatTitle.textContent;\n    }\n    if (text !== '') {\n      var now = new Date();\n      var time = now.toLocaleTimeString([], {\n        hour: '2-digit',\n        minute: '2-digit'\n      });\n      var newMessage = {\n        text: text,\n        time: time,\n        nickname: nickname,\n        read: false\n      };\n      var messages = JSON.parse(localStorage.getItem(\"messages_\".concat(chatId))) || [];\n      messages.push(newMessage);\n      localStorage.setItem(\"messages_\".concat(chatId), JSON.stringify(messages));\n      addMessage(text, time, nickname, newMessage.read);\n      updateMessageClasses();\n      scrollToBottom();\n      input.value = '';\n    }\n  }\n  var filterRadios = document.querySelectorAll('input[name=\"message-filter\"]');\n  filterRadios.forEach(function (radio) {\n    radio.addEventListener('change', function () {\n      markMessagesAsRead();\n      updateMessageClasses();\n    });\n  });\n  function updateMessageClasses() {\n    var filterValue = document.querySelector('input[name=\"message-filter\"]:checked').value;\n    var messages = JSON.parse(localStorage.getItem(\"messages_\".concat(chatId))) || [];\n    var messageElements = messageList.querySelectorAll('.message');\n    messageElements.forEach(function (msgElement, index) {\n      var message = messages[index];\n      if (filterValue === 'my') {\n        if (message.nickname === userNickname) {\n          msgElement.classList.add('my');\n        } else {\n          msgElement.classList.remove('my');\n        }\n      } else {\n        if (message.nickname === userNickname) {\n          msgElement.classList.remove('my');\n        } else if (message.nickname !== 'Система') {\n          msgElement.classList.add('my');\n        }\n      }\n    });\n  }\n  function markMessagesAsRead() {\n    var messages = JSON.parse(localStorage.getItem(\"messages_\".concat(chatId))) || [];\n    var filterValue = document.querySelector('input[name=\"message-filter\"]:checked').value;\n    var updated = false;\n    messages.forEach(function (msg, index) {\n      if (filterValue === 'my' && msg.nickname !== userNickname && !msg.read) {\n        msg.read = true;\n        updated = true;\n      } else if (filterValue === 'others' && msg.nickname === userNickname && !msg.read) {\n        msg.read = true;\n        updated = true;\n      }\n    });\n    if (updated) {\n      localStorage.setItem(\"messages_\".concat(chatId), JSON.stringify(messages));\n      messageList.innerHTML = '';\n      messages.forEach(function (msg) {\n        addMessage(msg.text, msg.time, msg.nickname, msg.read);\n      });\n      scrollToBottom();\n    }\n  }\n  form.addEventListener('submit', handleSubmit);\n  loadMessages();\n});\n\n//# sourceURL=webpack:///./index.js?");

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
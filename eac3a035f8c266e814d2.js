import './index.css';
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('.chat-form');
  var input = document.querySelector('.form-input');
  var messageList = document.querySelector('.message-list');
  var chatTitle = document.getElementById('chat-title');
  var urlParams = new URLSearchParams(window.location.search);
  var chatId = urlParams.get('chatId');
  var chats = JSON.parse(localStorage.getItem('chats')) || [];
  var userNickname = 'Илья';
  if (chatId) {
    var currentChat = chats.find(function (chat) {
      return chat.id === parseInt(chatId);
    });
    if (currentChat) {
      chatTitle.textContent = currentChat.name;
    } else {
      chatTitle.textContent = 'Чат';
    }
  } else {
    chatTitle.textContent = 'Чат';
  }
  function loadMessages() {
    var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];
    messageList.innerHTML = '';
    messages.forEach(function (msg) {
      addMessage(msg.text, msg.time, msg.nickname, msg.read, false);
    });
    updateMessageClasses();
    scrollToBottom();
  }
  function addMessage(text, time, nickname, read) {
    var animate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var li = document.createElement('li');
    li.classList.add('message');
    if (nickname === userNickname) {
      li.classList.add('my');
    }
    if (nickname === 'Система') {
      li.classList.add('system');
    }
    if (animate) {
      if (nickname === 'Система') {
        li.classList.add('new-system-message');
        li.addEventListener('animationend', function () {
          li.classList.remove('new-system-message');
        });
      } else {
        li.classList.add('new-message');
        li.addEventListener('animationend', function () {
          li.classList.remove('new-message');
        });
      }
    }
    var messageText = document.createElement('span');
    messageText.textContent = text;
    var messageInfo = document.createElement('div');
    messageInfo.classList.add('message-info');
    messageInfo.textContent = "".concat(nickname, " ").concat(time, " ");
    var checkIcon = document.createElement('span');
    checkIcon.classList.add('material-icons');
    if (nickname === 'Система') {
      var infoIcon = document.createElement('span');
      infoIcon.classList.add('material-icons', 'system-icon');
      infoIcon.textContent = 'info';
      messageInfo.prepend(infoIcon);
    }
    if (read) {
      checkIcon.textContent = 'done_all';
      checkIcon.classList.add('message-check');
    } else {
      checkIcon.textContent = 'done';
    }
    messageInfo.appendChild(checkIcon);
    li.appendChild(messageText);
    li.appendChild(messageInfo);
    messageList.appendChild(li);
  }
  function scrollToBottom() {
    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior: 'smooth'
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    var text = input.value.trim();
    var nickname;
    var filterValue = document.querySelector('input[name="message-filter"]:checked').value;
    if (filterValue === 'my') {
      nickname = userNickname;
    } else {
      nickname = chatTitle.textContent;
    }
    if (text !== '') {
      var now = new Date();
      var time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      var newMessage = {
        text: text,
        time: time,
        nickname: nickname,
        read: false
      };
      var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];
      messages.push(newMessage);
      localStorage.setItem("messages_".concat(chatId), JSON.stringify(messages));
      addMessage(text, time, nickname, newMessage.read, true);
      updateMessageClasses();
      scrollToBottom();
      input.value = '';
    }
  }
  var filterRadios = document.querySelectorAll('input[name="message-filter"]');
  filterRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      markMessagesAsRead();
      updateMessageClasses();
    });
  });
  function updateMessageClasses() {
    var filterValue = document.querySelector('input[name="message-filter"]:checked').value;
    var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];
    var messageElements = messageList.querySelectorAll('.message');
    messageElements.forEach(function (msgElement, index) {
      var message = messages[index];
      var checkIcon = msgElement.querySelector('.message-check');
      if (filterValue === 'my') {
        if (message.nickname === userNickname) {
          msgElement.classList.add('my');
          if (checkIcon) {
            checkIcon.style.display = 'inline';
          }
        } else {
          msgElement.classList.remove('my');
          if (checkIcon) {
            checkIcon.style.display = 'none';
          }
        }
      } else if (filterValue === 'others') {
        if (message.nickname === userNickname) {
          msgElement.classList.remove('my');
          if (checkIcon) {
            checkIcon.style.display = 'none';
          }
        } else if (message.nickname !== 'Система') {
          msgElement.classList.add('my');
          if (checkIcon) {
            checkIcon.style.display = 'inline';
          }
        }
      }
    });
  }
  function markMessagesAsRead() {
    var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];
    var filterValue = document.querySelector('input[name="message-filter"]:checked').value;
    var updated = false;
    messages.forEach(function (msg, index) {
      if (filterValue === 'my' && msg.nickname !== userNickname && !msg.read) {
        msg.read = true;
        updated = true;
      } else if (filterValue === 'others' && msg.nickname === userNickname && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem("messages_".concat(chatId), JSON.stringify(messages));
      messageList.innerHTML = '';
      messages.forEach(function (msg) {
        addMessage(msg.text, msg.time, msg.nickname, msg.read, false);
      });
      scrollToBottom();
    }
  }
  var typingTimeout;
  input.addEventListener('input', function () {
    clearTimeout(typingTimeout);
    document.querySelector('.typing-indicator').style.display = 'flex';
    typingTimeout = setTimeout(function () {
      document.querySelector('.typing-indicator').style.display = 'none';
    }, 2000);
  });
  form.addEventListener('submit', handleSubmit);
  loadMessages();
});
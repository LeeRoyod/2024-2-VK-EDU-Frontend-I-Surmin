import './index.css';
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('.chat-form');
  var input = document.querySelector('.form-input');
  var messageList = document.querySelector('.message-list');
  var chatTitle = document.getElementById('chat-title');
  var urlParams = new URLSearchParams(window.location.search);
  var chatId = urlParams.get('chatId');
  var chats = JSON.parse(localStorage.getItem('chats')) || [];
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
      addMessage(msg.text, msg.time, msg.nickname);
    });
    updateMessageClasses();
    scrollToBottom();
  }
  function addMessage(text, time, nickname) {
    var li = document.createElement('li');
    li.classList.add('message');
    if (nickname === 'Илья') {
      li.classList.add('my');
    }
    var messageText = document.createElement('span');
    messageText.textContent = text;
    var messageInfo = document.createElement('div');
    messageInfo.classList.add('message-info');
    messageInfo.textContent = "".concat(nickname, " ").concat(time, " ");
    var checkIcon = document.createElement('span');
    checkIcon.classList.add('material-icons');
    checkIcon.textContent = 'check';
    messageInfo.appendChild(checkIcon);
    li.appendChild(messageText);
    li.appendChild(messageInfo);
    messageList.appendChild(li);
  }
  function scrollToBottom() {
    messageList.scrollTop = messageList.scrollHeight;
  }
  function handleSubmit(event) {
    event.preventDefault();
    var text = input.value.trim();
    var nickname;
    var filterValue = document.querySelector('input[name="message-filter"]:checked').value;
    if (filterValue === 'my') {
      nickname = 'Илья';
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
        nickname: nickname
      };
      var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];
      messages.push(newMessage);
      localStorage.setItem("messages_".concat(chatId), JSON.stringify(messages));
      addMessage(text, time, nickname);
      updateMessageClasses();
      scrollToBottom();
      input.value = '';
    }
  }
  var filterRadios = document.querySelectorAll('input[name="message-filter"]');
  filterRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      updateMessageClasses();
    });
  });
  function updateMessageClasses() {
    var filterValue = document.querySelector('input[name="message-filter"]:checked').value;
    var myNickname = 'Илья'; // Или получить из nicknameInput.value.trim()
    var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];
    var messageElements = messageList.querySelectorAll('.message');
    messageElements.forEach(function (msgElement, index) {
      var message = messages[index];
      if (filterValue === 'my') {
        if (message.nickname === myNickname) {
          msgElement.classList.add('my');
        } else {
          msgElement.classList.remove('my');
        }
      } else {
        if (message.nickname === myNickname) {
          msgElement.classList.remove('my');
        } else if (message.nickname !== 'Система') {
          msgElement.classList.add('my');
        }
      }
    });
  }
  form.addEventListener('submit', handleSubmit);
  loadMessages();
});
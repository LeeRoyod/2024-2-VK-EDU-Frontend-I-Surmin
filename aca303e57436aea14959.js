// src/index.js
import './index.css';
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('.chat-form'); // Убедитесь, что класс формы соответствует
  var input = document.querySelector('.form-input');
  var messageList = document.querySelector('.message-list');
  var chatTitle = document.getElementById('chat-title');

  // Получение chatId из URL
  var urlParams = new URLSearchParams(window.location.search);
  var chatId = urlParams.get('chatId');

  // Определение переменной chats
  var chats = JSON.parse(localStorage.getItem('chats')) || [];

  // Установка заголовка чата
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

    // Добавляем класс 'my' только если сообщение от текущего пользователя
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
      // Если выбрано "Мои сообщения", отображаем "Вы"
      nickname = 'Илья';
    } else {
      // Если выбрано "Сообщения собеседника", отображаем имя чата (собеседника)
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

  // Выбираем все радиокнопки с именем "message-filter"
  var filterRadios = document.querySelectorAll('input[name="message-filter"]');

  // Добавляем обработчик события "change" ко всем радиокнопкам
  filterRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      updateMessageClasses(); // Обновляем визуальное отображение сообщений при изменении фильтра
    });
  });
  function updateMessageClasses() {
    // Получаем текущее значение фильтра
    var filterValue = document.querySelector('input[name="message-filter"]:checked').value;

    // Определяем имя пользователя. Можно сделать более гибким, если имя хранится динамически.
    var myNickname = 'Илья'; // Или получить из nicknameInput.value.trim()

    // Получаем список сообщений из localStorage
    var messages = JSON.parse(localStorage.getItem("messages_".concat(chatId))) || [];

    // Получаем все элементы сообщений в DOM
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
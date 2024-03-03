const socket = io();
const clientsTotal = document.querySelector(".clients-total");
const messageContainer = document.querySelector(".message-container");
const nameInput = document.querySelector(".name-input");
const messageForm = document.querySelector(".message-form");
const messageInput = document.querySelector(".message-input");

const Ring =  new Audio('ring.wav')


new EmojiPicker({
  trigger: [
    {
      insertInto: ['.message-input'],
      selector: '.emojiBtn'
    }
  ]
})

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});
messageInput.addEventListener("keypress", (e) => {
  let feedback = `${nameInput.value} is typing . . .`;
  socket.emit("feedback", feedback);
});
messageInput.addEventListener("blur", (e) => {
  let feedback = "";
  socket.emit("feedback", feedback);
});

messageInput.addEventListener("focus", (e) => {
  let feedback = `${nameInput.value} is typing . . .`;
  socket.emit("feedback", feedback);
});

function sendMessage() {
  if(messageInput.value =="") return
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUl(true, data);
  messageInput.value = "";
}

socket.on("feedback", (feedback) => {
  clearFeedback()
  const element = ` <li class="message-feedback">
  <p class="feedback" id="feedback">${feedback}</p>
</li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
});

socket.on("chat-message", (data) => {
  Ring.play()
  addMessageToUl(false, data);
});

function addMessageToUl(isOwnMessage, data) {
  clearFeedback()
  const element = `
  <li class="${isOwnMessage ? "message-right" : "message-left"}">
  <p class="message">${data.message}<span>${data.name} | ${moment(data.dateTime).fromNow()}</span>
  </p>
</li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`;
});

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => element.parentNode.removeChild(element));
}

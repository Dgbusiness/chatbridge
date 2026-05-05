const chat = document.getElementById('chat');
const MESSAGE_TTL = 90000;
const MAX_MESSAGES = 10;

function removeDiv(div) {
  if (!div.parentNode) return;
  div.style.animation = 'fadeOut 0.8s forwards';
  setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 800);
}

setInterval(() => {
  const now = Date.now();
  for (const div of [...chat.children]) {
    if (now - parseInt(div.dataset.addedAt) > MESSAGE_TTL) removeDiv(div);
  }
}, 2000);

function addMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('chatMsg');
  div.dataset.addedAt = Date.now();
  div.innerHTML = `
    <span class="content">
      <span class="badges">
        <img src="assets/${msg.platform}.ico" class="badge">
        ${msg.badge ? `<img src='assets/${msg.badge}.png' class="badge">` : ''}
        <span style="color:${msg.userColor};">${msg.user}</span>:
      </span>
    </span>
    <span class="message"> ${msg.text}</span>
  `;

  chat.appendChild(div);

  if (chat.children.length > MAX_MESSAGES) {
    const first = chat.firstElementChild;
    first.classList.add('fade-out');
    setTimeout(() => { if (first.parentNode) first.parentNode.removeChild(first); }, 800);
  }
}

function connect() {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = (e) => addMessage(JSON.parse(e.data));
  ws.onclose = () => setTimeout(connect, 3000);
}

connect();

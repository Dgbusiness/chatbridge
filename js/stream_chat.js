const ws = new WebSocket('ws://localhost:8080');
const chat = document.getElementById('chat');

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  const div = document.createElement('div');

  div.classList.add('chatMsg');
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

  if (chat.childNodes.length > 10) {
    const first = chat.firstChild;
    first.classList.add('fade-out');
    setTimeout(() => chat.removeChild(first), 800);
  }

  setTimeout(() => {
    div.style.animation = 'fadeOut 0.8s forwards';
    setTimeout(() => {
      if (div.parentNode === chat) chat.removeChild(div);
    }, 800);
  }, 90000);
};

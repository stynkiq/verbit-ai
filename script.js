const chatLog = document.getElementById('chat-log');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendMessage() {
  const query = input.value.trim();
  if (!query) return;
  addMessage('user', query);
  input.value = '';

  // Show a temporary “typing” message
  const typing = document.createElement('div');
  typing.className = 'message assistant';
  typing.textContent = '…';
  chatLog.appendChild(typing);
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    });
    const data = await res.json();
    typing.remove();
    addMessage('assistant', data.reply || '(no reply)');
  } catch (err) {
    typing.remove();
    addMessage('assistant', 'Error contacting the AI backend.');
  }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

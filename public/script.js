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

  // Show temporary "typing" message
  const typing = document.createElement('div');
  typing.className = 'message assistant';
  typing.textContent = '…';
  chatLog.appendChild(typing);
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const res = await fetch('/chat', {  // FIXED URL to match server
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    });

    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const data = await res.json();
    typing.remove();

    const reply = typeof data.reply === 'string' ? data.reply : '(no reply)';
    addMessage('assistant', reply);
  } catch (err) {
    console.error('Error sending message:', err);
    typing.remove();
    addMessage('assistant', 'Error contacting the AI backend. Please try again.');
  }
}

sendBtn.addEventListener('click', sendMessage);

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

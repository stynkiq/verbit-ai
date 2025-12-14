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

    // Check if the response is ok (status 200-299)
    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const data = await res.json();
    typing.remove();
    
    // Ensure data.reply exists and is a string
    const reply = typeof data.reply === 'string' ? data.reply : '(no reply)';
    addMessage('assistant', reply);
  } catch (err) {
    console.error('Error sending message:', err); // Logs error for debugging
    typing.remove();
    addMessage('assistant', 'Error contacting the AI backend. Please try again.');
  }
}

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message on Enter key press
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent form submission if inside a form
    sendMessage();
  }
});

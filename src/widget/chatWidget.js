(function () {
  // Inject Bootstrap CSS
  const bootstrap = document.createElement("link");
  bootstrap.rel = "stylesheet";
  bootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
  document.head.appendChild(bootstrap);

  // Create chat container
  const chatContainer = document.createElement("div");
  chatContainer.id = "valley-chat-widget";
  chatContainer.style.position = "fixed";
  chatContainer.style.bottom = "20px";
  chatContainer.style.right = "20px";
  chatContainer.style.width = "350px";
  chatContainer.style.zIndex = "9999";

  // Inner HTML
  chatContainer.innerHTML = `
    <div class="card shadow border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-primary text-white p-3 d-flex align-items-center justify-content-between">
        <strong>💬 Valley Heating AI Assistant</strong>
        <button type="button" class="btn btn-sm btn-light text-primary" onclick="document.getElementById('valley-chat-widget').remove()">×</button>
      </div>
      <div class="card-body p-3 bg-light" style="max-height: 300px; overflow-y: auto; font-size: 0.9rem;" id="chat-messages"></div>
      <div class="card-footer p-2 bg-white border-top">
        <form id="chat-form">
          <div class="input-group">
            <input type="text" id="chat-input" class="form-control form-control-sm" placeholder="Type your message..." required />
            <button type="submit" class="btn btn-sm btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.64-.576l-15 6a.5.5 0 0 0 0 .928l15 6a.5.5 0 0 0 .676-.518l-.5-6a.5.5 0 0 0-.5-.5h-6.5a.5.5 0 0 0 0 1H15l.5-6z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(chatContainer);

  // API and logic
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  const sessionId = localStorage.getItem("valley_chat_session") || crypto.randomUUID();
  localStorage.setItem("valley_chat_session", sessionId);

  const addMessage = (text, sender = "user") => {
    const div = document.createElement("div");
    div.className = `mb-1 text-${sender === "user" ? "end" : "start"}`;
    div.innerHTML = `<span class="badge bg-${sender === "user" ? "primary" : "secondary"} text-wrap text-break" style="white-space: pre-line;">${text}</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }),
      });

      const data = await res.json();
      addMessage(data.response || "Sorry, I didn’t understand that.", "bot");
    } catch (err) {
      console.error("Chat error:", err);
      addMessage("Server error. Please try again later.", "bot");
    }
  });
})();
(function () {
  let chatBox = document.createElement("div");
  chatBox.innerHTML = `<div id="chat-container">
        <div id="chat-header">Chat com Valley Heating</div>
        <div id="chat-messages"></div>
        <input type="text" id="chat-input" placeholder="Digite sua mensagem..." />
        <button id="send-btn">Enviar</button>
    </div>`;
  document.body.appendChild(chatBox);

  document.getElementById("send-btn").addEventListener("click", async () => {
    const input = document.getElementById("chat-input");
    const message = input.value;
    input.value = "";

    document.getElementById("chat-messages").innerHTML +=
      `<div>Você: ${message}</div>`;

    const response = await fetch("https://seu-servidor.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId: "user123" }),
    });
    const data = await response.json();

    document.getElementById("chat-messages").innerHTML +=
      `<div>Bot: ${data.response}</div>`;
  });
})();

const chatWindow = document.getElementById("chatWindow");
    const chatFab = document.getElementById("chatFab");
    const chatClose = document.getElementById("chatClose");
    const heroChatBtn = document.getElementById("heroChatBtn");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-tab");

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});
    const conversation = [];

    const openChat = () => {
      chatWindow.classList.add("open");
      chatInput.focus();
    };

    const closeChat = () => {
      chatWindow.classList.remove("open");
    };

    /* Safe event listeners */
    if(chatFab){
        chatFab.addEventListener("click", openChat);
    }
    
    if(heroChatBtn){
        heroChatBtn.addEventListener("click", openChat);
    }

    if(chatClose){
        chatClose.addEventListener("click", closeChat);
    }

    const addMessage = (text, role) => {
      const msg = document.createElement("div");
      msg.className = `msg ${role}`;
      msg.textContent = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const addTyping = () => {
      const typing = document.createElement("div");
      typing.className = "typing";
      typing.id = "typing";
      typing.textContent = "StoreBot is typing...";
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTyping = () => {
      const typing = document.getElementById("typing");
      if (typing) typing.remove();
    };

    const sendMessage = async () => {
      const text = chatInput.value.trim();
      if (!text || sendBtn.disabled) return;

      addMessage(text, "user");
      conversation.push({ role: "user", content: text });
      chatInput.value = "";

      sendBtn.disabled = true;
      addTyping();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: conversation })
        });

        if (!response.ok) throw new Error("Request failed");

        const data = await response.json();
        const reply = data.reply || "Sorry, I couldn't generate a response.";
        removeTyping();
        addMessage(reply, "bot");
        conversation.push({ role: "assistant", content: reply });
      } catch (err) {
        removeTyping();
        addMessage("Sorry, something went wrong. Please try again in a moment.", "bot");
      } finally {
        sendBtn.disabled = false;
      }
    };

    if(sendBtn){
        sendBtn.addEventListener("click", sendMessage);
    }

    if(chatInput){
        chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
    }

    const year = document.getElementById("year");
    if(year){
        year.textContent = new Date().getFullYear();
    }
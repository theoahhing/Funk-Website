/* =====================================================
   GLOBAL ELEMENT REFERENCES
===================================================== */

const chatWindow   = document.getElementById("chatWindow");
const chatFab      = document.getElementById("chatFab");
const chatClose    = document.getElementById("chatClose");
const heroChatBtn  = document.getElementById("heroChatBtn");
const chatMessages = document.getElementById("chatMessages");
const chatInput    = document.getElementById("chatInput");
const sendBtn      = document.getElementById("sendBtn");

const tabButtons   = document.querySelectorAll(".tab-btn");
const tabPanels    = document.querySelectorAll(".tab-panel");

const enquiryForm  = document.getElementById("enquiryForm");


/* =====================================================
   CONTACT PAGE - ENQUIRY FORM
===================================================== */

if (enquiryForm) {
  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = document.getElementById("enquiryName").value.trim();
    const email   = document.getElementById("enquiryEmail").value.trim();
    const phone   = document.getElementById("enquiryPhone").value.trim();
    const subject = document.getElementById("enquirySubject").value.trim() || "General Enquiry";
    const message = document.getElementById("enquiryMessage").value.trim();

    const body = `Name: ${name}
Email: ${email}
Phone: ${phone}

Enquiry:
${message}`;

    window.location.href =
      `mailto:admin@funksproduce.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}


/* =====================================================
   GLOBAL TABS (ABOUT / PRODUCTS)
===================================================== */

tabButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    if (button.classList.contains("disabled")) return;

    const target = button.getAttribute("data-tab");

    // Reset state
    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabPanels.forEach(panel => panel.classList.remove("active"));

    // Activate selected
    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});


/* =====================================================
   CHATBOT SYSTEM
===================================================== */

const conversation = [];

/* ---------- Chat Window Controls ---------- */

const openChat = () => {
  chatWindow.classList.add("open");
  chatInput.focus();
};

const closeChat = () => {
  chatWindow.classList.remove("open");
};

/* ---------- Safe Event Listeners ---------- */

if (chatFab)      chatFab.addEventListener("click", openChat);
if (heroChatBtn)  heroChatBtn.addEventListener("click", openChat);
if (chatClose)    chatClose.addEventListener("click", closeChat);


/* ---------- Message Rendering ---------- */

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


/* ---------- Chat Logic ---------- */

const sendMessage = async () => {
  const text = chatInput.value.trim();
  if (!text || sendBtn.disabled) return;

  // Add user message
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

    const data  = await response.json();
    const reply = data.reply || "Sorry, I couldn't generate a response.";

    removeTyping();
    addMessage(reply, "bot");

    conversation.push({ role: "assistant", content: reply });

  } catch (err) {
    removeTyping();
    addMessage("Sorry, something went wrong. Please try again.", "bot");
  } finally {
    sendBtn.disabled = false;
  }
};

/* ---------- Chat Input Events ---------- */

if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (chatInput) {
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}


/* =====================================================
   HOME PAGE - PRODUCT SLIDER
===================================================== */

const sliderTrack = document.getElementById("productSliderTrack");
const slides      = document.querySelectorAll(".product-slide");
const dots        = document.querySelectorAll(".slider-dot");
const prevBtn     = document.getElementById("sliderPrev");
const nextBtn     = document.getElementById("sliderNext");

let currentSlide = 0;
let slideInterval;

/* ---------- Slider Helpers ---------- */

const updateDots = (index) => {
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
};

const showSlide = (index) => {
  if (!sliderTrack || !slides.length) return;

  sliderTrack.style.transform = `translateX(-${index * 100}%)`;
  currentSlide = index;

  updateDots(index);
};

const nextSlide = () => {
  showSlide((currentSlide + 1) % slides.length);
};

const prevSlide = () => {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
};

const startSlider = () => {
  if (slides.length > 1) {
    slideInterval = setInterval(nextSlide, 6000);
  }
};

const resetSliderInterval = () => {
  clearInterval(slideInterval);
  startSlider();
};


/* ---------- Slider Init ---------- */

if (sliderTrack && slides.length && dots.length) {
  showSlide(0);
  startSlider();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetSliderInterval();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetSliderInterval();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetSliderInterval();
    });
  });
}


/* =====================================================
   PRODUCT PAGE - CARD SWITCHING
===================================================== */

document.querySelectorAll(".tab-panel").forEach(panel => {
  const cards   = panel.querySelectorAll(".product-card");
  const details = panel.querySelectorAll(".product-detail");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const targetId = card.getAttribute("data-product");

      // Reset
      cards.forEach(c => c.classList.remove("active"));
      details.forEach(d => d.classList.remove("active"));

      // Activate
      card.classList.add("active");
      panel.querySelector(`#${targetId}`).classList.add("active");

      // Scroll into view
      panel.querySelector(`#${targetId}`)
        .scrollIntoView({ behavior: "smooth" });
    });
  });
});


/* =====================================================
   FOOTER - DYNAMIC YEAR
===================================================== */

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}
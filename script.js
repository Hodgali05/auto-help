const TELEGRAM_USERNAME = "uyxix";
const WHATSAPP_PHONE = "79993100540";

const requestForm = document.querySelector(".request-form");
const feedback = document.querySelector(".form-feedback");
const telegramLink = document.querySelector(".telegram-link");
const whatsappLink = document.querySelector(".whatsapp-link");
const phoneLink = document.querySelector(".phone-link");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const serviceField = document.querySelector("#service");
const tariffButtons = document.querySelectorAll(".tariff-select");

document.querySelector("#current-year").textContent = new Date().getFullYear();

function getRequestMessage() {
  const formData = new FormData(requestForm);
  const service = formData.get("service").toString().trim();
  const name = formData.get("name").toString().trim();
  const vehicle = formData.get("vehicle").toString().trim();
  const problem = formData.get("problem").toString().trim();
  return [
    "Здравствуйте! Хочу проконсультироваться по автомобилю.",
    service ? `Услуга: ${service}` : "",
    `Имя: ${name}`,
    vehicle ? `Автомобиль: ${vehicle}` : "",
    `Ситуация: ${problem}`
  ].filter(Boolean).join("\n");
}

function updateContactLinks(message) {
  const encodedMessage = encodeURIComponent(message);
  telegramLink.href = `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
  whatsappLink.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

tariffButtons.forEach((button) => {
  button.addEventListener("click", () => {
    serviceField.value = button.dataset.service;
    feedback.textContent = `Выбрана услуга «${serviceField.value}». Заполните заявку — название тарифа добавится в сообщение.`;
    requestForm.scrollIntoView({ behavior: "smooth", block: "center" });
    serviceField.focus({ preventScroll: true });
  });
});

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requestForm.reportValidity()) return;

  updateContactLinks(getRequestMessage());
  feedback.textContent = "Сообщение подготовлено. Выберите Telegram или WhatsApp — текст будет добавлен автоматически.";
  document.querySelector(".contact-options").scrollIntoView({ behavior: "smooth", block: "nearest" });
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Открыть меню" : "Закрыть меню");
  mainNav.classList.toggle("is-open", !isExpanded);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
  }
});

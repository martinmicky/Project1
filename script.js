const form = document.querySelector("#qr-form");
const input = document.querySelector("#url-input");
const output = document.querySelector("#qr-output");
const downloadButton = document.querySelector("#download-button");
const clearButton = document.querySelector("#clear-button");
const message = document.querySelector("#field-message");
const caption = document.querySelector("#preview-caption");

function normalizedUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function setInputState() {
  clearButton.classList.toggle("visible", input.value.length > 0);
  message.textContent = "";
}

function generateCode(event) {
  event.preventDefault();
  const url = normalizedUrl(input.value);

  if (!url) {
    message.textContent = "Add a link first — even a tiny one.";
    input.focus();
    return;
  }

  try {
    new URL(url);
  } catch {
    message.textContent = "That link looks a little off. Try including a domain.";
    input.focus();
    return;
  }

  input.value = url;
  output.innerHTML = "";
  new QRCode(output, {
    text: url,
    width: 218,
    height: 218,
    colorDark: "#232329",
    colorLight: "#fbfbf9",
    correctLevel: QRCode.CorrectLevel.M,
  });
  caption.textContent = "Ready to be scanned and sent into the world.";
  downloadButton.disabled = false;
}

form.addEventListener("submit", generateCode);
input.addEventListener("input", setInputState);

clearButton.addEventListener("click", () => {
  input.value = "";
  output.innerHTML = '<div class="empty-qr"><div class="empty-icon">✦</div><p>Your QR code<br />will appear here</p></div>';
  caption.textContent = "Waiting for a link to weave its way in.";
  downloadButton.disabled = true;
  setInputState();
  input.focus();
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.example;
    setInputState();
    generateCode(new Event("submit"));
  });
});

downloadButton.addEventListener("click", () => {
  const canvas = output.querySelector("canvas");
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = "linkloom-qr.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

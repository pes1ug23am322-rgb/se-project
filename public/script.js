// DARK MODE TOGGLE
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// CONVERTER LOGIC
const convertBtn = document.getElementById("convertBtn");
const urlInput = document.getElementById("urlInput");
const statusText = document.getElementById("statusText");
const downloadLink = document.getElementById("downloadLink");

convertBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) {
    statusText.textContent = "Please enter a URL.";
    return;
  }

  statusText.textContent = "Converting...";
  downloadLink.style.display = "none";

  try {
    const res = await fetch("/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!data.ok) {
      statusText.textContent = "Conversion failed.";
      return;
    }

    statusText.textContent = "Success! PDF ready.";
    downloadLink.href = `/download.pdf?url=${encodeURIComponent(url)}`;
    downloadLink.style.display = "block";

  } catch (err) {
    console.error(err);
    statusText.textContent = "Error converting blog.";
  }
});

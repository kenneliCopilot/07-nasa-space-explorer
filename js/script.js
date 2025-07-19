// 初始化日期选择器
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
setupDateInputs(startInput, endInput);

// 元素引用
const gallery = document.getElementById('gallery');
const button = document.querySelector('button');

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalExplanation = document.getElementById("modal-explanation");
const modalClose = document.getElementById("modal-close");

// 你的 NASA API Key
const API_KEY = "7NEWjrJipEjsOOX3VE09EuMstEiYFeDrp9CgaCK2";
const API_URL = "https://api.nasa.gov/planetary/apod";

const facts = [
  "Did you know? The Sun accounts for 99.86% of the mass in the Solar System.",
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? Neutron stars can spin up to 600 times per second.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Jupiter has at least 95 confirmed moons.",
  "Did you know? Saturn’s rings are made of billions of pieces of ice and rock.",
  "Did you know? Light from the Sun takes about 8 minutes to reach Earth.",
  "Did you know? The Milky Way is on a collision course with the Andromeda Galaxy.",
  "Did you know? The footprints on the Moon could last millions of years.",
  "Did you know? Space is completely silent—there’s no air to carry sound."
];




function displayRandomFact() {
  const randomFact = facts[Math.floor(Math.random() * facts.length)];

  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔭</div>
      <p>Select a date range and click "Get Space Images" to explore the cosmos!</p>
    </div>
    <div class="fact-card">
      <h3>💡 Did You Know?</h3>
      <p>${randomFact}</p>
    </div>
  `;
}
displayRandomFact();

// 点击按钮事件
button.addEventListener("click", () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // 显示加载提示
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>🔄 Loading space photos…</p>
    </div>
  `;

  const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    })
    .then((data) => {
      const sorted = data
        .filter(item => item.media_type === "image")
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      renderGallery(sorted);
    })
    .catch((error) => {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">❌</div>
          <p>Failed to load space images. Please try again later.</p>
        </div>
      `;
      console.error("Error fetching data:", error);
    });
});

// 渲染图片画廊
function renderGallery(items) {
  if (items.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔍</div>
        <p>No image results for this range. Try a different date.</p>
      </div>
    `;
    return;
  }

  gallery.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-item";

    card.innerHTML = `
      <img src="${item.url}" alt="${item.title}">
      <p class="title">${item.title}</p>
      <p class="date">${formatDate(item.date)}</p>
    `;

    // 点击打开 modal
    card.addEventListener("click", () => {
      openModal(item);
    });

    gallery.appendChild(card);
  });
}

// 打开模态窗口
function openModal(item) {
  modalImg.src = item.hdurl || item.url;
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = formatDate(item.date);
  modalExplanation.textContent = item.explanation;
  modal.classList.remove("hidden");
}

// 关闭模态窗口
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 日期格式化：2025-07-19 → July 19, 2025
function formatDate(isoStr) {
  const date = new Date(isoStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

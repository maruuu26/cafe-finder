// saved.js

const savedListEl = document.getElementById("saved-list");
const savedEmptyEl = document.getElementById("saved-empty");

function getSavedCafes() {
  try {
    const raw = window.localStorage.getItem("savedCafes");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse saved cafes", e);
    return [];
  }
}

function setSavedCafes(cafes) {
  window.localStorage.setItem("savedCafes", JSON.stringify(cafes));
}

function removeCafe(idOrName) {
  const cafes = getSavedCafes().filter(
    (c) => c.id !== idOrName && c.name !== idOrName
  );
  setSavedCafes(cafes);
  renderSaved();
}

function renderSaved() {
  const cafes = getSavedCafes();
  savedListEl.innerHTML = "";

  if (!cafes.length) {
    savedEmptyEl.hidden = false;
    return;
  }

  savedEmptyEl.hidden = true;

  cafes.forEach((cafe) => {
    const item = document.createElement("article");
    item.className = "saved-item";

    const header = document.createElement("div");
    header.className = "saved-item-header";

    const title = document.createElement("h2");
    title.textContent = cafe.name;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = cafe.category || "Café";

    header.appendChild(title);
    header.appendChild(tag);

    const address = document.createElement("p");
    address.className = "muted";
    address.textContent = cafe.address || "Address not available";

    const actions = document.createElement("div");
    actions.className = "saved-item-actions";

    const mapLink = document.createElement("a");
    mapLink.className = "secondary-btn";
    mapLink.textContent = "Open in Maps";
    mapLink.target = "_blank";
    mapLink.rel = "noopener";
    const q = encodeURIComponent(cafe.address || cafe.name);
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${q}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeCafe(cafe.id || cafe.name);
    });

    actions.appendChild(mapLink);
    actions.appendChild(removeBtn);

    item.appendChild(header);
    item.appendChild(address);
    item.appendChild(actions);

    savedListEl.appendChild(item);
  });
}

// init
renderSaved();

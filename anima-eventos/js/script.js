// ============ CONFIG ============
const CATALOG_LABELS = {
  "decoracao": "Decoração",
  "carreta-furacao": "Personagens da Carreta Furacão",
  "pelucias": "Pelúcias",
  "robos": "Robôs",
};

// ============ BUILD CATALOG GRIDS ============
function buildCatalogGrids() {
  const grids = document.querySelectorAll(".catalog__grid[data-catalog]");
  grids.forEach((grid) => {
    const catalog = grid.dataset.catalog;
    const count = Number(grid.dataset.count || 6);
    for (let i = 1; i <= count; i++) {
      grid.appendChild(buildPhotoNode(catalog, i));
    }
  });
}

function buildPhotoNode(catalog, index) {
  const img = document.createElement("img");
  img.src = `assets/images/${catalog}/${index}.jpg`;
  img.alt = `${CATALOG_LABELS[catalog] || catalog} - foto ${index}`;
  img.loading = "lazy";
  img.dataset.catalog = catalog;
  img.dataset.index = String(index);

  img.addEventListener("click", () => openLightbox(img.src, img.alt));

  img.addEventListener(
    "error",
    () => {
      const placeholder = document.createElement("div");
      placeholder.className = "ph-card";
      placeholder.innerHTML = `
        <span class="ph-card__icon">📷</span>
        <span class="ph-card__label">Foto ${index}</span>
        <span class="ph-card__sub">Aguardando imagem</span>
      `;
      img.replaceWith(placeholder);
    },
    { once: true },
  );

  return img;
}

// ============ GALERIA (mosaico misturando os catálogos) ============
function buildGaleria() {
  const galeriaGrid = document.getElementById("galeriaGrid");
  if (!galeriaGrid) return;

  const order = [];
  ["decoracao", "carreta-furacao", "pelucias", "robos"].forEach((catalog) => {
    for (let i = 1; i <= 6; i++) order.push({ catalog, i });
  });

  order.forEach(({ catalog, i }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "galeria__item";
    wrapper.appendChild(buildPhotoNode(catalog, i));
    galeriaGrid.appendChild(wrapper);
  });
}

// ============ LIGHTBOX ============
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  lightboxContent.innerHTML = "";
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  lightboxContent.appendChild(img);
  lightbox.classList.add("is-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightboxContent.innerHTML = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ============ MOBILE MENU ============
const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");

burgerBtn?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  burgerBtn.classList.toggle("is-open", isOpen);
  burgerBtn.setAttribute("aria-expanded", String(isOpen));
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    burgerBtn?.classList.remove("is-open");
  });
});

// ============ NAVBAR SCROLL STATE ============
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 20);
});

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ============ FOOTER YEAR ============
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ============ INIT ============
buildCatalogGrids();
buildGaleria();

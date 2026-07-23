// ============ CATALOG PHOTO GRIDS ============
function buildPhotoGrids() {
  document.querySelectorAll(".photo-grid[data-catalog]").forEach((grid) => {
    const catalog = grid.dataset.catalog;
    const count = Number(grid.dataset.count || 6);
    const captions = (grid.dataset.captions || "").split("|");

    for (let i = 1; i <= count; i++) {
      const caption = captions[i - 1] || "";
      grid.appendChild(buildPhotoCard(`assets/images/${catalog}/${i}.jpg`, caption));
    }
  });
}

function buildPhotoCard(src, caption) {
  const card = document.createElement("div");
  card.className = "carousel-card";

  const img = document.createElement("img");
  img.src = src;
  img.alt = caption || "Foto da Anima Eventos";
  img.loading = "lazy";
  card.appendChild(img);

  if (caption) {
    const cap = document.createElement("span");
    cap.className = "photo-caption";
    cap.textContent = caption;
    card.appendChild(cap);
  }

  card.addEventListener("click", () => openLightbox(src, caption));
  return card;
}

// ============ GALERIA CAROUSEL ============
const GALERIA_CAPTIONS = [
  "Plataforma 360° agitando a resenha",
  "Dupla animando ação social",
  "Mickey e Minnie com a aniversariante",
  "Robôs de LED com os convidados",
  "Máscara, noiva e Chucky no clima da festa",
  "Homem-Aranha e a turma animando o aniversário de 3 aninhos",
  "Máscara e Chucky agitando a pista",
  "Debutante em piso de LED estrelado",
];

function buildCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  GALERIA_CAPTIONS.forEach((caption, idx) => {
    track.appendChild(buildPhotoCard(`assets/images/galeria/${idx + 1}.jpg`, caption));
  });

  const prevBtn = document.getElementById("carPrev");
  const nextBtn = document.getElementById("carNext");
  const scrollAmount = () => track.querySelector(".carousel-card")?.offsetWidth + 20 || 340;

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });
  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  function updateNavState() {
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    prevBtn?.classList.toggle("carousel__btn--active", !atStart);
    nextBtn?.classList.toggle("carousel__btn--active", !atEnd);
  }
  track.addEventListener("scroll", updateNavState);
  updateNavState();
}

// ============ LIGHTBOX ============
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  lightboxContent.innerHTML = "";
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt || "";
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
  burgerBtn.setAttribute("aria-expanded", String(isOpen));
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("is-open"));
});

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ============ FOOTER YEAR ============
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ============ INIT ============
buildPhotoGrids();
buildCarousel();

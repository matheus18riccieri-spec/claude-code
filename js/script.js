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
  "Máscara, noiva e Fofão no clima da festa",
  "Homem-Aranha e a turma animando o aniversário de 3 aninhos",
  "Máscara e Fofão agitando a pista",
  "Debutante em piso de LED estrelado",
];

function buildCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  // Three copies (clone + real + clone) so the track can loop infinitely:
  // when scroll drifts into a clone set, we silently snap back to the
  // equivalent spot in the real (middle) set.
  for (let rep = 0; rep < 3; rep++) {
    GALERIA_CAPTIONS.forEach((caption, idx) => {
      track.appendChild(buildPhotoCard(`assets/images/galeria/${idx + 1}.jpg`, caption));
    });
  }

  const prevBtn = document.getElementById("carPrev");
  const nextBtn = document.getElementById("carNext");

  let setWidth = 0;
  function measure() {
    setWidth = track.scrollWidth / 3;
  }
  measure();
  track.scrollLeft = setWidth;

  function scrollAmount() {
    const first = track.querySelector(".carousel-card");
    return (first?.offsetWidth || 320) + 20;
  }

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });
  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  let tick = null;
  track.addEventListener("scroll", () => {
    if (tick) return;
    tick = requestAnimationFrame(() => {
      tick = null;
      if (setWidth <= 0) return;
      if (track.scrollLeft < setWidth * 0.5) {
        track.scrollLeft += setWidth;
      } else if (track.scrollLeft > setWidth * 1.5) {
        track.scrollLeft -= setWidth;
      }
    });
  });

  window.addEventListener("resize", () => {
    const ratio = setWidth > 0 ? track.scrollLeft / setWidth : 1;
    measure();
    track.scrollLeft = setWidth * ratio;
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

// ============ WORD-BY-WORD HEADING REVEAL ============
function wrapWordsForAnimation(el) {
  el.classList.add("words-trigger");
  let wordIndex = 0;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((chunk) => {
        if (!chunk.trim()) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        const span = document.createElement("span");
        span.className = "word-pop";
        span.style.setProperty("--word-i", String(wordIndex));
        span.textContent = chunk;
        frag.appendChild(span);
        wordIndex++;
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(processNode);
    }
  }

  Array.from(el.childNodes).forEach(processNode);
}

function setupWordReveal() {
  const targets = document.querySelectorAll(".h2, .hero__title");
  if (!targets.length) return;

  targets.forEach((el) => wrapWordsForAnimation(el));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("words-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  targets.forEach((el) => observer.observe(el));

  // Safety net: if for any reason the observer never fires for a
  // heading (e.g. it's already been scrolled past on load), reveal it
  // anyway after a short delay so text is never stuck without the class.
  setTimeout(() => {
    targets.forEach((el) => el.classList.add("words-in"));
  }, 2500);
}

// ============ SECTION SCROLL ANIMATION ============
function setupSectionReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          // Leaving the viewport resets it, so scrolling back down
          // triggers the fade-up again — keeps the page feeling alive.
          entry.target.classList.remove("in-view");
        }
      });
    },
    { threshold: 0.12 },
  );
  targets.forEach((el) => observer.observe(el));
}

// ============ REVIEW FORM ============
function setupReviewForm() {
  const form = document.getElementById("reviewForm");
  if (!form) return;

  const stars = Array.from(document.querySelectorAll("#starRating .star"));
  const notaInput = document.getElementById("notaInput");

  function paintStars(value) {
    stars.forEach((star) => {
      star.classList.toggle("is-active", Number(star.dataset.value) <= value);
    });
  }
  paintStars(5);

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.value);
      notaInput.value = String(value);
      paintStars(value);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const evento = form.evento.value.trim();
    const nota = Number(notaInput.value);
    const depoimento = form.depoimento.value.trim();
    const starsText = "★".repeat(nota) + "☆".repeat(5 - nota);

    const lines = [
      "Novo depoimento pelo site da Anima Eventos:",
      `Nome: ${nome}`,
      evento ? `Evento: ${evento}` : null,
      `Nota: ${starsText} (${nota}/5)`,
      `Depoimento: ${depoimento}`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/5567991041770?text=${message}`, "_blank", "noopener");
    form.reset();
    paintStars(5);
  });
}

// ============ FOOTER YEAR ============
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ============ INIT ============
buildPhotoGrids();
buildCarousel();
setupWordReveal();
setupSectionReveal();
setupReviewForm();
